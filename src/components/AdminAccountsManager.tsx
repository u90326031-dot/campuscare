import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  StudentProfile,
  StaffMember,
  RegisteredUser,
  Role,
  AcademicBranch,
  AcademicYear,
  AcademicSemester,
  AcademicSection,
  HostelBlock
} from '../types';
import { DEPARTMENTS } from '../lib/seedData';
import {
  Users,
  Wrench,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Shield,
  Search,
  Plus,
  X,
  Phone,
  Building,
  Mail,
  Hash,
  RefreshCw,
  Loader2,
  UserCog,
  Key,
  ShieldCheck,
  Check
} from 'lucide-react';

const BRANCHES: AcademicBranch[] = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
];

const YEARS: AcademicYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS: AcademicSemester[] = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];
const SECTIONS: AcademicSection[] = ['Section A', 'Section B', 'Section C', 'Section D'];
const HOSTEL_BLOCKS: HostelBlock[] = ['Block A', 'Block B', 'Block C', 'Block D'];

export const AdminAccountsManager: React.FC = () => {
  const {
    studentProfilesList,
    createStudentProfile,
    deleteStudentProfile,
    switchStudentProfile,
    studentProfile,
    staffList,
    addStaffMember,
    deleteStaffMember,
    currentStaffId,
    setCurrentStaffId,
    complaints,
    fetchAllRegisteredUsers,
    updateRegisteredUserRole,
  } = useApp();

  const [activeAccountTab, setActiveAccountTab] = useState<'users' | 'students' | 'staff'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Registered Users Directory State
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'staff' | 'admin'>('all');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [roleSuccessMessage, setRoleSuccessMessage] = useState<string | null>(null);
  const [roleErrorMessage, setRoleErrorMessage] = useState<string | null>(null);

  const loadRegisteredUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);
    try {
      const users = await fetchAllRegisteredUsers();
      setRegisteredUsers(users);
    } catch (err: any) {
      setUsersError(err.message || 'Failed to load registered users directory.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  const handleRoleChange = async (user: RegisteredUser, newRole: 'student' | 'staff' | 'admin') => {
    if (user.role === newRole) return;
    setUpdatingUid(user.uid);
    setRoleSuccessMessage(null);
    setRoleErrorMessage(null);

    const res = await updateRegisteredUserRole(user.uid, newRole);
    if (res.success) {
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole, updatedAt: new Date().toISOString() } : u))
      );
      setRoleSuccessMessage(
        `Role for ${user.displayName || user.email} successfully updated to ${newRole.toUpperCase()}!`
      );
      setTimeout(() => setRoleSuccessMessage(null), 4500);
    } else {
      setRoleErrorMessage(res.error || `Failed to update role for ${user.email}`);
      setTimeout(() => setRoleErrorMessage(null), 5500);
    }
    setUpdatingUid(null);
  };

  // Student creation form modal
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [stName, setStName] = useState('');
  const [stRollNo, setStRollNo] = useState('');
  const [stId, setStId] = useState('');
  const [stEmail, setStEmail] = useState('');
  const [stBranch, setStBranch] = useState<AcademicBranch>('Computer Science & Engineering');
  const [stYear, setStYear] = useState<AcademicYear>('1st Year');
  const [stSemester, setStSemester] = useState<AcademicSemester>('Semester 1');
  const [stSection, setStSection] = useState<AcademicSection>('Section A');
  const [stIsHostel, setStIsHostel] = useState(false);
  const [stHostelBlock, setStHostelBlock] = useState<HostelBlock>('Block A');
  const [stHostelFloor, setStHostelFloor] = useState('');
  const [stHostelRoom, setStHostelRoom] = useState('');
  const [studentFormError, setStudentFormError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  // Staff creation form modal
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffDept, setStaffDept] = useState(DEPARTMENTS[0]);
  const [staffRoleTitle, setStaffRoleTitle] = useState('Senior Maintenance Technician');
  const [staffPhone, setStaffPhone] = useState('+91 98765 ');
  const [staffFormError, setStaffFormError] = useState<string | null>(null);
  const [staffSuccess, setStaffSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter students
  const filteredStudents = studentProfilesList.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q)
    );
  });

  // Filter staff
  const filteredStaff = staffList.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  });

  // Filter registered users directory
  const filteredRegisteredUsers = registeredUsers.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      u.uid.toLowerCase().includes(q) ||
      (u.rollNo && u.rollNo.toLowerCase().includes(q)) ||
      (u.staffId && u.staffId.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const userStats = {
    total: registeredUsers.length,
    students: registeredUsers.filter((u) => u.role === 'student').length,
    staff: registeredUsers.filter((u) => u.role === 'staff').length,
    admins: registeredUsers.filter((u) => u.role === 'admin').length,
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError(null);
    setIsSubmitting(true);

    try {
      const sessionToken = localStorage.getItem('campuscare_session_token') || '';
      // 1. Create corresponding Firebase Auth user & users/{uid} document via Express server Admin SDK
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          role: 'student',
          email: stEmail.trim(),
          profile: {
            studentName: stName.trim(),
            rollNo: stRollNo.trim(),
            studentId: stId.trim(),
            email: stEmail.trim(),
            branch: stBranch,
            year: stYear,
            semester: stSemester,
            section: stSection,
            isHostelResident: stIsHostel,
            hostelBlock: stIsHostel ? stHostelBlock : undefined,
            hostelFloor: stIsHostel ? stHostelFloor?.trim() : undefined,
            hostelRoom: stIsHostel ? stHostelRoom?.trim() : undefined,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setStudentFormError(data.error || 'Failed to create student account on server.');
        setIsSubmitting(false);
        return;
      }

      // 2. Add to student profile state
      const res = createStudentProfile({
        studentName: stName.trim(),
        studentId: stId.trim(),
        rollNo: stRollNo.trim().toUpperCase(),
        email: stEmail.trim().toLowerCase(),
        branch: stBranch,
        year: stYear,
        semester: stSemester,
        section: stSection,
        isHostelResident: stIsHostel,
        hostelBlock: stIsHostel ? stHostelBlock : undefined,
        hostelFloor: stIsHostel ? stHostelFloor?.trim() : undefined,
        hostelRoom: stIsHostel ? stHostelRoom?.trim() : undefined,
      });

      if (!res.success) {
        setStudentFormError(res.error || 'Account created on server, but failed to load in local list.');
        setIsSubmitting(false);
        return;
      }

      const tempPass = data.temporaryPassword || 'Campus@123';
      setStudentSuccess(
        `Firebase Auth user created for ${stName.trim()} (${stRollNo.trim()})! Temporary Password: ${tempPass}`
      );
      loadRegisteredUsers();

      setStName('');
      setStRollNo('');
      setStId('');
      setStEmail('');
      setStIsHostel(false);
      setStHostelFloor('');
      setStHostelRoom('');
      setTimeout(() => {
        setStudentSuccess(null);
        setShowStudentForm(false);
      }, 4000);
    } catch (err: any) {
      setStudentFormError(err.message || 'Server error while creating student account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffFormError(null);

    if (!staffName.trim()) {
      setStaffFormError('Staff name is required.');
      return;
    }

    if (!staffPhone.trim()) {
      setStaffFormError('Contact phone number is required.');
      return;
    }

    const emailToUse = staffEmail.trim() || `${staffName.trim().toLowerCase().replace(/\s+/g, '.') || 'staff'}@campuscare.edu`;

    setIsSubmitting(true);

    try {
      const sessionToken = localStorage.getItem('campuscare_session_token') || '';
      // 1. Create corresponding Firebase Auth user & users/{uid} document via Express server Admin SDK
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          role: 'staff',
          email: emailToUse,
          profile: {
            name: staffName.trim(),
            department: staffDept,
            role: staffRoleTitle.trim() || 'Technician',
            phone: staffPhone.trim(),
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setStaffFormError(data.error || 'Failed to create staff account on server.');
        setIsSubmitting(false);
        return;
      }

      // 2. Add to staff list
      addStaffMember({
        name: staffName.trim(),
        department: staffDept,
        role: staffRoleTitle.trim() || 'Technician',
        phone: staffPhone.trim(),
        avatar: staffName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
      });

      const tempPass = data.temporaryPassword || 'Campus@123';
      setStaffSuccess(
        `Firebase Auth technician created for ${staffName.trim()} (${emailToUse})! Temporary Password: ${tempPass}`
      );
      loadRegisteredUsers();

      setStaffName('');
      setStaffEmail('');
      setStaffPhone('+91 98765 ');
      setTimeout(() => {
        setStaffSuccess(null);
        setShowStaffForm(false);
      }, 4000);
    } catch (err: any) {
      setStaffFormError(err.message || 'Server error while creating staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Account & Identity Management
              </h2>
              <p className="text-xs text-slate-500">
                Manage registered user directory, access roles, student academic records, and maintenance technicians.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Tab Switcher: Users & Roles vs Students vs Staff */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveAccountTab('users');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeAccountTab === 'users'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCog className="w-4 h-4 text-violet-600" />
            <span>Users & Roles ({registeredUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveAccountTab('students');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeAccountTab === 'students'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Students ({studentProfilesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveAccountTab('staff');
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeAccountTab === 'staff'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Staff Technicians ({staffList.length})</span>
          </button>
        </div>
      </div>

      {/* Action Bar: Search & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeAccountTab === 'users'
                ? 'Search users by name, email, roll no, staff ID, or UID...'
                : activeAccountTab === 'students'
                ? 'Search students by name, roll no, branch...'
                : 'Search staff by name, department, ID...'
            }
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeAccountTab === 'users' && (
            <button
              type="button"
              onClick={loadRegisteredUsers}
              disabled={isLoadingUsers}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="Refresh User Directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-violet-600' : ''}`} />
              <span className="hidden sm:inline">Refresh Directory</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowStudentForm(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStaffForm(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* ALL REGISTERED USERS DIRECTORY VIEW */}
      {activeAccountTab === 'users' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Quick Metric Cards for Directory Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              onClick={() => setUserRoleFilter('all')}
              className={`p-3.5 rounded-2xl border transition cursor-pointer card-interactive ${
                userRoleFilter === 'all'
                  ? 'bg-violet-50/80 dark:bg-violet-950/60 border-violet-400 ring-2 ring-violet-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Directory</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{userStats.total}</div>
              <span className="text-[10px] text-slate-500">All registered institutional accounts</span>
            </div>

            <div
              onClick={() => setUserRoleFilter('student')}
              className={`p-3.5 rounded-2xl border transition cursor-pointer card-interactive ${
                userRoleFilter === 'student'
                  ? 'bg-violet-50/80 dark:bg-violet-950/60 border-violet-400 ring-2 ring-violet-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-violet-500">Students</span>
              <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-0.5">
                {userStats.students}
              </div>
              <span className="text-[10px] text-slate-500">Student accounts</span>
            </div>

            <div
              onClick={() => setUserRoleFilter('staff')}
              className={`p-3.5 rounded-2xl border transition cursor-pointer card-interactive ${
                userRoleFilter === 'staff'
                  ? 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-500">Staff Technicians</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {userStats.staff}
              </div>
              <span className="text-[10px] text-slate-500">Maintenance & repair specialists</span>
            </div>

            <div
              onClick={() => setUserRoleFilter('admin')}
              className={`p-3.5 rounded-2xl border transition cursor-pointer card-interactive ${
                userRoleFilter === 'admin'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-emerald-500">Administrators</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {userStats.admins}
              </div>
              <span className="text-[10px] text-slate-500">Operations & triage authority</span>
            </div>
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter Role:</span>
            <button
              type="button"
              onClick={() => setUserRoleFilter('all')}
              className={`px-3 py-1 rounded-full font-bold text-xs transition cursor-pointer ${
                userRoleFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Roles ({registeredUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('student')}
              className={`px-3 py-1 rounded-full font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                userRoleFilter === 'student'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950'
              }`}
            >
              <span>🎓 Student</span>
              <span className="text-[10px] font-semibold opacity-80">({userStats.students})</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('staff')}
              className={`px-3 py-1 rounded-full font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                userRoleFilter === 'staff'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950'
              }`}
            >
              <span>🔧 Staff</span>
              <span className="text-[10px] font-semibold opacity-80">({userStats.staff})</span>
            </button>
            <button
              type="button"
              onClick={() => setUserRoleFilter('admin')}
              className={`px-3 py-1 rounded-full font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                userRoleFilter === 'admin'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950'
              }`}
            >
              <span>🛡️ Admin</span>
              <span className="text-[10px] font-semibold opacity-80">({userStats.admins})</span>
            </button>
          </div>

          {/* Feedback Banners */}
          {roleSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{roleSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setRoleSuccessMessage(null)}
                className="text-emerald-600 hover:text-emerald-800 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {roleErrorMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in-up">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{roleErrorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setRoleErrorMessage(null)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {usersError && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{usersError}</span>
              </div>
              <button
                type="button"
                onClick={loadRegisteredUsers}
                className="text-amber-700 underline text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Registered Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User Profile</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Associated Identifier</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-right">Update Role (Student / Staff / Admin)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoadingUsers && registeredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                        <span className="font-semibold text-xs">Loading registered users directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegisteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      <div className="text-slate-500 font-semibold mb-1">No users found</div>
                      <div className="text-[11px] text-slate-400">
                        No registered accounts matching &quot;{searchTerm}&quot; under the selected role filter.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegisteredUsers.map((u) => {
                    const isUpdating = updatingUid === u.uid;
                    const isDeveloper = u.role === 'developer';

                    // Avatar badge color
                    const avatarBg =
                      u.role === 'admin'
                        ? 'bg-emerald-600 text-white'
                        : u.role === 'staff'
                        ? 'bg-amber-600 text-white'
                        : u.role === 'developer'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-violet-600 text-white';

                    // Initials
                    const initials = (u.displayName || u.email)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={u.uid}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                          isUpdating ? 'bg-violet-50/40 dark:bg-violet-950/20' : ''
                        }`}
                      >
                        {/* User Profile Cell */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${avatarBg}`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{u.displayName || u.email.split('@')[0]}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {u.email}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {u.uid}</div>
                            </div>
                          </div>
                        </td>

                        {/* Current Role Cell */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                              u.role === 'admin'
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : u.role === 'staff'
                                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : u.role === 'developer'
                                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                : 'bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
                            }`}
                          >
                            <span>
                              {u.role === 'admin'
                                ? '🛡️ Admin'
                                : u.role === 'staff'
                                ? '🔧 Staff'
                                : u.role === 'developer'
                                ? '⚡ Developer'
                                : '🎓 Student'}
                            </span>
                          </span>
                        </td>

                        {/* Associated Identifier Cell */}
                        <td className="py-3.5 px-4 font-mono">
                          {u.rollNo ? (
                            <span className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold px-2 py-0.5 rounded-lg border border-violet-200 dark:border-violet-800 text-[11px]">
                              Roll No: {u.rollNo}
                            </span>
                          ) : u.staffId ? (
                            <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 text-[11px]">
                              Staff ID: {u.staffId}
                            </span>
                          ) : u.role === 'admin' ? (
                            <span className="text-slate-500 font-sans text-xs">Campus Operations Desk</span>
                          ) : u.role === 'developer' ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-sans text-xs font-semibold">
                              System Architecture
                            </span>
                          ) : (
                            <span className="text-slate-400 font-sans text-xs">General Account</span>
                          )}
                        </td>

                        {/* Registration Date Cell */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Initial Seed'}
                        </td>

                        {/* Role Update Action Cell */}
                        <td className="py-3.5 px-4 text-right">
                          {isDeveloper ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                              <span>🔒</span>
                              <span>Root Protected</span>
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {/* Dropdown Selector */}
                              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                <select
                                  value={u.role}
                                  disabled={isUpdating}
                                  onChange={(e) =>
                                    handleRoleChange(u, e.target.value as 'student' | 'staff' | 'admin')
                                  }
                                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500 cursor-pointer disabled:opacity-50"
                                >
                                  <option value="student">🎓 Student</option>
                                  <option value="staff">🔧 Staff</option>
                                  <option value="admin">🛡️ Admin</option>
                                </select>
                              </div>

                              {/* Loading Spinner or Quick Switch Buttons */}
                              {isUpdating ? (
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                                </div>
                              ) : (
                                <div className="hidden xl:flex items-center gap-1">
                                  {u.role !== 'student' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRoleChange(u, 'student')}
                                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 transition active:scale-95 cursor-pointer"
                                      title="Switch role to Student"
                                    >
                                      → Student
                                    </button>
                                  )}
                                  {u.role !== 'staff' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRoleChange(u, 'staff')}
                                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition active:scale-95 cursor-pointer"
                                      title="Switch role to Staff"
                                    >
                                      → Staff
                                    </button>
                                  )}
                                  {u.role !== 'admin' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRoleChange(u, 'admin')}
                                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition active:scale-95 cursor-pointer"
                                      title="Switch role to Admin"
                                    >
                                      → Admin
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENTS TABLE */}
      {activeAccountTab === 'students' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Academic Branch & Year</th>
                <th className="py-3 px-4">Hostel Details</th>
                <th className="py-3 px-4">Filed Complaints</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records matching your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const studentComplaintsCount = complaints.filter(c => c.rollNo === st.rollNo).length;
                  const isCurrentActive = st.rollNo === studentProfile.rollNo;

                  return (
                    <tr
                      key={st.rollNo}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                        isCurrentActive ? 'bg-violet-50/40 dark:bg-violet-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                            {st.avatar || 'ST'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{st.studentName}</span>
                              {isCurrentActive && (
                                <span className="bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  Current Test
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{st.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-violet-600 dark:text-violet-400">
                        {st.rollNo}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {st.studentId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {st.branch.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.year} • {st.section}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {st.isHostelResident ? (
                          <span className="inline-block bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {st.hostelBlock} • {st.hostelRoom || 'Resident'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Day Scholar</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">
                          {studentComplaintsCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => switchStudentProfile(st.rollNo)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              isCurrentActive
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                            title="Activate profile for testing student view"
                          >
                            {isCurrentActive ? 'Active' : 'Test View'}
                          </button>

                          {studentProfilesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete profile for ${st.studentName} (${st.rollNo})?`)) {
                                  deleteStudentProfile(st.rollNo);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* STAFF TABLE */}
      {activeAccountTab === 'staff' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Active Assigned Tasks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No maintenance staff records found.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((st) => {
                  const staffTasksCount = complaints.filter(
                    c => c.assignedStaffId === st.id && c.status !== 'Resolved' && c.status !== 'Student Confirmation'
                  ).length;
                  const isCurrentActive = st.id === currentStaffId;

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                        isCurrentActive ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                            {st.avatar || 'ST'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{st.name}</span>
                              {isCurrentActive && (
                                <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  Current Test
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Technician</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {st.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px] font-medium">
                          {st.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {st.role}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-xs">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {st.phone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          staffTasksCount > 0
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {staffTasksCount} Active Task{staffTasksCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCurrentStaffId(st.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              isCurrentActive
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                            title="Activate staff member for testing staff view"
                          >
                            {isCurrentActive ? 'Active' : 'Test View'}
                          </button>

                          {staffList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove staff member ${st.name} (${st.id}) from directory?`)) {
                                  deleteStaffMember(st.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                              title="Delete Staff Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE STUDENT FORM MODAL */}
      {showStudentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                <UserPlus className="w-5 h-5 text-violet-600" />
                <span>Create New Student Profile</span>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {studentSuccess && (
              <div className="my-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{studentSuccess}</span>
              </div>
            )}

            {studentFormError && (
              <div className="my-3 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{studentFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={stRollNo}
                    onChange={(e) => setStRollNo(e.target.value)}
                    placeholder="e.g. 23CS089"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={stId}
                    onChange={(e) => setStId(e.target.value)}
                    placeholder="e.g. STU-2023-089"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={stEmail}
                  onChange={(e) => setStEmail(e.target.value)}
                  placeholder="e.g. ananya.roy@campus.edu"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Academic Branch
                </label>
                <select
                  value={stBranch}
                  onChange={(e) => setStBranch(e.target.value as AcademicBranch)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Year
                  </label>
                  <select
                    value={stYear}
                    onChange={(e) => setStYear(e.target.value as AcademicYear)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Semester
                  </label>
                  <select
                    value={stSemester}
                    onChange={(e) => setStSemester(e.target.value as AcademicSemester)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Section
                  </label>
                  <select
                    value={stSection}
                    onChange={(e) => setStSection(e.target.value as AcademicSection)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={stIsHostel}
                    onChange={(e) => setStIsHostel(e.target.checked)}
                    className="rounded-md text-violet-600 focus:ring-violet-500 w-4 h-4"
                  />
                  <span>Is Hostel Resident?</span>
                </label>

                {stIsHostel && (
                  <div className="grid grid-cols-3 gap-2 mt-3 pl-6 animate-in fade-in">
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">
                        Block
                      </label>
                      <select
                        value={stHostelBlock}
                        onChange={(e) => setStHostelBlock(e.target.value as HostelBlock)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      >
                        {HOSTEL_BLOCKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">
                        Floor
                      </label>
                      <input
                        type="text"
                        value={stHostelFloor}
                        onChange={(e) => setStHostelFloor(e.target.value)}
                        placeholder="e.g. 2nd Floor"
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1 text-[10px]">
                        Room
                      </label>
                      <input
                        type="text"
                        value={stHostelRoom}
                        onChange={(e) => setStHostelRoom(e.target.value)}
                        placeholder="e.g. Room 212"
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAFF MEMBER FORM MODAL */}
      {showStaffForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span>Add Maintenance Staff Member</span>
              </div>
              <button
                type="button"
                onClick={() => setShowStaffForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffSuccess && (
              <div className="my-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{staffSuccess}</span>
              </div>
            )}

            {staffFormError && (
              <div className="my-3 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{staffFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Technician Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => {
                    setStaffName(e.target.value);
                    if (!staffEmail || staffEmail.endsWith('@campuscare.edu')) {
                      setStaffEmail(`${e.target.value.trim().toLowerCase().replace(/\s+/g, '.') || 'staff'}@campuscare.edu`);
                    }
                  }}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Technician Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. ramesh.chandra@campuscare.edu"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Department *
                </label>
                <select
                  value={staffDept}
                  onChange={(e) => setStaffDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={staffRoleTitle}
                  onChange={(e) => setStaffRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Network Specialist"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Direct Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition active:scale-95"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
