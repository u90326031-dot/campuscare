import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostelBlock, ComplaintCategory } from '../types';
import {
  Building2,
  Droplets,
  Zap,
  Wifi,
  Sparkles,
  Utensils,
  Bath,
  Home,
  Shield,
  Plus,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

const HOSTEL_SERVICE_CATEGORIES: { name: ComplaintCategory; icon: any; color: string }[] = [
  { name: 'Water Supply', icon: Droplets, color: 'text-blue-500' },
  { name: 'Electrical', icon: Zap, color: 'text-amber-500' },
  { name: 'Wi-Fi & Network', icon: Wifi, color: 'text-violet-500' },
  { name: 'Cleaning', icon: Sparkles, color: 'text-emerald-500' },
  { name: 'Mess Hall', icon: Utensils, color: 'text-orange-500' },
  { name: 'Washroom', icon: Bath, color: 'text-teal-500' },
  { name: 'Room Maintenance', icon: Home, color: 'text-indigo-500' },
  { name: 'Security', icon: Shield, color: 'text-red-500' },
];

export const HostelProblemsView: React.FC = () => {
  const {
    complaints,
    hostelServices,
    studentProfile,
    openNewComplaintModal,
    setSelectedComplaint,
    setIsDetailsModalOpen,
    supportComplaint,
  } = useApp();

  const [selectedBlock, setSelectedBlock] = useState<string>('Block C');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter only hostel complaints
  const hostelComplaints = complaints.filter((c) => {
    if (c.type !== 'hostel') return false;
    if (selectedBlock !== 'all' && c.hostelBlock !== selectedBlock) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-300" />
            <span>Hostel Residence & Infrastructure Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Hostel Life & Grievances
          </h1>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl">
            Dedicated portal completely isolated from academic lab tickets. Track live water, Wi-Fi, electricity, mess food, washrooms, and room repairs for all campus residential blocks.
          </p>
        </div>

        <button
          onClick={openNewComplaintModal}
          className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition active:scale-98 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Report Hostel Problem</span>
        </button>
      </div>

      {/* Block Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Block A', 'Block B', 'Block C', 'Block D'].map((block) => (
          <button
            key={block}
            onClick={() => setSelectedBlock(block)}
            className={`p-4 rounded-2xl border text-left transition card-interactive ${
              selectedBlock === block
                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm">{block}</span>
              {block === (studentProfile.hostelBlock || 'Block C') && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  My Hostel
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {complaints.filter((c) => c.type === 'hostel' && c.hostelBlock === block).length} active tickets
            </div>
          </button>
        ))}
      </div>

      {/* Service Status Board for selected block (Requirement 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏢</span> Current Status — {selectedBlock}
          </h3>
          <span className="text-[10px] text-slate-400">Latest recorded system status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {hostelServices.map((svc) => (
            <div
              key={svc.service}
              className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="text-[11px] font-bold text-slate-500">{svc.service}</div>
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    svc.status === 'Operational'
                      ? 'bg-emerald-500'
                      : svc.status === 'Degraded'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                ></span>
                <span
                  className={`text-xs font-bold ${
                    svc.status === 'Operational'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : svc.status === 'Degraded'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {svc.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{svc.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600'
          }`}
        >
          All Categories
        </button>
        {HOSTEL_SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                selectedCategory === cat.name
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Hostel Complaints Feed */}
      <div className="space-y-4">
        {hostelComplaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              No reported grievances for {selectedBlock} in this category!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              All resident facilities are operating without active complaints.
            </p>
          </div>
        ) : (
          hostelComplaints.map((c) => {
            const isSupported = c.supportedStudentIds?.includes(studentProfile.rollNo);
            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-300 transition card-interactive"
              >
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
                      <span>👥 {c.affectedStudentCount || 1} residents affected</span>
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

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                  {c.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Assigned: <strong>{c.assignedStaffName || 'Pending Triage'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => supportComplaint(c.id)}
                      disabled={isSupported}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                        isSupported
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isSupported ? 'Supported' : 'I am facing this (+1)'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-violet-600 font-bold hover:underline"
                    >
                      View Timeline →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
