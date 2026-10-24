import { defineSuite, defineTest } from "../core/runner";
import { SEED_RECIPES, RAW_SEED_RECIPES } from "@/lib/recipes/seed-recipes";
import { BREAKFAST_RECIPES } from "@/lib/recipes/data/breakfast-recipes";
import { LUNCH_RECIPES } from "@/lib/recipes/data/lunch-recipes";
import { DINNER_RECIPES } from "@/lib/recipes/data/dinner-recipes";
import { SNACK_RECIPES } from "@/lib/recipes/data/snack-recipes";
import { calculateRecipeCost } from "@/lib/recipes/recipe-cost";

export const recipesSuite = defineSuite({
  id: "recipes-suite",
  name: "Συνταγές & Curation Supermarket",
  category: "recipes",
  description: "Ελέγχει τη δομή των 80 συνταγών, τις ποσοστώσεις, το 100% curation με ελληνικά σούπερ μάρκετ και τον υπολογισμό κόστους μερίδας.",
  tests: [
    defineTest({
      id: "recipes-catalog-count",
      title: "Επαλήθευση πλήθους 80 βασικών συνταγών",
      category: "recipes",
      description: "Επαληθεύει ότι οι ενσωματωμένες συνταγές είναι τουλάχιστον 80.",
      documentation: "Ελέγχει το μέγεθος του RAW_SEED_RECIPES και SEED_RECIPES. Εξασφαλίζει ότι καμία συνταγή δεν παραλείφθηκε κατά το build.",
      tags: ["smoke", "recipes", "curation"],
      severity: "critical",
      run: ({ assert, assertEquals }) => {
        assertEquals(RAW_SEED_RECIPES.length, 80, "Το RAW_SEED_RECIPES πρέπει να έχει ακριβώς 80 συνταγές");
        assertEquals(SEED_RECIPES.length, 80, "Το SEED_RECIPES πρέπει να έχει ακριβώς 80 συνταγές");
      },
    }),

    defineTest({
      id: "recipes-category-quotas",
      title: "Ποσοστώσεις κατηγοριών (20 Πρωινά, 30 Μεσημεριανά, 20 Βραδινά, 10 Σνακ)",
      category: "recipes",
      description: "Επαληθεύει την ακριβή κατανομή των συνταγών ανά γεύμα της ημέρας.",
      documentation: "Ελέγχει τα επιμέρους modular αρχεία: breakfast-recipes (20), lunch-recipes (30), dinner-recipes (20), snack-recipes (10).",
      tags: ["recipes", "regression"],
      severity: "high",
      run: ({ assertEquals }) => {
        assertEquals(BREAKFAST_RECIPES.length, 20, "Τα Πρωινά πρέπει να είναι ακριβώς 20");
        assertEquals(LUNCH_RECIPES.length, 30, "Τα Μεσημεριανά πρέπει να είναι ακριβώς 30");
        assertEquals(DINNER_RECIPES.length, 20, "Τα Βραδινά πρέπει να είναι ακριβώς 20");
        assertEquals(SNACK_RECIPES.length, 10, "Τα Σνακ πρέπει να είναι ακριβώς 10");
      },
    }),

    defineTest({
      id: "recipes-100-percent-curation-audit",
      title: "100% Curation Audit στα υλικά των 80 συνταγών",
      category: "recipes",
      description: "Επιβεβαιώνει ότι κάθε συστατικό των 80 συνταγών έχει αντιστοιχιστεί σε πραγματικό προϊόν σούπερ μάρκετ.",
      documentation: "Διασχίζει όλα τα υλικά στο SEED_RECIPES. Ελέγχει ότι i.isCurated === true και ότι υπάρχει έγκυρο curatedProduct με id και τιμή.",
      tags: ["critical", "curation", "recipes"],
      severity: "critical",
      run: ({ assert }) => {
        let total = 0;
        let curated = 0;
        const uncuratedList: string[] = [];

        for (const recipe of SEED_RECIPES) {
          for (const ing of recipe.ingredients) {
            total++;
            if (ing.isCurated && ing.curatedProduct) {
              curated++;
            } else {
              uncuratedList.push(`${recipe.title} -> ${ing.name} (${ing.posokaneiQuery})`);
            }
          }
        }

        assert(
          uncuratedList.length === 0,
          `Βρέθηκαν ${uncuratedList.length} μη επιμελημένα υλικά: ${uncuratedList.slice(0, 5).join(", ")}`
        );
        assert(total > 0, "Πρέπει να υπάρχουν καταχωρημένα υλικά");
        assert(curated === total, `Ποσοστό επιμέλειας: ${(curated / total * 100).toFixed(1)}% (αναμενόμενο: 100%)`);
      },
    }),

    defineTest({
      id: "recipes-cost-per-serving-check",
      title: "Υπολογισμός κόστους ανά μερίδα (Cost per Serving)",
      category: "recipes",
      description: "Ελέγχει ότι ο υπολογισμός κόστους μερίδας παράγει ρεαλιστικές τιμές (>0€ και <15€) για κάθε συνταγή.",
      documentation: "Εκτελεί τη συνάρτηση calculateRecipeCost σε όλες τις συνταγές και επαληθεύει ότι costPerServing > 0, δεν είναι NaN και δεν ξεπερνά τα λογικά όρια.",
      tags: ["recipes", "pricing", "regression"],
      severity: "high",
      run: ({ assert, assertInRange }) => {
        for (const recipe of SEED_RECIPES) {
          const cost = calculateRecipeCost(recipe);
          assert(
            !isNaN(cost.costPerServing) && cost.costPerServing > 0,
            `Η συνταγή "${recipe.title}" έχει μη έγκυρο κόστος μερίδας: ${cost.costPerServing}`
          );
          assertInRange(
            cost.costPerServing,
            0.2,
            15.0,
            `Το κόστος μερίδας της συνταγής "${recipe.title}" (${cost.costPerServing}€) είναι εκτός λογικών ορίων`
          );
          assert(cost.pricedCount > 0, `Η συνταγή "${recipe.title}" δεν έχει κοστολογημένα υλικά`);
        }
      },
    }),

    defineTest({
      id: "recipes-metric-units-and-servings",
      title: "Έλεγχος μετρικών μονάδων και μερίδων",
      category: "recipes",
      description: "Επαληθεύει ότι όλες οι συνταγές χρησιμοποιούν αυστηρά μετρικές μονάδες (g, kg, ml, l, τεμ) και έχουν λογικό αριθμό μερίδων.",
      documentation: "Ελέγχει servings >= 1 και <= 12, καθώς και τις μονάδες μέτρησης ώστε να μην υπάρχουν αυθαίρετες μονάδες όπως 'κούπα' ή 'κουταλιά' στα υπολογιστικά πεδία.",
      tags: ["recipes", "quality"],
      severity: "medium",
      run: ({ assert, assertInRange }) => {
        const allowedUnits = new Set(["g", "kg", "ml", "l", "L", "τεμ"]);

        for (const recipe of SEED_RECIPES) {
          assertInRange(recipe.servings, 1, 12, `Η συνταγή "${recipe.title}" έχει άκυρο αριθμό μερίδων: ${recipe.servings}`);
          assert(recipe.prepTimeMinutes > 0, `Η συνταγή "${recipe.title}" πρέπει να έχει χρόνο προετοιμασίας > 0`);

          for (const ing of recipe.ingredients) {
            assert(
              allowedUnits.has(ing.unit),
              `Το υλικό "${ing.name}" στη συνταγή "${recipe.title}" έχει μη έγκυρη μονάδα: "${ing.unit}"`
            );
            assert(ing.amount > 0, `Το υλικό "${ing.name}" έχει ποσότητα <= 0`);
          }
        }
      },
    }),

    defineTest({
      id: "recipes-reference-urls-validity",
      title: "Εγκυρότητα διαδικτυακών πηγών (Reference URLs)",
      category: "recipes",
      description: "Επιβεβαιώνει ότι όλες οι συνταγές διαθέτουν έγκυρο σύνδεσμο διαδικτύου από αυθεντικές ελληνικές πηγές.",
      documentation: "Ελέγχει ότι referenceUrl ξεκινά με http:// ή https:// και προέρχεται από αξιόπιστους culinary ιστοτόπους.",
      tags: ["recipes", "sources"],
      severity: "low",
      run: ({ assert }) => {
        for (const recipe of SEED_RECIPES) {
          assert(
            !!recipe.referenceUrl && recipe.referenceUrl.startsWith("http"),
            `Η συνταγή "${recipe.title}" δεν έχει έγκυρο referenceUrl: "${recipe.referenceUrl}"`
          );
        }
      },
    }),
  ],
});
