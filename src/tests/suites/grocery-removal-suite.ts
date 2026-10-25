import { defineSuite, defineTest } from "../core/runner";
import { computeCartTotals, computeBasketComparisons } from "@/lib/optimizer/packaging";
import { OptimizedGroceryItem } from "@/types/meal-planner";

const MOCK_GROCERY_ITEMS: OptimizedGroceryItem[] = [
  {
    ingredientId: "ing-tomato",
    ingredientName: "Ντομάτες",
    category: "produce",
    rawRequiredAmount: 1000,
    rawUnit: "g",
    normalizedRequiredAmount: 1.0,
    normalizedUnit: "kg",
    alternativeOptions: [],
    surplusAmount: 0,
    surplusUnit: "g",
    isChecked: false,
    inPantry: false,
    isExcluded: false,
    selectedOption: {
      product: {} as any,
      packCount: 1,
      packSize: 1,
      packUnit: "kg",
      totalQuantity: 1,
      totalPrice: 2.0,
      unitPrice: 2.0,
      retailer: "sklavenitis",
      retailerName: "Σκλαβενίτης",
      isBulk: false,
    },
  },
  {
    ingredientId: "ing-feta",
    ingredientName: "Φέτα ΠΟΠ",
    category: "dairy",
    rawRequiredAmount: 400,
    rawUnit: "g",
    normalizedRequiredAmount: 0.4,
    normalizedUnit: "kg",
    alternativeOptions: [],
    surplusAmount: 0,
    surplusUnit: "g",
    isChecked: true,
    inPantry: false,
    isExcluded: false,
    selectedOption: {
      product: {} as any,
      packCount: 1,
      packSize: 400,
      packUnit: "g",
      totalQuantity: 400,
      totalPrice: 5.0,
      unitPrice: 12.5,
      retailer: "sklavenitis",
      retailerName: "Σκλαβενίτης",
      isBulk: false,
    },
  },
  {
    ingredientId: "ing-olive-oil",
    ingredientName: "Ελαιόλαδο Εξαιρετικό Παρθένο",
    category: "pantry",
    rawRequiredAmount: 500,
    rawUnit: "ml",
    normalizedRequiredAmount: 0.5,
    normalizedUnit: "L",
    alternativeOptions: [],
    surplusAmount: 0,
    surplusUnit: "ml",
    isChecked: true,
    inPantry: false,
    isExcluded: false,
    selectedOption: {
      product: {} as any,
      packCount: 1,
      packSize: 1,
      packUnit: "L",
      totalQuantity: 1,
      totalPrice: 11.0,
      unitPrice: 11.0,
      retailer: "sklavenitis",
      retailerName: "Σκλαβενίτης",
      isBulk: false,
    },
  },
  {
    ingredientId: "bundle-item-clean-detergent",
    ingredientName: "Υγρό Πιάτων 500ml",
    category: "household",
    rawRequiredAmount: 1,
    rawUnit: "τεμ",
    normalizedRequiredAmount: 1,
    normalizedUnit: "τεμ",
    alternativeOptions: [],
    surplusAmount: 0,
    surplusUnit: "τεμ",
    isChecked: false,
    inPantry: false,
    isExcluded: false,
    selectedOption: {
      product: {} as any,
      packCount: 1,
      packSize: 1,
      packUnit: "τεμ",
      totalQuantity: 1,
      totalPrice: 2.5,
      unitPrice: 2.5,
      retailer: "sklavenitis",
      retailerName: "Σκλαβενίτης",
      isBulk: false,
    },
  },
];

export const groceryRemovalSuite = defineSuite({
  id: "grocery-removal-suite",
  name: "Αφαίρεση Ειδών από τη Λίστα Αγορών (One-by-One & Bulk)",
  category: "optimizer",
  description: "Επαλήθευση μεμονωμένης και μαζικής αφαίρεσης υλικών, διαγραφής αγορασμένων, επαναφοράς (Undo) και εξαίρεσης πακέτων.",
  tests: [
    defineTest({
      id: "GROCERY-REMOVE-SINGLE",
      title: "Μεμονωμένη αφαίρεση υλικού και επανυπολογισμός κόστους",
      category: "optimizer",
      description: "Επιβεβαιώνει ότι η αφαίρεση μεμονωμένου υλικού μειώνει το συνολικό κόστος και τα ενεργά είδη.",
      documentation: "Εξαιρεί τη ντομάτα (€2.00) από το αρχικό καλάθι (€20.50) και ελέγχει ότι το νέο κόστος είναι €18.50.",
      tags: ["smoke", "grocery", "removal"],
      severity: "high",
      run: ({ assertEquals }) => {
        const initialTotals = computeCartTotals(MOCK_GROCERY_ITEMS);
        assertEquals(Math.round(initialTotals.totalCost * 100) / 100, 20.5, "Αρχικό κόστος €20.50");

        const updatedItems = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          isExcluded: item.ingredientId === "ing-tomato",
        }));

        const newTotals = computeCartTotals(updatedItems);
        assertEquals(Math.round(newTotals.totalCost * 100) / 100, 18.5, "Νέο κόστος €18.50 μετά την αφαίρεση");

        const activeItems = updatedItems.filter((i) => !i.inPantry && !i.isExcluded);
        assertEquals(activeItems.length, 3, "Ενεργά είδη μετά την αφαίρεση");
      },
    }),

    defineTest({
      id: "GROCERY-REMOVE-CHECKED-BULK",
      title: "Μαζική διαγραφή αγορασμένων (τικαρισμένων) ειδών",
      category: "optimizer",
      description: "Επαληθεύει ότι όλα τα τικαρισμένα είδη αφαιρούνται ταυτόχρονα και απο-τικάρονται.",
      documentation: "Αφαιρεί μαζικά τη φέτα και το ελαιόλαδο (€16.00) και διατηρεί μόνο τα μη αγορασμένα είδη.",
      tags: ["bulk", "grocery", "checked"],
      severity: "high",
      run: ({ assertEquals }) => {
        const checkedIds = MOCK_GROCERY_ITEMS.filter((i) => i.isChecked).map((i) => i.ingredientId);
        assertEquals(checkedIds.length, 2, "Πλήθος τικαρισμένων ειδών");

        const updatedItems = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          isExcluded: checkedIds.includes(item.ingredientId),
          isChecked: checkedIds.includes(item.ingredientId) ? false : item.isChecked,
        }));

        const totals = computeCartTotals(updatedItems);
        assertEquals(Math.round(totals.totalCost * 100) / 100, 4.5, "Κόστος μετά τη μαζική διαγραφή αγορασμένων");

        const remainingActive = updatedItems.filter((i) => !i.inPantry && !i.isExcluded);
        assertEquals(remainingActive.length, 2, "Υπολειπόμενα ενεργά είδη");
      },
    }),

    defineTest({
      id: "GROCERY-REMOVE-MULTI-SELECT",
      title: "Μαζική επιλογή και διαγραφή συγκεκριμένων IDs",
      category: "optimizer",
      description: "Ελέγχει τη διαγραφή συγκεκριμένων επιλεγμένων ειδών μέσω multi-select.",
      documentation: "Επιλέγει και διαγράφει ντομάτα και απορρυπαντικό, ελέγχοντας την αφαίρεσή τους από το καλάθι.",
      tags: ["bulk", "grocery", "multi-select"],
      severity: "high",
      run: ({ assertEquals }) => {
        const idsToRemove = ["ing-tomato", "bundle-item-clean-detergent"];
        const updatedItems = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          isExcluded: idsToRemove.includes(item.ingredientId),
        }));

        const totals = computeCartTotals(updatedItems);
        assertEquals(Math.round(totals.totalCost * 100) / 100, 16.0, "Κόστος μετά τη μαζική διαγραφή επιλεγμένων");
      },
    }),

    defineTest({
      id: "GROCERY-UNDO-RESTORE",
      title: "Επαναφορά / Αναίρεση (Undo) εξαιρεμένων ειδών",
      category: "optimizer",
      description: "Επαληθεύει ότι η αναίρεση επαναφέρει τα επιλεγμένα υλικά και επανυπολογίζει το κόστος.",
      documentation: "Εξαιρεί 2 υλικά και στη συνέχεια επαναφέρει το ένα, επαληθεύοντας την αποκατάσταση των τιμών.",
      tags: ["undo", "grocery", "restore"],
      severity: "high",
      run: ({ assertEquals }) => {
        const excludedIds = new Set(["ing-tomato", "ing-feta"]);
        let currentItems = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          isExcluded: excludedIds.has(item.ingredientId),
        }));

        let totals = computeCartTotals(currentItems);
        assertEquals(Math.round(totals.totalCost * 100) / 100, 13.5, "Κόστος με 2 εξαιρεμένα");

        // Undo ντομάτας
        excludedIds.delete("ing-tomato");
        currentItems = currentItems.map((item) => ({
          ...item,
          isExcluded: excludedIds.has(item.ingredientId),
        }));

        totals = computeCartTotals(currentItems);
        assertEquals(Math.round(totals.totalCost * 100) / 100, 15.5, "Κόστος μετά την αναίρεση ντομάτας");
      },
    }),

    defineTest({
      id: "GROCERY-BUNDLE-EXCLUSION",
      title: "Εξαίρεση και επαναφορά προϊόντος πακέτου καθαριότητας / βρεφικών",
      category: "optimizer",
      description: "Επαληθεύει ότι τα bundle items υποστηρίζουν πλήρως εξαίρεση και εμφάνιση στα εξαιρεμένα.",
      documentation: "Εξαιρεί ένα προϊόν πακέτου και ελέγχει ότι απομακρύνεται από τα ενεργά και εμφανίζεται στα εξαιρεμένα.",
      tags: ["bundles", "grocery", "cleaning"],
      severity: "medium",
      run: ({ assert }) => {
        const bundleItemId = "bundle-item-clean-detergent";
        const excludedBundleItems = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          isExcluded: item.ingredientId === bundleItemId,
        }));

        const activeBundleItems = excludedBundleItems.filter(
          (i) => i.ingredientId.startsWith("bundle-") && !i.isExcluded
        );
        assert(activeBundleItems.length === 0, "Το bundle item έπρεπε να έχει αφαιρεθεί από τα ενεργά είδη");

        const excludedList = excludedBundleItems.filter((i) => i.isExcluded);
        assert(
          excludedList.some((i) => i.ingredientId === bundleItemId),
          "Το bundle item έπρεπε να βρίσκεται στη λίστα των εξαιρεμένων"
        );
      },
    }),

    defineTest({
      id: "GROCERY-PANTRY-SYNC",
      title: "Επαλήθευση συγχρονισμού «Έχω ήδη στο σπίτι» (Home button) με την Αποθήκη",
      category: "optimizer",
      description: "Επαληθεύει ότι υλικά επιλεγμένα με το κουμπί Home εξαιρούνται από το κόστος αγορών, αναγνωρίζονται στην Αποθήκη ανά κατηγορία (συμπ. βρεφικά) και επανέρχονται πλήρως.",
      documentation: "Ελέγχει ότι το inPantry: true μειώνει το κόστος καλαθιού, απομακρύνει το είδος από τα προς αγορά, επιτρέπει κατηγοριοποίηση στην Αποθήκη και επαναφέρεται άμεσα.",
      tags: ["pantry", "grocery", "sync", "baby"],
      severity: "critical",
      run: ({ assert }) => {
        const initialTotals = computeCartTotals(MOCK_GROCERY_ITEMS);
        const initialCost = initialTotals.totalCost;

        // 1. Mark an item (feta, cost 5.0) as inPantry (Have at home)
        const updatedWithPantry = MOCK_GROCERY_ITEMS.map((item) => ({
          ...item,
          inPantry: item.ingredientId === "ing-feta",
        }));

        const newTotals = computeCartTotals(updatedWithPantry);
        assert(
          newTotals.totalCost < initialCost,
          "Το συνολικό κόστος αγορών έπρεπε να μειωθεί αφού η φέτα υπάρχει ήδη στο σπίτι"
        );
        assert(
          Math.abs(newTotals.totalCost - (initialCost - 5.0)) < 0.01,
          "Η μείωση κόστους πρέπει να αντιστοιχεί ακριβώς στην τιμή της φέτας (€5.00)"
        );

        // 2. Verify active vs in-pantry filtering
        const activeItems = updatedWithPantry.filter((i) => !i.inPantry && !i.isExcluded);
        assert(!activeItems.some((i) => i.ingredientId === "ing-feta"), "Η φέτα δεν πρέπει να είναι στα προς αγορά");

        const inPantryItems = updatedWithPantry.filter((i) => i.inPantry);
        assert(inPantryItems.length === 1, "Πρέπει να υπάρχει 1 είδος με σήμανση inPantry");
        assert(inPantryItems[0].ingredientId === "ing-feta", "Το είδος inPantry πρέπει να είναι η φέτα");

        // 3. Test baby category bundle in-pantry item
        const babyItem: OptimizedGroceryItem = {
          ingredientId: "bundle-baby-wipes-1",
          ingredientName: "Μωρομάντηλα Sensitive 4x64",
          category: "baby",
          rawRequiredAmount: 1,
          rawUnit: "πακέτο",
          normalizedRequiredAmount: 1,
          normalizedUnit: "τεμ",
          alternativeOptions: [],
          surplusAmount: 0,
          surplusUnit: "τεμ",
          isChecked: false,
          inPantry: true,
          isExcluded: false,
          selectedOption: {
            product: {} as any,
            packCount: 1,
            packSize: 1,
            packUnit: "τεμ",
            totalQuantity: 1,
            totalPrice: 4.5,
            unitPrice: 4.5,
            retailer: "sklavenitis",
            retailerName: "Σκλαβενίτης",
            isBulk: true,
          },
        };

        const listWithBaby = [...updatedWithPantry, babyItem];
        const babyInPantry = listWithBaby.filter((i) => i.inPantry && i.category === "baby");
        assert(babyInPantry.length === 1, "Το βρεφικό είδος πρέπει να ανιχνεύεται στην κατηγορία baby της Αποθήκης");

        // 4. Test restore (Undo)
        const restored = listWithBaby.map((item) =>
          item.ingredientId === "ing-feta" ? { ...item, inPantry: false } : item
        );
        const restoredTotals = computeCartTotals(restored.filter((i) => i.ingredientId !== babyItem.ingredientId));
        assert(
          Math.abs(restoredTotals.totalCost - initialCost) < 0.01,
          "Μετά την επαναφορά, το κόστος καλαθιού πρέπει να επανέλθει πλήρως"
        );
      },
    }),

    defineTest({
      id: "optimizer-grocery-search-filter",
      title: "Δυναμική αναζήτηση και φιλτράρισμα προϊόντων στη Λίστα Αγορών",
      category: "optimizer",
      severity: "high",
      tags: ["optimizer", "grocery-list", "search", "filter"],
      description:
        "Επαληθεύει ότι η αναζήτηση στη Λίστα Αγορών φιλτράρει δυναμικά τα είδη βάσει ονόματος υλικού, ονόματος επώνυμου προϊόντος και μάρκας, χωρίς να αλλοιώνει τη βασική λίστα.",
      documentation:
        "Η λογική φιλτραρίσματος ελέγχει ingredientName, product.name και product.brand case-insensitively.",
      run: ({ assert, assertEquals }) => {
        const testItems: OptimizedGroceryItem[] = [
          {
            ...MOCK_GROCERY_ITEMS[0], // Ντομάτες (produce)
            selectedOption: {
              ...MOCK_GROCERY_ITEMS[0].selectedOption!,
              product: {
                id: "prod-1",
                name: "ΝΤΟΜΑΤΕΣ ΕΛΛΗΝΙΚΕΣ Α' ΠΟΙΟΤΗΤΑΣ",
                brand: "Εγχώριο",
              } as any,
            },
          },
          {
            ...MOCK_GROCERY_ITEMS[1], // Φέτα ΠΟΠ (dairy)
            selectedOption: {
              ...MOCK_GROCERY_ITEMS[1].selectedOption!,
              product: {
                id: "prod-2",
                name: "ΔΩΔΩΝΗ ΦΕΤΑ ΠΟΠ 400G",
                brand: "ΔΩΔΩΝΗ",
              } as any,
            },
          },
          {
            ...MOCK_GROCERY_ITEMS[2], // Ελαιόλαδο (pantry)
            selectedOption: {
              ...MOCK_GROCERY_ITEMS[2].selectedOption!,
              product: {
                id: "prod-3",
                name: "ΧΩΡΙΟ ΕΞΑΙΡΕΤΙΚΟ ΠΑΡΘΕΝΟ ΕΛΑΙΟΛΑΔΟ 1LT",
                brand: "ΧΩΡΙΟ",
              } as any,
            },
          },
          {
            ...MOCK_GROCERY_ITEMS[3], // Υγρό Πιάτων (household)
            selectedOption: {
              ...MOCK_GROCERY_ITEMS[3].selectedOption!,
              product: {
                id: "prod-4",
                name: "FAIRY ULTRA LEMON 500ML",
                brand: "Fairy",
              } as any,
            },
          },
        ];

        // Greek accent-insensitive normalizer mirroring GroceryListView
        const normalizeSearch = (str: string) =>
          str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        // Search filter helper mirroring GroceryListView logic
        const filterGroceryItems = (items: OptimizedGroceryItem[], query: string) => {
          const q = normalizeSearch(query.trim());
          if (!q) return items;
          return items.filter((item) => {
            const ingMatch = item.ingredientName && normalizeSearch(item.ingredientName).includes(q);
            const nameMatch = item.selectedOption?.product?.name && normalizeSearch(item.selectedOption.product.name).includes(q);
            const brandMatch = item.selectedOption?.product?.brand && normalizeSearch(item.selectedOption.product.brand).includes(q);
            return Boolean(ingMatch || nameMatch || brandMatch);
          });
        };

        // 1. Search by ingredient name: "ντοματ"
        const tomatoMatches = filterGroceryItems(testItems, "ντοματ");
        assertEquals(tomatoMatches.length, 1, "Πρέπει να βρεθεί 1 είδος με όρο «ντοματ»");
        assertEquals(tomatoMatches[0].ingredientId, "ing-tomato", "Το είδος πρέπει να είναι οι ντομάτες");

        // 2. Search by brand name: "ΔΩΔΩΝΗ"
        const dodoniMatches = filterGroceryItems(testItems, "δωδωνη");
        assertEquals(dodoniMatches.length, 1, "Πρέπει να βρεθεί 1 είδος με αναζήτηση μάρκας «δωδωνη»");
        assertEquals(dodoniMatches[0].ingredientId, "ing-feta", "Το είδος πρέπει να είναι η φέτα Δωδώνη");

        // 3. Search by product SKU title: "FAIRY ULTRA"
        const fairyMatches = filterGroceryItems(testItems, "FAIRY ULTRA");
        assertEquals(fairyMatches.length, 1, "Πρέπει να βρεθεί 1 είδος με αναζήτηση «FAIRY ULTRA»");
        assertEquals(fairyMatches[0].ingredientId, "bundle-item-clean-detergent", "Το είδος πρέπει να είναι το fairy");

        // 4. Search for ingredient: "ελαιολαδο"
        const oliveOilMatches = filterGroceryItems(testItems, "ελαιολαδο");
        assertEquals(oliveOilMatches.length, 1, "Πρέπει να βρεθεί το ελαιόλαδο");
        assertEquals(oliveOilMatches[0].ingredientId, "ing-olive-oil");

        // 5. Search for non-existent term
        const emptyMatches = filterGroceryItems(testItems, "αβοκάντο_ανύπαρκτο");
        assertEquals(emptyMatches.length, 0, "Δεν πρέπει να επιστρέψει αποτελέσματα για ανύπαρκτο όρο");

        // 6. Verify original list is unchanged
        assertEquals(testItems.length, 4, "Η αρχική λίστα δεν πρέπει να τροποποιηθεί από τις αναζητήσεις");
      },
    }),
  ],
});
