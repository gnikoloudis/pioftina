"use client";

import React from "react";
import { BasketComparison } from "@/types/meal-planner";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { TrendingDown, CheckCircle2, ShoppingBag, Check } from "lucide-react";

interface StoreComparisonWidgetProps {
  comparisons: BasketComparison[];
  totalBulkSavings: number;
  unavailableCount?: number;
}

export const StoreComparisonWidget = React.memo(function StoreComparisonWidget({
  comparisons,
  totalBulkSavings,
  unavailableCount = 0,
}: StoreComparisonWidgetProps) {
  if (comparisons.length === 0) return null;

  const cheapest = comparisons.find((c) => c.isCheapest) || comparisons[0];
  const hasCheckedItems = comparisons.some((c) => c.purchasedCount > 0);
  const allItemsPurchased = comparisons.every((c) => c.itemCount === 0);
  const effectiveUnavailable = cheapest.unavailableCount ?? unavailableCount;

  return (
    <div className="space-y-4">
      {/* Highlights Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-blue-500/10 via-primary/5 to-transparent border border-blue-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            {allItemsPurchased ? (
              <Check className="size-5" />
            ) : (
              <TrendingDown className="size-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {allItemsPurchased
                  ? "Όλα τα ψώνια ολοκληρώθηκαν"
                  : hasCheckedItems
                  ? "Οικονομικότερο Υπόλοιπο Αγορών"
                  : "Οικονομικότερο Καλάθι"}
              </span>
              <SupermarketBadge retailerId={cheapest.retailerId} size="sm" />
            </div>

            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <span className="text-sm font-medium text-foreground">
                {allItemsPurchased ? "Τελικό σύνολο:" : hasCheckedItems ? "Απομένουν να πληρώσετε:" : "Σύνολο καλαθιού:"}
              </span>
              <span className="font-bold text-base text-primary font-heading">
                €{(hasCheckedItems && !allItemsPurchased ? cheapest.remainingCost : cheapest.totalCost).toFixed(2)}
              </span>

              {hasCheckedItems && !allItemsPurchased && (
                <span className="text-xs text-muted-foreground">
                  (αρχικό σύνολο: €{cheapest.totalCost.toFixed(2)} &bull; αγοράστηκαν: €{cheapest.purchasedCost.toFixed(2)})
                </span>
              )}

              {cheapest.savingsVsAverage > 0 && !allItemsPurchased && (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  (Εξοικονόμηση €{cheapest.savingsVsAverage.toFixed(2)})
                </span>
              )}

              {effectiveUnavailable > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  (+ {effectiveUnavailable} μη διαθέσιμα)
                </span>
              )}
            </div>
          </div>
        </div>

        {totalBulkSavings > 0 && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5 self-start sm:self-auto">
            <span>⭐ Κέρδος από Bulk συσκευασίες:</span>
            <span className="font-bold">€{totalBulkSavings.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Supermarket Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {comparisons.map((comp) => {
          const displayPrice = hasCheckedItems && !allItemsPurchased ? comp.remainingCost : comp.totalCost;

          return (
            <div
              key={comp.retailerId}
              className={`p-3 rounded-xl border transition-colors ${
                comp.isCheapest
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/30"
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <SupermarketBadge
                  retailerId={comp.retailerId}
                  retailerName={comp.retailerName}
                  size="sm"
                />
                {comp.isCheapest && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                    <CheckCircle2 className="size-2.5" /> Best
                  </span>
                )}
              </div>

              <div className="mt-1">
                <div className="text-base font-bold text-foreground">
                  €{displayPrice.toFixed(2)}
                </div>

                {hasCheckedItems && !allItemsPurchased && (
                  <div className="text-[10px] text-muted-foreground">
                    αρχικό: €{comp.totalCost.toFixed(2)}
                  </div>
                )}

                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                  <ShoppingBag className="size-3" />
                  <span>
                    {hasCheckedItems
                      ? `${comp.itemCount} απομένουν`
                      : `${comp.itemCount}/${comp.totalItems} είδη`}
                  </span>
                </div>

                {(comp.unavailableCount ?? unavailableCount) > 0 && (
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                    + {comp.unavailableCount ?? unavailableCount} μη διαθέσιμα
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
