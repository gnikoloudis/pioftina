"use client";

import React, { useState, useEffect } from "react";
import { ProductBundle } from "@/types/bundles";
import { BundleCard } from "@/components/bundles/bundle-card";
import {
  Sparkles,
  Shield,
  Search,
  Filter,
  PlusCircle,
  TrendingDown,
  Store,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CleanPlannerViewProps {
  onAddBundleToGroceryList: (bundle: ProductBundle) => void;
  isAdmin?: boolean;
  onOpenBundleStudio?: (bundleToEdit?: ProductBundle) => void;
}

export function CleanPlannerView({
  onAddBundleToGroceryList,
  isAdmin,
  onOpenBundleStudio,
}: CleanPlannerViewProps) {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCadence, setSelectedCadence] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadBundles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bundles?category=cleaning${isAdmin ? "&all=true" : ""}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.bundles)) {
        setBundles(data.bundles);
      }
    } catch (e) {
      console.error("Failed to load cleaning bundles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBundles();
  }, [isAdmin]);

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm("Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το πακέτο;")) return;
    try {
      const res = await fetch(`/api/bundles?id=${bundleId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBundles(data.bundles.filter((b: ProductBundle) => b.category === "cleaning"));
      }
    } catch (e) {
      console.error("Failed to delete bundle:", e);
    }
  };

  const filteredBundles = bundles.filter((b) => {
    if (selectedCadence !== "all" && b.cadence !== selectedCadence) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchItem = b.items.some(
        (i) => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchDesc && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-800 to-cyan-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-200">
            <span>🧼</span> Clean Planner Greece
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Οικονομικά Πακέτα Καθαριότητας Σπιτιού
          </h2>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Έξυπνα σχεδιασμένα bundles απορρυπαντικών και καθαριστικών σε μεγάλες συσκευασίες (Ariel,
            Fairy, Klinex, Endless). Βρείτε ποιο σούπερ μάρκετ έχει το φθηνότερο καλάθι και
            προσθέστε το με ένα κλικ στη λίστα αγορών σας.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-teal-200">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="size-4 text-emerald-300" />
              Έως και 35% φθηνότερα από μεμονωμένες αγορές
            </span>
            <span className="flex items-center gap-1.5">
              <Store className="size-4 text-cyan-300" />
              Σύγκριση τιμών σε 5 μεγάλες αλυσίδες
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-300" />
              Πιστοποιημένη ποιότητα επώνυμων προϊόντων
            </span>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 size-40 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Cadence Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Όλα τα Πακέτα" },
            { id: "monthly", label: "Μηνιαία (30 Ημερών)" },
            { id: "quarterly", label: "Τριμηνιαία (Bulk)" },
            { id: "starter", label: "Starter Kits" },
          ].map((cad) => (
            <button
              key={cad.id}
              onClick={() => setSelectedCadence(cad.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCadence === cad.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cad.label}
            </button>
          ))}
        </div>

        {/* Search & Admin Create Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Αναζήτηση προϊόντος..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadBundles}
            className="size-8 p-0 rounded-xl"
            title="Ανανέωση"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {isAdmin && onOpenBundleStudio && (
            <Button
              size="sm"
              onClick={() => onOpenBundleStudio()}
              className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              <PlusCircle className="size-3.5" />
              <span>Νέο Πακέτο Καθαριότητας</span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Bundles */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm">Φόρτωση πακέτων καθαριότητας &amp; τιμών e-Καταναλωτή...</p>
        </div>
      ) : filteredBundles.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
          <ShoppingBag className="size-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-bold text-foreground">Δεν βρέθηκαν πακέτα καθαριότητας</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Δοκιμάστε να αλλάξετε τα φίλτρα ή την αναζήτησή σας.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onAddBundleToGroceryList={onAddBundleToGroceryList}
              isAdmin={isAdmin}
              onEditBundle={onOpenBundleStudio}
              onDeleteBundle={handleDeleteBundle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
