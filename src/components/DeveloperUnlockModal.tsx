import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Unlock, X, Sparkles, Key } from 'lucide-react';

interface DeveloperUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperUnlockModal: React.FC<DeveloperUnlockModalProps> = ({ isOpen, onClose }) => {
  const { setIsDeveloperMode, role, developerSwitchRole } = useApp();
  const [targetRole, setTargetRole] = useState<'student' | 'staff' | 'admin'>(
    role === 'developer' ? 'student' : role
  );

  if (!isOpen) return null;

  const handleUnlock = () => {
    setIsDeveloperMode(true);
    developerSwitchRole(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-modal-enter">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-black text-base text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div>Developer / Test Authorization</div>
              <div className="text-[10px] text-slate-400 font-normal">Privileged Developer Mode</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Authorized developer sessions permit live switching between <strong>Student</strong>, <strong>Maintenance Staff</strong>, and <strong>Admin</strong> views to verify access controls and test application workflows.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Select Initial View Upon Unlocking:
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setTargetRole('student')}
                className={`py-2 px-2 rounded-xl text-center font-bold text-xs border transition ${
                  targetRole === 'student'
                    ? 'bg-violet-50 dark:bg-violet-950/70 border-violet-500 text-violet-700 dark:text-violet-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('staff')}
                className={`py-2 px-2 rounded-xl text-center font-bold text-xs border transition ${
                  targetRole === 'staff'
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🔧 Staff
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('admin')}
                className={`py-2 px-2 rounded-xl text-center font-bold text-xs border transition ${
                  targetRole === 'admin'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUnlock}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Authorize & Unlock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
