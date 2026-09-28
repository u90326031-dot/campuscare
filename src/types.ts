export type Role = 'student' | 'admin' | 'staff' | 'developer';

export interface AuthUser {
  uid: string;
  email: string;
  role: Role;
  rollNo?: string;
  staffId?: string;
  displayName?: string;
  createdAt?: string;
}

export interface RegisteredUser {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  rollNo?: string | null;
  staffId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type AcademicBranch =
  | 'Computer Science & Engineering'
  | 'Electronics & Communication'
  | 'Electrical & Electronics'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Information Technology'
  | 'Artificial Intelligence & Data Science';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type AcademicSemester = 'Semester 1' | 'Semester 2' | 'Semester 3' | 'Semester 4' | 'Semester 5' | 'Semester 6' | 'Semester 7' | 'Semester 8';
export type AcademicSection = 'Section A' | 'Section B' | 'Section C' | 'Section D';

export type HostelBlock = 'Block A' | 'Block B' | 'Block C' | 'Block D';

export type ComplaintType = 'college' | 'hostel';

export type ComplaintCategory =
  | 'Laboratory Equipment'
  | 'Classroom & Labs'
  | 'Electrical'
  | 'Wi-Fi & Network'
  | 'Water Supply'
  | 'Washroom'
  | 'Cleaning'
  | 'Mess Hall'
  | 'Room Maintenance'
  | 'Furniture'
  | 'Security'
  | 'Library'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Verification'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Student Confirmation'
  | 'Rejected';

export interface TimelineEvent {
  status: ComplaintStatus;
  action?: string;
  title: string;
  timestamp: string;
  user?: string;
  actor: string;
  note?: string;
  proofUrl?: string;
}

export interface AISuggestion {
  category: string;
  priority: ComplaintPriority;
  summary: string;
  suggestedDepartment: string;
  affectedGroup: string;
  keywords: string[];
  confidence: 'High' | 'Medium' | 'Low' | 'Needs Review' | 'Needs manual review' | string;
  confidenceScore: number;
  possibleCause?: string;
  needsReview: boolean;
}

export interface Complaint {
  id: string; // e.g. CC-1042
  title: string;
  studentName: string;
  studentId: string; // e.g. CC-2022-CSE-042
  rollNo: string; // e.g. 22BCSE042
  branch: AcademicBranch;
  year: AcademicYear;
  semester: AcademicSemester;
  section: AcademicSection;
  type: ComplaintType;

  // College separation hierarchy: Building -> Floor -> Room/Lab
  collegeBuilding?: string;
  collegeFloor?: string;
  collegeRoom?: string;

  // Hostel separation hierarchy: Hostel -> Block -> Floor -> Room
  hostelBlock?: HostelBlock;
  hostelFloor?: string;
  hostelRoom?: string;

  category: ComplaintCategory;
  location: string;
  description: string;
  attachments?: string[];
  affectedGroup: string;
  affectedStudentCount: number;
  supportedStudentIds: string[]; // student roll numbers who supported
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedDepartment: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  targetSla?: string;
  timeline: TimelineEvent[];
  staffNotes?: string;
  resolutionProof?: string;
  reopenReason?: string;
  reopenedCount?: number;
  aiAnalysis?: AISuggestion;
}

export interface StudentProfile {
  studentName: string;
  studentId: string;
  rollNo: string;
  email: string;
  branch: AcademicBranch;
  year: AcademicYear;
  semester: AcademicSemester;
  section: AcademicSection;
  isHostelResident: boolean;
  hostelBlock?: HostelBlock;
  hostelFloor?: string;
  hostelRoom?: string;
  avatar?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  avatar: string;
  activeTasks: number;
}

export interface Suggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  authorName: string;
  authorBranch: string;
  upvotes: number;
  upvotedBy: string[];
  status: 'Open' | 'Under Review' | 'Accepted' | 'Implemented';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'status_change' | 'reopened' | 'assigned' | 'resolved' | 'radar_alert' | 'supported';
  complaintId?: string;
  read: boolean;
  createdAt: string;
}

export interface HostelServiceStatus {
  service: 'Water Supply' | 'Electricity' | 'Wi-Fi Network' | 'Cleaning' | 'Mess Hall' | 'Washroom';
  status: 'Operational' | 'Degraded' | 'Outage' | 'Scheduled';
  note?: string;
  updatedAt: string;
}

export interface ProblemRadarItem {
  id: string;
  title: string;
  problem: string;
  location: string;
  category: ComplaintCategory;
  branch?: string;
  year?: string;
  hostelBlock?: string;
  complaintCount: number;
  affectedStudentCount: number;
  timeWindow: string; // e.g. "Last 7 days"
  priority: ComplaintPriority;
  trend: string; // e.g. "Increasing (+3 this week)", "Recurring hotspot", "Surging"
  recommendation: string;
  complaintIds: string[];
}
