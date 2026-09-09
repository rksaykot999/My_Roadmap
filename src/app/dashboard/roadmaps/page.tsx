"use client";

import { useState } from "react";
import WeekGroup from "@/components/WeekGroup";
import { useProgress } from "@/hooks/useProgress";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function RoadmapTimelinePage() {
  const { 
    roadmaps, activeRoadmap, activeRoadmapId,
    completedDays, bookmarkedDays, 
    toggleDay, toggleBookmark, createRoadmap, switchRoadmap, addDay,
    isLoaded, getProgressPercentage 
  } = useProgress();
  
  const [openWeek, setOpenWeek] = useState<number | null>(1);
  const [showModal, setShowModal] = useState(false);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState("");

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const handleCreateNew = async () => {
    if (newRoadmapTitle.trim()) {
      await createRoadmap(newRoadmapTitle.trim());
      setNewRoadmapTitle("");
      setShowModal(false);
    }
  };

  const handleSwitch = (direction: 'next' | 'prev') => {
    if (!activeRoadmapId || roadmaps.length <= 1) return;
    const currentIndex = roadmaps.findIndex(r => r.id === activeRoadmapId);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= roadmaps.length) newIndex = 0;
    if (newIndex < 0) newIndex = roadmaps.length - 1;
    switchRoadmap(roadmaps[newIndex].id);
  };

  const percentage = activeRoadmapId ? getProgressPercentage(activeRoadmapId) : 0;
  const totalCompleted = completedDays.length;
  
  // Group days into weeks
  const weeks = [];
  if (activeRoadmap) {
    for (let i = 0; i < activeRoadmap.days.length; i += 7) {
      weeks.push(activeRoadmap.days.slice(i, i + 7));
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Roadmaps</h1>
          <p className="text-slate-400">Here is your active roadmap progress.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      {activeRoadmap ? (
        <>
          {/* Welcome Banner */}
          <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex justify-between items-start sm:items-center mb-2">
              <h2 className="text-2xl font-bold text-white">{activeRoadmap.title}</h2>
              
              {/* Navigation Arrows for switching roadmaps */}
              {roadmaps.length > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => handleSwitch('prev')} className="p-2 rounded-full bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleSwitch('next')} className="p-2 rounded-full bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-slate-400">You have completed {totalCompleted} out of {activeRoadmap.days.length} days on your journey.</p>
            
            <div className="mt-8 relative">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-blue-400">Overall Progress</span>
                <span className="text-white">{percentage}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Roadmap Content */}
          <div className="space-y-4">
            {weeks.length > 0 ? weeks.map((weekDays, index) => (
              <WeekGroup 
                key={`week-${index}`}
                roadmapId={activeRoadmap.id}
                weekNumber={index + 1}
                days={weekDays}
                completedDays={completedDays}
                bookmarkedDays={bookmarkedDays}
                isOpen={openWeek === index + 1}
                onToggle={() => setOpenWeek(openWeek === index + 1 ? null : index + 1)}
              />
            )) : (
              <div className="text-center py-10 bg-slate-800/30 rounded-2xl border border-white/5">
                <p className="text-slate-400">This roadmap is currently empty.</p>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  if (activeRoadmapId) {
                    addDay(activeRoadmapId);
                    // Also open the last week if it was just added
                    const lastWeekNum = Math.ceil((activeRoadmap.days.length + 1) / 7);
                    setOpenWeek(lastWeekNum);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl transition-colors font-medium shadow-lg hover:border-white/20"
              >
                <Plus className="w-5 h-5 text-blue-400" />
                Add New Day
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-white/10">
          <p className="text-slate-400 text-lg">You don't have any roadmaps yet.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
          >
            Create your first Roadmap
          </button>
        </div>
      )}

      {/* Create New Roadmap Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-4">Create New Roadmap</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Roadmap Title</label>
                <input 
                  type="text"
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  placeholder="e.g. Next.js Mastery"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateNew}
                  disabled={!newRoadmapTitle.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
