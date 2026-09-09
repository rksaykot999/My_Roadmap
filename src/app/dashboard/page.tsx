"use client";

import { useState } from "react";
import WeekGroup from "@/components/WeekGroup";
import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { auth } from "@/lib/firebase";

export default function DashboardOverview() {
  const { completedDays, bookmarkedDays, toggleDay, toggleBookmark, isLoaded, getProgressPercentage } = useProgress();
  const [openWeek, setOpenWeek] = useState(1);
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
      {/* Welcome Banner */}
      <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}!` : '!'}</h1>
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
    </div>
  );
}
