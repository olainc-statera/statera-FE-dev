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
      
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
