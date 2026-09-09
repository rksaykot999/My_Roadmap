"use client";

import { Trophy, Medal, Star, Lock, Pencil, Check, X } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Default summaries for the Full Stack Journey
const defaultWeekSummaries: Record<number, string> = {
  1: "Frontend Basics & UI Design",
  2: "React Components & State",
  3: "Advanced Hooks & Routing",
  4: "Node.js & Express APIs",
  5: "MongoDB & Mongoose",
  6: "Authentication & Security",
  7: "Full Stack Integration",
  8: "Redux & State Management",
  9: "Next.js App Router",
  10: "TypeScript & Deployment",
  11: "Performance & Testing",
  12: "Portfolio & Interview Prep",
};

function WeekBadge({ 
  week, 
  onSaveTitle 
}: { 
  week: any; 
  onSaveTitle: (title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(week.title);

  const handleSave = () => {
    onSaveTitle(editTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(week.title);
    setIsEditing(false);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
        week.isCompleted 
          ? "bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "bg-slate-900/50 border-white/5"
      )}
    >
      {week.isCompleted && (
        <div className="absolute top-0 right-0 p-4">
          <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
        </div>
      )}
      
      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
          title="Edit Achievement Title"
        >
          <Pencil className="w-3 h-3" />
        </button>
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
        
        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">{week.roadmapTitle}</div>
        <h3 className="text-lg font-bold text-white mb-2">Week {week.number} Master</h3>
        
        {isEditing ? (
          <div className="w-full mb-3">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
              autoFocus
              className="w-full bg-slate-900/80 border border-blue-500/50 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={handleCancel} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors">
                <X className="w-3 h-3" /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white transition-colors">
                <Check className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group mb-3">
            <p className={cn("text-sm line-clamp-2 min-h-[40px]", week.isCompleted ? "text-blue-300" : "text-slate-500")}>
              {week.title}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -right-5 top-0 p-1 rounded text-slate-500 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit title"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
        
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
  );
}

export default function AchievementsPage() {
  const { roadmaps, allCompletedDays, isLoaded, updateWeekTitle } = useProgress();

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const weeks: any[] = [];
  roadmaps.forEach(roadmap => {
    const rmCompletedIds = allCompletedDays[roadmap.id] || [];
    for (let i = 0; i < roadmap.days.length; i += 7) {
      const weekDays = roadmap.days.slice(i, i + 7);
      const isWeekCompleted = weekDays.length > 0 && weekDays.every(day => rmCompletedIds.includes(day.id));
      const weekNum = Math.floor(i / 7) + 1;
      
      // Priority: custom saved title > default full-stack titles > generic title
      const customTitle = roadmap.weekTitles?.[weekNum];
      let title = customTitle 
        || (roadmap.id === 'default-full-stack' ? defaultWeekSummaries[weekNum] : undefined)
        || `Week ${weekNum} Checkpoint`;
      
      weeks.push({
        id: `${roadmap.id}-${weekNum}`,
        roadmapId: roadmap.id,
        roadmapTitle: roadmap.title,
        number: weekNum,
        isCompleted: isWeekCompleted,
        title,
        totalDays: weekDays.length,
        completedCount: weekDays.filter(day => rmCompletedIds.includes(day.id)).length
      });
    }
  });

  const earnedAchievements = weeks.filter(w => w.isCompleted).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-slate-400">Complete weeks in your roadmaps to unlock these badges. Click the <Pencil className="w-3 h-3 inline" /> icon to rename any badge.</p>
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
          <WeekBadge
            key={week.id}
            week={week}
            onSaveTitle={(title) => updateWeekTitle(week.roadmapId, week.number, title)}
          />
        ))}
      </div>
    </div>
  );
}
