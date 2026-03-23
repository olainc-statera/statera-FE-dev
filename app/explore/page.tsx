"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudioCard } from "@/components/studio-card";
import { ClassCard } from "@/components/class-card";
import { categories } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { moods } from "@/components/quick-stats";
import { getMoodConfig, type MoodType } from "@/lib/mood-config";
import { searchClasses } from "@/lib/api/classes";
import { searchStudios } from "@/lib/api/studios";
import type { FitnessClass, Studio } from "@/lib/types";

// Modality mapping: frontend category id → backend enum
const CATEGORY_TO_MODALITY: Record<string, string> = {
  yoga: 'YOGA',
  pilates: 'PILATES',
  hiit: 'HIIT',
  cycling: 'SPIN',
  boxing: 'BOXING',
  barre: 'BARRE',
  strength: 'STRENGTH',
  dance: 'DANCE',
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moodParam = searchParams.get("mood") as MoodType;

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"studios" | "classes">("classes");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType>(moodParam);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [apiClasses, setApiClasses] = useState<FitnessClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [totalClasses, setTotalClasses] = useState(0);

  const [apiStudios, setApiStudios] = useState<Studio[]>([]);
  const [isLoadingStudios, setIsLoadingStudios] = useState(false);
  const [totalStudios, setTotalStudios] = useState(0);

  // Apply mood-based category filters when mood changes
  useEffect(() => {
    if (moodParam) {
      setSelectedMood(moodParam);
      const config = getMoodConfig(moodParam);
      setSelectedCategories(config.recommendedCategories);
    }
  }, [moodParam]);

  // Fetch classes from API
  const fetchClasses = useCallback(async () => {
    setIsLoadingClasses(true);
    try {
      const modalities = selectedCategories
        .map((c) => CATEGORY_TO_MODALITY[c])
        .filter(Boolean);

      // If multiple modalities selected, we fetch each and merge (API supports one at a time)
      // For simplicity, use the first selected modality or no filter
      const params = {
        query: searchQuery || undefined,
        modality: modalities.length === 1 ? modalities[0] : undefined,
        minCredits: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxCredits: priceRange[1] < 50 ? priceRange[1] : undefined,
        limit: 50,
        availableOnly: true,
      };

      const { classes, pagination } = await searchClasses(params);

      // Client-side filter for multi-modality when API only supports one
      const filtered =
        modalities.length > 1
          ? classes.filter((c) => selectedCategories.includes(c.category))
          : classes;

      setApiClasses(filtered);
      setTotalClasses(modalities.length > 1 ? filtered.length : pagination.total);
    } catch {
      setApiClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  }, [searchQuery, selectedCategories, priceRange]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Fetch studios from API
  const fetchStudios = useCallback(async () => {
    setIsLoadingStudios(true);
    try {
      const { studios, total } = await searchStudios({
        query: searchQuery || undefined,
        limit: 50,
      });
      setApiStudios(studios);
      setTotalStudios(total);
    } catch {
      setApiStudios([]);
    } finally {
      setIsLoadingStudios(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (viewMode === "studios") fetchStudios();
  }, [fetchStudios, viewMode]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleMood = (moodId: MoodType) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
      setSelectedCategories([]);
      router.push("/explore");
    } else {
      setSelectedMood(moodId);
      const config = getMoodConfig(moodId);
      setSelectedCategories(config.recommendedCategories);
      router.push(`/explore?mood=${moodId}`);
    }
  };

  const clearMood = () => {
    setSelectedMood(null);
    setSelectedCategories([]);
    router.push("/explore");
  };


  return (
    <MobileShell>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search studios, classes..."
              className="pl-9 bg-muted border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6 overflow-y-auto">
                {/* Mood Filter */}
                <div>
                  <h3 className="font-medium mb-3">Mood</h3>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <Badge
                          key={mood.id}
                          variant={selectedMood === mood.id ? "default" : "outline"}
                          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5"
                          onClick={() => toggleMood(mood.id as MoodType)}
                        >
                          {mood.label}
                          <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Badge
                        key={cat.id}
                        variant={
                          selectedCategories.includes(cat.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleCategory(cat.id)}
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">
                    Credits: {priceRange[0]} - {priceRange[1]}
                  </h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={50}
                    step={5}
                    className="py-4"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={viewMode === "classes" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("classes")}
            className="rounded-full"
          >
            Classes
          </Button>
          <Button
            variant={viewMode === "studios" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("studios")}
            className="rounded-full"
          >
            Studios
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Map
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedMood || selectedCategories.length > 0) && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {selectedMood && (
              <Badge
                variant="default"
                className="shrink-0 cursor-pointer"
                onClick={clearMood}
              >
                {moods.find((m) => m.id === selectedMood)?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge
                  key={catId}
                  variant="secondary"
                  className="shrink-0 cursor-pointer"
                  onClick={() => toggleCategory(catId)}
                >
                  {cat?.name}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              );
            })}
            <button
              onClick={clearMood}
              className="text-xs text-muted-foreground shrink-0"
            >
              Clear all
            </button>
          </div>
        )}
      </header>

      {/* Results */}
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground mb-4">
          {viewMode === "classes"
            ? isLoadingClasses
              ? "Searching..."
              : `${totalClasses} classes found`
            : isLoadingStudios
            ? "Searching..."
            : `${totalStudios} studios found`}
        </p>

        {viewMode === "classes" ? (
          <div className="space-y-3">
            {apiClasses.map((fitnessClass) => (
              <ClassCard
                key={fitnessClass.id}
                fitnessClass={fitnessClass}
                variant="horizontal"
              />
            ))}
            {!isLoadingClasses && apiClasses.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">
                No classes found. Try adjusting your filters.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {apiStudios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
            {!isLoadingStudios && apiStudios.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">
                No studios found. Try a different search.
              </p>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
