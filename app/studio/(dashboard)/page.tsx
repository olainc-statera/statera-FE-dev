"use client";

import {
  TrendingUp,
  Users,
  Calendar,
  Coins,
  Star,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign, // Added DollarSign import
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const studioStats = {
  todayBookings: 24,
  weeklyRevenue: 3420,
  totalClasses: 18,
  averageRating: 4.9,
  revenueChange: 12.5,
  bookingsChange: 8.3,
};

const todaysClasses = [
  {
    id: "1",
    name: "Sunrise Vinyasa Flow",
    time: "7:00 AM",
    instructor: "Maya Chen",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    booked: 18,
    capacity: 20,
    status: "in-progress",
  },
  {
    id: "2",
    name: "Power Pilates",
    time: "9:30 AM",
    instructor: "Elena Woods",
    instructorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    booked: 12,
    capacity: 15,
    status: "upcoming",
  },
  {
    id: "3",
    name: "HIIT Express",
    time: "12:00 PM",
    instructor: "Jake Torres",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-0a1dd7228f2e?w=200&q=80",
    booked: 22,
    capacity: 24,
    status: "upcoming",
  },
  {
    id: "4",
    name: "Restorative Yoga",
    time: "5:30 PM",
    instructor: "Maya Chen",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    booked: 8,
    capacity: 15,
    status: "upcoming",
  },
];

const recentBookings = [
  {
    id: "1",
    user: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    class: "Power Pilates",
    time: "2 min ago",
    amount: 38,
  },
  {
    id: "2",
    user: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    class: "HIIT Express",
    time: "15 min ago",
    amount: 32,
  },
  {
    id: "3",
    user: "Emma Lee",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    class: "Restorative Yoga",
    time: "32 min ago",
    amount: 28,
  },
];

export default function StudioDashboardPage() {
  return (
    <MobileShell variant="studio">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
              Flow State Yoga
            </h1>
            <p className="text-sm text-muted-foreground">Studio Dashboard</p>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            <div className="w-2 h-2 bg-accent rounded-full mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {studioStats.bookingsChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {studioStats.todayBookings}
            </p>
            <p className="text-xs text-muted-foreground">{"Today's Bookings"}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {studioStats.revenueChange}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${studioStats.weeklyRevenue}
            </p>
            <p className="text-xs text-muted-foreground">Weekly Revenue</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {studioStats.totalClasses}
            </p>
            <p className="text-xs text-muted-foreground">Active Classes</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {studioStats.averageRating}
            </p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">{"Today's Schedule"}</h2>
            <Link href="/studio/classes">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {todaysClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-primary">
                      {cls.time}
                    </div>
                    {cls.status === "in-progress" && (
                      <Badge className="bg-accent text-accent-foreground text-[10px]">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant={
                      cls.booked / cls.capacity > 0.9 ? "destructive" : "secondary"
                    }
                  >
                    {cls.booked}/{cls.capacity}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground">{cls.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={cls.instructorImage || "/placeholder.svg"} alt={cls.instructor} />
                    <AvatarFallback>{cls.instructor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {cls.instructor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Bookings</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-3 p-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.user} />
                  <AvatarFallback>{booking.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {booking.user}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {booking.class}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-foreground">
                    +{booking.amount} cr
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/studio/classes">
            <Button variant="outline" className="w-full h-auto py-4 flex-col bg-transparent">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Manage Classes</span>
            </Button>
          </Link>
          <Button variant="outline" className="w-full h-auto py-4 flex-col bg-transparent">
            <TrendingUp className="w-6 h-6 mb-2" />
            <span>View Analytics</span>
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
