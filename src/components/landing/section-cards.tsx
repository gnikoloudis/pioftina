"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Package,
  Layers,
  CheckCircle2,
  ChefHat,
  Baby,
} from "lucide-react";

interface SectionCardsProps {
  onNavigateSection: (section: "planner" | "clean" | "baby") => void;
}

export function SectionCards({ onNavigateSection }: SectionCardsProps) {
  const sections = [
    {
      id: "planner" as const,
      icon: "🍽️",
      tag: "Εβδομαδιαίο Πρόγραμμα",
      title: "Meal Planner & Συνταγές",
      gradient: "from-blue-600/10 via-sky-500/5 to-transparent",
      borderAccent: "hover:border-blue-500/50",
      description:
        "Οργανώστε τα γεύματα 7 ημερών για 1 έως 8 άτομα. Αυτόματη δημιουργία λίστας υλικών, αξιοποίηση περισσευμάτων (pantry surplus) και εύρεση του φθηνότερου σούπερ μάρκετ.",
      highlights: [
        "80+ επιμελημένες συνταγές (πρωινό, μεσημέρι, βράδυ, σνακ)",
        "Βελτιστοποίηση μεγάλων συσκευασιών (bulk savings)",
        "Άμεση εξαγωγή λίστας για τα ψώνια (Save to PC)",
      ],
      ctaText: "Είσοδος στο Meal Planner",
      ctaColor: "bg-blue-600 hover:bg-blue-700 text-white",
      badge: "80+ Συνταγές",
    },
    {
      id: "clean" as const,
      icon: "🧼",
      tag: "Καθαριότητα Σπιτιού",
      title: "Clean Planner Bundles",
      gradient: "from-teal-600/10 via-emerald-500/5 to-transparent",
      borderAccent: "hover:border-teal-500/50",
      description:
        "Έτοιμα, δοκιμασμένα μηνιαία και τριμηνιαία πακέτα καθαριστικών (Ariel, Fairy, Klinex, Endless). Σύγκριση τιμών ανά μεζούρα και ανά λίτρο σε όλες τις αλυσίδες.",
      highlights: [
        "Μηνιαία πακέτα για πλύσιμο ρούχων & πιάτων",
        "Τριμηνιαία Eco/Bulk πακέτα με μέγιστη έκπτωση",
        "Ενσωμάτωση στη Λίστα Αγορών με 1 κλικ",
      ],
      ctaText: "Εξερεύνηση Clean Planner",
      ctaColor: "bg-teal-600 hover:bg-teal-700 text-white",
      badge: "Έως -35% Bulk",
    },
    {
      id: "baby" as const,
      icon: "👶",
      tag: "Βρεφική Φροντίδα",
      title: "Baby Care Bundles",
      gradient: "from-pink-600/10 via-rose-500/5 to-transparent",
      borderAccent: "hover:border-pink-500/50",
      description:
        "Όλα τα απαραίτητα για το μωρό (Πάνες Pampers & Babylino, Βρεφικό Γάλα Nan, Μωρομάντηλα, Sudocrem, Mustela) στις πιο ανταγωνιστικές τιμές της ελληνικής αγοράς.",
      highlights: [
        "Μηνιαία κουτιά πάνας με ανάλυση κόστους ανά πάνα",
        "Βρεφικά γάλατα 1ης & 2ης βρεφικής ηλικίας",
        "Πλήρη πακέτα υγιεινής & αλλαγής πάνας",
      ],
      ctaText: "Εξερεύνηση Baby Care",
      ctaColor: "bg-rose-600 hover:bg-rose-700 text-white",
      badge: "Κέρδος €40/μήνα",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-1.5 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          3 Ενότητες, 1 Ενιαία Οικονομία
        </h2>
        <p className="text-sm text-muted-foreground">
          Επιλέξτε την ενότητα που σας ενδιαφέρει ή συνδυάστε τις για να έχετε μία συνολική λίστα
          αγορών
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className={`rounded-3xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${sec.borderAccent} relative overflow-hidden`}
          >
            {/* Ambient Corner Gradient */}
            <div
              className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${sec.gradient} rounded-full blur-2xl -z-0 pointer-events-none`}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl" role="img" aria-label={sec.title}>
                  {sec.icon}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-foreground border border-border">
                  {sec.badge}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  {sec.tag}
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight mt-1">
                  {sec.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                {sec.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-border/60">
              <Button
                onClick={() => onNavigateSection(sec.id)}
                className={`w-full h-11 rounded-xl text-xs font-bold gap-2 ${sec.ctaColor} shadow-xs group`}
              >
                <span>{sec.ctaText}</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
