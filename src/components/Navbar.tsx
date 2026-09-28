import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { DeveloperUnlockModal } from './DeveloperUnlockModal';
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  Shield,
  Wrench,
  GraduationCap,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  AlertTriangle,
  Key,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    role,
    setRole,
    isDeveloperMode,
    developerSwitchRole,
    studentProfile,
    currentStaff,
    staffList,
    currentStaffId,
    setCurrentStaffId,
    complaints,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    openNewComplaintModal,
    setIsProfileModalOpen,
    darkMode,
    setDarkMode,
    setSelectedComplaint,
    setIsDetailsModalOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDevUnlockOpen, setIsDevUnlockOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const myComplaintsCount = complaints.filter((c) => c.rollNo === studentProfile.rollNo).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand matching screenshot */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-200 dark:shadow-none">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.22-1.31C8.63 21.46 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    CampusCare
                  </span>
                  <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    B.Tech Node
                  </span>
                </div>
                <div className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase -mt-0.5">
                  REPORT. RESOLVE. IMPROVE.
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar with ⌘K badge */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints, labs, hostel iss... ⌘K"
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Middle Nav Tabs matching screenshot */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-full transition ${
                activeView === 'dashboard'
                  ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role === 'student' ? 'Student Portal' : role === 'admin' ? 'Admin Control' : 'Staff Workspace'}
            </button>
            <button
              onClick={() => setActiveView(role === 'student' ? 'my-complaints' : role === 'admin' ? 'all-complaints' : 'staff-tasks')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                activeView === 'my-complaints' || activeView === 'all-complaints' || activeView === 'staff-tasks'
                  ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{role === 'student' ? 'My Complaints' : role === 'admin' ? 'All Complaints' : 'My Tasks'}</span>
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {role === 'student' ? myComplaintsCount : complaints.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView('suggestions')}
              className={`px-3 py-1.5 rounded-full transition ${
                activeView === 'suggestions'
                  ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-full transition ${
                activeView === 'map'
                  ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Campus Map
            </button>
          </nav>

          {/* Right Section: Role Switcher Pill + Notifications + Action CTA + Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill Button (Strictly Developer Account Only) or Static Role Badge */}
            {currentUser?.role === 'developer' && isDeveloperMode ? (
              <div className="relative" ref={roleRef}>
                <button
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-2xs"
                  title="Switch Portal Role (Developer Testing Mode)"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="max-w-[130px] sm:max-w-none truncate">
                    {role === 'student' && `Student: ${studentProfile.studentName.split(' ')[0]} (${studentProfile.rollNo})`}
                    {role === 'admin' && `Admin: Campus Operations`}
                    {role === 'staff' && `Staff: ${currentStaff?.name || 'Technician'}`}
                    {role === 'developer' && `Dev: Engineering`}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-normal ml-0.5">▼</span>
                </button>

                {/* Role Switcher Dropdown (Dev Mode only) */}
                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs animate-dropdown-enter">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>Switch Role (Test Mode)</span>
                      <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[9px] px-1.5 py-0.2 rounded-full font-bold">Dev Mode</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      <button
                        onClick={() => {
                          developerSwitchRole('student');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 active:scale-98 ${
                          role === 'student'
                            ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-violet-600" />
                        <div>
                          <div className="font-semibold">Student Portal</div>
                          <div className="text-[10px] text-slate-400">Own complaints only & student confirmation</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          developerSwitchRole('admin');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 active:scale-98 ${
                          role === 'admin'
                            ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Campus Admin</div>
                          <div className="text-[10px] text-slate-400">All complaints, staff assignment & accounts</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          developerSwitchRole('staff');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 active:scale-98 ${
                          role === 'staff'
                            ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Wrench className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-semibold">Maintenance Staff</div>
                          <div className="text-[10px] text-slate-400">Assigned workorders only & proof upload</div>
                        </div>
                      </button>
                    </div>

                    {role === 'staff' && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                          Select Staff Technician:
                        </div>
                        <select
                          value={currentStaffId}
                          onChange={(e) => setCurrentStaffId(e.target.value)}
                          className="w-full mt-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 border border-slate-200 dark:border-slate-700 focus:outline-hidden transition-colors"
                        >
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.department})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 shadow-2xs"
                title="Verified Institutional Role"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="max-w-[140px] sm:max-w-none truncate">
                  {role === 'student' && `Student: ${studentProfile.studentName.split(' ')[0]} (${studentProfile.rollNo})`}
                  {role === 'admin' && `Admin: Operations`}
                  {role === 'staff' && `Staff: ${currentStaff?.name || 'Technician'}`}
                  {role === 'developer' && `Dev: Engineering`}
                </span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-dropdown-enter">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 font-semibold transition-colors duration-150 active:scale-95"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications yet.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.complaintId) {
                              const found = complaints.find((c) => c.id === n.complaintId);
                              if (found) {
                                setSelectedComplaint(found);
                                setIsDetailsModalOpen(true);
                              }
                            }
                            setIsNotifOpen(false);
                          }}
                          className={`pt-2 first:pt-0 cursor-pointer p-2 rounded-xl transition-all duration-150 hover:translate-x-0.5 ${
                            !n.read ? 'bg-violet-50/60 dark:bg-violet-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {n.type === 'reopened' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 animate-bounce" />}
                              {n.type === 'resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              {n.type === 'assigned' && <Clock className="w-3.5 h-3.5 text-violet-500 shrink-0" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help (?) Icon */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90"
              title="Help & Grievance Guidelines"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Primary Action Button: + Report a Problem (Only students and admin) */}
            {role !== 'staff' && (
              <button
                onClick={openNewComplaintModal}
                className="bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs hover:shadow-violet-500/20 flex items-center gap-1.5 transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Report a Problem</span>
                <span className="sm:hidden">Report</span>
              </button>
            )}

            {/* Profile Avatar Circle */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-violet-200 dark:ring-violet-900 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs focus:outline-hidden cursor-pointer"
              title="View & Edit Profile"
            >
              {role === 'student' ? studentProfile.avatar || 'AS' : role === 'admin' ? 'AD' : currentStaff?.avatar || 'RK'}
            </button>

            {/* Logout Action */}
            <button
              onClick={logout}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title="Log Out of CampusCare"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Developer Unlock Modal - strictly restricted to Developer account */}
      {currentUser?.role === 'developer' && (
        <DeveloperUnlockModal isOpen={isDevUnlockOpen} onClose={() => setIsDevUnlockOpen(false)} />
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-modal-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-violet-600" />
                CampusCare Grievance Guide
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Academic Problems:</strong> Report broken projectors, lab equipment, computers, lighting, or classroom furniture. Auto-routed to Lab/Electrical staff.
              </p>
              <p>
                <strong>Hostel Problems:</strong> Dedicated for Block A-D water, electricity, Wi-Fi, washrooms, mess food, and room maintenance.
              </p>
              <p>
                <strong>AI Complaint Assistant:</strong> Powered by Gemini AI. Summarizes your description, recommends the right department, and flags priority.
              </p>
              <p>
                <strong>Similar Problem Detection:</strong> If someone already reported the same issue, support it with <em>"I am also facing this problem"</em> instead of creating duplicates!
              </p>
              <p>
                <strong>Student Confirmation:</strong> Once staff resolves the complaint, verify it. If unresolved, click <em>"Problem Still Exists"</em> to reopen immediately.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="bg-violet-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-violet-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
