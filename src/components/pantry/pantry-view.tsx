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
  Baby,
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
  onNavigateSection?: (section: "landing" | "planner" | "clean" | "baby" | "grocery" | "pantry") => void;
}

export function PantryView({
  surplusItems = [],
  groceryItems = [],
  userPantryItems = [],
  onTogglePantry,
  onAddPantryItem,
  onUpdatePantryItem,
  onDeletePantryItem,
  onAddSurplusToPantry,
  onNavigateSection,
}: PantryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserPantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<
    "all" | "pantry" | "from-plan" | "surplus"
  >("all");
  const [addedSurplusIds, setAddedSurplusIds] = useState<string[]>([]);

  // Items from grocery list marked as in-pantry / have at home
  const inPantryGroceryItems = groceryItems.filter((item) => item.inPantry);

  // Filter permanent user pantry items
  const filteredPantryItems = userPantryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter items marked as in-pantry from the weekly meal plan or bundles
  const filteredPlanItems = inPantryGroceryItems.filter((item) => {
    const matchesSearch = item.ingredientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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

  const totalAvailableCount =
    userPantryItems.length + inPantryGroceryItems.length + surplusItems.length;

  const getCategoryCount = (catKey: string) => {
    const uCount = userPantryItems.filter((i) => i.category === catKey).length;
    const gCount = inPantryGroceryItems.filter((i) => i.category === catKey).length;
    const sCount = surplusItems.filter((i) => i.category === catKey).length;
    return uCount + gCount + sCount;
  };

  const handleOpenAddModal = (catToPreselect?: AisleCategory) => {
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

  const handlePermanentSaveFromPlan = (item: OptimizedGroceryItem) => {
    onAddPantryItem({
      name: item.ingredientName,
      amount: item.rawRequiredAmount,
      unit: item.rawUnit,
      category: item.category,
      notes: `Από πρόγραμμα γευμάτων (${item.sourceMealTitles?.join(", ") || "Εβδομαδιαίο πλάνο"})`,
    });
    // Remove from inPantry toggled list
    onTogglePantry(item.ingredientId);
  };

  const isCategoryEmpty =
    selectedCategory !== "all" &&
    filteredPantryItems.length === 0 &&
    filteredPlanItems.length === 0 &&
    filteredSurplusItems.length === 0;

  const activeAisleMeta =
    selectedCategory !== "all"
      ? AISLE_CATEGORIES[selectedCategory as AisleCategory]
      : null;

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
                {totalAvailableCount} διαθέσιμα υλικά
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              Διαχειριστείτε τι έχετε ήδη στα ντουλάπια και το ψυγείο σας. Το σύστημα λαμβάνει αυτόματα υπόψη τα υλικά που έχετε ήδη στο σπίτι και το πλεόνασμα συσκευασιών, μειώνοντας το συνολικό κόστος αγορών.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => handleOpenAddModal()}
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
              placeholder="Αναζήτηση υλικού στην αποθήκη (π.χ. ελαιόλαδο, φέτα, ρύζι, πάνες)..."
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
          <div className="flex items-center gap-1 border border-border rounded-xl p-1 bg-muted/30 self-start sm:self-auto text-xs shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveSection("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeSection === "all"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Όλα ({totalAvailableCount})
            </button>
            <button
              onClick={() => setActiveSection("pantry")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeSection === "pantry"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ντουλάπι ({userPantryItems.length})
            </button>
            <button
              onClick={() => setActiveSection("from-plan")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeSection === "from-plan"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Υλικά από το πρόγραμμα γευμάτων που έχετε ήδη στο σπίτι"
            >
              Από Πρόγραμμα ({inPantryGroceryItems.length})
            </button>
            <button
              onClick={() => setActiveSection("surplus")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
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
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Όλες οι Κατηγορίες ({totalAvailableCount})
          </button>
          {Object.entries(AISLE_CATEGORIES).map(([catKey, catMeta]) => {
            const count = getCategoryCount(catKey);
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(isSelected ? "all" : catKey)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : count > 0
                    ? "bg-muted/70 text-foreground hover:bg-muted"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                title={`Φιλτράρισμα: ${catMeta.nameEl} (${count} υλικά)`}
              >
                <span>{catMeta.icon}</span>
                <span>{catMeta.nameEl.split("&")[0]}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Empty State Banner with Quick CTAs */}
      {isCategoryEmpty && (
        <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl space-y-4 animate-in fade-in">
          <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-2xl">
            {activeAisleMeta?.icon || "📦"}
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-bold text-base text-foreground">
              Δεν υπάρχουν αποθηκευμένα είδη στην κατηγορία «{activeAisleMeta?.nameEl}»
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Μπορείτε να προσθέσετε χειροκίνητα ό,τι έχετε ήδη στο σπίτι ή να δείτε τα αντίστοιχα πακέτα και προτάσεις.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => handleOpenAddModal(selectedCategory as AisleCategory)}
              size="sm"
              className="gap-1.5 text-xs font-bold rounded-xl"
            >
              <Plus className="size-3.5" />
              + Προσθήκη σε «{activeAisleMeta?.nameEl.split("&")[0]}»
            </Button>

            {selectedCategory === "baby" && onNavigateSection && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateSection("baby")}
                className="gap-1.5 text-xs font-semibold rounded-xl border-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
              >
                <Baby className="size-3.5 text-sky-500" />
                Δείτε τα Βρεφικά Πακέτα
              </Button>
            )}

            {selectedCategory === "household" && onNavigateSection && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateSection("clean")}
                className="gap-1.5 text-xs font-semibold rounded-xl border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
              >
                <Box className="size-3.5 text-purple-500" />
                Δείτε τα Πακέτα Καθαρισμού
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Εμφάνιση Όλων
            </Button>
          </div>
        </div>
      )}

      {/* Main Grid: Left (Inventory & Items from Plan), Right (Packaging Surplus) */}
      {!isCategoryEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Permanent User Pantry & Items from Meal Plan */}
          {(activeSection === "all" ||
            activeSection === "pantry" ||
            activeSection === "from-plan") && (
            <div
              className={`space-y-6 ${
                activeSection === "pantry" || activeSection === "from-plan"
                  ? "lg:col-span-3"
                  : "lg:col-span-2"
              }`}
            >
              {/* 1. Items from Weekly Plan (Have at home / inPantry) */}
              {activeSection === "from-plan" && filteredPlanItems.length === 0 && (
                <div className="p-8 text-center bg-card border border-border rounded-2xl space-y-3 mb-4">
                  <div className="mx-auto size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Home className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-foreground">
                      Δεν έχετε σημειώσει υλικά από το πρόγραμμα ως &quot;Έχω ήδη στο σπίτι&quot;
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                      Στη λίστα αγορών, πατήστε το εικονίδιο 🏠 δίπλα σε οποιοδήποτε υλικό έχετε ήδη στο σπίτι. Θα εμφανιστεί εδώ και θα εξαιρεθεί αυτόματα από το κόστος αγορών!
                    </p>
                  </div>
                </div>
              )}

              {(activeSection === "all" || activeSection === "from-plan") &&
                filteredPlanItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Home className="size-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Από το Πρόγραμμα Γευμάτων (Έχω ήδη στο σπίτι)</span>
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        {filteredPlanItems.length} υλικά
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredPlanItems.map((item) => {
                        const aisle = AISLE_CATEGORIES[item.category];
                        return (
                          <div
                            key={`plan-item-${item.ingredientId}`}
                            className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.03] hover:border-emerald-500/50 hover:shadow-2xs transition-all flex flex-col justify-between gap-3 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-base">{aisle?.icon || "🛒"}</span>
                                  <span className="font-bold text-sm text-foreground">
                                    {item.ingredientName}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                    🏠 Στο σπίτι
                                  </span>
                                </div>

                                {item.sourceMealTitles && item.sourceMealTitles.length > 0 && (
                                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                                    Για:{" "}
                                    <span className="font-medium text-foreground">
                                      {item.sourceMealTitles.join(", ")}
                                    </span>
                                  </p>
                                )}

                                {item.selectedOption && (
                                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <Sparkles className="size-3" />
                                    <span>
                                      Εξοικονόμηση: €{item.selectedOption.totalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                )}

                                <span
                                  className={`text-[10px] inline-block px-2 py-0.5 rounded-md font-semibold ${
                                    aisle?.badgeColor || "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {aisle?.nameEl || item.category}
                                </span>
                              </div>

                              {/* Management Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  size="xs"
                                  variant="outline"
                                  id={`btn-restore-plan-item-${item.ingredientId}`}
                                  onClick={() => onTogglePantry(item.ingredientId)}
                                  className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                                  title="Επαναφορά στη λίστα αγορών"
                                >
                                  <RotateCcw className="size-3" />
                                  <span className="hidden sm:inline">Επαναφορά</span>
                                </Button>

                                <Button
                                  size="xs"
                                  variant="ghost"
                                  id={`btn-permanent-save-${item.ingredientId}`}
                                  onClick={() => handlePermanentSaveFromPlan(item)}
                                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  title="Μεταφορά στο μόνιμο ντουλάπι"
                                >
                                  <PackagePlus className="size-3" />
                                  <span className="hidden lg:inline">Μόνιμο</span>
                                </Button>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                              <span>Απαιτούμενη ποσότητα:</span>
                              <span className="font-bold text-foreground">
                                {item.rawRequiredAmount} {item.rawUnit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* 2. Permanent User Pantry Items */}
              {(activeSection === "all" || activeSection === "pantry") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Box className="size-4 text-primary" />
                      <span>Υλικά στο Ντουλάπι &amp; Ψυγείο μου</span>
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      {filteredPantryItems.length} υλικά
                    </span>
                  </div>

                  {filteredPantryItems.length === 0 ? (
                    <div className="p-8 text-center bg-card border border-border rounded-2xl space-y-2">
                      <p className="font-bold text-xs text-foreground">
                        {searchTerm
                          ? "Δεν βρέθηκαν υλικά με αυτά τα κριτήρια"
                          : "Δεν έχετε προσθέσει μόνιμα υλικά σε αυτό το φίλτρο"}
                      </p>
                      <Button
                        onClick={() => handleOpenAddModal()}
                        size="xs"
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
                                <span
                                  className={`text-[10px] inline-block px-2 py-0.5 rounded-md font-semibold ${
                                    aisle?.badgeColor || "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {aisle?.nameEl || item.category}
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
                                    if (
                                      confirm(`Διαγραφή του υλικού "${item.name}" από την αποθήκη;`)
                                    ) {
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
                              <span className="text-xs text-muted-foreground">
                                Διαθέσιμη Ποσότητα:
                              </span>
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
            </div>
          )}

          {/* Right Column (1 Col): Surplus from Packaging */}
          {(activeSection === "all" || activeSection === "surplus") && (
            <div
              className={`space-y-4 ${
                activeSection === "surplus" ? "lg:col-span-3" : "lg:col-span-1"
              }`}
            >
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
                            {item.unit === "kg" && item.amount < 1 && (
                              <span className="text-[10px] font-normal opacity-80 ml-1">
                                ({Math.round(item.amount * 1000)}g)
                              </span>
                            )}
                            {item.unit === "L" && item.amount < 1 && (
                              <span className="text-[10px] font-normal opacity-80 ml-1">
                                ({Math.round(item.amount * 1000)}ml)
                              </span>
                            )}
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
      )}

      {/* Add / Edit Item Modal */}
      <PantryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialItem={editingItem}
        defaultCategory={
          selectedCategory !== "all" ? (selectedCategory as AisleCategory) : "pantry"
        }
      />
    </div>
  );
}
