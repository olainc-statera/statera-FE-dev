"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { FitnessClass } from "@/lib/types";

interface ClassCardProps {
  fitnessClass: FitnessClass;
  variant?: "horizontal" | "vertical";
}

export function ClassCard({ fitnessClass, variant = "vertical" }: ClassCardProps) {
  const timeStr = new Date(fitnessClass.datetime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const spotsPercentage =
    (fitnessClass.spotsLeft / fitnessClass.totalSpots) * 100;
  const isAlmostFull = spotsPercentage <= 20;

  if (variant === "horizontal") {
    return (
      <Link href={`/class/${fitnessClass.id}`} className="group block">
        <div className="flex gap-2.5 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md sm:rounded-lg overflow-hidden shrink-0">
            <Image
              src={fitnessClass.image || "/placeholder.svg"}
              alt={fitnessClass.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {fitnessClass.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {fitnessClass.studioName}
                </p>
              </div>
              <div className="text-right shrink-0">
                {fitnessClass.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                    {fitnessClass.originalPrice} cr
                  </span>
                )}
                <p className="text-sm sm:text-base font-bold text-primary flex items-center gap-0.5 sm:gap-1 justify-end">
                  <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {fitnessClass.price}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5 sm:gap-1">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {timeStr}
              </span>
              <span>{fitnessClass.duration}min</span>
              <Badge
                variant={isAlmostFull ? "destructive" : "secondary"}
                className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0"
              >
                {fitnessClass.spotsLeft} spots
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/class/${fitnessClass.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
        <Image
          src={fitnessClass.image || "/placeholder.svg"}
          alt={fitnessClass.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 208px, (max-width: 768px) 224px, 256px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <Badge
          className={cn(
            "absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs",
            fitnessClass.difficulty === "Beginner" && "bg-accent text-accent-foreground",
            fitnessClass.difficulty === "Intermediate" && "bg-secondary text-secondary-foreground",
            fitnessClass.difficulty === "Advanced" && "bg-primary text-primary-foreground"
          )}
        >
          {fitnessClass.difficulty}
        </Badge>
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-primary">{timeStr}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              • {fitnessClass.duration}min
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
            {fitnessClass.name}
          </h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0">
            <Image
              src={fitnessClass.instructorImage || "/placeholder.svg"}
              alt={fitnessClass.instructor}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">
            {fitnessClass.instructor}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Badge
            variant={isAlmostFull ? "destructive" : "outline"}
            className="text-[9px] sm:text-[10px] px-1.5 py-0"
          >
            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            {fitnessClass.spotsLeft}
          </Badge>
          <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-0.5 sm:gap-1">
            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {fitnessClass.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
