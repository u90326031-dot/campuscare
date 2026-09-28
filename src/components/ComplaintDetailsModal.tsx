import React, { useState, useEffect } from 'react';
import { useApp, formatTimelineTimestamp } from '../context/AppContext';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../types';
import { DEPARTMENTS } from '../lib/seedData';
import {
  X,
  MapPin,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Wrench,
  ThumbsUp,
  School,
  Check,
  ShieldCheck,
  UserCheck,
  Tag,
  Paperclip,
  FileText,
  Send,
  XCircle,
  ArrowRight,
  Shield,
  Layers,
  PhoneCall,
  Calendar,
  Sparkles
} from 'lucide-react';

const ALL_CATEGORIES: ComplaintCategory[] = [
  'Laboratory Equipment',
  'Classroom & Labs',
  'Electrical',
  'Wi-Fi & Network',
  'Water Supply',
  'Washroom',
  'Cleaning',
  'Mess Hall',
  'Room Maintenance',
  'Furniture',
  'Security',
  'Library',
  'Other',
];

export const ComplaintDetailsModal: React.FC = () => {
  const {
    selectedComplaint,
    setSelectedComplaint,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    role,
    isDeveloperMode,
    currentStaffId,
    studentProfile,
    staffList,
    currentStaff,
    supportComplaint,
    reopenComplaint,
    confirmComplaintSolved,
    updateComplaintStatus,
    staffStartWork,
    staffAddUpdate,
    staffCompleteWork,
    adminVerifyComplaint,
    adminRejectComplaint,
    adminChangePriority,
    adminChangeCategory,
    adminAssignComplaint,
    adminAddInternalNote,
  } = useApp();

  // Admin action states
  const [selectedDept, setSelectedDept] = useState<string>('IT / Computer Lab');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [adminAssignPriority, setAdminAssignPriority] = useState<ComplaintPriority>('Medium');
  const [adminAssignNote, setAdminAssignNote] = useState<string>('');

  const [editPriority, setEditPriority] = useState<ComplaintPriority>('Medium');
  const [editCategory, setEditCategory] = useState<ComplaintCategory>('Laboratory Equipment');
  const [internalNote, setInternalNote] = useState<string>('');

  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [verifyNote, setVerifyNote] = useState<string>('');
  const [showVerifyPrompt, setShowVerifyPrompt] = useState<boolean>(false);

  // Admin Change Status dropdown
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('Under Verification');
  const [statusChangeNote, setStatusChangeNote] = useState<string>('');

  // Staff and student states
  const [staffNote, setStaffNote] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [reopenReason, setReopenReason] = useState<string>('');
  const [showReopenForm, setShowReopenForm] = useState<boolean>(false);

  // Synchronize initial values when selectedComplaint opens
  useEffect(() => {
    if (selectedComplaint) {
      setEditPriority(selectedComplaint.priority);
      setEditCategory(selectedComplaint.category);
      setAdminAssignPriority(selectedComplaint.priority);

      // Match department
      const matchingDept =
        DEPARTMENTS.find((d) => d.toLowerCase() === (selectedComplaint.assignedDepartment || '').toLowerCase()) ||
        (selectedComplaint.type === 'hostel' ? 'Hostel / Warden' : 'IT / Computer Lab');
      setSelectedDept(matchingDept);

      const deptStaff = staffList.filter((s) => s.department === matchingDept);
      if (selectedComplaint.assignedStaffId && deptStaff.some(s => s.id === selectedComplaint.assignedStaffId)) {
        setSelectedStaffId(selectedComplaint.assignedStaffId);
      } else if (deptStaff.length > 0) {
        setSelectedStaffId(deptStaff[0].id);
      } else {
        setSelectedStaffId('');
      }

      // Default next status based on current status
      if (selectedComplaint.status === 'Submitted') setNextStatus('Under Verification');
      else if (selectedComplaint.status === 'Under Verification') setNextStatus('Assigned');
      else if (selectedComplaint.status === 'Assigned') setNextStatus('In Progress');
      else if (selectedComplaint.status === 'In Progress') setNextStatus('Resolved');
      else if (selectedComplaint.status === 'Resolved') setNextStatus('Under Verification');
      else if (selectedComplaint.status === 'Rejected') setNextStatus('Under Verification');

      setShowRejectForm(false);
      setShowVerifyPrompt(false);
      setShowReopenForm(false);
      setStatusChangeNote('');
      setAdminAssignNote('');
      setInternalNote('');
      setVerifyNote('');
    }
  }, [selectedComplaint, staffList]);

  // When selected department changes in admin assign, update staff dropdown to first staff in that department
  const handleDepartmentChange = (dept: string) => {
    setSelectedDept(dept);
    const deptStaff = staffList.filter((s) => s.department === dept);
    if (deptStaff.length > 0) {
      setSelectedStaffId(deptStaff[0].id);
    } else {
      setSelectedStaffId('');
    }
  };

  if (!isDetailsModalOpen || !selectedComplaint) return null;

  const c = selectedComplaint;
  const isMyComplaint = c.rollNo === studentProfile.rollNo;
  const isSupported = c.supportedStudentIds?.includes(studentProfile.rollNo);

  // STRICT ACCESS CONTROL GUARD:
  // Student can ONLY see their own complaints
  // Staff can ONLY see complaints assigned to them
  // Admin and Developer Mode can see all complaints
  const isAuthorized =
    isDeveloperMode ||
    role === 'admin' ||
    (role === 'student' && isMyComplaint) ||
    (role === 'staff' && c.assignedStaffId === currentStaffId);

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 dark:border-red-900 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Unauthorized Complaint Access
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {role === 'student'
              ? 'Students are strictly restricted to viewing only complaints they personally submitted.'
              : 'Maintenance staff members can only view workorders assigned to their technician account.'}
          </p>
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Filter staff belonging to currently selected department
  const departmentStaffMembers = staffList.filter(
    (s) => s.department.toLowerCase() === selectedDept.toLowerCase()
  );

  // Handlers for Admin actions
  const handleVerify = async () => {
    await adminVerifyComplaint(c.id, verifyNote.trim() || undefined);
    setShowVerifyPrompt(false);
    setVerifyNote('');
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    await adminRejectComplaint(c.id, rejectReason.trim());
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    const staff = staffList.find((s) => s.id === selectedStaffId);
    if (!staff) return;

    await adminAssignComplaint(
      c.id,
      selectedDept,
      staff.id,
      staff.name,
      adminAssignPriority,
      adminAssignNote.trim() || undefined
    );
    setAdminAssignNote('');
  };

  const handleChangePrioritySubmit = async () => {
    if (editPriority === c.priority) return;
    await adminChangePriority(c.id, editPriority);
  };

  const handleChangeCategorySubmit = async () => {
    if (editCategory === c.category) return;
    await adminChangeCategory(c.id, editCategory);
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    await adminAddInternalNote(c.id, internalNote.trim());
    setInternalNote('');
  };

  const handleChangeStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nextStatus === c.status) return;
    await updateComplaintStatus(c.id, nextStatus, statusChangeNote.trim() || undefined, 'Admin');
    setStatusChangeNote('');
  };

  // Determine valid next statuses according to workflow
  const getValidNextStatuses = (current: ComplaintStatus): ComplaintStatus[] => {
    switch (current) {
      case 'Submitted':
        return ['Under Verification', 'Rejected'];
      case 'Under Verification':
        return ['Assigned', 'Rejected'];
      case 'Assigned':
        return ['In Progress'];
      case 'In Progress':
        return ['Resolved'];
      case 'Resolved':
        return ['Under Verification'];
      case 'Rejected':
        return ['Under Verification'];
      default:
        return [];
    }
  };

  const validNextStatuses = getValidNextStatuses(c.status);

  // Student and Staff handlers
  const handleSupport = async () => {
    await supportComplaint(c.id);
  };

  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    await reopenComplaint(c.id, reopenReason.trim());
    setShowReopenForm(false);
    setReopenReason('');
    setIsDetailsModalOpen(false);
  };

  const handleStaffAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNote.trim()) return;
    await staffAddUpdate(c.id, staffNote.trim(), proofUrl || undefined);
    setStaffNote('');
    setProofUrl('');
  };

  const handleStaffComplete = async () => {
    await staffCompleteWork(
      c.id,
      staffNote || 'Technician completed all physical repairs and tests.',
      proofUrl || undefined
    );
    setStaffNote('');
    setProofUrl('');
    setIsDetailsModalOpen(false);
  };

  const formattedCreatedDate = formatTimelineTimestamp(c.createdAt);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-modal-enter">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 z-20 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
              #{c.id}
            </span>

            {/* Current Status Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                c.status === 'Resolved' || c.status === 'Student Confirmation'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : c.status === 'In Progress'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : c.status === 'Assigned'
                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : c.status === 'Under Verification'
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : c.status === 'Rejected'
                  ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {c.status}
            </span>

            {/* Priority Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                c.priority === 'Critical' || c.priority === 'High'
                  ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900'
                  : c.priority === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {c.priority} Priority
            </span>

            {/* Domain Badge */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
              {c.type === 'hostel' ? 'Hostel Grievance' : 'College Academic'}
            </span>
          </div>

          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* SECTION 1: COMPLAINT INFORMATION */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {c.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 mt-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  {c.location}
                </span>
                <span>•</span>
                <span>Category: <strong className="text-slate-800 dark:text-slate-200">{c.category}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Reported: <strong>{formattedCreatedDate}</strong>
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block">
                Problem Description
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                {c.description}
              </p>
            </div>

            {/* Comprehensive Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Student & Academic Hierarchy */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-600" />
                  Student & Academic Details
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {c.studentName} <span className="font-mono text-slate-500">({c.rollNo})</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs">
                    {c.branch}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Year: <strong>{c.year}</strong> • Semester: <strong>{c.semester}</strong> • Section: <strong>{c.section}</strong>
                  </div>
                  {c.type === 'college' ? (
                    <div className="text-violet-700 dark:text-violet-400 text-[11px] font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      🏫 College Location: <strong>{c.collegeBuilding || 'Academic Block'}</strong> • Floor: <strong>{c.collegeFloor || 'Ground Floor'}</strong> • Room/Lab: <strong>{c.collegeRoom || 'Main Lab'}</strong>
                    </div>
                  ) : (
                    <div className="text-amber-700 dark:text-amber-400 text-[11px] font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      🏠 Hostel Location: <strong>Hostel {c.hostelBlock || 'Block C'}</strong> • Floor: <strong>{c.hostelFloor || 'Floor 3'}</strong> • Room: <strong>{c.hostelRoom || 'Room 304'}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Department, Staff & Impact */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-violet-600" />
                  Department Allocation & Impact
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Selected Department:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {c.assignedDepartment || 'Pending Selection'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Staff:</span>
                    <strong className={c.assignedStaffName ? 'text-violet-600 dark:text-violet-400 font-bold' : 'text-slate-400'}>
                      {c.assignedStaffName || 'Unassigned'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Affected Group:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {c.affectedGroup || `${c.branch.split(' ')[0]} students`}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">Affected Students:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-violet-700 dark:text-violet-400">
                        {c.affectedStudentCount || 1} student{(c.affectedStudentCount || 1) !== 1 ? 's' : ''}
                      </strong>
                      {role === 'student' && !isMyComplaint && (
                        <button
                          onClick={handleSupport}
                          disabled={isSupported}
                          className={`px-2 py-0.5 rounded-lg font-bold text-[10px] flex items-center gap-1 ${
                            isSupported
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-violet-600 text-white hover:bg-violet-700'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{isSupported ? 'Supported' : '+1'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments / Files if present */}
            {c.attachments && c.attachments.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> Uploaded Images / Files ({c.attachments.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {c.attachments.map((file, i) => (
                    <span
                      key={i}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-violet-600" />
                      <span>{file}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ADMIN ACTIONS PANEL (Displayed when logged in as Admin) */}
          {role === 'admin' && (
            <div className="bg-gradient-to-br from-violet-50/70 via-slate-50 to-indigo-50/50 dark:from-violet-950/30 dark:via-slate-900/60 dark:to-indigo-950/20 p-5 rounded-3xl border border-violet-200/80 dark:border-violet-900/60 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-violet-100 dark:border-violet-900/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Admin Complaint Management Controls
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Workflow execution: Verify, Reject, Reclassify, Allocate Department & Assign Staff.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-300 px-2.5 py-1 rounded-full">
                  Current Status: {c.status}
                </span>
              </div>

              {/* ACTION 1 & 2: 1. Verify Complaint & 2. Reject Complaint */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                  Verification & Triage Actions:
                </span>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Action 1: Verify Complaint */}
                  {c.status === 'Submitted' && (
                    <button
                      type="button"
                      onClick={() => setShowVerifyPrompt(!showVerifyPrompt)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Complaint</span>
                    </button>
                  )}

                  {/* Action 2: Reject Complaint */}
                  {(c.status === 'Submitted' || c.status === 'Under Verification') && !showRejectForm && (
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(true)}
                      className="bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Complaint</span>
                    </button>
                  )}
                </div>

                {/* Prompt: Verify Complaint Note */}
                {showVerifyPrompt && c.status === 'Submitted' && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3.5 rounded-2xl space-y-2 mt-2 animate-in fade-in">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      Verify and confirm complaint validity:
                    </div>
                    <input
                      type="text"
                      value={verifyNote}
                      onChange={(e) => setVerifyNote(e.target.value)}
                      placeholder="Optional verification note (e.g. Verified by campus operations desk)..."
                      className="w-full text-xs p-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVerifyPrompt(false)}
                        className="px-3 py-1 text-slate-600 dark:text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleVerify}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-xs"
                      >
                        Confirm Verification
                      </button>
                    </div>
                  </div>
                )}

                {/* Action 2: Reject Form prompt */}
                {showRejectForm && (
                  <form onSubmit={handleReject} className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3.5 rounded-2xl space-y-2 mt-2 animate-in fade-in">
                    <div className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      Specify Rejection Reason (Required):
                    </div>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Duplicate grievance, invalid campus location, or non-actionable description..."
                      rows={2}
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="px-3 py-1 text-slate-600 dark:text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ACTION 5 & 6: 5. SELECT DEPARTMENT & 6. ASSIGN STAFF */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-violet-600" />
                    <span>Select Department & Assign Staff</span>
                  </div>
                  {c.assignedStaffName ? (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Assigned to: <strong>{c.assignedStaffName} ({c.assignedDepartment})</strong>
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      Status: {c.status === 'Submitted' ? 'Verification required before assignment' : 'Ready for assignment'}
                    </span>
                  )}
                </div>

                <form onSubmit={handleAssignStaff} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Action 5: Select Department Dropdown */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Select Department:
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action 6: Staff Dropdown - Filtered by department */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Assign Staff ({departmentStaffMembers.length} available):
                      </label>
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        {departmentStaffMembers.length === 0 ? (
                          <option value="">No staff in this department</option>
                        ) : (
                          departmentStaffMembers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.role})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Optional Priority adjustment during assignment */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Set Priority:
                      </label>
                      <select
                        value={adminAssignPriority}
                        onChange={(e) => setAdminAssignPriority(e.target.value as ComplaintPriority)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Critical">Critical Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Assignment Note & Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={adminAssignNote}
                      onChange={(e) => setAdminAssignNote(e.target.value)}
                      placeholder="Optional assignment note or instructions for staff..."
                      className="w-full sm:flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={!selectedStaffId}
                      className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 disabled:opacity-50 shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Assign Complaint</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ACTION 3, 4, 7 & 8: Priority, Category, Internal Note & Status Flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Action 3 & 4: Change Priority & Change Category */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-violet-600" />
                    <span>Change Priority & Category</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Action 3: Change Priority */}
                    <div className="flex items-center gap-2">
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as ComplaintPriority)}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleChangePrioritySubmit}
                        disabled={editPriority === c.priority}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs disabled:opacity-40 transition"
                      >
                        Change Priority
                      </button>
                    </div>

                    {/* Action 4: Change Category */}
                    <div className="flex items-center gap-2">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as ComplaintCategory)}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium truncate"
                      >
                        {ALL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleChangeCategorySubmit}
                        disabled={editCategory === c.category}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs disabled:opacity-40 transition"
                      >
                        Change Category
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action 7: Add Internal Note */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-violet-600" />
                    <span>Add Internal Admin Note</span>
                  </div>
                  <form onSubmit={handleAddInternalNote} className="space-y-2">
                    <textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add an internal operations note or dispatch log..."
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!internalNote.trim()}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-1 rounded-xl text-xs disabled:opacity-50 transition"
                      >
                        Add Internal Note
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* ACTION 8: Change Status (Strictly following the workflow rules) */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-violet-600" />
                    <span>Workflow Status Progression (No Arbitrary Jumps)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Current: <strong>{c.status}</strong>
                  </span>
                </div>

                <form onSubmit={handleChangeStatusSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full sm:w-1/3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Allowed Next Status:
                    </label>
                    <select
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value as ComplaintStatus)}
                      disabled={validNextStatuses.length === 0}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      {validNextStatuses.length === 0 ? (
                        <option value="">No transition available</option>
                      ) : (
                        validNextStatuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Status Change Note (Optional):
                    </label>
                    <input
                      type="text"
                      value={statusChangeNote}
                      onChange={(e) => setStatusChangeNote(e.target.value)}
                      placeholder="e.g. Verified by campus operations desk..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={validNextStatuses.length === 0 || nextStatus === c.status}
                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-40 transition shrink-0 self-end"
                  >
                    Change Status
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* RESOLUTION VERIFICATION BOX (For student confirmation) */}
          {c.status === 'Resolved' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Has the problem actually been solved?</span>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Verification Pending
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                Technician noted: "{c.resolutionProof || 'Repairs completed and tested.'}"
              </p>

              {isMyComplaint && (
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      confirmComplaintSolved(c.id);
                      setIsDetailsModalOpen(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yes, Problem Solved</span>
                  </button>
                  <button
                    onClick={() => setShowReopenForm(true)}
                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>No, Problem Still Exists</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reopen Form prompt */}
          {showReopenForm && (
            <form onSubmit={handleReopen} className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 rounded-2xl space-y-3">
              <div className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Specify why problem still exists:
              </div>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Explain what is still broken or unresolved..."
                rows={2}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-red-200 bg-white dark:bg-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReopenForm(false)}
                  className="px-3 py-1 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-xl"
                >
                  Reopen Complaint & Notify Admin
                </button>
              </div>
            </form>
          )}

          {/* STAFF ACTION PANEL if role === 'staff' */}
          {role === 'staff' && (
            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                Staff Maintenance Execution (Logged in as {currentStaff?.name})
              </div>

              {c.status !== 'In Progress' && c.status !== 'Resolved' && (
                <button
                  type="button"
                  onClick={() => staffStartWork(c.id, currentStaff?.name || 'Technician')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
                >
                  Commence On-Site Work (Set In Progress)
                </button>
              )}

              {/* Add Progress Note */}
              <form onSubmit={handleStaffAddUpdate} className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Add Progress Note / Component Replacement Info:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder="e.g. Spliced HDMI connector, tested signal throughput..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl font-bold text-xs"
                  >
                    Post Note
                  </button>
                </div>
              </form>

              {/* Complete Work button */}
              {c.status === 'In Progress' && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleStaffComplete}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Work Completed (Send for Student Verification)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC ACTIVITY TIMELINE (Requirement: action, timestamp, user, optional note) */}
          <div className="pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" />
              Dynamic Activity Timeline
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {c.timeline.map((event, idx) => {
                const userDisplay = event.user || event.actor;
                const formattedUser = userDisplay.startsWith('to ') ? userDisplay : `by ${userDisplay}`;

                return (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-[8px] font-bold ring-4 ring-white dark:ring-slate-900">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {event.action || event.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {event.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formattedUser}
                      </div>
                      {event.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          "{event.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
