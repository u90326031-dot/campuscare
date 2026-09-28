import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus } from '../types';
import {
  ListTodo,
  Hourglass,
  Users2,
  CheckCircle2,
  Plus,
  Compass,
  SlidersHorizontal,
  Lightbulb,
  MapPin,
  Building,
  Clock,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    complaints,
    studentStats,
    hostelServices,
    openNewComplaintModal,
    setActiveView,
    setSelectedComplaint,
    setIsDetailsModalOpen,
    supportComplaint,
    reopenComplaint,
    confirmComplaintSolved,
    radarAlerts,
  } = useApp();

  const [statusFilterTab, setStatusFilterTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [reopenReason, setReopenReason] = useState<string>('');
  const [reopenTargetId, setReopenTargetId] = useState<string | null>(null);

  // Student sees ONLY complaints created by that student
  const myComplaints = complaints.filter((c) => c.rollNo === studentProfile.rollNo);
  const activeComplaints = myComplaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Student Confirmation'
  );
  const resolvedComplaints = myComplaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Student Confirmation'
  );

  const displayedComplaints =
    statusFilterTab === 'all'
      ? myComplaints
      : statusFilterTab === 'active'
      ? activeComplaints
      : resolvedComplaints;

  const getTimelineStepIndex = (status: ComplaintStatus): number => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Under Verification':
        return 2;
      case 'Assigned':
        return 3;
      case 'In Progress':
        return 4;
      case 'Resolved':
        return 5;
      case 'Student Confirmation':
        return 6;
      default:
        return 1;
    }
  };

  // Student-friendly terminology: "Under Verification" replacing "HOD Triage"
  const stepsList = [
    { label: 'Submitted', key: 'Submitted' },
    { label: 'Under Verification', key: 'Under Verification' },
    { label: 'Assigned', key: 'Assigned' },
    { label: 'In Progress', key: 'In Progress' },
    { label: 'Resolved', key: 'Resolved' },
    { label: 'Student Confirm', key: 'Student Confirmation' },
  ];

  const handleOpenDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsModalOpen(true);
  };

  const handleReopenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenTargetId || !reopenReason.trim()) return;
    await reopenComplaint(reopenTargetId, reopenReason);
    setReopenTargetId(null);
    setReopenReason('');
  };

  return (
    <div className="space-y-6">
      {/* Problem Radar Alert Banner if high recurring issue detected */}
      {radarAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Recurring Campus Alert
                </span>
                <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {radarAlerts[0].timeWindow}
                </span>
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                  {radarAlerts[0].trend}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {radarAlerts[0].title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {radarAlerts[0].complaintCount} reports • {radarAlerts[0].affectedStudentCount} students affected. {radarAlerts[0].recommendation}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex text-xs font-semibold text-amber-800 dark:text-amber-300 shrink-0 items-center gap-1 mt-1 bg-amber-100/80 dark:bg-amber-900/40 px-2.5 py-1 rounded-lg">
            <span>Campus Notice</span>
          </div>
        </div>
      )}

      {/* Top Welcome Card matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Academic Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/70 border border-violet-200/80 dark:border-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-medium shadow-2xs mb-2">
            <span>🎓</span>
            <span>
              B.Tech • {studentProfile.branch} • {studentProfile.year} • {studentProfile.semester} • {studentProfile.section}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {studentProfile.studentName.split(' ')[0]}
          </h1>

          {/* Subtext info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Student ID: <strong className="text-slate-700 dark:text-slate-300">{studentProfile.studentId}</strong></span>
            <span>•</span>
            <span>Roll No: <strong className="text-slate-700 dark:text-slate-300">{studentProfile.rollNo}</strong></span>
          </div>

          {/* Hostel pill */}
          {studentProfile.isHostelResident && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs">
              <span>🏠</span>
              <span>
                Hostel {studentProfile.hostelBlock} • {studentProfile.hostelFloor} • {studentProfile.hostelRoom}
              </span>
            </div>
          )}
        </div>

        {/* Top Right Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={openNewComplaintModal}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-violet-200 dark:shadow-none flex items-center gap-2 transition active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Report a Problem</span>
          </button>
          <button
            onClick={() => setActiveView('suggestions')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Lightbulb className="w-4 h-4 text-violet-600" />
            <span className="hidden sm:inline">Campus Suggestions</span>
            <span className="sm:hidden">Ideas</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (Calculated directly from actual database records) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. MY COMPLAINTS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-violet-300 transition card-interactive animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              MY COMPLAINTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {studentStats.total}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {studentStats.inProgress + studentStats.pending} active this semester
            </div>
          </div>
        </div>

        {/* 2. PENDING (Under Verification) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-300 transition card-interactive animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PENDING
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {studentStats.pending}
            </div>
            <div className="mt-2">
              <span className="inline-block text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                Under Verification
              </span>
            </div>
          </div>
        </div>

        {/* 3. IN PROGRESS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-violet-300 transition card-interactive animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              IN PROGRESS
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400 tracking-tight">
              {studentStats.inProgress}
            </div>
            <div className="mt-2">
              <span className="inline-block text-[10px] font-bold bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full">
                Staff Assigned & Working
              </span>
            </div>
          </div>
        </div>

        {/* 4. RESOLVED */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition card-interactive animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              RESOLVED
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {studentStats.resolved}
            </div>
            <div className="mt-2">
              <span className="inline-block text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                {studentStats.verificationRate}% Verified Solved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          QUICK ACTIONS:
        </span>
        <button
          onClick={openNewComplaintModal}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Report a Problem</span>
        </button>
        <button
          onClick={() => {
            setStatusFilterTab('all');
            setActiveView('my-complaints');
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
          <span>My Complaints ({studentStats.total})</span>
        </button>
        <button
          onClick={() => setActiveView('suggestions')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggest an Improvement</span>
        </button>
        <button
          onClick={() => setActiveView('map')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span>Campus Problem Map</span>
        </button>
        <button
          onClick={() => setActiveView('hostel-problems')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
        >
          <Building className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hostel Quick Grievance</span>
        </button>
      </div>

      {/* Split Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Complaints Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Feed Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 gap-2">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setStatusFilterTab('all')}
                className={`pb-2 font-bold transition relative ${
                  statusFilterTab === 'all'
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>All My Complaints</span>
                <span className="ml-1.5 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {myComplaints.length}
                </span>
                {statusFilterTab === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setStatusFilterTab('active')}
                className={`pb-2 font-bold transition relative ${
                  statusFilterTab === 'active'
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Active & In Progress</span>
                <span className="ml-1.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {activeComplaints.length}
                </span>
                {statusFilterTab === 'active' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setStatusFilterTab('resolved')}
                className={`pb-2 font-bold transition relative ${
                  statusFilterTab === 'resolved'
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Resolved & Verified</span>
                <span className="ml-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {resolvedComplaints.length}
                </span>
                {statusFilterTab === 'resolved' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full"></span>
                )}
              </button>
            </div>

            <button
              onClick={() => setStatusFilterTab('all')}
              className="text-xs font-semibold text-slate-500 hover:text-violet-600 flex items-center gap-1"
            >
              Reset Filters
            </button>
          </div>

          {/* Complaint Cards */}
          <div className="space-y-4">
            {displayedComplaints.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 animate-fade-in-up">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Complaints in this Category</h4>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">All systems operational or no reported issues found under the selected filter tab.</p>
                <button
                  onClick={openNewComplaintModal}
                  className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Report a Problem Now
                </button>
              </div>
            ) : (
              displayedComplaints.map((c) => {
                const currentStep = getTimelineStepIndex(c.status);
                const isMyComplaint = c.rollNo === studentProfile.rollNo;
                const isSupported = c.supportedStudentIds.includes(studentProfile.rollNo);

                return (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-violet-300 dark:hover:border-violet-800 transition card-interactive"
                  >
                    {/* Header Row: ID, Title, Status, Priority */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                          #{c.id}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {c.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status Pill */}
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                            c.status === 'Resolved' || c.status === 'Student Confirmation'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : c.status === 'In Progress'
                              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.status === 'Resolved' || c.status === 'Student Confirmation'
                                ? 'bg-emerald-500'
                                : c.status === 'In Progress'
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-amber-500'
                            }`}
                          ></span>
                          {c.status}
                        </span>

                        {/* Priority Pill */}
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            c.priority === 'Critical' || c.priority === 'High'
                              ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900'
                              : c.priority === 'Medium'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {c.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Location & Affected Group */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-2.5">
                      <span className="flex items-center gap-1 font-medium">
                        📍 {c.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        👥 {c.affectedGroup || `${c.year} • ${c.section}`} ({c.affectedStudentCount || 1} students affected)
                      </span>
                    </div>

                    {/* Assigned Staff Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold text-[10px] flex items-center justify-center">
                          {c.assignedStaffName
                            ? c.assignedStaffName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                            : 'AD'}
                        </div>
                        <span className="text-slate-600 dark:text-slate-300">
                          {c.assignedStaffName ? (
                            <>
                              Assigned to: <strong className="text-slate-900 dark:text-white">{c.assignedStaffName}</strong> ({c.assignedDepartment})
                            </>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">Under Verification / Awaiting Assignment</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span>Reported: {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        {c.targetSla && (
                          <span className="text-violet-600 dark:text-violet-400 font-semibold">
                            Target SLA: {c.targetSla}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resolution Progress 6-Step Visual Timeline (with "Under Verification") */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Resolution Progress
                      </div>
                      <div className="grid grid-cols-6 gap-1 relative">
                        <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0"></div>

                        {stepsList.map((step, idx) => {
                          const stepNumber = idx + 1;
                          const isCompleted = stepNumber < currentStep;
                          const isCurrent = stepNumber === currentStep;

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : isCurrent
                                    ? 'bg-violet-600 text-white ring-4 ring-violet-100 dark:ring-violet-950 animate-pulse'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                }`}
                              >
                                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stepNumber}
                              </div>
                              <span
                                className={`text-[9px] sm:text-[10px] mt-1 leading-tight font-medium ${
                                  isCurrent
                                    ? 'text-violet-600 dark:text-violet-400 font-bold'
                                    : isCompleted
                                    ? 'text-slate-700 dark:text-slate-300'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RESOLUTION VERIFICATION BOX matching requirement 8 */}
                    {isMyComplaint && c.status === 'Resolved' && (
                      <div className="mt-4 p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Has the problem actually been solved?
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Student Verification Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {c.resolutionProof || 'Technician reported work completed.'} Please check and confirm:
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => confirmComplaintSolved(c.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Yes, Problem Solved</span>
                          </button>
                          <button
                            onClick={() => setReopenTargetId(c.id)}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 dark:border-red-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>No, Problem Still Exists</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Triggers */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDetails(c)}
                          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          View Details & Timeline
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* "I am also facing this problem" button for community problems */}
                        {!isMyComplaint && (
                          <button
                            onClick={() => supportComplaint(c.id)}
                            disabled={isSupported}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                              isSupported
                                ? 'bg-violet-50 dark:bg-violet-950 text-violet-600 border border-violet-200 dark:border-violet-800'
                                : 'bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-950 text-slate-700 dark:text-slate-200 hover:text-violet-600'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isSupported ? 'fill-violet-600' : ''}`} />
                            <span>{isSupported ? 'Supported by you' : 'I am also facing this problem (+1)'}</span>
                            <span className="ml-1 bg-white dark:bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                              {c.affectedStudentCount || 1}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1/3: Hostel Block C Status Card matching requirement 2 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Header: Replaced "Live" with "Current Status" */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base">🏢</span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Hostel {studentProfile.hostelBlock || 'Block C'} Status
                </h3>
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                Current Status
              </span>
            </div>

            {/* Subtext clearly stating latest recorded status */}
            <div className="text-[10px] text-slate-400 mt-2 mb-3">
              Latest recorded system status • Routine verified
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {hostelServices.map((svc) => (
                <div
                  key={svc.service}
                  className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {svc.service}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        svc.status === 'Operational'
                          ? 'bg-emerald-500'
                          : svc.status === 'Degraded'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    ></span>
                    <span
                      className={`text-xs font-bold leading-tight ${
                        svc.status === 'Operational'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : svc.status === 'Degraded'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {svc.status === 'Operational' ? 'Operational' : svc.status === 'Degraded' ? 'Degraded' : svc.status}
                    </span>
                  </div>
                  {svc.note && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {svc.status === 'Degraded' ? '▲ 3rd floor ping high' : svc.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Report Hostel Problem link */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={openNewComplaintModal}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 inline-flex items-center gap-1"
              >
                Report Hostel Problem →
              </button>
            </div>
          </div>

          {/* Quick Grievance Tips Card */}
          <div className="bg-violet-50/70 dark:bg-violet-950/40 rounded-2xl p-4 border border-violet-100 dark:border-violet-900/60">
            <div className="flex items-center gap-2 text-violet-900 dark:text-violet-200 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Smart AI Triage Active</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              When you write your complaint, our Gemini AI instantly predicts the right department, tags the urgency, and checks if someone already reported it.
            </p>
          </div>
        </div>
      </div>

      {/* Reopen Complaint Modal ("No, Problem Still Exists") */}
      {reopenTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>No, Problem Still Exists?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              Please describe what remains broken. The complaint will be reopened under verification, previous resolution history will be preserved, and the administrator will be notified.
            </p>
            <form onSubmit={handleReopenSubmit} className="mt-4 space-y-3">
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. Projector turns on but HDMI input still flickers and turns pink..."
                rows={3}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenTargetId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
                >
                  Reopen Complaint & Notify Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
