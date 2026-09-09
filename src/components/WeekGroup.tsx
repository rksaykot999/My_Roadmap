"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { RoadmapDay } from "@/data/roadmapData";
import RoadmapCard from "./RoadmapCard";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface WeekGroupProps {
  weekNumber: number;
  days: RoadmapDay[];
  completedDays: number[];
  bookmarkedDays: number[];
  onToggleDay: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function WeekGroup({ weekNumber, days, completedDays, bookmarkedDays, onToggleDay, onToggleBookmark, isOpen, onToggle }: WeekGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && groupRef.current) {
      // Small timeout to allow the accordion animation to start
      setTimeout(() => {
        groupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isOpen]);

  // Calculate week progress
  const completedInWeek = days.filter(d => completedDays.includes(d.id)).length;
  const weekProgress = Math.round((completedInWeek / days.length) * 100);
  const isWeekCompleted = completedInWeek === days.length;

  return (
    <div ref={groupRef} className="mb-6 w-full scroll-mt-24">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-lg",
          isOpen 
            ? "bg-slate-800/80 border-blue-500/50" 
            : "bg-slate-900/60 border-white/10 hover:bg-slate-800/60 hover:border-white/20",
          isWeekCompleted && !isOpen ? "border-emerald-500/30 bg-emerald-950/20" : ""
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl transition-colors",
            isWeekCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
          )}>
            <Calendar className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">Week {weekNumber}</h2>
            <p className="text-sm text-slate-400 mt-1">
              Days {days[0]?.id} to {days[days.length - 1]?.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className={cn(
              "text-sm font-bold",
              isWeekCompleted ? "text-emerald-400" : "text-blue-400"
            )}>
              {weekProgress}% Complete
            </span>
            <span className="text-xs text-slate-500">{completedInWeek} / {days.length} days</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
            {isOpen ? <ChevronUp className="w-5 h-5 text-white/70" /> : <ChevronDown className="w-5 h-5 text-white/70" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-8 pb-4 relative">
              {/* Vertical line connecting days */}
              <div className="absolute left-6 md:left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-emerald-500/0 z-0 hidden md:block">
                <div className="absolute top-0 bottom-0 left-0 w-full bg-white/20 blur-[2px]" />
              </div>
              
              <div className="relative z-10 flex flex-col gap-6 md:gap-8 px-2 sm:px-4 md:pl-16 md:pr-4">
                {days.map((dayData, index) => (
                  <RoadmapCard
                    key={dayData.id}
                    data={dayData}
                    index={index}
                    isCompleted={completedDays.includes(dayData.id)}
                    isBookmarked={bookmarkedDays.includes(dayData.id)}
                    onToggle={onToggleDay}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
