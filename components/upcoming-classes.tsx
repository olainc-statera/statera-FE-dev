"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { classes } from "@/lib/data";
import { ClassCard } from "@/components/class-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getMoodConfig, type MoodType } from "@/lib/mood-config";

interface UpcomingClassesProps {
  mood: MoodType;
}

export function UpcomingClasses({ mood }: UpcomingClassesProps) {
  const config = getMoodConfig(mood);
  
  // Sort and filter classes based on mood
  const upcomingClasses = [...classes]
    .sort((a, b) => {
      // If mood is selected, prioritize matching classes
      if (mood) {
        const aMatchesCategory = config.recommendedCategories.includes(a.category);
        const bMatchesCategory = config.recommendedCategories.includes(b.category);
        const aMatchesTags = a.tags.some(tag => config.recommendedTags.includes(tag));
        const bMatchesTags = b.tags.some(tag => config.recommendedTags.includes(tag));
        const aMatchesDuration = config.recommendedDurations.includes(a.duration);
        const bMatchesDuration = config.recommendedDurations.includes(b.duration);
        
        const aScore = (aMatchesCategory ? 3 : 0) + (aMatchesTags ? 2 : 0) + (aMatchesDuration ? 1 : 0);
        const bScore = (bMatchesCategory ? 3 : 0) + (bMatchesTags ? 2 : 0) + (bMatchesDuration ? 1 : 0);
        
        if (aScore !== bScore) return bScore - aScore;
      }
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
    })
    .slice(0, 6);

  return (
    <section className="py-4 sm:py-6">
      <div className="flex items-center justify-between px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground font-[family-name:var(--font-display)] truncate">
              {config.headline}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{config.subtitle}</p>
          </div>
        </div>
        <Link
          href="/explore"
          className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1 shrink-0 ml-2"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 sm:gap-4 px-3 sm:px-4 pb-2">
          {upcomingClasses.map((fitnessClass) => (
            <div key={fitnessClass.id} className="shrink-0 w-52 sm:w-56 md:w-64">
              <ClassCard fitnessClass={fitnessClass} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  );
}
