"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Layout, Database, Sparkles, CheckSquare } from "lucide-react";
import { RoadmapDay } from "@/data/roadmapData";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface RoadmapCardProps {
  data: RoadmapDay;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggle: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  index: number;
}

export default function RoadmapCard({ data, isCompleted, isBookmarked, onToggle, onToggleBookmark, index }: RoadmapCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this specific card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  
  // Fade out and scale down slightly as it leaves the top of the screen
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        y,
      }}
      className={cn(
        "relative p-4 sm:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-xl mb-6 sm:mb-12 last:mb-0 sm:last:mb-0 transition-colors duration-300 shadow-2xl overflow-hidden group/card",
        isCompleted
          ? "bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          : "bg-slate-900/80 border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 flex items-center gap-2">
            <span className="text-blue-400">{data.day}</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onToggleBookmark(data.id)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full p-2"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            ) : (
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 transition-colors group-hover:text-blue-400 opacity-0 group-hover/card:opacity-100 sm:opacity-100" />
            )}
          </button>

          <button
            onClick={() => onToggle(data.id)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full p-1"
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            ) : (
              <Circle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 transition-colors group-hover:text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-6 text-sm sm:text-base text-slate-300/90">
        {data.frontend && (
          <div className="flex gap-3 sm:gap-4">
            <div className="bg-indigo-500/10 p-1.5 sm:p-2 rounded-xl h-fit shrink-0">
              <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
            <div className="flex-1 pt-0.5 sm:pt-1">
              <span className="font-semibold text-white block mb-0.5 sm:mb-1">Frontend & UI/UX</span>
              <p className="leading-snug sm:leading-relaxed">{data.frontend}</p>
            </div>
          </div>
        )}

        {data.backend && (
          <div className="flex gap-3 sm:gap-4">
            <div className="bg-orange-500/10 p-1.5 sm:p-2 rounded-xl h-fit shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <div className="flex-1 pt-0.5 sm:pt-1">
              <span className="font-semibold text-white block mb-0.5 sm:mb-1">Backend & Database</span>
              <p className="leading-snug sm:leading-relaxed">{data.backend}</p>
            </div>
          </div>
        )}

        {data.aiTools && (
          <div className="flex gap-3 sm:gap-4">
            <div className="bg-amber-500/10 p-1.5 sm:p-2 rounded-xl h-fit shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="flex-1 pt-0.5 sm:pt-1">
              <span className="font-semibold text-white block mb-0.5 sm:mb-1">AI Tools Practice</span>
              <p className="leading-snug sm:leading-relaxed">{data.aiTools}</p>
            </div>
          </div>
        )}

        {data.deliverable && (
          <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4 mt-2 sm:mt-2 border-t border-white/5">
            <div className="bg-emerald-500/10 p-1.5 sm:p-2 rounded-xl h-fit shrink-0">
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="flex-1 pt-0.5 sm:pt-1 text-emerald-100/90">
              <span className="font-semibold text-emerald-300 block mb-0.5 sm:mb-1">Deliverable</span>
              <p className="leading-snug sm:leading-relaxed">{data.deliverable}</p>
            </div>
          </div>
        )}
      </div>

      {isCompleted && (
        <motion.div
          layoutId={`completion-indicator-${data.id}`}
          className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-b-3xl"
        />
      )}
    </motion.div>
  );
}
