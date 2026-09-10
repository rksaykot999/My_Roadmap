"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Pencil, Save, X, Plus, Text } from "lucide-react";
import { RoadmapDay, RoadmapSection } from "@/data/roadmapData";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";

interface RoadmapCardProps {
  roadmapId: string;
  data: RoadmapDay;
  isCompleted: boolean;
  isBookmarked: boolean;
  index: number;
  readOnly?: boolean;
}

export default function RoadmapCard({ roadmapId, data, isCompleted, isBookmarked, index, readOnly = false }: RoadmapCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toggleDay, toggleBookmark, updateDay } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  
  // Convert legacy to dynamic sections if needed
  const initialSections = data.sections && data.sections.length > 0 
    ? data.sections 
    : [
        ...(data.frontend ? [{ id: 'frontend', title: 'Frontend & UI/UX', content: data.frontend }] : []),
        ...(data.backend ? [{ id: 'backend', title: 'Backend & Database', content: data.backend }] : []),
        ...(data.aiTools ? [{ id: 'aiTools', title: 'AI Tools Practice', content: data.aiTools }] : []),
        ...(data.deliverable ? [{ id: 'deliverable', title: 'Deliverable', content: data.deliverable }] : []),
      ];

  const [editForm, setEditForm] = useState({
    title: data.title || "",
    sections: initialSections
  });
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  const handleSave = () => {
    // When saving, we override the entire day structure to use the new sections
    // and clear legacy fields to prevent duplication
    updateDay(roadmapId, data.id, {
      title: editForm.title,
      sections: editForm.sections,
      frontend: undefined,
      backend: undefined,
      aiTools: undefined,
      deliverable: undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      title: data.title || "",
      sections: initialSections
    });
    setIsEditing(false);
  };

  const addSection = () => {
    setEditForm({
      ...editForm,
      sections: [
        ...editForm.sections,
        { id: Math.random().toString(36).substr(2, 9), title: "New Section", content: "" }
      ]
    });
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const removeSection = (id: string) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.filter(s => s.id !== id)
    });
  };

  const displaySections = isEditing ? editForm.sections : initialSections;

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity, y }}
      className={cn(
        "relative p-4 sm:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-xl mb-6 sm:mb-12 last:mb-0 sm:last:mb-0 transition-colors duration-300 shadow-2xl overflow-hidden group/card",
        isCompleted
          ? "bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          : "bg-slate-900/80 border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-400">{data.day}</span>
          </div>
          {isEditing ? (
            <input 
              type="text" 
              placeholder="Day Title (Optional)"
              value={editForm.title}
              onChange={e => setEditForm({...editForm, title: e.target.value})}
              className="mt-2 w-full max-w-sm bg-slate-900/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            editForm.title && (
              <h3 className="text-lg font-semibold text-white/90 mt-1">{editForm.title}</h3>
            )
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!readOnly && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full p-2"
              title="Edit Day"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transition-colors group-hover:text-amber-400" />
            </button>
          )}
          <button
            onClick={() => toggleBookmark(roadmapId, data.id)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full p-2"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            ) : (
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 transition-colors group-hover:text-blue-400" />
            )}
          </button>

          <button
            onClick={() => toggleDay(roadmapId, data.id)}
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
        {isEditing ? (
          <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
            {displaySections.map((section, idx) => (
              <div key={section.id} className="relative group/section border border-white/10 rounded-lg p-3 bg-slate-900/30">
                <button 
                  onClick={() => removeSection(section.id)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 bg-slate-800 rounded-md transition-colors"
                  title="Remove Section"
                >
                  <X className="w-3 h-3" />
                </button>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={e => updateSection(section.id, 'title', e.target.value)}
                  className="w-full max-w-[200px] mb-2 bg-transparent border-b border-white/10 p-1 text-sm font-semibold text-blue-400 focus:outline-none focus:border-blue-500"
                  placeholder="Section Title"
                />
                <textarea 
                  value={section.content} 
                  onChange={e => updateSection(section.id, 'content', e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]" 
                  placeholder="Section Content..."
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button onClick={addSection} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs font-medium transition-colors">
                <Plus className="w-3 h-3" /> Add Section
              </button>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white transition-colors">
                  <X className="w-3 h-3" /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors">
                  <Save className="w-3 h-3" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {displaySections.length === 0 ? (
              <p className="text-slate-500 italic">No content for this day.</p>
            ) : (
              displaySections.map((section, idx) => (
                <div key={section.id} className="flex gap-3 sm:gap-4">
                  <div className="bg-blue-500/10 p-1.5 sm:p-2 rounded-xl h-fit shrink-0">
                    <Text className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 pt-0.5 sm:pt-1">
                    <span className="font-semibold text-white block mb-0.5 sm:mb-1">{section.title}</span>
                    <p className="leading-snug sm:leading-relaxed whitespace-pre-wrap">{section.content}</p>
                  </div>
                </div>
              ))
            )}
          </>
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
