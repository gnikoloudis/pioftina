"use client";

import React, { useState } from "react";
import { ProductBundle, BundleStorePrice } from "@/types/bundles";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";

interface BundleSupermarketMatrixProps {
  bundle: ProductBundle;
}

export function BundleSupermarketMatrix({ bundle }: BundleSupermarketMatrixProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const storePrices: BundleStorePrice[] = bundle.storePrices || [];
  if (storePrices.length === 0) return null;

  // Sort stores from lowest price to highest
  const sortedStores = [...storePrices].sort((a, b) => a.totalPrice - b.totalPrice);
  const bestStore = sortedStores[0];
  const otherStores = sortedStores.slice(1);
  const lowestPrice = bestStore?.totalPrice || 0;
  const highestPrice = sortedStores[sortedStores.length - 1]?.totalPrice || 0;
  const maxDifference = Math.max(0, Math.round((highestPrice - lowestPrice) * 100) / 100);

  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 overflow-hidden shadow-xs">
      {/* Summary Header */}
      <div className="p-3 sm:p-4 bg-muted/40 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Σύγκριση {sortedStores.length} Σούπερ Μάρκετ
              </span>
              {maxDifference > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingDown className="size-3 shrink-0" /> Έως €{maxDifference.toFixed(2)} διαφορά
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Τιμές e-Καταναλωτής για το σύνολο των {bundle.items.length} ειδών του πακέτου
            </p>
          </div>

          <button
            type="button"
            id={`toggle-item-analysis-${bundle.id}`}
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors self-start sm:self-center shrink-0 px-2.5 py-1 rounded-lg border border-border/60 bg-background hover:bg-muted"
          >
            <span>{isExpanded ? "Απόκρυψη ανάλυσης" : "Ανάλυση ανά προϊόν"}</span>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* 1. Best Store Hero Card */}
        {bestStore && (
          <div className="relative rounded-xl p-3 sm:p-3.5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/40 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md shadow-xs">
                    <CheckCircle2 className="size-3 shrink-0" /> Χαμηλότερη Τιμή
                  </span>
                  {maxDifference > 0 && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                      Κέρδος έως €{maxDifference.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <SupermarketBadge
                    retailerId={bestStore.retailerId}
                    retailerName={bestStore.retailerName}
                    size="sm"
                  />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {bestStore.unavailableCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="size-3 shrink-0" /> {bestStore.unavailableCount} εκτιμώμενα
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3 shrink-0" /> Όλα διαθέσιμα
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                  €{bestStore.totalPrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">
                  Σύνολο πακέτου
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Other Supermarkets Comparison Rows */}
        {otherStores.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-muted-foreground px-1 uppercase tracking-wider">
              Υπόλοιπες Αλυσίδες
            </div>
            <div className="space-y-1.5">
              {otherStores.map((store) => {
                const diffFromBest = Math.round((store.totalPrice - lowestPrice) * 100) / 100;
                return (
                  <div
                    key={store.retailerId}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-border/70 hover:border-border transition-colors text-xs"
                  >
                    {/* Left: Badge + availability icon */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SupermarketBadge
                        retailerId={store.retailerId}
                        retailerName={store.retailerName}
                        size="sm"
                      />
                      {store.unavailableCount > 0 ? (
                        <span
                          className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-medium"
                          title={`${store.unavailableCount} εκτιμώμενα προϊόντα`}
                        >
                          <AlertTriangle className="size-3 shrink-0" />
                          <span className="hidden sm:inline">{store.unavailableCount} εκτιμ.</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"
                          title="Όλα τα προϊόντα είναι διαθέσιμα"
                        >
                          <CheckCircle2 className="size-3 shrink-0" />
                          <span className="hidden md:inline">Όλα διαθέσιμα</span>
                        </span>
                      )}
                    </div>

                    {/* Right: Price + Diff */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-sm text-foreground">
                        €{store.totalPrice.toFixed(2)}
                      </span>
                      {diffFromBest > 0 && (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          +€{diffFromBest.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Expanded Per-Item Table */}
      {isExpanded && (
        <div className="border-t border-border/60 bg-background/50 p-3 sm:p-4 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[540px]">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-2.5 pr-3 font-semibold min-w-[170px]">Προϊόν</th>
                <th className="pb-2.5 text-center font-semibold w-16">Ποσότητα</th>
                {sortedStores.map((st) => (
                  <th key={st.retailerId} className="pb-2.5 px-3 text-right font-semibold min-w-[100px]">
                    <span className="inline-block truncate max-w-[100px]">{st.retailerName}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {bundle.items.map((item) => {
                // Find lowest price among stores for this item
                const pricesForItem = sortedStores
                  .map((st) => st.itemPrices[item.id])
                  .filter((p): p is number => typeof p === "number" && p > 0);
                const lowestItemPrice = pricesForItem.length > 0 ? Math.min(...pricesForItem) : 0;

                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-foreground min-w-[170px]">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.brand} • {item.unitLabel}
                      </div>
                    </td>
                    <td className="py-2.5 text-center text-muted-foreground font-medium w-16">
                      x{item.quantity}
                    </td>
                    {sortedStores.map((st) => {
                      const itemPrice = st.itemPrices[item.id];
                      const isItemLowest = itemPrice && itemPrice === lowestItemPrice;
                      return (
                        <td
                          key={st.retailerId}
                          className={`py-2.5 px-3 text-right font-medium min-w-[100px] ${
                            isItemLowest
                              ? "text-emerald-700 dark:text-emerald-400 font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {itemPrice ? (
                            <span
                              className={
                                isItemLowest
                                  ? "bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
                                  : ""
                              }
                            >
                              €{itemPrice.toFixed(2)}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
