"use client";

import React from "react";
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content */}
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
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
