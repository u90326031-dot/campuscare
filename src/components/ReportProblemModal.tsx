import React, { useState, useEffect, useId } from 'react';
import { useApp } from '../context/AppContext';
import {
  ComplaintType,
  ComplaintCategory,
  ComplaintPriority,
  HostelBlock,
  AcademicBranch,
  AcademicYear,
  AcademicSemester,
  AcademicSection,
  AISuggestion,
  Complaint
} from '../types';
import { analyzeComplaintWithAI } from '../lib/gemini';
import {
  X,
  Sparkles,
  AlertTriangle,
  Upload,
  CheckCircle,
  ThumbsUp,
  School,
  Building,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';

const COLLEGE_CATEGORIES: ComplaintCategory[] = [
  'Laboratory Equipment',
  'Classroom & Labs',
  'Electrical',
  'Wi-Fi & Network',
  'Water Supply',
  'Washroom',
  'Cleaning',
  'Furniture',
  'Library',
  'Security',
  'Other',
];

const HOSTEL_CATEGORIES: ComplaintCategory[] = [
  'Water Supply',
  'Electrical',
  'Wi-Fi & Network',
  'Cleaning',
  'Mess Hall',
  'Washroom',
  'Room Maintenance',
  'Furniture',
  'Security',
  'Other',
];

const BRANCHES: AcademicBranch[] = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
];

const YEARS: AcademicYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS: AcademicSemester[] = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];
const SECTIONS: AcademicSection[] = ['Section A', 'Section B', 'Section C', 'Section D'];
const HOSTEL_BLOCKS: HostelBlock[] = ['Block A', 'Block B', 'Block C', 'Block D'];

const COLLEGE_BUILDINGS = [
  'Academic Block 1',
  'Academic Block 2',
  'Academic Block 3',
  'Central Library',
  'Mechanical Workshop',
  'Sports Complex',
  'Main Administrative Block'
];

const COLLEGE_FLOORS = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];

export const ReportProblemModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    studentProfile,
    addComplaint,
    findSimilarComplaints,
    supportComplaint,
  } = useApp();

  const fileInputId = useId();

  // Fresh complaint state initialized with zero residual values from previous complaints
  const [type, setType] = useState<ComplaintType>('college');

  // Academic Hierarchy (Defaults to current student profile, editable)
  const [branch, setBranch] = useState<AcademicBranch>(studentProfile.branch || 'Computer Science & Engineering');
  const [year, setYear] = useState<AcademicYear>(studentProfile.year || '2nd Year');
  const [semester, setSemester] = useState<AcademicSemester>(studentProfile.semester || 'Semester 4');
  const [section, setSection] = useState<AcademicSection>(studentProfile.section || 'Section B');

  // Location fields - initialized clean
  const [collegeBuilding, setCollegeBuilding] = useState<string>('Academic Block 2');
  const [collegeFloor, setCollegeFloor] = useState<string>('3rd Floor');
  const [collegeRoom, setCollegeRoom] = useState<string>('');

  const [hostelBlock, setHostelBlock] = useState<HostelBlock>(studentProfile.hostelBlock || 'Block C');
  const [hostelFloor, setHostelFloor] = useState<string>(studentProfile.hostelFloor || '');
  const [hostelRoom, setHostelRoom] = useState<string>(studentProfile.hostelRoom || '');

  // Core problem fields - strictly empty on fresh initialization
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [affectedGroup, setAffectedGroup] = useState<string>('');
  const [affectedCount, setAffectedCount] = useState<number>(1);
  const [assignedDepartment, setAssignedDepartment] = useState<string>('');

  // AI Assistant states - strictly null on fresh initialization
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiInputError, setAiInputError] = useState<string | null>(null);
  const [aiDescriptionWarning, setAiDescriptionWarning] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Similar Complaints & Attachments
  const [similarComplaints, setSimilarComplaints] = useState<Complaint[]>([]);
  const [supportedId, setSupportedId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset function to clear all states cleanly
  const resetEntireForm = () => {
    setType('college');
    setBranch(studentProfile.branch || 'Computer Science & Engineering');
    setYear(studentProfile.year || '2nd Year');
    setSemester(studentProfile.semester || 'Semester 4');
    setSection(studentProfile.section || 'Section B');
    setCollegeBuilding('Academic Block 2');
    setCollegeFloor('3rd Floor');
    setCollegeRoom('');
    setHostelBlock(studentProfile.hostelBlock || 'Block C');
    setHostelFloor(studentProfile.hostelFloor || '');
    setHostelRoom(studentProfile.hostelRoom || '');
    setTitle('');
    setCategory('');
    setDescription('');
    setPriority('');
    setAffectedGroup('');
    setAffectedCount(1);
    setAssignedDepartment('');
    setIsAnalyzing(false);
    setAiSuggestion(null);
    setAiInputError(null);
    setAiDescriptionWarning(null);
    setAiError(null);
    setSimilarComplaints([]);
    setSupportedId(null);
    setAttachments([]);
    setIsSubmitting(false);
    setValidationErrors({});
  };

  // Close modal and cleanly reset
  const handleClose = () => {
    resetEntireForm();
    setIsReportModalOpen(false);
  };

  // Computed full location string
  const currentLocation = type === 'college'
    ? [collegeBuilding, collegeFloor, collegeRoom].filter(Boolean).join(' • ')
    : [`Hostel ${hostelBlock}`, hostelFloor, hostelRoom].filter(Boolean).join(' • ');

  // Clear AI result when description changes
  const handleDescriptionChange = (newVal: string) => {
    setDescription(newVal);

    if (aiInputError) {
      setAiInputError(null);
    }
    if (aiError) {
      setAiError(null);
    }

    if (validationErrors.description) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy.description;
        return copy;
      });
    }

    // Invalidate AI suggestion if description was altered
    if (aiSuggestion) {
      setAiSuggestion(null);
      setAiDescriptionWarning('Complaint changed. Generate a new AI analysis.');
    }
  };

  // Live Similar Complaint Scanner based on Location, Category, Query
  useEffect(() => {
    if (!description.trim() && !title.trim()) {
      setSimilarComplaints([]);
      return;
    }
    const query = `${title} ${description}`.trim();
    const found = findSimilarComplaints({
      location: currentLocation,
      category: category || undefined,
      query,
      type,
    });
    setSimilarComplaints(found.slice(0, 3));
  }, [title, description, currentLocation, category, type, findSimilarComplaints]);

  // AI Button Behavior - Only analyze CURRENT description
  const handleGenerateWithAI = async () => {
    const textToAnalyze = description.trim();

    // Verify current description is not empty
    if (!textToAnalyze) {
      setAiInputError('Please describe the problem first.');
      return;
    }

    setAiInputError(null);
    setAiDescriptionWarning(null);
    setAiError(null);
    setIsAnalyzing(true);

    try {
      // Send ONLY current complaint data to Gemini
      const result = await analyzeComplaintWithAI(textToAnalyze, {
        location: currentLocation,
        branch,
        year,
        semester,
        section,
        type,
        hostelBlock: type === 'hostel' ? hostelBlock : undefined,
        selectedCategory: category || undefined,
      });

      setAiSuggestion(result);
    } catch (err: any) {
      console.warn('AI analysis error:', err);
      setAiError(err?.message || 'AI analysis is temporarily unavailable. You can submit the complaint manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestion) return;
    setCategory(aiSuggestion.category);
    setPriority(aiSuggestion.priority);
    setAssignedDepartment(aiSuggestion.suggestedDepartment);
    if (aiSuggestion.affectedGroup) {
      setAffectedGroup(aiSuggestion.affectedGroup);
    }
    if (!title && aiSuggestion.summary) {
      setTitle(aiSuggestion.summary);
    }
    // Clear any validation errors for auto-filled fields
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.category;
      delete copy.priority;
      delete copy.title;
      return copy;
    });
  };

  const handleSupportExisting = async (complaintId: string) => {
    await supportComplaint(complaintId);
    setSupportedId(complaintId);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Field validations
    const errors: Record<string, string> = {};
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) {
      errors.title = 'Title is required';
    } else if (cleanTitle.length > 120) {
      errors.title = 'Title must be 120 characters or less';
    }

    if (!cleanDesc) {
      errors.description = 'Problem description is required';
    } else if (cleanDesc.length > 2000) {
      errors.description = 'Description must be 2000 characters or less';
    }

    if (!category) errors.category = 'Please select a category';
    if (!priority) errors.priority = 'Please select a priority level';

    if (type === 'college' && !collegeRoom.trim()) {
      errors.collegeRoom = 'Please enter room or lab name';
    }
    if (type === 'hostel' && !hostelRoom.trim()) {
      errors.hostelRoom = 'Please enter hostel room number';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const defaultGroup =
        type === 'hostel'
          ? `Hostel ${hostelBlock} ${hostelFloor || 'Residents'}`
          : `${branch.split(' ')[0]} ${year.slice(0, 3)} • ${section}`;

      const finalAffectedGroup = affectedGroup.trim() || defaultGroup;

      await addComplaint({
        title: cleanTitle,
        studentName: studentProfile.studentName,
        studentId: studentProfile.studentId,
        rollNo: studentProfile.rollNo,
        branch,
        year,
        semester,
        section,
        type,
        collegeBuilding: type === 'college' ? collegeBuilding : undefined,
        collegeFloor: type === 'college' ? collegeFloor : undefined,
        collegeRoom: type === 'college' ? collegeRoom.trim().slice(0, 50) : undefined,
        hostelBlock: type === 'hostel' ? hostelBlock : undefined,
        hostelFloor: type === 'hostel' ? hostelFloor.trim().slice(0, 50) : undefined,
        hostelRoom: type === 'hostel' ? hostelRoom.trim().slice(0, 50) : undefined,
        category: category as ComplaintCategory,
        location: currentLocation,
        description: cleanDesc,
        attachments,
        affectedGroup: finalAffectedGroup.slice(0, 80),
        affectedStudentCount: Math.min(1000, Math.max(1, affectedCount || 1)),
        priority: (priority as ComplaintPriority) || 'Medium',
        status: 'Submitted',
        assignedDepartment: assignedDepartment || (type === 'hostel' ? 'Hostel Warden Office' : 'Campus Maintenance Cell'),
        aiAnalysis: aiSuggestion || undefined,
      });

      handleClose();
    } catch (err) {
      console.error('Failed to submit complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-modal-enter">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Report a Problem
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit a new campus problem ticket with Gemini AI triage and live duplicate detection.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Problem Scope: College Problem vs Hostel Problem */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Problem Domain:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('college');
                  setCategory('');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  type === 'college'
                    ? 'border-violet-600 bg-violet-50/80 dark:bg-violet-950/50 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${type === 'college' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">College Problem</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Building → Floor → Room/Lab</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('hostel');
                  setCategory('');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  type === 'hostel'
                    ? 'border-violet-600 bg-violet-50/80 dark:bg-violet-950/50 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${type === 'hostel' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Hostel Problem</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Hostel → Block → Floor → Room</div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic Info Hierarchy: Branch -> Year -> Semester -> Section */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🎓</span> Student Academic Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as AcademicBranch)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as AcademicYear)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as AcademicSemester)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value as AcademicSection)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Separated Location Flow */}
            {type === 'college' ? (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Building</label>
                  <select
                    value={collegeBuilding}
                    onChange={(e) => setCollegeBuilding(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {COLLEGE_BUILDINGS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Floor</label>
                  <select
                    value={collegeFloor}
                    onChange={(e) => setCollegeFloor(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {COLLEGE_FLOORS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    Room / Lab *
                  </label>
                  <input
                    type="text"
                    value={collegeRoom}
                    onChange={(e) => {
                      setCollegeRoom(e.target.value);
                      if (validationErrors.collegeRoom) {
                        setValidationErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.collegeRoom;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. CSE Lab 3 / Room 204"
                    className={`w-full mt-1 bg-white dark:bg-slate-900 border rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200 ${
                      validationErrors.collegeRoom
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {validationErrors.collegeRoom && (
                    <span className="text-[10px] text-red-500 font-semibold">{validationErrors.collegeRoom}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Hostel Block</label>
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value as HostelBlock)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {HOSTEL_BLOCKS.map((hb) => (
                      <option key={hb} value={hb}>{hb}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Floor</label>
                  <input
                    type="text"
                    value={hostelFloor}
                    onChange={(e) => setHostelFloor(e.target.value)}
                    placeholder="e.g. 3rd Floor"
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Room *</label>
                  <input
                    type="text"
                    value={hostelRoom}
                    onChange={(e) => {
                      setHostelRoom(e.target.value);
                      if (validationErrors.hostelRoom) {
                        setValidationErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.hostelRoom;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. Room 304"
                    className={`w-full mt-1 bg-white dark:bg-slate-900 border rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200 ${
                      validationErrors.hostelRoom
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {validationErrors.hostelRoom && (
                    <span className="text-[10px] text-red-500 font-semibold">{validationErrors.hostelRoom}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Problem Description + AI Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Detailed Problem Description *</span>
              </label>

              {/* Requirement: "Generate with AI" button with loading state */}
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isAnalyzing}
                className="text-[11px] font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900 border border-violet-200 dark:border-violet-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600 dark:text-violet-400" />
                    <span>Gemini is analyzing your complaint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Error badge if user clicks Generate with AI when description is empty */}
            {aiInputError && (
              <div className="mb-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{aiInputError}</span>
              </div>
            )}

            {/* Warning badge if description changed after AI generated */}
            {aiDescriptionWarning && (
              <div className="mb-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>Complaint changed. Generate a new AI analysis.</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  className="font-bold underline text-blue-900 dark:text-blue-200 text-[11px] hover:text-blue-700 ml-2 shrink-0"
                >
                  Generate Again
                </button>
              </div>
            )}

            {/* Error message if Gemini fails */}
            {aiError && (
              <div className="mb-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{aiError}</span>
              </div>
            )}

            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail (e.g. Five computers in CSE Lab 3 are not turning on and we have a practical exam tomorrow)..."
              className={`w-full bg-white dark:bg-slate-900 border rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500 ${
                validationErrors.description
                  ? 'border-red-500 ring-1 ring-red-500/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {validationErrors.description && (
              <span className="text-[10px] text-red-500 font-semibold">{validationErrors.description}</span>
            )}
          </div>

          {/* AI Result or "No AI analysis yet" placeholder */}
          {aiSuggestion ? (
            <div className="bg-violet-50/80 dark:bg-violet-950/40 rounded-2xl p-4 border border-violet-200 dark:border-violet-900 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-violet-100 dark:border-violet-900/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-[10px]">
                    AI
                  </div>
                  <span className="font-extrabold text-xs text-violet-900 dark:text-violet-200">
                    AI Suggestion
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Confidence: <strong>{aiSuggestion.confidence} ({aiSuggestion.confidenceScore}%)</strong>
                  </span>
                  {aiSuggestion.needsReview || aiSuggestion.confidence === 'Needs manual review' || aiSuggestion.confidenceScore < 70 ? (
                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                      <AlertTriangle className="w-3 h-3" /> Needs manual review
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> High Confidence
                    </span>
                  )}
                </div>
              </div>

              {/* Exact structured fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Category:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiSuggestion.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Priority:</span>
                  <span className="font-bold text-red-600 dark:text-red-400 uppercase">{aiSuggestion.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Suggested Department:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiSuggestion.suggestedDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Affected Group:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiSuggestion.affectedGroup}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Summary:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/60 leading-relaxed font-medium">
                  {aiSuggestion.summary}
                </p>
              </div>

              {/* Possible Cause */}
              <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/60">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Possible Cause:</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {aiSuggestion.possibleCause || 'Insufficient information'}
                </span>
              </div>

              {aiSuggestion.keywords && aiSuggestion.keywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-400 mr-1">Keywords:</span>
                  {aiSuggestion.keywords.map((kw, i) => (
                    <span key={i} className="bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-[10px] px-1.5 py-0.2 rounded-md border border-violet-100 dark:border-violet-900">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 italic">
                  Student can review and edit all fields below before submitting.
                </span>
                <button
                  type="button"
                  onClick={applyAISuggestions}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Apply AI Suggestion
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>No AI analysis yet</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Type your problem description above and click <strong>Generate with AI</strong> to analyze category, priority, and department.
              </p>
            </div>
          )}

          {/* Related Complaint Detection */}
          {similarComplaints.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Similar problem already reported</span>
                </div>
                <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {similarComplaints.length} Related Report{similarComplaints.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                To prevent duplicate tickets and accelerate resolution, confirm if you are facing this:
              </p>

              <div className="space-y-2 mt-2">
                {similarComplaints.map((sim) => (
                  <div
                    key={sim.id}
                    className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-md font-bold">
                          #{sim.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {sim.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>📍 {sim.location}</span>
                        <span>•</span>
                        <span>👥 <strong>{sim.affectedStudentCount || 1}</strong> affected students</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSupportExisting(sim.id)}
                      disabled={supportedId === sim.id}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{supportedId === sim.id ? 'Supported! (+1)' : 'I am also facing this problem'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issue Title / Summary */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Issue Title / Summary *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.title;
                    return copy;
                  });
                }
              }}
              placeholder="e.g. Five computers in CSE Lab 3 are not working before practical exam"
              className={`w-full bg-white dark:bg-slate-900 border rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 ${
                validationErrors.title
                  ? 'border-red-500 ring-1 ring-red-500/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {validationErrors.title && (
              <span className="text-[10px] text-red-500 font-semibold">{validationErrors.title}</span>
            )}
          </div>

          {/* Category & Location summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (validationErrors.category) {
                    setValidationErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.category;
                      return copy;
                    });
                  }
                }}
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 ${
                  validationErrors.category
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">-- Select Category --</option>
                {(type === 'hostel' ? HOSTEL_CATEGORIES : COLLEGE_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {validationErrors.category && (
                <span className="text-[10px] text-red-500 font-semibold">{validationErrors.category}</span>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location Summary
              </label>
              <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                📍 {currentLocation || 'Please specify location details above'}
              </div>
            </div>
          </div>

          {/* Priority & Estimated Students Affected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  if (validationErrors.priority) {
                    setValidationErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.priority;
                      return copy;
                    });
                  }
                }}
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold ${
                  validationErrors.priority
                    ? 'border-red-500 ring-1 ring-red-500/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">-- Select Priority --</option>
                <option value="Low">Low - Cosmetic or non-urgent</option>
                <option value="Medium">Medium - Regular classroom/room issue</option>
                <option value="High">High - Impeding classes or urgent utility</option>
                <option value="Critical">Critical - Safety risk, power outage, flooded</option>
              </select>
              {validationErrors.priority && (
                <span className="text-[10px] text-red-500 font-semibold">{validationErrors.priority}</span>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Affected Student Count
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={affectedCount}
                onChange={(e) => setAffectedCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
              />
            </div>
          </div>

          {/* Suggested Department & Affected Group (Both editable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Suggested Department (Editable)
              </label>
              <input
                type="text"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                placeholder="e.g. Computer Lab / IT | Electrical Wing | Plumbing"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Affected Group (Editable)
              </label>
              <input
                type="text"
                value={affectedGroup}
                onChange={(e) => setAffectedGroup(e.target.value)}
                placeholder="e.g. CSE students | Block C 3rd Floor Residents"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Attachments simulator */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Attachments / Photo Proof (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-violet-400 transition cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                id={fileInputId}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const names = Array.from(e.target.files).map((f) => f.name);
                    setAttachments((prev) => [...prev, ...names]);
                  }
                }}
              />
              <label htmlFor={fileInputId} className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-violet-600 mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Click to upload damaged photo or drag files here
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, PDF up to 10MB
                </span>
              </label>

              {attachments.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2 justify-center">
                  {attachments.map((a, i) => (
                    <span key={i} className="bg-violet-50 text-violet-700 text-[10px] px-2 py-0.5 rounded-full border border-violet-200 flex items-center gap-1">
                      <span>📎 {a}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                        className="text-violet-900 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-violet-200 dark:shadow-none flex items-center gap-2 transition active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
