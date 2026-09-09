"use client";

import { useProgress } from "@/hooks/useProgress";
import { Activity, Map, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RoadmapsPage() {
  const { isLoaded, getProgressPercentage, roadmaps, activeRoadmapId, switchRoadmap, deleteRoadmap } = useProgress();
  const router = useRouter();

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );



  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-slate-400">Overview of your learning journeys and progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => {
          const percentage = getProgressPercentage(roadmap.id);
          const isActive = roadmap.id === activeRoadmapId;

          return (
            <div 
              key={roadmap.id}
              className={cn(
                "bg-slate-800/80 border rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden transition-all group",
                isActive 
                  ? "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]" 
                  : "border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              )}
            >
              {isActive && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>
              )}
              
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors",
                isActive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20"
              )}>
                <Map className={cn("w-7 h-7", isActive ? "text-emerald-400" : "text-blue-400")} />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{roadmap.title}</h2>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                A custom roadmap consisting of {roadmap.days.length} days of learning and practice.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Activity className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-blue-400")} />
                  <span>{roadmap.days.length} Total Days</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className={isActive ? "text-emerald-400" : "text-blue-400"}>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", isActive ? "bg-emerald-500" : "bg-blue-500")}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                {isActive ? (
                  <button 
                    onClick={() => router.push("/dashboard/roadmaps")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-center"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={() => switchRoadmap(roadmap.id)}
                    className="flex-1 bg-white hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-xl font-semibold transition-colors text-center"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this roadmap?")) {
                      deleteRoadmap(roadmap.id);
                    }
                  }}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition-colors"
                  title="Delete Roadmap"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
