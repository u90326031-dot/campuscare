import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeveloperBar } from './components/DeveloperBar';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { CampusMap } from './components/CampusMap';
import { SuggestionsView } from './components/SuggestionsView';
import { HostelProblemsView } from './components/HostelProblemsView';
import { ProfileView } from './components/ProfileView';
import { AccessDeniedView } from './components/AccessDeniedView';
import { ReportProblemModal } from './components/ReportProblemModal';
import { ComplaintDetailsModal } from './components/ComplaintDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { LoginScreen } from './components/LoginScreen';
import {
  LayoutDashboard,
  ListTodo,
  Lightbulb,
  MapPin,
  Building,
  Plus,
  Shield,
  Wrench,
  User
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentUser,
    role,
    activeView,
    setActiveView,
    isReportModalOpen,
    reportModalKey,
    openNewComplaintModal,
  } = useApp();

  const renderActiveView = () => {
    // ROUTE-LEVEL AUTHORIZATION GUARDS:
    // Make sure a Student cannot access Admin/Staff data even by changing routes or frontend values
    if (role === 'student') {
      if (['all-complaints', 'admin-radar', 'admin-analytics', 'admin-accounts'].includes(activeView)) {
        return (
          <AccessDeniedView
            title="Administrator Privileges Required"
            message="Student accounts are strictly restricted from accessing campus administration, grievance triage, problem radar, and student database management."
          />
        );
      }
      if (activeView === 'staff-tasks') {
        return (
          <AccessDeniedView
            title="Maintenance Staff Privileges Required"
            message="Student accounts cannot access maintenance staff execution workspaces or assigned workorders."
          />
        );
      }
    }

    if (role === 'staff') {
      if (['all-complaints', 'admin-radar', 'admin-analytics', 'admin-accounts'].includes(activeView)) {
        return (
          <AccessDeniedView
            title="Administrator Privileges Required"
            message="Maintenance staff members are only authorized to view workorders directly assigned to their technician account."
          />
        );
      }
    }

    switch (activeView) {
      case 'dashboard':
        if (role === 'admin') return <AdminDashboard />;
        if (role === 'staff') return <StaffDashboard />;
        return <StudentDashboard />;

      case 'my-complaints':
        if (role === 'staff') return <StaffDashboard />;
        if (role === 'admin') return <AdminDashboard />;
        return <StudentDashboard />;

      case 'all-complaints':
      case 'admin-radar':
      case 'admin-analytics':
      case 'admin-accounts':
        if (role === 'admin') return <AdminDashboard />;
        return (
          <AccessDeniedView
            title="Administrator Privileges Required"
            message="This section is restricted to campus operations administrators."
          />
        );

      case 'staff-tasks':
        if (role === 'staff' || role === 'admin') return <StaffDashboard />;
        return (
          <AccessDeniedView
            title="Staff Privileges Required"
            message="This workspace is restricted to maintenance staff technicians."
          />
        );

      case 'map':
        return <CampusMap />;

      case 'suggestions':
        return <SuggestionsView />;

      case 'hostel':
      case 'hostel-problems':
        return <HostelProblemsView />;

      case 'profile':
        return <ProfileView />;

      default:
        if (role === 'admin') return <AdminDashboard />;
        if (role === 'staff') return <StaffDashboard />;
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Privileged Developer / Testing Mode Bar - strictly isolated to the single authorized Developer account */}
      {currentUser?.role === 'developer' && <DeveloperBar />}

      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-0">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div key={activeView} className="animate-fade-in-up">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar tailored to role */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
            activeView === 'dashboard' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView(role === 'student' ? 'my-complaints' : role === 'admin' ? 'all-complaints' : 'staff-tasks')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
            activeView === 'my-complaints' || activeView === 'all-complaints' || activeView === 'staff-tasks' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>{role === 'staff' ? 'Tasks' : 'Complaints'}</span>
        </button>

        {/* Center Floating Plus Action (for students and admin to file complaints) */}
        {role !== 'staff' && (
          <button
            onClick={openNewComplaintModal}
            className="w-10 h-10 -mt-5 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg hover:shadow-violet-500/30 transition-all duration-200 active:scale-90 hover:scale-105"
            title="Report a Problem"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {role === 'student' && (
          <>
            <button
              onClick={() => setActiveView('suggestions')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                activeView === 'suggestions' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Ideas</span>
            </button>

            <button
              onClick={() => setActiveView('hostel')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                activeView === 'hostel' || activeView === 'hostel-problems' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Hostel</span>
            </button>
          </>
        )}

        {role === 'staff' && (
          <button
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
              activeView === 'profile' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        )}

        {role === 'admin' && (
          <>
            <button
              onClick={() => setActiveView('admin-radar')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                activeView === 'admin-radar' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
                activeView === 'profile' ? 'text-violet-600 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </>
        )}
      </div>

      {/* Global Modals */}
      {isReportModalOpen && <ReportProblemModal key={reportModalKey} />}
      <ComplaintDetailsModal />
      <ProfileModal />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, isAuthLoading } = useApp();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white mb-4 animate-pulse shadow-lg shadow-violet-500/30">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.22-1.31C8.63 21.46 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
          </svg>
        </div>
        <div className="font-extrabold text-base text-slate-800 dark:text-slate-200">
          CampusCare Grievance Portal
        </div>
        <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying institutional authentication session...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
