"use client";

import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { Plus, Settings, Activity, Map } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export default function RoadmapsPage() {
  const { isLoaded, getProgressPercentage } = useProgress();
  const percentage = getProgressPercentage(roadmapData.length);
  const [showModal, setShowModal] = useState(false);

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Roadmaps</h1>
          <p className="text-slate-400">Manage your learning journeys and customize your paths.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Roadmap Card */}
        <div className="bg-slate-800/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
          
          <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
            <Map className="w-7 h-7 text-emerald-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Full Stack Journey</h2>
          <p className="text-slate-400 text-sm mb-6 line-clamp-2">
            A comprehensive 84-day masterclass covering Frontend, Backend, Databases, AI integrations, and portfolio building.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>{roadmapData.length} Total Days</span>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-emerald-400">{percentage}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-6">
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="flex-1 bg-white hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-xl font-semibold transition-colors text-center"
            >
              Continue
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="p-2.5 bg-slate-700/50 hover:bg-slate-600 border border-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
              title="Customize Roadmap"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
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
