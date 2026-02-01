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
  Info,
  Coins,
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

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

  const handleBook = async () => {
    setIsBooking(true);
    // Simulate booking
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Image */}
      <div className="relative h-64">
        <Image
          src={fitnessClass.image || "/placeholder.svg"}
          alt={fitnessClass.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

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

        {/* Difficulty Badge */}
        <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
          {fitnessClass.difficulty}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Class Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-display)]">
              {fitnessClass.name}
            </h1>
            <Link
              href={`/studio/${studio.id}`}
              className="text-sm text-primary hover:underline"
            >
              {studio.name}
            </Link>
          </div>
          <div className="text-right">
            {fitnessClass.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {fitnessClass.originalPrice} credits
              </p>
            )}
            <p className="text-2xl font-bold text-primary flex items-center gap-1">
              <Coins className="w-5 h-5" />
              {fitnessClass.price} credits
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">
              {timeStr} • {fitnessClass.duration}min
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground truncate">
              {studio.location}
            </p>
          </div>
        </div>

        {/* Spots Availability */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
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

        {/* Instructor */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Instructor</h3>
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 ring-2 ring-primary/20">
              <AvatarImage
                src={fitnessClass.instructorImage || "/placeholder.svg"}
                alt={fitnessClass.instructor}
              />
              <AvatarFallback>{fitnessClass.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {fitnessClass.instructor}
              </p>
              <p className="text-sm text-muted-foreground">
                Lead Instructor at {studio.name}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-2">About This Class</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {fitnessClass.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {fitnessClass.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* What to Bring */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            What to Bring
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Comfortable workout clothes
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Water bottle
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Yoga mat (available for rent)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Arrive 10 minutes early
            </li>
          </ul>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h3 className="font-medium text-foreground mb-1 text-sm">
            Cancellation Policy
          </h3>
          <p className="text-xs text-muted-foreground">
            Free cancellation up to 12 hours before class. Late cancellations or
            no-shows may be charged the full class fee.
          </p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
            <p className="text-foreground font-medium">{timeStr}</p>
          </div>
          <div className="text-right">
            {fitnessClass.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {fitnessClass.originalPrice} credits
              </p>
            )}
            <p className="text-xl font-bold text-primary flex items-center gap-1">
              <Coins className="w-4 h-4" />
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
              {isBooked ? "Booked!" : "Book Now"}
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
                <span className="font-medium">{fitnessClass.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">
                  {dateStr}, {timeStr}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{fitnessClass.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{studio.location}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {fitnessClass.price} credits
                </span>
              </div>
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
