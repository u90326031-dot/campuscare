import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Wrench,
  Shield,
  Lock,
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const DeveloperBar: React.FC = () => {
  const {
    currentUser,
    isDeveloperMode,
    setIsDeveloperMode,
    role,
    developerSwitchRole,
    studentProfile,
    studentProfilesList,
    staffList,
    currentStaffId,
    setCurrentStaffId,
    switchStudentProfile,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  // Requirement 3: Only the designated Developer account is allowed to see or use Developer / Test Mode
  if (!isDeveloperMode || currentUser?.role !== 'developer') {
    return null;
  }

  return (
    <div className="bg-slate-900 border-b border-indigo-500/30 text-white px-3 sm:px-6 py-2 shadow-lg relative z-50 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Privileged Developer Account Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Developer / Test Mode</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
            <span>Privileged Account:</span>
            <span className="text-slate-200 font-medium">CampusCare Engineering</span>
          </div>
        </div>

        {/* Center: Instant Role Switcher for Testing */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => developerSwitchRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition ${
              role === 'student'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Switch to Student View (See only own complaints, view student profile)"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>

          <button
            type="button"
            onClick={() => developerSwitchRole('staff')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition ${
              role === 'staff'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Switch to Maintenance Staff View (See only assigned tasks, submit proofs)"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Staff View</span>
          </button>

          <button
            type="button"
            onClick={() => developerSwitchRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Switch to Admin View (See all complaints, assign staff, radar & analytics)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin View</span>
          </button>
        </div>

        {/* Right: Active Test Persona Selector & Lock Normal Mode */}
        <div className="flex items-center gap-2">
          {/* Sub-selector for Student View: Pick student to test */}
          {role === 'student' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium"
                title="Select Student Account to Test"
              >
                <span>Student: <strong>{studentProfile.studentName.split(' ')[0]} ({studentProfile.rollNo})</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-1.5 z-50 animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700 mb-1">
                    Select Test Student Profile:
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {studentProfilesList.map((p) => (
                      <button
                        key={p.rollNo}
                        type="button"
                        onClick={() => {
                          switchStudentProfile(p.rollNo);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          p.rollNo === studentProfile.rollNo
                            ? 'bg-violet-600/40 text-violet-200 font-bold'
                            : 'hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{p.studentName}</div>
                          <div className="text-[10px] text-slate-400">{p.rollNo} • {p.branch.split(' ')[0]}</div>
                        </div>
                        {p.rollNo === studentProfile.rollNo && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-selector for Staff View: Pick technician to test */}
          {role === 'staff' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium"
                title="Select Technician to Test"
              >
                <span>Tech: <strong>{staffList.find(s => s.id === currentStaffId)?.name || 'Technician'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-1.5 z-50 animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700 mb-1">
                    Select Test Technician:
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {staffList.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setCurrentStaffId(s.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          s.id === currentStaffId
                            ? 'bg-amber-600/40 text-amber-200 font-bold'
                            : 'hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.department}</div>
                        </div>
                        {s.id === currentStaffId && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lock / Test as Normal User button */}
          <button
            type="button"
            onClick={() => setIsDeveloperMode(false)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition font-medium text-[11px]"
            title="Lock as Normal User (Role switching will be hidden to verify security)"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Test Normal User Mode</span>
            <span className="sm:hidden">Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
