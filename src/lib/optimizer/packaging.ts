import {
  MealSlot,
  OptimizedGroceryItem,
  PackOption,
  BasketComparison,
  PantrySurplusItem,
  UserPreferences,
  AisleCategory,
} from "@/types/meal-planner";
import { Product, RetailerPrice } from "@/lib/posokanei/types";
import { searchProducts } from "@/lib/posokanei/client";
import { MOCK_FALLBACK_PRODUCTS, MOCK_RETAILERS } from "@/lib/posokanei/mock-data";
import { getCuratedDefaultProduct } from "@/lib/recipes/curated-products";

interface AggregatedIngredient {
  name: string;
  query: string;
  category: AisleCategory;
  totalRawAmount: number;
  rawUnit: string;
  normalizedAmount: number; // in kg or L
  normalizedUnit: string;
  sourceMealTitles: string[];
  curatedProduct?: Product;
  isCurated?: boolean;
}

/**
 * Aggregates all ingredients across the scheduled meals in a weekly plan
 */
export function aggregateIngredients(
  slots: MealSlot[],
  householdSize: number
): AggregatedIngredient[] {
  const map = new Map<string, AggregatedIngredient>();

  for (const slot of slots) {
    if (!slot.recipe) continue;

    const recipe = slot.recipe;
    // Scale factor based on slot servings or household size
    const servings = slot.servings || householdSize || recipe.servings;
    const scale = servings / recipe.servings;

    for (const ing of recipe.ingredients) {
      const scaledAmount = ing.amount * scale;
      const key = ing.posokaneiQuery.toLowerCase().trim();

      let normalizedAmount: number = scaledAmount;
      let normalizedUnit: string = ing.unit;

      if (ing.unit === "g") {
        normalizedAmount = scaledAmount / 1000;
        normalizedUnit = "kg";
      } else if (ing.unit === "ml") {
        normalizedAmount = scaledAmount / 1000;
        normalizedUnit = "L";
      }

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.totalRawAmount += scaledAmount;
        existing.normalizedAmount += normalizedAmount;
        if (!existing.sourceMealTitles.includes(recipe.title)) {
          existing.sourceMealTitles.push(recipe.title);
        }
        if (!existing.curatedProduct) {
          const def =
            ing.curatedProduct ||
            getCuratedDefaultProduct(ing.posokaneiQuery) ||
            getCuratedDefaultProduct(ing.name) ||
            undefined;
          existing.curatedProduct = def;
          existing.isCurated = !!def;
        }
      } else {
        const curated =
          ing.curatedProduct ||
          getCuratedDefaultProduct(ing.posokaneiQuery) ||
          getCuratedDefaultProduct(ing.name) ||
          undefined;

        map.set(key, {
          name: ing.name,
          query: ing.posokaneiQuery,
          category: ing.category,
          totalRawAmount: scaledAmount,
          rawUnit: ing.unit,
          normalizedAmount,
          normalizedUnit,
          sourceMealTitles: [recipe.title],
          curatedProduct: curated,
          isCurated: !!curated,
        });
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Evaluates packaging options from posokanei products for a given required amount
 */
export function evaluatePackOptions(
  product: Product,
  requiredAmount: number,
  preferredSupermarkets: string[]
): PackOption[] {
  const options: PackOption[] = [];
  const packSize = product.unit_quantity || 1.0;
  const packUnit = product.unit || "kg";

  // Filter retailer prices to preferred stores if specified
  const eligiblePrices = (product.retailer_prices || []).filter((rp) => {
    if (preferredSupermarkets.length === 0) return true;
    return preferredSupermarkets.includes(rp.retailer);
  });

  const pricesToEvaluate =
    eligiblePrices.length > 0 ? eligiblePrices : (product.retailer_prices || []);

  if (pricesToEvaluate.length > 0) {
    for (const rp of pricesToEvaluate) {
      const packCount = Math.max(1, Math.ceil(requiredAmount / packSize));
      const totalQuantity = packCount * packSize;
      const totalPrice = Number((packCount * rp.price).toFixed(2));
      const unitPrice = Number(
        (rp.price_normalized || (packSize > 0 ? rp.price / packSize : rp.price)).toFixed(2)
      );

      const isBulk = packSize >= 1.0 || packCount >= 2;

      options.push({
        product,
        packSize,
        packUnit,
        packCount,
        totalQuantity,
        totalPrice,
        unitPrice,
        retailer: rp.retailer,
        retailerName:
          (rp.retailer_display_name && rp.retailer_display_name.toLowerCase() !== "market_in" && rp.retailer_display_name.toLowerCase() !== "market-in")
            ? rp.retailer_display_name
            : (rp.retailer === "market_in" || rp.retailer === "market-in" || rp.retailer === "marketin")
            ? "Market In"
            : rp.retailer_display_name || rp.retailer,
        isBulk,
      });
    }
  } else if (product.price_stats && product.price_stats.min_price > 0) {
    // If retailer_prices is empty but price_stats exists
    const fallbackRetailer = preferredSupermarkets[0] || "sklavenitis";
    const packCount = Math.max(1, Math.ceil(requiredAmount / packSize));
    const totalQuantity = packCount * packSize;
    const price = product.price_stats.min_price;
    const totalPrice = Number((packCount * price).toFixed(2));
    const unitPrice = Number(
      (product.price_stats.min_unit_price || (packSize > 0 ? price / packSize : price)).toFixed(2)
    );

    options.push({
      product,
      packSize,
      packUnit,
      packCount,
      totalQuantity,
      totalPrice,
      unitPrice,
      retailer: fallbackRetailer,
      retailerName:
        fallbackRetailer === "ab_vasilopoulos"
          ? "ΑΒ Βασιλόπουλος"
          : fallbackRetailer === "lidl"
          ? "Lidl"
          : fallbackRetailer === "mymarket"
          ? "My Market"
          : fallbackRetailer === "masoutis"
          ? "Μασούτης"
          : fallbackRetailer === "galaxias"
          ? "Γαλαξίας"
          : fallbackRetailer === "kritikos"
          ? "Κρητικός"
          : fallbackRetailer === "market_in" || fallbackRetailer === "market-in" || fallbackRetailer === "marketin"
          ? "Market In"
          : "Σκλαβενίτης",
      isBulk: packSize >= 1.0 || packCount >= 2,
    });
  }

  return options;
}

/**
 * Creates an unavailable package option if no product SKU exists on posokanei.gov.gr
 */
export function createSynthesizedPackOption(
  agg: AggregatedIngredient,
  preferredSupermarkets: string[] = []
): PackOption {
  const packSize = agg.normalizedAmount >= 1.0 ? 1.0 : 0.5;
  const packUnit = agg.normalizedUnit || "kg";
  const packCount = Math.max(1, Math.ceil(agg.normalizedAmount / packSize));
  const totalQuantity = packCount * packSize;

  const syntheticProduct: Product = {
    id: `synth-${agg.query}`,
    name: `${agg.name} (Μη διαθέσιμο στο posokanei.gov.gr)`,
    brand: "Μη διαθέσιμο",
    category: agg.category,
    category_ids: [],
    unit: packUnit,
    unit_quantity: packSize,
    has_image: false,
    image_url: null,
    private_label: false,
    price_drop: false,
    available_countries: ["GR"],
    is_international: false,
    retailers: [],
    price_stats: {
      min_price: 0,
      max_price: 0,
      avg_price: 0,
      min_unit_price: 0,
      retailer_count: 0,
    },
    retailer_prices: [],
  };

  return {
    product: syntheticProduct,
    packSize,
    packUnit,
    packCount,
    totalQuantity,
    totalPrice: 0,
    unitPrice: 0,
    retailer: "none",
    retailerName: "Μη διαθέσιμο",
    isBulk: false,
    isSynthetic: true,
    isAvailable: false,
  };
}

/**
 * Validates that an uncurated candidate product belongs to an acceptable food category
 */
function isEligibleProductCandidate(prod: Product, agg: AggregatedIngredient): boolean {
  const cat = (prod.category || "").toLowerCase();
  const name = prod.name.toLowerCase();

  // 1. Block non-food products from food recipes
  const nonFoodTerms = [
    "καθαριότητα", "αντισηπτικά", "υγρομάντιλα", "απορρυπαντικ",
    "πλυντήριο", "πιάτων", "προσωπική φροντίδα", "είδη για κατοικίδια",
    "τροφή για", "βρεφικά", "αφρόλουτρο", "σαπούνι", "τσιχλ", "τσάι", "κάψουλες"
  ];
  if (nonFoodTerms.some((t) => cat.includes(t) || name.includes(t))) {
    return false;
  }

  // 2. Block pies and pastries when looking for pure cheese or produce
  if (agg.category === "dairy" && (
    name.includes("τυροπιτάκια") || name.includes("μπουγάτσα") ||
    name.includes("πατσαβουρόπιτα") || name.includes("πίτα") || cat.includes("πίτες")
  )) {
    return false;
  }

  // 3. Block eggs when looking for olive oil
  if (agg.query.includes("ελαιόλαδο") && (name.includes("αυγά") || cat.includes("αυγά"))) {
    return false;
  }

  // 4. Block unit mismatch (pcs when kg or L required, unless title specifies weight/volume)
  if ((agg.normalizedUnit === "kg" || agg.normalizedUnit === "L") && prod.unit === "pcs" && !name.match(/\d+\s*(kg|g|l|ml)/i)) {
    return false;
  }

  return true;
}

/**
 * Generates the optimized grocery list with bulk packaging intelligence
 */
export async function generateOptimizedGroceryList(
  slots: MealSlot[],
  preferences: UserPreferences
): Promise<{
  items: OptimizedGroceryItem[];
  basketComparisons: BasketComparison[];
  pantrySurplus: PantrySurplusItem[];
  totalEstimatedCost: number;
  totalBulkSavings: number;
}> {
  const aggregated = aggregateIngredients(slots, preferences.householdSize);
  const items: OptimizedGroceryItem[] = [];
  const pantrySurplus: PantrySurplusItem[] = [];

  for (const agg of aggregated) {
    const allOptions: PackOption[] = [];

    // Case 1: Curated Product exists! Use this exact product entity
    if (agg.curatedProduct) {
      const curatedOptions = evaluatePackOptions(
        agg.curatedProduct,
        agg.normalizedAmount,
        preferences.preferredSupermarkets
      );
      allOptions.push(...curatedOptions);

      // Also check for genuine bulk/pack size variants of this exact item and brand
      const queryLower = agg.query.toLowerCase();
      const nameLower = agg.name.toLowerCase();
      const variants = MOCK_FALLBACK_PRODUCTS.filter((p) => {
        if (p.id === agg.curatedProduct!.id) return false;
        const sameBrand = p.brand.toLowerCase() === agg.curatedProduct!.brand.toLowerCase();
        const pName = p.name.toLowerCase();
        const matchesIngredient =
          pName.includes(queryLower) ||
          pName.includes(nameLower) ||
          (queryLower.includes("ντομάτ") && pName.includes("ντομάτ")) ||
          (queryLower.includes("πιπερι") && pName.includes("πιπερι")) ||
          (queryLower.includes("λεμόν") && pName.includes("λεμόν")) ||
          (queryLower.includes("μελιτζάν") && pName.includes("μελιτζάν")) ||
          (queryLower.includes("πατάτ") && pName.includes("πατάτ")) ||
          (queryLower.includes("κιμά") && pName.includes("κιμά")) ||
          (queryLower.includes("κοτόπουλ") && pName.includes("κοτόπουλ")) ||
          (queryLower.includes("φέτα") && pName.includes("φέτα"));

        return sameBrand && matchesIngredient && isEligibleProductCandidate(p, agg);
      });
      for (const v of variants.slice(0, 2)) {
        const variantOptions = evaluatePackOptions(
          v,
          agg.normalizedAmount,
          preferences.preferredSupermarkets
        );
        allOptions.push(...variantOptions);
      }
    } else {
      // Case 2: Uncurated -> Execute automatic search with safety filtering
      let searchRes = await searchProducts({
        title: agg.query,
        page: 1,
        page_size: 10,
        sort_by: "unit_price",
        sort_order: "asc",
      });

      const validProducts = (searchRes.products || []).filter((p) =>
        isEligibleProductCandidate(p, agg)
      );

      // If no valid products returned from API, check fallback products
      if (validProducts.length === 0) {
        const fallbackValid = MOCK_FALLBACK_PRODUCTS.filter(
          (p) =>
            (p.name.toLowerCase().includes(agg.query.toLowerCase()) ||
             p.category.toLowerCase().includes(agg.query.toLowerCase())) &&
            isEligibleProductCandidate(p, agg)
        );
        validProducts.push(...fallbackValid);
      }

      for (const prod of validProducts.slice(0, 5)) {
        const options = evaluatePackOptions(
          prod,
          agg.normalizedAmount,
          preferences.preferredSupermarkets
        );
        allOptions.push(...options);
      }
    }

    // Sort options: If prioritizeBulk is on, sort by unitPrice ascending, otherwise by totalPrice ascending
    allOptions.sort((a, b) => {
      if (preferences.prioritizeBulk) {
        return a.unitPrice - b.unitPrice;
      }
      return a.totalPrice - b.totalPrice;
    });

    let selectedOption = allOptions.length > 0 ? allOptions[0] : null;

    // Fallback guarantee: If no option exists from API or mock, synthesize a calibrated packaging option
    if (!selectedOption) {
      selectedOption = createSynthesizedPackOption(
        agg,
        preferences.preferredSupermarkets
      );
      allOptions.push(selectedOption);
    }

    // Calculate surplus
    let surplusAmount = 0;
    if (selectedOption) {
      surplusAmount = Number(
        Math.max(0, selectedOption.totalQuantity - agg.normalizedAmount).toFixed(2)
      );
    }

    // Calculate bulk savings percentage if multiple sizes exist
    if (selectedOption && allOptions.length > 1) {
      const highestUnitPrice = Math.max(...allOptions.map((o) => o.unitPrice));
      if (highestUnitPrice > selectedOption.unitPrice) {
        selectedOption.savingsVsSmallestPercent = Math.round(
          ((highestUnitPrice - selectedOption.unitPrice) / highestUnitPrice) * 100
        );
      }
    }

    items.push({
      ingredientId: agg.query,
      ingredientName: agg.name,
      category: agg.category,
      rawRequiredAmount: Number(agg.totalRawAmount.toFixed(1)),
      rawUnit: agg.rawUnit,
      normalizedRequiredAmount: Number(agg.normalizedAmount.toFixed(2)),
      normalizedUnit: agg.normalizedUnit,
      selectedOption,
      alternativeOptions: allOptions.slice(1, 4),
      surplusAmount,
      surplusUnit: agg.normalizedUnit,
      isChecked: false,
      inPantry: false,
      isExcluded: false,
      curatedProduct: agg.curatedProduct,
      isCurated: agg.isCurated,
      isUnmatched: selectedOption?.isSynthetic === true,
      isAvailable: selectedOption?.isSynthetic !== true,
    });

    // If there is significant surplus (e.g. > 100g or 0.1kg), register it for the pantry
    if (surplusAmount > 0.05) {
      pantrySurplus.push({
        id: `surplus-${agg.query}`,
        ingredientName: agg.name,
        amount: surplusAmount,
        unit: agg.normalizedUnit,
        category: agg.category,
        originMealNames: agg.sourceMealTitles,
      });
    }
  }

  // 3. Basket comparison across supermarkets
  const basketComparisons = computeBasketComparisons(items, preferences.preferredSupermarkets);

  const totalEstimatedCost = Number(
    items
      .filter((i) => !i.inPantry && i.selectedOption)
      .reduce((sum, i) => sum + (i.selectedOption?.totalPrice || 0), 0)
      .toFixed(2)
  );

  const totalBulkSavings = Number(
    items
      .filter((i) => i.selectedOption?.savingsVsSmallestPercent)
      .reduce((sum, i) => {
        const pct = i.selectedOption?.savingsVsSmallestPercent || 0;
        const saved = (i.selectedOption!.totalPrice * (pct / 100));
        return sum + saved;
      }, 0)
      .toFixed(2)
  );

  return {
    items,
    basketComparisons,
    pantrySurplus,
    totalEstimatedCost,
    totalBulkSavings,
  };
}

/**
 * Computes comparative basket totals for each supermarket chain
 */
export function computeBasketComparisons(
  items: OptimizedGroceryItem[],
  preferredSupermarkets: string[] = []
): BasketComparison[] {
  // Candidate retailers to compare
  const retailersToCompare =
    preferredSupermarkets && preferredSupermarkets.length > 0
      ? MOCK_RETAILERS.filter((r) => preferredSupermarkets.includes(r.id))
      : MOCK_RETAILERS;

  const comparisons: BasketComparison[] = retailersToCompare.map((retailer) => {
    let totalCost = 0;
    let remainingCost = 0;
    let purchasedCost = 0;
    let remainingItemCount = 0;
    let purchasedItemCount = 0;
    let unavailableCount = 0;

    for (const item of items) {
      if (item.inPantry || item.isExcluded) continue;

      const isUnavailable =
        item.isUnmatched ||
        item.isAvailable === false ||
        item.selectedOption?.isSynthetic ||
        !item.selectedOption?.totalPrice ||
        item.selectedOption.totalPrice <= 0;

      if (isUnavailable) {
        unavailableCount++;
        continue;
      }

      // Find an option matching this retailer in selectedOption or alternativeOptions
      const match =
        item.selectedOption?.retailer === retailer.id
          ? item.selectedOption
          : (item.alternativeOptions || []).find((opt) => opt.retailer === retailer.id);

      const itemPrice = match
        ? match.totalPrice
        : (item.selectedOption?.totalPrice || 0);

      totalCost += itemPrice;

      if (item.isChecked) {
        purchasedCost += itemPrice;
        purchasedItemCount++;
      } else {
        remainingCost += itemPrice;
        remainingItemCount++;
      }
    }

    return {
      retailerId: retailer.id,
      retailerName:
        retailer.id === "market_in" || retailer.id === "market-in" || retailer.name === "market_in" || retailer.name === "market-in"
          ? "Market In"
          : retailer.name,
      logoUrl: retailer.logo_url,
      totalCost: Number(totalCost.toFixed(2)),
      remainingCost: Number(remainingCost.toFixed(2)),
      purchasedCost: Number(purchasedCost.toFixed(2)),
      itemCount: remainingItemCount,
      purchasedCount: purchasedItemCount,
      totalItems: items.filter((i) => !i.inPantry && !i.isExcluded).length,
      isCheapest: false,
      savingsVsAverage: 0,
      unavailableCount,
    };
  });

  // Calculate cheapest & savings based on remaining cost (or total cost if all purchased)
  if (comparisons.length > 0) {
    const hasRemaining = comparisons.some((c) => c.remainingCost > 0);
    const benchmarkKey = hasRemaining ? "remainingCost" : "totalCost";

    const minCost = Math.min(...comparisons.map((c) => c[benchmarkKey]));
    const avgCost =
      comparisons.reduce((sum, c) => sum + c[benchmarkKey], 0) / comparisons.length;

    for (const comp of comparisons) {
      if (comp[benchmarkKey] === minCost) {
        comp.isCheapest = true;
      }
      comp.savingsVsAverage = Number((avgCost - comp[benchmarkKey]).toFixed(2));
    }
  }

  comparisons.sort((a, b) => {
    const aVal = a.remainingCost > 0 ? a.remainingCost : a.totalCost;
    const bVal = b.remainingCost > 0 ? b.remainingCost : b.totalCost;
    return aVal - bVal;
  });

  return comparisons;
}

/**
 * Computes instant cart totals (total, remaining, purchased, savings) synchronously
 */
export function computeCartTotals(items: OptimizedGroceryItem[]) {
  const activeItems = items.filter((i) => !i.inPantry && !i.isExcluded && i.selectedOption);

  const availableItems = activeItems.filter(
    (i) =>
      !i.isUnmatched &&
      i.isAvailable !== false &&
      !i.selectedOption?.isSynthetic &&
      (i.selectedOption?.totalPrice || 0) > 0
  );

  const totalCost = Number(
    availableItems
      .reduce((sum, i) => sum + (i.selectedOption?.totalPrice || 0), 0)
      .toFixed(2)
  );

  const unmatchedItems = activeItems.filter(
    (i) =>
      i.isUnmatched ||
      i.isAvailable === false ||
      i.selectedOption?.isSynthetic ||
      (i.selectedOption?.totalPrice || 0) <= 0
  );
  const unmatchedCost = 0;
  const verifiedCost = totalCost;
  const unmatchedCount = unmatchedItems.length;

  const remainingCost = Number(
    availableItems
      .filter((i) => !i.isChecked)
      .reduce((sum, i) => sum + (i.selectedOption?.totalPrice || 0), 0)
      .toFixed(2)
  );

  const purchasedCost = Number(
    availableItems
      .filter((i) => i.isChecked)
      .reduce((sum, i) => sum + (i.selectedOption?.totalPrice || 0), 0)
      .toFixed(2)
  );

  const totalBulkSavings = Number(
    availableItems
      .filter((i) => i.selectedOption?.savingsVsSmallestPercent)
      .reduce((sum, i) => {
        const pct = i.selectedOption?.savingsVsSmallestPercent || 0;
        return sum + (i.selectedOption!.totalPrice * (pct / 100));
      }, 0)
      .toFixed(2)
  );

  return {
    totalCost,
    remainingCost,
    purchasedCost,
    totalBulkSavings,
    verifiedCost,
    unmatchedCost,
    unmatchedCount,
  };
}
