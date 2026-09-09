"use client";

import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import RoadmapCard from "@/components/RoadmapCard";
import ProgressTracker from "@/components/ProgressTracker";

export default function Home() {
  const { completedDays, toggleDay, getProgressPercentage, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const percentage = getProgressPercentage(roadmapData.length);

  return (
    <main className="min-h-screen bg-slate-900 relative selection:bg-blue-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <ProgressTracker 
        percentage={percentage} 
        totalCompleted={completedDays.length} 
        totalDays={roadmapData.length} 
      />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Full Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Your personalized roadmap to mastering modern web development. Follow the path, track your progress, and build amazing projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {roadmapData.map((dayData, index) => (
            <RoadmapCard
              key={dayData.id}
              data={dayData}
              index={index}
              isCompleted={completedDays.includes(dayData.id)}
              onToggle={toggleDay}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
