"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Layout, Database, Sparkles, CheckSquare } from "lucide-react";
import { RoadmapDay } from "@/data/roadmapData";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  data: RoadmapDay;
  isCompleted: boolean;
  onToggle: (id: number) => void;
  index: number;
}

export default function RoadmapCard({ data, isCompleted, onToggle, index }: RoadmapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300",
        isCompleted
          ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white/90 flex items-center gap-2">
            <span className="text-blue-400">{data.day}</span>
          </h3>
        </div>
        <button
          onClick={() => onToggle(data.id)}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full p-1"
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-500 transition-transform group-hover:scale-110" />
          ) : (
            <Circle className="w-8 h-8 text-slate-500 transition-colors group-hover:text-blue-400" />
          )}
        </button>
      </div>

      <div className="space-y-4 text-sm text-slate-300/90">
        {data.frontend && (
          <div className="flex gap-3">
            <Layout className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-white/80 block mb-1">Frontend & UI/UX:</span>
              <p className="leading-relaxed">{data.frontend}</p>
            </div>
          </div>
        )}

        {data.backend && (
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-white/80 block mb-1">Backend & Database:</span>
              <p className="leading-relaxed">{data.backend}</p>
            </div>
          </div>
        )}

        {data.aiTools && (
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-white/80 block mb-1">AI Tools Practice:</span>
              <p className="leading-relaxed">{data.aiTools}</p>
            </div>
          </div>
        )}

        {data.deliverable && (
          <div className="flex gap-3 pt-2 mt-2 border-t border-white/5">
            <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-emerald-100/80">
              <span className="font-medium text-emerald-300 block mb-1">Deliverable:</span>
              <p className="leading-relaxed">{data.deliverable}</p>
            </div>
          </div>
        )}
      </div>

      {isCompleted && (
        <motion.div
          layoutId={`completion-indicator-${data.id}`}
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-b-2xl"
        />
      )}
    </motion.div>
  );
}
