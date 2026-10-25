"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Sparkles,
  TrendingDown,
  Store,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface LandingHeroProps {
  onNavigateSection: (section: "planner" | "clean" | "baby") => void;
  onOpenNewsletter: () => void;
}

export function LandingHero({ onNavigateSection, onOpenNewsletter }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-18">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-emerald-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
        {/* Posokanei Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-primary text-xs font-semibold backdrop-blur-sm shadow-xs">
          <span className="size-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
          <span>Ζωντανή Σύγκριση Τιμών με e-Καταναλωτής (posokanei.gov.gr)</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.15] font-heading">
          Έξυπνες Αγορές Σούπερ Μάρκετ.
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Πιο Φθηνό Καλάθι Κάθε Μήνα.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Το <span className="font-bold text-foreground">pioftina.gr</span> σας βοηθά να
          προγραμματίζετε τα εβδομαδιαία σας γεύματα, να εξοικονομείτε στα καθαριστικά του σπιτιού και
          στα βρεφικά είδη, βρίσκοντας αυτόματα τις φθηνότερες τιμές σε Σκλαβενίτη, ΑΒ Βασιλόπουλο,
          Lidl, My Market και Μασούτη.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            id="hero-btn-planner"
            onClick={() => onNavigateSection("planner")}
            className="h-12 px-6 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 gap-2 group"
          >
            <span>🍽️ Πρόγραμμα Γευμάτων</span>
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            id="hero-btn-clean"
            onClick={() => onNavigateSection("clean")}
            className="h-12 px-5 rounded-2xl text-sm font-semibold border-border hover:bg-muted/50 gap-2"
          >
            <span>🧼 Clean Planner</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            id="hero-btn-baby"
            onClick={() => onNavigateSection("baby")}
            className="h-12 px-5 rounded-2xl text-sm font-semibold border-border hover:bg-muted/50 gap-2"
          >
            <span>👶 Βρεφικά Πακέτα</span>
          </Button>
        </div>

        {/* Live Metrics / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-card/80 border border-border backdrop-blur-sm">
            <div className="text-2xl font-black text-primary">80+</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">
              Επιμελημένες Συνταγές
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border backdrop-blur-sm">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Έως 35%</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">
              Εξοικονόμηση σε Bulk
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border backdrop-blur-sm">
            <div className="text-2xl font-black text-foreground">5+ Αλυσίδες</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">
              Σύγκριση σε Πραγματικό Χρόνο
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border backdrop-blur-sm">
            <div className="text-2xl font-black text-blue-600 dark:text-sky-400">100% Δωρεάν</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">
              Χωρίς Συνδρομή ή Διαφημίσεις
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
