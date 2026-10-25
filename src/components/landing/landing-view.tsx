"use client";

import React from "react";
import { LandingHero } from "@/components/landing/landing-hero";
import { SectionCards } from "@/components/landing/section-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Store,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingViewProps {
  onNavigateSection: (section: "planner" | "clean" | "baby") => void;
  onOpenNewsletter: () => void;
}

export function LandingView({ onNavigateSection, onOpenNewsletter }: LandingViewProps) {
  // Sample basket preview data to wow visitors with live comparison
  const sampleBasketStores = [
    { id: "sklavenitis", name: "Σκλαβενίτης", total: 42.8, isLowest: true, diff: 0 },
    { id: "ab_vasilopoulos", name: "ΑΒ Βασιλόπουλος", total: 46.2, isLowest: false, diff: 3.4 },
    { id: "lidl", name: "Lidl", total: 44.5, isLowest: false, diff: 1.7 },
    { id: "mymarket", name: "My Market", total: 47.9, isLowest: false, diff: 5.1 },
    { id: "masoutis", name: "Μασούτης", total: 49.3, isLowest: false, diff: 6.5 },
  ];

  return (
    <div className="space-y-14 pb-12">
      {/* 1. Hero Section */}
      <LandingHero
        onNavigateSection={onNavigateSection}
        onOpenNewsletter={onOpenNewsletter}
      />

      {/* 2. Three Interactive Section Cards */}
      <SectionCards onNavigateSection={onNavigateSection} />

      {/* 3. Live Price Comparison Teaser */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingDown className="size-4" /> Ζωντανό Παράδειγμα Καλαθιού
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Πόσα Κερδίζετε Επιλέγοντας το Σωστό Σούπερ Μάρκετ;
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Δείγμα εβδομαδιαίου καλαθιού (Ελαιόλαδο, Φέτα, Κοτόπουλο, Ζυμαρικά, Απορρυπαντικό)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onNavigateSection("planner")}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <span>Φτιάξτε το Δικό σας Καλάθι</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Store Comparison Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sampleBasketStores.map((store) => (
            <div
              key={store.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                store.isLowest
                  ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30"
                  : "bg-muted/20 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <SupermarketBadge retailerId={store.id} size="sm" />
              </div>

              <div className="mt-2">
                <div
                  className={`text-xl font-black ${
                    store.isLowest ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                  }`}
                >
                  €{store.total.toFixed(2)}
                </div>
                <div className="text-[11px] font-medium mt-1">
                  {store.isLowest ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Χαμηλότερο Καλάθι
                    </span>
                  ) : (
                    <span className="text-muted-foreground">+€{store.diff.toFixed(2)} ακριβότερο</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Newsletter Signup Box */}
      <section className="max-w-3xl mx-auto">
        <NewsletterCard />
      </section>

      {/* 6. Footer Disclaimer & Links */}
      <footer className="pt-8 border-t border-border/80 text-center space-y-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-foreground">
          <button
            onClick={() => onNavigateSection("planner")}
            className="hover:text-primary transition-colors"
          >
            🍽️ Meal Planner
          </button>
          <button
            onClick={() => onNavigateSection("clean")}
            className="hover:text-primary transition-colors"
          >
            🧼 Clean Planner
          </button>
          <button
            onClick={() => onNavigateSection("baby")}
            className="hover:text-primary transition-colors"
          >
            👶 Baby Care
          </button>
          <button onClick={onOpenNewsletter} className="hover:text-primary transition-colors">
            ✉️ Ενημερώσεις
          </button>
        </div>

        <p>
          © 2026 pioftina.gr • Έξυπνες Αγορές Σούπερ Μάρκετ στην Ελλάδα.
          <br />
          Τα δεδομένα τιμών αντλούνται αυτόματα από το επίσημο παρατηρητήριο e-Καταναλωτής
          (posokanei.gov.gr).
        </p>
      </footer>
    </div>
  );
}
