"use client";
import { useState } from "react";

import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import WeekGroup from "@/components/WeekGroup";

// Helper function to chunk array into weeks
function chunkIntoWeeks(data: typeof roadmapData, chunkSize: number) {
  const weeks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    weeks.push(data.slice(i, i + chunkSize));
  }
  return weeks;
}

export default function Home() {
  const { completedDays, bookmarkedDays, toggleDay, toggleBookmark, isLoaded } = useProgress();
  const [openWeek, setOpenWeek] = useState<number | null>(1); // Default week 1 open

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const weeks = chunkIntoWeeks(roadmapData, 7);

  return (
    <main className="min-h-screen bg-slate-900 relative selection:bg-blue-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto backdrop-blur-sm bg-slate-900/50 p-4 rounded-xl border border-white/5">
            Your personalized roadmap to mastering modern web development.
          </p>
        </div>

        <div className="relative flex flex-col gap-2">
          {weeks.map((weekDays, index) => (
            <WeekGroup
              key={`week-${index + 1}`}
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
    </main>
  );
}
