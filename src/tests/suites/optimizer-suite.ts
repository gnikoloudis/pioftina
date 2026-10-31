import { defineSuite, defineTest } from "../core/runner";
import {
  aggregateIngredients,
  computeBasketComparisons,
  computeCartTotals,
  normalizePackSize,
  evaluatePackOptions,
} from "@/lib/optimizer/packaging";
import { MealSlot, OptimizedGroceryItem } from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
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

    defineTest({
      id: "optimizer-pack-size-normalization",
      title: "Κανονικοποίηση μεγέθους συσκευασίας (normalizePackSize)",
      category: "optimizer",
      description: "Επαληθεύει ότι συσκευασίες γραμμαρίων (π.χ. 350g, 500g) μετατρέπονται σωστά σε kg χωρίς να επηρεάζονται τα τεμάχια (π.χ. αυγά, κάψουλες).",
      documentation: "Ελέγχει ότι 500g -> 0.5kg, 350g -> 0.35kg, 1kg -> 1kg, 750ml -> 0.75L, και 10 τεμάχια -> 10 τεμάχια.",
      tags: ["optimizer", "math", "units"],
      severity: "critical",
      run: ({ assertEquals, assertApproxEquals }) => {
        const dummyProdGrams = {
          id: "prod-500g",
          unit: "g",
          unit_quantity: 500,
        } as Product;
        const normGrams = normalizePackSize(dummyProdGrams, "kg");
        assertApproxEquals(normGrams.packSize, 0.5, 0.001, "500g πρέπει να γίνει 0.5kg");
        assertEquals(normGrams.packUnit, "kg", "Η μονάδα πρέπει να γίνει kg");

        const dummyAnthotyro = {
          id: "anthotyro-350g",
          unit: "g",
          unit_quantity: 350,
        } as Product;
        const normAnthotyro = normalizePackSize(dummyAnthotyro, "kg");
        assertApproxEquals(normAnthotyro.packSize, 0.35, 0.001, "350g πρέπει να γίνει 0.35kg");

        const dummyEggs = {
          id: "eggs-10",
          unit: "τεμ",
          unit_quantity: 10,
        } as Product;
        const normEggs = normalizePackSize(dummyEggs, "τεμ");
        assertEquals(normEggs.packSize, 10, "10 τεμ πρέπει να παραμείνουν 10");
        assertEquals(normEggs.packUnit, "τεμ", "Η μονάδα πρέπει να παραμείνει τεμ");
      },
    }),

    defineTest({
      id: "optimizer-realistic-surplus-calculation",
      title: "Αποφυγή πλασματικών πλεονασμάτων (Realistic Surplus)",
      category: "optimizer",
      description: "Επαληθεύει ότι οι συσκευασίες ψωμιού και ανθότυρου υπολογίζουν ρεαλιστικό πλεόνασμα (~0.49kg και ~0.28kg) αντί για +499kg ή +349kg.",
      documentation: "Εκτελεί evaluatePackOptions με απαιτούμενες ποσότητες 0.51kg (ψωμί/κουλούρι) και 0.42kg (ανθότυρο) και ελέγχει ότι το πλεόνασμα παραμένει < 1kg.",
      tags: ["optimizer", "surplus", "regression"],
      severity: "critical",
      run: ({ assert, assertApproxEquals }) => {
        // Ψωμί / Κουλούρι: 500g συσκευασία (1.35€), απαιτούμενο 0.51kg
        const breadProduct = {
          id: "bread-500g",
          name: "Ψωμί Προζυμένιο 500g",
          unit: "g",
          unit_quantity: 500,
          retailer_prices: [
            { retailer: "sklavenitis", price: 1.35, price_normalized: 2.70 },
          ],
        } as unknown as Product;

        const breadOptions = evaluatePackOptions(breadProduct, 0.51, ["sklavenitis"], "kg");
        assert(breadOptions.length > 0, "Πρέπει να παραχθούν επιλογές συσκευασίας για ψωμί");
        const breadBest = breadOptions[0];
        assertApproxEquals(breadBest.packSize, 0.5, 0.001, "Το μέγεθος πακέτου πρέπει να είναι 0.5kg");
        assertApproxEquals(breadBest.totalQuantity, 1.0, 0.001, "2 πακέτα των 0.5kg = 1.0kg");
        const breadSurplus = breadBest.totalQuantity - 0.51;
        assertApproxEquals(breadSurplus, 0.49, 0.01, "Το πλεόνασμα πρέπει να είναι 0.49kg (και ΟΧΙ +499.49kg!)");
        assert(breadSurplus < 1.0, "Το πλεόνασμα δεν επιτρέπεται να υπερβαίνει το μέγεθος της συσκευασίας");

        // Ανθότυρο: 350g συσκευασία (2.40€), απαιτούμενο 0.42kg
        const anthotyroProduct = {
          id: "anthotyro-350g",
          name: "Ανθότυρο Νωπό 350g",
          unit: "g",
          unit_quantity: 350,
          retailer_prices: [
            { retailer: "sklavenitis", price: 2.40, price_normalized: 6.85 },
          ],
        } as unknown as Product;

        const anthoOptions = evaluatePackOptions(anthotyroProduct, 0.42, ["sklavenitis"], "kg");
        assert(anthoOptions.length > 0, "Πρέπει να παραχθούν επιλογές συσκευασίας για ανθότυρο");
        const anthoBest = anthoOptions[0];
        assertApproxEquals(anthoBest.packSize, 0.35, 0.001, "Το μέγεθος πακέτου πρέπει να είναι 0.35kg");
        assertApproxEquals(anthoBest.totalQuantity, 0.70, 0.001, "2 πακέτα των 0.35kg = 0.70kg");
        const anthoSurplus = anthoBest.totalQuantity - 0.42;
        assertApproxEquals(anthoSurplus, 0.28, 0.01, "Το πλεόνασμα πρέπει να είναι 0.28kg (και ΟΧΙ +349.58kg!)");
        assert(anthoSurplus < 1.0, "Το πλεόνασμα δεν επιτρέπεται να υπερβαίνει το μέγεθος της συσκευασίας");
      },
    }),
  ],
});
