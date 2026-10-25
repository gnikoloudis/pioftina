"use client";

import React, { useState } from "react";
import { ProductBundle, BundleItem } from "@/types/bundles";
import { BundleSupermarketMatrix } from "@/components/bundles/bundle-supermarket-matrix";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  ShoppingCart,
  Download,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Shield,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BundleCardProps {
  bundle: ProductBundle;
  onAddBundleToGroceryList?: (bundle: ProductBundle) => void;
  onExportBundle?: (bundle: ProductBundle) => void;
  isAdmin?: boolean;
  onEditBundle?: (bundle: ProductBundle) => void;
  onDeleteBundle?: (bundleId: string) => void;
}

export function BundleCard({
  bundle,
  onAddBundleToGroceryList,
  onExportBundle,
  isAdmin,
  onEditBundle,
  onDeleteBundle,
}: BundleCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const handleAddToCart = () => {
    if (onAddBundleToGroceryList) {
      onAddBundleToGroceryList(bundle);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    }
  };

  const handleExport = () => {
    // 1. Automatically ensure bundle items are added to user's active grocery list
    if (onAddBundleToGroceryList) {
      onAddBundleToGroceryList(bundle);
      setIsAdded(true);
      setIsSaved(true);
      setTimeout(() => {
        setIsAdded(false);
        setIsSaved(false);
      }, 3000);
    }

    // 2. Download bundle text file
    if (onExportBundle) {
      onExportBundle(bundle);
    } else {
      // Default direct download as text
      const content = [
        `====================================================`,
        `ΠΑΚΕΤΟ: ${bundle.title} (${bundle.cadenceLabel})`,
        `Κατηγορία: ${bundle.category === "cleaning" ? "Καθαριότητα Σπιτιού" : "Βρεφική Φροντίδα"}`,
        `Εκτιμώμενη Χαμηλότερη Τιμή: €${bundle.estimatedTotalEur.toFixed(2)} (@ ${bundle.bestStoreName})`,
        `Εκτιμώμενο Κέρδος: €${bundle.estimatedSavingsEur.toFixed(2)}`,
        `====================================================\n`,
        `ΠΡΟΪΟΝΤΑ ΠΑΚΕΤΟΥ (Προστέθηκαν και στη Λίστα Αγορών σας):`,
        ...bundle.items.map(
          (item, idx) =>
            `${idx + 1}. ${item.name} (${item.brand}) - Ποσότητα: ${item.quantity} [${item.unitLabel}] ~ €${(item.referencePriceEur * item.quantity).toFixed(2)}`
        ),
        `\n====================================================`,
        `Δημιουργήθηκε από το pioftina.gr • ${new Date().toLocaleDateString("el-GR")}`,
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bundle.slug}-pioftina.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Banner & Header */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Badges & Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={bundle.title}>
              {bundle.icon || (bundle.category === "cleaning" ? "🧼" : "👶")}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {bundle.badge}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {bundle.cadenceLabel}
            </span>
          </div>

          {/* Admin Badges */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {!bundle.isPublished && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Πρόχειρο (Μη δημοσιευμένο)
                </span>
              )}
              {onEditBundle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditBundle(bundle)}
                  className="size-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Επεξεργασία πακέτου"
                >
                  <Edit2 className="size-3.5" />
                </Button>
              )}
              {onDeleteBundle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBundle(bundle.id)}
                  className="size-7 p-0 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  title="Διαγραφή πακέτου"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {bundle.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {bundle.description}
          </p>
        </div>

        {/* Pricing Spotlight */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Χαμηλότερη Τιμή Πακέτου
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                €{bundle.estimatedTotalEur.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">για {bundle.items.length} είδη</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-muted-foreground">Καλύτερη τιμή σε:</span>
              <SupermarketBadge retailerId={bundle.bestStoreId} size="sm" />
            </div>
          </div>

          {bundle.estimatedSavingsEur > 0 && (
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <Sparkles className="size-3" />
                <span>Κέρδος €{bundle.estimatedSavingsEur.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                έναντι μεμονωμένων αγορών
              </div>
            </div>
          )}
        </div>

        {/* Products Peek / Accordion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Package className="size-3.5 text-primary" />
              <span>Περιεχόμενα ({bundle.items.length} προϊόντα)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowItems(!showItems)}
              className="text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{showItems ? "Σύμπτυξη" : "Προβολή όλων"}</span>
              {showItems ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          </div>

          {/* Quick Preview Chips (first 3 items) when collapsed */}
          {!showItems && (
            <div className="flex flex-wrap gap-1.5">
              {bundle.items.slice(0, 3).map((item) => (
                <span
                  key={item.id}
                  className="text-xs bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/60"
                >
                  <span className="font-semibold">{item.quantity}x</span> {item.name.slice(0, 28)}
                  {item.name.length > 28 ? "..." : ""}
                </span>
              ))}
              {bundle.items.length > 3 && (
                <span className="text-xs bg-muted/30 text-muted-foreground px-2 py-1 rounded-lg border border-dashed border-border">
                  +{bundle.items.length - 3} ακόμη
                </span>
              )}
            </div>
          )}

          {/* Expanded Items List */}
          {showItems && (
            <div className="rounded-xl border border-border/70 divide-y divide-border/50 bg-background/60 max-h-60 overflow-y-auto">
              {bundle.items.map((item) => (
                <div key={item.id} className="p-2.5 flex items-center justify-between text-xs gap-3">
                  <div>
                    <div className="font-semibold text-foreground">{item.name}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-primary">{item.brand}</span>
                      <span>•</span>
                      <span>{item.unitLabel}</span>
                      <span>•</span>
                      <span className="text-muted-foreground/80">{item.categoryTag}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-muted font-bold text-foreground">
                      x{item.quantity}
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      ~€{(item.referencePriceEur * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supermarket Comparison Matrix Toggle */}
        <div>
          <button
            type="button"
            id={`toggle-matrix-${bundle.id}`}
            onClick={() => setShowMatrix(!showMatrix)}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-border hover:bg-muted/40 transition-colors flex items-center justify-center gap-2 text-foreground"
          >
            <Layers className="size-3.5 text-primary" />
            <span>
              {showMatrix ? "Απόκρυψη Σύγκρισης Σούπερ Μάρκετ" : "Προβολή Σύγκρισης σε όλα τα Σούπερ Μάρκετ"}
            </span>
            {showMatrix ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>

          {showMatrix && (
            <div className="mt-3">
              <BundleSupermarketMatrix bundle={bundle} />
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 bg-muted/30 border-t border-border/80 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          id={`btn-export-bundle-${bundle.id}`}
          onClick={handleExport}
          className={`h-9 px-3 rounded-xl text-xs gap-1.5 border-border transition-colors ${
            isSaved
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "hover:bg-background"
          }`}
          title="Αποθήκευση λίστας πακέτου σε αρχείο κειμένου και προσθήκη στη Λίστα Αγορών"
        >
          {isSaved ? (
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Download className="size-3.5 text-muted-foreground" />
          )}
          <span className="hidden sm:inline">
            {isSaved ? "Αποθηκεύτηκε!" : "Αποθήκευση"}
          </span>
        </Button>

        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 transition-all shadow-xs ${
            isAdded
              ? "bg-emerald-600 text-white hover:bg-emerald-600"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="size-4 animate-in zoom-in" />
              <span>Προστέθηκε στη Λίστα!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              <span>Προσθήκη στη Λίστα Αγορών</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
