"use client";

import React, { useState } from "react";
import {
  PantrySurplusItem,
  OptimizedGroceryItem,
  UserPantryItem,
  AisleCategory,
  AISLE_CATEGORIES,
} from "@/types/meal-planner";
import {
  Sparkles,
  Home,
  RotateCcw,
  Box,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  PackagePlus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PantryItemModal } from "./pantry-item-modal";

interface PantryViewProps {
  surplusItems: PantrySurplusItem[];
  groceryItems: OptimizedGroceryItem[];
  userPantryItems: UserPantryItem[];
  onTogglePantry: (ingredientId: string) => void;
  onAddPantryItem: (item: Omit<UserPantryItem, "id" | "createdAt" | "updatedAt">) => void;
  onUpdatePantryItem: (id: string, updates: Partial<UserPantryItem>) => void;
  onDeletePantryItem: (id: string) => void;
  onAddSurplusToPantry: (surplus: PantrySurplusItem) => void;
}

export function PantryView({
  surplusItems,
  groceryItems,
  userPantryItems = [],
  onTogglePantry,
  onAddPantryItem,
  onUpdatePantryItem,
  onDeletePantryItem,
  onAddSurplusToPantry,
}: PantryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserPantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<"all" | "pantry" | "surplus">("all");
  const [addedSurplusIds, setAddedSurplusIds] = useState<string[]>([]);

  // Filter user pantry items
  const filteredPantryItems = userPantryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter surplus items
  const filteredSurplusItems = surplusItems.filter((item) => {
    const matchesSearch = item.ingredientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: UserPantryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = (itemData: Omit<UserPantryItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingItem) {
      onUpdatePantryItem(editingItem.id, itemData);
    } else {
      onAddPantryItem(itemData);
    }
  };

  const handleQuickAdjust = (item: UserPantryItem, delta: number) => {
    const step = item.unit === "g" || item.unit === "ml" ? 50 : 1;
    const newAmount = Math.max(0.1, Number((item.amount + delta * step).toFixed(2)));
    onUpdatePantryItem(item.id, { amount: newAmount });
  };

  const handleTransferSurplus = (surplus: PantrySurplusItem) => {
    onAddSurplusToPantry(surplus);
    setAddedSurplusIds((prev) => [...prev, surplus.id]);
    setTimeout(() => {
      setAddedSurplusIds((prev) => prev.filter((id) => id !== surplus.id));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction & Quick Actions Banner */}
      <div className="p-5 rounded-2xl bg-muted/40 border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 shrink-0">
            <Box className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground font-heading">
                Αποθήκη &amp; Πλεόνασμα Υλικών
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {userPantryItems.length} διαθέσιμα υλικά
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              Διαχειριστείτε τι έχετε ήδη στα ντουλάπια και το ψυγείο σας. Το σύστημα λαμβάνει αυτόματα υπόψη το πλεόνασμα συσκευασιών και μειώνει το κόστος της εβδομαδιαίας λίστας αγορών.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={handleOpenAddModal}
            className="gap-1.5 font-bold text-xs bg-primary text-primary-foreground shadow-sm shadow-primary/25 rounded-xl h-9 px-4"
          >
            <Plus className="size-4" />
            + Προσθήκη Υλικού
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Αναζήτηση υλικού στην αποθήκη (π.χ. ελαιόλαδο, φέτα, ρύζι)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-muted/40 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Section Filter Buttons */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl p-1 bg-muted/30 self-start sm:self-auto text-xs shrink-0">
            <button
              onClick={() => setActiveSection("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeSection === "all"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Όλα ({userPantryItems.length + surplusItems.length})
            </button>
            <button
              onClick={() => setActiveSection("pantry")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeSection === "pantry"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ντουλάπι ({userPantryItems.length})
            </button>
            <button
              onClick={() => setActiveSection("surplus")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeSection === "surplus"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Πλεόνασμα ({surplusItems.length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/50">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Όλες οι Κατηγορίες
          </button>
          {Object.entries(AISLE_CATEGORIES).map(([catKey, catMeta]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                selectedCategory === catKey
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{catMeta.icon}</span>
              <span>{catMeta.nameEl.split("&")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Columns): User Pantry Inventory (Add, Edit, Delete) */}
        {(activeSection === "all" || activeSection === "pantry") && (
          <div className={`space-y-4 ${activeSection === "pantry" ? "lg:col-span-3" : "lg:col-span-2"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Home className="size-4 text-primary" />
                <span>Υλικά στο Ντουλάπι &amp; Ψυγείο μου</span>
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                {filteredPantryItems.length} υλικά
              </span>
            </div>

            {filteredPantryItems.length === 0 ? (
              <div className="p-10 text-center bg-card border border-border rounded-2xl space-y-3">
                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Box className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">
                    {searchTerm ? "Δεν βρέθηκαν υλικά με αυτά τα κριτήρια" : "Η αποθήκη σας είναι άδεια"}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Προσθέστε υλικά που έχετε ήδη στο σπίτι (π.χ. λάδι, αλάτι, ρύζι) για να μην τα ξαναγοράζετε!
                  </p>
                </div>
                <Button
                  onClick={handleOpenAddModal}
                  size="sm"
                  className="rounded-xl gap-1 text-xs font-bold"
                >
                  <Plus className="size-3.5" />
                  + Προσθήκη Υλικού
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPantryItems.map((item) => {
                  const aisle = AISLE_CATEGORIES[item.category];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-2xs transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-base">{aisle?.icon || "🛒"}</span>
                            <span className="font-bold text-sm text-foreground">
                              {item.name}
                            </span>
                            {item.isSurplus && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Πλεόνασμα
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                              {item.notes}
                            </p>
                          )}
                          <span className={`text-[10px] inline-block px-2 py-0.5 rounded-md font-semibold ${aisle?.badgeColor}`}>
                            {aisle?.nameEl}
                          </span>
                        </div>

                        {/* Edit & Delete Actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Επεξεργασία υλικού"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Διαγραφή του υλικού "${item.name}" από την αποθήκη;`)) {
                                onDeletePantryItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Διαγραφή υλικού"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Stepper Bar */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Διαθέσιμη Ποσότητα:</span>
                        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/80">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(item, -1)}
                            className="size-6 rounded-lg bg-card hover:bg-muted text-foreground flex items-center justify-center font-bold text-sm shadow-2xs hover:scale-105 active:scale-95 transition-all"
                            title="Μείωση ποσότητας"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-foreground min-w-[50px] text-center">
                            {item.amount} {item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(item, 1)}
                            className="size-6 rounded-lg bg-card hover:bg-muted text-foreground flex items-center justify-center font-bold text-sm shadow-2xs hover:scale-105 active:scale-95 transition-all"
                            title="Αύξηση ποσότητας"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Right (1 Column): Surplus from Packaging */}
        {(activeSection === "all" || activeSection === "surplus") && (
          <div className={`space-y-4 ${activeSection === "surplus" ? "lg:col-span-3" : "lg:col-span-1"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Box className="size-4 text-emerald-500" />
                <span>Αυτόματο Πλεόνασμα Συσκευασιών</span>
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                {filteredSurplusItems.length} υλικά
              </span>
            </div>

            {filteredSurplusItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-xl">
                Δεν υπάρχει περίσσευμα από το τρέχον εβδομαδιαίο πλάνο.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredSurplusItems.map((item) => {
                  const aisle = AISLE_CATEGORIES[item.category];
                  const isJustAdded = addedSurplusIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-border bg-card space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <span>{aisle?.icon || "🛒"}</span>
                            <span>{item.ingredientName}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Από: {item.originMealNames.join(", ")}
                          </p>
                        </div>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          +{item.amount} {item.unit}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-end">
                        <Button
                          size="xs"
                          variant={isJustAdded ? "default" : "outline"}
                          disabled={isJustAdded}
                          onClick={() => handleTransferSurplus(item)}
                          className={`text-xs gap-1 rounded-lg h-7 font-semibold ${
                            isJustAdded
                              ? "bg-emerald-600 text-white"
                              : "border-primary/30 text-primary hover:bg-primary/10"
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="size-3" />
                              Προστέθηκε!
                            </>
                          ) : (
                            <>
                              <PackagePlus className="size-3" />
                              Μεταφορά στο Ντουλάπι
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      <PantryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialItem={editingItem}
      />
    </div>
  );
}
