import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lightbulb,
  ThumbsUp,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  X
} from 'lucide-react';

export const SuggestionsView: React.FC = () => {
  const {
    suggestions,
    addSuggestion,
    upvoteSuggestion,
    studentProfile,
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Campus Infrastructure');
  const [description, setDescription] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredSuggestions = suggestions.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await addSuggestion(title, category, description);
    setTitle('');
    setDescription('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span>Campus Innovation & Student Voice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Community Suggestions & Upvotes
          </h1>
          <p className="text-violet-100 text-xs mt-1 max-w-xl">
            Propose infrastructure improvements, library enhancements, lab additions, or eco-friendly campus ideas. Top-voted proposals are reviewed directly by the campus council.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-white text-violet-700 hover:bg-violet-50 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition active:scale-98 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Suggest an Improvement</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full font-bold transition ${
            selectedFilter === 'all'
              ? 'bg-violet-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          All Ideas ({suggestions.length})
        </button>
        <button
          onClick={() => setSelectedFilter('under review')}
          className={`px-3 py-1.5 rounded-full font-bold transition ${
            selectedFilter === 'under review'
              ? 'bg-violet-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Under Review
        </button>
        <button
          onClick={() => setSelectedFilter('accepted')}
          className={`px-3 py-1.5 rounded-full font-bold transition ${
            selectedFilter === 'accepted'
              ? 'bg-violet-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Accepted by Admin
        </button>
        <button
          onClick={() => setSelectedFilter('implemented')}
          className={`px-3 py-1.5 rounded-full font-bold transition ${
            selectedFilter === 'implemented'
              ? 'bg-violet-600 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Implemented ✓
        </button>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuggestions.map((sug) => {
          const isUpvoted = sug.upvotedBy?.includes(studentProfile.rollNo);

          return (
            <div
              key={sug.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-violet-300 transition card-interactive"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">
                    {sug.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sug.status === 'Implemented'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sug.status === 'Accepted'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {sug.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {sug.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    {sug.authorName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {sug.authorBranch} • {sug.createdAt}
                  </div>
                </div>

                <button
                  onClick={() => upvoteSuggestion(sug.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs transition active:scale-95 ${
                    isUpvoted
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-violet-50 hover:text-violet-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-white' : ''}`} />
                  <span>{sug.upvotes || 0}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestion Creation Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-modal-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-violet-600" />
                Propose a Campus Improvement
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Idea Summary:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Install outdoor Wi-Fi boosters near amphitheater lawn"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Campus Infrastructure">Campus Infrastructure</option>
                  <option value="Academic Facilities">Academic Facilities</option>
                  <option value="Labs & Technology">Labs & Technology</option>
                  <option value="Hostel & Dining">Hostel & Dining</option>
                  <option value="Eco & Sustainability">Eco & Sustainability</option>
                  <option value="Sports & Recreation">Sports & Recreation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposal Details:
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain why this improvement is needed and how it benefits students..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                >
                  Publish Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
