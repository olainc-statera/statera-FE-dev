"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileShell } from "@/components/mobile-shell";
import {
  Settings,
  ChevronRight,
  Camera,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const studioInfo = {
  name: "Flow State Yoga",
  description: "A sanctuary for mindful movement. Our expert instructors guide you through transformative yoga experiences in a serene, plant-filled studio space.",
  image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  location: "123 Main Street, SoHo, NYC 10012",
  phone: "(555) 123-4567",
  email: "hello@flowstateyoga.com",
  website: "flowstateyoga.com",
  categories: ["Yoga", "Pilates"],
  priceRange: "$$",
  rating: 4.9,
  reviewCount: 328,
  totalMembers: 847,
  monthlyBookings: 1240,
};

const menuItems = [
  {
    icon: Clock,
    label: "Business Hours",
    href: "/studio/settings/hours",
  },
  {
    icon: MapPin,
    label: "Location & Contact",
    href: "/studio/settings/location",
  },
  {
    icon: DollarSign,
    label: "Pricing & Packages",
    href: "/studio/settings/pricing",
  },
  {
    icon: Users,
    label: "Team & Instructors",
    href: "/studio/settings/team",
    badge: "4 instructors",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/studio/settings/notifications",
  },
  {
    icon: CreditCard,
    label: "Payouts & Billing",
    href: "/studio/settings/billing",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "/studio/settings/support",
  },
];

export default function StudioProfilePage() {
  const [bookingsEnabled, setBookingsEnabled] = useState(true);

  return (
    <MobileShell variant="studio">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
            Studio Profile
          </h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Studio Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <div className="relative h-32">
            <Image
              src={studioInfo.image || "/placeholder.svg"}
              alt={studioInfo.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-3 right-3"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {studioInfo.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {studioInfo.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    {studioInfo.priceRange}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {studioInfo.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {studioInfo.rating}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {studioInfo.reviewCount} reviews
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {studioInfo.totalMembers}
            </p>
            <p className="text-xs text-muted-foreground">Active Members</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Accept Bookings</p>
              <p className="text-xs text-muted-foreground">
                Allow new bookings from members
              </p>
            </div>
            <Switch
              checked={bookingsEnabled}
              onCheckedChange={setBookingsEnabled}
            />
          </div>
        </div>

        {/* Public Profile Link */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">View Public Profile</p>
              <p className="text-sm text-muted-foreground">
                See how members view your studio
              </p>
            </div>
            <Link href="/studio/1">
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3">Contact Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground">{studioInfo.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Phone:</span>
              <span className="text-foreground">{studioInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground">{studioInfo.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Website:</span>
              <span className="text-primary">{studioInfo.website}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-foreground">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Switch to User View */}
        <Link href="/">
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Switch to Member View</p>
                <p className="text-sm text-muted-foreground">
                  Browse and book classes as a member
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Link>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </MobileShell>
  );
}
