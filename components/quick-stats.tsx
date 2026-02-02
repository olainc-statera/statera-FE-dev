"use client";

import { cn } from "@/lib/utils";
import { X, Moon, Wind, Scale, Zap, Flame, Sparkles } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { MoodType } from "@/lib/mood-config";

interface MoodSelectorProps {
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

const moods = [
  { id: "tired", label: "Tired", icon: Moon },
  { id: "stressed", label: "Stressed", icon: Wind },
  { id: "balanced", label: "Balanced", icon: Scale },
  { id: "energized", label: "Energized", icon: Zap },
  { id: "motivated", label: "Motivated", icon: Flame },
  { id: "creative", label: "Creative", icon: Sparkles },
];

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <section className="pt-4 sm:pt-6 pb-2 sm:pb-3">
      <div className="flex items-start justify-between mb-3 sm:mb-4 px-3 sm:px-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            How are you feeling today?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {""}
          </p>
        </div>
        {selectedMood && (
          <button
            onClick={() => onMoodChange(null)}
            className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 ml-2"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-3 sm:px-4 pb-2">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => onMoodChange(mood.id as MoodType)}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border transition-all duration-200 shrink-0",
                  selectedMood === mood.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card text-foreground border-border hover:border-primary/50"
                )}
              >
                <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  );
}
