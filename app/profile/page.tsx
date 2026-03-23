"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
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
import { categories } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { getUserStats, type UserStats } from "@/lib/api/users";
import { getCreditPacks, createPaymentIntent, type CreditPack } from "@/lib/api/payments";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeCardForm } from "@/components/stripe-card-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const menuItems: {
  icon: typeof Heart;
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}[] = [
  { icon: Heart, label: "Favorites", href: "/profile/favorites" },
  { icon: Calendar, label: "Booking History", href: "/bookings" },
  { icon: CreditCard, label: "Payment Methods", href: "/profile/payment" },
  { icon: Bell, label: "Notifications", href: "/profile/notifications" },
  { icon: HelpCircle, label: "Help & Support", href: "https://www.statera.live", external: true },
];

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [payStep, setPayStep] = useState<'select' | 'pay' | 'success'>('select');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [userCategories, setUserCategories] = useState<string[]>([]);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    // Derive favorite categories from user preferences
    const modalities = user.preferences?.favoriteModalities ?? [];
    const mapped = modalities.map((m: string) => m.toLowerCase());
    setUserCategories(mapped);

    getUserStats(user.id).then(setStats).catch(() => null);
    getCreditPacks().then(setCreditPacks).catch(() => null);
  }, [user]);

  const toggleFavoriteCategory = (catId: string) => {
    setUserCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const resetPurchaseDialog = () => {
    setSelectedPackage(null);
    setPayStep('select');
    setClientSecret(null);
    setPaymentIntentId(null);
    setPurchaseError(null);
    setIsPurchasing(false);
  };

  const handleInitiatePayment = async () => {
    if (!selectedPackage) return;
    setIsPurchasing(true);
    setPurchaseError(null);
    try {
      const intent = await createPaymentIntent(selectedPackage);
      setClientSecret(intent.clientSecret);
      setPaymentIntentId(intent.paymentIntentId);
      setPayStep('pay');
    } catch {
      setPurchaseError('Could not start payment. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePaymentSuccess = (newBalance: number) => {
    updateUser({ creditBalance: newBalance });
    setPayStep('success');
    setTimeout(() => {
      setBuyCreditsOpen(false);
      resetPurchaseDialog();
    }, 2000);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || !user) {
    return (
      <MobileShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </MobileShell>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weeklyGoal = { current: stats?.completedBookings ?? 0, target: 5 };

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
                <AvatarImage src={user.avatar ?? "/placeholder.svg"} alt={fullName} />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
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
              <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
              <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    {stats?.totalBookings ?? 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">Classes</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-primary flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {user.creditBalance}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">Credits</p>
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
            <p className="text-2xl font-bold text-primary">{user.creditBalance}</p>
          </div>
          <Dialog open={buyCreditsOpen} onOpenChange={(open) => { if (!open) resetPurchaseDialog(); setBuyCreditsOpen(open); }}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Buy More Credits
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              {payStep === 'success' ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-7 w-7 text-primary" />
                  </div>
                  <DialogTitle>Credits Added!</DialogTitle>
                  <DialogDescription>Your new balance is {user.creditBalance} credits.</DialogDescription>
                </div>
              ) : payStep === 'pay' && clientSecret && paymentIntentId ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Enter Card Details</DialogTitle>
                    <DialogDescription>
                      {creditPacks.find(p => p.id === selectedPackage)?.credits} credits for ${((creditPacks.find(p => p.id === selectedPackage)?.priceCents ?? 0) / 100).toFixed(0)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCardForm
                        clientSecret={clientSecret}
                        packId={selectedPackage!}
                        paymentIntentId={paymentIntentId}
                        onSuccess={handlePaymentSuccess}
                        onError={(msg) => setPurchaseError(msg)}
                        onBack={() => setPayStep('select')}
                      />
                    </Elements>
                    {purchaseError && (
                      <p className="mt-2 text-sm text-destructive">{purchaseError}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Buy Credits</DialogTitle>
                    <DialogDescription>
                      Choose a credit package to add to your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-3">
                    {creditPacks.map((pkg) => {
                      const priceDisplay = (pkg.priceCents / 100).toFixed(0);
                      return (
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
                              <span className="text-lg font-bold text-foreground">
                                {pkg.credits} Credits
                              </span>
                              {pkg.id === 'popular_25' && (
                                <Badge className="text-[10px] ml-2">Popular</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-foreground">
                                ${priceDisplay}
                              </span>
                              {selectedPackage === pkg.id && (
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {purchaseError && (
                      <p className="text-sm text-destructive">{purchaseError}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      className="w-full"
                      disabled={!selectedPackage || isPurchasing}
                      onClick={handleInitiatePayment}
                    >
                      {isPurchasing && <Loader2 className="mr-2 size-4 animate-spin" />}
                      {isPurchasing ? "Loading…" : "Continue to Payment"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Weekly Goal */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weekly Classes</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {weeklyGoal.current}/{weeklyGoal.target}
            </span>
          </div>
          <Progress
            value={Math.min(100, (weeklyGoal.current / weeklyGoal.target) * 100)}
            className="h-3 mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {Math.max(0, weeklyGoal.target - weeklyGoal.current)} more{" "}
            {Math.max(0, weeklyGoal.target - weeklyGoal.current) === 1 ? "class" : "classes"} to
            reach your goal!
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Your Stats</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.completedBookings}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.studiosVisited}</p>
                <p className="text-xs text-muted-foreground">Studios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalCreditsSpent}</p>
                <p className="text-xs text-muted-foreground">Credits Used</p>
              </div>
            </div>
            {stats.favoriteModality && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Favorite modality:{" "}
                <span className="font-medium text-foreground capitalize">
                  {stats.favoriteModality.toLowerCase()}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Favorite Categories */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3">Favorite Categories</h3>
          <div className="flex flex-wrap gap-2">
            {userCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="secondary" className="text-sm">
                  {cat?.name ?? catId}
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
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Favorite Categories</DialogTitle>
              <DialogDescription>Select the categories you enjoy most</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-2 space-y-2">
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
            <Button className="w-full shrink-0" onClick={() => setCategoryModalOpen(false)}>
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
                <p className="text-xs text-muted-foreground">Get updates about your bookings</p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </MobileShell>
  );
}
