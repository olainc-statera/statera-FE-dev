"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  Coins,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { studios, classes } from "@/lib/data";

type TabType = "studios" | "classes";

// Mock favorited items
const favoritedStudioIds = ["1", "2", "4"];
const favoritedClassIds = ["1", "4", "6"];

export default function FavoritesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("studios");

  const favoriteStudios = studios.filter((s) =>
    favoritedStudioIds.includes(s.id)
  );
  const favoriteClasses = classes.filter((c) =>
    favoritedClassIds.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Favorites</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab("studios")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "studios"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Studios ({favoriteStudios.length})
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "classes"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Classes ({favoriteClasses.length})
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Favorited Studios */}
        {activeTab === "studios" && (
          <div className="space-y-3">
            {favoriteStudios.length === 0 ? (
              <EmptyState type="studios" />
            ) : (
              favoriteStudios.map((studio) => (
                <div
                  key={studio.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={studio.image || "/placeholder.svg"}
                        alt={studio.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      <button className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-destructive text-destructive" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {studio.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-xs font-medium text-foreground">
                          {studio.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({studio.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{studio.location}</span>
                        <span>-</span>
                        <span className="shrink-0">{studio.distance}</span>
                      </div>
                      <Link href={`/studio/${studio.id}`} className="block mt-2.5">
                        <Button size="sm" className="w-full text-xs h-8">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorited Classes */}
        {activeTab === "classes" && (
          <div className="space-y-3">
            {favoriteClasses.length === 0 ? (
              <EmptyState type="classes" />
            ) : (
              favoriteClasses.map((fitnessClass) => {
                const classDate = new Date(fitnessClass.datetime);
                const timeStr = classDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const isAlmostFull =
                  fitnessClass.spotsLeft <= 3 && fitnessClass.spotsLeft > 0;

                return (
                  <div
                    key={fitnessClass.id}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={fitnessClass.image || "/placeholder.svg"}
                          alt={fitnessClass.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <button className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                          <Heart className="w-4 h-4 fill-destructive text-destructive" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {fitnessClass.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {fitnessClass.studioName}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {timeStr}
                          </span>
                          <span>{fitnessClass.duration}min</span>
                          <Badge
                            variant={isAlmostFull ? "destructive" : "secondary"}
                            className="text-[9px] px-1.5 py-0"
                          >
                            <Users className="w-2.5 h-2.5 mr-0.5" />
                            {fitnessClass.spotsLeft} left
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-xs font-bold text-foreground flex items-center gap-0.5">
                            <Coins className="w-3.5 h-3.5" />
                            {fitnessClass.price} credits
                          </span>
                          <Link href={`/class/${fitnessClass.id}`}>
                            <Button size="sm" className="text-xs h-8">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              Book Class
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "studios" | "classes" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Heart className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-foreground font-medium mb-1">
        No favorite {type} yet
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-[240px]">
        {type === "studios"
          ? "Browse studios and tap the heart icon to save your favorites"
          : "Browse classes and tap the heart icon to save your favorites"}
      </p>
      <Link href="/explore" className="mt-4">
        <Button variant="outline" size="sm" className="bg-transparent">
          Explore {type}
        </Button>
      </Link>
    </div>
  );
}
