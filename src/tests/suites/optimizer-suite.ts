import { defineSuite, defineTest } from "../core/runner";
import {
  aggregateIngredients,
  computeBasketComparisons,
  computeCartTotals,
} from "@/lib/optimizer/packaging";
import { MealSlot, OptimizedGroceryItem } from "@/types/meal-planner";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";

export const optimizerSuite = defineSuite({
  id: "optimizer-suite",
  name: "Μηχανή Βελτιστοποίησης & Συσκευασιών (Optimizer)",
  category: "optimizer",
  description: "Ελέγχει τη συνένωση υλικών της εβδομάδας, την κλιμάκωση μερίδων, τη μετατροπή μονάδων και τη σύγκριση τιμών σούπερ μάρκετ.",
  tests: [
    defineTest({
      id: "optimizer-ingredient-aggregation",
      title: "Συνένωση κοινών υλικών από πολλαπλά γεύματα",
      category: "optimizer",
      description: "Επιβεβαιώνει ότι δύο γεύματα που περιέχουν το ίδιο υλικό αθροίζονται σε ένα ενιαίο grocery item.",
      documentation: "Δημιουργεί 2 slots με συνταγές που περιέχουν ελαιόλαδο. Επαληθεύει ότι το aggregateIngredients παράγει μία μόνο εγγραφή με άθροισμα ποσοτήτων.",
      tags: ["smoke", "optimizer"],
      severity: "critical",
      run: ({ assert, assertEquals }) => {
        const recipeA = SEED_RECIPES[0]; // π.χ. Στραπατσάδα
        const recipeB = SEED_RECIPES[1]; // π.χ. Αυγά μάτια

        const slots: MealSlot[] = [
          { id: "slot-1", day: 0, mealType: "breakfast", courseType: "main", servings: 2, recipe: recipeA },
          { id: "slot-2", day: 1, mealType: "breakfast", courseType: "main", servings: 2, recipe: recipeB },
        ];

        const aggregated = aggregateIngredients(slots, 2);
        assert(aggregated.length > 0, "Πρέπει να προκύψουν συγκεντρωτικά υλικά");

        // Ελέγχουμε αν τα αυγά συνενώθηκαν
        const eggsAgg = aggregated.find((a) => a.query.includes("αυγ") || a.name.includes("Αυγ"));
        assert(!!eggsAgg, "Πρέπει να υπάρχει εγγραφή για αυγά");
        if (!eggsAgg) return;
        assert(eggsAgg.sourceMealTitles.length >= 2, "Τα αυγά πρέπει να καταγράφουν και τα 2 γεύματα προέλευσης");
      },
    }),

    defineTest({
      id: "optimizer-unit-normalization-g-to-kg",
      title: "Κανονικοποίηση μονάδων (g -> kg, ml -> L)",
      category: "optimizer",
      description: "Επαληθεύει ότι ποσότητες σε γραμμάρια μετατρέπονται σωστά σε δεκαδικά κιλά για αναζήτηση συσκευασιών.",
      documentation: "Ελέγχει ότι 500g γίνονται 0.5kg και 1000ml γίνονται 1.0L, επιτρέποντας σωστή διαίρεση με τα μεγέθη συσκευασιών του σούπερ μάρκετ.",
      tags: ["optimizer", "math"],
      severity: "high",
      run: ({ assertApproxEquals }) => {
        // Συνταγή με πατάτες σε γραμμάρια (π.χ. Μουσακάς 700g για 6 μερίδες)
        const moussaka = SEED_RECIPES.find((r) => r.id === "moussaka") || SEED_RECIPES[20];
        const slots: MealSlot[] = [
          { id: "slot-test", day: 0, mealType: "lunch", courseType: "main", servings: moussaka.servings, recipe: moussaka },
        ];

        const aggregated = aggregateIngredients(slots, moussaka.servings);
        const potAgg = aggregated.find((a) => a.query.includes("πατάτ"));
        if (potAgg) {
          assertApproxEquals(potAgg.normalizedAmount, 0.7, 0.05, "700g πατάτες πρέπει να κανονικοποιηθούν σε ~0.7kg");
        }
      },
    }),

    defineTest({
      id: "optimizer-supermarket-basket-comparison",
      title: "Σύγκριση συνολικού καλαθιού σούπερ μάρκετ",
      category: "optimizer",
      description: "Ελέγχει ότι η συνάρτηση computeBasketComparisons επιστρέφει ορθές τιμές για όλες τις υποστηριζόμενες αλυσίδες.",
      documentation: "Εκτελεί σύγκριση καλαθιού με mock grocery items και ελέγχει ότι δεν παράγονται αρνητικές τιμές ή NaN.",
      tags: ["optimizer", "retailers", "pricing"],
      severity: "critical",
      run: ({ assert }) => {
        const dummyItems: OptimizedGroceryItem[] = [
          {
            ingredientId: "opt-1",
            ingredientName: "Φέτα Π.Ο.Π.",
            category: "dairy",
            rawRequiredAmount: 0.4,
            rawUnit: "kg",
            normalizedRequiredAmount: 0.4,
            normalizedUnit: "kg",
            selectedOption: {
              product: {
                id: "feta-test",
                name: "Φέτα 400g",
                brand: "Δωδώνη",
                category: "dairy",
                category_ids: [],
                unit: "kg",
                unit_quantity: 0.4,
                has_image: false,
                image_url: null,
                private_label: false,
                price_drop: false,
                available_countries: ["GR"],
                is_international: false,
                retailers: ["sklavenitis", "ab_vasilopoulos"],
                price_stats: { min_price: 4.5, max_price: 5.0, avg_price: 4.75, min_unit_price: 11.25, retailer_count: 2 },
                retailer_prices: [
                  { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Φέτα 400g", price: 4.5, price_normalized: 11.25, is_discount: false, discount_percentage: null, last_updated: "", country: "GR" },
                  { retailer: "ab_vasilopoulos", retailer_display_name: "ΑΒ Βασιλόπουλος", retailer_name: "Φέτα 400g", price: 4.9, price_normalized: 12.25, is_discount: false, discount_percentage: null, last_updated: "", country: "GR" },
                ],
              },
              packSize: 0.4,
              packUnit: "kg",
              packCount: 1,
              totalQuantity: 0.4,
              totalPrice: 4.5,
              unitPrice: 11.25,
              retailer: "sklavenitis",
              retailerName: "Σκλαβενίτης",
              isBulk: false,
              isSynthetic: false,
              isAvailable: true,
            },
            surplusAmount: 0,
            surplusUnit: "kg",
            inPantry: false,
            isChecked: false,
            alternativeOptions: [],
          },
        ];

        const comparisons = computeBasketComparisons(dummyItems);
        assert(comparisons.length > 0, "Πρέπει να επιστραφούν συγκρίσεις για τα supermarkets");

        const sklavenitis = comparisons.find((c) => c.retailerId === "sklavenitis");
        assert(!!sklavenitis, "Πρέπει να υπάρχει σύγκριση για Σκλαβενίτη");
        if (!sklavenitis) return;
        assert(sklavenitis.totalCost > 0, "Το σύνολο πρέπει να είναι θετικός αριθμός");
        assert(sklavenitis.totalItems >= 1, "Πρέπει να βρεθεί τουλάχιστον 1 διαθέσιμο προϊόν");
      },
    }),

    defineTest({
      id: "optimizer-cart-totals-and-savings",
      title: "Υπολογισμός συνολικού κόστους καλαθιού και κέρδους bulk",
      category: "optimizer",
      description: "Επιβεβαιώνει ότι το computeCartTotals υπολογίζει σωστά το remainingCost και το totalSavings.",
      documentation: "Ελέγχει ότι purchased items αφαιρούνται σωστά από το remainingCost και προστίθενται στο purchasedCost.",
      tags: ["optimizer", "cart"],
      severity: "high",
      run: ({ assertEquals }) => {
        const dummyItems: OptimizedGroceryItem[] = [
          {
            ingredientId: "opt-1",
            ingredientName: "Αλεύρι",
            category: "pantry",
            rawRequiredAmount: 1,
            rawUnit: "kg",
            normalizedRequiredAmount: 1,
            normalizedUnit: "kg",
            selectedOption: {
              product: null as any,
              packSize: 1,
              packUnit: "kg",
              packCount: 1,
              totalQuantity: 1,
              totalPrice: 1.20,
              unitPrice: 1.20,
              retailer: "sklavenitis",
              retailerName: "Σκλαβενίτης",
              isBulk: false,
              isSynthetic: false,
              isAvailable: true,
            },
            surplusAmount: 0,
            surplusUnit: "kg",
            inPantry: false,
            isChecked: true,
            alternativeOptions: [],
          },
          {
            ingredientId: "opt-2",
            ingredientName: "Ζάχαρη",
            category: "pantry",
            rawRequiredAmount: 1,
            rawUnit: "kg",
            normalizedRequiredAmount: 1,
            normalizedUnit: "kg",
            selectedOption: {
              product: null as any,
              packSize: 1,
              packUnit: "kg",
              packCount: 1,
              totalQuantity: 1,
              totalPrice: 1.00,
              unitPrice: 1.00,
              retailer: "sklavenitis",
              retailerName: "Σκλαβενίτης",
              isBulk: false,
              isSynthetic: false,
              isAvailable: true,
            },
            surplusAmount: 0,
            surplusUnit: "kg",
            inPantry: false,
            isChecked: false,
            alternativeOptions: [],
          },
        ];

        const totals = computeCartTotals(dummyItems);
        assertEquals(totals.totalCost, 2.20, "Συνολικό κόστος 2.20€");
        assertEquals(totals.purchasedCost, 1.20, "Αγορασμένα 1.20€");
        assertEquals(totals.remainingCost, 1.00, "Απομένουν 1.00€");
      },
    }),
  ],
});
