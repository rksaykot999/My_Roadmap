"use client";

import { motion } from "framer-motion";

interface ProgressTrackerProps {
  percentage: number;
  totalCompleted: number;
  totalDays: number;
}

export default function ProgressTracker({ percentage, totalCompleted, totalDays }: ProgressTrackerProps) {
  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 py-4 px-6 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Journey Progress
          </h2>
          <span className="text-sm text-slate-400">
            {totalCompleted} of {totalDays} days completed
          </span>
        </div>
        
        <div className="flex-1 w-full max-w-xl flex items-center gap-4">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex-1 border border-slate-700/50 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
            />
          </div>
          <span className="text-emerald-400 font-mono font-bold w-12 text-right">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
