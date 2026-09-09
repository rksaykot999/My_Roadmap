"use client";
import { useState } from "react";

import { useProgress } from "@/hooks/useProgress";
import WeekGroup from "@/components/WeekGroup";

export default function Home() {
  const { activeRoadmap, activeRoadmapId, completedDays, bookmarkedDays, isLoaded } = useProgress();
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group days into weeks
  const weeks = [];
  if (activeRoadmap) {
    for (let i = 0; i < activeRoadmap.days.length; i += 7) {
      weeks.push(activeRoadmap.days.slice(i, i + 7));
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 relative selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            {activeRoadmap ? activeRoadmap.title : "Your Roadmap"}
          </h1>
        </div>

        <div className="relative flex flex-col gap-2">
          {activeRoadmapId && weeks.length > 0 ? weeks.map((weekDays, index) => (
            <WeekGroup
              key={`week-${index + 1}`}
              roadmapId={activeRoadmapId}
              weekNumber={index + 1}
              days={weekDays}
              completedDays={completedDays}
              bookmarkedDays={bookmarkedDays}
              isOpen={openWeek === index + 1}
              onToggle={() => setOpenWeek(openWeek === index + 1 ? null : index + 1)}
              readOnly={true}
            />
          )) : (
            <div className="text-center py-10 bg-slate-800/30 rounded-2xl border border-white/5">
              <p className="text-slate-400">No active roadmap available.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
