"use client";

import { useState, useEffect } from "react";
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
  Check,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClassCard } from "@/components/class-card";
import { getStudio, getStudioClasses, type BackendStudio } from "@/lib/api/studios";
import { getReviews, markReviewHelpful, type BackendReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api-client";
import type { FitnessClass } from "@/lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "fill-primary text-primary" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

export default function StudioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const [studio, setStudio] = useState<BackendStudio | null>(null);
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [reviews, setReviews] = useState<BackendReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getStudio(id),
      getStudioClasses(id, 20),
      getReviews({ studioId: id, limit: 20, sortBy: "createdAt" }),
    ])
      .then(([s, c, r]) => {
        setStudio(s);
        setClasses(c);
        setReviews(r);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Rating distribution computed from real reviews
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    pct:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
        : 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading studio...</p>
      </div>
    );
  }

  if (notFound || !studio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Studio not found</p>
      </div>
    );
  }

  const heroImage = studio.coverImage ?? studio.logo ?? "/placeholder.svg";
  const address = `${studio.address}, ${studio.city}, ${studio.state}`;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
        <Image
          src={heroImage}
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
            <div className="flex-1 min-w-0 pr-3">
              <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
                {studio.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{studio.city}, {studio.state}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="text-lg font-bold text-foreground">
                  {studio.avgRating?.toFixed(1) ?? "—"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {studio._count.reviews} reviews
              </p>
            </div>
          </div>

          {studio.isVerified && (
            <Badge variant="secondary" className="mb-3 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Verified Studio
            </Badge>
          )}

          {studio.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {studio.description}
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted mb-4">
            <TabsTrigger value="classes">
              Classes {classes.length > 0 && `(${classes.length})`}
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-3">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <ClassCard key={cls.id} fitnessClass={cls} variant="horizontal" />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming classes
              </p>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* Contact */}
            {(studio.phone || studio.email || studio.website) && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3">Contact</h3>
                <div className="space-y-2 text-sm">
                  {studio.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-foreground">{studio.phone}</span>
                    </div>
                  )}
                  {studio.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{studio.email}</span>
                    </div>
                  )}
                  {studio.website && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Website</span>
                      <a
                        href={studio.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit site
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {studio.amenities.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {studio.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{address}</p>
              {studio.latitude && studio.longitude ? (
                <a
                  href={`https://maps.google.com/?q=${studio.latitude},${studio.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                    <span className="text-muted-foreground text-sm">
                      Open in Google Maps ↗
                    </span>
                  </div>
                </a>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Map unavailable</span>
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            {studio.cancellationPolicy && (
              <div className="bg-muted rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Cancellation Policy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {studio.cancellationPolicy}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.length > 0 ? (
              <>
                {/* Rating Summary */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground">
                      {studio.avgRating?.toFixed(1) ?? "—"}
                    </p>
                    <div className="flex items-center justify-center gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(studio.avgRating ?? 0)
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {studio._count.reviews} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingDistribution.map(({ stars, pct }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-3">{stars}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={() =>
                      markReviewHelpful(review.id).then(() =>
                        setReviews((prev) =>
                          prev.map((r) =>
                            r.id === review.id ? { ...r, helpful: r.helpful + 1 } : r
                          )
                        )
                      )
                    }
                  />
                ))}
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Be the first to leave a review after attending a class
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <Link href={`/explore?studioId=${studio.id}`}>
          <Button className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Browse Classes
          </Button>
        </Link>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  onHelpful,
}: {
  review: BackendReview;
  onHelpful: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={review.user.avatar ?? "/placeholder.svg"}
            alt={`${review.user.firstName} ${review.user.lastName}`}
          />
          <AvatarFallback>{review.user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {review.user.firstName} {review.user.lastName}
          </p>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">
              {timeAgo(review.createdAt)}
            </span>
          </div>
        </div>
      </div>
      {review.title && (
        <p className="text-sm font-medium text-foreground mb-1">{review.title}</p>
      )}
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      )}
      {review.studioResponse && (
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs font-medium text-foreground mb-1">Studio Response</p>
          <p className="text-xs text-muted-foreground">{review.studioResponse}</p>
        </div>
      )}
      <button
        className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        onClick={onHelpful}
      >
        <ThumbsUp className="w-3 h-3" />
        Helpful ({review.helpful})
      </button>
    </div>
  );
}
