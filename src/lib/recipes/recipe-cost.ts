import { Ingredient, Recipe, AisleCategory } from "@/types/meal-planner";
import { Product, RetailerPrice } from "@/lib/posokanei/types";
import { getCuratedDefaultProduct } from "@/lib/recipes/curated-products";

export interface IngredientCost {
  ingredientId: string;
  ingredientName: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  unitPrice: number;
  unitLabel: string;
  productName?: string;
  retailer?: string;
  retailerDisplayName?: string;
  isPriced: boolean;
}

export interface RecipeCostBreakdown {
  totalEstimatedCost: number;
  costPerServing: number;
  servings: number;
  ingredientCosts: IngredientCost[];
  pricedCount: number;
  totalCount: number;
  cheapestRetailer?: string;
}

// Fallback price per kg or L by aisle category when no supermarket product is directly mapped
const CATEGORY_FALLBACK_UNIT_PRICES: Record<AisleCategory, number> = {
  dairy: 8.5,     // ~8.50 €/kg
  meat: 10.5,     // ~10.50 €/kg
  produce: 1.8,   // ~1.80 €/kg
  pantry: 3.2,    // ~3.20 €/kg
  bakery: 2.8,    // ~2.80 €/kg
  beverages: 1.5, // ~1.50 €/L
  household: 2.5, // ~2.50 €/τεμ
  baby: 4.5,      // ~4.50 €/τεμ
};

/**
 * Normalizes an ingredient amount to standard units (kg, L, τεμ)
 */
function normalizeAmountAndUnit(
  amount: number,
  unit: string,
  category: AisleCategory
): { normalizedAmount: number; normalizedUnit: "kg" | "L" | "τεμ" } {
  const u = (unit || "").toLowerCase().trim();

  if (u === "g" || u === "gr" || u === "γρ" || u === "γραμμάρια") {
    return { normalizedAmount: amount / 1000, normalizedUnit: "kg" };
  }
  if (u === "kg" || u === "κιλό" || u === "κιλά") {
    return { normalizedAmount: amount, normalizedUnit: "kg" };
  }
  if (u === "ml" || u === "μλ") {
    return { normalizedAmount: amount / 1000, normalizedUnit: "L" };
  }
  if (u === "l" || u === "λίτρο" || u === "λίτρα") {
    return { normalizedAmount: amount, normalizedUnit: "L" };
  }
  if (u === "κ.σ." || u === "κουταλιά" || u === "κουταλιές") {
    return { normalizedAmount: (amount * 15) / 1000, normalizedUnit: "kg" };
  }
  if (u === "κ.γ." || u === "κουταλάκι" || u === "κουταλάκια") {
    return { normalizedAmount: (amount * 5) / 1000, normalizedUnit: "kg" };
  }
  if (u === "πρέζα" || u === "πρέζες") {
    return { normalizedAmount: 0.002, normalizedUnit: "kg" };
  }

  // If pieces ("τεμ", "σκέλ.", "φύλλα", etc.)
  if (category === "produce") {
    // E.g. 1 onion / 1 lemon / 1 potato ~ 120-150g = 0.13 kg
    return { normalizedAmount: amount * 0.13, normalizedUnit: "kg" };
  }
  if (category === "dairy" && (u === "αυγό" || u === "αυγά" || u === "τεμ")) {
    // 1 egg ~ 0.28 € per piece
    return { normalizedAmount: amount, normalizedUnit: "τεμ" };
  }

  return { normalizedAmount: Math.max(0.01, amount), normalizedUnit: "τεμ" };
}

/**
 * Calculates estimated cost for a single ingredient
 */
export function calculateIngredientCost(
  ingredient: Ingredient,
  preferredSupermarkets?: string[]
): IngredientCost {
  const product: Product | null =
    ingredient.curatedProduct ||
    getCuratedDefaultProduct(ingredient.posokaneiQuery) ||
    getCuratedDefaultProduct(ingredient.name);

  const { normalizedAmount, normalizedUnit } = normalizeAmountAndUnit(
    ingredient.amount,
    ingredient.unit,
    ingredient.category
  );

  if (product) {
    const allPrices = product.retailer_prices || [];
    const eligiblePrices =
      preferredSupermarkets && preferredSupermarkets.length > 0
        ? allPrices.filter((rp) => preferredSupermarkets.includes(rp.retailer))
        : allPrices;

    const pricesToConsider: RetailerPrice[] =
      eligiblePrices.length > 0 ? eligiblePrices : allPrices;

    let bestUnitPrice = 0;
    let bestRetailer: string | undefined;
    let bestRetailerName: string | undefined;

    if (pricesToConsider.length > 0) {
      // Sort by normalized price ascending to pick cheapest supermarket price
      const sorted = [...pricesToConsider].sort((a, b) => {
        const pA =
          a.price_normalized > 0
            ? a.price_normalized
            : product.unit_quantity > 0
            ? a.price / product.unit_quantity
            : a.price;
        const pB =
          b.price_normalized > 0
            ? b.price_normalized
            : product.unit_quantity > 0
            ? b.price / product.unit_quantity
            : b.price;
        return pA - pB;
      });

      const best = sorted[0];
      bestUnitPrice =
        best.price_normalized > 0
          ? best.price_normalized
          : product.unit_quantity > 0
          ? best.price / product.unit_quantity
          : best.price;
      bestRetailer = best.retailer;
      bestRetailerName = best.retailer_display_name || best.retailer;
    } else if (product.price_stats?.min_unit_price && product.price_stats.min_unit_price > 0) {
      bestUnitPrice = product.price_stats.min_unit_price;
    } else if (product.price_stats?.min_price && product.price_stats.min_price > 0) {
      bestUnitPrice =
        product.unit_quantity > 0
          ? product.price_stats.min_price / product.unit_quantity
          : product.price_stats.min_price;
    }

    if (bestUnitPrice > 0) {
      const estimatedCost = Number((normalizedAmount * bestUnitPrice).toFixed(2));
      return {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        estimatedCost: Math.max(0.04, estimatedCost),
        unitPrice: Number(bestUnitPrice.toFixed(2)),
        unitLabel: `€/${normalizedUnit}`,
        productName: product.name,
        retailer: bestRetailer,
        retailerDisplayName: bestRetailerName,
        isPriced: true,
      };
    }
  }

  // Fallback estimation using market staple averages
  const fallbackUnitPrice = CATEGORY_FALLBACK_UNIT_PRICES[ingredient.category] || 3.0;
  const estimatedCost = Number((normalizedAmount * fallbackUnitPrice).toFixed(2));

  return {
    ingredientId: ingredient.id,
    ingredientName: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    estimatedCost: Math.max(0.05, estimatedCost),
    unitPrice: Number(fallbackUnitPrice.toFixed(2)),
    unitLabel: `€/${normalizedUnit}`,
    isPriced: false,
  };
}

/**
 * Calculates complete recipe cost and cost per portion
 */
export function calculateRecipeCost(
  recipe: Recipe,
  preferredSupermarkets?: string[]
): RecipeCostBreakdown {
  if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
    return {
      totalEstimatedCost: 0,
      costPerServing: 0,
      servings: recipe?.servings || 4,
      ingredientCosts: [],
      pricedCount: 0,
      totalCount: 0,
    };
  }

  const ingredientCosts = recipe.ingredients.map((ing) =>
    calculateIngredientCost(ing, preferredSupermarkets)
  );

  const totalEstimatedCost = Number(
    ingredientCosts.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2)
  );

  const servings = Math.max(1, recipe.servings || 4);
  const costPerServing = Number((totalEstimatedCost / servings).toFixed(2));
  const pricedCount = ingredientCosts.filter((i) => i.isPriced).length;

  // Track most frequent cheapest retailer in recipe ingredients
  const retailerOccurrences: Record<string, number> = {};
  ingredientCosts.forEach((i) => {
    if (i.retailerDisplayName) {
      retailerOccurrences[i.retailerDisplayName] =
        (retailerOccurrences[i.retailerDisplayName] || 0) + 1;
    }
  });

  const cheapestRetailer = Object.entries(retailerOccurrences).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  return {
    totalEstimatedCost,
    costPerServing,
    servings,
    ingredientCosts,
    pricedCount,
    totalCount: recipe.ingredients.length,
    cheapestRetailer,
  };
}
