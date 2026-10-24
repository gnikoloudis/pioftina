"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/posokanei/types";
import { Ingredient } from "@/types/meal-planner";
import { searchProducts } from "@/lib/posokanei/client";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  X,
  Search,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Loader2,
  Store,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  recipeTitle: string;
  onAssignProduct: (product: Product) => void;
}

interface CategoryChip {
  id: string;
  label: string;
  keywords: string[];
}

const CATEGORY_CHIPS: CategoryChip[] = [
  { id: "all", label: "Όλες οι κατηγορίες", keywords: [] },
  { id: "dairy", label: "🧀 Τυριά & Γαλακτοκομικά", keywords: ["τυρ", "γαλακτ", "τυρί", "γάλα", "γιαούρτ", "βούτυρ", "dairy", "cheese"] },
  { id: "produce", label: "🥬 Μαναβική & Φρούτα", keywords: ["μαναβ", "οπωρ", "φρούτ", "λαχαν", "ντομάτ", "πατάτ", "produce"] },
  { id: "meat", label: "🥩 Κρεοπωλείο & Πουλερικά", keywords: ["κρε", "πουλερ", "κοτόπουλ", "μοσχάρ", "χοιριν", "κιμάς", "meat"] },
  { id: "seafood", label: "🐟 Ψάρια & Θαλασσινά", keywords: ["ψαρ", "θαλασσ", "σολομ", "τόνος", "fish", "seafood"] },
  { id: "pantry", label: "🥫 Παντοπωλείο & Ζυμαρικά", keywords: ["παντοπ", "τροφιμ", "ζυμαρικ", "ρύζι", "όσπρι", "σάλτσ", "κονσέρβ", "pantry"] },
  { id: "bakery", label: "🥖 Αρτοσκευάσματα & Πίτες", keywords: ["αρτ", "ψωμί", "πίτα", "πίτες", "παξιμάδ", "φρυγανι", "bakery"] },
  { id: "oils", label: "🫒 Έλαια & Σάλτσες", keywords: ["έλαι", "ελαιόλαδ", "λάδι", "ξύδι", "μουστάρδ", "σαλτσ", "oil"] },
  { id: "frozen", label: "❄️ Κατεψυγμένα", keywords: ["κατεψυγ", "κατάψυξ", "frozen"] },
];

export function CurateProductModal({
  isOpen,
  onClose,
  ingredient,
  recipeTitle,
  onAssignProduct,
}: CurateProductModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial query when modal opens for an ingredient
  useEffect(() => {
    if (ingredient) {
      const initial = ingredient.posokaneiQuery || ingredient.name;
      setSearchQuery(initial);
      executeSearch(initial, selectedCategory);
    }
  }, [ingredient]);

  // Debounced search on typing (350ms)
  useEffect(() => {
    if (!isOpen || !ingredient || !searchQuery.trim()) return;
    const timer = setTimeout(() => {
      executeSearch(searchQuery, selectedCategory);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  if (!isOpen || !ingredient) return null;

  async function executeSearch(query: string, category: string) {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Search via client proxy
      const apiRes = await searchProducts({
        title: query.trim(),
        page: 1,
        page_size: 20,
        sort_by: "name",
        sort_order: "asc",
      });

      let candidateProducts = apiRes.products || [];

      // 2. Also search fallback / curated products database
      const q = query.toLowerCase().trim();
      const mockMatches = MOCK_FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );

      // Merge and deduplicate by ID or name
      const combined = [...candidateProducts];
      for (const m of mockMatches) {
        if (!combined.some((c) => c.id === m.id || c.name === m.name)) {
          combined.push(m);
        }
      }

      // Filter by category if specified
      let filtered = combined;
      if (category !== "all") {
        const chip = CATEGORY_CHIPS.find((c) => c.id === category);
        if (chip && chip.keywords.length > 0) {
          filtered = combined.filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const name = (p.name || "").toLowerCase();
            return chip.keywords.some(
              (kw) => cat.includes(kw.toLowerCase()) || name.includes(kw.toLowerCase())
            );
          });
        }
      }

      setResults(filtered);
    } catch (err) {
      console.error("Search failed:", err);
      // Fallback to local mock catalog
      const q = query.toLowerCase().trim();
      let localMatches = MOCK_FALLBACK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      if (category !== "all") {
        const chip = CATEGORY_CHIPS.find((c) => c.id === category);
        if (chip && chip.keywords.length > 0) {
          localMatches = localMatches.filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const name = (p.name || "").toLowerCase();
            return chip.keywords.some(
              (kw) => cat.includes(kw.toLowerCase()) || name.includes(kw.toLowerCase())
            );
          });
        }
      }
      setResults(localMatches);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelect = (product: Product) => {
    onAssignProduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Curation Προϊόντος
              </span>
              <h2 className="text-base font-bold text-foreground">
                Αντιστοίχιση Υλικού σε Προϊόν Supermarket
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Συνταγή: <span className="font-semibold text-foreground">{recipeTitle}</span> &bull; Υλικό:{" "}
              <span className="font-bold text-primary">{ingredient.name}</span> ({ingredient.amount} {ingredient.unit})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 border-b border-border bg-card space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch(searchQuery, selectedCategory);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Αναζήτηση προϊόντος στο posokanei.gov.gr (π.χ. φέτα δωδώνη, λεμόνια, γάλα)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/40 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </div>
            <Button type="submit" size="sm" disabled={isLoading} className="rounded-xl px-4">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Αναζήτηση"}
            </Button>
          </form>

          {/* Category Chips - Wrapped and fully visible within max-w-2xl */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(chip.id);
                  executeSearch(searchQuery, chip.id);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === chip.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Supermarket-Agnostic Info Note */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>
            <strong>Σημείωση Curation:</strong> Επιλέγετε το <strong>προϊόν (SKU)</strong> και όχι συγκεκριμένο supermarket. Οι τιμές υπολογίζονται δυναμικά σε όλα τα supermarkets της επιλογής σας.
          </span>
        </div>

        {/* Products Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-border/60">
          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="size-6 animate-spin mx-auto text-primary" />
              <p className="text-xs text-muted-foreground">Αναζήτηση προϊόντων στο Παρατηρητήριο Τιμών...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-muted-foreground">
              <Package className="size-8 mx-auto opacity-50" />
              <p className="text-sm font-medium">Δεν βρέθηκαν προϊόντα με αυτόν τον όρο</p>
              <p className="text-xs">Δοκιμάστε απλούστερη αναζήτηση (π.χ. &quot;φέτα&quot;, &quot;λεμόνια&quot;, &quot;κιμάς&quot;)</p>
            </div>
          ) : (
            results.map((product) => {
              const isCurrentlyCurated =
                ingredient.curatedProduct?.id === product.id ||
                ingredient.curatedProduct?.name === product.name;

              return (
                <div
                  key={product.id}
                  className={`pt-2.5 first:pt-0 p-3 rounded-xl transition-colors flex items-center justify-between gap-4 ${
                    isCurrentlyCurated
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      {product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="size-full object-contain p-0.5"
                        />
                      ) : (
                        <Package className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {product.name}
                        </span>
                        {isCurrentlyCurated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shrink-0">
                            <CheckCircle2 className="size-3" /> Επιλεγμένο
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        {product.brand && (
                          <span className="font-medium text-foreground/80">{product.brand}</span>
                        )}
                        <span>&bull;</span>
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                          {product.category}
                        </span>
                        <span>&bull;</span>
                        <span className="font-semibold text-primary">
                          {product.unit_quantity} {product.unit}
                        </span>
                      </div>

                      {/* Supermarket availability list */}
                      {product.retailers && product.retailers.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-1">
                            <Store className="size-2.5" /> Διαθέσιμο σε:
                          </span>
                          {product.retailers.slice(0, 4).map((r) => (
                            <SupermarketBadge key={r} retailerId={r} size="sm" />
                          ))}
                          {product.retailers.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{product.retailers.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {product.price_stats?.min_price ? (
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">από</span>
                        <span className="font-bold text-sm text-foreground">
                          €{product.price_stats.min_price.toFixed(2)}
                        </span>
                      </div>
                    ) : null}

                    <Button
                      size="sm"
                      variant={isCurrentlyCurated ? "outline" : "default"}
                      onClick={() => handleSelect(product)}
                      className="rounded-xl text-xs font-semibold"
                    >
                      {isCurrentlyCurated ? "Επιβεβαίωση" : "Αντιστοίχιση"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>{results.length} διαθέσιμα προϊόντα</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            Κλείσιμο
          </Button>
        </div>
      </div>
    </div>
  );
}
