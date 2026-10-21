"use client";

import React from "react";
import {
  PantrySurplusItem,
  OptimizedGroceryItem,
  AISLE_CATEGORIES,
} from "@/types/meal-planner";
import { Sparkles, Home, RotateCcw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PantryViewProps {
  surplusItems: PantrySurplusItem[];
  groceryItems: OptimizedGroceryItem[];
  onTogglePantry: (ingredientId: string) => void;
}

export function PantryView({
  surplusItems,
  groceryItems,
  onTogglePantry,
}: PantryViewProps) {
  const pantryItems = groceryItems.filter((i) => i.inPantry);

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border shadow-xs flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            Αποθήκη & Πλεόνασμα Συσκευασιών
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Επειδή τα supermarkets πωλούν συγκεκριμένα μεγέθη συσκευασιών (π.χ. 1kg ρύζι ή 400g φέτα), το σύστημα παρακολουθεί αυτόματα τι ποσότητα σας περισσεύει για τα επόμενα μαγειρέματα, ώστε να μη μένει τίποτα ανεκμετάλλευτο.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Surplus from Weekly Packages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Box className="size-4 text-emerald-500" />
              <span>Πλεόνασμα από τα Ψώνια της Εβδομάδας</span>
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {surplusItems.length} υλικά
            </span>
          </div>

          {surplusItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-xl">
              Δεν υπάρχει σημαντικό περίσσευμα στις τρέχουσες συσκευασίες.
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
              {surplusItems.map((item) => {
                const aisle = AISLE_CATEGORIES[item.category];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{aisle?.icon || "🛒"}</span>
                        <span>{item.ingredientName}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Από γεύματα: {item.originMealNames.join(", ")}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        +{item.amount} {item.unit}
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        για το ντουλάπι
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Items user has at home */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Home className="size-4 text-primary" />
              <span>Υλικά που Έχετε Ήδη στο Σπίτι</span>
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {pantryItems.length} υλικά
            </span>
          </div>

          {pantryItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-xl">
              Δεν έχετε επισημάνει υλικά ως &quot;υπάρχοντα στο σπίτι&quot;. Κάντε κλικ στο εικονίδιο σπιτιού στη λίστα αγορών για να εξαιρέσετε υλικά που έχετε ήδη.
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
              {pantryItems.map((item) => (
                <div
                  key={item.ingredientId}
                  className="p-3.5 flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <div className="font-semibold text-foreground">
                      {item.ingredientName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Χρειαζόταν: {item.rawRequiredAmount} {item.rawUnit} (Εξαιρέθηκε από το κόστος)
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onTogglePantry(item.ingredientId)}
                    className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                    title="Επαναφορά στη λίστα αγορών"
                  >
                    <RotateCcw className="size-3" />
                    Επαναφορά
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
