"use client";

import React, { useState } from "react";
import {
  Recipe,
  RecipeCategory,
  RECIPE_CATEGORIES,
  getRecipeCategoryMeta,
  Ingredient,
  AISLE_CATEGORIES,
} from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
import { CurateProductModal } from "@/components/recipes/curate-product-modal";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  X,
  Clock,
  Users,
  ChefHat,
  Sliders,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  RotateCcw,
  Store,
  ChevronDown,
  Check,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddIngredientModal, AddIngredientResult } from "@/components/admin/add-ingredient-modal";
import { calculateRecipeCost } from "@/lib/recipes/recipe-cost";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onCurateProduct?: (recipeId: string, ingredientId: string, product: Product) => void;
  onResetCuration?: (recipeId: string, ingredientId: string) => void;
  onUpdateCategory?: (recipeId: string, category: RecipeCategory) => void;
  onUpdateReferenceUrl?: (recipeId: string, referenceUrl: string) => void;
  onEditInStudio?: (recipeId: string) => void;
  onAddIngredient?: (recipeId: string, ingredient: Ingredient) => void;
  isAdmin?: boolean;
}

export function RecipeDetailModal({
  recipe,
  onClose,
  onCurateProduct,
  onResetCuration,
  onUpdateCategory,
  onUpdateReferenceUrl,
  onEditInStudio,
  onAddIngredient,
  isAdmin = false,
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "curation">("ingredients");
  const [curatingIngredient, setCuratingIngredient] = useState<Ingredient | null>(null);
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [justUpdatedCategory, setJustUpdatedCategory] = useState(false);
  const [isEditingRefUrl, setIsEditingRefUrl] = useState(false);
  const [refUrlInput, setRefUrlInput] = useState(recipe?.referenceUrl || "");
  const [justUpdatedRefUrl, setJustUpdatedRefUrl] = useState(false);

  // Keep refUrlInput in sync when recipe changes
  React.useEffect(() => {
    setRefUrlInput(recipe?.referenceUrl || "");
    setIsEditingRefUrl(false);
  }, [recipe]);

  const costBreakdown = React.useMemo(() => {
    if (!recipe) return null;
    return calculateRecipeCost(recipe);
  }, [recipe]);

  if (!recipe) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="flex flex-col w-full max-w-2xl max-h-[88vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                <ChefHat className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    {recipe.title}
                  </h2>
                  {recipe.isCurated && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="size-3" /> Curation Ολοκληρωμένο
                    </span>
                  )}
                </div>
                {recipe.titleEn && (
                  <p className="text-xs text-muted-foreground">{recipe.titleEn}</p>
                )}

                {/* Categories & Reference URL Row */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* Category Selector */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={recipe.category}
                      onChange={(e) => {
                        onUpdateCategory?.(recipe.id, e.target.value as RecipeCategory);
                        setJustUpdatedCategory(true);
                        setTimeout(() => setJustUpdatedCategory(false), 2000);
                      }}
                      aria-label="Αλλαγή κατηγορίας συνταγής"
                      title="Κάντε κλικ για αλλαγή κατηγορίας"
                      className="appearance-none text-xs font-semibold pl-2 pr-6 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                    >
                      {RECIPE_CATEGORIES.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          className="bg-background text-foreground"
                        >
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1.5 size-3 text-primary opacity-70" />
                  </div>
                  {justUpdatedCategory && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 animate-in fade-in">
                      <Check className="size-3" /> Ενημερώθηκε!
                    </span>
                  )}

                  {/* Reference URL clickable badge */}
                  {recipe.referenceUrl && !isEditingRefUrl && (
                    <a
                      href={recipe.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/70 transition-colors shadow-2xs"
                      title={`Άνοιγμα της αρχικής πηγής (${recipe.referenceUrl})`}
                    >
                      <ExternalLink className="size-3 text-primary" />
                      <span>Πηγή Συνταγής</span>
                    </a>
                  )}

                  {/* Admin edit / add reference link button */}
                  {isAdmin && onUpdateReferenceUrl && !isEditingRefUrl && (
                    <button
                      onClick={() => setIsEditingRefUrl(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-full hover:bg-muted transition-colors"
                      title="Προσθήκη ή τροποποίηση του συνδέσμου αναφοράς / πηγής (Admin)"
                    >
                      <LinkIcon className="size-3" />
                      <span>{recipe.referenceUrl ? "Αλλαγή Πηγής" : "+ Προσθήκη Πηγής"}</span>
                    </button>
                  )}

                  {justUpdatedRefUrl && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 animate-in fade-in">
                      <Check className="size-3" /> Αποθηκεύτηκε!
                    </span>
                  )}
                </div>

                {/* Inline reference URL editor */}
                {isEditingRefUrl && (
                  <div className="flex items-center gap-1.5 mt-2 animate-in fade-in flex-wrap">
                    <input
                      type="url"
                      value={refUrlInput}
                      onChange={(e) => setRefUrlInput(e.target.value)}
                      placeholder="π.χ. https://akispetretzikis.com/..."
                      className="text-xs px-2.5 py-1 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary w-64 sm:w-80"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdateReferenceUrl?.(recipe.id, refUrlInput);
                        setIsEditingRefUrl(false);
                        setJustUpdatedRefUrl(true);
                        setTimeout(() => setJustUpdatedRefUrl(false), 2000);
                      }}
                      className="h-6 text-[11px] px-2 rounded-lg"
                    >
                      Αποθήκευση
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRefUrlInput(recipe.referenceUrl || "");
                        setIsEditingRefUrl(false);
                      }}
                      className="h-6 text-[11px] px-1.5 rounded-lg text-muted-foreground"
                    >
                      Άκυρο
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && onEditInStudio && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onEditInStudio(recipe.id);
                    onClose();
                  }}
                  className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                  title="Επεξεργασία συνταγής και υλικών στο Curation Studio (Admin)"
                >
                  <Sliders className="size-3.5" />
                  <span className="hidden sm:inline">Επεξεργασία στο Studio</span>
                  <span className="sm:hidden">Studio</span>
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs & Info Strip */}
          <div className="px-6 py-2.5 bg-muted/20 border-b border-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                id="tab-recipe-ingredients"
                onClick={() => setActiveTab("ingredients")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === "ingredients"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Υλικά &amp; Συνταγή
              </button>
              {isAdmin && (
                <button
                  id="tab-recipe-curation"
                  onClick={() => setActiveTab("curation")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === "curation"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Sliders className="size-3.5" />
                  <span>Επιμέλεια Προϊόντων (Admin)</span>
                  <span className="size-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {recipe.ingredients.filter((i) => i.isCurated || i.curatedProduct).length}
                  </span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-primary" />
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes}λ
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5 text-primary" />
                {recipe.servings} μερίδες
              </span>
              {costBreakdown && costBreakdown.costPerServing > 0 && (
                <span
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"
                  title={`Συνολικό κόστος συνταγής: ~${costBreakdown.totalEstimatedCost.toFixed(2)}€ για ${recipe.servings} μερίδες`}
                >
                  <Coins className="size-3.5" />
                  ~{costBreakdown.costPerServing.toFixed(2)} € / μερίδα
                </span>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "ingredients" ? (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recipe.description}
                </p>

                {/* Cost Estimation Summary Banner */}
                {costBreakdown && costBreakdown.costPerServing > 0 && (
                  <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Coins className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Εκτιμώμενο Κόστος Συνταγής
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Υπολογισμένο με τις καλύτερες τιμές supermarket του Παρατηρητηρίου Τιμών (posokanei.gov.gr).
                      </p>
                    </div>
                    <div className="flex items-center gap-3.5 shrink-0 bg-card/80 dark:bg-card/60 px-3.5 py-2 rounded-xl border border-emerald-500/20">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Κόστος / Μερίδα</div>
                        <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                          ~{costBreakdown.costPerServing.toFixed(2)} €
                        </div>
                      </div>
                      <div className="h-7 w-px bg-emerald-500/30" />
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Σύνολο ({recipe.servings} μερ.)</div>
                        <div className="text-sm font-bold text-foreground">
                          ~{costBreakdown.totalEstimatedCost.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Απαιτούμενα Υλικά ({recipe.ingredients.length})
                    </h3>
                    {onAddIngredient && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddIngredientOpen(true)}
                        className="h-7 text-xs gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Plus className="size-3.5" />
                        Προσθήκη Υλικού
                      </Button>
                    )}
                  </div>
                  <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                    {recipe.ingredients.map((ing) => {
                      const aisle = AISLE_CATEGORIES[ing.category];
                      const ingCost = costBreakdown?.ingredientCosts.find((c) => c.ingredientId === ing.id);
                      return (
                        <div
                          key={ing.id}
                          className="flex items-center justify-between px-4 py-2.5 text-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <span>{aisle?.icon || "🛒"}</span>
                            <span className="font-medium text-foreground">
                              {ing.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <span className="font-semibold text-primary">
                              {ing.amount} {ing.unit}
                            </span>
                            {ingCost && (
                              <span
                                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                                title={`Εκτιμώμενο αναλογικό κόστος υλικού: ~${ingCost.estimatedCost.toFixed(2)}€ (${ingCost.unitPrice} ${ingCost.unitLabel})`}
                              >
                                ~{ingCost.estimatedCost.toFixed(2)} €
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-md ${aisle?.badgeColor}`}>
                              {aisle?.nameEl.split("&")[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                      Οδηγίες Εκτέλεσης ({recipe.instructions.length} Βήματα)
                    </h3>
                    <ol className="space-y-2.5">
                      {recipe.instructions.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border text-xs leading-relaxed"
                        >
                          <span className="flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-foreground/90 font-medium">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              /* Curation Mode */
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" />
                    Προϊοντικό Curation Υλικών Συνταγής
                  </p>
                  <p>
                    Ελέγξτε ποιο <strong>προϊόν supermarket</strong> αντιστοιχεί σε κάθε υλικό. Μπορείτε να αλλάξετε την αντιστοίχιση σε οποιοδήποτε άλλο προϊόν του <code>posokanei.gov.gr</code> χωρίς δέσμευση σε συγκεκριμένο supermarket.
                  </p>
                </div>

                <div className="space-y-3">
                  {recipe.ingredients.map((ing) => {
                    const aisle = AISLE_CATEGORIES[ing.category];
                    const isCurated = !!(ing.isCurated || ing.curatedProduct);
                    const prod = ing.curatedProduct;

                    return (
                      <div
                        key={ing.id}
                        className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                          isCurated
                            ? "bg-card border-border hover:border-border/80"
                            : "bg-amber-500/5 border-amber-500/20"
                        }`}
                      >
                        {/* Ingredient Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span>{aisle?.icon || "🛒"}</span>
                            <span className="font-bold text-sm text-foreground">
                              {ing.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({ing.amount} {ing.unit})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isCurated ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="size-3" /> Επιβεβαιωμένο
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                Αυτόματη Πρόταση
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mapped Product Card */}
                        <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                              {prod?.image_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={prod.image_url}
                                  alt={prod.name}
                                  className="size-full object-contain p-0.5"
                                />
                              ) : (
                                <Package className="size-4 text-muted-foreground" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-foreground truncate">
                                {prod ? prod.name : `Αναζήτηση: "${ing.posokaneiQuery}"`}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                {prod?.brand && <span>{prod.brand}</span>}
                                {prod && <span>&bull;</span>}
                                <span>{prod ? `${prod.unit_quantity} ${prod.unit}` : ing.category}</span>
                                {prod?.price_stats?.min_price && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="font-medium text-foreground">
                                      από €{prod.price_stats.min_price.toFixed(2)}
                                    </span>
                                  </>
                                )}
                              </div>

                              {prod?.retailers && prod.retailers.length > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-[10px] text-muted-foreground mr-0.5 flex items-center gap-0.5">
                                    <Store className="size-2.5" /> Διαθέσιμο σε:
                                  </span>
                                  {prod.retailers.slice(0, 3).map((r) => (
                                    <SupermarketBadge key={r} retailerId={r} size="sm" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurated && onResetCuration && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onResetCuration(recipe.id, ing.id)}
                                className="size-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                                title="Επαναφορά σε αρχικό"
                              >
                                <RotateCcw className="size-3.5" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCuratingIngredient(ing)}
                              className="rounded-xl text-xs font-semibold h-8 px-3"
                            >
                              Αλλαγή
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Curation Search Modal */}
      {curatingIngredient && (
        <CurateProductModal
          isOpen={!!curatingIngredient}
          onClose={() => setCuratingIngredient(null)}
          ingredient={curatingIngredient}
          recipeTitle={recipe.title}
          onAssignProduct={(selectedProduct) => {
            if (onCurateProduct) {
              onCurateProduct(recipe.id, curatingIngredient.id, selectedProduct);
            }
          }}
        />
      )}

      {/* Add Ingredient Modal */}
      {isAddIngredientOpen && (
        <AddIngredientModal
          isOpen={isAddIngredientOpen}
          onClose={() => setIsAddIngredientOpen(false)}
          recipeTitle={recipe.title}
          onAddIngredient={(result) => {
            if (!onAddIngredient) return;
            const newIng: Ingredient = {
              id: `ing-${Date.now()}-${recipe.ingredients.length}`,
              name: result.name,
              amount: result.amount,
              unit: result.unit,
              category: result.category,
              posokaneiQuery: result.posokaneiQuery,
              curatedProduct: result.product,
              isCurated: !!result.product,
            };
            onAddIngredient(recipe.id, newIng);
          }}
        />
      )}
    </>
  );
}
