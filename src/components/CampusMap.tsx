import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import {
  MapPin,
  Layers,
  Filter,
  AlertTriangle,
  Building,
  School,
  ExternalLink,
  ThumbsUp,
  Sparkles
} from 'lucide-react';

interface CampusZone {
  id: string;
  name: string;
  type: 'academic' | 'hostel' | 'facility';
  x: number; // percentage
  y: number; // percentage
  description: string;
}

const CAMPUS_ZONES: CampusZone[] = [
  { id: 'ab1', name: 'Academic Block 1', type: 'academic', x: 22, y: 30, description: 'Civil, Mechanical Depts & Administrative Offices' },
  { id: 'ab2', name: 'Academic Block 2 (CSE / IT)', type: 'academic', x: 42, y: 25, description: 'CSE Labs 1-4, Server Rooms, AI Lab' },
  { id: 'ab3', name: 'Academic Block 3', type: 'academic', x: 62, y: 32, description: 'ECE, EEE Depts, Robotics Lab' },
  { id: 'lib', name: 'Central Library', type: 'facility', x: 38, y: 52, description: 'Reference Halls, Digital Archive, Study Sections' },
  { id: 'hostel-c', name: 'Hostel Block C', type: 'hostel', x: 78, y: 22, description: 'Boys Residence 1st-4th Floors' },
  { id: 'hostel-d', name: 'Hostel Block D', type: 'hostel', x: 80, y: 55, description: 'Girls Residence & Garden' },
  { id: 'hostel-a', name: 'Hostel Block A & B', type: 'hostel', x: 82, y: 78, description: 'Senior & Research Scholar Residence' },
  { id: 'mess', name: 'Central Dining Hall', type: 'facility', x: 60, y: 68, description: 'Mess Halls A, B & C' },
  { id: 'sports', name: 'Sports Complex & Ground', type: 'facility', x: 20, y: 75, description: 'Indoor Badminton, Gym, Stadium Walkway' },
];

export const CampusMap: React.FC = () => {
  const {
    complaints,
    setSelectedComplaint,
    setIsDetailsModalOpen,
    studentProfile,
    supportComplaint,
    openNewComplaintModal,
  } = useApp();

  const [selectedZone, setSelectedZone] = useState<CampusZone | null>(CAMPUS_ZONES[1]);
  const [mapFilter, setMapFilter] = useState<'all' | 'academic' | 'hostel' | 'facility'>('all');

  // Match complaints to zones
  const getZoneComplaints = (zone: CampusZone) => {
    return complaints.filter((c) => {
      const loc = c.location.toLowerCase();
      if (zone.id === 'ab2' && (loc.includes('academic block 2') || loc.includes('cse lab') || loc.includes('block 2'))) return true;
      if (zone.id === 'ab1' && (loc.includes('academic block 1') || loc.includes('block 1'))) return true;
      if (zone.id === 'ab3' && (loc.includes('academic block 3') || loc.includes('block 3'))) return true;
      if (zone.id === 'lib' && (loc.includes('library') || loc.includes('reference'))) return true;
      if (zone.id === 'hostel-c' && (loc.includes('block c') || loc.includes('hostel block c'))) return true;
      if (zone.id === 'hostel-d' && (loc.includes('block d') || loc.includes('hostel block d'))) return true;
      if (zone.id === 'hostel-a' && (loc.includes('block a') || loc.includes('block b'))) return true;
      if (zone.id === 'mess' && (loc.includes('mess') || loc.includes('dining'))) return true;
      if (zone.id === 'sports' && (loc.includes('sports') || loc.includes('ground') || loc.includes('walkway'))) return true;
      return false;
    });
  };

  const activeZoneComplaints = selectedZone ? getZoneComplaints(selectedZone) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-violet-600" />
            Campus Problem Map & Geotagged Grievances
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any campus building or facility node to inspect active incidents and hotspot recurrence.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setMapFilter('all')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              mapFilter === 'all'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => setMapFilter('academic')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              mapFilter === 'academic'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setMapFilter('hostel')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              mapFilter === 'hostel'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Hostels
          </button>
          <button
            onClick={() => setMapFilter('facility')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              mapFilter === 'facility'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Facilities
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Canvas (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative min-h-[460px] overflow-hidden shadow-xl border border-slate-800 select-none">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px] opacity-40"></div>

          {/* Map Compass & Legend */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              Interactive Campus GIS
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Critical / Recurring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Active Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>All Clear / Resolved</span>
            </div>
          </div>

          {/* Interactive Zone Pins */}
          {CAMPUS_ZONES.map((zone) => {
            if (mapFilter !== 'all' && zone.type !== mapFilter) return null;
            const zoneComps = getZoneComplaints(zone);
            const count = zoneComps.length;
            const hasCritical = zoneComps.some((c) => c.priority === 'Critical' || c.priority === 'High');
            const isSelected = selectedZone?.id === zone.id;

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{ top: `${zone.y}%`, left: `${zone.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform duration-200 hover:scale-110"
              >
                <div className="flex flex-col items-center">
                  {/* Pin Circle */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-lg transition ${
                      isSelected
                        ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                        : ''
                    } ${
                      count > 0 && hasCritical
                        ? 'bg-red-600 animate-pulse'
                        : count > 0
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {zone.id === 'ab2' ? 'Lab 3' : count > 0 ? count : '✓'}
                  </div>

                  {/* Label Pill */}
                  <div
                    className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-md ${
                      isSelected
                        ? 'bg-white text-slate-950 font-black'
                        : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {zone.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Zone Side Panel (1/3 width) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {selectedZone ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-bold">
                      {selectedZone.type} zone
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {activeZoneComplaints.length} Reported Issue{activeZoneComplaints.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedZone.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedZone.description}
                  </p>
                </div>

                {/* Complaints in this zone */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {activeZoneComplaints.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No active grievances reported for this facility. Everything is operational!
                    </div>
                  ) : (
                    activeZoneComplaints.map((c) => {
                      const isSupported = c.supportedStudentIds?.includes(studentProfile.rollNo);
                      return (
                        <div
                          key={c.id}
                          className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                                #{c.id}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5 leading-snug">
                                {c.title}
                              </h4>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                c.status === 'Resolved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : c.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-500">
                              👥 {c.affectedStudentCount || 1} students affected
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => supportComplaint(c.id)}
                                disabled={isSupported}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                                  isSupported
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-violet-50'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {isSupported ? 'Supported' : '+1'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="text-[10px] font-bold text-violet-600 hover:underline"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a campus building on the map to inspect reported grievances.
              </div>
            )}
          </div>

          <button
            onClick={openNewComplaintModal}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-xl text-xs shadow-md transition"
          >
            Report Problem at this Location
          </button>
        </div>
      </div>
    </div>
  );
};
