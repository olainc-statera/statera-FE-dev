"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Studio } from "@/lib/types";
import { categories } from "@/lib/data";

interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  return (
    <Link href={`/studio/${studio.id}`} className="group block">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
        <div className="relative aspect-[16/9]">
          <Image
            src={studio.image || "/placeholder.svg"}
            alt={studio.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-background/70"
            onClick={(e) => {
              e.preventDefault();
              // Toggle favorite
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
          {studio.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{studio.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{studio.location}</span>
                <span>•</span>
                <span>{studio.distance}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium text-foreground">{studio.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({studio.reviewCount})
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {studio.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            {studio.categories.slice(0, 3).map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="secondary" className="text-xs">
                  {cat?.name}
                </Badge>
              );
            })}
            <span className="text-sm font-medium text-muted-foreground ml-auto">
              {studio.priceRange}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
