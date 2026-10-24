import { Recipe } from "@/types/meal-planner";
import { getCuratedDefaultProduct } from "./curated-products";
import { BREAKFAST_RECIPES } from "./data/breakfast-recipes";
import { LUNCH_RECIPES } from "./data/lunch-recipes";
import { DINNER_RECIPES } from "./data/dinner-recipes";
import { SNACK_RECIPES } from "./data/snack-recipes";

/**
 * 80 Genuine Greek Recipes curated with authentic internet URLs and ingredients:
 * - 20 Breakfast
 * - 30 Lunch
 * - 20 Dinner
 * - 10 Snacks
 */
export const RAW_SEED_RECIPES: Recipe[] = [
  ...BREAKFAST_RECIPES,
  ...LUNCH_RECIPES,
  ...DINNER_RECIPES,
  ...SNACK_RECIPES,
];

/**
 * Pre-curate genuine Greek supermarket products from posokanei.gov.gr for all ingredients
 */
export const SEED_RECIPES: Recipe[] = RAW_SEED_RECIPES.map((recipe) => ({
  ...recipe,
  isCurated: true,
  ingredients: recipe.ingredients.map((ing) => {
    const curated =
      getCuratedDefaultProduct(ing.posokaneiQuery) ||
      getCuratedDefaultProduct(ing.name);
    return {
      ...ing,
      curatedProductId: curated?.id,
      curatedProduct: curated || undefined,
      isCurated: !!curated,
    };
  }),
}));
