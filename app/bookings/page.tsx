"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileShell } from "@/components/mobile-shell";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  XCircle,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { classes, studios } from "@/lib/data";

const bookings = [
  {
    id: "1",
    classId: "1",
    status: "upcoming" as const,
    bookedAt: "2026-01-30T10:00:00",
  },
  {
    id: "2",
    classId: "2",
    status: "upcoming" as const,
    bookedAt: "2026-01-29T14:00:00",
  },
  {
    id: "3",
    classId: "3",
    status: "completed" as const,
    bookedAt: "2026-01-20T09:00:00",
  },
  {
    id: "4",
    classId: "4",
    status: "completed" as const,
    bookedAt: "2026-01-18T11:00:00",
  },
  {
    id: "5",
    classId: "5",
    status: "cancelled" as const,
    bookedAt: "2026-01-15T08:00:00",
  },
];

export default function BookingsPage() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const handleCancelBooking = () => {
    // Handle cancellation logic
    setCancelDialogOpen(false);
    setSelectedBookingId(null);
  };

  const getClassDetails = (classId: string) => {
    const fitnessClass = classes.find((c) => c.id === classId);
    const studio = fitnessClass
      ? studios.find((s) => s.id === fitnessClass.studioId)
      : null;
    return { fitnessClass, studio };
  };

  return (
    <MobileShell>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your classes and reservations
        </p>
      </header>

      <Tabs defaultValue="upcoming" className="w-full px-4 py-4">
        <TabsList className="w-full grid grid-cols-2 bg-muted mb-4">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No upcoming classes
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book a class to start your fitness journey
              </p>
              <Link href="/explore">
                <Button>Explore Classes</Button>
              </Link>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const { fitnessClass, studio } = getClassDetails(booking.classId);
              if (!fitnessClass || !studio) return null;

              const dateStr = new Date(fitnessClass.datetime).toLocaleDateString(
                "en-US",
                { weekday: "short", month: "short", day: "numeric" }
              );
              const timeStr = new Date(fitnessClass.datetime).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit", hour12: true }
              );

              return (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={fitnessClass.image || "/placeholder.svg"}
                        alt={fitnessClass.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/class/${fitnessClass.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary truncate">
                          {fitnessClass.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">
                        {studio.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 pb-4">
                    <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="flex-1">
                          <QrCode className="w-4 h-4 mr-2" />
                          Check-in QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Check-in QR Code</DialogTitle>
                          <DialogDescription>
                            Show this code at the studio to check in
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center py-6">
                          <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center mb-4">
                            <div className="w-40 h-40 bg-background rounded-lg grid grid-cols-5 gap-1 p-2">
                              {[...Array(25)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`rounded-sm ${
                                    Math.random() > 0.5
                                      ? "bg-foreground"
                                      : "bg-transparent"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Booking #{booking.id.toUpperCase()}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={cancelDialogOpen && selectedBookingId === booking.id}
                      onOpenChange={(open) => {
                        setCancelDialogOpen(open);
                        if (!open) setSelectedBookingId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedBookingId(booking.id)}
                        >
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Booking</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this class? This action
                            cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="bg-muted rounded-lg p-3 text-sm">
                            <p className="font-medium text-foreground">
                              {fitnessClass.name}
                            </p>
                            <p className="text-muted-foreground">
                              {dateStr} at {timeStr}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">
                            Free cancellation applies as this is more than 12 hours
                            before the class.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                          >
                            Keep Booking
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleCancelBooking}
                          >
                            Yes, Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No past classes
              </h3>
              <p className="text-sm text-muted-foreground">
                Your completed classes will appear here
              </p>
            </div>
          ) : (
            pastBookings.map((booking) => {
              const { fitnessClass, studio } = getClassDetails(booking.classId);
              if (!fitnessClass || !studio) return null;

              const dateStr = new Date(fitnessClass.datetime).toLocaleDateString(
                "en-US",
                { weekday: "short", month: "short", day: "numeric" }
              );

              return (
                <div
                  key={booking.id}
                  className={cn(
                    "bg-card border border-border rounded-xl overflow-hidden",
                    booking.status === "cancelled" && "opacity-60"
                  )}
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={fitnessClass.image || "/placeholder.svg"}
                        alt={fitnessClass.name}
                        fill
                        className="object-cover"
                      />
                      {booking.status === "cancelled" && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-destructive" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">
                            {fitnessClass.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {studio.name}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "completed"
                              ? "secondary"
                              : "destructive"
                          }
                          className="shrink-0"
                        >
                          {booking.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {dateStr}
                        </span>
                        {booking.status === "completed" && (
                          <Link href={`/studio/${studio.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Book Again
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </MobileShell>
  );
}
