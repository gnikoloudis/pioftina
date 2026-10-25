"use client";

import React, { useState, useEffect } from "react";
import { OptimizedGroceryItem, PackOption } from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
import { searchProducts } from "@/lib/posokanei/client";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";
import { evaluatePackOptions } from "@/lib/optimizer/packaging";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  X,
  Check,
  Package,
  Sparkles,
  Search,
  Loader2,
  Store,
  ArrowRight,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackSelectorModalProps {
  item: OptimizedGroceryItem | null;
  onClose: () => void;
  onSelectOption: (option: PackOption) => void;
  onSelectNewProduct?: (product: Product, option?: PackOption) => void;
  preferredSupermarkets?: string[];
}

// Clean helper to extract a meaningful search keyword from ingredient/product name
function extractSearchKeyword(item: OptimizedGroceryItem): string {
  // If posokaneiQuery is simple, use it
  if (item.ingredientId && !item.ingredientId.startsWith("bundle-") && !item.ingredientId.includes("-")) {
    return item.ingredientId.trim();
  }

  const raw = item.ingredientName || "";
  // Remove parenthesized words like (Δωδώνη), (Άλτις), (500g), etc.
  const cleaned = raw.replace(/\(.*?\)/g, "").trim();

  // If cleaned is still long, take the primary keyword
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length > 0) {
    // If first word is descriptive (π.χ. "Εξαιρετικό", "Φρέσκο"), keep up to 2 words
    if (words[0].length <= 2 && words.length > 1) {
      return `${words[0]} ${words[1]}`;
    }
    return words.slice(0, 2).join(" ");
  }

  return raw.slice(0, 15);
}

export function PackSelectorModal({
  item,
  onClose,
  onSelectOption,
  onSelectNewProduct,
  preferredSupermarkets = [],
}: PackSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<"search" | "packs">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pack sizes for current product
  const allAvailablePacks = item
    ? [
        ...(item.selectedOption ? [item.selectedOption] : []),
        ...item.alternativeOptions,
      ]
    : [];

  // When modal opens, initialize search query with clean keyword and search
  useEffect(() => {
    if (item) {
      const keyword = extractSearchKeyword(item);
      setSearchQuery(keyword);
      executeSearch(keyword);
    }
  }, [item]);

  // Debounced live search when user modifies the search query
  useEffect(() => {
    if (!item || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 320);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!item) return null;

  async function executeSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // 1. Live search via posokanei client API
      const apiRes = await searchProducts({
        title: q,
        page: 1,
        page_size: 24,
        sort_by: "name",
        sort_order: "asc",
      });

      const candidates: Product[] = apiRes.products || [];

      // 2. Also search fallback mock catalog for fast instant results
      const mockMatches = MOCK_FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );

      // Merge and deduplicate by id / name
      const merged: Product[] = [...candidates];
      for (const m of mockMatches) {
        if (!merged.some((p) => p.id === m.id || p.name.toLowerCase() === m.name.toLowerCase())) {
          merged.push(m);
        }
      }

      setSearchResults(merged);
    } catch (err) {
      console.warn("Posokanei search error, falling back to local database:", err);
      const fallback = MOCK_FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      setSearchResults(fallback);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter search results by selected supermarket
  const filteredProducts = searchResults.filter((p) => {
    if (selectedSupermarket === "all") return true;
    return (
      p.retailers?.includes(selectedSupermarket) ||
      p.retailer_prices?.some((rp) => rp.retailer === selectedSupermarket)
    );
  });

  const handleSelectProduct = (product: Product) => {
    // Generate optimal pack options for the new product matching the needed quantity
    const requiredAmount = item.normalizedRequiredAmount || item.rawRequiredAmount || 1;
    const options = evaluatePackOptions(product, requiredAmount, preferredSupermarkets);
    const bestOption = options[0];

    if (onSelectNewProduct) {
      onSelectNewProduct(product, bestOption);
    } else if (bestOption) {
      onSelectOption(bestOption);
    }
    onClose();
  };

  const currentProductId = item.selectedOption?.product.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2 font-heading">
                <Package className="size-5 text-primary shrink-0" />
                <span className="truncate">Αλλαγή Προϊόντος &amp; Συσκευασίας</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Τρέχον: <span className="font-semibold text-foreground">{item.ingredientName}</span> &bull; Ανάγκη:{" "}
                <span className="font-semibold text-foreground">
                  {item.rawRequiredAmount} {item.rawUnit}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors shrink-0"
              title="Κλείσιμο"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Segmented Mode Tabs */}
          <div className="flex items-center gap-1.5 mt-3 p-1 rounded-xl bg-background border border-border">
            <button
              type="button"
              id="tab-btn-search-product"
              onClick={() => setActiveTab("search")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "search"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Search className="size-3.5" />
              <span>Αναζήτηση Παρόμοιου Προϊόντος</span>
            </button>

            <button
              type="button"
              id="tab-btn-pack-sizes"
              onClick={() => setActiveTab("packs")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "packs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Μεγέθη &amp; Συσκευασίες ({allAvailablePacks.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Search Similar Products */}
        {activeTab === "search" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search Controls Bar */}
            <div className="p-3 sm:p-4 border-b border-border bg-card/50 space-y-2.5 shrink-0">
              {/* Search input with quick clear */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  id="input-product-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Αναζητήστε μάρκα ή παρόμοιο προϊόν (π.χ. Φέτα, Ελαιόλαδο, Γιαούρτι)..."
                  className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full"
                    title="Καθαρισμός αναζήτησης"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Supermarket Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
                  <Store className="size-3" /> Κατάστημα:
                </span>
                {[
                  { id: "all", label: "Όλα" },
                  { id: "sklavenitis", label: "Σκλαβενίτης" },
                  { id: "ab_vasilopoulos", label: "ΑΒ" },
                  { id: "lidl", label: "Lidl" },
                  { id: "mymarket", label: "My Market" },
                  { id: "masoutis", label: "Μασούτης" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSupermarket(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedSupermarket === s.id
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
              {isLoading && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs font-medium">Αναζήτηση προϊόντων στα σούπερ μάρκετ...</span>
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && hasSearched && (
                <div className="py-12 text-center space-y-2">
                  <Package className="size-8 mx-auto text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">Δεν βρέθηκαν προϊόντα</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Δοκιμάστε να αναζητήσετε με γενικότερο όρο (π.χ. "τυρί", "λάδι", "γάλα") ή επιλέξτε "Όλα" στα καταστήματα.
                  </p>
                </div>
              )}

              {!isLoading &&
                filteredProducts.map((prod) => {
                  const isCurrent = prod.id === currentProductId;
                  const lowestPrice =
                    prod.price_stats?.min_price ||
                    prod.retailer_prices?.[0]?.price ||
                    2.5;
                  const unitPrice =
                    prod.price_stats?.min_unit_price ||
                    prod.retailer_prices?.[0]?.price_normalized ||
                    lowestPrice;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-primary/5 border-primary ring-1 ring-primary/40 shadow-xs"
                          : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Badges / Brand */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {prod.retailer_prices && prod.retailer_prices.length > 0 ? (
                            prod.retailer_prices.slice(0, 3).map((rp, i) => (
                              <SupermarketBadge key={`${rp.retailer}-${i}`} retailerId={rp.retailer} size="sm" />
                            ))
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              {prod.brand || "Supermarket"}
                            </span>
                          )}

                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                              <Check className="size-2.5" /> Τρέχουσα Επιλογή
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <div className="font-semibold text-xs sm:text-sm text-foreground leading-snug">
                          {prod.name}
                        </div>

                        {/* Details (Unit, Brand, Category) */}
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span>
                            Συσκευασία: <strong className="text-foreground">{prod.unit_quantity} {prod.unit || "kg"}</strong>
                          </span>
                          <span>&bull;</span>
                          <span>€{unitPrice.toFixed(2)}/{prod.unit || "kg"}</span>
                          {prod.brand && (
                            <>
                              <span>&bull;</span>
                              <span className="text-muted-foreground">{prod.brand}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Price & Select Button */}
                      <div className="text-right shrink-0 flex flex-col items-end justify-center gap-1.5">
                        <div className="text-base sm:text-lg font-black text-foreground">
                          €{lowestPrice.toFixed(2)}
                        </div>

                        <Button
                          variant={isCurrent ? "secondary" : "default"}
                          size="xs"
                          className="text-xs h-7 gap-1 font-semibold"
                        >
                          {isCurrent ? (
                            <>
                              <Check className="size-3" />
                              <span>Επιλεγμένο</span>
                            </>
                          ) : (
                            <>
                              <span>Επιλογή</span>
                              <ArrowRight className="size-3" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 2: Alternative Packaging Sizes for Current Product */}
        {activeTab === "packs" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {allAvailablePacks.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-muted-foreground">
                <Layers className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-sm font-semibold text-foreground">Δεν υπάρχουν άλλα μεγέθη</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Το συγκεκριμένο προϊόν δεν διαθέτει άλλες καταχωρημένες συσκευασίες. Χρησιμοποιήστε την καρτέλα "Αναζήτηση" για να βρείτε παρόμοιο προϊόν άλλης μάρκας.
                </p>
              </div>
            ) : (
              allAvailablePacks.map((opt, idx) => {
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
                      <div
                        className={`text-base font-bold ${
                          opt.isSynthetic ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                        }`}
                      >
                        {opt.isSynthetic ? `~€${opt.totalPrice.toFixed(2)}` : `€${opt.totalPrice.toFixed(2)}`}
                      </div>
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
        )}
      </div>
    </div>
  );
}

