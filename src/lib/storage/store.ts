"use client";

import { useState, useEffect, useRef } from "react";
import {
  MealSlot,
  MealType,
  CourseType,
  UserPreferences,
  Recipe,
  Ingredient,
  RecipeCategory,
  OptimizedGroceryItem,
  BasketComparison,
  PantrySurplusItem,
  PackOption,
  UserPantryItem,
} from "@/types/meal-planner";
import { ProductBundle } from "@/types/bundles";
import { Product } from "@/lib/posokanei/types";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";
import { getCuratedDefaultProduct } from "@/lib/recipes/curated-products";
import {
  generateOptimizedGroceryList,
  computeBasketComparisons,
  computeCartTotals,
  evaluatePackOptions,
} from "@/lib/optimizer/packaging";

import {
  DEFAULT_PREFERENCES,
  INITIAL_MEAL_SLOTS,
  DEFAULT_PANTRY_ITEMS,
} from "./initial-data";
export { DEFAULT_PREFERENCES, INITIAL_MEAL_SLOTS, DEFAULT_PANTRY_ITEMS };

const STORAGE_PREFIX = "pioftina_v2_";
const STORAGE_KEYS = {
  SLOTS: `${STORAGE_PREFIX}meal_slots`,
  PREFS: `${STORAGE_PREFIX}user_prefs`,
  CUSTOM_RECIPES: `${STORAGE_PREFIX}custom_recipes`,
  CHECKED_ITEMS: `${STORAGE_PREFIX}checked_items`,
  PANTRY_ITEMS: `${STORAGE_PREFIX}pantry_items`,
  USER_PANTRY_ITEMS: `${STORAGE_PREFIX}user_pantry_items`,
  EXCLUDED_ITEMS: `${STORAGE_PREFIX}excluded_items`,
  CUSTOM_OPTIONS: `${STORAGE_PREFIX}custom_pack_options`,
  CURATIONS: `${STORAGE_PREFIX}recipe_curations`,
  RECIPE_CATEGORIES: `${STORAGE_PREFIX}recipe_categories`,
  RECIPE_REFERENCE_URLS: `${STORAGE_PREFIX}recipe_reference_urls`,
  BUNDLE_ITEMS: `${STORAGE_PREFIX}bundle_items`,
};

export function useMealPlannerStore() {
  const [slots, setSlots] = useState<MealSlot[]>(INITIAL_MEAL_SLOTS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [recipeCurations, setRecipeCurations] = useState<Record<string, Record<string, Product>>>({});
  const [recipeCategoryOverrides, setRecipeCategoryOverrides] = useState<Record<string, RecipeCategory>>({});
  const [recipeReferenceUrls, setRecipeReferenceUrls] = useState<Record<string, string>>({});
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([]);
  const [pantryItemIds, setPantryItemIds] = useState<string[]>([]);
  const [userPantryItems, setUserPantryItems] = useState<UserPantryItem[]>(DEFAULT_PANTRY_ITEMS);
  const [excludedItemIds, setExcludedItemIds] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<Record<string, PackOption>>({});
  const [addedBundleItems, setAddedBundleItems] = useState<OptimizedGroceryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Computed grocery list state
  const [groceryItems, setGroceryItems] = useState<OptimizedGroceryItem[]>([]);
  const [basketComparisons, setBasketComparisons] = useState<BasketComparison[]>([]);
  const [pantrySurplus, setPantrySurplus] = useState<PantrySurplusItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [remainingCost, setRemainingCost] = useState(0);
  const [purchasedCost, setPurchasedCost] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Load from localStorage and server on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location.search.includes("fresh=true")) {
        localStorage.removeItem(STORAGE_KEYS.SLOTS);
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_OPTIONS);
        localStorage.removeItem(STORAGE_KEYS.CHECKED_ITEMS);
        localStorage.removeItem(STORAGE_KEYS.PANTRY_ITEMS);
        localStorage.removeItem(STORAGE_KEYS.EXCLUDED_ITEMS);
        localStorage.removeItem(STORAGE_KEYS.RECIPE_CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.RECIPE_REFERENCE_URLS);

        // Remove fresh=true from URL so refresh won't wipe slots again
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("fresh");
          window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));
        } catch (_) {}
      }

      let parsedCurations: Record<string, Record<string, Product>> = {};
      const storedCurations = localStorage.getItem(STORAGE_KEYS.CURATIONS);
      if (storedCurations) {
        try {
          parsedCurations = JSON.parse(storedCurations);
          setRecipeCurations(parsedCurations);
        } catch (e) {
          console.warn("Failed to parse storedCurations:", e);
        }
      }

      // 1. Load custom recipes from localStorage first
      let localCustom: Recipe[] = [];
      const storedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
      if (storedCustom) {
        try {
          const parsed = JSON.parse(storedCustom);
          if (Array.isArray(parsed)) {
            localCustom = parsed;
            setCustomRecipes(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse storedCustom:", e);
        }
      }

      // 2. Fetch server-persisted recipes from database and merge
      fetch("/api/recipes")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.recipes)) {
            const recipeMap = new Map<string, Recipe>();
            // Add server recipes (database truth)
            for (const r of data.recipes) {
              if (r && r.id) recipeMap.set(r.id, r);
            }
            // Preserve any local unsynced custom recipes
            setCustomRecipes((prev) => {
              for (const r of prev) {
                if (r && r.id && !recipeMap.has(r.id)) {
                  recipeMap.set(r.id, r);
                }
              }
              const merged = Array.from(recipeMap.values());
              try {
                localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(merged));
              } catch (_) {}
              return merged;
            });

            // Update scheduled meal slots only if recipe definitions changed in database
            setSlots((prevSlots) => {
              let changed = false;
              const mapped = prevSlots.map((slot) => {
                if (!slot || !slot.recipe) return slot;
                const updated = recipeMap.get(slot.recipe.id);
                if (updated) {
                  const ingredientsChanged =
                    JSON.stringify(
                      updated.ingredients?.map((i) => ({ id: i.id, amount: i.amount, unit: i.unit }))
                    ) !==
                    JSON.stringify(
                      slot.recipe.ingredients?.map((i) => ({ id: i.id, amount: i.amount, unit: i.unit }))
                    );

                  if (updated.title !== slot.recipe.title || ingredientsChanged) {
                    changed = true;
                    return {
                      ...slot,
                      recipe: {
                        ...updated,
                        servings: slot.recipe.servings || updated.servings,
                      },
                    };
                  }
                }
                return slot;
              });
              if (changed) {
                try {
                  localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(mapped));
                } catch (_) {}
                lastRunKeyRef.current = "";
                return mapped;
              }
              return prevSlots;
            });
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch server recipes:", err);
        });

      // 3. Hydrate slots defensively
      const storedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (storedSlots) {
        try {
          const rawSlots: MealSlot[] = JSON.parse(storedSlots);
          if (Array.isArray(rawSlots) && rawSlots.length > 0) {
            const hydratedSlots = rawSlots.map((slot) => {
              if (!slot || !slot.recipe) return slot;
              const recipeId = slot.recipe.id;
              const curationsForRecipe = parsedCurations[recipeId] || {};
              const seedMatch = SEED_RECIPES.find((r) => r.id === recipeId);
              const ingList = Array.isArray(slot.recipe.ingredients) ? slot.recipe.ingredients : [];

              return {
                ...slot,
                recipe: {
                  ...slot.recipe,
                  ingredients: ingList.map((ing) => {
                    if (!ing) return ing;
                    const adminCurated = curationsForRecipe[ing.id];
                    if (adminCurated) {
                      return {
                        ...ing,
                        curatedProduct: adminCurated,
                        curatedProductId: adminCurated.id,
                        isCurated: true,
                      };
                    }
                    const seedIng = seedMatch?.ingredients?.find(
                      (si) => si.id === ing.id || si.name === ing.name
                    );
                    const defaultCurated =
                      seedIng?.curatedProduct ||
                      getCuratedDefaultProduct(ing.posokaneiQuery) ||
                      getCuratedDefaultProduct(ing.name) ||
                      undefined;

                    return {
                      ...ing,
                      curatedProduct: ing.curatedProduct || defaultCurated,
                      curatedProductId: ing.curatedProductId || defaultCurated?.id,
                      isCurated: ing.isCurated || !!defaultCurated,
                    };
                  }),
                },
              };
            });
            setSlots(hydratedSlots);
          }
        } catch (slotErr) {
          console.warn("Error hydrating stored slots:", slotErr);
        }
      }

      const storedPrefs = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (storedPrefs) {
        try {
          setPreferences(JSON.parse(storedPrefs));
        } catch (_) {}
      }

      const storedChecked = localStorage.getItem(STORAGE_KEYS.CHECKED_ITEMS);
      if (storedChecked) {
        try {
          setCheckedItemIds(JSON.parse(storedChecked));
        } catch (_) {}
      }

      const storedPantry = localStorage.getItem(STORAGE_KEYS.PANTRY_ITEMS);
      if (storedPantry) {
        try {
          setPantryItemIds(JSON.parse(storedPantry));
        } catch (_) {}
      }

      const storedUserPantry = localStorage.getItem(STORAGE_KEYS.USER_PANTRY_ITEMS);
      if (storedUserPantry) {
        try {
          const parsed = JSON.parse(storedUserPantry);
          if (Array.isArray(parsed)) {
            setUserPantryItems(parsed);
          }
        } catch (_) {}
      }

      const storedExcluded = localStorage.getItem(STORAGE_KEYS.EXCLUDED_ITEMS);
      if (storedExcluded) {
        try {
          setExcludedItemIds(JSON.parse(storedExcluded));
        } catch (_) {}
      }

      const storedCategories = localStorage.getItem(STORAGE_KEYS.RECIPE_CATEGORIES);
      if (storedCategories) {
        try {
          setRecipeCategoryOverrides(JSON.parse(storedCategories));
        } catch (_) {}
      }

      const storedReferenceUrls = localStorage.getItem(STORAGE_KEYS.RECIPE_REFERENCE_URLS);
      if (storedReferenceUrls) {
        try {
          setRecipeReferenceUrls(JSON.parse(storedReferenceUrls));
        } catch (_) {}
      }

      const storedOptions = localStorage.getItem(STORAGE_KEYS.CUSTOM_OPTIONS);
      if (storedOptions) {
        try {
          const parsedOptions = JSON.parse(storedOptions);
          const sanitized: Record<string, PackOption> = {};
          for (const [key, opt] of Object.entries(parsedOptions)) {
            const prodName = (opt as PackOption)?.product?.name?.toLowerCase() || "";
            const kLower = key.toLowerCase();
            if (kLower.includes("φέτα") && prodName.includes("τυροπιτάκ")) continue;
            if (kLower.includes("λεμόν") && (prodName.includes("υγρομάντιλ") || prodName.includes("septona"))) continue;
            if (kLower.includes("ελαιόλαδ") && prodName.includes("αυγ")) continue;
            sanitized[key] = opt as PackOption;
          }
          setCustomOptions(sanitized);
        } catch (_) {}
      }

      const storedBundleItems = localStorage.getItem(STORAGE_KEYS.BUNDLE_ITEMS);
      if (storedBundleItems) {
        try {
          const parsedBundleItems = JSON.parse(storedBundleItems);
          if (Array.isArray(parsedBundleItems)) {
            setAddedBundleItems(parsedBundleItems);
          }
        } catch (_) {}
      }
    } catch (e) {
      console.warn("Error reading from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.error("Failed to save slots:", e);
    }
  }, [slots, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(customRecipes));
    } catch (e) {
      console.error("Failed to save customRecipes:", e);
    }
  }, [customRecipes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURATIONS, JSON.stringify(recipeCurations));
    } catch (e) {
      console.error(e);
    }
  }, [recipeCurations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
    } catch (e) {
      console.error(e);
    }
  }, [preferences, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKED_ITEMS, JSON.stringify(checkedItemIds));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItemIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(pantryItemIds));
    } catch (e) {
      console.error(e);
    }
  }, [pantryItemIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PANTRY_ITEMS, JSON.stringify(userPantryItems));
    } catch (e) {
      console.error(e);
    }
  }, [userPantryItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EXCLUDED_ITEMS, JSON.stringify(excludedItemIds));
    } catch (e) {
      console.error(e);
    }
  }, [excludedItemIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_OPTIONS, JSON.stringify(customOptions));
    } catch (e) {
      console.error(e);
    }
  }, [customOptions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPE_CATEGORIES, JSON.stringify(recipeCategoryOverrides));
    } catch (e) {
      console.error(e);
    }
  }, [recipeCategoryOverrides, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPE_REFERENCE_URLS, JSON.stringify(recipeReferenceUrls));
    } catch (e) {
      console.error(e);
    }
  }, [recipeReferenceUrls, isLoaded]);

  const lastRunKeyRef = useRef<string>("");

  // Recalculate grocery list whenever slots, preferences, or custom options change (async product fetch)
  useEffect(() => {
    if (!isLoaded) return;

    const slotsKey = slots
      .map(
        (s) =>
          `${s.id}:${s.recipe?.id}:${s.servings}:${s.recipe?.ingredients
            ?.map((ing) => `${ing.id || ing.name}_${ing.amount}_${ing.unit}`)
            .join(",") || ""}`
      )
      .join(";");
    const prefsKey = `${preferences.householdSize}:${preferences.prioritizeBulk}:${preferences.preferredSupermarkets.join(",")}`;
    const customOptsKey = Object.keys(customOptions).sort().join(",");
    const bundleKey = addedBundleItems
      .map((i) => `${i.ingredientId}:${i.selectedOption?.totalPrice}`)
      .join(";");
    const runKey = `${slotsKey}|${prefsKey}|${customOptsKey}|${bundleKey}`;

    if (runKey === lastRunKeyRef.current) {
      return;
    }
    lastRunKeyRef.current = runKey;

    let isCancelled = false;
    setIsOptimizing(true);

    generateOptimizedGroceryList(slots, preferences)
      .then((res) => {
        if (isCancelled) return;

        // Apply checked, pantry, and custom option state
        const updatedItems = res.items.map((item) => {
          const customOpt = customOptions[item.ingredientId];
          const isInvalidCustomOpt =
            customOpt &&
            ((item.ingredientId.includes("φέτα") && customOpt.product.name.toLowerCase().includes("τυροπιτάκ")) ||
             (item.ingredientId.includes("λεμόν") && customOpt.product.name.toLowerCase().includes("υγρομάντιλ")) ||
             (item.ingredientId.includes("ελαιόλαδ") && customOpt.product.name.toLowerCase().includes("αυγ")));

          const selectedOption = (!isInvalidCustomOpt && customOpt) || item.selectedOption;

          return {
            ...item,
            selectedOption,
            isChecked: checkedItemIds.includes(item.ingredientId),
            inPantry: pantryItemIds.includes(item.ingredientId),
            isExcluded: excludedItemIds.includes(item.ingredientId),
          };
        });

        // Combine with added bundle products (cleaning & baby care)
        const mappedBundleItems = addedBundleItems.map((item) => ({
          ...item,
          isChecked: checkedItemIds.includes(item.ingredientId),
          inPantry: pantryItemIds.includes(item.ingredientId),
          isExcluded: excludedItemIds.includes(item.ingredientId),
        }));
        const combinedItems = [...updatedItems, ...mappedBundleItems];

        const totals = computeCartTotals(combinedItems);
        const comparisons = computeBasketComparisons(
          combinedItems,
          preferences.preferredSupermarkets
        );

        setGroceryItems(combinedItems);
        setBasketComparisons(comparisons);
        setPantrySurplus(res.pantrySurplus);
        setTotalCost(totals.totalCost);
        setRemainingCost(totals.remainingCost);
        setPurchasedCost(totals.purchasedCost);
        setTotalSavings(totals.totalBulkSavings);
      })
      .finally(() => {
        if (!isCancelled) setIsOptimizing(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [slots, preferences, isLoaded, customOptions, addedBundleItems]);

  // Synchronously re-evaluate prices and comparisons whenever checked, pantry, or excluded status changes
  const applyInstantPriceRecalculation = (
    newCheckedIds: string[],
    newPantryIds: string[],
    newExcludedIds = excludedItemIds,
    newOptions = customOptions
  ) => {
    setGroceryItems((prevItems) => {
      const updated = prevItems.map((item) => {
        const customOpt = newOptions[item.ingredientId];
        const isInvalidCustomOpt =
          customOpt &&
          ((item.ingredientId.includes("φέτα") && customOpt.product.name.toLowerCase().includes("τυροπιτάκ")) ||
           (item.ingredientId.includes("λεμόν") && customOpt.product.name.toLowerCase().includes("υγρομάντιλ")) ||
           (item.ingredientId.includes("ελαιόλαδ") && customOpt.product.name.toLowerCase().includes("αυγ")));

        return {
          ...item,
          selectedOption: (!isInvalidCustomOpt && customOpt) || item.selectedOption,
          isChecked: newCheckedIds.includes(item.ingredientId),
          inPantry: newPantryIds.includes(item.ingredientId),
          isExcluded: newExcludedIds.includes(item.ingredientId),
        };
      });

      const totals = computeCartTotals(updated);
      const comparisons = computeBasketComparisons(
        updated,
        preferences.preferredSupermarkets
      );

      // Defer secondary state updates outside of updater callback so React 19 batches them without re-entrant renders
      queueMicrotask(() => {
        setTotalCost(totals.totalCost);
        setRemainingCost(totals.remainingCost);
        setPurchasedCost(totals.purchasedCost);
        setTotalSavings(totals.totalBulkSavings);
        setBasketComparisons(comparisons);
      });

      return updated;
    });
  };

  // Slot actions
  const assignRecipeToSlot = (
    day: number,
    mealType: MealType,
    recipe: Recipe | null,
    servings?: number,
    slotId?: string,
    courseType?: CourseType
  ) => {
    // Whenever a recipe is assigned, ensure it is added to customRecipes and persisted to database
    if (recipe !== null) {
      setCustomRecipes((prevCustom) => {
        if (!prevCustom.some((c) => c.id === recipe.id)) {
          const next = [recipe, ...prevCustom];
          try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(next));
          } catch (_) {}
          persistCustomRecipeToServer(recipe);
          return next;
        }
        return prevCustom;
      });
    }

    setSlots((prev) => {
      // 1. If slotId provided, update or delete that specific slot
      if (slotId) {
        if (recipe === null) {
          return prev.filter((s) => s.id !== slotId);
        }
        return prev.map((s) =>
          s.id === slotId
            ? {
                ...s,
                recipe,
                servings: servings || s.servings || preferences.householdSize || recipe.servings,
                courseType:
                  courseType ||
                  s.courseType ||
                  (recipe.id === "greek-salad-dakos" || recipe.category === "vegetarian" ? "salad" : "main"),
              }
            : s
        );
      }

      // 2. If no recipe provided and no slotId, nothing to add
      if (recipe === null) return prev;

      // Determine course type if not explicitly passed
      const determinedCourse: CourseType =
        courseType ||
        (mealType === "breakfast"
          ? "breakfast"
          : mealType === "snack"
          ? "snack"
          : recipe.id === "greek-salad-dakos" || recipe.category === "vegetarian"
          ? "salad"
          : "main");

      const newSlotId = `slot-${day}-${mealType}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const newSlot: MealSlot = {
        id: newSlotId,
        day: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        mealType,
        recipe,
        courseType: determinedCourse,
        servings: servings || preferences.householdSize || recipe.servings,
      };

      return [...prev, newSlot];
    });
  };

  const updateSlotServings = (slotId: string, servings: number) => {
    if (servings < 1 || servings > 24) return;
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, servings } : s))
    );
  };

  const removeSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const clearAllSlots = () => {
    setSlots([]);
    setCustomOptions({});
    setCheckedItemIds([]);
    setExcludedItemIds([]);
  };

  const loadDefaultWeek = () => {
    setSlots(INITIAL_MEAL_SLOTS);
    setCustomOptions({});
    setCheckedItemIds([]);
    setExcludedItemIds([]);
  };

  // Preference actions
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  // Grocery Item toggles - Immediate reactive recalculation
  const toggleItemChecked = (ingredientId: string) => {
    const nextChecked = checkedItemIds.includes(ingredientId)
      ? checkedItemIds.filter((id) => id !== ingredientId)
      : [...checkedItemIds, ingredientId];

    setCheckedItemIds(nextChecked);
    applyInstantPriceRecalculation(nextChecked, pantryItemIds, excludedItemIds);
  };

  const toggleItemPantry = (ingredientId: string) => {
    const nextPantry = pantryItemIds.includes(ingredientId)
      ? pantryItemIds.filter((id) => id !== ingredientId)
      : [...pantryItemIds, ingredientId];

    setPantryItemIds(nextPantry);
    applyInstantPriceRecalculation(checkedItemIds, nextPantry, excludedItemIds);
  };

  const toggleItemExcluded = (ingredientId: string) => {
    const isCurrentlyExcluded = excludedItemIds.includes(ingredientId);
    const nextExcluded = isCurrentlyExcluded
      ? excludedItemIds.filter((id) => id !== ingredientId)
      : [...excludedItemIds, ingredientId];

    // If excluding, also ensure it's removed from checked items
    const nextChecked = !isCurrentlyExcluded
      ? checkedItemIds.filter((id) => id !== ingredientId)
      : checkedItemIds;

    setExcludedItemIds(nextExcluded);
    setCheckedItemIds(nextChecked);
    applyInstantPriceRecalculation(nextChecked, pantryItemIds, nextExcluded);
  };

  const excludeMultipleItems = (ingredientIds: string[]) => {
    if (ingredientIds.length === 0) return;
    const idsSet = new Set(ingredientIds);
    const nextExcluded = Array.from(new Set([...excludedItemIds, ...ingredientIds]));
    const nextChecked = checkedItemIds.filter((id) => !idsSet.has(id));

    setExcludedItemIds(nextExcluded);
    setCheckedItemIds(nextChecked);
    applyInstantPriceRecalculation(nextChecked, pantryItemIds, nextExcluded);
  };

  const restoreExcludedItems = (ingredientIds: string[]) => {
    if (ingredientIds.length === 0) return;
    const idsSet = new Set(ingredientIds);
    const nextExcluded = excludedItemIds.filter((id) => !idsSet.has(id));

    setExcludedItemIds(nextExcluded);
    applyInstantPriceRecalculation(checkedItemIds, pantryItemIds, nextExcluded);
  };

  const restoreAllExcludedItems = () => {
    setExcludedItemIds([]);
    applyInstantPriceRecalculation(checkedItemIds, pantryItemIds, []);
  };

  const clearExcludedItemsPermanently = () => {
    // If any excluded items were added bundle items, remove them permanently from addedBundleItems
    if (excludedItemIds.length > 0) {
      const excludedSet = new Set(excludedItemIds);
      setAddedBundleItems((prev) => {
        const next = prev.filter((item) => !excludedSet.has(item.ingredientId));
        try {
          localStorage.setItem(STORAGE_KEYS.BUNDLE_ITEMS, JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
    setExcludedItemIds([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.EXCLUDED_ITEMS);
    } catch (_) {}
    applyInstantPriceRecalculation(checkedItemIds, pantryItemIds, []);
  };

  // Select an alternate package / supermarket option for an item
  const updateItemPackOption = (ingredientId: string, option: PackOption) => {
    const nextOptions = { ...customOptions, [ingredientId]: option };
    setCustomOptions(nextOptions);
    applyInstantPriceRecalculation(checkedItemIds, pantryItemIds, excludedItemIds, nextOptions);
  };

  // Curate a recipe ingredient by mapping it to a specific product
  const curateIngredientProduct = (recipeId: string, ingredientId: string, product: Product) => {
    setRecipeCurations((prev) => {
      const next = {
        ...prev,
        [recipeId]: {
          ...(prev[recipeId] || {}),
          [ingredientId]: product,
        },
      };
      return next;
    });

    // Update recipe in customRecipes and persist to database
    setCustomRecipes((prev) => {
      const target = prev.find((r) => r.id === recipeId) || allRecipes.find((r) => r.id === recipeId);
      if (target) {
        const updatedRecipe: Recipe = {
          ...target,
          ingredients: target.ingredients.map((ing) =>
            ing.id === ingredientId
              ? {
                  ...ing,
                  curatedProduct: product,
                  curatedProductId: product.id,
                  isCurated: true,
                }
              : ing
          ),
        };
        persistCustomRecipeToServer(updatedRecipe);
        return prev.some((r) => r.id === recipeId)
          ? prev.map((r) => (r.id === recipeId ? updatedRecipe : r))
          : [...prev, updatedRecipe];
      }
      return prev;
    });

    // Update the ingredient in meal slots if currently scheduled
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.recipe && slot.recipe.id === recipeId) {
          return {
            ...slot,
            recipe: {
              ...slot.recipe,
              ingredients: slot.recipe.ingredients.map((ing) =>
                ing.id === ingredientId
                  ? {
                      ...ing,
                      curatedProduct: product,
                      curatedProductId: product.id,
                      isCurated: true,
                    }
                  : ing
              ),
            },
          };
        }
        return slot;
      })
    );
  };

  // Curate / change an ingredient product directly from the grocery list
  const curateGroceryIngredient = (ingredientQuery: string, product: Product) => {
    // 1. Update any slots having ingredients matching ingredientQuery
    setSlots((prev) =>
      prev.map((slot) => {
        if (!slot.recipe) return slot;
        let modified = false;
        const newIngredients = slot.recipe.ingredients.map((ing) => {
          if (
            ing.posokaneiQuery.toLowerCase().trim() === ingredientQuery.toLowerCase().trim() ||
            ing.name.toLowerCase().trim() === ingredientQuery.toLowerCase().trim() ||
            ing.id === ingredientQuery
          ) {
            modified = true;
            return {
              ...ing,
              curatedProduct: product,
              curatedProductId: product.id,
              isCurated: true,
            };
          }
          return ing;
        });

        if (modified) {
          return {
            ...slot,
            recipe: {
              ...slot.recipe,
              ingredients: newIngredients,
            },
          };
        }
        return slot;
      })
    );

    // 2. If it's a bundle item, update addedBundleItems
    if (ingredientQuery.startsWith("bundle-")) {
      setAddedBundleItems((prev) => {
        const next = prev.map((item) => {
          if (item.ingredientId === ingredientQuery) {
            const itemPrice = product.price_stats?.min_price || product.retailer_prices?.[0]?.price || 3.0;
            const lineTotal = Math.round(itemPrice * item.rawRequiredAmount * 100) / 100;
            const storeId = product.retailer_prices?.[0]?.retailer || "sklavenitis";
            const storeName = product.retailer_prices?.[0]?.retailer_display_name || "Σκλαβενίτης";
            return {
              ...item,
              ingredientName: product.name,
              curatedProduct: product,
              isCurated: true,
              selectedOption: {
                ...item.selectedOption!,
                product,
                unitPrice: itemPrice,
                totalPrice: lineTotal,
                retailer: storeId,
                retailerName: storeName,
              },
            };
          }
          return item;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.BUNDLE_ITEMS, JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }

    // 3. Immediately reflect in groceryItems and re-evaluate pricing
    setGroceryItems((prev) => {
      const next = prev.map((item) => {
        if (
          item.ingredientId === ingredientQuery ||
          item.ingredientName.toLowerCase().trim() === ingredientQuery.toLowerCase().trim()
        ) {
          const options = evaluatePackOptions(
            product,
            item.normalizedRequiredAmount || item.rawRequiredAmount,
            preferences.preferredSupermarkets,
            item.normalizedUnit || item.rawUnit
          );
          const bestOption = options[0] || item.selectedOption;
          const newSurplus = bestOption
            ? Number(
                Math.max(
                  0,
                  bestOption.totalQuantity -
                    (item.normalizedRequiredAmount || item.rawRequiredAmount)
                ).toFixed(2)
              )
            : item.surplusAmount;
          return {
            ...item,
            ingredientName: product.name,
            curatedProduct: product,
            isCurated: true,
            isAvailable: true,
            isSynthetic: false,
            selectedOption: bestOption,
            alternativeOptions: options.slice(1),
            surplusAmount: newSurplus,
          };
        }
        return item;
      });

      const totals = computeCartTotals(next);
      const comparisons = computeBasketComparisons(next, preferences.preferredSupermarkets);
      setTotalCost(totals.totalCost);
      setRemainingCost(totals.remainingCost);
      setPurchasedCost(totals.purchasedCost);
      setTotalSavings(totals.totalBulkSavings);
      setBasketComparisons(comparisons);
      return next;
    });
  };

  // Reset an ingredient's curation back to default auto-mapped product
  const resetIngredientCuration = (recipeId: string, ingredientId: string) => {
    setRecipeCurations((prev) => {
      if (!prev[recipeId]) return prev;
      const copy = { ...prev[recipeId] };
      delete copy[ingredientId];
      return { ...prev, [recipeId]: copy };
    });

    // Restore default curated product in active meal slots
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.recipe && slot.recipe.id === recipeId) {
          return {
            ...slot,
            recipe: {
              ...slot.recipe,
              ingredients: slot.recipe.ingredients.map((ing) => {
                if (ing.id === ingredientId) {
                  const defaultCurated =
                    getCuratedDefaultProduct(ing.posokaneiQuery) ||
                    getCuratedDefaultProduct(ing.name);
                  return {
                    ...ing,
                    curatedProduct: defaultCurated || undefined,
                    curatedProductId: defaultCurated?.id,
                    isCurated: !!defaultCurated,
                  };
                }
                return ing;
              }),
            },
          };
        }
        return slot;
      })
    );
  };

  // Pantry Item CRUD Operations
  const addPantryItem = (item: Omit<UserPantryItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: UserPantryItem = {
      ...item,
      id: `pantry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserPantryItems((prev) => [newItem, ...prev]);
  };

  const updatePantryItem = (id: string, updates: Partial<UserPantryItem>) => {
    setUserPantryItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deletePantryItem = (id: string) => {
    setUserPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addSurplusToPantry = (surplus: PantrySurplusItem) => {
    const newItem: UserPantryItem = {
      id: `pantry-surplus-${Date.now()}`,
      name: surplus.ingredientName,
      amount: surplus.amount,
      unit: surplus.unit,
      category: surplus.category,
      notes: `Πλεόνασμα από: ${surplus.originMealNames.join(", ")}`,
      isSurplus: true,
      originMealNames: surplus.originMealNames,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserPantryItems((prev) => [newItem, ...prev]);
  };

  // Helper to persist custom recipe to server disk
  const persistCustomRecipeToServer = async (recipe: Recipe) => {
    try {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
    } catch (err) {
      console.warn("Failed to persist recipe to server:", err);
    }
  };

  // Helper to delete custom recipe from server disk
  const deleteCustomRecipeFromServer = async (recipeId: string) => {
    try {
      await fetch(`/api/recipes?id=${encodeURIComponent(recipeId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to delete recipe from server:", err);
    }
  };

  // All recipes (seeded + custom + any currently assigned on meal slots), overlaid with curations and overrides
  const allRecipes: Recipe[] = (() => {
    const map = new Map<string, Recipe>();

    // 1. Seed recipes
    for (const r of SEED_RECIPES) {
      if (r && r.id) map.set(r.id, r);
    }

    // 2. Custom recipes
    for (const r of customRecipes) {
      if (r && r.id) map.set(r.id, r);
    }

    // 3. Any recipes currently in meal slots
    for (const slot of slots) {
      if (slot?.recipe && slot.recipe.id && !map.has(slot.recipe.id)) {
        map.set(slot.recipe.id, slot.recipe);
      }
    }

    return Array.from(map.values()).map((recipe) => {
      const curations = recipeCurations[recipe.id];
      const categoryOverride = recipeCategoryOverrides[recipe.id];
      const refUrlOverride = recipeReferenceUrls[recipe.id];

      let base = recipe;
      if (categoryOverride) {
        base = { ...base, category: categoryOverride };
      }
      if (refUrlOverride !== undefined) {
        base = { ...base, referenceUrl: refUrlOverride || undefined };
      }

      if (!curations) return base;
      const baseIngredients = Array.isArray(base.ingredients) ? base.ingredients : [];
      return {
        ...base,
        ingredients: baseIngredients.map((ing) => {
          if (!ing) return ing;
          if (curations[ing.id]) {
            return {
              ...ing,
              curatedProduct: curations[ing.id],
              curatedProductId: curations[ing.id].id,
              isCurated: true,
            };
          }
          return ing;
        }),
      };
    });
  })();

  const updateRecipeCategory = (recipeId: string, category: RecipeCategory) => {
    setRecipeCategoryOverrides((prev) => ({
      ...prev,
      [recipeId]: category,
    }));

    // Update recipe in customRecipes and persist to server
    setCustomRecipes((prev) => {
      const match = prev.find((r) => r.id === recipeId) || allRecipes.find((r) => r.id === recipeId);
      if (match) {
        const updated = { ...match, category };
        persistCustomRecipeToServer(updated);
        return prev.some((r) => r.id === recipeId)
          ? prev.map((r) => (r.id === recipeId ? updated : r))
          : [...prev, updated];
      }
      return prev;
    });

    // Also update any scheduled meal slots using this recipe
    setSlots((prev) =>
      prev.map((slot) =>
        slot.recipe?.id === recipeId
          ? {
              ...slot,
              recipe: {
                ...slot.recipe,
                category,
              },
            }
          : slot
      )
    );
  };

  const updateRecipeReferenceUrl = (recipeId: string, referenceUrl: string) => {
    const trimmed = referenceUrl.trim();
    setRecipeReferenceUrls((prev) => ({
      ...prev,
      [recipeId]: trimmed,
    }));

    // Update recipe in customRecipes and persist to server
    setCustomRecipes((prev) => {
      const match = prev.find((r) => r.id === recipeId) || allRecipes.find((r) => r.id === recipeId);
      if (match) {
        const updated = { ...match, referenceUrl: trimmed || undefined };
        persistCustomRecipeToServer(updated);
        return prev.some((r) => r.id === recipeId)
          ? prev.map((r) => (r.id === recipeId ? updated : r))
          : [...prev, updated];
      }
      return prev;
    });

    // Also update any scheduled meal slots using this recipe
    setSlots((prev) =>
      prev.map((slot) =>
        slot.recipe?.id === recipeId
          ? {
              ...slot,
              recipe: {
                ...slot.recipe,
                referenceUrl: trimmed || undefined,
              },
            }
          : slot
      )
    );
  };

  const addCustomRecipe = (recipe: Recipe) => {
    setCustomRecipes((prev) => {
      const next = [recipe, ...prev.filter((r) => r.id !== recipe.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    persistCustomRecipeToServer(recipe);
  };

  const updateCustomRecipe = (recipe: Recipe) => {
    setCustomRecipes((prev) => {
      const next = prev.some((r) => r.id === recipe.id)
        ? prev.map((r) => (r.id === recipe.id ? recipe : r))
        : [recipe, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    persistCustomRecipeToServer(recipe);

    // Also update any scheduled meal slots using this recipe and persist
    setSlots((prev) => {
      const next = prev.map((slot) => (slot.recipe?.id === recipe.id ? { ...slot, recipe } : slot));
      try {
        localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    // Invalidate optimizer memoization so that changes are immediately reflected
    lastRunKeyRef.current = "";
  };

  const addIngredientToRecipe = (recipeId: string, ingredient: Ingredient) => {
    setCustomRecipes((prev) => {
      const match = prev.find((r) => r.id === recipeId) || allRecipes.find((r) => r.id === recipeId);
      if (match) {
        const updatedIngredients = [...(match.ingredients || []), ingredient];
        const updated: Recipe = { ...match, ingredients: updatedIngredients };
        persistCustomRecipeToServer(updated);
        return prev.some((r) => r.id === recipeId)
          ? prev.map((r) => (r.id === recipeId ? updated : r))
          : [...prev, updated];
      }
      return prev;
    });

    // Also update any scheduled meal slots using this recipe and persist
    setSlots((prev) => {
      const next = prev.map((slot) => {
        if (slot.recipe?.id === recipeId) {
          const updatedIngredients = [...(slot.recipe.ingredients || []), ingredient];
          return {
            ...slot,
            recipe: {
              ...slot.recipe,
              ingredients: updatedIngredients,
            },
          };
        }
        return slot;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    lastRunKeyRef.current = "";
  };

  const deleteCustomRecipe = (recipeId: string) => {
    setCustomRecipes((prev) => {
      const next = prev.filter((r) => r.id !== recipeId);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    deleteCustomRecipeFromServer(recipeId);

    setSlots((prev) =>
      prev.map((slot) => (slot.recipe?.id === recipeId ? { ...slot, recipe: null } : slot))
    );
  };

  const addBundleToGroceryList = (bundle: ProductBundle) => {
    const newItems: OptimizedGroceryItem[] = bundle.items.map((item) => {
      const itemPrice = item.curatedProduct?.price_stats?.min_price || item.referencePriceEur || 3.0;
      const storeId = bundle.bestStoreId || "sklavenitis";
      const storeName = bundle.bestStoreName || "Σκλαβενίτης";
      const lineTotal = Math.round(itemPrice * item.quantity * 100) / 100;

      return {
        ingredientId: `bundle-${bundle.id}-${item.id}`,
        ingredientName: `${item.name} (${item.brand})`,
        category: (bundle.category === "cleaning" ? "household" : "baby") as any,
        rawRequiredAmount: item.quantity,
        rawUnit: item.unitLabel,
        normalizedRequiredAmount: item.quantity,
        normalizedUnit: "τεμ",
        selectedOption: {
          product: item.curatedProduct || {
            id: item.productId || item.id,
            name: item.name,
            brand: item.brand,
            category: bundle.category,
            category_ids: [],
            unit: "τεμ",
            unit_quantity: 1,
            has_image: false,
            image_url: null,
            private_label: false,
            price_drop: false,
            available_countries: ["GR"],
            is_international: false,
            retailers: [storeId],
            price_stats: {
              min_price: itemPrice,
              max_price: itemPrice,
              avg_price: itemPrice,
              min_unit_price: itemPrice,
              retailer_count: 1,
            },
            retailer_prices: [
              {
                retailer: storeId,
                retailer_display_name: storeName,
                retailer_name: item.name,
                price: itemPrice,
                price_normalized: itemPrice,
                is_discount: false,
                discount_percentage: null,
                last_updated: "2026-10-20",
                country: "GR",
              },
            ],
          },
          packSize: 1,
          packUnit: item.unitLabel,
          packCount: item.quantity,
          totalQuantity: item.quantity,
          totalPrice: lineTotal,
          unitPrice: itemPrice,
          retailer: storeId,
          retailerName: storeName,
          isBulk: item.quantity > 1,
          isSynthetic: false,
          isAvailable: true,
        },
        alternativeOptions: [],
        surplusAmount: 0,
        surplusUnit: "τεμ",
        isChecked: false,
        inPantry: false,
        isExcluded: false,
        curatedProduct: item.curatedProduct,
        isCurated: true,
        isUnmatched: false,
        isAvailable: true,
        sourceMealTitles: [bundle.title],
      };
    });

    setAddedBundleItems((prev) => {
      const existingIds = new Set(newItems.map((i) => i.ingredientId));
      const filtered = prev.filter((i) => !existingIds.has(i.ingredientId));
      const next = [...filtered, ...newItems];
      try {
        localStorage.setItem(STORAGE_KEYS.BUNDLE_ITEMS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    // Synchronously ensure groceryItems reflects the added bundle immediately
    setGroceryItems((prev) => {
      const existingIds = new Set(newItems.map((i) => i.ingredientId));
      const filtered = prev.filter((i) => !existingIds.has(i.ingredientId));
      const combined = [...filtered, ...newItems];
      const totals = computeCartTotals(combined);
      const comparisons = computeBasketComparisons(combined, preferences.preferredSupermarkets);
      setBasketComparisons(comparisons);
      setTotalCost(totals.totalCost);
      setRemainingCost(totals.remainingCost);
      setPurchasedCost(totals.purchasedCost);
      setTotalSavings(totals.totalBulkSavings);
      return combined;
    });
  };

  const clearBundleGroceryItems = () => {
    setAddedBundleItems([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.BUNDLE_ITEMS);
    } catch (_) {}
    setGroceryItems((prev) => {
      const withoutBundles = prev.filter((i) => !i.ingredientId.startsWith("bundle-"));
      const totals = computeCartTotals(withoutBundles);
      const comparisons = computeBasketComparisons(withoutBundles, preferences.preferredSupermarkets);
      setBasketComparisons(comparisons);
      setTotalCost(totals.totalCost);
      setRemainingCost(totals.remainingCost);
      setPurchasedCost(totals.purchasedCost);
      setTotalSavings(totals.totalBulkSavings);
      return withoutBundles;
    });
  };

  const clearGroceryList = (options?: { clearSlots?: boolean }) => {
    setAddedBundleItems([]);
    setCheckedItemIds([]);
    setExcludedItemIds([]);
    setCustomOptions({});
    try {
      localStorage.removeItem(STORAGE_KEYS.BUNDLE_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.CHECKED_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.EXCLUDED_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_OPTIONS);
    } catch (_) {}

    if (options?.clearSlots) {
      clearAllSlots();
      setGroceryItems([]);
      setBasketComparisons([]);
      setTotalCost(0);
      setRemainingCost(0);
      setPurchasedCost(0);
      setTotalSavings(0);
    } else {
      setGroceryItems((prev) => {
        const withoutBundles = prev
          .filter((i) => !i.ingredientId.startsWith("bundle-"))
          .map((i) => ({ ...i, isChecked: false, isExcluded: false }));
        const totals = computeCartTotals(withoutBundles);
        const comparisons = computeBasketComparisons(withoutBundles, preferences.preferredSupermarkets);
        setBasketComparisons(comparisons);
        setTotalCost(totals.totalCost);
        setRemainingCost(totals.remainingCost);
        setPurchasedCost(totals.purchasedCost);
        setTotalSavings(totals.totalBulkSavings);
        return withoutBundles;
      });
    }
  };

  return {
    slots,
    preferences,
    allRecipes,
    recipeCurations,
    recipeCategoryOverrides,
    groceryItems,
    basketComparisons,
    pantrySurplus,
    userPantryItems,
    addedBundleItems,
    addBundleToGroceryList,
    clearBundleGroceryItems,
    clearGroceryList,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    addSurplusToPantry,
    totalCost,
    remainingCost,
    purchasedCost,
    totalSavings,
    isOptimizing,
    isLoaded,
    assignRecipeToSlot,
    updateSlotServings,
    removeSlot,
    clearAllSlots,
    loadDefaultWeek,
    updatePreferences,
    toggleItemChecked,
    toggleItemPantry,
    toggleItemExcluded,
    excludeMultipleItems,
    restoreExcludedItems,
    restoreAllExcludedItems,
    clearExcludedItemsPermanently,
    excludedItemIds,
    updateItemPackOption,
    curateIngredientProduct,
    curateGroceryIngredient,
    resetIngredientCuration,
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
    addIngredientToRecipe,
    updateRecipeCategory,
    updateRecipeReferenceUrl,
    recipeReferenceUrls,
  };
}
