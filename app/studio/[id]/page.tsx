"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { studios, classes, categories } from "@/lib/data";
import { ClassCard } from "@/components/class-card";

const reviews = [
  {
    id: "1",
    user: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    rating: 5,
    content: "Absolutely love this studio! The instructors are incredibly knowledgeable and the atmosphere is so welcoming. Been coming here for 6 months and never looked back.",
    date: "2 weeks ago",
    helpful: 12,
  },
  {
    id: "2",
    user: { name: "James K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
    rating: 5,
    content: "Clean facilities, great schedule variety, and the community here is amazing. Worth every penny.",
    date: "1 month ago",
    helpful: 8,
  },
  {
    id: "3",
    user: { name: "Emma L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
    rating: 4,
    content: "Great classes but can get crowded during peak hours. Recommend booking early!",
    date: "1 month ago",
    helpful: 5,
  },
];

const amenities = [
  "Showers",
  "Lockers",
  "Towel Service",
  "Water Station",
  "Equipment Provided",
  "Parking Available",
];

export default function StudioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const studio = studios.find((s) => s.id === id);
  const studioClasses = classes.filter((c) => c.studioId === id);

  if (!studio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Studio not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
        <Image
          src={studio.image || "/placeholder.svg"}
          alt={studio.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/50 backdrop-blur-sm hover:bg-background/70"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/50 backdrop-blur-sm hover:bg-background/70"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`bg-background/50 backdrop-blur-sm hover:bg-background/70 ${
                isFavorite ? "text-primary" : ""
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-12 relative z-10">
        {/* Studio Info */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
                {studio.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{studio.location}</span>
                <span>•</span>
                <span>{studio.distance}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="text-lg font-bold text-foreground">{studio.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {studio.reviewCount} reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {studio.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="secondary">
                  {cat?.name}
                </Badge>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {studio.description}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted mb-4">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-3">
            {studioClasses.length > 0 ? (
              studioClasses.map((fitnessClass) => (
                <ClassCard
                  key={fitnessClass.id}
                  fitnessClass={fitnessClass}
                  variant="horizontal"
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming classes
              </p>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            {/* Hours */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mon - Fri</span>
                  <span className="text-foreground">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">7:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                123 Main Street, {studio.location}
              </p>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Map placeholder</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{studio.rating}</p>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(studio.rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {studio.reviewCount} reviews
                </p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{stars}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{review.user.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.content}
                </p>
                <button className="text-xs text-muted-foreground mt-3 hover:text-foreground">
                  Helpful ({review.helpful})
                </button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <Button className="w-full" size="lg">
          <Calendar className="w-4 h-4 mr-2" />
          Book a Class
        </Button>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
