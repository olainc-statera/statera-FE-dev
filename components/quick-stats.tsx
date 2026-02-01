"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { MoodType } from "@/lib/mood-config";

interface MoodSelectorProps {
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

const moods = [
  { id: "tired", label: "Tired", image: "/moods/tired.jpg" },
  { id: "stressed", label: "Stressed", image: "/moods/stressed.jpg" },
  { id: "balanced", label: "Balanced", image: "/moods/balanced.jpg" },
  { id: "energized", label: "Energized", image: "/moods/energized.jpg" },
  { id: "motivated", label: "Motivated", image: "/moods/motivated.jpg" },
  { id: "creative", label: "Creative", image: "/moods/creative.jpg" },
];

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <section className="px-3 sm:px-4 pt-4 sm:pt-6 pb-2 sm:pb-3">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            How are you feeling today?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {"We'll tailor classes to match your energy."}
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
      
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodChange(mood.id as MoodType)}
            className={cn(
              "flex flex-col items-center overflow-hidden rounded-lg sm:rounded-xl border transition-all duration-200",
              selectedMood === mood.id 
                ? "border-primary ring-2 ring-primary/30" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src={mood.image || "/placeholder.svg"}
                alt={mood.label}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 30vw, 120px"
              />
              {selectedMood === mood.id && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </div>
            <div className={cn(
              "w-full py-1 sm:py-1.5 text-center transition-colors",
              selectedMood === mood.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-foreground"
            )}>
              <span className="text-[10px] sm:text-xs font-medium">{mood.label}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
