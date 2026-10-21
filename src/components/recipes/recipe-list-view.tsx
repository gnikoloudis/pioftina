"use client";

import React, { useState } from "react";
import {
  Recipe,
  Ingredient,
  RecipeCategory,
  RECIPE_CATEGORIES,
  getRecipeCategoryMeta,
  AISLE_CATEGORIES,
} from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
import {
  Search,
  Clock,
  Users,
  ChefHat,
  Eye,
  X,
  Sparkles,
  Bot,
  ChevronDown,
  Tag,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { RecipeDetailModal } from "@/components/meal-planner/recipe-detail-modal";
import { Button } from "@/components/ui/button";

interface RecipeListViewProps {
  recipes: Recipe[];
  onCurateProduct?: (recipeId: string, ingredientId: string, product: Product) => void;
  onResetCuration?: (recipeId: string, ingredientId: string) => void;
  onOpenCurationStudio?: () => void;
  onUpdateCategory?: (recipeId: string, category: RecipeCategory) => void;
  onUpdateReferenceUrl?: (recipeId: string, referenceUrl: string) => void;
  onEditRecipeInStudio?: (recipeId: string) => void;
  onAddIngredient?: (recipeId: string, ingredient: Ingredient) => void;
}

export function RecipeListView({
  recipes,
  onCurateProduct,
  onResetCuration,
  onOpenCurationStudio,
  onUpdateCategory,
  onUpdateReferenceUrl,
  onEditRecipeInStudio,
  onAddIngredient,
}: RecipeListViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  const categories = [
    { id: "all", label: "Όλες οι συνταγές" },
    ...RECIPE_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return recipes.length;
    return recipes.filter((r) => r.category === categoryId).length;
  };

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Αναζητήστε συνταγή ή υλικό (π.χ. μουσακάς, κιμάς, φέτα)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/40 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {onOpenCurationStudio && (
            <Button
              onClick={onOpenCurationStudio}
              className="gap-1.5 text-xs bg-linear-to-r from-blue-700 via-blue-600 to-sky-600 text-white font-bold shrink-0 shadow-md shadow-blue-700/20"
            >
              <Bot className="size-3.5" />
              + Νέα Συνταγή (Curation Agent)
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-muted-foreground/15 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="relative inline-flex items-center group/cat">
                    <select
                      value={recipe.category}
                      onChange={(e) =>
                        onUpdateCategory?.(recipe.id, e.target.value as RecipeCategory)
                      }
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
                  {recipe.isCurated && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      ✓ Curated
                    </span>
                  )}
                  {recipe.referenceUrl && (
                    <a
                      href={recipe.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold border border-border/80 transition-colors shadow-2xs"
                      title={`Πηγή Συνταγής (${recipe.referenceUrl})`}
                    >
                      <ExternalLink className="size-2.5 text-primary" />
                      <span>Πηγή</span>
                    </a>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes}λ
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                {recipe.titleEn && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {recipe.titleEn}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>

              {/* Ingredients preview */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Βασικά Υλικά ({recipe.ingredients.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.slice(0, 4).map((ing) => (
                    <span
                      key={ing.id}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium"
                    >
                      {ing.name}
                    </span>
                  ))}
                  {recipe.ingredients.length > 4 && (
                    <span className="text-[11px] px-1.5 py-0.5 text-muted-foreground">
                      +{recipe.ingredients.length - 4} ακόμα
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="size-3.5" />
                {recipe.servings} μερίδες
              </span>

              <div className="flex items-center gap-1.5">
                {onEditRecipeInStudio && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEditRecipeInStudio(recipe.id)}
                    className="text-xs gap-1 text-primary hover:bg-primary/10 hover:text-primary font-medium"
                    title="Επεξεργασία συνταγής στο Studio"
                  >
                    <Sliders className="size-3" />
                    Επεξεργασία
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setActiveRecipe(recipe)}
                  className="text-xs gap-1"
                >
                  <Eye className="size-3" />
                  Λεπτομέρειες
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeRecipe && (
        <RecipeDetailModal
          recipe={recipes.find((r) => r.id === activeRecipe.id) || activeRecipe}
          onClose={() => setActiveRecipe(null)}
          onCurateProduct={onCurateProduct}
          onResetCuration={onResetCuration}
          onUpdateCategory={onUpdateCategory}
          onUpdateReferenceUrl={onUpdateReferenceUrl}
          onEditInStudio={onEditRecipeInStudio}
          onAddIngredient={onAddIngredient}
        />
      )}
    </div>
  );
}
