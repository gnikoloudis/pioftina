"use client";

import React, { useState } from "react";
import { BundleCategory } from "@/types/bundles";
import { Smile, Sparkles } from "lucide-react";

interface EmojiItem {
  emoji: string;
  name: string;
}

const EMOJI_GROUPS: Record<string, { label: string; icon: string; items: EmojiItem[] }> = {
  cleaning: {
    label: "Καθαριότητα",
    icon: "🧼",
    items: [
      { emoji: "🧼", name: "Σαπούνι / Απορρυπαντικό" },
      { emoji: "🫧", name: "Φυσαλίδες / Πλύσιμο" },
      { emoji: "✨", name: "Αστραφτερό / Λάμψη" },
      { emoji: "🧽", name: "Σφουγγάρι" },
      { emoji: "🧹", name: "Σκούπα" },
      { emoji: "🧺", name: "Καλάθι Ρούχων" },
      { emoji: "🧴", name: "Μπουκάλι Καθαριστικού" },
      { emoji: "🪣", name: "Κουβάς" },
      { emoji: "🧻", name: "Χαρτικά" },
      { emoji: "🌸", name: "Φρεσκάδα & Άρωμα" },
      { emoji: "🌿", name: "Eco / Οικολογικό" },
      { emoji: "💎", name: "Deep Clean / Premium" },
    ],
  },
  baby: {
    label: "Βρεφικά",
    icon: "👶",
    items: [
      { emoji: "👶", name: "Μωρό" },
      { emoji: "🍼", name: "Μπιμπερό / Γάλα" },
      { emoji: "🧷", name: "Πάνες / Αλλαγή" },
      { emoji: "🧸", name: "Αρκουδάκι / Παιχνίδι" },
      { emoji: "🛁", name: "Βρεφικό Μπάνιο" },
      { emoji: "🐣", name: "Νεογέννητο" },
      { emoji: "👣", name: "Πατουσίτσες" },
      { emoji: "🤍", name: "Αγνότητα & Φροντίδα" },
      { emoji: "🧴", name: "Βρεφική Κρέμα / Λοσιόν" },
      { emoji: "🥣", name: "Βρεφική Τροφή / Κρέμα" },
      { emoji: "🌙", name: "Ύπνος / Νύχτα" },
      { emoji: "🛡️", name: "Προστασία & Απαλότητα" },
    ],
  },
  general: {
    label: "Γενικά & Bulk",
    icon: "📦",
    items: [
      { emoji: "📦", name: "Κουτί / Bulk Box" },
      { emoji: "🛍️", name: "Τσάντα Αγορών" },
      { emoji: "🛒", name: "Καλάθι Σούπερ Μάρκετ" },
      { emoji: "🏷️", name: "Προσφορά / Έκπτωση" },
      { emoji: "⭐", name: "Best Value" },
      { emoji: "💰", name: "Οικονομία" },
      { emoji: "🔥", name: "Super Deal" },
      { emoji: "🎯", name: "Έξυπνη Επιλογή" },
    ],
  },
};

interface BundleEmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  category: BundleCategory;
}

export function BundleEmojiPicker({
  value,
  onChange,
  category,
}: BundleEmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<string>(category || "cleaning");

  const currentGroup = EMOJI_GROUPS[activeTab] || EMOJI_GROUPS[category] || EMOJI_GROUPS.cleaning;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
          <Smile className="size-3.5 text-primary" />
          <span>Emoji Εικονίδιο Πακέτου</span>
        </label>
        <span className="text-[11px] text-muted-foreground">
          Κάντε κλικ για επιλογή
        </span>
      </div>

      <div className="p-3 rounded-2xl border border-border bg-background/50 space-y-3">
        {/* Selected Emoji Preview & Manual Input */}
        <div className="flex items-center gap-3">
          <div
            className="size-11 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-2xl shadow-xs shrink-0 select-none"
            title={`Ενεργό εικονίδιο: ${value || "Κανένα"}`}
          >
            {value || (category === "cleaning" ? "🧼" : "👶")}
          </div>

          <div className="flex-1 space-y-0.5">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="π.χ. 🧼 ή πληκτρολογήστε..."
              maxLength={4}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
            <p className="text-[10px] text-muted-foreground">
              Επιλέξτε από την παρακάτω λίστα ή επικολλήστε δικό σας
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 border-b border-border/60 pb-1.5 overflow-x-auto scrollbar-none">
          {Object.entries(EMOJI_GROUPS).map(([key, group]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span>{group.icon}</span>
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Emoji Grid Selector */}
        <div className="grid grid-cols-6 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1">
          {currentGroup.items.map((item) => {
            const isSelected = value === item.emoji;
            return (
              <button
                key={item.emoji}
                type="button"
                onClick={() => onChange(item.emoji)}
                className={`size-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                  isSelected
                    ? "bg-primary/15 border-2 border-primary scale-105 shadow-xs"
                    : "bg-card hover:bg-muted/80 border border-border hover:border-primary/40 hover:scale-105"
                }`}
                title={item.name}
              >
                {item.emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
