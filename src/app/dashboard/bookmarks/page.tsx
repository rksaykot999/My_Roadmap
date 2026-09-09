"use client";

import RoadmapCard from "@/components/RoadmapCard";
import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { BookmarkX } from "lucide-react";

export default function BookmarksPage() {
  const { completedDays, bookmarkedDays, toggleDay, toggleBookmark, isLoaded } = useProgress();

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const bookmarkedData = roadmapData.filter(day => bookmarkedDays.includes(day.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookmarks</h1>
        <p className="text-slate-400">Your saved days for quick reference.</p>
      </div>

      {bookmarkedData.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-12 backdrop-blur-sm text-center flex flex-col items-center">
          <div className="bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <BookmarkX className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No bookmarks yet</h2>
          <p className="text-slate-400 max-w-sm">
            You haven't bookmarked any days yet. Click the bookmark icon on any roadmap card to save it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {bookmarkedData.map((dayData, index) => (
            <RoadmapCard
              key={dayData.id}
              data={dayData}
              index={index}
              isCompleted={completedDays.includes(dayData.id)}
              isBookmarked={true}
              onToggle={toggleDay}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
