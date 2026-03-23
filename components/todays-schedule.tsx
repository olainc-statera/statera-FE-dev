"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, CalendarDays } from "lucide-react";
import { classes as mockClasses } from "@/lib/data";
import { ClassCard } from "@/components/class-card";
import { searchClasses } from "@/lib/api/classes";
import type { FitnessClass } from "@/lib/types";

export function TodaysSchedule() {
  const [displayClasses, setDisplayClasses] = useState<FitnessClass[]>(
    mockClasses.slice(0, 4)
  );

  useEffect(() => {
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    searchClasses({
      dateFrom: today.toISOString(),
      dateTo: endOfDay.toISOString(),
      limit: 4,
      sortBy: 'startTime',
      availableOnly: true,
    })
      .then(({ classes }) => {
        if (classes.length > 0) setDisplayClasses(classes);
      })
      .catch(() => {
        // Keep mock data on error
      });
  }, []);

  return (
    <section className="py-4 sm:py-6 px-3 sm:px-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground font-[family-name:var(--font-display)]">
              {"Today's Classes"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Available near you</p>
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

      <div className="space-y-2 sm:space-y-3">
        {displayClasses.map((fitnessClass) => (
          <ClassCard
            key={fitnessClass.id}
            fitnessClass={fitnessClass}
            variant="horizontal"
          />
        ))}
      </div>
    </section>
  );
}
