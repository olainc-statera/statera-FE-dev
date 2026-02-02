"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { classes } from "@/lib/data";
import { ClassCard } from "@/components/class-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function UpcomingClasses() {
  const upcomingClasses = [...classes]
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, 6);

  return (
    <section className="py-4 sm:py-6">
      <div className="flex items-center justify-between px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground font-[family-name:var(--font-display)] truncate">
              Recommended For You
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Based on your preferences</p>
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
