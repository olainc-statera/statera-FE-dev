"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { classes, studios } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Instructor details keyed by name
const instructorDetails: Record<
  string,
  { bio: string; certifications: string[]; yearsExp: number; classCount: number }
> = {
  "Maya Chen": {
    bio: "Maya discovered yoga during a trip to Bali and never looked back. She blends traditional vinyasa with modern movement science to create classes that challenge and restore in equal measure.",
    certifications: ["RYT-500", "Prenatal Yoga", "Yin Yoga"],
    yearsExp: 8,
    classCount: 1240,
  },
  "Marcus Johnson": {
    bio: "Former competitive cyclist turned studio instructor. Marcus brings infectious energy and expertly curated playlists to every ride, pushing you beyond what you thought possible.",
    certifications: ["Schwinn Certified", "NASM-CPT", "Precision Nutrition L1"],
    yearsExp: 6,
    classCount: 980,
  },
  "Tony Rivera": {
    bio: "Tony trained as an amateur boxer before transitioning to coaching. He believes boxing is for everyone and focuses on proper technique, mental toughness, and having fun.",
    certifications: ["USA Boxing Coach", "ACE-CPT", "First Aid/CPR"],
    yearsExp: 10,
    classCount: 1560,
  },
  "Sophia Laurent": {
    bio: "Classically trained ballet dancer with a passion for functional fitness. Sophia's barre classes fuse grace and grit for sculpted results.",
    certifications: ["Barre Above Certified", "Pilates Mat", "NASM-CES"],
    yearsExp: 7,
    classCount: 890,
  },
  "Jake Torres": {
    bio: "Jake is a high-intensity specialist who thrives on pushing limits. His sessions are tough but rewarding, designed to maximize calorie burn and build endurance.",
    certifications: ["NSCA-CSCS", "CrossFit L2", "TRX Certified"],
    yearsExp: 5,
    classCount: 720,
  },
  "Elena Woods": {
    bio: "Elena's approach to yoga is deeply restorative. She creates a warm, welcoming space where students can slow down and reconnect with themselves.",
    certifications: ["RYT-200", "Restorative Yoga", "Meditation Teacher"],
    yearsExp: 4,
    classCount: 540,
  },
};

// Studio addresses keyed by studio id
const studioAddresses: Record<string, string> = {
  "1": "142 Mercer St, New York, NY 10012",
  "2": "88 Franklin St, New York, NY 10013",
  "3": "210 W 23rd St, New York, NY 10011",
  "4": "785 Lexington Ave, New York, NY 10065",
  "5": "345 Bedford Ave, Brooklyn, NY 11249",
};

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    user: { name: "Anna P.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    rating: 5,
    content: "Absolutely loved this class! The instructor was incredibly attentive and the energy in the room was amazing. Will definitely be back.",
    date: "2 days ago",
    helpful: 12,
  },
  {
    id: "r2",
    user: { name: "Chris M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    rating: 4,
    content: "Great workout and well-paced. The studio is beautiful and clean. Only wish the class was a bit longer.",
    date: "1 week ago",
    helpful: 8,
  },
  {
    id: "r3",
    user: { name: "Taylor R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
    rating: 5,
    content: "This is my new favorite class. The instructor really knows how to motivate you while keeping everything safe and accessible.",
    date: "2 weeks ago",
    helpful: 15,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "fill-primary text-primary"
              : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const fitnessClass = classes.find((c) => c.id === id);
  const studio = fitnessClass
    ? studios.find((s) => s.id === fitnessClass.studioId)
    : null;

  if (!fitnessClass || !studio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

  const instructor = instructorDetails[fitnessClass.instructor] || {
    bio: "Passionate instructor dedicated to helping you reach your fitness goals.",
    certifications: ["Certified Instructor"],
    yearsExp: 3,
    classCount: 300,
  };

  const studioAddress = studioAddresses[fitnessClass.studioId] || studio.location;
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
    ((fitnessClass.totalSpots - fitnessClass.spotsLeft) /
      fitnessClass.totalSpots) *
    100;

  const studioShare = Math.round(fitnessClass.price * 0.7);
  const averageRating = 4.7;
  const totalReviews = studio.reviewCount;

  const handleBook = async () => {
    setIsBooking(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    setIsBooked(true);
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

        {/* Difficulty Badge */}
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
            <Link
              href={`/studio/${studio.id}`}
              className="text-sm text-primary hover:underline"
            >
              {studio.name}
            </Link>
          </div>
          <div className="text-right shrink-0">
            {fitnessClass.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {fitnessClass.originalPrice} credits
              </p>
            )}
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            {averageRating} ({totalReviews})
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">About This Class</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {fitnessClass.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {fitnessClass.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
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
          {fitnessClass.spotsLeft <= 5 && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Filling up fast! Book now to secure your spot.
            </p>
          )}
        </div>

        {/* Credit Transparency */}
        <div className="bg-accent/40 border border-border rounded-xl p-3 sm:p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Credit Transparency</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Of your {fitnessClass.price} credits, {studioShare} credits (70%) go directly to{" "}
              <span className="font-medium text-foreground">{studio.name}</span>. The remainder supports platform operations and booking services.
            </p>
          </div>
        </div>

        {/* Studio Info and Map */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Studio Location</h3>
            <Link
              href={`/studio/${studio.id}`}
              className="flex items-center gap-3 mb-3"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={studio.image || "/placeholder.svg"}
                  alt={studio.name}
                  fill
                  className="object-cover"
                />
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
          {/* Map embed */}
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

        {/* Instructor Profile */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Instructor</h3>
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-border">
              <AvatarImage
                src={fitnessClass.instructorImage || "/placeholder.svg"}
                alt={fitnessClass.instructor}
              />
              <AvatarFallback>{fitnessClass.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{fitnessClass.instructor}</p>
              <p className="text-xs text-muted-foreground">
                {instructor.yearsExp} years experience · {instructor.classCount}+ classes taught
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {instructor.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-[10px] sm:text-xs font-normal flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {instructor.bio}
          </p>
        </div>

        {/* Reviews and Ratings */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Reviews</h3>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">{averageRating}</span>
              <span className="text-xs text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-1.5 mb-4">
            {[
              { stars: 5, pct: 72 },
              { stars: 4, pct: 18 },
              { stars: 3, pct: 7 },
              { stars: 2, pct: 2 },
              { stars: 1, pct: 1 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-3 text-right">{row.stars}</span>
                <Star className="w-3 h-3 fill-primary text-primary" />
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">{review.user.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                  {review.content}
                </p>
                <button className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpful})
                </button>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="w-full mt-3 text-xs text-primary">
            View all {totalReviews} reviews
          </Button>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-muted rounded-xl p-3 sm:p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">
            Cancellation Policy
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Free cancellation up to 12 hours before class. Late cancellations or
            no-shows will be charged the full credit amount. Credits will be refunded to your account within 24 hours of a valid cancellation.
          </p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 z-50">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
            <p className="text-sm font-medium text-foreground">{timeStr} · {fitnessClass.duration}min</p>
          </div>
          <div className="text-right">
            {fitnessClass.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {fitnessClass.originalPrice} credits
              </p>
            )}
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
              disabled={isBooked}
            >
              {isBooked ? "Booked!" : `Book Now · ${fitnessClass.price} credits`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                {"You're about to book"} {fitnessClass.name} at {studio.name}
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-foreground">{studioAddress}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Coins className="w-4 h-4 text-primary" />
                  {fitnessClass.price} credits
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {studioShare} credits (70%) go directly to {studio.name}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBookingDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBook}
                disabled={isBooking}
              >
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
