"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Users,
  MapPin,
  Calendar,
  Zap,
  Coins,
  Star,
  Shield,
  ThumbsUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { getClass } from "@/lib/api/classes";
import { createBooking } from "@/lib/api/bookings";
import { getReviews, markReviewHelpful, type BackendReview } from "@/lib/api/reviews";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import type { FitnessClass } from "@/lib/types";
import type { BackendClassDetail } from "@/lib/api/classes";

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

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [fitnessClass, setFitnessClass] = useState<FitnessClass | null>(null);
  const [rawClass, setRawClass] = useState<BackendClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reviews, setReviews] = useState<BackendReview[]>([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getClass(id),
      getReviews({ classId: id, limit: 20, sortBy: "createdAt" }),
    ])
      .then(([{ mapped, raw }, fetchedReviews]) => {
        setFitnessClass(mapped);
        setRawClass(raw);
        setReviews(fetchedReviews);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading class...</p>
      </div>
    );
  }

  if (notFound || !fitnessClass || !rawClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

  const studio = rawClass.studio;
  const instructor = rawClass.instructor;

  const studioAddress = studio
    ? `${studio.address}, ${studio.city}, ${studio.state}`
    : fitnessClass.studioName;

  const mapQuery = encodeURIComponent(studioAddress);

  const dateStr = new Date(fitnessClass.datetime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeStr = new Date(fitnessClass.datetime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const spotsPercentage =
    ((fitnessClass.totalSpots - fitnessClass.spotsLeft) / fitnessClass.totalSpots) * 100;

  const studioShare = Math.round(fitnessClass.price * 0.7);
  const reviewCount = rawClass._count?.reviews ?? 0;

  const handleBook = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsBooking(true);
    setBookingError("");
    try {
      const result = await createBooking(fitnessClass.id);
      setIsBooked(true);
      setShowBookingDialog(false);
      updateUser({ creditBalance: result.creditBalance });
    } catch (err) {
      if (err instanceof ApiError) {
        setBookingError(err.message);
      } else {
        setBookingError("Failed to book class. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Image */}
      <div className="relative h-56 sm:h-72">
        <Image
          src={fitnessClass.image || "/placeholder.svg"}
          alt={fitnessClass.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/60 backdrop-blur-sm hover:bg-card/80 text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-card/60 backdrop-blur-sm hover:bg-card/80 text-foreground"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`bg-card/60 backdrop-blur-sm hover:bg-card/80 ${
                isFavorite ? "text-destructive" : "text-foreground"
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <Badge className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm text-foreground border border-border">
          {fitnessClass.difficulty}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 pt-4 space-y-4">
        {/* Class Title and Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
              {fitnessClass.name}
            </h1>
            {studio && (
              <Link href={`/studio/${studio.id}`} className="text-sm text-primary hover:underline">
                {studio.name}
              </Link>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-1">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {fitnessClass.price}
            </p>
            <p className="text-[10px] text-muted-foreground">credits</p>
          </div>
        </div>

        {/* Quick Info Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {dateStr}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {timeStr} · {fitnessClass.duration}min
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              {reviewCount} reviews
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">About This Class</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {fitnessClass.description}
          </p>
          {fitnessClass.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {fitnessClass.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Spots Availability */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Availability
            </span>
            <span className="text-sm font-medium text-foreground">
              {fitnessClass.spotsLeft} of {fitnessClass.totalSpots} spots left
            </span>
          </div>
          <Progress value={spotsPercentage} className="h-2" />
          {fitnessClass.spotsLeft <= 5 && fitnessClass.spotsLeft > 0 && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Filling up fast! Book now to secure your spot.
            </p>
          )}
          {fitnessClass.spotsLeft === 0 && (
            <p className="text-xs text-destructive mt-2">Class is full.</p>
          )}
        </div>

        {/* Credit Transparency */}
        <div className="bg-accent/40 border border-border rounded-xl p-3 sm:p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Credit Transparency</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Of your {fitnessClass.price} credits, {studioShare} credits (70%) go directly to{" "}
              <span className="font-medium text-foreground">{fitnessClass.studioName}</span>. The
              remainder supports platform operations and booking services.
            </p>
          </div>
        </div>

        {/* Studio Info and Map */}
        {studio && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Studio Location</h3>
              <Link href={`/studio/${studio.id}`} className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                  {studio.logo && (
                    <Image src={studio.logo} alt={studio.name} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{studio.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {studioAddress}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            </div>
            <div className="relative w-full h-36 sm:h-44 bg-muted">
              <iframe
                title={`Map of ${studio.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Instructor Profile */}
        {instructor && (
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Your Instructor</h3>
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-border">
                <AvatarImage
                  src={instructor.photo || "/placeholder.svg"}
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                />
                <AvatarFallback>{instructor.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {instructor.bio ?? "Passionate instructor dedicated to helping you reach your fitness goals."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Reviews</h3>
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">({reviewCount} total)</span>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={review.user.avatar ?? "/placeholder.svg"} alt={`${review.user.firstName} ${review.user.lastName}`} />
                        <AvatarFallback>{review.user.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.comment && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                      {review.comment}
                    </p>
                  )}
                  {review.studioResponse && (
                    <div className="mt-2 p-2 rounded bg-primary/5 border border-primary/10">
                      <p className="text-[10px] font-medium text-foreground">Studio Response</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{review.studioResponse}</p>
                    </div>
                  )}
                  <button
                    className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() =>
                      markReviewHelpful(review.id).then(() =>
                        setReviews((prev) =>
                          prev.map((r) => r.id === review.id ? { ...r, helpful: r.helpful + 1 } : r)
                        )
                      )
                    }
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="bg-muted rounded-xl p-3 sm:p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Cancellation Policy</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Free cancellation up to 12 hours before class. 50% refund between 2–12 hours.
            No refund within 2 hours. Credits are returned to your account automatically.
          </p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 z-50">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
            <p className="text-sm font-medium text-foreground">
              {timeStr} · {fitnessClass.duration}min
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground flex items-center gap-1 justify-end">
              <Coins className="w-4 h-4 text-primary" />
              {fitnessClass.price} credits
            </p>
          </div>
        </div>

        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              size="lg"
              disabled={isBooked || fitnessClass.spotsLeft === 0}
            >
              {isBooked
                ? "Booked!"
                : fitnessClass.spotsLeft === 0
                ? "Class Full"
                : `Book Now · ${fitnessClass.price} credits`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                {"You're about to book"} {fitnessClass.name}
                {studio ? ` at ${studio.name}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium text-foreground">{fitnessClass.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium text-foreground">
                  {dateStr}, {timeStr}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{fitnessClass.duration} minutes</span>
              </div>
              {studio && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">
                    {studioAddress}
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Coins className="w-4 h-4 text-primary" />
                  {fitnessClass.price} credits
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {studioShare} credits (70%) go directly to {fitnessClass.studioName}
              </p>
              {user && (
                <p className="text-xs text-muted-foreground">
                  Your balance: {user.creditBalance} credits →{" "}
                  {user.creditBalance - fitnessClass.price} after booking
                </p>
              )}
              {bookingError && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {bookingError}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBook} disabled={isBooking}>
                {isBooking ? "Booking..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
