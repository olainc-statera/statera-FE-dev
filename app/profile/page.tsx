"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileShell } from "@/components/mobile-shell";
import {
  ChevronRight,
  Heart,
  Calendar,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit2,
  Coins,
  Target,
  TrendingUp,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { currentUser, categories } from "@/lib/data";

const menuItems: {
  icon: typeof Heart;
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}[] = [
  {
    icon: Heart,
    label: "Favorites",
    href: "/profile/favorites",
  },
  {
    icon: Calendar,
    label: "Booking History",
    href: "/bookings",
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    href: "/profile/payment",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/profile/notifications",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "https://www.statera.live",
    external: true,
  },
];

const creditPackages = [
  { id: "1", credits: 10, price: 99, popular: false },
  { id: "2", credits: 25, price: 225, popular: true, savings: "10% off" },
  { id: "3", credits: 50, price: 400, popular: false, savings: "20% off" },
  { id: "4", credits: 100, price: 700, popular: false, savings: "30% off" },
];

const weeklyGoal = {
  current: 4,
  target: 5,
  label: "Weekly Classes",
};

const monthlyStats = {
  classesThisMonth: 12,
  totalMinutes: 540,
  averageRating: 4.8,
};

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [userCategories, setUserCategories] = useState<string[]>(currentUser.favoriteCategories);

  const toggleFavoriteCategory = (catId: string) => {
    setUserCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setIsPurchasing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPurchasing(false);
    setBuyCreditsOpen(false);
    setSelectedPackage(null);
  };

  return (
    <MobileShell>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
            Profile
          </h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-primary/20">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {currentUser.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Member since {currentUser.memberSince}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    {currentUser.classesAttended}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Classes
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-primary flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {currentUser.credits}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Credits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Your Credits</p>
                <p className="text-sm text-muted-foreground">Use credits to book classes</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">{currentUser.credits}</p>
          </div>
          <Dialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Buy More Credits
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Buy Credits</DialogTitle>
                <DialogDescription>
                  Choose a credit package to add to your account
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3">
                {creditPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPackage === pkg.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            {pkg.credits} Credits
                          </span>
                          {pkg.popular && (
                            <Badge className="text-[10px]">Popular</Badge>
                          )}
                        </div>
                        {pkg.savings && (
                          <span className="text-xs text-primary">{pkg.savings}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                          ${pkg.price}
                        </span>
                        {selectedPackage === pkg.id && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={!selectedPackage || isPurchasing}
                  onClick={handlePurchase}
                >
                  {isPurchasing ? "Processing..." : "Purchase Credits"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Weekly Goal */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">{weeklyGoal.label}</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {weeklyGoal.current}/{weeklyGoal.target}
            </span>
          </div>
          <Progress
            value={(weeklyGoal.current / weeklyGoal.target) * 100}
            className="h-3 mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {weeklyGoal.target - weeklyGoal.current} more{" "}
            {weeklyGoal.target - weeklyGoal.current === 1 ? "class" : "classes"} to
            reach your goal!
          </p>
        </div>

        {/* Monthly Stats */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">This Month</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {monthlyStats.classesThisMonth}
              </p>
              <p className="text-xs text-muted-foreground">Classes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(monthlyStats.totalMinutes / 60)}h
              </p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {monthlyStats.averageRating}
              </p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Favorite Categories */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3">
            Favorite Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {userCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="secondary" className="text-sm">
                  {cat?.name}
                </Badge>
              );
            })}
            <Badge
              variant="outline"
              className="text-sm cursor-pointer bg-transparent"
              onClick={() => setCategoryModalOpen(true)}
            >
              + Add
            </Badge>
          </div>
        </div>

        {/* Category Selection Modal */}
        <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Favorite Categories</DialogTitle>
              <DialogDescription>
                Select the categories you enjoy most
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              {categories.map((cat) => {
                const isSelected = userCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleFavoriteCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <Button className="w-full" onClick={() => setCategoryModalOpen(false)}>
              Done
            </Button>
          </DialogContent>
        </Dialog>

        {/* Menu Items */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          {menuItems.map((item, index) => {
            const linkProps = item.external
              ? { href: item.href, target: "_blank" as const, rel: "noopener noreferrer" as const }
              : { href: item.href };

            return (
              <Link
                key={item.label}
                {...linkProps}
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
            );
          })}
        </div>

        {/* Notifications Toggle */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get updates about your bookings
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </MobileShell>
  );
}
