"use client";

import React from "react";
import { Sparkles, Calculator, CheckCircle2, Download, ArrowRight, Store } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Επιλέξτε Γεύματα ή Έτοιμα Πακέτα",
      desc: "Διαλέξτε ανάμεσα σε 80+ δοκιμασμένες συνταγές για πρωινό, μεσημέρι και βράδυ ή επιλέξτε προεπιλεγμένα μηνιαία πακέτα καθαριότητας και βρεφικής φροντίδας.",
      icon: "📋",
    },
    {
      step: "02",
      title: "Αυτόματος Υπολογισμός & Σύγκριση",
      desc: "Ο αλγόριθμος του pioftina.gr αντλεί τιμές από το επίσημο e-Καταναλωτής (posokanei.gov.gr) και βρίσκει ποια αλυσίδα προσφέρει το χαμηλότερο συνολικό κόστος.",
      icon: "⚡",
    },
    {
      step: "03",
      title: "Εξαγωγή Λίστας & Μηδενική Σπατάλη",
      desc: "Αποθηκεύστε το πλάνο και τη λίστα αγορών στον υπολογιστή σας ή στο κινητό. Αγοράζετε τις ακριβείς ποσότητες που χρειάζεστε, εκμεταλλευόμενοι τα bulk packs.",
      icon: "🎯",
    },
  ];

  return (
    <section className="py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkles className="size-3.5" /> Πώς Λειτουργεί
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          3 Απλά Βήματα για να Πληρώνετε Λιγότερα
        </h2>
        <p className="text-sm text-muted-foreground">
          Χωρίς εγγραφή, χωρίς κρυφές χρεώσεις. Απευθείας στον browser σας.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <div
            key={s.step}
            className="p-6 rounded-3xl bg-card border border-border relative space-y-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl" role="img" aria-label={s.title}>
                {s.icon}
              </span>
              <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                {s.step}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
