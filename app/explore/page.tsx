"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudioCard } from "@/components/studio-card";
import { ClassCard } from "@/components/class-card";
import { studios, classes, categories } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"studios" | "classes">("classes");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studioName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(c.category);
    const matchesPrice = c.price >= priceRange[0] && c.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredStudios = studios.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      s.categories.some((cat) => selectedCategories.includes(cat));
    return matchesSearch && matchesCategory;
  });

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
            <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
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
        {selectedCategories.length > 0 && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
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
              onClick={() => setSelectedCategories([])}
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
            ? `${filteredClasses.length} classes found`
            : `${filteredStudios.length} studios found`}
        </p>

        {viewMode === "classes" ? (
          <div className="space-y-3">
            {filteredClasses.map((fitnessClass) => (
              <ClassCard
                key={fitnessClass.id}
                fitnessClass={fitnessClass}
                variant="horizontal"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
