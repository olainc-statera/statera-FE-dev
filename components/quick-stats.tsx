"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Moon, Wind, Scale, Zap, Flame, Sparkles } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { MoodType } from "@/lib/mood-config";

export const moods = [
  { id: "tired", label: "Tired", icon: Moon },
  { id: "stressed", label: "Stressed", icon: Wind },
  { id: "balanced", label: "Balanced", icon: Scale },
  { id: "energized", label: "Energized", icon: Zap },
  { id: "motivated", label: "Motivated", icon: Flame },
  { id: "creative", label: "Creative", icon: Sparkles },
];

export function MoodSelector() {
  const router = useRouter();

  const handleMoodSelect = (moodId: string) => {
    router.push(`/explore?mood=${moodId}`);
  };

  return (
    <section className="pt-4 sm:pt-6 pb-2 sm:pb-3">
      <div className="flex items-start justify-between mb-3 sm:mb-4 px-3 sm:px-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            How are you feeling today?
          </h2>
        </div>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-3 sm:px-4 pb-2">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 shrink-0",
                  "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
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
