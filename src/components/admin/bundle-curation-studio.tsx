"use client";

import React, { useState, useEffect } from "react";
import { ProductBundle, BundleItem, BundleCategory, BundleCadence } from "@/types/bundles";
import { Product } from "@/lib/posokanei/types";
import { searchProducts } from "@/lib/posokanei/client";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";
import { BundleEmojiPicker } from "@/components/admin/bundle-emoji-picker";
import {
  Shield,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Package,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BundleCurationStudioProps {
  onBackToApp: () => void;
  initialEditBundle?: ProductBundle | null;
}

export function BundleCurationStudio({
  onBackToApp,
  initialEditBundle,
}: BundleCurationStudioProps) {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active bundle being edited
  const [activeBundle, setActiveBundle] = useState<ProductBundle>(() => {
    if (initialEditBundle) return initialEditBundle;
    return createEmptyBundle("cleaning");
  });

  // Product search state for adding items
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  function createEmptyBundle(category: BundleCategory): ProductBundle {
    return {
      id: `bundle-${category}-new`,
      category,
      title: "",
      slug: `bundle-${category}-new`,
      description: "",
      badge: "Best Value",
      icon: category === "cleaning" ? "🧼" : "👶",
      cadence: "monthly",
      cadenceLabel: "Μηνιαίο Πακέτο",
      items: [],
      estimatedTotalEur: 0,
      estimatedSavingsEur: 0,
      bestStoreId: "sklavenitis",
      bestStoreName: "Σκλαβενίτης",
      isPublished: true,
      createdAt: "2026-10-24T00:00:00.000Z",
      updatedAt: "2026-10-24T00:00:00.000Z",
    };
  }

  const loadAllBundles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bundles?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.bundles)) {
        setBundles(data.bundles);
      }
    } catch (e) {
      console.error("Failed to load bundles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllBundles();
  }, []);

  useEffect(() => {
    if (initialEditBundle) {
      setActiveBundle(initialEditBundle);
    }
  }, [initialEditBundle]);

  // Posokanei search for product items
  useEffect(() => {
    if (!productSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = productSearch.trim().toLowerCase();

        // 1. Search via client (which hits /api/posokanei/search with fallback)
        const apiRes = await searchProducts({
          title: productSearch.trim(),
          page_size: 15,
        });
        const apiProducts = apiRes.products || [];

        // 2. Also search MOCK_FALLBACK_PRODUCTS (which includes all 18 cleaning & baby products)
        const mockMatches = MOCK_FALLBACK_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.brand && p.brand.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query))
        );

        // Merge and deduplicate by ID or name
        const combined = [...apiProducts];
        for (const m of mockMatches) {
          if (!combined.some((c) => c.id === m.id || c.name === m.name)) {
            combined.push(m);
          }
        }

        setSearchResults(combined.slice(0, 10));
      } catch (e) {
        console.error("Failed to search products:", e);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [productSearch]);

  const handleAddItemFromProduct = (prod: Product) => {
    const minPrice = prod.price_stats?.min_price || 3.0;
    const newItem: BundleItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: prod.name,
      brand: prod.brand || "Επώνυμο",
      categoryTag: prod.category || activeBundle.category,
      quantity: 1,
      unitLabel: `${prod.unit_quantity || 1} ${prod.unit || "τεμ"}`,
      posokaneiQuery: prod.name,
      referencePriceEur: minPrice,
      productId: prod.id,
      curatedProduct: prod,
    };

    setActiveBundle((prev) => {
      const updatedItems = [...prev.items, newItem];
      const sum = updatedItems.reduce((acc, i) => acc + i.referencePriceEur * i.quantity, 0);
      return {
        ...prev,
        items: updatedItems,
        estimatedTotalEur: Math.round(sum * 100) / 100,
      };
    });

    setProductSearch("");
    setSearchResults([]);
  };

  const handleRemoveItem = (itemId: string) => {
    setActiveBundle((prev) => {
      const updatedItems = prev.items.filter((i) => i.id !== itemId);
      const sum = updatedItems.reduce((acc, i) => acc + i.referencePriceEur * i.quantity, 0);
      return {
        ...prev,
        items: updatedItems,
        estimatedTotalEur: Math.round(sum * 100) / 100,
      };
    });
  };

  const handleUpdateItemQty = (itemId: string, qty: number) => {
    setActiveBundle((prev) => {
      const updatedItems = prev.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i
      );
      const sum = updatedItems.reduce((acc, i) => acc + i.referencePriceEur * i.quantity, 0);
      return {
        ...prev,
        items: updatedItems,
        estimatedTotalEur: Math.round(sum * 100) / 100,
      };
    });
  };

  const handleSaveBundle = async () => {
    if (!activeBundle.title.trim()) {
      setErrorMsg("Παρακαλώ συμπληρώστε τίτλο πακέτου.");
      return;
    }
    if (activeBundle.items.length === 0) {
      setErrorMsg("Παρακαλώ προσθέστε τουλάχιστον ένα προϊόν στο πακέτο.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: activeBundle }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Αποτυχία αποθήκευσης");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      await loadAllBundles();
    } catch (err: any) {
      setErrorMsg(err.message || "Σφάλμα αποθήκευσης");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm("Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το πακέτο;")) return;
    try {
      const res = await fetch(`/api/bundles?id=${bundleId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBundles(bundles.filter((b) => b.id !== bundleId));
        if (activeBundle.id === bundleId) {
          setActiveBundle(createEmptyBundle("cleaning"));
        }
      }
    } catch (e) {
      console.error("Failed to delete bundle:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Studio Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToApp}
            className="rounded-xl gap-1 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Επιστροφή</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Bundle Curation Studio • Διαχείριση Πακέτων
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                <Shield className="size-3" /> Admin Auth
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Δημιουργία, επιμέλεια και δημοσίευση πακέτων για το Clean Planner &amp; Baby Care
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveBundle(createEmptyBundle("cleaning"))}
            className="rounded-xl text-xs gap-1"
          >
            <Plus className="size-3.5" />
            <span>Νέο Πακέτο Καθαριότητας</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveBundle(createEmptyBundle("baby"))}
            className="rounded-xl text-xs gap-1"
          >
            <Plus className="size-3.5" />
            <span>Νέο Βρεφικό Πακέτο</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Bundle Selector & Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Existing Bundles List (4 cols) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
            <span>Υπάρχοντα Πακέτα ({bundles.length})</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadAllBundles}
              className="size-6 p-0 text-muted-foreground"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {bundles.map((b) => (
              <div
                key={b.id}
                onClick={() => setActiveBundle(b)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  activeBundle.id === b.id
                    ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/30"
                    : "bg-muted/30 border-border/70 hover:bg-muted/60 text-muted-foreground"
                }`}
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span>{b.icon}</span>
                    <span className="truncate">{b.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{b.category === "cleaning" ? "Καθαριότητα" : "Βρεφικά"}</span>
                    <span>•</span>
                    <span>{b.items.length} είδη</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">
                      €{b.estimatedTotalEur.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {b.isPublished ? (
                    <span title="Δημοσιευμένο"><Eye className="size-3.5 text-emerald-500" /></span>
                  ) : (
                    <span title="Πρόχειρο"><EyeOff className="size-3.5 text-amber-500" /></span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBundle(b.id);
                    }}
                    className="p-1 hover:text-rose-500 text-muted-foreground"
                    title="Διαγραφή"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bundle Editor Form (8 cols) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {activeBundle.title ? `Επεξεργασία: ${activeBundle.title}` : "Δημιουργία Νέου Πακέτου"}
              </h3>
              <p className="text-xs text-muted-foreground">ID: {activeBundle.id}</p>
            </div>

            {/* Publication Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeBundle.isPublished}
                  onChange={(e) =>
                    setActiveBundle({ ...activeBundle, isPublished: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary/20 size-4"
                />
                <span className={activeBundle.isPublished ? "text-emerald-600" : "text-amber-600"}>
                  {activeBundle.isPublished ? "Δημοσιευμένο στο site" : "Πρόχειρο (Draft)"}
                </span>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
              <XCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Το πακέτο αποθηκεύτηκε και δημοσιεύτηκε επιτυχώς!</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-foreground">Τίτλος Πακέτου</label>
              <input
                type="text"
                value={activeBundle.title}
                onChange={(e) => setActiveBundle({ ...activeBundle, title: e.target.value })}
                placeholder="π.χ. Μηνιαίο Πακέτο Καθαριότητας - 4μελής Οικογένεια"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Ενότητα</label>
              <select
                value={activeBundle.category}
                onChange={(e) => {
                  const cat = e.target.value as BundleCategory;
                  setActiveBundle({
                    ...activeBundle,
                    category: cat,
                    icon: cat === "cleaning" ? "🧼" : "👶",
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border"
              >
                <option value="cleaning">Clean Planner (Καθαριότητα Σπιτιού)</option>
                <option value="baby">Baby Care (Βρεφικά Είδη)</option>
              </select>
            </div>

            {/* Cadence */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Συχνότητα / Τύπος</label>
              <select
                value={activeBundle.cadence}
                onChange={(e) => {
                  const cad = e.target.value as BundleCadence;
                  const labels: Record<BundleCadence, string> = {
                    weekly: "Εβδομαδιαίο",
                    monthly: "Μηνιαίο Πακέτο",
                    quarterly: "Τριμηνιαίο / Bulk",
                    starter: "Starter Kit",
                  };
                  setActiveBundle({
                    ...activeBundle,
                    cadence: cad,
                    cadenceLabel: labels[cad],
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border"
              >
                <option value="monthly">Μηνιαίο (30 Ημερών)</option>
                <option value="quarterly">Τριμηνιαίο (Bulk / Eco)</option>
                <option value="starter">Starter Kit / Νεογέννητο</option>
                <option value="weekly">Εβδομαδιαίο</option>
              </select>
            </div>

            {/* Badge & Icon */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Badge (Ετικέτα)</label>
              <input
                type="text"
                value={activeBundle.badge}
                onChange={(e) => setActiveBundle({ ...activeBundle, badge: e.target.value })}
                placeholder="Best Value / Eco Saver"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border"
              />
            </div>

            {/* Emoji Picker */}
            <div className="sm:col-span-2">
              <BundleEmojiPicker
                value={activeBundle.icon}
                onChange={(emoji) => setActiveBundle({ ...activeBundle, icon: emoji })}
                category={activeBundle.category}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-foreground">Περιγραφή</label>
              <textarea
                rows={2}
                value={activeBundle.description}
                onChange={(e) => setActiveBundle({ ...activeBundle, description: e.target.value })}
                placeholder="Σύντομη περιγραφή για το ποιο κοινό ή ανάγκη καλύπτει το πακέτο..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border"
              />
            </div>
          </div>

          {/* Product Items in Bundle */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package className="size-3.5 text-primary" />
                <span>Προϊόντα Πακέτου ({activeBundle.items.length})</span>
              </h4>
              <span className="text-xs font-bold text-emerald-600">
                Εκτιμώμενο Σύνολο: €{activeBundle.estimatedTotalEur.toFixed(2)}
              </span>
            </div>

            {/* Product Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Αναζήτηση προϊόντος από το posokanei (π.χ. Ariel, Fairy, Pampers, Babylino)..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20"
              />

              {/* Search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-border">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleAddItemFromProduct(prod)}
                      className="p-2.5 hover:bg-muted/60 cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{prod.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {prod.brand} • {prod.category}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-600">
                          από €{prod.price_stats?.min_price?.toFixed(2) || "—"}
                        </span>
                        <div className="text-[10px] text-primary font-medium">+ Προσθήκη</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {activeBundle.items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-xl">
                  Δεν έχουν προστεθεί ακόμη προϊόντα στο πακέτο. Χρησιμοποιήστε την παραπάνω
                  αναζήτηση.
                </p>
              ) : (
                activeBundle.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 truncate">
                      <div className="font-semibold text-foreground truncate">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>{item.unitLabel}</span>
                        <span>•</span>
                        <span>~€{item.referencePriceEur.toFixed(2)}/τεμ</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground">Ποσ:</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItemQty(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-12 px-1.5 py-0.5 rounded border border-border text-center font-bold"
                        />
                      </div>

                      <span className="font-bold text-foreground w-14 text-right">
                        €{(item.referencePriceEur * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1"
                        title="Αφαίρεση"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {activeBundle.items.length} είδη • Εκτιμώμενη τιμή e-Καταναλωτή:{" "}
              <span className="font-bold text-foreground">
                €{activeBundle.estimatedTotalEur.toFixed(2)}
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleSaveBundle}
              disabled={saving}
              className="gap-1.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="size-3.5" />
              <span>{saving ? "Αποθήκευση..." : "Αποθήκευση & Δημοσίευση"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
