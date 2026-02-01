"use client";

import { useState, useEffect } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { MoodSelector } from "@/components/quick-stats";
import { CategoryPills } from "@/components/category-pills";
import { FeaturedStudios } from "@/components/featured-studios";
import { UpcomingClasses } from "@/components/upcoming-classes";
import { TodaysSchedule } from "@/components/todays-schedule";
import type { MoodType } from "@/lib/mood-config";

const MOOD_STORAGE_KEY = "statera_last_mood";

export default function HomePage() {
  const [mood, setMood] = useState<MoodType>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load last mood from localStorage on mount
  useEffect(() => {
    const savedMood = localStorage.getItem(MOOD_STORAGE_KEY) as MoodType;
    if (savedMood) {
      setMood(savedMood);
    }
    setIsLoaded(true);
  }, []);

  // Save mood to localStorage when it changes
  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
    if (newMood) {
      localStorage.setItem(MOOD_STORAGE_KEY, newMood);
    } else {
      localStorage.removeItem(MOOD_STORAGE_KEY);
    }
  };

  // Prevent hydration mismatch by not rendering mood-dependent content until loaded
  if (!isLoaded) {
    return (
      <MobileShell>
        <div className="px-4 py-6">
          <div className="h-48 bg-muted/50 rounded-xl animate-pulse" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <MoodSelector selectedMood={mood} onMoodChange={handleMoodChange} />
      <CategoryPills mood={mood} />
      <FeaturedStudios mood={mood} />
      <UpcomingClasses mood={mood} />
      <TodaysSchedule />
    </MobileShell>
  );
}
