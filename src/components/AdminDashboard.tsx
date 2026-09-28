import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  AcademicBranch,
  AcademicYear,
  HostelBlock,
  ProblemRadarItem
} from '../types';
import { DEPARTMENTS } from '../lib/seedData';
import {
  Shield,
  Search,
  Filter,
  BarChart3,
  Radar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Building,
  School,
  FileText,
  UserCheck,
  TrendingUp,
  Tag,
  ArrowRight,
  Eye,
  RefreshCw,
  XCircle,
  Home
} from 'lucide-react';

import { AdminAccountsManager } from './AdminAccountsManager';

export const AdminDashboard: React.FC = () => {
  const {
    complaints,
    adminStats,
    staffList,
    radarAlerts,
    adminAssignComplaint,
    updateComplaintStatus,
    adminVerifyComplaint,
    setSelectedComplaint,
    setIsDetailsModalOpen,
    activeView,
    setActiveView
  } = useApp();

  const [adminSection, setAdminSection] = useState<'complaints' | 'accounts' | 'radar'>('complaints');

  React.useEffect(() => {
    if (activeView === 'admin-accounts') {
      setAdminSection('accounts');
    } else if (activeView === 'admin-radar') {
      setAdminSection('radar');
    }
  }, [activeView]);

  // Filters required: Status, Priority, Branch, Year, Section, College / Hostel, Department, Category
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all'); // College / Hostel
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Selected radar item to view underlying complaints
  const [viewingRadar, setViewingRadar] = useState<ProblemRadarItem | null>(null);

  // Dynamic status counts for quick tabs
  const statusCounts = useMemo(() => {
    return {
      all: complaints.length,
      submitted: complaints.filter((c) => c.status === 'Submitted').length,
      underVerification: complaints.filter((c) => c.status === 'Under Verification').length,
      assigned: complaints.filter((c) => c.status === 'Assigned').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved' || c.status === 'Student Confirmation').length,
      rejected: complaints.filter((c) => c.status === 'Rejected').length,
    };
  }, [complaints]);

  // Filtered complaints matching all criteria & search
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search by: Complaint ID, student, location, title, description
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const matchesId = c.id.toLowerCase().includes(q) || `#${c.id.toLowerCase()}`.includes(q);
        const matchesStudent =
          c.studentName.toLowerCase().includes(q) ||
          c.rollNo.toLowerCase().includes(q) ||
          c.studentId.toLowerCase().includes(q);
        const matchesLocation =
          c.location.toLowerCase().includes(q) ||
          (c.collegeBuilding && c.collegeBuilding.toLowerCase().includes(q)) ||
          (c.collegeRoom && c.collegeRoom.toLowerCase().includes(q)) ||
          (c.hostelBlock && c.hostelBlock.toLowerCase().includes(q)) ||
          (c.hostelRoom && c.hostelRoom.toLowerCase().includes(q));
        const matchesText =
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q);

        if (!matchesId && !matchesStudent && !matchesLocation && !matchesText) {
          return false;
        }
      }

      // Filter by Status
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;

      // Filter by Priority
      if (filterPriority !== 'all' && c.priority !== filterPriority) return false;

      // Filter by Branch
      if (filterBranch !== 'all' && c.branch !== filterBranch) return false;

      // Filter by Year
      if (filterYear !== 'all' && c.year !== filterYear) return false;

      // Filter by Section
      if (filterSection !== 'all' && c.section !== filterSection) return false;

      // Filter by College / Hostel
      if (filterType !== 'all' && c.type !== filterType) return false;

      // Filter by Department
      if (filterDepartment !== 'all' && c.assignedDepartment !== filterDepartment) return false;

      // Filter by Category
      if (filterCategory !== 'all' && c.category !== filterCategory) return false;

      return true;
    });
  }, [
    complaints,
    searchTerm,
    filterStatus,
    filterPriority,
    filterBranch,
    filterYear,
    filterSection,
    filterType,
    filterDepartment,
    filterCategory,
  ]);

  const handleOpenDetails = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsDetailsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterBranch('all');
    setFilterYear('all');
    setFilterSection('all');
    setFilterType('all');
    setFilterDepartment('all');
    setFilterCategory('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time Dynamic Metrics */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-violet-300" />
            <span>Admin Portal → All Complaints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Grievance Command Center
          </h1>
          <p className="text-violet-200 text-xs mt-1 max-w-xl">
            Live database triage, staff dispatch, multi-parameter filtering, and automated Problem Radar detection using stored complaint records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 text-center">
            <div className="text-2xl font-black">{adminStats.total}</div>
            <div className="text-[10px] text-violet-200 uppercase font-semibold">Total Complaints</div>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md border border-amber-400/30 rounded-2xl px-4 py-2.5 text-center text-amber-300">
            <div className="text-2xl font-black">{adminStats.pending}</div>
            <div className="text-[10px] uppercase font-semibold">Pending Triage</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-2xl px-4 py-2.5 text-center text-emerald-300">
            <div className="text-2xl font-black">{adminStats.resolved}</div>
            <div className="text-[10px] uppercase font-semibold">Resolved Solved</div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Navigation Command Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdminSection('complaints')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminSection === 'complaints'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Complaints ({complaints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSection('accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminSection === 'accounts'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Accounts (Students & Staff)</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Administrator Role: Institutional Full Access
        </div>
      </div>

      {/* RENDER ACCOUNTS MANAGER VIEW */}
      {adminSection === 'accounts' && <AdminAccountsManager />}

      {/* RENDER COMPLAINTS & TRIAGE VIEW */}
      {adminSection !== 'accounts' && (
        <>
      {/* DYNAMIC ANALYTICS SUMMARY CARDS (Calculated directly from live database records) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Complaints</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{adminStats.total}</div>
          <span className="text-[10px] text-slate-500">{adminStats.collegeCount} College • {adminStats.hostelCount} Hostel</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-2">
          <span className="text-[10px] uppercase font-bold text-amber-500">Under Verification</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{adminStats.pending}</div>
          <span className="text-[10px] text-slate-500">Awaiting admin triage</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-3">
          <span className="text-[10px] uppercase font-bold text-purple-500">Assigned Staff</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{statusCounts.assigned}</div>
          <span className="text-[10px] text-slate-500">Ready for execution</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-4">
          <span className="text-[10px] uppercase font-bold text-blue-500">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{adminStats.inProgress}</div>
          <span className="text-[10px] text-slate-500">Active maintenance</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-5">
          <span className="text-[10px] uppercase font-bold text-emerald-500">Resolved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{adminStats.resolved}</div>
          <span className="text-[10px] text-slate-500">Verified by student</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 card-interactive animate-fade-in-up stagger-6">
          <span className="text-[10px] uppercase font-bold text-red-500">Critical Priority</span>
          <div className="text-2xl font-black text-red-600 mt-1">{adminStats.critical}</div>
          <span className="text-[10px] text-slate-500">{adminStats.reopenedCount} reopened alerts</span>
        </div>
      </div>

      {/* PROBLEM RADAR ALERT SECTION (Calculated from actual database records) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 flex items-center justify-center font-bold">
              <Radar className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Problem Radar
                </h3>
                <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Recurring Alerts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pattern recognition clustering actual stored complaint records by location, recurrence, and student impact.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {radarAlerts.length} Active Hotspot{radarAlerts.length !== 1 ? 's' : ''} Detected
          </span>
        </div>

        {/* Radar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {radarAlerts.map((radar) => (
            <div
              key={radar.id}
              className="p-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                    Recurring Problem Detected
                  </span>
                  <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trend: {radar.trend}
                  </span>
                </div>

                <div className="mt-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Location: <strong className="text-slate-900 dark:text-white">{radar.location}</strong>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    Branch & Year: <strong>{radar.branch || 'Multiple Depts'} {radar.year ? `(${radar.year})` : ''}</strong>
                  </div>
                  <h4 className="font-extrabold text-sm text-red-700 dark:text-red-400 mt-1 leading-snug">
                    Problem: {radar.problem}
                  </h4>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-red-100 dark:border-red-950 mt-2.5">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Complaints</span>
                    <span className="font-black text-sm text-red-600">{radar.complaintCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Affected</span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">{radar.affectedStudentCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Period</span>
                    <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">{radar.timeWindow}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block">Priority</span>
                    <span className="font-bold text-[11px] text-red-600 uppercase">{radar.priority}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  💡 <strong>Advisory:</strong> {radar.recommendation}
                </p>
              </div>

              <div className="pt-2 border-t border-red-100 dark:border-red-950/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {radar.complaintIds.length} Linked Ticket{radar.complaintIds.length !== 1 ? 's' : ''} in DB
                </span>
                <button
                  onClick={() => setViewingRadar(radar)}
                  className="text-xs font-bold text-red-700 dark:text-red-300 hover:text-red-900 flex items-center gap-1 underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Open Underlying Complaints ({radar.complaintIds.length})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK STATUS TABS WITH DYNAMIC COUNTS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'all'
              ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>All Complaints</span>
          <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.all}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('Submitted')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'Submitted'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Submitted</span>
          <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.submitted}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('Under Verification')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'Under Verification'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Under Verification</span>
          <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.underVerification}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('Assigned')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'Assigned'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Assigned</span>
          <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.assigned}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('In Progress')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'In Progress'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>In Progress</span>
          <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.inProgress}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('Resolved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'Resolved'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Resolved</span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.resolved}
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('Rejected')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterStatus === 'Rejected'
              ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Rejected</span>
          <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 px-1.5 py-0.2 rounded-full text-[10px]">
            {statusCounts.rejected}
          </span>
        </button>
      </div>

      {/* MULTI-FILTER CONTROL BAR (All requested filters + search by Complaint ID, Student, Location) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search by Complaint ID, Student, Location */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Complaint ID, student, roll no, location..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-slate-500">
            <span>Showing {filteredComplaints.length} of {complaints.length} tickets</span>
            <button
              onClick={handleResetFilters}
              className="text-violet-600 hover:text-violet-800 dark:text-violet-400 font-bold ml-2 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All Filters
            </button>
          </div>
        </div>

        {/* 8 Filter Dropdowns matching all requirements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          {/* 1. Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* 2. Priority Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* 3. Branch Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Branch</label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Electrical & Electronics">EEE</option>
              <option value="Mechanical Engineering">Mech</option>
              <option value="Civil Engineering">Civil</option>
              <option value="Information Technology">IT</option>
              <option value="Artificial Intelligence & Data Science">AI & DS</option>
            </select>
          </div>

          {/* 4. Year Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* 5. Section Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Section</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Sections</option>
              <option value="Section A">Sec A</option>
              <option value="Section B">Sec B</option>
              <option value="Section C">Sec C</option>
              <option value="Section D">Sec D</option>
            </select>
          </div>

          {/* 6. College / Hostel Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">College / Hostel</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Domains</option>
              <option value="college">College Only</option>
              <option value="hostel">Hostel Only</option>
            </select>
          </div>

          {/* 7. Department Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* 8. Category Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Categories</option>
              <option value="Laboratory Equipment">Lab Equipment</option>
              <option value="Classroom & Labs">Classrooms</option>
              <option value="Electrical">Electrical</option>
              <option value="Wi-Fi & Network">Wi-Fi & Net</option>
              <option value="Water Supply">Water</option>
              <option value="Washroom">Washroom</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Mess Hall">Mess Hall</option>
              <option value="Room Maintenance">Room Maint.</option>
              <option value="Furniture">Furniture</option>
              <option value="Security">Security</option>
              <option value="Library">Library</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* ALL COMPLAINTS MANAGEMENT TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Complaint ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Domain & Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Department & Staff</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-slate-600 dark:text-slate-300">No complaints found</p>
                      <p className="text-[11px] text-slate-400">No records match the current filter or search criteria.</p>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-violet-600 font-bold hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((comp) => (
                  <tr
                    key={comp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => handleOpenDetails(comp)}
                  >
                    {/* Complaint ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap">
                      #{comp.id}
                      {comp.reopenedCount && comp.reopenedCount > 0 ? (
                        <span className="block text-[9px] text-red-500 font-sans font-bold">
                          ⚠️ Reopened ({comp.reopenedCount}x)
                        </span>
                      ) : null}
                    </td>

                    {/* Student Information */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {comp.studentName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {comp.rollNo} • {comp.branch.split(' ')[0]} ({comp.year.slice(0, 3)} {comp.section})
                      </div>
                    </td>

                    {/* Domain & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                          comp.type === 'college'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {comp.type === 'college' ? 'College' : 'Hostel'}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          {comp.location}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        👥 {comp.affectedStudentCount || 1} student{(comp.affectedStudentCount || 1) !== 1 ? 's' : ''} affected
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                        {comp.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          comp.priority === 'Critical' || comp.priority === 'High'
                            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900'
                            : comp.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {comp.priority}
                      </span>
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          comp.status === 'Resolved' || comp.status === 'Student Confirmation'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : comp.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : comp.status === 'Assigned'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                            : comp.status === 'Under Verification'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : comp.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : 'bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {comp.status}
                      </span>
                    </td>

                    {/* Department & Assigned Staff */}
                    <td className="py-3.5 px-4">
                      {comp.assignedStaffName ? (
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {comp.assignedStaffName}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {comp.assignedDepartment}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                          {comp.status === 'Submitted' ? 'Needs Verification' : 'Awaiting Assignment'}
                        </span>
                      )}
                    </td>

                    {/* Clickable "View Details" action */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleOpenDetails(comp)}
                        className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition active:scale-95"
                        title="Open Complete Complaint Details & Management Panel"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* MODAL: UNDERLYING COMPLAINTS FROM RADAR */}
      {viewingRadar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Problem Radar Cluster
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                  {viewingRadar.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewingRadar.problem} • {viewingRadar.location}
                </p>
              </div>
              <button
                onClick={() => setViewingRadar(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Underlying Complaint Records ({viewingRadar.complaintIds.length}):
              </div>

              {complaints
                .filter((c) => viewingRadar.complaintIds.includes(c.id))
                .map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-violet-600">#{comp.id}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{comp.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Reported by {comp.studentName} ({comp.rollNo}) • 👥 {comp.affectedStudentCount || 1} students affected
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                        {comp.status}
                      </span>
                      <button
                        onClick={() => {
                          setViewingRadar(null);
                          handleOpenDetails(comp);
                        }}
                        className="text-violet-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingRadar(null)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
