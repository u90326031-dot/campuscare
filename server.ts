import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { initializeApp as initAdminApp, getApps as getAdminApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config
let firebaseConfig: any = {};
try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.warn('Could not read firebase-applet-config.json:', err);
}

// Initialize Firebase Admin SDK
let adminAuth: any = null;
try {
  const adminApp = !getAdminApps().length
    ? initAdminApp({ projectId: firebaseConfig.projectId })
    : getAdminApps()[0];
  adminAuth = getAdminAuth(adminApp);
} catch (err) {
  console.warn('Firebase Admin SDK initialization notice:', err);
}

// Track if service account signing capability is available in this environment
let isCustomTokenSupported: boolean | null = null;

async function tryGenerateCustomToken(uid: string): Promise<string | null> {
  // If we already detected that the environment lacks signBlob permissions, skip to avoid slow network timeouts and log spam
  if (isCustomTokenSupported === false || !adminAuth) {
    return null;
  }

  try {
    const token = await adminAuth.createCustomToken(uid);
    isCustomTokenSupported = true;
    return token;
  } catch (err: any) {
    // Check if error is due to missing IAM signBlob permission in this sandbox environment
    if (
      err?.code === 'auth/insufficient-permission' ||
      err?.message?.includes('signBlob') ||
      err?.message?.includes('iam.serviceAccounts')
    ) {
      isCustomTokenSupported = false;
      // Do not log signBlob warnings to console; environment operates seamlessly via auth bridging
      return null;
    }
    console.warn('[Firebase Admin] Custom token generation notice:', err?.message || err);
    return null;
  }
}

// Password hashing helper (PBKDF2 with unique per-user random salt)
function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

// Cryptographic server-signed session token for real server-side authentication
const SESSION_SECRET = process.env.SESSION_SECRET || 'campuscare_secure_session_secret_2026';

interface SessionPayload {
  uid: string;
  role: string;
  email: string;
  exp: number;
}

function createSessionToken(user: { uid: string; role: string; email: string }): string {
  const payload: SessionPayload = {
    uid: user.uid,
    role: user.role,
    email: user.email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getSessionFromReq(req: express.Request): SessionPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  return verifySessionToken(token);
}

// Persistent server-authoritative user store
const USERS_STORE_PATH = path.resolve(__dirname, 'users-store.json');

function loadUsersStore(): Record<string, any> {
  try {
    if (fs.existsSync(USERS_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(USERS_STORE_PATH, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not read users-store.json:', err);
  }
  return {};
}

function saveUsersStore(store: Record<string, any>) {
  try {
    fs.writeFileSync(USERS_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write users-store.json:', err);
  }
}

// Seed server-authoritative accounts on startup (with per-user unique salt and no plaintext passwords stored)
async function seedDefaultAccounts() {
  const defaultAccounts = [
    {
      uid: 'dev-campuscare-001',
      email: 'developer@campuscare.edu',
      password: 'Developer@123',
      role: 'developer',
      displayName: 'CampusCare Lead Developer',
      rollNo: null,
      staffId: null,
    },
    {
      uid: 'admin-campuscare-001',
      email: 'admin@campuscare.edu',
      password: 'Admin@123',
      role: 'admin',
      displayName: 'Campus Administrator',
      rollNo: null,
      staffId: null,
    },
    {
      uid: 'student-22bcse042',
      email: 'student@campuscare.edu',
      password: 'Student@123',
      role: 'student',
      displayName: 'Aarav Sharma',
      rollNo: '22BCSE042',
      staffId: null,
    },
    {
      uid: 'staff-tech-001',
      email: 'staff@campuscare.edu',
      password: 'Staff@123',
      role: 'staff',
      displayName: 'Rajesh Kumar',
      rollNo: null,
      staffId: 'staff-1',
    },
  ];

  const store = loadUsersStore();
  let updated = false;

  for (const acc of defaultAccounts) {
    const existing = store[acc.uid];
    if (!existing || existing.temporaryPassword || !existing.salt) {
      const salt = generateSalt();
      const passwordHash = hashPassword(acc.password, salt);
      store[acc.uid] = {
        uid: acc.uid,
        email: acc.email.toLowerCase(),
        role: acc.role,
        displayName: acc.displayName,
        rollNo: acc.rollNo,
        staffId: acc.staffId,
        passwordHash,
        salt,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = true;
    }
  }

  if (updated) {
    saveUsersStore(store);
    console.log('[Auth Seed] Seeded & secured accounts in server store with unique per-user salts');
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Vercel API function compatibility: when the function is invoked through
// /api/index, normalize the path so the existing /api/* routes continue to match.
if (process.env.VERCEL === '1') {
  app.use((req, _res, next) => {
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
    next();
  });
}


// Initialize GoogleGenAI server-side with User-Agent header for telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route for Gemini Complaint Analysis
app.post('/api/gemini/analyze-complaint', async (req, res) => {
  try {
    const {
      description,
      type,
      location,
      branch,
      year,
      semester,
      section,
      category,
      hostelBlock,
    } = req.body || {};

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        error: 'Please describe the problem first.',
      });
    }

    if (!ai) {
      console.warn('GEMINI_API_KEY not configured on server.');
      return res.status(503).json({
        error: 'AI analysis is temporarily unavailable. You can submit the complaint manually.',
      });
    }

    const trimmedDescription = description.trim();

    const prompt = `Student Complaint Description:
"""
${trimmedDescription}
"""

Context Details:
- Problem Domain: ${type === 'hostel' ? 'Hostel Grievance' : 'College Academic Problem'}
- Location: ${location || 'Unspecified'}
- Student Branch: ${branch || 'N/A'}
- Academic Year: ${year || 'N/A'}
- Semester: ${semester || 'N/A'}
- Section: ${section || 'N/A'}
${type === 'hostel' && hostelBlock ? `- Hostel Block: ${hostelBlock}` : ''}
${category ? `- Selected Category: ${category}` : ''}

Analyze strictly based on the text provided. Output the required JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are the CampusCare AI Grievance Triage engine for engineering college campuses and student hostels.
Analyze the student complaint description and provided context, then return a factual, structured analysis.

CRITICAL RULES:
1. Do not invent facts. Only use details directly mentioned in the student's text and provided context.
2. Do not claim a cause is confirmed unless the complaint explicitly provides clear direct evidence.
3. When the cause is only an inference or unclear, treat it as a "possible cause".
4. If there is not enough information in the complaint to determine why the issue happened, return "possibleCause": "Insufficient information".
5. Confidence must be an integer between 0 and 100 representing how confident you are in this categorization and triage based strictly on the text clarity.
6. If confidence is low (< 70) or the description is very vague/ambiguous, the confidence score should be low and reflect that.
7. Allowed priority levels: "Low", "Medium", "High", "Critical".
8. Standard categories for College: "Laboratory Equipment", "Classroom & Labs", "Electrical", "Wi-Fi & Network", "Water Supply", "Washroom", "Cleaning", "Furniture", "Library", "Security", "Other".
9. Standard categories for Hostel: "Water Supply", "Electrical", "Wi-Fi & Network", "Cleaning", "Mess Hall", "Washroom", "Room Maintenance", "Furniture", "Security", "Other".
10. Do not refer to or assume any prior complaints. Analyze only this single current complaint.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'Best matching complaint category',
            },
            priority: {
              type: Type.STRING,
              description: 'One of Low, Medium, High, Critical',
            },
            summary: {
              type: Type.STRING,
              description: 'Concise professional summary of what is broken and its urgency',
            },
            suggestedDepartment: {
              type: Type.STRING,
              description: 'College or hostel department to handle this grievance',
            },
            affectedGroup: {
              type: Type.STRING,
              description: 'Students or cohort affected by this issue (e.g. CSE students, Block C Residents)',
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 key terms from the complaint',
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence score from 0 to 100',
            },
            possibleCause: {
              type: Type.STRING,
              description: 'Possible cause of the issue, or "Insufficient information" if not clearly stated',
            },
          },
          required: [
            'category',
            'priority',
            'summary',
            'suggestedDepartment',
            'affectedGroup',
            'keywords',
            'confidence',
            'possibleCause',
          ],
        },
        temperature: 0.1,
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(responseText);

    const confidenceScore = typeof parsed.confidence === 'number'
      ? Math.max(0, Math.min(100, Math.round(parsed.confidence)))
      : 85;

    let confidenceLabel: 'High' | 'Medium' | 'Low' | 'Needs manual review' = 'High';
    if (confidenceScore < 70) {
      confidenceLabel = 'Needs manual review';
    } else if (confidenceScore < 85) {
      confidenceLabel = 'Medium';
    } else {
      confidenceLabel = 'High';
    }

    // Standardize priority
    let normalizedPriority = 'Medium';
    const prioUpper = String(parsed.priority || '').toUpperCase();
    if (prioUpper.includes('CRIT')) normalizedPriority = 'Critical';
    else if (prioUpper.includes('HIGH')) normalizedPriority = 'High';
    else if (prioUpper.includes('LOW')) normalizedPriority = 'Low';

    const possibleCause =
      parsed.possibleCause && parsed.possibleCause.trim()
        ? parsed.possibleCause.trim()
        : 'Insufficient information';

    const result = {
      category: parsed.category || (type === 'hostel' ? 'Wi-Fi & Network' : 'Classroom & Labs'),
      priority: normalizedPriority,
      summary: parsed.summary || trimmedDescription,
      suggestedDepartment: parsed.suggestedDepartment || (type === 'hostel' ? 'Hostel Warden Office' : 'Campus Maintenance Cell'),
      affectedGroup: parsed.affectedGroup || (branch ? `${branch.split(' ')[0]} students` : 'Campus Students'),
      keywords: Array.isArray(parsed.keywords) && parsed.keywords.length > 0 ? parsed.keywords : ['maintenance', 'campus'],
      confidence: confidenceLabel,
      confidenceScore,
      possibleCause,
      needsReview: confidenceScore < 70 || confidenceLabel === 'Needs manual review',
    };

    return res.json(result);
  } catch (err: any) {
    console.error('Gemini complaint analysis failed:', err);
    return res.status(503).json({
      error: 'AI analysis is temporarily unavailable. You can submit the complaint manually.',
    });
  }
});

// Authentication Endpoints (Server-Authoritative)

// 1. Login with email + password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query server-authoritative store
    const store = loadUsersStore();
    const userEntry = Object.values(store).find(
      (u: any) => u.email && u.email.toLowerCase() === cleanEmail
    ) as any;

    if (!userEntry) {
      return res.status(401).json({ error: 'No account found with this campus email address.' });
    }

    // Verify password hash using user's unique random salt
    const salt = userEntry.salt || 'campuscare_secure_salt_2026';
    let passwordValid = false;
    if (userEntry.passwordHash) {
      passwordValid = verifyPassword(password, userEntry.passwordHash, salt);
    } else if (userEntry.temporaryPassword) {
      passwordValid = password === userEntry.temporaryPassword;
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    const userUid = userEntry.uid;

    // Generate custom token using Firebase Admin SDK if available and supported
    const customToken = await tryGenerateCustomToken(userUid);

    // Generate cryptographically signed session credential for API authorization
    const sessionToken = createSessionToken({
      uid: userUid,
      role: userEntry.role,
      email: userEntry.email,
    });

    // Strictly sanitize response: Never return password, temporaryPassword, salt, or hash
    const safeUser = {
      uid: userUid,
      email: userEntry.email,
      role: userEntry.role,
      displayName: userEntry.displayName || cleanEmail.split('@')[0],
      rollNo: userEntry.rollNo || null,
      staffId: userEntry.staffId || null,
      createdAt: userEntry.createdAt,
    };

    return res.json({
      success: true,
      customToken,
      sessionToken,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Auth login error:', err);
    return res.status(500).json({ error: 'Authentication service error. Please try again.' });
  }
});

// 2. Fetch authenticated user document by UID (Requires valid session proving caller is UID or admin/developer)
app.get('/api/auth/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ error: 'UID is required' });

    // Validate server session credential
    const session = getSessionFromReq(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required. Valid session credential missing.' });
    }

    // Enforce authorization: Requester must be this UID or an admin/developer
    if (session.uid !== uid && session.role !== 'admin' && session.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this user record.' });
    }

    // Validate UID format
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
      return res.status(400).json({ error: 'Invalid UID format.' });
    }

    const store = loadUsersStore();
    if (!Object.prototype.hasOwnProperty.call(store, uid)) {
      return res.status(404).json({ error: 'User document not found' });
    }
    const data = store[uid];

    if (!data) {
      return res.status(404).json({ error: 'User document not found' });
    }

    // Return only safe fields: Never return password, temporaryPassword, salt, or hash
    const safeUser = {
      uid: data.uid,
      email: data.email,
      role: data.role,
      displayName: data.displayName,
      rollNo: data.rollNo || null,
      staffId: data.staffId || null,
      createdAt: data.createdAt,
    };

    return res.json({ success: true, user: safeUser });
  } catch (err: any) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ error: 'Failed to fetch user record' });
  }
});

// 3. Admin creates student or staff account using Firebase Admin SDK
// Requires caller to already be authenticated server-side as an admin (or developer)
app.post('/api/admin/create-user', async (req, res) => {
  try {
    // Validate server session credential and role
    const session = getSessionFromReq(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required. Valid admin session missing.' });
    }
    if (session.role !== 'admin' && session.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: Only authenticated administrators can create accounts.' });
    }

    const { role, email, password, profile } = req.body || {};

    if (!role || !['student', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "student" or "staff".' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in store
    const store = loadUsersStore();
    const existing = Object.values(store).some((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: `An account for ${cleanEmail} already exists.` });
    }

    // Generate strong temporary password if not explicitly supplied
    const tempPassword = password?.trim() || `Campus@${Math.floor(1000 + Math.random() * 9000)}`;

    let authUid = '';

    // Attempt Firebase Admin SDK user creation
    if (adminAuth) {
      try {
        const userRecord = await adminAuth.createUser({
          email: cleanEmail,
          password: tempPassword,
          displayName: profile?.studentName || profile?.name || cleanEmail.split('@')[0],
        });
        authUid = userRecord.uid;
        console.log(`[Firebase Admin] Created Auth user ${cleanEmail} with UID: ${authUid}`);
      } catch (adminErr: any) {
        console.warn(`[Firebase Admin Notice] createUser fallback for ${cleanEmail}:`, adminErr?.message || adminErr);
      }
    }

    // If Admin SDK did not generate UID, generate consistent UID
    if (!authUid) {
      authUid = `${role}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    }

    // Generate unique per-user random salt and compute hash
    const salt = generateSalt();
    const passwordHash = hashPassword(tempPassword, salt);

    const userDocData = {
      uid: authUid,
      email: cleanEmail,
      role: role,
      displayName: profile?.studentName || profile?.name || cleanEmail.split('@')[0],
      rollNo: role === 'student' ? (profile?.rollNo?.trim() || null) : null,
      staffId: role === 'staff' ? (profile?.staffId?.trim() || null) : null,
      passwordHash,
      salt, // stored alongside hash, never in plaintext, never sent to client
      profile: profile || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store[authUid] = userDocData;
    saveUsersStore(store);

    // The temporary password is returned ONCE in this response only so Admin can share it
    return res.status(201).json({
      success: true,
      uid: authUid,
      email: cleanEmail,
      role,
      rollNo: userDocData.rollNo,
      staffId: userDocData.staffId,
      temporaryPassword: tempPassword,
      message: `Account created successfully with temporary password: ${tempPassword}`,
    });
  } catch (err: any) {
    console.error('Admin create user error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create user account' });
  }
});

// 4. Admin lists all registered users in the institutional directory
app.get('/api/admin/users', async (req, res) => {
  try {
    const session = getSessionFromReq(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required. Valid admin session missing.' });
    }
    if (session.role !== 'admin' && session.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: Only administrators can view registered users.' });
    }

    const store = loadUsersStore();
    const usersList = Object.values(store).map((u: any) => ({
      uid: u.uid,
      email: u.email,
      role: u.role,
      displayName: u.displayName || u.email?.split('@')[0],
      rollNo: u.rollNo || null,
      staffId: u.staffId || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt || u.createdAt,
    }));

    // Sort by createdAt descending
    usersList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({ success: true, users: usersList });
  } catch (err: any) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Failed to retrieve registered users' });
  }
});

// 5. Admin updates a registered user's role between 'student', 'staff', and 'admin'
app.patch('/api/admin/users/:uid/role', async (req, res) => {
  try {
    const session = getSessionFromReq(req);
    if (!session) {
      return res.status(401).json({ error: 'Authentication required. Valid admin session missing.' });
    }
    if (session.role !== 'admin' && session.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: Only administrators can update user roles.' });
    }

    const { uid } = req.params;
    const { role } = req.body || {};

    if (!uid || !/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
      return res.status(400).json({ error: 'Valid UID is required.' });
    }

    if (!role || !['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "student", "staff", or "admin".' });
    }

    const store = loadUsersStore();
    if (!Object.prototype.hasOwnProperty.call(store, uid)) {
      return res.status(404).json({ error: 'User not found in system directory.' });
    }

    const user = store[uid];

    // Protect developer superuser account
    if (user.role === 'developer' && session.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: Lead Developer role cannot be modified by standard administrators.' });
    }

    const previousRole = user.role;
    user.role = role;
    user.updatedAt = new Date().toISOString();
    store[uid] = user;
    saveUsersStore(store);

    console.log(`[Admin Role Update] Changed role of ${user.email} (${uid}) from ${previousRole} to ${role} by ${session.email}`);

    const safeUser = {
      uid: user.uid,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      rollNo: user.rollNo || null,
      staffId: user.staffId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({
      success: true,
      user: safeUser,
      message: `User ${user.email} role successfully updated from ${previousRole} to ${role}.`,
    });
  } catch (err: any) {
    console.error('Update role error:', err);
    return res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  // Ensure default server-authoritative accounts are seeded
  try {
    await seedDefaultAccounts();
  } catch (err) {
    console.warn('Startup seed error:', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;

// The local development server still starts normally. On Vercel, the exported
// Express app is invoked as a Vercel Function instead of opening a port.
if (process.env.VERCEL !== '1') {
  startServer();
}
