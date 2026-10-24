"use client";

import React, { useState } from "react";
import {
  MealSlot,
  Recipe,
  Ingredient,
  MealType,
  CourseType,
  DAYS_GREEK,
  MEAL_TYPES_CONFIG,
} from "@/types/meal-planner";
import {
  Plus,
  Trash2,
  Eye,
  Sparkles,
  RotateCcw,
  Minus,
  Calendar,
  UtensilsCrossed,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipePicker } from "./recipe-picker";
import { RecipeDetailModal } from "./recipe-detail-modal";

interface WeeklyCalendarProps {
  slots: MealSlot[];
  allRecipes: Recipe[];
  onAssignRecipe: (
    day: number,
    mealType: MealType,
    recipe: Recipe | null,
    servings?: number,
    slotId?: string,
    courseType?: CourseType
  ) => void;
  onRemoveSlot: (slotId: string) => void;
  onClearAll: () => void;
  onLoadDefaultWeek: () => void;
  onUpdateServings?: (slotId: string, servings: number) => void;
  onUpdateReferenceUrl?: (recipeId: string, referenceUrl: string) => void;
  onEditRecipeInStudio?: (recipeId: string) => void;
  onAddIngredient?: (recipeId: string, ingredient: Ingredient) => void;
  onOpenSaveModal?: () => void;
}

function getCourseBadge(recipe: Recipe, courseType?: CourseType) {
  if (courseType === "salad" || recipe.category === "salads") {
    return {
      label: "Σαλάτα",
      icon: "🥗",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    };
  }
  if (courseType === "snack" || recipe.category === "snacks") {
    return {
      label: "Σνακ",
      icon: "🍎",
      color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    };
  }
  if (courseType === "breakfast" || recipe.category === "breakfast") {
    return {
      label: "Πρωινό",
      icon: "🥞",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    };
  }
  if (courseType === "side" || recipe.category === "sides") {
    return {
      label: "Συνοδευτικό",
      icon: "🥖",
      color: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    };
  }
  return {
    label: "Κυρίως",
    icon: "🍛",
    color: "bg-primary/10 text-primary border-primary/20",
  };
}

export function WeeklyCalendar({
  slots,
  allRecipes,
  onAssignRecipe,
  onRemoveSlot,
  onClearAll,
  onLoadDefaultWeek,
  onUpdateServings,
  onUpdateReferenceUrl,
  onEditRecipeInStudio,
  onAddIngredient,
  onOpenSaveModal,
}: WeeklyCalendarProps) {
  const [pickerTarget, setPickerTarget] = useState<{
    day: number;
    mealType: MealType;
    courseHint?: string;
  } | null>(null);

  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<number | "all">("all");

  // Get all slots for a specific day and meal type (supports multiple dishes)
  const getSlotsForMeal = (day: number, mealType: MealType): MealSlot[] => {
    return slots.filter((s) => s.day === day && s.mealType === mealType && s.recipe !== null);
  };

  const totalScheduledMeals = slots.filter((s) => s.recipe !== null).length;

  const lunchCount = slots.filter((s) => s.mealType === "lunch" && s.recipe).length;
  const dinnerCount = slots.filter((s) => s.mealType === "dinner" && s.recipe).length;
  const breakfastCount = slots.filter((s) => s.mealType === "breakfast" && s.recipe).length;
  const snackCount = slots.filter((s) => s.mealType === "snack" && s.recipe).length;

  const displayedDays =
    activeDayFilter === "all"
      ? DAYS_GREEK.map((name, index) => ({ name, index }))
      : [{ name: DAYS_GREEK[activeDayFilter], index: activeDayFilter }];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
              <Calendar className="size-5 text-primary" />
              <span>Εβδομαδιαίο Πρόγραμμα Γευμάτων</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              {totalScheduledMeals} πιάτα
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Προγραμματίστε Πρωινό, Μεσημεριανό (Κυρίως + Σαλάτα), Σνακ και Βραδινό. Τα υλικά συγκεντρώνονται αυτόματα στη λίστα αγορών!
          </p>

          {/* Meal breakdown pills */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium">
              🥞 {breakfastCount} Πρωινά
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
              ☀️ {lunchCount} Μεσημεριανά
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium">
              🍎 {snackCount} Σνακ
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
              🌙 {dinnerCount} Βραδινά
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 flex-wrap">
          {onOpenSaveModal && (
            <Button
              variant="outline"
              size="sm"
              id="btn-calendar-save-to-pc"
              onClick={onOpenSaveModal}
              className="text-xs gap-1.5 border-primary/30 hover:bg-primary/10 text-primary font-semibold"
              title="Αποθήκευση του εβδομαδιαίου πλάνου και της λίστας στον υπολογιστή"
            >
              <Download className="size-3.5" />
              <span>Αποθήκευση</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onLoadDefaultWeek}
            className="text-xs gap-1.5 border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
            title="Φόρτωση ισορροπημένου εβδομαδιαίου μεσογειακού πλάνου με πρωινό, σαλάτες & κυρίως"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            Έτοιμο Πλάνο
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
            title="Καθαρισμός όλων των προγραμματισμένων πιάτων"
          >
            <RotateCcw className="size-3.5" />
            Καθαρισμός
          </Button>
        </div>
      </div>

      {/* Day Filter Pills for rapid navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1 shrink-0">
          <Filter className="size-3" /> Προβολή:
        </span>
        <button
          onClick={() => setActiveDayFilter("all")}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeDayFilter === "all"
              ? "bg-primary text-primary-foreground shadow-2xs font-bold"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Όλη η Εβδομάδα (7 Ημέρες)
        </button>
        {DAYS_GREEK.map((dayName, idx) => {
          const dayMeals = slots.filter((s) => s.day === idx && s.recipe !== null).length;
          return (
            <button
              key={idx}
              onClick={() => setActiveDayFilter(idx)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeDayFilter === idx
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{dayName}</span>
              {dayMeals > 0 && (
                <span className="size-4 rounded-full bg-foreground/10 text-[10px] flex items-center justify-center font-bold">
                  {dayMeals}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Days Grid - Multi-row wrapping for spacious, uncompressed cards */}
      <div
        className={
          activeDayFilter === "all"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "max-w-xl mx-auto w-full"
        }
      >
        {displayedDays.map(({ name: dayName, index: dayIndex }) => {
          const isWeekend = dayIndex >= 5;
          const totalDayDishes = slots.filter(
            (s) => s.day === dayIndex && s.recipe !== null
          ).length;

          return (
            <div
              key={dayIndex}
              className={`flex flex-col rounded-2xl border ${
                isWeekend
                  ? "bg-card border-primary/25 shadow-xs"
                  : "bg-card border-border shadow-xs"
              } overflow-hidden transition-all hover:border-primary/40`}
            >
              {/* Day Header */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  isWeekend
                    ? "bg-primary/10 border-primary/25"
                    : "bg-blue-50/50 dark:bg-blue-950/20 border-border/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground font-heading">
                    {dayName}
                  </span>
                  {isWeekend && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                      Σ/Κ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {totalDayDishes} {totalDayDishes === 1 ? "πιάτο" : "πιάτα"}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    H{dayIndex + 1}
                  </span>
                </div>
              </div>

              {/* Day Meal Sections (Breakfast, Lunch, Snack, Dinner) */}
              <div className="p-3.5 space-y-4 flex-1 flex flex-col justify-between">
                {MEAL_TYPES_CONFIG.map((mealCfg) => {
                  const mealSlots = getSlotsForMeal(dayIndex, mealCfg.id);
                  const hasDishes = mealSlots.length > 0;

                  return (
                    <div
                      key={mealCfg.id}
                      className="space-y-1.5 p-2 rounded-xl bg-muted/20 border border-border/40"
                    >
                      {/* Meal Category Header */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <span>{mealCfg.icon}</span>
                          <span>{mealCfg.label}</span>
                        </span>
                        {hasDishes && (
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {mealSlots.length} {mealSlots.length === 1 ? "πιάτο" : "πιάτα"}
                          </span>
                        )}
                      </div>

                      {/* Render Dishes for this Meal */}
                      <div className="space-y-2">
                        {mealSlots.map((slot) => {
                          if (!slot.recipe) return null;
                          const badge = getCourseBadge(slot.recipe, slot.courseType);

                          return (
                            <div
                              key={slot.id}
                              className="group relative p-2.5 rounded-xl border border-border/80 bg-background hover:border-primary/60 shadow-2xs transition-all space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badge.color} inline-flex items-center gap-1`}
                                    >
                                      <span>{badge.icon}</span>
                                      <span>{badge.label}</span>
                                    </span>
                                  </div>
                                  <p
                                    className="font-semibold text-xs text-foreground leading-snug line-clamp-2 hover:text-primary cursor-pointer transition-colors pt-0.5"
                                    onClick={() => setPreviewRecipe(slot.recipe)}
                                    title={slot.recipe.title}
                                  >
                                    {slot.recipe.title}
                                  </p>
                                </div>
                              </div>

                              {/* Servings stepper & quick actions */}
                              <div className="flex items-center justify-between pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                                {/* Servings Stepper */}
                                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 border border-border/50">
                                  <button
                                    onClick={() => {
                                      if (onUpdateServings) {
                                        onUpdateServings(
                                          slot.id,
                                          Math.max(1, slot.servings - 1)
                                        );
                                      }
                                    }}
                                    className="size-5 rounded flex items-center justify-center hover:bg-background hover:text-foreground text-muted-foreground transition-colors"
                                    title="Μείωση μερίδων"
                                  >
                                    <Minus className="size-2.5" />
                                  </button>
                                  <span className="font-semibold text-foreground px-1 text-[11px] min-w-[20px] text-center">
                                    {slot.servings}
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (onUpdateServings) {
                                        onUpdateServings(
                                          slot.id,
                                          slot.servings + 1
                                        );
                                      }
                                    }}
                                    className="size-5 rounded flex items-center justify-center hover:bg-background hover:text-foreground text-muted-foreground transition-colors"
                                    title="Αύξηση μερίδων"
                                  >
                                    <Plus className="size-2.5" />
                                  </button>
                                  <span className="text-[10px] text-muted-foreground pr-1">
                                    μερ.
                                  </span>
                                </div>

                                {/* Preview & Remove */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setPreviewRecipe(slot.recipe)}
                                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                    title="Προβολή συνταγής & υλικών"
                                  >
                                    <Eye className="size-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onRemoveSlot(slot.id)}
                                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    title="Αφαίρεση πιάτου"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add Dish Button */}
                        {hasDishes ? (
                          <button
                            onClick={() =>
                              setPickerTarget({
                                day: dayIndex,
                                mealType: mealCfg.id,
                                courseHint:
                                  mealCfg.id === "lunch" || mealCfg.id === "dinner"
                                    ? "Σαλάτα ή Δεύτερο Πιάτο"
                                    : "Επιπλέον επιλογή",
                              })
                            }
                            className="w-full py-1.5 px-2 border border-dashed border-border/80 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                            title={`Προσθήκη επιπλέον πιάτου (π.χ. σαλάτα) στο ${mealCfg.label}`}
                          >
                            <Plus className="size-3" />
                            <span>
                              {mealCfg.id === "lunch" || mealCfg.id === "dinner"
                                ? "+ Σαλάτα / Πιάτο"
                                : "+ Πιάτο"}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setPickerTarget({
                                day: dayIndex,
                                mealType: mealCfg.id,
                                courseHint: mealCfg.description,
                              })
                            }
                            className="w-full h-11 border border-dashed border-border rounded-xl flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Plus className="size-3.5" />
                            <span>Επιλογή {mealCfg.label}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {pickerTarget && (
        <RecipePicker
          isOpen={true}
          onClose={() => setPickerTarget(null)}
          recipes={allRecipes}
          targetDay={pickerTarget.day}
          targetMealType={pickerTarget.mealType}
          targetCourseHint={pickerTarget.courseHint}
          onSelectRecipe={(recipe) => {
            // Deduce course type from recipe or target
            let course: CourseType = "main";
            if (recipe.category === "salads") course = "salad";
            else if (recipe.category === "breakfast" || pickerTarget.mealType === "breakfast") {
              course = "breakfast";
            } else if (recipe.category === "snacks" || pickerTarget.mealType === "snack") {
              course = "snack";
            } else if (recipe.category === "sides") {
              course = "side";
            }

            onAssignRecipe(
              pickerTarget.day,
              pickerTarget.mealType,
              recipe,
              recipe.servings || 4,
              undefined,
              course
            );
            setPickerTarget(null);
          }}
        />
      )}

      {previewRecipe && (
        <RecipeDetailModal
          recipe={allRecipes.find((r) => r.id === previewRecipe.id) || previewRecipe}
          onClose={() => setPreviewRecipe(null)}
          onUpdateReferenceUrl={onUpdateReferenceUrl}
          onEditInStudio={onEditRecipeInStudio}
          onAddIngredient={onAddIngredient}
        />
      )}
    </div>
  );
}

