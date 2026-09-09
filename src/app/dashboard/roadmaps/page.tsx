"use client";

import { useState } from "react";
import WeekGroup from "@/components/WeekGroup";
import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { auth } from "@/lib/firebase";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function RoadmapTimelinePage() {
  const { completedDays, bookmarkedDays, toggleDay, toggleBookmark, isLoaded, getProgressPercentage } = useProgress();
  const [openWeek, setOpenWeek] = useState<number | null>(1);
  const [showModal, setShowModal] = useState(false);
  const user = auth.currentUser;

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const percentage = getProgressPercentage(roadmapData.length);
  const totalCompleted = completedDays.length;
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < roadmapData.length; i += 7) {
    weeks.push(roadmapData.slice(i, i + 7));
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

      {/* Welcome Banner */}
      <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm relative overflow-hidden group">
        <div className="flex justify-between items-start sm:items-center mb-2">
          <h2 className="text-2xl font-bold text-white">Full Stack Journey</h2>
          
          {/* Navigation Arrows for switching roadmaps */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p className="text-slate-400">You have completed {totalCompleted} out of {roadmapData.length} days on your journey.</p>
        
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
        {weeks.map((weekDays, index) => (
          <WeekGroup 
            key={`week-${index}`}
            weekNumber={index + 1}
            days={weekDays}
            completedDays={completedDays}
            bookmarkedDays={bookmarkedDays}
            onToggleDay={toggleDay}
            onToggleBookmark={toggleBookmark}
            isOpen={openWeek === index + 1}
            onToggle={() => setOpenWeek(openWeek === index + 1 ? null : index + 1)}
          />
        ))}
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
            <p className="text-slate-400 mb-6">
              The ability to create custom roadmaps, edit day structures, and share them with the community is currently in development.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
