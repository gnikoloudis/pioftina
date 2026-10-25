"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  OptimizedGroceryItem,
  BasketComparison,
  PackOption,
  AISLE_CATEGORIES,
  AisleCategory,
  Ingredient,
} from "@/types/meal-planner";

const CATEGORIES_IN_USE = Object.keys(AISLE_CATEGORIES) as AisleCategory[];
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
  X,
  CheckSquare,
  Square,
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
  onExcludeMultiple?: (ingredientIds: string[]) => void;
  onRestoreExcludedItems?: (ingredientIds: string[]) => void;
  onRestoreAllExcluded?: () => void;
  onClearExcludedPermanently?: () => void;
  onUpdateItemOption: (ingredientId: string, option: PackOption) => void;
  onCurateProduct?: (ingredientId: string, product: Product) => void;
  onOpenSaveModal?: () => void;
  onClearGroceryList?: (options?: { clearSlots?: boolean }) => void;
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
  onExcludeMultiple,
  onRestoreExcludedItems,
  onRestoreAllExcluded,
  onClearExcludedPermanently,
  onUpdateItemOption,
  onCurateProduct,
  onOpenSaveModal,
  onClearGroceryList,
}: GroceryListViewProps) {
  const [selectedItemForModal, setSelectedItemForModal] =
    useState<OptimizedGroceryItem | null>(null);
  const [curatingItem, setCuratingItem] = useState<OptimizedGroceryItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [hideChecked, setHideChecked] = useState(false);
  const [collapsedAisles, setCollapsedAisles] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [undoToast, setUndoToast] = useState<{
    ids: string[];
    message: string;
  } | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-dismiss undo toast after 6 seconds
  useEffect(() => {
    if (!undoToast) return;
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [undoToast]);

  // Auto-dismiss notification toast after 4 seconds
  useEffect(() => {
    if (!notificationToast) return;
    const timer = setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notificationToast]);

  // Memoized derivations
  const activeItems = useMemo(() => items.filter((i) => !i.inPantry && !i.isExcluded), [items]);
  const excludedItems = useMemo(() => items.filter((i) => i.isExcluded), [items]);
  const inPantryItems = useMemo(() => items.filter((i) => i.inPantry), [items]);
  const checkedCount = useMemo(() => activeItems.filter((i) => i.isChecked).length, [activeItems]);
  const progressPercent = useMemo(
    () => (activeItems.length > 0 ? Math.round((checkedCount / activeItems.length) * 100) : 0),
    [activeItems.length, checkedCount]
  );

  // Greek accent-insensitive search normalizer (e.g. ελαιολαδο matches Ελαιόλαδο)
  const normalizeSearch = useCallback((str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(), []);

  // Real-time grocery item search query
  const queryNorm = useMemo(() => normalizeSearch(searchQuery.trim()), [searchQuery, normalizeSearch]);

  // Pre-categorize active, visible items in a single O(N) pass across all aisles
  const categorizedItems = useMemo(() => {
    const map = {} as Record<AisleCategory, OptimizedGroceryItem[]>;
    for (const key of CATEGORIES_IN_USE) {
      map[key] = [];
    }

    for (const item of items) {
      if (item.inPantry || item.isExcluded) continue;
      if (hideChecked && item.isChecked) continue;

      if (queryNorm) {
        const ingredientMatch = item.ingredientName && normalizeSearch(item.ingredientName).includes(queryNorm);
        const productNameMatch = item.selectedOption?.product?.name && normalizeSearch(item.selectedOption.product.name).includes(queryNorm);
        const brandMatch = item.selectedOption?.product?.brand && normalizeSearch(item.selectedOption.product.brand).includes(queryNorm);
        if (!ingredientMatch && !productNameMatch && !brandMatch) {
          continue;
        }
      }

      if (map[item.category]) {
        map[item.category].push(item);
      }
    }
    return map;
  }, [items, hideChecked, queryNorm, normalizeSearch]);

  const matchingVisibleItemsCount = useMemo(() => {
    let count = 0;
    for (const key of CATEGORIES_IN_USE) {
      count += categorizedItems[key]?.length || 0;
    }
    return count;
  }, [categorizedItems]);

  // Identify unavailable items (without official product SKU or price)
  const unavailableItems = useMemo(
    () =>
      activeItems.filter(
        (i) =>
          i.isUnmatched ||
          i.isAvailable === false ||
          i.selectedOption?.isSynthetic ||
          !i.selectedOption?.totalPrice ||
          i.selectedOption.totalPrice <= 0
      ),
    [activeItems]
  );

  const toggleAisleCollapse = useCallback((categoryKey: string) => {
    setCollapsedAisles((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((k) => k !== categoryKey)
        : [...prev, categoryKey]
    );
  }, []);

  // Single-item removal with instant Undo toast
  const handleRemoveSingleItem = useCallback((item: OptimizedGroceryItem) => {
    if (onToggleExcluded) {
      onToggleExcluded(item.ingredientId);
      setSelectedBulkIds((prev) => prev.filter((id) => id !== item.ingredientId));
      setUndoToast({
        ids: [item.ingredientId],
        message: `Το είδος «${item.ingredientName}» αφαιρέθηκε από τη λίστα`,
      });
    }
  }, [onToggleExcluded]);

  // Bulk removal helper
  const handleRemoveMultiple = useCallback((ids: string[], label: string) => {
    if (ids.length === 0) return;
    if (onExcludeMultiple) {
      onExcludeMultiple(ids);
    } else if (onToggleExcluded) {
      ids.forEach((id) => onToggleExcluded(id));
    }
    setSelectedBulkIds([]);
    setUndoToast({
      ids,
      message: label,
    });
  }, [onExcludeMultiple, onToggleExcluded]);

  // Quick action: Remove all purchased/checked items
  const handleRemoveCheckedItems = useCallback(() => {
    const checkedIds = activeItems.filter((i) => i.isChecked).map((i) => i.ingredientId);
    if (checkedIds.length === 0) return;
    handleRemoveMultiple(
      checkedIds,
      `${checkedIds.length} ${checkedIds.length === 1 ? "αγορασμένο είδος αφαιρέθηκε" : "αγορασμένα είδη αφαιρέθηκαν"}`
    );
  }, [activeItems, handleRemoveMultiple]);

  // Bulk select toggles
  const toggleSelectBulkItem = useCallback((id: string) => {
    setSelectedBulkIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAllCategory = useCallback((catItems: OptimizedGroceryItem[]) => {
    const catIds = catItems.map((i) => i.ingredientId);
    setSelectedBulkIds((prev) => {
      const allSelected = catIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !catIds.includes(id));
      } else {
        return Array.from(new Set([...prev, ...catIds]));
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedBulkIds((prev) =>
      prev.length === activeItems.length ? [] : activeItems.map((i) => i.ingredientId)
    );
  }, [activeItems]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedBulkIds.length === 0) return;
    const count = selectedBulkIds.length;
    handleRemoveMultiple(
      selectedBulkIds,
      `${count} ${count === 1 ? "επιλεγμένο είδος αφαιρέθηκε" : "επιλεγμένα είδη αφαιρέθηκαν"}`
    );
    setIsBulkMode(false);
  }, [selectedBulkIds, handleRemoveMultiple]);

  const handleRemoveCategory = useCallback((catKey: AisleCategory, catItems: OptimizedGroceryItem[]) => {
    const catIds = catItems.map((i) => i.ingredientId);
    const aisleName = AISLE_CATEGORIES[catKey]?.nameEl || "κατηγορία";
    handleRemoveMultiple(
      catIds,
      `Όλα τα είδη (${catIds.length}) από «${aisleName}» αφαιρέθηκαν`
    );
  }, [handleRemoveMultiple]);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    if (onRestoreExcludedItems) {
      onRestoreExcludedItems(undoToast.ids);
    } else if (onToggleExcluded) {
      undoToast.ids.forEach((id) => onToggleExcluded(id));
    }
    setUndoToast(null);
  }, [undoToast, onRestoreExcludedItems, onToggleExcluded]);

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
              className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {checkedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              id="btn-remove-checked-items"
              onClick={handleRemoveCheckedItems}
              className="text-xs gap-1.5 border-rose-500/40 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold animate-in fade-in"
              title="Διαγραφή όλων των αγορασμένων ειδών από τη λίστα"
            >
              <Trash2 className="size-3.5" />
              <span>Διαγραφή Αγορασμένων ({checkedCount})</span>
            </Button>
          )}

          <Button
            variant={isBulkMode ? "default" : "outline"}
            size="sm"
            id="btn-toggle-bulk-mode"
            onClick={() => {
              setIsBulkMode(!isBulkMode);
              if (isBulkMode) setSelectedBulkIds([]);
            }}
            className={`text-xs gap-1.5 ${
              isBulkMode
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground hover:bg-muted font-medium"
            }`}
            title="Ενεργοποίηση λειτουργίας μαζικής επιλογής και διαγραφής"
          >
            <CheckSquare className="size-3.5" />
            <span>{isBulkMode ? "Ακύρωση Επιλογής" : "Μαζική Επιλογή"}</span>
          </Button>

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

          {onClearGroceryList && (
            <Button
              variant="outline"
              size="sm"
              id="btn-clear-grocery-list"
              onClick={() => setIsResetModalOpen(true)}
              className="text-xs gap-1.5 border-rose-500/30 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
              title="Επαναφορά και καθαρισμός της λίστας αγορών"
            >
              <Trash2 className="size-3.5" />
              <span>Καθαρισμός Λίστας</span>
            </Button>
          )}
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
          {/* Real-time Grocery Search Bar */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="grocery-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Αναζήτηση προϊόντος ή υλικού στη Λίστα Αγορών (π.χ. γάλα, barilla, ελαιόλαδο)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  id="btn-clear-grocery-search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Καθαρισμός αναζήτησης"
                  aria-label="Καθαρισμός αναζήτησης"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            {queryNorm && (
              <div className="flex items-center justify-between mt-2 px-1 text-xs text-muted-foreground">
                <span>
                  Βρέθηκαν <strong>{matchingVisibleItemsCount}</strong> {matchingVisibleItemsCount === 1 ? "προϊόν" : "προϊόντα"} για <strong>«{searchQuery.trim()}»</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline font-semibold text-xs"
                >
                  Καθαρισμός φίλτρου
                </button>
              </div>
            )}
          </div>

          {/* Empty search results state */}
          {queryNorm && matchingVisibleItemsCount === 0 ? (
            <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-2xl p-6">
              <Search className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-base font-semibold text-foreground">Δεν βρέθηκαν προϊόντα στη λίστα</p>
              <p className="text-xs text-muted-foreground mt-1">
                Δεν υπάρχει προϊόν ή υλικό που να ταιριάζει με τον όρο «{searchQuery}».
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs"
              >
                Επαναφορά όλων των προϊόντων
              </Button>
            </div>
          ) : (
            CATEGORIES_IN_USE.map((catKey) => {
              const catItems = categorizedItems[catKey] || [];
              if (catItems.length === 0) return null;

              const aisle = AISLE_CATEGORIES[catKey];
              const isCollapsed = queryNorm ? false : collapsedAisles.includes(catKey);

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

                  <div className="flex items-center gap-2">
                    {isBulkMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAllCategory(catItems);
                        }}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                        title={
                          catItems.every((i) => selectedBulkIds.includes(i.ingredientId))
                            ? "Αποεπιλογή όλων στην κατηγορία"
                            : "Επιλογή όλων στην κατηγορία"
                        }
                      >
                        {catItems.every((i) => selectedBulkIds.includes(i.ingredientId)) ? (
                          <>
                            <CheckSquare className="size-3" />
                            <span>Αποεπιλογή ({catItems.length})</span>
                          </>
                        ) : (
                          <>
                            <Square className="size-3" />
                            <span>Επιλογή ({catItems.length})</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(catKey, catItems);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                      title={`Αφαίρεση όλων των ειδών της κατηγορίας «${aisle.nameEl}»`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                    <span className="text-muted-foreground pl-1">
                      {isCollapsed ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronUp className="size-4" />
                      )}
                    </span>
                  </div>
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

                      const isSelectedInBulk = selectedBulkIds.includes(item.ingredientId);

                      return (
                        <div
                          key={item.ingredientId}
                          onClick={isBulkMode ? () => toggleSelectBulkItem(item.ingredientId) : undefined}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            isBulkMode && isSelectedInBulk
                              ? "bg-primary/10 border-l-4 border-l-primary"
                              : item.isChecked
                              ? "bg-muted/30 opacity-60"
                              : isUnavailable
                              ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                              : "hover:bg-muted/10"
                          } ${isBulkMode ? "cursor-pointer select-none" : ""}`}
                        >
                          {/* Left: Checkbox & Name */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {isBulkMode ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectBulkItem(item.ingredientId);
                                }}
                                className={`mt-0.5 size-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isSelectedInBulk
                                    ? "bg-primary border-primary text-primary-foreground shadow-2xs"
                                    : "border-muted-foreground/40 hover:border-primary bg-background"
                                }`}
                                title={isSelectedInBulk ? "Αποεπιλογή" : "Επιλογή"}
                              >
                                {isSelectedInBulk && <Check className="size-3.5" />}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onToggleChecked(item.ingredientId)}
                                className={`mt-0.5 size-5 rounded-md border flex items-center justify-center transition-colors ${
                                  item.isChecked
                                    ? "bg-primary border-primary text-primary-foreground shadow-2xs"
                                    : "border-muted-foreground/40 hover:border-primary"
                                }`}
                                title={item.isChecked ? "Σημειώθηκε ως αγορασμένο" : "Σημείωση ως αγορασμένο"}
                              >
                                {item.isChecked && <Check className="size-3.5" />}
                              </button>
                            )}

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
                              {/* Open pack selector or search similar product modal */}
                              {isUnavailable ? (
                                <Button
                                  variant="outline"
                                  size="xs"
                                  id={`btn-curate-item-${item.ingredientId}`}
                                  onClick={() => setSelectedItemForModal(item)}
                                  className="h-7 text-xs gap-1 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                                  title="Αναζήτηση και αντιστοίχιση προϊόντος supermarket"
                                >
                                  <Search className="size-3" />
                                  Αντιστοίχιση
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="xs"
                                  id={`btn-change-item-${item.ingredientId}`}
                                  onClick={() => setSelectedItemForModal(item)}
                                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                  title="Αλλαγή προϊόντος ή μεγέθους συσκευασίας"
                                >
                                  <Package className="size-3" />
                                  Αλλαγή
                                </Button>
                              )}

                              {/* Pantry button */}
                              <button
                                onClick={() => {
                                  onTogglePantry(item.ingredientId);
                                  setNotificationToast(
                                    !item.inPantry
                                      ? `Το είδος «${item.ingredientName}» σημειώθηκε ως διαθέσιμο στην Αποθήκη`
                                      : `Το είδος «${item.ingredientName}» επανήλθε στη Λίστα Αγορών`
                                  );
                                }}
                                className="p-1.5 text-muted-foreground hover:text-primary rounded-md transition-colors"
                                title="Το έχω ήδη στο σπίτι (εξαίρεση από τη λίστα)"
                              >
                                <Home className="size-3.5" />
                              </button>

                              {/* Delete / Exclude button */}
                              {onToggleExcluded && (
                                <button
                                  type="button"
                                  id={`btn-remove-item-${item.ingredientId}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveSingleItem(item);
                                  }}
                                  className="p-1.5 text-muted-foreground/60 hover:text-rose-600 hover:bg-rose-500/10 rounded-md transition-colors"
                                  title="Αφαίρεση από τη λίστα αγορών"
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
          })
        )}
        </div>
      )}

      {/* In-Pantry items drawer (Have at home) */}
      {inPantryItems.length > 0 && (
        <div className="rounded-2xl border border-dashed border-emerald-500/30 p-4 bg-emerald-500/5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground">
                Υλικά που έχετε ήδη στο σπίτι ({inPantryItems.length})
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                (Εξαιρέθηκαν από το κόστος αγορών)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  inPantryItems.forEach((i) => onTogglePantry(i.ingredientId));
                  setNotificationToast("Όλα τα είδη επανήλθαν στη λίστα αγορών");
                }}
                className="text-xs text-primary hover:underline h-7"
                title="Επαναφορά όλων των υλικών στη λίστα αγορών"
              >
                Επαναφορά όλων
              </Button>
            </div>
          </div>
          <div className="mt-2.5 divide-y divide-border/40">
            {inPantryItems.map((item) => (
              <div
                key={`pantry-drawer-${item.ingredientId}`}
                className="py-2 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <span className="text-muted-foreground line-through">{item.ingredientName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    ({item.rawRequiredAmount} {item.rawUnit})
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    🏠 Στην Αποθήκη
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    onTogglePantry(item.ingredientId);
                    setNotificationToast(`«${item.ingredientName}» επανήλθε στη Λίστα Αγορών`);
                  }}
                  className="h-6 text-[11px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <RotateCcw className="size-3" />
                  Επαναφορά
                </Button>
              </div>
            ))}
          </div>
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
            <div className="flex items-center gap-2">
              {onClearExcludedPermanently && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onClearExcludedPermanently}
                  className="text-xs text-rose-600 hover:bg-rose-500/10 h-7"
                  title="Οριστική διαγραφή όλων των εξαιρεμένων ειδών"
                >
                  Οριστικός Καθαρισμός
                </Button>
              )}
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
            setNotificationToast(`Επιλέχθηκε συσκευασία: ${newOption.packCount} × ${newOption.packSize} ${newOption.packUnit} (${newOption.retailerName})`);
            setSelectedItemForModal(null);
          }}
          onSelectNewProduct={(newProduct, newOption) => {
            if (onCurateProduct) {
              onCurateProduct(selectedItemForModal.ingredientId, newProduct);
            }
            if (newOption) {
              onUpdateItemOption(selectedItemForModal.ingredientId, newOption);
            }
            setNotificationToast(`Το προϊόν άλλαξε σε: ${newProduct.name}`);
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

      {/* Reset & Clean Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="size-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Καθαρισμός &amp; Επαναφορά Λίστας
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="size-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Επιλέξτε τον τρόπο με τον οποίο επιθυμείτε να επαναφέρετε τη λίστα αγορών σας:
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Clean bundles & uncheck items, keep meal plan slots */}
              <button
                type="button"
                id="btn-confirm-clear-bundles"
                onClick={() => {
                  if (onClearGroceryList) onClearGroceryList({ clearSlots: false });
                  setIsResetModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all space-y-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary">
                    1. Καθαρισμός Πακέτων &amp; Επαναφορά Τικ
                  </span>
                  <RotateCcw className="size-3.5 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Αφαιρεί τα πρόσθετα πακέτα καθαριότητας &amp; βρεφικών, ξε-τικάρει όλα τα αγορασμένα είδη και διατηρεί τα εβδομαδιαία γεύματά σας.
                </p>
              </button>

              {/* Option 2: Full reset everything */}
              <button
                type="button"
                id="btn-confirm-reset-all"
                onClick={() => {
                  if (onClearGroceryList) onClearGroceryList({ clearSlots: true });
                  setIsResetModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/5 transition-all space-y-1 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    2. Πλήρης Επαναφορά Όλων (Γεύματα &amp; Λίστα)
                  </span>
                  <Trash2 className="size-3.5 text-rose-500" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Καθαρίζει ολόκληρο το εβδομαδιαίο πλάνο γευμάτων και αδειάζει πλήρως τη λίστα αγορών για νέο ξεκίνημα.
                </p>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Ακύρωση
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Bulk Action Bar */}
      {isBulkMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-3.5 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {selectedBulkIds.length} από {activeItems.length} επιλεγμένα
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleSelectAll}
              className="text-xs text-muted-foreground hover:text-foreground h-8"
            >
              {selectedBulkIds.length === activeItems.length && activeItems.length > 0
                ? "Αποεπιλογή"
                : "Επιλογή Όλων"}
            </Button>
            <Button
              variant="default"
              size="xs"
              disabled={selectedBulkIds.length === 0}
              onClick={handleDeleteSelected}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-8 gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              <span>Διαγραφή ({selectedBulkIds.length})</span>
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setIsBulkMode(false);
                setSelectedBulkIds([]);
              }}
              className="text-xs h-8"
              title="Κλείσιμο λειτουργίας μαζικής επιλογής"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Undo Toast */}
      {undoToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-card text-card-foreground border border-border/80 shadow-2xl rounded-2xl p-3.5 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="size-3.5" />
            </div>
            <p className="text-xs font-medium truncate text-foreground">
              {undoToast.message}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="btn-undo-toast"
              onClick={handleUndo}
              className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <RotateCcw className="size-3" />
              <span>Αναίρεση</span>
            </button>
            <button
              type="button"
              onClick={() => setUndoToast(null)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md bg-foreground text-background shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200 text-xs font-semibold">
          <Sparkles className="size-4 text-amber-400 shrink-0" />
          <span className="truncate">{notificationToast}</span>
          <button
            type="button"
            onClick={() => setNotificationToast(null)}
            className="p-1 rounded-lg hover:bg-background/20 transition-colors ml-auto cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
