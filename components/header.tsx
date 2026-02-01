"use client";

import Link from "next/link";
import { Bell, MapPin, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Good morning</p>
            <h1 className="text-sm font-semibold text-foreground">
              {currentUser.name.split(" ")[0]}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button
              variant="secondary"
              size="sm"
              className="text-foreground"
            >
              <Coins className="w-4 h-4 mr-1 text-primary" />
              <span className="text-sm font-semibold">{currentUser.credits}</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-xs">NYC</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
