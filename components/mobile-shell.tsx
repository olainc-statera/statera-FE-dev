"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Calendar,
  User,
  LayoutDashboard,
} from "lucide-react";

interface MobileShellProps {
  children: React.ReactNode;
  variant?: "user" | "studio";
}

const userNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];

const studioNavItems = [
  { href: "/studio", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/studio/classes", icon: Calendar, label: "Classes" },
  { href: "/studio/profile", icon: User, label: "Profile" },
];

export function MobileShell({ children, variant = "user" }: MobileShellProps) {
  const pathname = usePathname();
  const navItems = variant === "studio" ? studioNavItems : userNavItems;

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Blurred background image */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
        <Image
          src="/bg-pattern.jpg"
          alt=""
          fill
          className="object-cover scale-125"
          style={{ filter: 'blur(60px)' }}
          priority
          quality={60}
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Main content */}
      <main className="relative flex-1 pb-20 overflow-y-auto">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all min-w-[56px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="text-[10px] font-medium mt-1">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
        {/* Safe area padding for notched devices */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
