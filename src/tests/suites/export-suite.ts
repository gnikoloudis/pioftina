import { TestSuite } from "../core/types";
import {
  generatePlanAndShoppingListText,
  generatePlanAndShoppingListHtml,
  generateBundleText,
  PlanExportData,
} from "@/lib/export/plan-exporter";
import { INITIAL_MEAL_SLOTS, DEFAULT_PREFERENCES } from "@/lib/storage/initial-data";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";
import { OptimizedGroceryItem } from "@/types/meal-planner";
import { ProductBundle } from "@/types/bundles";

const SAMPLE_GROCERY_ITEMS: OptimizedGroceryItem[] = [
  {
    ingredientId: "ing-tomato",
    ingredientName: "Ντομάτες",
    category: "produce",
    rawRequiredAmount: 1200,
    rawUnit: "g",
    normalizedRequiredAmount: 1.2,
    normalizedUnit: "kg",
    alternativeOptions: [],
    surplusAmount: 300,
    surplusUnit: "g",
    isChecked: false,
    inPantry: false,
    isExcluded: false,
    selectedOption: {
      product: {} as any,
      packCount: 1,
      packSize: 1.5,
      packUnit: "kg",
      totalQuantity: 1.5,
      totalPrice: 2.1,
      unitPrice: 1.4,
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
      totalPrice: 4.8,
      unitPrice: 12.0,
      retailer: "ab_vasilopoulos",
      retailerName: "ΑΒ Βασιλόπουλος",
      isBulk: false,
    },
  },
];

export const exportSuite: TestSuite = {
  id: "suite-export",
  name: "Εξαγωγή & Αποθήκευση στον Υπολογιστή (Save to PC)",
  category: "export",
  description:
    "Δοκιμές για την ορθή παραγωγή του εβδομαδιαίου πλάνου και της λίστας αγορών σε αρχείο .txt, εκτυπώσιμο HTML/PDF και JSON backup.",
  tests: [
    {
      id: "TEST-EXP-01",
      title: "Ορθή παραγωγή αρχείου κειμένου (.txt) με πλήρες πρόγραμμα και λίστα",
      category: "export",
      severity: "high",
      tags: ["export", "text", "week-plan", "grocery-list"],
      description:
        "Επαληθεύει ότι το παραγόμενο αρχείο κειμένου περιέχει τις 7 ημέρες, τα προγραμματισμένα γεύματα με μερίδες, και τα είδη της λίστας με κουτάκια [ ].",
      documentation:
        "Η συνάρτηση generatePlanAndShoppingListText πρέπει να επιστρέφει ένα πλήρες, δομημένο κείμενο UTF-8 με διαχωριστικά και σύνολα.",
      run: ({ assert, assertContains }) => {
        const testData: PlanExportData = {
          slots: INITIAL_MEAL_SLOTS,
          groceryItems: SAMPLE_GROCERY_ITEMS,
          preferences: DEFAULT_PREFERENCES,
          totalCost: 6.9,
          remainingCost: 2.1,
          purchasedCost: 4.8,
          totalSavings: 1.5,
          pantrySurplus: [
            {
              id: "surplus-tomato",
              ingredientName: "Ντομάτες",
              amount: 300,
              unit: "g",
              category: "produce",
              originMealNames: ["Μουσακάς", "Χωριάτικη"],
            },
          ],
        };

        const text = generatePlanAndShoppingListText(testData);

        assert(text.length > 500, "Το παραγόμενο κείμενο πρέπει να είναι αναλυτικό (>500 χαρακτήρες)");
        assertContains(text, "PIOFTINA.GR", "Πρέπει να περιέχει την ταυτότητα της εφαρμογής");
        assertContains(text, "ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΓΡΑΜΜΑ ΓΕΥΜΑΤΩΝ", "Πρέπει να περιέχει την ενότητα προγράμματος");
        assertContains(text, "ΟΡΓΑΝΩΜΕΝΗ ΛΙΣΤΑ ΑΓΟΡΩΝ", "Πρέπει να περιέχει την ενότητα λίστας αγορών");
        assertContains(text, "[ΔΕΥΤΕΡΑ]", "Πρέπει να περιλαμβάνει τις ημέρες της εβδομάδας");
        assertContains(text, "Μουσακάς", "Πρέπει να περιλαμβάνει τις επιλεγμένες συνταγές");
        assertContains(text, "Μερίδες:", "Πρέπει να αναγράφει τις μερίδες ανά γεύμα");
        assertContains(text, "Ντομάτες", "Πρέπει να περιλαμβάνει τα υλικά της λίστας");
        assertContains(text, "[ ]", "Πρέπει να περιλαμβάνει checkboxes για τα μη αγορασμένα υλικά");
        assertContains(text, "[X]", "Πρέπει να περιλαμβάνει [X] για τα ήδη αγορασμένα υλικά");
        assertContains(text, "€6.90", "Πρέπει να αναγράφει το εκτιμώμενο κόστος");
        assertContains(text, "ΑΠΟΘΗΚΗ & ΠΛΕΟΝΑΣΜΑ", "Πρέπει να περιλαμβάνει την ενότητα πλεονάσματος");
      },
    },

    {
      id: "TEST-EXP-02",
      title: "Εκτυπώσιμη HTML διάταξη (A4 Print / Save as PDF)",
      category: "export",
      severity: "high",
      tags: ["export", "html", "print", "pdf"],
      description:
        "Ελέγχει ότι η παραγόμενη σελίδα HTML για εκτύπωση είναι έγκυρη, περιέχει @media print styles και πίνακα γευμάτων.",
      documentation:
        "Το HTML έγγραφο πρέπει να είναι αυτόνομο με inline CSS για άμεση εκτύπωση ή εξαγωγή σε PDF χωρίς εξωτερικές εξαρτήσεις.",
      run: ({ assert, assertContains }) => {
        const testData: PlanExportData = {
          slots: INITIAL_MEAL_SLOTS,
          groceryItems: SAMPLE_GROCERY_ITEMS,
          preferences: DEFAULT_PREFERENCES,
          totalCost: 12.5,
          remainingCost: 12.5,
          purchasedCost: 0,
          totalSavings: 2.0,
        };

        const html = generatePlanAndShoppingListHtml(testData);

        assertContains(html, "<!DOCTYPE html>", "Πρέπει να είναι πλήρες έγγραφο HTML5");
        assertContains(html, '<html lang="el">', "Πρέπει να έχει ορισμένη ελληνική γλώσσα");
        assertContains(html, "@media print", "Πρέπει να περιέχει κανόνες εκτύπωσης @media print");
        assertContains(html, "meal-table", "Πρέπει να περιέχει πίνακα γευμάτων");
        assertContains(html, "shopping-grid", "Πρέπει να περιέχει grid λίστας αγορών");
        assertContains(html, "checkbox-box", "Πρέπει να περιέχει κουτάκια επιλογής για εκτύπωση");
      },
    },

    {
      id: "TEST-EXP-03",
      title: "Ανθεκτικότητα σε κενό πλάνο & κενή λίστα αγορών",
      category: "export",
      severity: "medium",
      tags: ["export", "resilience", "edge-case"],
      description:
        "Επιβεβαιώνει ότι η εξαγωγή δεν καταρρέει ακόμη κι αν ο χρήστης δεν έχει επιλέξει κανένα γεύμα ή αν η λίστα είναι κενή.",
      documentation:
        "Πρέπει να εμφανίζονται επεξηγηματικά μηνύματα κενής κατάστασης χωρίς uncaught errors.",
      run: ({ assert, assertContains }) => {
        const emptyData: PlanExportData = {
          slots: [],
          groceryItems: [],
          preferences: DEFAULT_PREFERENCES,
          totalCost: 0,
          remainingCost: 0,
          purchasedCost: 0,
          totalSavings: 0,
        };

        const text = generatePlanAndShoppingListText(emptyData);
        assert(typeof text === "string" && text.length > 100, "Πρέπει να επιστρέφει έγκυρο κείμενο");
        assertContains(text, "Δεν έχουν προγραμματιστεί γεύματα", "Πρέπει να χειρίζεται κενές ημέρες");

        const html = generatePlanAndShoppingListHtml(emptyData);
        assert(typeof html === "string" && html.includes("<!DOCTYPE html>"), "Πρέπει να επιστρέφει έγκυρο HTML");
      },
    },

    {
      id: "TEST-EXP-04",
      title: "Εγκυρότητα δομής ψηφιακού αντιγράφου JSON Backup",
      category: "export",
      severity: "medium",
      tags: ["export", "json", "backup"],
      description:
        "Επαληθεύει ότι τα δεδομένα πλάνου και ρυθμίσεων μπορούν να σειριοποιηθούν σε JSON χωρίς circular references.",
      documentation:
        "Το JSON backup επιτρέπει την τοπική αποθήκευση του πλήρους configuration του χρήστη.",
      run: ({ assert }) => {
        const backupPayload = {
          version: "1.0",
          exportedAt: new Date().toISOString(),
          preferences: DEFAULT_PREFERENCES,
          slots: INITIAL_MEAL_SLOTS.map((s) => ({
            day: s.day,
            mealType: s.mealType,
            recipeId: s.recipe?.id,
            recipeTitle: s.recipe?.title,
            servings: s.servings,
          })),
        };

        const jsonStr = JSON.stringify(backupPayload, null, 2);
        assert(jsonStr.length > 200, "Το JSON payload πρέπει να σειριοποιείται ορθά");

        const parsed = JSON.parse(jsonStr);
        assert(parsed.version === "1.0", "Η έκδοση backup πρέπει να είναι 1.0");
        assert(Array.isArray(parsed.slots) && parsed.slots.length > 0, "Πρέπει να περιέχει τη λίστα slots");
      },
    },

    {
      id: "TEST-EXP-05",
      title: "Επαλήθευση εξαγωγής πακέτων καθαριότητας & βρεφικών (Household & Baby Care Bundles)",
      category: "export",
      severity: "high",
      tags: ["export", "bundles", "cleaning", "baby"],
      description:
        "Επαληθεύει ότι προϊόντα από πακέτα καθαριότητας (household) και βρεφικής φροντίδας (baby) εξάγονται κανονικά στο αρχείο .txt και στο εκτυπώσιμο HTML κάτω από τους αντίστοιχους διαδρόμους.",
      documentation:
        "Η συνάρτηση generatePlanAndShoppingListText και generatePlanAndShoppingListHtml πρέπει να αναγνωρίζει τις κατηγορίες household και baby.",
      run: ({ assertContains }) => {
        const bundleGroceryItems: OptimizedGroceryItem[] = [
          ...SAMPLE_GROCERY_ITEMS,
          {
            ingredientId: "bundle-cleaning-1-ariel",
            ingredientName: "Ariel All-in-1 Pods (Ariel)",
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
              packSize: 70,
              packUnit: "μεζούρες",
              totalQuantity: 1,
              totalPrice: 18.9,
              unitPrice: 18.9,
              retailer: "sklavenitis",
              retailerName: "Σκλαβενίτης",
              isBulk: false,
            },
          },
          {
            ingredientId: "bundle-baby-1-pampers",
            ingredientName: "Pampers Premium Care No4 (Pampers)",
            category: "baby",
            rawRequiredAmount: 2,
            rawUnit: "τεμ",
            normalizedRequiredAmount: 2,
            normalizedUnit: "τεμ",
            alternativeOptions: [],
            surplusAmount: 0,
            surplusUnit: "τεμ",
            isChecked: false,
            inPantry: false,
            isExcluded: false,
            selectedOption: {
              product: {} as any,
              packCount: 2,
              packSize: 104,
              packUnit: "πάνες",
              totalQuantity: 2,
              totalPrice: 38.5,
              unitPrice: 19.25,
              retailer: "ab_vasilopoulos",
              retailerName: "ΑΒ Βασιλόπουλος",
              isBulk: true,
            },
          },
        ];

        const testData: PlanExportData = {
          slots: INITIAL_MEAL_SLOTS,
          groceryItems: bundleGroceryItems,
          preferences: DEFAULT_PREFERENCES,
          totalCost: 64.3,
          remainingCost: 59.5,
          purchasedCost: 4.8,
          totalSavings: 5.2,
        };

        const textOutput = generatePlanAndShoppingListText(testData);
        assertContains(textOutput, "Ariel All-in-1 Pods", "Το κείμενο πρέπει να περιλαμβάνει το προϊόν καθαριότητας");
        assertContains(textOutput, "Pampers Premium Care", "Το κείμενο πρέπει να περιλαμβάνει το βρεφικό προϊόν");
        assertContains(textOutput, "ΕΙΔΗ ΣΠΙΤΙΟΥ", "Πρέπει να υπάρχει επικεφαλίδα για τα είδη σπιτιού");
        assertContains(textOutput, "ΒΡΕΦΙΚΑ ΕΙΔΗ", "Πρέπει να υπάρχει επικεφαλίδα για τα βρεφικά είδη");

        const htmlOutput = generatePlanAndShoppingListHtml(testData);
        assertContains(htmlOutput, "Ariel All-in-1 Pods", "Το HTML πρέπει να περιλαμβάνει το προϊόν καθαριότητας");
        assertContains(htmlOutput, "Pampers Premium Care", "Το HTML πρέπει να περιλαμβάνει το βρεφικό προϊόν");
      },
    },
    {
      id: "TEST-EXP-06",
      title: "Ανεξάρτητη εξαγωγή αρχείου πακέτου (.txt) χωρίς προσθήκη στο καλάθι (Decoupled Export)",
      category: "export",
      severity: "high",
      tags: ["export", "bundles", "decoupled"],
      description:
        "Επαληθεύει ότι το πάτημα «Αποθήκευση» παράγει πλήρες αρχείο .txt του πακέτου με τιμές και προϊόντα, χωρίς να προσθέτει αυτόματα τα είδη στη Λίστα Αγορών.",
      documentation:
        "Η συνάρτηση generateBundleText πρέπει να περιλαμβάνει τον τίτλο του πακέτου, το φθηνότερο σούπερ μάρκετ, τη λίστα προϊόντων και να μην εμφανίζει ψευδές μήνυμα ότι προστέθηκαν στη λίστα.",
      run: ({ assert, assertEquals, assertContains }) => {
        const mockBundle: ProductBundle = {
          id: "bundle-cleaning-starter-test",
          category: "cleaning",
          title: "Βασικό Πακέτο Καθαριότητας Σπιτιού",
          slug: "starter-clean-pack",
          description: "Όλα τα βασικά απορρυπαντικά και καθαριστικά για το σπίτι σε προνομιακή τιμή.",
          badge: "Best Value",
          icon: "🧼",
          cadence: "monthly",
          cadenceLabel: "Μηνιαίο Πακέτο",
          estimatedTotalEur: 14.85,
          estimatedSavingsEur: 3.20,
          bestStoreId: "sklavenitis",
          bestStoreName: "Σκλαβενίτης",
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: [
            {
              id: "item-pods",
              name: "Ariel All-in-1 Pods Color",
              brand: "Ariel",
              categoryTag: "Απορρυπαντικό Ρούχων",
              quantity: 1,
              unitLabel: "38 κάψουλες",
              posokaneiQuery: "ariel all in 1 pods",
              referencePriceEur: 9.85,
            },
            {
              id: "item-dish",
              name: "Fairy Ultra Υγρό Πιάτων 500ml",
              brand: "Fairy",
              categoryTag: "Υγρό Πιάτων",
              quantity: 2,
              unitLabel: "500ml",
              posokaneiQuery: "fairy ultra lemon",
              referencePriceEur: 2.50,
            },
          ],
        };

        const bundleTxt = generateBundleText(mockBundle);

        // Header and metadata assertions
        assertContains(bundleTxt, "Βασικό Πακέτο Καθαριότητας Σπιτιού", "Πρέπει να περιέχει τον τίτλο");
        assertContains(bundleTxt, "Μηνιαίο Πακέτο", "Πρέπει να περιέχει τη συχνότητα/cadence");
        assertContains(bundleTxt, "Καθαριότητα Σπιτιού", "Πρέπει να περιέχει την κατηγορία");
        assertContains(bundleTxt, "14.85", "Πρέπει να περιέχει τη χαμηλότερη τιμή");
        assertContains(bundleTxt, "Σκλαβενίτης", "Πρέπει να περιέχει το φθηνότερο σούπερ μάρκετ");
        assertContains(bundleTxt, "3.20", "Πρέπει να περιέχει το εκτιμώμενο κέρδος");

        // Item assertions
        assertContains(bundleTxt, "Ariel All-in-1 Pods Color", "Πρέπει να περιέχει το 1ο προϊόν");
        assertContains(bundleTxt, "Fairy Ultra Υγρό Πιάτων", "Πρέπει να περιέχει το 2ο προϊόν");

        // Decoupling verification: shouldn't state it was added to grocery list
        assert(
          !bundleTxt.includes("(Προστέθηκαν και στη Λίστα Αγορών σας)"),
          "Το εξαγόμενο αρχείο δεν πρέπει να περιέχει το παλιό μήνυμα αυτόματης προσθήκης στο καλάθι"
        );
        assertContains(bundleTxt, "ΠΡΟΪΟΝΤΑ ΠΑΚΕΤΟΥ:", "Πρέπει να περιέχει καθαρή επικεφαλίδα προϊόντων");
      },
    },
  ],
};
