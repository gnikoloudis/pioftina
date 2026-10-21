"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/posokanei/types";
import { AisleCategory, AISLE_CATEGORIES } from "@/types/meal-planner";
import { searchProducts } from "@/lib/posokanei/client";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";
import { getCuratedDefaultProduct } from "@/lib/recipes/curated-products";
import { detectCategory, extractPosokaneiQuery } from "@/lib/agent/recipe-collector";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  X,
  Search,
  CheckCircle2,
  Package,
  Sparkles,
  Loader2,
  Store,
  Plus,
  ArrowRight,
  RotateCcw,
  ChefHat,
  Tag,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AddIngredientResult {
  name: string;
  amount: number;
  unit: "g" | "kg" | "ml" | "l" | "L" | "τεμ";
  category: AisleCategory;
  posokaneiQuery: string;
  product?: Product;
  notes?: string;
}

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeTitle: string;
  onAddIngredient: (result: AddIngredientResult) => void;
}

interface CategoryChip {
  id: string;
  label: string;
  keywords: string[];
}

const CATEGORY_CHIPS: CategoryChip[] = [
  { id: "all", label: "Όλα", keywords: [] },
  { id: "dairy", label: "🧀 Τυριά & Γαλακτοκομικά", keywords: ["τυρ", "γαλακτ", "τυρί", "γάλα", "γιαούρτ", "βούτυρ", "dairy", "cheese"] },
  { id: "produce", label: "🥬 Μαναβική & Φρούτα", keywords: ["μαναβ", "οπωρ", "φρούτ", "λαχαν", "ντομάτ", "πατάτ", "produce"] },
  { id: "meat", label: "🥩 Κρεοπωλείο & Πουλερικά", keywords: ["κρε", "πουλερ", "κοτόπουλ", "μοσχάρ", "χοιριν", "κιμάς", "meat"] },
  { id: "seafood", label: "🐟 Ψάρια & Θαλασσινά", keywords: ["ψαρ", "θαλασσ", "σολομ", "τόνος", "fish", "seafood"] },
  { id: "pantry", label: "🥫 Παντοπωλείο & Ζυμαρικά", keywords: ["παντοπ", "τροφιμ", "ζυμαρικ", "ρύζι", "όσπρι", "σάλτσ", "κονσέρβ", "pantry"] },
  { id: "bakery", label: "🥖 Αρτοσκευάσματα & Πίτες", keywords: ["αρτ", "ψωμί", "πίτα", "πίτες", "παξιμάδ", "φρυγανι", "bakery"] },
  { id: "oils", label: "🫒 Έλαια & Σάλτσες", keywords: ["έλαι", "ελαιόλαδ", "λάδι", "ξύδι", "μουστάρδ", "σαλτσ", "oil"] },
  { id: "frozen", label: "❄️ Κατεψυγμένα", keywords: ["κατεψυγ", "κατάψυξ", "frozen"] },
];

export function AddIngredientModal({
  isOpen,
  onClose,
  recipeTitle,
  onAddIngredient,
}: AddIngredientModalProps) {
  const [mode, setMode] = useState<"search" | "manual">("search");

  // Tab 1: Search & Import State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Portion configuration for selected product
  const [importName, setImportName] = useState("");
  const [importAmount, setImportAmount] = useState<number>(200);
  const [importUnit, setImportUnit] = useState<"g" | "kg" | "ml" | "l" | "L" | "τεμ">("g");
  const [importCategory, setImportCategory] = useState<AisleCategory>("pantry");
  const [importQuery, setImportQuery] = useState("");

  // Tab 2: Manual Form State
  const [manualName, setManualName] = useState("");
  const [manualAmount, setManualAmount] = useState<number>(100);
  const [manualUnit, setManualUnit] = useState<"g" | "kg" | "ml" | "l" | "L" | "τεμ">("g");
  const [manualCategory, setManualCategory] = useState<AisleCategory>("pantry");
  const [manualQuery, setManualQuery] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualTouchedQuery, setManualTouchedQuery] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Suggested product preview for manual entry
  const [matchedCuratedPreview, setMatchedCuratedPreview] = useState<Product | null>(null);

  // Initial load / reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode("search");
      setSearchQuery("");
      setSelectedCategory("all");
      setSelectedProduct(null);
      setManualName("");
      setManualAmount(100);
      setManualUnit("g");
      setManualCategory("pantry");
      setManualQuery("");
      setManualNotes("");
      setManualTouchedQuery(false);
      setValidationError(null);
      setMatchedCuratedPreview(null);
      // Pre-load common products or run empty search
      executeSearch("", "all");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Execute Search for Supermarket Products
  async function executeSearch(query: string, category: string) {
    setIsLoading(true);
    try {
      const q = query.trim().toLowerCase();
      let candidateProducts: Product[] = [];

      if (q) {
        try {
          const apiRes = await searchProducts({
            title: q,
            page: 1,
            page_size: 20,
            sort_by: "name",
            sort_order: "asc",
          });
          if (apiRes?.products) {
            candidateProducts = apiRes.products;
          }
        } catch (_) {}
      }

      // Merge with curated / fallback catalog
      const mockMatches = MOCK_FALLBACK_PRODUCTS.filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });

      const combined = [...candidateProducts];
      for (const m of mockMatches) {
        if (!combined.some((c) => c.id === m.id || c.name === m.name)) {
          combined.push(m);
        }
      }

      // Apply category filter
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
      setResults(MOCK_FALLBACK_PRODUCTS.slice(0, 15));
    } finally {
      setIsLoading(false);
    }
  }

  // Handle selection of product from search
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setImportName(product.name);

    // Normalize unit and quantity
    const pUnit = (product.unit || "g").toLowerCase();
    let normUnit: "g" | "kg" | "ml" | "l" | "L" | "τεμ" = "g";
    if (pUnit.includes("ml") || pUnit.includes("χιλιοστόλιτρα")) {
      normUnit = "ml";
    } else if (pUnit.includes("kg") || pUnit.includes("κιλ")) {
      normUnit = "kg";
    } else if (pUnit.includes("l") || pUnit.includes("λίτρ")) {
      normUnit = "L";
    } else if (pUnit.includes("τεμ") || pUnit.includes("pcs") || pUnit.includes("piece")) {
      normUnit = "τεμ";
    } else {
      normUnit = "g";
    }

    setImportUnit(normUnit);
    setImportAmount(product.unit_quantity || (normUnit === "g" ? 200 : 1));
    setImportCategory(detectCategory(product.name));
    setImportQuery(extractPosokaneiQuery(product.name));
  };

  // Submit Search & Import
  const handleConfirmImport = () => {
    if (!selectedProduct) return;
    if (!importName.trim()) {
      setValidationError("Παρακαλούμε εισάγετε όνομα υλικού.");
      return;
    }
    if (importAmount <= 0) {
      setValidationError("Η ποσότητα πρέπει να είναι μεγαλύτερη από 0.");
      return;
    }

    onAddIngredient({
      name: importName.trim(),
      amount: importAmount,
      unit: importUnit,
      category: importCategory,
      posokaneiQuery: importQuery.trim() || extractPosokaneiQuery(importName),
      product: selectedProduct,
    });
    onClose();
  };

  // Handle Manual Name Change with Auto-Detection
  const handleManualNameChange = (val: string) => {
    setManualName(val);
    setValidationError(null);

    if (val.trim()) {
      // Auto-detect category
      const detectedCat = detectCategory(val);
      setManualCategory(detectedCat);

      // Auto-detect posokanei query if user hasn't explicitly edited it
      if (!manualTouchedQuery) {
        const query = extractPosokaneiQuery(val);
        setManualQuery(query);

        // Check for matching curated product preview
        const found = getCuratedDefaultProduct(query) || getCuratedDefaultProduct(val);
        setMatchedCuratedPreview(found || null);
      }
    } else {
      setMatchedCuratedPreview(null);
    }
  };

  // Submit Manual Entry
  const handleConfirmManual = () => {
    if (!manualName.trim()) {
      setValidationError("Παρακαλούμε εισάγετε το όνομα του υλικού.");
      return;
    }
    if (!manualAmount || manualAmount <= 0) {
      setValidationError("Παρακαλούμε εισάγετε έγκυρη ποσότητα (> 0).");
      return;
    }

    const query = manualQuery.trim() || extractPosokaneiQuery(manualName);
    const matchedProduct = matchedCuratedPreview || getCuratedDefaultProduct(query) || undefined;

    onAddIngredient({
      name: manualName.trim(),
      amount: Number(manualAmount),
      unit: manualUnit,
      category: manualCategory,
      posokaneiQuery: query,
      product: matchedProduct,
      notes: manualNotes.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Plus className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-foreground truncate">
                Προσθήκη Υλικού στη Συνταγή
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {recipeTitle ? `Συνταγή: ${recipeTitle}` : "Επιλογή υλικού ή εισαγωγή supermarket"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors shrink-0"
            title="Κλείσιμο"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border bg-muted/20 p-2 gap-2">
          <button
            onClick={() => {
              setMode("search");
              setValidationError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              mode === "search"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Search className="size-4" />
            <span>Αναζήτηση Προϊόντος Supermarket</span>
          </button>

          <button
            onClick={() => {
              setMode("manual");
              setValidationError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              mode === "manual"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Tag className="size-4" />
            <span>Χειροκίνητη Συμπλήρωση</span>
          </button>
        </div>

        {/* Error notification banner if any */}
        {validationError && (
          <div className="px-6 py-2 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Body content based on active mode */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {mode === "search" ? (
            /* TAB 1: Search & Import */
            !selectedProduct ? (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery(val);
                      executeSearch(val, selectedCategory);
                    }}
                    placeholder="Αναζητήστε προϊόν supermarket (π.χ. φέτα Δωδώνη, κιμάς, Barilla)..."
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        executeSearch("", selectedCategory);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Chips Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORY_CHIPS.map((chip) => {
                    const active = selectedCategory === chip.id;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => {
                          setSelectedCategory(chip.id);
                          executeSearch(searchQuery, chip.id);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors font-medium shrink-0 ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search Results List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>
                      {isLoading
                        ? "Αναζήτηση στο Παρατηρητήριο Τιμών..."
                        : `${results.length} προϊόντα βρέθηκαν`}
                    </span>
                    {isLoading && <Loader2 className="size-3.5 animate-spin text-primary" />}
                  </div>

                  <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card max-h-[340px] overflow-y-auto">
                    {results.length === 0 && !isLoading ? (
                      <div className="p-8 text-center text-muted-foreground space-y-2">
                        <Package className="size-8 mx-auto opacity-30" />
                        <p className="text-xs">Δεν βρέθηκαν προϊόντα με αυτά τα κριτήρια.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setManualName(searchQuery);
                            handleManualNameChange(searchQuery);
                            setMode("manual");
                          }}
                          className="text-xs mt-2 gap-1.5"
                        >
                          <Plus className="size-3.5" />
                          Προσθήκη χειροκίνητα
                        </Button>
                      </div>
                    ) : (
                      results.map((product) => {
                        const minPrice = product.price_stats?.min_price;
                        return (
                          <div
                            key={product.id}
                            className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors cursor-pointer group"
                            onClick={() => handleSelectProduct(product)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="size-11 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
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
                                <p className="font-semibold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                                  {product.brand && <span className="font-medium">{product.brand}</span>}
                                  <span>&bull;</span>
                                  <span>
                                    {product.unit_quantity} {product.unit}
                                  </span>
                                  {minPrice && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="font-bold text-foreground">
                                        από €{minPrice.toFixed(2)}
                                      </span>
                                    </>
                                  )}
                                  {product.retailers && (
                                    <div className="flex items-center gap-1 ml-1">
                                      {product.retailers.slice(0, 3).map((r) => (
                                        <SupermarketBadge key={r} retailerId={r} size="sm" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectProduct(product);
                              }}
                              className="text-xs shrink-0 gap-1 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                            >
                              <span>Επιλογή</span>
                              <ArrowRight className="size-3" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Product Selected: Customize Portion & Confirm */
              <div className="space-y-5 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckCircle2 className="size-4" /> Επιλεγμένο Προϊόν Supermarket
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-xs text-muted-foreground hover:text-foreground underline flex items-center gap-1"
                    >
                      <RotateCcw className="size-3" /> Αλλαγή προϊόντος
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {selectedProduct.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedProduct.image_url}
                          alt={selectedProduct.name}
                          className="size-full object-contain p-1"
                        />
                      ) : (
                        <Package className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {selectedProduct.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedProduct.brand} &bull; Συσκευασία: {selectedProduct.unit_quantity}{" "}
                        {selectedProduct.unit}
                        {selectedProduct.price_stats?.min_price &&
                          ` &bull; από €${selectedProduct.price_stats.min_price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recipe Ingredient Configuration */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ρύθμιση Ποσότητας στη Συνταγή
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Όνομα Υλικού στη Συνταγή
                    </label>
                    <input
                      type="text"
                      value={importName}
                      onChange={(e) => setImportName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Amount & Unit */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Ποσότητα Συνταγής
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setImportAmount((prev) =>
                                Math.max(1, prev - (importUnit === "g" ? 50 : 1))
                              )
                            }
                            className="size-8 rounded-lg bg-muted border border-border text-xs font-bold hover:bg-muted/80 flex items-center justify-center shrink-0"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={importAmount}
                            onChange={(e) => setImportAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                            className="w-20 px-2 py-1.5 text-center font-bold text-xs sm:text-sm rounded-lg border border-border bg-background"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImportAmount((prev) => prev + (importUnit === "g" ? 50 : 1))
                            }
                            className="size-8 rounded-lg bg-muted border border-border text-xs font-bold hover:bg-muted/80 flex items-center justify-center shrink-0"
                          >
                            +
                          </button>
                        </div>

                        <select
                          value={importUnit}
                          onChange={(e) => setImportUnit(e.target.value as any)}
                          className="flex-1 text-xs py-2 px-2.5 rounded-lg border border-border bg-background font-medium"
                        >
                          <option value="g">g (γραμμάρια)</option>
                          <option value="kg">kg (κιλά)</option>
                          <option value="ml">ml (χιλιοστόλιτρα)</option>
                          <option value="L">L (λίτρα)</option>
                          <option value="τεμ">τεμ (τεμάχια)</option>
                        </select>
                      </div>
                    </div>

                    {/* Aisle Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Κατηγορία Διαδρόμου Supermarket
                      </label>
                      <select
                        value={importCategory}
                        onChange={(e) => setImportCategory(e.target.value as AisleCategory)}
                        className="w-full text-xs py-2 px-3 rounded-xl border border-border bg-background font-medium"
                      >
                        {Object.entries(AISLE_CATEGORIES).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.icon} {cat.nameEl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Όρος Αναζήτησης Supermarket (posokanei query)</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        Για αυτόματη εύρεση τιμών
                      </span>
                    </label>
                    <input
                      type="text"
                      value={importQuery}
                      onChange={(e) => setImportQuery(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Import Confirmation Button */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                    className="text-xs"
                  >
                    Πίσω στα αποτελέσματα
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirmImport}
                    className="text-xs gap-1.5 font-bold px-4"
                  >
                    <Plus className="size-4" />
                    Εισαγωγή στη Συνταγή
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* TAB 2: Manual Add */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>Όνομα Υλικού</span>
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => handleManualNameChange(e.target.value)}
                  placeholder="π.χ. Φρέσκο κρεμμυδάκι, Μοσχαρίσια σπάλα, Ελαιόλαδο..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium shadow-xs"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount & Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>Ποσότητα &amp; Μονάδα</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(parseFloat(e.target.value) || 0)}
                      min="1"
                      className="w-24 px-3 py-2 font-bold text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-center"
                    />
                    <select
                      value={manualUnit}
                      onChange={(e) => setManualUnit(e.target.value as any)}
                      className="flex-1 text-xs py-2 px-3 rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="g">g (γραμμάρια)</option>
                      <option value="kg">kg (κιλά)</option>
                      <option value="ml">ml (χιλιοστόλιτρα)</option>
                      <option value="L">L (λίτρα)</option>
                      <option value="τεμ">τεμ (τεμάχια)</option>
                    </select>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Κατηγορία Διαδρόμου Supermarket
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as AisleCategory)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {Object.entries(AISLE_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.icon} {cat.nameEl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Posokanei Query */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Όρος Αναζήτησης Supermarket (posokanei.gov.gr)
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Αυτόματη εξαγωγή
                  </span>
                </div>
                <input
                  type="text"
                  value={manualQuery}
                  onChange={(e) => {
                    setManualQuery(e.target.value);
                    setManualTouchedQuery(true);
                  }}
                  placeholder="π.χ. κρεμμύδι, κιμάς, ελαιόλαδο..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Notes / Preparation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Σημειώσεις / Προετοιμασία (προαιρετικό)
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="π.χ. ψιλοκομμένο, σε κυβάκια, καθαρισμένο..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Curated Product Match Hint if any */}
              {matchedCuratedPreview && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">
                      <strong>Βρέθηκε αντιστοίχιση Supermarket:</strong>{" "}
                      {matchedCuratedPreview.name}
                      {matchedCuratedPreview.price_stats?.min_price &&
                        ` (€${matchedCuratedPreview.price_stats.min_price.toFixed(2)})`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white shrink-0">
                    Auto-Linked
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                  Άκυρο
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmManual}
                  className="text-xs gap-1.5 font-bold px-4"
                >
                  <Plus className="size-4" />
                  Προσθήκη στη Συνταγή
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
