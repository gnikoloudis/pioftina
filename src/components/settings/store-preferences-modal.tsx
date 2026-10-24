"use client";

import React, { useState, useEffect } from "react";
import { UserPreferences } from "@/types/meal-planner";
import { MOCK_RETAILERS } from "@/lib/posokanei/mock-data";
import { Retailer } from "@/lib/posokanei/types";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { X, Check, Settings2, Users, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (newPrefs: UserPreferences) => void;
}

export function StorePreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: StorePreferencesModalProps) {
  const [preferredStores, setPreferredStores] = useState<string[]>(
    preferences.preferredSupermarkets
  );
  const [householdSize, setHouseholdSize] = useState<number>(
    preferences.householdSize
  );
  const [prioritizeBulk, setPrioritizeBulk] = useState<boolean>(
    preferences.prioritizeBulk
  );
  const [retailersList, setRetailersList] = useState<Retailer[]>(MOCK_RETAILERS);

  // Sync internal state whenever modal opens or preferences update
  useEffect(() => {
    if (isOpen) {
      setPreferredStores(preferences.preferredSupermarkets);
      setHouseholdSize(preferences.householdSize);
      setPrioritizeBulk(preferences.prioritizeBulk);
    }
  }, [isOpen, preferences]);

  // Load latest active retailers from Posokanei API with fallback to MOCK_RETAILERS
  useEffect(() => {
    fetch("/api/posokanei/retailers")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.retailers) && data.retailers.length > 0) {
          setRetailersList(data.retailers);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const toggleStore = (storeId: string) => {
    setPreferredStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSave = () => {
    onSave({
      ...preferences,
      preferredSupermarkets:
        preferredStores.length > 0 ? preferredStores : ["sklavenitis"],
      householdSize,
      prioritizeBulk,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-lg max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Settings2 className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Ρυθμίσεις & Προτιμήσεις Supermarket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Household Size */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>Μέλη Νοικοκυριού (Μερίδες ανά γεύμα)</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Οι ποσότητες των υλικών υπολογίζονται αυτόματα με βάση τα άτομα.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHouseholdSize(num)}
                  className={`size-10 rounded-xl font-bold text-sm border transition-all ${
                    householdSize === num
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/50 border-input text-foreground hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Supermarkets */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="size-4 text-primary" />
              <span>Προτιμώμενα Supermarkets στην Ελλάδα</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Επιλέξτε τα καταστήματα από τα οποία συνήθως ψωνίζετε για τη σύγκριση τιμών μέσω posokanei.gov.gr.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {retailersList.map((retailer) => {
                const isSelected = preferredStores.includes(retailer.id);
                return (
                  <button
                    key={retailer.id}
                    type="button"
                    onClick={() => toggleStore(retailer.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-1 ring-primary/40 shadow-xs"
                        : "bg-card border-border hover:border-border/80"
                    }`}
                  >
                    <SupermarketBadge
                      retailerId={retailer.id}
                      retailerName={retailer.name}
                      size="sm"
                    />
                    <div
                      className={`size-4 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Shopping Preference */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="prioritize-bulk"
                className="text-sm font-bold text-foreground flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-4 text-amber-500" />
                <span>Προτεραιότητα σε Bulk Συσκευασίες</span>
              </label>
              <input
                id="prioritize-bulk"
                type="checkbox"
                checked={prioritizeBulk}
                onChange={(e) => setPrioritizeBulk(e.target.checked)}
                className="size-4.5 accent-primary rounded cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Όταν είναι ενεργό, το σύστημα προτείνει μεγαλύτερες ή οικογενειακές συσκευασίες εφόσον προσφέρουν χαμηλότερη τιμή ανά κιλό/λίτρο (€/kg ή €/L) και αποθηκεύει το υπόλοιπο στο ντουλάπι σας.
            </p>
          </div>

          {/* Email Newsletter Section */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="text-base">📩</span>
                <span>Ενημερώσεις &amp; Προσφορές Supermarket</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Λάβετε εβδομαδιαία οικονομικά μενού, προσφορές από τα επιλεγμένα σούπερ μάρκετ σας και συμβουλές εξοικονόμησης.
            </p>
            <NewsletterFormCompact />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Ακύρωση
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs bg-primary text-primary-foreground font-medium"
          >
            Αποθήκευση
          </Button>
        </div>
      </div>
    </div>
  );
}

function NewsletterFormCompact() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pioftina_newsletter_subscribed");
      const storedEmail = localStorage.getItem("pioftina_newsletter_email");
      if (stored === "true" && storedEmail) {
        setIsSubscribed(true);
        setEmail(storedEmail);
      }
    } catch (_) {}
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setIsLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "settings" }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        setMsg("✓ Καταχωρήθηκε!");
        try {
          localStorage.setItem("pioftina_newsletter_subscribed", "true");
          localStorage.setItem("pioftina_newsletter_email", email.trim());
        } catch (_) {}
      } else {
        setMsg(data.error || "Σφάλμα");
      }
    } catch {
      setMsg("Σφάλμα δικτύου");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Το email σας..."
          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !email.trim()}
          className="text-xs h-8 px-3 rounded-xl font-semibold"
        >
          {isLoading ? "..." : isSubscribed ? "Ενημέρωση" : "Εγγραφή"}
        </Button>
      </div>
      {msg && (
        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          {msg}
        </p>
      )}
    </form>
  );
}
