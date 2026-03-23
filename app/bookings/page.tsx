"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MobileShell } from "@/components/mobile-shell";
import {
  Calendar,
  Clock,
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
import { getUpcomingBookings, getPastBookings, cancelBooking } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth-context";
import type { MappedBooking } from "@/lib/api/bookings";

export default function BookingsPage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();

  const [upcomingBookings, setUpcomingBookings] = useState<MappedBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<MappedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrBookingId, setQrBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    Promise.all([getUpcomingBookings(), getPastBookings()])
      .then(([upcoming, past]) => {
        setUpcomingBookings(upcoming);
        setPastBookings(past);
      })
      .catch(() => {
        // Keep empty on error
      })
      .finally(() => setIsLoading(false));
  }, [authLoading, user]);

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    setIsCancelling(true);
    setCancelError("");

    try {
      const result = await cancelBooking(selectedBookingId);
      setUpcomingBookings((prev) =>
        prev.filter((b) => b.id !== selectedBookingId)
      );
      setPastBookings((prev) => [
        { ...prev.find((b) => b.id === selectedBookingId)!, status: "cancelled" },
        ...prev,
      ]);
      updateUser({ creditBalance: result.creditBalance });
      setCancelDialogOpen(false);
      setSelectedBookingId(null);
    } catch {
      setCancelError("Failed to cancel. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to view bookings</h3>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </MobileShell>
    );
  }

  const selectedBooking = upcomingBookings.find((b) => b.id === selectedBookingId);

  return (
    <MobileShell>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your classes and reservations</p>
      </header>

      <Tabs defaultValue="upcoming" className="w-full px-4 py-4">
        <TabsList className="w-full grid grid-cols-2 bg-muted mb-4">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming classes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book a class to start your fitness journey
              </p>
              <Link href="/explore">
                <Button>Explore Classes</Button>
              </Link>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const dateStr = new Date(booking.datetime).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = new Date(booking.datetime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div key={booking.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/class/${booking.classId}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary truncate">
                          {booking.className}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{booking.studioName}</p>
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
                    {/* Check-in QR */}
                    <Dialog
                      open={qrDialogOpen && qrBookingId === booking.id}
                      onOpenChange={(open) => {
                        setQrDialogOpen(open);
                        if (!open) setQrBookingId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => setQrBookingId(booking.id)}
                        >
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
                            <div className="w-40 h-40 bg-background rounded-lg flex items-center justify-center">
                              <p className="text-xs text-foreground font-mono text-center px-2 break-all">
                                {booking.checkInCode}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Booking #{booking.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Cancel */}
                    <Dialog
                      open={cancelDialogOpen && selectedBookingId === booking.id}
                      onOpenChange={(open) => {
                        setCancelDialogOpen(open);
                        if (!open) setSelectedBookingId(null);
                        setCancelError("");
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
                            Are you sure you want to cancel this class?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          {selectedBooking && (
                            <div className="bg-muted rounded-lg p-3 text-sm">
                              <p className="font-medium text-foreground">
                                {selectedBooking.className}
                              </p>
                              <p className="text-muted-foreground">
                                {new Date(selectedBooking.datetime).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                at{" "}
                                {new Date(selectedBooking.datetime).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-3">
                            Refund policy: Full refund &gt;12h before, 50% between 2–12h, none &lt;2h.
                          </p>
                          {cancelError && (
                            <p className="text-sm text-destructive mt-2">{cancelError}</p>
                          )}
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
                            disabled={isCancelling}
                          >
                            {isCancelling ? "Cancelling..." : "Yes, Cancel"}
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
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>
          ) : pastBookings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No past classes</h3>
              <p className="text-sm text-muted-foreground">
                Your completed classes will appear here
              </p>
            </div>
          ) : (
            pastBookings.map((booking) => {
              const dateStr = new Date(booking.datetime).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={booking.id}
                  className={cn(
                    "bg-card border border-border rounded-xl overflow-hidden",
                    booking.status === "cancelled" && "opacity-60"
                  )}
                >
                  <div className="flex gap-4 p-4">
                    {booking.status === "cancelled" && (
                      <div className="flex items-center justify-center w-10 shrink-0">
                        <XCircle className="w-6 h-6 text-destructive" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">
                            {booking.className}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {booking.studioName}
                          </p>
                        </div>
                        <Badge
                          variant={booking.status === "completed" ? "secondary" : "destructive"}
                          className="shrink-0"
                        >
                          {booking.status === "completed" ? "Completed" : "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{dateStr}</span>
                        {booking.status === "completed" && booking.studioId && (
                          <Link href={`/studio/${booking.studioId}`}>
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
