"use client";

import RoadmapCard from "@/components/RoadmapCard";
import { useProgress } from "@/hooks/useProgress";
import { BookmarkX, Map } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookmarksPage() {
  const { roadmaps, isLoaded, allBookmarkedDays, allCompletedDays } = useProgress();

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Collect all bookmarked days across all roadmaps
  const allBookmarks = roadmaps.flatMap(roadmap => {
    const bookmarkedIds = allBookmarkedDays[roadmap.id] || [];
    const completedIds = allCompletedDays[roadmap.id] || [];
    
    return roadmap.days
      .filter(day => bookmarkedIds.includes(day.id))
      .map(day => ({
        ...day,
        roadmapId: roadmap.id,
        roadmapTitle: roadmap.title,
        isCompleted: completedIds.includes(day.id)
      }));
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookmarks</h1>
        <p className="text-slate-400">Your saved days for quick reference.</p>
      </div>

      {allBookmarks.length === 0 ? (
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
          {allBookmarks.map((dayData, index) => (
            <div key={`${dayData.roadmapId}-${dayData.id}`}>
              <div className="mb-2 text-xs font-semibold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <Map className="w-3 h-3" /> {dayData.roadmapTitle}
              </div>
              <RoadmapCard
                roadmapId={dayData.roadmapId}
                data={dayData}
                index={index}
                isCompleted={dayData.isCompleted}
                isBookmarked={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
