"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  Check,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  isDefault: boolean;
}

const initialCards: SavedCard[] = [
  {
    id: "1",
    brand: "visa",
    last4: "4242",
    expMonth: "09",
    expYear: "27",
    holderName: "Sofia Martinez",
    isDefault: true,
  },
  {
    id: "2",
    brand: "mastercard",
    last4: "8888",
    expMonth: "03",
    expYear: "28",
    holderName: "Sofia Martinez",
    isDefault: false,
  },
];

function getBrandLabel(brand: string) {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "Amex";
    default:
      return brand;
  }
}

function getBrandColor(brand: string) {
  switch (brand) {
    case "visa":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "mastercard":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "amex":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function PaymentPage() {
  const router = useRouter();
  const [cards, setCards] = useState<SavedCard[]>(initialCards);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setCardNumber("");
    setCardHolder("");
    setExpiry("");
    setCvv("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 15) newErrors.cardNumber = "Enter a valid card number";
    if (cardHolder.trim().length < 2) newErrors.cardHolder = "Enter cardholder name";
    const expiryDigits = expiry.replace(/\D/g, "");
    if (expiryDigits.length < 4) {
      newErrors.expiry = "Enter a valid expiry";
    } else {
      const month = Number.parseInt(expiryDigits.slice(0, 2));
      if (month < 1 || month > 12) newErrors.expiry = "Invalid month";
    }
    if (cvv.length < 3) newErrors.cvv = "Enter a valid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const digits = cardNumber.replace(/\s/g, "");
    const last4 = digits.slice(-4);
    let brand: SavedCard["brand"] = "visa";
    if (digits.startsWith("5")) brand = "mastercard";
    if (digits.startsWith("3")) brand = "amex";
    const expiryDigits = expiry.replace(/\D/g, "");

    const newCard: SavedCard = {
      id: Date.now().toString(),
      brand,
      last4,
      expMonth: expiryDigits.slice(0, 2),
      expYear: expiryDigits.slice(2),
      holderName: cardHolder,
      isDefault: cards.length === 0,
    };
    setCards((prev) => [...prev, newCard]);
    setIsSaving(false);
    setAddDialogOpen(false);
    resetForm();
  };

  const handleSetDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card?.isDefault && cards.length > 1) {
      const remaining = cards.filter((c) => c.id !== id);
      remaining[0].isDefault = true;
      setCards(remaining);
    } else {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Payment Methods
          </h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Saved Cards */}
        {cards.length > 0 ? (
          <div className="space-y-3 mb-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  "relative bg-card border rounded-xl p-4 transition-all",
                  card.isDefault
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {getBrandLabel(card.brand)}
                        </span>
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                          getBrandColor(card.brand)
                        )}>
                          {getBrandLabel(card.brand)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono mt-0.5">
                        {"**** **** **** "}{card.last4}
                      </p>
                    </div>
                  </div>
                  {card.isDefault && (
                    <Badge variant="secondary" className="text-[10px]">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{card.holderName}</span>
                  <span>Exp {card.expMonth}/{card.expYear}</span>
                </div>

                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-transparent"
                      onClick={() => handleSetDefault(card.id)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Set as default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-destructive hover:text-destructive bg-transparent"
                    onClick={() => setDeleteConfirmId(card.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 mb-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No cards saved</p>
            <p className="text-sm text-muted-foreground text-center">
              Add a payment method to book classes
            </p>
          </div>
        )}

        {/* Add Card Button */}
        <Button
          className="w-full"
          onClick={() => {
            resetForm();
            setAddDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Your payment details are encrypted and secure</span>
        </div>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Add a card</DialogTitle>
            <DialogDescription>
              Enter your card details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Card Number */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Card number
              </label>
              <div className="relative">
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  inputMode="numeric"
                  className={cn(
                    "font-mono pr-10",
                    errors.cardNumber && "border-destructive"
                  )}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.cardNumber && (
                <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Cardholder name
              </label>
              <Input
                placeholder="Sofia Martinez"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className={cn(errors.cardHolder && "border-destructive")}
              />
              {errors.cardHolder && (
                <p className="text-xs text-destructive mt-1">{errors.cardHolder}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Expiry
                </label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  inputMode="numeric"
                  className={cn(
                    "font-mono",
                    errors.expiry && "border-destructive"
                  )}
                />
                {errors.expiry && (
                  <p className="text-xs text-destructive mt-1">{errors.expiry}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  CVV
                </label>
                <Input
                  placeholder="123"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  inputMode="numeric"
                  type="password"
                  className={cn(
                    "font-mono",
                    errors.cvv && "border-destructive"
                  )}
                />
                {errors.cvv && (
                  <p className="text-xs text-destructive mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full"
              onClick={handleAddCard}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Card"}
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Remove card</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this card? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
