"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getMoodConfig, type MoodType } from "@/lib/mood-config";

interface CategoryPillsProps {
  mood: MoodType;
}

export function CategoryPills({ mood }: CategoryPillsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const config = getMoodConfig(mood);
  
  // Sort categories to show recommended ones first when mood is selected
  const sortedCategories = mood
    ? [...categories].sort((a, b) => {
        const aRecommended = config.recommendedCategories.includes(a.id);
        const bRecommended = config.recommendedCategories.includes(b.id);
        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;
        return 0;
      })
    : categories;

  // Reset selection when mood changes
  useEffect(() => {
    setSelected(null);
  }, [mood]);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3">
        <button
          onClick={() => setSelected(null)}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0",
            selected === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All
        </button>
        {sortedCategories.map((category) => {
          const isRecommended = mood && config.recommendedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => setSelected(category.id)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-1.5",
                selected === category.id
                  ? "bg-primary text-primary-foreground"
                  : isRecommended
                    ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
