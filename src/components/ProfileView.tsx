import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AcademicBranch,
  AcademicYear,
  AcademicSemester,
  AcademicSection,
  HostelBlock
} from '../types';
import {
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
  Shield,
  Sparkles,
  School,
  Mail,
  Hash,
  Home,
  Wrench
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

export const ProfileView: React.FC = () => {
  const {
    role,
    currentStaff,
    staffList,
    setActiveView,
    studentProfile,
    studentProfilesList,
    switchStudentProfile,
    createStudentProfile,
    updateStudentProfile,
    complaints,
    setIsProfileModalOpen,
  } = useApp();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditingActive, setIsEditingActive] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState<AcademicBranch>('Computer Science & Engineering');
  const [year, setYear] = useState<AcademicYear>('1st Year');
  const [semester, setSemester] = useState<AcademicSemester>('Semester 1');
  const [section, setSection] = useState<AcademicSection>('Section A');
  const [isHostel, setIsHostel] = useState(false);
  const [hostelBlock, setHostelBlock] = useState<HostelBlock>('Block A');
  const [hostelFloor, setHostelFloor] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit active profile state
  const [editName, setEditName] = useState(studentProfile.studentName);
  const [editRollNo, setEditRollNo] = useState(studentProfile.rollNo);
  const [editStudentId, setEditStudentId] = useState(studentProfile.studentId);
  const [editEmail, setEditEmail] = useState(studentProfile.email);
  const [editBranch, setEditBranch] = useState(studentProfile.branch);
  const [editYear, setEditYear] = useState(studentProfile.year);
  const [editSemester, setEditSemester] = useState(studentProfile.semester);
  const [editSection, setEditSection] = useState(studentProfile.section);
  const [editIsHostel, setEditIsHostel] = useState(studentProfile.isHostelResident);
  const [editHostelBlock, setEditHostelBlock] = useState<HostelBlock>(studentProfile.hostelBlock || 'Block C');
  const [editHostelFloor, setEditHostelFloor] = useState(studentProfile.hostelFloor || '3rd Floor');
  const [editHostelRoom, setEditHostelRoom] = useState(studentProfile.hostelRoom || 'Room 304');

  const myComplaintsCount = complaints.filter((c) => c.rollNo === studentProfile.rollNo).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const res = createStudentProfile({
      studentName: name,
      studentId,
      rollNo,
      email,
      branch,
      year,
      semester,
      section,
      isHostelResident: isHostel,
      hostelBlock: isHostel ? hostelBlock : undefined,
      hostelFloor: isHostel ? hostelFloor : undefined,
      hostelRoom: isHostel ? hostelRoom : undefined,
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create profile.');
      return;
    }

    setSuccessMsg(`New student profile created and activated for ${name.trim()}!`);
    setName('');
    setStudentId('');
    setRollNo('');
    setEmail('');
    setIsHostel(false);
    setHostelFloor('');
    setHostelRoom('');
    setShowCreateForm(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
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

    setIsEditingActive(false);
    setSuccessMsg('Active profile details updated successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (role === 'staff') {
    const assignedTasks = complaints.filter(
      (c) => c.assignedStaffId === currentStaff?.id && c.status !== 'Resolved' && c.status !== 'Student Confirmation'
    );
    const completedTasks = complaints.filter(
      (c) => c.assignedStaffId === currentStaff?.id && (c.status === 'Resolved' || c.status === 'Student Confirmation')
    );

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-amber-200" />
              <span>Campus Maintenance Staff Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {currentStaff?.name || 'Staff Member'}
            </h1>
            <p className="text-amber-100 text-xs mt-1">
              Department: <strong>{currentStaff?.department}</strong> • {currentStaff?.role}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>Active On Duty</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Technician Credentials</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{currentStaff?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff?.department}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Designation / Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff?.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Emergency Contact Phone:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{currentStaff?.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Task Assignment Overview</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900">
                <div className="text-2xl font-black text-amber-600">{assignedTasks.length}</div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold uppercase mt-1">Active Tasks</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900">
                <div className="text-2xl font-black text-emerald-600">{completedTasks.length}</div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase mt-1">Completed</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
              Account roles are provisioned by Campus Administration. Maintenance technicians are strictly authorized to view and execute workorders assigned to their specific queue.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-violet-300" />
              <span>Campus Administration Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Operations & Grievance Admin
            </h1>
            <p className="text-violet-100 text-xs mt-1">
              Authorized institutional account with full database, personnel allocation, and student profile oversight.
            </p>
          </div>

          <button
            onClick={() => setActiveView('admin-accounts')}
            className="bg-white text-violet-900 hover:bg-violet-50 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition active:scale-98 self-start md:self-auto"
          >
            <Users className="w-4 h-4" />
            <span>Manage Accounts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-violet-600" />
              <span>Administrative Overview</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Access Level:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Institutional Super-Admin</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Administrative Unit:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Office of Campus Grievance & Maintenance</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Managed Student Accounts:</span>
                <span className="font-bold text-slate-900 dark:text-white">{studentProfilesList.length} Registered</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Staff Technicians:</span>
                <span className="font-bold text-slate-900 dark:text-white">{staffList.length} Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-600" />
              <span>Directory Controls</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Campus administrators have privileges to create, configure, and maintain Student Academic Profiles and Staff Technician accounts.
            </p>
            <button
              onClick={() => setActiveView('admin-accounts')}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Open Accounts & Personnel Directory</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4 text-violet-300" />
            <span>Profile & Identity Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Student Academic Accounts
          </h1>
          <p className="text-violet-100 text-xs mt-1 max-w-xl">
            Switch between student profiles or create a new student account with custom branch, hostel, and academic details for testing grievances.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setShowCreateForm(true);
          }}
          className="bg-white text-violet-700 hover:bg-violet-50 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition active:scale-98 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Profile</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* CREATE NEW PROFILE FORM (Collapsible or toggleable) */}
      {showCreateForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-violet-500 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Create New Student Profile
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  New profile will be immediately saved to database and activated.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold px-2 py-1"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Diya Sengupta"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                  placeholder="e.g. 23BCSE105"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  placeholder="e.g. CC-2023-CSE-105"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. diya.s23@campus.edu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-violet-500"
                />
              </div>
            </div>

            {/* Academic Section */}
            <div className="p-4 bg-violet-50/70 dark:bg-violet-950/30 rounded-2xl border border-violet-100 dark:border-violet-900/60 space-y-3">
              <span className="font-extrabold text-violet-900 dark:text-violet-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-violet-600" /> Academic Enrolment
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    B.Tech Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as AcademicBranch)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-2 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as AcademicYear)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as AcademicSemester)}
                    className="w-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hostel Residency */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Building className="w-4 h-4 text-emerald-600" /> Hostel Residence
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={isHostel}
                    onChange={(e) => setIsHostel(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span>Resident Hosteller</span>
                </label>
              </div>

              {isHostel && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Block <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hostelBlock}
                      onChange={(e) => setHostelBlock(e.target.value as HostelBlock)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {HOSTEL_BLOCKS.map((hb) => (
                        <option key={hb} value={hb}>
                          {hb}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Floor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={hostelFloor}
                      onChange={(e) => setHostelFloor(e.target.value)}
                      required={isHostel}
                      placeholder="e.g. 2nd Floor"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Room <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={hostelRoom}
                      onChange={(e) => setHostelRoom(e.target.value)}
                      required={isHostel}
                      placeholder="e.g. Room 218"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create & Activate Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE PROFILE HERO CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {studentProfile.avatar || 'ST'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {studentProfile.studentName}
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Active Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Roll No: <strong className="text-slate-800 dark:text-slate-200 font-mono">{studentProfile.rollNo}</strong> • Student ID: <strong className="text-slate-800 dark:text-slate-200 font-mono">{studentProfile.studentId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold text-xs hover:bg-violet-100 transition"
            >
              Edit in Modal
            </button>
            <button
              onClick={() => {
                setFormError(null);
                setShowCreateForm(true);
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Info Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Branch</span>
            <span className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 block">
              {studentProfile.branch}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Academic Level</span>
            <span className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 block">
              {studentProfile.year} • {studentProfile.semester} ({studentProfile.section})
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Residence</span>
            <span className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 block">
              {studentProfile.isHostelResident
                ? `${studentProfile.hostelBlock}, ${studentProfile.hostelRoom || 'Room'}`
                : 'Day Scholar (Off Campus)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">My Complaints</span>
            <span className="font-extrabold text-xs text-violet-700 dark:text-violet-400 mt-1 block">
              {myComplaintsCount} ticket{myComplaintsCount !== 1 ? 's' : ''} submitted
            </span>
          </div>
        </div>
      </div>

      {/* ALL SAVED PROFILES DIRECTORY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>All Student Profiles ({studentProfilesList.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click "Switch to this Profile" to immediately change student identity for reporting and tracking.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setShowCreateForm(true);
            }}
            className="bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentProfilesList.map((prof) => {
            const isActive = prof.rollNo === studentProfile.rollNo;
            const profComplaintsCount = complaints.filter((c) => c.rollNo === prof.rollNo).length;

            return (
              <div
                key={prof.rollNo}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/40 ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                        {prof.avatar || 'ST'}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {prof.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {prof.rollNo}
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {prof.studentId}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <strong>Branch:</strong> {prof.branch}
                    </div>
                    <div>
                      <strong>Year:</strong> {prof.year} • {prof.semester} ({prof.section})
                    </div>
                    <div>
                      <strong>Residence:</strong>{' '}
                      {prof.isHostelResident ? `Hostel ${prof.hostelBlock || ''}` : 'Day Scholar'}
                    </div>
                    <div className="text-slate-400 text-[10px] truncate">
                      {prof.email}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    {profComplaintsCount} ticket{profComplaintsCount !== 1 ? 's' : ''}
                  </span>

                  {isActive ? (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => switchStudentProfile(prof.rollNo)}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 shadow-xs transition active:scale-95"
                    >
                      <span>Switch to Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
