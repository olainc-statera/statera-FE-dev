"use client";

import { useState } from "react";
import Image from "next/image";
import { MobileShell } from "@/components/mobile-shell";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const studioClasses = [
  {
    id: "1",
    name: "Sunrise Vinyasa Flow",
    description: "Start your day with intention. This energizing flow connects breath to movement.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    instructor: "Maya Chen",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    category: "Yoga",
    duration: 60,
    price: 28,
    capacity: 20,
    schedule: [
      { day: "Mon", time: "7:00 AM" },
      { day: "Wed", time: "7:00 AM" },
      { day: "Fri", time: "7:00 AM" },
    ],
    status: "active",
    totalBookings: 156,
  },
  {
    id: "2",
    name: "Power Pilates",
    description: "Build core strength and flexibility with our signature Pilates program.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    instructor: "Elena Woods",
    instructorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    category: "Pilates",
    duration: 55,
    price: 32,
    capacity: 15,
    schedule: [
      { day: "Tue", time: "9:30 AM" },
      { day: "Thu", time: "9:30 AM" },
      { day: "Sat", time: "10:00 AM" },
    ],
    status: "active",
    totalBookings: 89,
  },
  {
    id: "3",
    name: "HIIT Express",
    description: "Maximum results in minimum time. High-intensity interval training for busy schedules.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    instructor: "Jake Torres",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    category: "HIIT",
    duration: 40,
    price: 25,
    capacity: 24,
    schedule: [
      { day: "Mon", time: "12:00 PM" },
      { day: "Wed", time: "12:00 PM" },
      { day: "Fri", time: "12:00 PM" },
    ],
    status: "active",
    totalBookings: 234,
  },
  {
    id: "4",
    name: "Restorative Yoga",
    description: "Slow down and restore. This gentle practice uses props for deep relaxation.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    instructor: "Maya Chen",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    category: "Yoga",
    duration: 75,
    price: 30,
    capacity: 15,
    schedule: [
      { day: "Sun", time: "5:30 PM" },
    ],
    status: "draft",
    totalBookings: 45,
  },
];

export default function StudioClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredClasses = studioClasses.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileShell variant="studio">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
              Classes
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your class offerings
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Add a new class to your schedule
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Class Name</Label>
                  <Input placeholder="e.g., Morning Flow Yoga" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your class..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="pilates">Pilates</SelectItem>
                        <SelectItem value="hiit">HIIT</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (min)</Label>
                    <Input type="number" placeholder="60" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
                  <Label>Price (credits)</Label>
                  <Input type="number" placeholder="28" />
                </div>
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input type="number" placeholder="20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maya">Maya Chen</SelectItem>
                      <SelectItem value="elena">Elena Woods</SelectItem>
                      <SelectItem value="jake">Jake Torres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setCreateDialogOpen(false)}>
                  Create Class
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-9 bg-muted border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredClasses.length} classes
        </p>

        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="relative aspect-[3/1]">
              <Image
                src={cls.image || "/placeholder.svg"}
                alt={cls.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <Badge
                className={`absolute top-3 left-3 ${
                  cls.status === "active"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cls.status === "active" ? "Active" : "Draft"}
              </Badge>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{cls.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {cls.category}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Class
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {cls.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={cls.instructorImage || "/placeholder.svg"} alt={cls.instructor} />
                  <AvatarFallback>{cls.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {cls.instructor}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {cls.duration}min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {cls.capacity} spots
                </span>
                <span className="font-semibold text-foreground ml-auto">
                  {cls.price} credits
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {cls.schedule.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {s.day} {s.time}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {cls.totalBookings} total bookings
                </span>
                <Button variant="ghost" size="sm" className="text-primary">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
