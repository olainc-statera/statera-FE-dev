"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { studios } from "@/lib/data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getMoodConfig, type MoodType } from "@/lib/mood-config";

interface FeaturedStudiosProps {
  mood: MoodType;
}

export function FeaturedStudios({ mood }: FeaturedStudiosProps) {
  const config = getMoodConfig(mood);
  
  // Sort studios based on mood - prioritize those with matching categories
  const featuredStudios = [...studios]
    .filter((s) => s.featured)
    .sort((a, b) => {
      if (mood) {
        const aMatches = a.categories.filter(c => config.recommendedCategories.includes(c)).length;
        const bMatches = b.categories.filter(c => config.recommendedCategories.includes(c)).length;
        return bMatches - aMatches;
      }
      return 0;
    });

  return (
    <section className="sm:py-6 py-8">
      <div className="flex items-center justify-between px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold text-foreground font-[family-name:var(--font-display)]">
            Featured Studios
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{config.studioSubtitle}</p>
        </div>
        <Link
          href="/explore"
          className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1 shrink-0 ml-2"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 sm:gap-4 px-3 sm:px-4 pb-2">
          {featuredStudios.map((studio) => (
            <Link
              key={studio.id}
              href={`/studio/${studio.id}`}
              className="group shrink-0 w-56 sm:w-64 md:w-72"
            >
              <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
                <Image
                  src={studio.image || "/placeholder.svg"}
                  alt={studio.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs">
                  Featured
                </Badge>
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                    {studio.name}
                  </h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary text-primary" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        {studio.rating}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({studio.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">{studio.location}</span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">{studio.distance}</span>
              </div>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  );
}
