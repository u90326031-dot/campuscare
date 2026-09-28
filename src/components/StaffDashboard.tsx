import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  Upload,
  AlertCircle,
  FileCheck,
  Check,
  Calendar,
  User
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    currentStaff,
    currentStaffId,
    setCurrentStaffId,
    staffList,
    complaints,
    isDeveloperMode,
    staffStartWork,
    staffAddUpdate,
    staffCompleteWork,
    setSelectedComplaint,
    setIsDetailsModalOpen,
  } = useApp();

  // Filter complaints strictly assigned to the current staff member
  const myAssignedComplaints = complaints.filter(
    (c) => c.assignedStaffId === currentStaffId
  );

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [activeNoteText, setActiveNoteText] = useState<{ [id: string]: string }>({});
  const [activeProofText, setActiveProofText] = useState<{ [id: string]: string }>({});

  const displayedComplaints = myAssignedComplaints.filter((c) => {
    if (activeTab === 'in_progress') return c.status === 'In Progress';
    if (activeTab === 'completed') return c.status === 'Resolved' || c.status === 'Student Confirmation';
    return true;
  });

  const handlePostNote = async (id: string) => {
    const text = activeNoteText[id];
    if (!text || !text.trim()) return;
    await staffAddUpdate(id, text, activeProofText[id] || undefined);
    setActiveNoteText((prev) => ({ ...prev, [id]: '' }));
    setActiveProofText((prev) => ({ ...prev, [id]: '' }));
  };

  const handleComplete = async (id: string) => {
    const proof = activeProofText[id] || activeNoteText[id] || 'Technician completed repairs, verified functionality.';
    await staffCompleteWork(id, proof);
    setActiveNoteText((prev) => ({ ...prev, [id]: '' }));
    setActiveProofText((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Staff Identity Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-semibold uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-amber-200" />
            <span>Technician Maintenance Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Welcome, {currentStaff?.name || 'Staff Member'}
          </h1>
          <p className="text-amber-100 text-xs mt-1">
            Department: <strong>{currentStaff?.department}</strong> • Direct Phone: {currentStaff?.phone}
          </p>
        </div>

        {/* Staff Switcher: Privileged Developer/Testing Mode Only */}
        {isDeveloperMode ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="text-[10px] text-amber-100 uppercase font-bold block">
                Change Active Technician:
              </label>
              <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-full">Dev Mode</span>
            </div>
            <select
              value={currentStaffId}
              onChange={(e) => setCurrentStaffId(e.target.value)}
              className="bg-white text-slate-900 font-bold text-xs rounded-xl p-2 focus:outline-hidden"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 text-right">
            <span className="text-[10px] text-amber-200 uppercase font-bold block">Verified Technician</span>
            <span className="text-xs font-bold text-white">{currentStaff?.name || 'Staff Member'}</span>
            <span className="text-[11px] text-amber-100 block">{currentStaff?.id} • On Duty</span>
          </div>
        )}
      </div>

      {/* Staff Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-interactive animate-fade-in-up stagger-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Assigned Tasks
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {myAssignedComplaints.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Assigned to your queue</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-interactive animate-fade-in-up stagger-2">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            In Progress Workorders
          </span>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {myAssignedComplaints.filter((c) => c.status === 'In Progress').length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Active on-site troubleshooting</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs card-interactive animate-fade-in-up stagger-3">
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
            Completed / Verified
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {myAssignedComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Student Confirmation').length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Ready or confirmed by student</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Assigned ({myAssignedComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'in_progress'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          In Progress ({myAssignedComplaints.filter((c) => c.status === 'In Progress').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'completed'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Completed ({myAssignedComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Student Confirmation').length})
        </button>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {displayedComplaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">
              No tasks pending in this filter!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up with your maintenance assignments.
            </p>
          </div>
        ) : (
          displayedComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-amber-400 transition"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      #{c.id}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {c.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>📍 {c.location}</span>
                    <span>•</span>
                    <span>👥 {c.affectedStudentCount || 1} students affected</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      c.status === 'Resolved' || c.status === 'Student Confirmation'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : c.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md border border-red-200 bg-red-50 text-red-600">
                    {c.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                {c.description}
              </p>

              {/* Staff Actions Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* If not in progress or resolved, Start Work button */}
                {c.status !== 'In Progress' && c.status !== 'Resolved' && c.status !== 'Student Confirmation' && (
                  <button
                    onClick={() => staffStartWork(c.id, currentStaff?.name || 'Staff')}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Start Work (Move to In Progress)</span>
                  </button>
                )}

                {/* If In Progress, update & complete actions */}
                {c.status === 'In Progress' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Progress Update / Diagnostic Note:
                        </label>
                        <input
                          type="text"
                          value={activeNoteText[c.id] || ''}
                          onChange={(e) =>
                            setActiveNoteText((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          placeholder="e.g. Spliced HDMI connector, replacing faceplate..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Resolution Proof / Part Reference:
                        </label>
                        <input
                          type="text"
                          value={activeProofText[c.id] || ''}
                          onChange={(e) =>
                            setActiveProofText((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          placeholder="e.g. Anchor HDMI Wall Plate v2 installed. Test OK."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handlePostNote(c.id)}
                        disabled={!activeNoteText[c.id]?.trim()}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs disabled:opacity-50"
                      >
                        Post Note
                      </button>
                      <button
                        onClick={() => handleComplete(c.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Work Completed</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* If Resolved */}
                {(c.status === 'Resolved' || c.status === 'Student Confirmation') && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4" /> Work Completed & Documented
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Proof: "{c.resolutionProof || 'Inspected on-site'}"
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
