import { MobileShell } from "@/components/mobile-shell";
import { MoodSelector } from "@/components/quick-stats";
import { FeaturedStudios } from "@/components/featured-studios";
import { UpcomingClasses } from "@/components/upcoming-classes";
import { TodaysSchedule } from "@/components/todays-schedule";

export default function HomePage() {
  return (
    <MobileShell>
      <MoodSelector />
      <FeaturedStudios />
      <UpcomingClasses />
      <TodaysSchedule />
    </MobileShell>
  );
}
