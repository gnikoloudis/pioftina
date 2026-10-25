"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  Download,
  Mail,
  Settings,
  Shield,
  Lock,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  ChefHat,
  Beaker,
} from "lucide-react";

export type ActiveSection = "landing" | "planner" | "clean" | "baby" | "grocery";

interface MainHeaderProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  onOpenSaveModal: () => void;
  onOpenNewsletterModal: () => void;
  onOpenSettingsModal: () => void;
  isAdmin: boolean;
  onAdminLoginClick: () => void;
  onAdminLogout: () => void;
  onOpenRecipeStudio?: () => void;
  onOpenBundleStudio?: () => void;
  onOpenTestCenter?: () => void;
  householdSize?: number;
  activeGroceryCount?: number;
}

export function MainHeader({
  activeSection,
  onSelectSection,
  onOpenSaveModal,
  onOpenNewsletterModal,
  onOpenSettingsModal,
  isAdmin,
  onAdminLoginClick,
  onAdminLogout,
  onOpenRecipeStudio,
  onOpenBundleStudio,
  onOpenTestCenter,
  householdSize = 4,
  activeGroceryCount = 0,
}: MainHeaderProps) {
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const navItems: { id: ActiveSection; label: string; icon: string }[] = [
    { id: "landing", label: "Αρχική", icon: "🏠" },
    { id: "planner", label: "Γεύματα", icon: "🍽️" },
    { id: "clean", label: "Καθαριότητα", icon: "🧼" },
    { id: "baby", label: "Βρεφικά", icon: "👶" },
    { id: "grocery", label: "Λίστα Αγορών", icon: "🛒" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => onSelectSection("landing")}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="relative size-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-blue-700/20 ring-2 ring-blue-500/20">
            <span>π</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground font-heading">
                pioftina<span className="text-primary font-black">.gr</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-primary border border-blue-500/20">
                <span className="size-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                Live e-Καταναλωτής
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden lg:block -mt-0.5">
              Έξυπνες Αγορές Σούπερ Μάρκετ
            </p>
          </div>
        </div>

        {/* Center: Clean Section Pills */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border border-border/60 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === "grocery" && activeGroceryCount > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold leading-none transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {activeGroceryCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Settings & Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Save to PC */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSaveModal}
            className="h-8.5 px-2.5 sm:px-3 rounded-xl gap-1.5 text-xs font-semibold text-foreground border-border hover:bg-muted/50"
            title="Αποθήκευση στον υπολογιστή"
          >
            <Download className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Αποθήκευση</span>
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

          {/* Admin Menu / Status */}
          {isAdmin ? (
            <div className="relative">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                title="Μενού Διαχειριστή"
              >
                <Shield className="size-3.5 text-amber-600" />
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className="size-3 text-amber-600" />
              </button>

              {isAdminDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 text-xs space-y-1 divide-y divide-border/60"
                  onMouseLeave={() => setIsAdminDropdownOpen(false)}
                >
                  <div className="px-2 py-1.5 font-bold text-foreground">
                    Περιβάλλον Διαχειριστή
                  </div>

                  <div className="pt-1 space-y-0.5">
                    {onOpenBundleStudio && (
                      <button
                        onClick={() => {
                          setIsAdminDropdownOpen(false);
                          onOpenBundleStudio();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-muted font-medium text-foreground"
                      >
                        <Layers className="size-3.5 text-emerald-600" />
                        <span>Bundle Curation Studio</span>
                      </button>
                    )}

                    {onOpenRecipeStudio && (
                      <button
                        onClick={() => {
                          setIsAdminDropdownOpen(false);
                          onOpenRecipeStudio();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-muted font-medium text-foreground"
                      >
                        <ChefHat className="size-3.5 text-blue-600" />
                        <span>Recipe Curation Studio</span>
                      </button>
                    )}

                    {onOpenTestCenter && (
                      <button
                        onClick={() => {
                          setIsAdminDropdownOpen(false);
                          onOpenTestCenter();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-muted font-medium text-foreground"
                      >
                        <Beaker className="size-3.5 text-purple-600" />
                        <span>Κέντρο Ελέγχου &amp; Pentest</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsAdminDropdownOpen(false);
                        onAdminLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-rose-500/10 text-rose-600 font-semibold"
                    >
                      <LogOut className="size-3.5" />
                      <span>Αποσύνδεση Διαχειριστή</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdminLoginClick}
              className="size-8.5 p-0 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-muted/50"
              title="Σύνδεση Διαχειριστή (Admin)"
            >
              <Lock className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
