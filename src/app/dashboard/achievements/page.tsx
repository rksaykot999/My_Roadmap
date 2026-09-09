"use client";

import { Trophy, Medal, Star, Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { cn } from "@/lib/utils";

// Summaries for each week based on the roadmap content
const weekSummaries = [
  "Frontend Basics & UI Design",
  "React Components & State",
  "Advanced Hooks & Routing",
  "Node.js & Express APIs",
  "MongoDB & Mongoose",
  "Authentication & Security",
  "Full Stack Integration",
  "Redux & State Management",
  "Next.js App Router",
  "TypeScript & Deployment",
  "Performance & Testing",
  "Portfolio & Interview Prep"
];

export default function AchievementsPage() {
  const { completedDays, isLoaded } = useProgress();

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const weeks = [];
  for (let i = 0; i < roadmapData.length; i += 7) {
    const weekDays = roadmapData.slice(i, i + 7);
    const isWeekCompleted = weekDays.every(day => completedDays.includes(day.id));
    weeks.push({
      number: (i / 7) + 1,
      isCompleted: isWeekCompleted,
      title: weekSummaries[i / 7] || "Mastery Checkpoint",
      totalDays: weekDays.length,
      completedCount: weekDays.filter(day => completedDays.includes(day.id)).length
    });
  }

  const earnedAchievements = weeks.filter(w => w.isCompleted).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-slate-400">Complete weeks in your roadmap to unlock these badges.</p>
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex items-center gap-6">
        <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-400 mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-white">{earnedAchievements} <span className="text-slate-400 text-lg font-normal">/ {weeks.length}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeks.map((week) => (
          <div 
            key={week.number}
            className={cn(
              "relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
              week.isCompleted 
                ? "bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-slate-900/50 border-white/5 opacity-70 grayscale"
            )}
          >
            {week.isCompleted && (
              <div className="absolute top-0 right-0 p-4">
                <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
              </div>
            )}
            
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 shadow-xl",
                week.isCompleted
                  ? "bg-gradient-to-br from-emerald-400/20 to-blue-500/20 border-emerald-400/30 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-600"
              )}>
                {week.isCompleted ? <Medal className="w-10 h-10" /> : <Lock className="w-8 h-8" />}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">Week {week.number} Master</h3>
              <p className={cn("text-sm mb-4 line-clamp-2 min-h-[40px]", week.isCompleted ? "text-blue-300" : "text-slate-500")}>
                {week.title}
              </p>
              
              <div className="w-full bg-slate-950/50 rounded-full h-1.5 mt-auto">
                <div 
                  className={cn("h-full rounded-full transition-all", week.isCompleted ? "bg-emerald-500" : "bg-slate-600")}
                  style={{ width: `${(week.completedCount / week.totalDays) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {week.completedCount} / {week.totalDays} Days
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
