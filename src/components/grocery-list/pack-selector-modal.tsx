"use client";

import React from "react";
import { OptimizedGroceryItem, PackOption } from "@/types/meal-planner";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { X, Check, Package, Sparkles } from "lucide-react";

interface PackSelectorModalProps {
  item: OptimizedGroceryItem | null;
  onClose: () => void;
  onSelectOption: (option: PackOption) => void;
}

export function PackSelectorModal({
  item,
  onClose,
  onSelectOption,
}: PackSelectorModalProps) {
  if (!item) return null;

  const allAvailable = [
    ...(item.selectedOption ? [item.selectedOption] : []),
    ...item.alternativeOptions,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-lg max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <span>Επιλογή Συσκευασίας & Καταστήματος</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Υλικό: <span className="font-semibold text-foreground">{item.ingredientName}</span> (Χρειάζεστε {item.rawRequiredAmount} {item.rawUnit})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {allAvailable.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Δεν υπάρχουν εναλλακτικές συσκευασίες για αυτό το προϊόν.
            </div>
          ) : (
            allAvailable.map((opt, idx) => {
              const isCurrent =
                item.selectedOption?.product.id === opt.product.id &&
                item.selectedOption?.retailer === opt.retailer &&
                item.selectedOption?.packSize === opt.packSize;

              return (
                <div
                  key={`${opt.product.id}-${opt.retailer}-${opt.packSize}-${idx}`}
                  onClick={() => {
                    onSelectOption(opt);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "bg-primary/5 border-primary ring-1 ring-primary/40 shadow-xs"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {opt.isSynthetic ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          ⚠️ Χωρίς καταχώρηση στο posokanei.gov.gr
                        </span>
                      ) : (
                        <SupermarketBadge retailerId={opt.retailer} size="sm" />
                      )}
                      {opt.isBulk && !opt.isSynthetic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="size-2.5" /> Bulk Pack
                        </span>
                      )}
                      {opt.savingsVsSmallestPercent && opt.savingsVsSmallestPercent > 0 && !opt.isSynthetic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          -{opt.savingsVsSmallestPercent}% / {opt.packUnit}
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-sm text-foreground truncate">
                      {opt.product.name}
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>
                        Συσκευασία:{" "}
                        <strong className="text-foreground">
                          {opt.packCount} × {opt.packSize} {opt.packUnit}
                        </strong>{" "}
                        ({opt.totalQuantity} {opt.packUnit})
                      </span>
                      <span>
                        {opt.isSynthetic ? "~" : ""}€{opt.unitPrice.toFixed(2)}/{opt.packUnit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-base font-bold ${opt.isSynthetic ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                      {opt.isSynthetic ? `~€${opt.totalPrice.toFixed(2)}` : `€${opt.totalPrice.toFixed(2)}`}
                    </div>
                    {opt.isSynthetic && (
                      <div className="text-[9px] uppercase tracking-wider font-bold text-amber-600/80 dark:text-amber-400/80">
                        Εκτίμηση
                      </div>
                    )}
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-1">
                        <Check className="size-3" /> Επιλεγμένο
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground hover:text-primary">
                        Επιλογή
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
