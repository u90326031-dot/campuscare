import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AcademicBranch,
  AcademicYear,
  AcademicSemester,
  AcademicSection,
  HostelBlock
} from '../types';
import {
  X,
  User,
  UserPlus,
  Users,
  GraduationCap,
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  Check,
  ArrowRight,
  Shield
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

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    role,
    currentStaff,
    setActiveView,
    staffList,
    studentProfile,
    studentProfilesList,
    updateStudentProfile,
    createStudentProfile,
    switchStudentProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'edit' | 'create' | 'switch'>('edit');

  // Edit Profile Form State
  const [editName, setEditName] = useState(studentProfile.studentName);
  const [editStudentId, setEditStudentId] = useState(studentProfile.studentId);
  const [editRollNo, setEditRollNo] = useState(studentProfile.rollNo);
  const [editEmail, setEditEmail] = useState(studentProfile.email);
  const [editBranch, setEditBranch] = useState<AcademicBranch>(studentProfile.branch);
  const [editYear, setEditYear] = useState<AcademicYear>(studentProfile.year);
  const [editSemester, setEditSemester] = useState<AcademicSemester>(studentProfile.semester);
  const [editSection, setEditSection] = useState<AcademicSection>(studentProfile.section);
  const [editIsHostel, setEditIsHostel] = useState(studentProfile.isHostelResident);
  const [editHostelBlock, setEditHostelBlock] = useState<HostelBlock>(studentProfile.hostelBlock || 'Block C');
  const [editHostelFloor, setEditHostelFloor] = useState(studentProfile.hostelFloor || '3rd Floor');
  const [editHostelRoom, setEditHostelRoom] = useState(studentProfile.hostelRoom || 'Room 304');
  const [editSavedSuccess, setEditSavedSuccess] = useState(false);

  // Create Profile Form State
  const [newName, setNewName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBranch, setNewBranch] = useState<AcademicBranch>('Computer Science & Engineering');
  const [newYear, setNewYear] = useState<AcademicYear>('1st Year');
  const [newSemester, setNewSemester] = useState<AcademicSemester>('Semester 1');
  const [newSection, setNewSection] = useState<AcademicSection>('Section A');
  const [newIsHostel, setNewIsHostel] = useState(false);
  const [newHostelBlock, setNewHostelBlock] = useState<HostelBlock>('Block A');
  const [newHostelFloor, setNewHostelFloor] = useState('');
  const [newHostelRoom, setNewHostelRoom] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Sync edit form with current active profile
  useEffect(() => {
    if (studentProfile) {
      setEditName(studentProfile.studentName);
      setEditStudentId(studentProfile.studentId);
      setEditRollNo(studentProfile.rollNo);
      setEditEmail(studentProfile.email);
      setEditBranch(studentProfile.branch);
      setEditYear(studentProfile.year);
      setEditSemester(studentProfile.semester);
      setEditSection(studentProfile.section);
      setEditIsHostel(studentProfile.isHostelResident);
      setEditHostelBlock(studentProfile.hostelBlock || 'Block C');
      setEditHostelFloor(studentProfile.hostelFloor || '3rd Floor');
      setEditHostelRoom(studentProfile.hostelRoom || 'Room 304');
    }
  }, [studentProfile]);

  if (!isProfileModalOpen) return null;

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editRollNo.trim() || !editStudentId.trim() || !editEmail.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    updateStudentProfile({
      studentName: editName.trim(),
      studentId: editStudentId.trim(),
      rollNo: editRollNo.trim(),
      email: editEmail.trim(),
      branch: editBranch,
      year: editYear,
      semester: editSemester,
      section: editSection,
      isHostelResident: editIsHostel,
      hostelBlock: editIsHostel ? editHostelBlock : undefined,
      hostelFloor: editIsHostel ? editHostelFloor.trim() : undefined,
      hostelRoom: editIsHostel ? editHostelRoom.trim() : undefined,
      avatar: editName
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'ST',
    });
    setEditSavedSuccess(true);
    setFormError(null);
    setTimeout(() => {
      setEditSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 700);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = createStudentProfile({
      studentName: newName,
      studentId: newStudentId,
      rollNo: newRollNo,
      email: newEmail,
      branch: newBranch,
      year: newYear,
      semester: newSemester,
      section: newSection,
      isHostelResident: newIsHostel,
      hostelBlock: newIsHostel ? newHostelBlock : undefined,
      hostelFloor: newIsHostel ? newHostelFloor : undefined,
      hostelRoom: newIsHostel ? newHostelRoom : undefined,
    });

    if (!result.success) {
      setFormError(result.error || 'Failed to create profile.');
      return;
    }

    setCreateSuccess(true);
    // Reset create fields
    setNewName('');
    setNewStudentId('');
    setNewRollNo('');
    setNewEmail('');
    setNewIsHostel(false);
    setNewHostelFloor('');
    setNewHostelRoom('');

    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('edit');
    }, 900);
  };

  if (role === 'staff') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-modal-enter">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                {currentStaff?.avatar || 'ST'}
              </div>
              <div>
                <div className="leading-tight">Maintenance Staff Profile</div>
                <div className="text-[10px] text-slate-400 font-normal">Campus Technician Directory</div>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Technician Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentStaff?.name || 'Staff Member'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Staff ID:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{currentStaff?.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff?.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Role Title:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff?.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Contact Phone:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{currentStaff?.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Duty Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active On-Duty
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
              Security Notice: Staff accounts are assigned to specific maintenance workflows. Account role cannot be altered by normal users.
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-modal-enter">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div>
                <div className="leading-tight">Administrator Profile</div>
                <div className="text-[10px] text-slate-400 font-normal">Campus Operations Management</div>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Administrator:</span>
                <span className="font-bold text-slate-900 dark:text-white">Campus Operations Desk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Institutional Admin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Permission Scope:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Full System & Personnel Management</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Managed Student Records:</span>
                <span className="font-bold">{studentProfilesList.length} Accounts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Managed Staff Technicians:</span>
                <span className="font-bold">{staffList.length} Technicians</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveView('admin-accounts');
                setIsProfileModalOpen(false);
              }}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Manage Student & Staff Accounts</span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto animate-modal-enter">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-black text-base text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
              {studentProfile.avatar || 'ST'}
            </div>
            <div>
              <div className="leading-tight">Student Academic Profile</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {studentProfilesList.length} Profile{studentProfilesList.length > 1 ? 's' : ''} Configured
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Create New Profile CTA Button */}
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setActiveTab('create');
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create New Profile</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setActiveTab('edit');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Active Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setActiveTab('switch');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'switch'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Profile ({studentProfilesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setActiveTab('create');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Profile</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* Global Create Success Banner */}
        {createSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-bold">New profile created and set as active profile!</span>
          </div>
        )}

        {/* ================= TAB 1: EDIT ACTIVE PROFILE ================= */}
        {activeTab === 'edit' && (
          <form onSubmit={handleEditSave} className="mt-4 space-y-4 text-xs">
            {/* Active profile quick card */}
            <div className="p-3 bg-violet-50/50 dark:bg-violet-950/30 rounded-2xl border border-violet-100 dark:border-violet-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {studentProfile.avatar || 'ST'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {studentProfile.studentName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Roll: <span className="font-mono font-semibold">{studentProfile.rollNo}</span> • ID: <span className="font-mono">{studentProfile.studentId}</span>
                  </div>
                </div>
              </div>
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Active
              </span>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editRollNo}
                  onChange={(e) => setEditRollNo(e.target.value)}
                  required
                  placeholder="e.g. 22BCSE042"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                  required
                  placeholder="e.g. CC-2022-CSE-042"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  placeholder="e.g. student@campus.edu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-violet-500"
                />
              </div>
            </div>

            {/* Academic Hierarchy */}
            <div className="p-3 bg-violet-50/60 dark:bg-violet-950/30 rounded-2xl border border-violet-100 dark:border-violet-900/60 space-y-3">
              <span className="font-bold text-violet-900 dark:text-violet-200 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-violet-600" /> Academic Enrolment
              </span>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  B.Tech Branch
                </label>
                <select
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value as AcademicBranch)}
                  className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-2 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Year</label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value as AcademicYear)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Semester</label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value as AcademicSemester)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Section</label>
                  <select
                    value={editSection}
                    onChange={(e) => setEditSection(e.target.value as AcademicSection)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hostel Details */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <Building className="w-4 h-4 text-emerald-600" /> Hostel Residence
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={editIsHostel}
                    onChange={(e) => setEditIsHostel(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span>Resident Hosteller</span>
                </label>
              </div>

              {editIsHostel && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Block</label>
                    <select
                      value={editHostelBlock}
                      onChange={(e) => setEditHostelBlock(e.target.value as HostelBlock)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {HOSTEL_BLOCKS.map((hb) => (
                        <option key={hb} value={hb}>
                          {hb}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Floor</label>
                    <input
                      type="text"
                      value={editHostelFloor}
                      onChange={(e) => setEditHostelFloor(e.target.value)}
                      placeholder="e.g. 3rd Floor"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Room</label>
                    <input
                      type="text"
                      value={editHostelRoom}
                      onChange={(e) => setEditHostelRoom(e.target.value)}
                      placeholder="e.g. Room 304"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              {editSavedSuccess ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">* Required fields</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= TAB 2: CREATE NEW PROFILE ================= */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
            <div className="p-3 bg-violet-50 dark:bg-violet-950/40 rounded-2xl border border-violet-200 dark:border-violet-900/60 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-violet-900 dark:text-violet-200 text-xs">
                  Create New Student Profile
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Fill in your academic and residential info to create and switch to a new identity.
                </div>
              </div>
              <UserPlus className="w-5 h-5 text-violet-600 shrink-0" />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Diya Sengupta"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRollNo}
                  onChange={(e) => setNewRollNo(e.target.value)}
                  required
                  placeholder="e.g. 23BCSE105"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  required
                  placeholder="e.g. CC-2023-CSE-105"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="e.g. diya.s23@campus.edu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-violet-500"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-3 bg-violet-50/60 dark:bg-violet-950/30 rounded-2xl border border-violet-100 dark:border-violet-900/60 space-y-3">
              <span className="font-bold text-violet-900 dark:text-violet-200 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-violet-600" /> Academic Enrolment
              </span>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  B.Tech Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value as AcademicBranch)}
                  className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-2 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Year</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value as AcademicYear)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value as AcademicSemester)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Section</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value as AcademicSection)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hostel Residency */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <Building className="w-4 h-4 text-emerald-600" /> Hostel Residence
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newIsHostel}
                    onChange={(e) => setNewIsHostel(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span>Resident Hosteller</span>
                </label>
              </div>

              {newIsHostel && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      Block <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newHostelBlock}
                      onChange={(e) => setNewHostelBlock(e.target.value as HostelBlock)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {HOSTEL_BLOCKS.map((hb) => (
                        <option key={hb} value={hb}>
                          {hb}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      Floor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newHostelFloor}
                      onChange={(e) => setNewHostelFloor(e.target.value)}
                      required={newIsHostel}
                      placeholder="e.g. 2nd Floor"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      Room <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newHostelRoom}
                      onChange={(e) => setNewHostelRoom(e.target.value)}
                      required={newIsHostel}
                      placeholder="e.g. Room 218"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Back to Profiles
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create & Activate Profile</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= TAB 3: SWITCH PROFILE DIRECTORY ================= */}
        {activeTab === 'switch' && (
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                Select any profile to switch your current active student identity:
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="text-violet-600 dark:text-violet-400 font-bold hover:underline flex items-center gap-1 text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Another Profile</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {studentProfilesList.map((prof) => {
                const isActive = prof.rollNo === studentProfile.rollNo;

                return (
                  <div
                    key={prof.rollNo}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/40 ring-2 ring-violet-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {prof.avatar || 'ST'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {prof.studentName}
                          </span>
                          {isActive && (
                            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-800">
                              Current Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Roll: <strong className="text-slate-700 dark:text-slate-300 font-mono">{prof.rollNo}</strong> • {prof.branch} • {prof.year}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {prof.isHostelResident ? `🏠 Hostel: ${prof.hostelBlock || 'Resident'}` : '🎒 Day Scholar'} • {prof.email}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab('edit')}
                          className="px-3 py-1.5 rounded-xl border border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300 font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 text-xs transition"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            switchStudentProfile(prof.rollNo);
                            setActiveTab('edit');
                          }}
                          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs flex items-center gap-1 transition active:scale-95"
                        >
                          <span>Switch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Create Profile Prompt */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Need another student account for testing or reporting?
              </span>
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setActiveTab('create');
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5 text-violet-600" />
                <span>+ Create New Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
