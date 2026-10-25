"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Settings } from "lucide-react";

export type ActiveSection = "landing" | "planner" | "clean" | "baby" | "grocery" | "pantry";

interface MainHeaderProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  onOpenSaveModal: () => void;
  onOpenNewsletterModal: () => void;
  onOpenSettingsModal: () => void;
  householdSize?: number;
  activeGroceryCount?: number;
  activePantryCount?: number;
}

export function MainHeader({
  activeSection,
  onSelectSection,
  onOpenSaveModal,
  onOpenNewsletterModal,
  onOpenSettingsModal,
  householdSize = 4,
}: MainHeaderProps) {
  const navItems: { id: ActiveSection; label: string; icon: string }[] = [
    { id: "landing", label: "Αρχική", icon: "🏠" },
    { id: "planner", label: "Γεύματα", icon: "🍽️" },
    { id: "clean", label: "Καθαριότητα", icon: "🧼" },
    { id: "baby", label: "Βρεφικά", icon: "👶" },
    { id: "grocery", label: "Λίστα Αγορών", icon: "🛒" },
    { id: "pantry", label: "Αποθήκη", icon: "📦" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div
          onClick={() => onSelectSection("landing")}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="relative size-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-blue-700/20 ring-2 ring-blue-500/20">
            <span>π</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground font-heading">
                pioftina<span className="text-primary font-black">.gr</span>
              </span>
              <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-primary border border-blue-500/20">
                <span className="size-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                Live e-Καταναλωτής
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden 2xl:block -mt-0.5">
              Έξυπνες Αγορές Σούπερ Μάρκετ
            </p>
          </div>
        </div>

        {/* Center: Primary User Navigation (All 6 items guaranteed visible, no count badges) */}
        <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/60 shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${isActive
                  ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                title={item.label}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Essential User Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Save to PC */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSaveModal}
            className="h-8.5 px-2 sm:px-2.5 md:px-3 rounded-xl gap-1.5 text-xs font-semibold text-foreground border-border hover:bg-muted/50"
            title="Αποθήκευση στον υπολογιστή"
          >
            <Download className="size-3.5 text-primary" />
            <span className="hidden md:inline">Αποθήκευση</span>
          </Button>

          {/* Newsletter Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenNewsletterModal}
            className="size-8.5 p-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title="Εγγραφή για νέα και προσφορές"
          >
            <Mail className="size-4 text-primary" />
          </Button>

          {/* Settings Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettingsModal}
            className="size-8.5 p-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title={`Ρυθμίσεις (${householdSize} άτομα & σούπερ μάρκετ)`}
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
