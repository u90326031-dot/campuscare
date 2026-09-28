import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, darkMode, setDarkMode } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your campus email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.22-1.31C8.63 21.46 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                CampusCare
              </span>
              <span className="bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                B.Tech Node
              </span>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
              Smart Grievance & Facility Portal
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90 shadow-2xs hover:shadow-xs"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
          )}
        </button>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 animate-modal-enter transition-shadow duration-300 hover:shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in to CampusCare
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Enter your authorized institutional email and password to access student grievances, maintenance tasks, or campus operations.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500 animate-pulse" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Campus Email Address
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav.sharma@campuscare.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-transform duration-150 active:scale-90"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Role Fill for Testing */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Quick Test Credentials:</span>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('student@campuscare.edu');
                  setPassword('Student@123');
                  setErrorMessage(null);
                }}
                className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-400 text-slate-700 dark:text-slate-200 font-medium text-left transition active:scale-95 flex items-center justify-between"
              >
                <span>🎓 Student</span>
                <span className="text-[9px] text-slate-400">Aarav</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('staff@campuscare.edu');
                  setPassword('Staff@123');
                  setErrorMessage(null);
                }}
                className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200 font-medium text-left transition active:scale-95 flex items-center justify-between"
              >
                <span>🔧 Staff</span>
                <span className="text-[9px] text-slate-400">Rajesh</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@campuscare.edu');
                  setPassword('Admin@123');
                  setErrorMessage(null);
                }}
                className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 font-medium text-left transition active:scale-95 flex items-center justify-between"
              >
                <span>🛡️ Admin</span>
                <span className="text-[9px] text-slate-400">Operations</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('developer@campuscare.edu');
                  setPassword('Developer@123');
                  setErrorMessage(null);
                }}
                className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium text-left transition active:scale-95 flex items-center justify-between"
              >
                <span>⚡ Developer</span>
                <span className="text-[9px] text-slate-400">All Roles</span>
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
            Institutional Role-Based Access Control (RBAC) enforced. Self-registration is restricted to institutional administration.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto p-4 text-center text-xs text-slate-400 dark:text-slate-600">
        CampusCare Smart Grievance Portal &copy; 2026. Secure Role-Based Access Control (RBAC).
      </footer>
    </div>
  );
};
