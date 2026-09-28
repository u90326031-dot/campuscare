import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AccessDeniedViewProps {
  title?: string;
  message?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  title = 'Access Denied',
  message = 'You do not have the required permissions to view this section.'
}) => {
  const { role, setActiveView } = useApp();

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-3xl p-8 max-w-md w-full text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>

        <div className="pt-2">
          <button
            onClick={() => setActiveView(role === 'staff' ? 'staff-tasks' : 'dashboard')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {role === 'staff' ? 'My Assigned Tasks' : 'Dashboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
