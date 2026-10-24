"use client";

import React, { useState } from "react";
import {
  OptimizedGroceryItem,
  BasketComparison,
  PackOption,
  AISLE_CATEGORIES,
  AisleCategory,
  Ingredient,
} from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { StoreComparisonWidget } from "./store-comparison-widget";
import { PackSelectorModal } from "./pack-selector-modal";
import { ShareModal } from "./share-modal";
import { CurateProductModal } from "@/components/recipes/curate-product-modal";
import {
  Check,
  CheckCircle2,
  Circle,
  Share2,
  Package,
  Sparkles,
  Home,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Search,
  Trash2,
  EyeOff,
  RotateCcw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroceryListViewProps {
  items: OptimizedGroceryItem[];
  basketComparisons: BasketComparison[];
  totalCost: number;
  remainingCost: number;
  purchasedCost: number;
  totalSavings: number;
  isOptimizing: boolean;
  onToggleChecked: (ingredientId: string) => void;
  onTogglePantry: (ingredientId: string) => void;
  onToggleExcluded?: (ingredientId: string) => void;
  onRestoreAllExcluded?: () => void;
  onUpdateItemOption: (ingredientId: string, option: PackOption) => void;
  onCurateProduct?: (ingredientId: string, product: Product) => void;
  onOpenSaveModal?: () => void;
}

export function GroceryListView({
  items,
  basketComparisons,
  totalCost,
  remainingCost,
  purchasedCost,
  totalSavings,
  isOptimizing,
  onToggleChecked,
  onTogglePantry,
  onToggleExcluded,
  onRestoreAllExcluded,
  onUpdateItemOption,
  onCurateProduct,
  onOpenSaveModal,
}: GroceryListViewProps) {
  const [selectedItemForModal, setSelectedItemForModal] =
    useState<OptimizedGroceryItem | null>(null);
  const [curatingItem, setCuratingItem] = useState<OptimizedGroceryItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hideChecked, setHideChecked] = useState(false);
  const [collapsedAisles, setCollapsedAisles] = useState<string[]>([]);

  // Calculate progress & active items (excluding pantry and deleted/excluded items)
  const activeItems = items.filter((i) => !i.inPantry && !i.isExcluded);
  const excludedItems = items.filter((i) => i.isExcluded);
  const checkedCount = activeItems.filter((i) => i.isChecked).length;
  const progressPercent =
    activeItems.length > 0 ? Math.round((checkedCount / activeItems.length) * 100) : 0;

  // Identify unavailable items (without official product SKU or price)
  const unavailableItems = activeItems.filter(
    (i) =>
      i.isUnmatched ||
      i.isAvailable === false ||
      i.selectedOption?.isSynthetic ||
      !i.selectedOption?.totalPrice ||
      i.selectedOption.totalPrice <= 0
  );

  const toggleAisleCollapse = (categoryKey: string) => {
    setCollapsedAisles((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((k) => k !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  // Group items by category
  const categoriesInUse = Object.keys(AISLE_CATEGORIES) as AisleCategory[];

  return (
    <div className="space-y-6">
      {/* Store Comparisons */}
      <StoreComparisonWidget
        comparisons={basketComparisons}
        totalBulkSavings={totalSavings}
        unavailableCount={unavailableItems.length}
      />

      {/* Action & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-foreground font-heading">
              Οργανωμένη Λίστα Αγορών
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {checkedCount}/{activeItems.length} αγορασμένα ({progressPercent}%)
            </span>
            {checkedCount > 0 && remainingCost > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Απομένουν: €{remainingCost.toFixed(2)}
              </span>
            )}
            {unavailableItems.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                +{unavailableItems.length} μη διαθέσιμα
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-64 h-2 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideChecked(!hideChecked)}
            className="text-xs"
          >
            {hideChecked ? "Εμφάνιση όλων" : "Απόκρυψη αγορασμένων"}
          </Button>

          {onOpenSaveModal && (
            <Button
              variant="outline"
              size="sm"
              id="btn-grocery-save-to-pc"
              onClick={onOpenSaveModal}
              className="text-xs gap-1.5 border-primary/30 hover:bg-primary/10 text-primary font-semibold"
              title="Αποθήκευση της λίστας αγορών και του πλάνου στον υπολογιστή"
            >
              <Download className="size-3.5" />
              <span>Αποθήκευση</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Share2 className="size-3.5" />
            Κοινοποίηση
          </Button>
        </div>
      </div>

      {/* Unavailable Items Transparency Callout */}
      {unavailableItems.length > 0 && !isOptimizing && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">
                  {unavailableItems.length} {unavailableItems.length === 1 ? "υλικό δεν βρέθηκε" : "υλικά δεν βρέθηκαν"} στο posokanei.gov.gr (Χωρίς τιμή)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Μη Διαθέσιμο
                </span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                Δεν έχει οριστεί τιμή για να μην αλλοιώνεται το σύνολο του καλαθιού σας. Μπορείτε να πατήσετε <strong>«Αντιστοίχιση»</strong> για να συνδέσετε ένα υπαρκτό επώνυμο προϊόν ή να το <strong>εξαιρέσετε</strong> από τη λίστα.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Departments Accordion */}
      {isOptimizing ? (
        <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm">Υπολογισμός τιμών και βελτιστοποίηση συσκευασιών...</p>
        </div>
      ) : activeItems.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground bg-card border border-border rounded-2xl">
          <p className="text-base font-medium">Η λίστα σας είναι άδεια!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Προσθέστε γεύματα στο εβδομαδιαίο πλάνο για να παραχθούν αυτόματα τα υλικά.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesInUse.map((catKey) => {
            let catItems = items.filter((i) => i.category === catKey && !i.inPantry && !i.isExcluded);
            if (hideChecked) {
              catItems = catItems.filter((i) => !i.isChecked);
            }
            if (catItems.length === 0) return null;

            const aisle = AISLE_CATEGORIES[catKey];
            const isCollapsed = collapsedAisles.includes(catKey);

            return (
              <div
                key={catKey}
                className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden"
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleAisleCollapse(catKey)}
                  className="flex items-center justify-between px-5 py-3.5 bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer border-b border-border/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{aisle.icon}</span>
                    <h3 className="font-bold text-sm text-foreground">
                      {aisle.nameEl}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                      {catItems.length}
                    </span>
                  </div>

                  <button className="text-muted-foreground">
                    {isCollapsed ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronUp className="size-4" />
                    )}
                  </button>
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-border/60">
                    {catItems.map((item) => {
                      const opt = item.selectedOption;
                      const isUnavailable =
                        item.isUnmatched ||
                        item.isAvailable === false ||
                        opt?.isSynthetic ||
                        (opt?.totalPrice || 0) <= 0;
                      const hasBulk = !isUnavailable && (opt?.isBulk || (opt?.savingsVsSmallestPercent || 0) > 0);

                      return (
                        <div
                          key={item.ingredientId}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            item.isChecked
                              ? "bg-muted/30 opacity-60"
                              : isUnavailable
                              ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                              : "hover:bg-muted/10"
                          }`}
                        >
                          {/* Left: Checkbox & Name */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => onToggleChecked(item.ingredientId)}
                              className={`mt-0.5 size-5 rounded-md border flex items-center justify-center transition-all ${
                                item.isChecked
                                  ? "bg-primary border-primary text-primary-foreground shadow-2xs"
                                  : "border-muted-foreground/40 hover:border-primary"
                              }`}
                            >
                              {item.isChecked && <Check className="size-3.5" />}
                            </button>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-semibold text-sm ${
                                    item.isChecked
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.ingredientName}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                  (Χρειάζονται: {item.rawRequiredAmount} {item.rawUnit})
                                </span>
                              </div>

                              {/* Posokanei matched product or Unavailable Badge */}
                              {opt ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                  {isUnavailable ? (
                                    <>
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                        <AlertTriangle className="size-3 shrink-0" />
                                        Μη διαθέσιμο στο posokanei.gov.gr
                                      </span>
                                      {onCurateProduct && (
                                        <button
                                          onClick={() => setCuratingItem(item)}
                                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline transition-colors"
                                          title="Αναζήτηση και αντιστοίχιση με επίσημο προϊόν supermarket"
                                        >
                                          <Search className="size-3" />
                                          Αντιστοίχιση
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <SupermarketBadge
                                        retailerId={opt.retailer}
                                        size="sm"
                                      />
                                      <span className="truncate font-medium text-foreground">
                                        {opt.product.name}
                                      </span>

                                      {item.isCurated && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                          ✓ Επιλεγμένο
                                        </span>
                                      )}

                                      {hasBulk && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                                          <Sparkles className="size-2.5" />
                                          {opt.savingsVsSmallestPercent
                                            ? `Bulk -${opt.savingsVsSmallestPercent}% / ${opt.packUnit}`
                                            : "Bulk Pack"}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">
                                  Αναζήτηση διαθέσιμων συσκευασιών...
                                </p>
                              )}

                              {/* Surplus callout */}
                              {item.surplusAmount > 0.05 && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  ✓ +{item.surplusAmount} {item.surplusUnit} περίσσευμα για το ντουλάπι σας
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Pack count, Price & Selector */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                            {opt ? (
                              <div className="text-right">
                                {isUnavailable ? (
                                  <>
                                    <div className="text-sm font-bold text-muted-foreground">
                                      —
                                    </div>
                                    <div className="text-[9px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                                      Μη διαθέσιμο
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      {opt.packCount} × {opt.packSize} {opt.packUnit}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm font-bold text-foreground">
                                      €{opt.totalPrice.toFixed(2)}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      {opt.packCount} × {opt.packSize} {opt.packUnit} (€{opt.unitPrice.toFixed(2)}/{opt.packUnit})
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : null}

                            <div className="flex items-center gap-1.5">
                              {/* Open pack selector or curation modal */}
                              {isUnavailable ? (
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => setCuratingItem(item)}
                                  className="h-7 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                                  title="Αντιστοίχιση με υπαρκτό προϊόν supermarket"
                                >
                                  <Search className="size-3" />
                                  Αντιστοίχιση
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="xs"
                                  onClick={() => setSelectedItemForModal(item)}
                                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                  title="Αλλαγή μεγέθους συσκευασίας ή supermarket"
                                >
                                  <Package className="size-3" />
                                  Αλλαγή
                                </Button>
                              )}

                              {/* Pantry button */}
                              <button
                                onClick={() => onTogglePantry(item.ingredientId)}
                                className="p-1.5 text-muted-foreground hover:text-primary rounded-md transition-colors"
                                title="Το έχω ήδη στο σπίτι (εξαίρεση από τη λίστα)"
                              >
                                <Home className="size-3.5" />
                              </button>

                              {/* Delete / Exclude button */}
                              {onToggleExcluded && (
                                <button
                                  onClick={() => onToggleExcluded(item.ingredientId)}
                                  className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-md transition-colors"
                                  title="Διαγραφή / Εξαίρεση από τη λίστα αγορών"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Excluded items drawer */}
      {excludedItems.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <EyeOff className="size-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                Εξαιρεμένα είδη ({excludedItems.length})
              </span>
            </div>
            {onRestoreAllExcluded && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onRestoreAllExcluded}
                className="text-xs text-primary hover:underline h-7"
              >
                Επαναφορά όλων
              </Button>
            )}
          </div>
          <div className="mt-2.5 divide-y divide-border/40">
            {excludedItems.map((item) => (
              <div
                key={item.ingredientId}
                className="py-2 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 text-muted-foreground line-through">
                  <span>{item.ingredientName}</span>
                  <span className="text-[11px]">
                    ({item.rawRequiredAmount} {item.rawUnit})
                  </span>
                </div>
                {onToggleExcluded && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onToggleExcluded(item.ingredientId)}
                    className="h-6 text-[11px] gap-1"
                  >
                    <RotateCcw className="size-3" />
                    Επαναφορά
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedItemForModal && (
        <PackSelectorModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onSelectOption={(newOption) => {
            onUpdateItemOption(selectedItemForModal.ingredientId, newOption);
            setSelectedItemForModal(null);
          }}
        />
      )}

      {curatingItem && onCurateProduct && (
        <CurateProductModal
          isOpen={true}
          ingredient={{
            id: curatingItem.ingredientId,
            name: curatingItem.ingredientName,
            amount: curatingItem.rawRequiredAmount,
            unit: (curatingItem.rawUnit as any) || "g",
            category: curatingItem.category,
            posokaneiQuery: curatingItem.ingredientId,
          }}
          recipeTitle="Λίστα Αγορών"
          onClose={() => setCuratingItem(null)}
          onAssignProduct={(product: Product) => {
            onCurateProduct(curatingItem.ingredientId, product);
            setCuratingItem(null);
          }}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          isOpen={true}
          onClose={() => setIsShareModalOpen(false)}
          items={items}
          totalCost={totalCost}
        />
      )}
    </div>
  );
}
