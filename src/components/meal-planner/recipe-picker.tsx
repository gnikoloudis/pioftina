"use client";

import React, { useState } from "react";
import { Recipe, DAYS_GREEK, RECIPE_CATEGORIES, MealType } from "@/types/meal-planner";
import { Search, X, Clock, Users, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipePickerProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  targetDay: number;
  targetMealType: MealType;
  targetCourseHint?: string;
  onSelectRecipe: (recipe: Recipe) => void;
}

export function RecipePicker({
  isOpen,
  onClose,
  recipes,
  targetDay,
  targetMealType,
  targetCourseHint,
  onSelectRecipe,
}: RecipePickerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "Όλες οι συνταγές" },
    ...RECIPE_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

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

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: "Πρωινό",
    lunch: "Μεσημεριανό",
    snack: "Σνακ",
    dinner: "Βραδινό",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-3xl max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Επιλογή Συνταγής
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Προσθήκη για:{" "}
              <span className="font-semibold text-primary">
                {DAYS_GREEK[targetDay]} — {mealTypeLabels[targetMealType]}
              </span>
              {targetCourseHint && (
                <span className="ml-1.5 text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                  {targetCourseHint}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-border space-y-3 bg-background">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Αναζήτηση συνταγής, σαλάτας, υλικού (π.χ. φέτα, κοτόπουλο, ντάκος)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips - Wrapped */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <p className="text-sm">Δεν βρέθηκαν συνταγές με αυτόν τον όρο.</p>
            </div>
          ) : (
            filtered.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                className="group flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes}λ
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {recipe.servings} μερίδες
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-muted font-medium">
                      {recipe.ingredients.length} υλικά
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="h-7 text-xs font-medium rounded-lg group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Plus className="size-3.5 mr-1" /> Επιλογή
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
