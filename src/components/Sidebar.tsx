import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FilePlus,
  ListTodo,
  Lightbulb,
  MapPin,
  Bell,
  User,
  Home,
  Building2,
  Radar,
  BarChart3,
  Users2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    logout,
    role,
    activeView,
    setActiveView,
    complaints,
    suggestions,
    notifications,
    studentProfile,
    studentStats,
    staffStats,
    radarAlerts,
    openNewComplaintModal,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const myComplaintsCount = complaints.filter((c) => c.rollNo === studentProfile.rollNo).length;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Top Identity Card matching screenshot */}
      <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {role === 'student' ? '🎓' : role === 'admin' ? '🛡️' : '🔧'}
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
              CampusCare
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
              {role === 'student' ? 'Student Portal' : role === 'admin' ? 'Admin Portal' : 'Staff Portal'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </div>
      </div>

      {/* Main CTA Button: + Report a Problem (Students and Admin) */}
      {role !== 'staff' && (
        <button
          onClick={openNewComplaintModal}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-violet-200 dark:shadow-none transition active:scale-98 mb-5"
        >
          <FilePlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Report a Problem</span>
        </button>
      )}

      {/* Navigation Groups */}
      <div className="space-y-6 text-xs font-medium">
        {/* Core Menu */}
        <div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'dashboard'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            {role !== 'staff' && (
              <button
                onClick={openNewComplaintModal}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <FilePlus className="w-4 h-4" />
                  <span>Report a Problem</span>
                </div>
                <span className="text-[10px] text-violet-600 dark:text-violet-400 font-bold bg-violet-50 dark:bg-violet-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveView(role === 'student' ? 'my-complaints' : role === 'admin' ? 'all-complaints' : 'staff-tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'my-complaints' || activeView === 'all-complaints' || activeView === 'staff-tasks'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ListTodo className="w-4 h-4" />
                <span>{role === 'student' ? 'My Complaints' : role === 'admin' ? 'All Complaints' : 'My Tasks'}</span>
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {role === 'student' ? myComplaintsCount : role === 'admin' ? complaints.length : staffStats.assignedTotal}
              </span>
            </button>

            <button
              onClick={() => setActiveView('suggestions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'suggestions'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4" />
                <span>Suggestions</span>
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {suggestions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('map')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'map'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Campus Problem Map</span>
              </div>
            </button>

            <button
              onClick={() => setActiveView('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'notifications'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeView === 'profile'
                  ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: HOSTEL RESIDENCE (Student Portal only) */}
        {role === 'student' && (
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              Hostel Residence
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView('hostel')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'hostel'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span>My Hostel ({studentProfile.hostelBlock || 'Block C'})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveView('hostel-problems')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'hostel-problems'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4" />
                  <span>Hostel Problems</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Section: ADMIN EXCLUSIVES */}
        {role === 'admin' && (
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Admin Controls
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView('admin-accounts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'admin-accounts'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users2 className="w-4 h-4 text-violet-600" />
                  <span>Manage Accounts</span>
                </div>
              </button>

              <button
                onClick={() => setActiveView('admin-radar')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'admin-radar'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radar className="w-4 h-4 text-red-500 animate-spin-slow" />
                  <span>Problem Radar</span>
                </div>
                {radarAlerts.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {radarAlerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveView('admin-analytics')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'admin-analytics'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Analytics & SLA</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Section: STAFF EXCLUSIVES */}
        {role === 'staff' && (
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              Staff Execution
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView('staff-tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  activeView === 'staff-tasks'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Workorders</span>
                </div>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {staffStats.assignedTotal}
                </span>
              </button>
            </div>
          </div>
        )}
        {/* Sign Out Action */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-xs font-semibold"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Mini Status */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>CampusCare v2.4</span>
        <span className="text-emerald-500 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Cloud Sync
        </span>
      </div>
    </aside>
  );
};
