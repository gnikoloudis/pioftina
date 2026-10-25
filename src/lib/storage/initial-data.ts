import { MealSlot, UserPreferences, UserPantryItem } from "@/types/meal-planner";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";

export const DEFAULT_PREFERENCES: UserPreferences = {
  householdSize: 4,
  preferredSupermarkets: ["sklavenitis", "ab_vasilopoulos", "lidl"],
  prioritizeBulk: true,
  showSurplusWarning: true,
};

export const INITIAL_MEAL_SLOTS: MealSlot[] = [
  // Δευτέρα (Day 0)
  {
    id: "slot-0-breakfast",
    day: 0,
    mealType: "breakfast",
    recipe: SEED_RECIPES.find((r) => r.id === "recipe-arabic-pita-wrap") || SEED_RECIPES[8],
    courseType: "breakfast",
    servings: 2,
  },
  {
    id: "slot-0-lunch-main",
    day: 0,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "moussaka") || SEED_RECIPES[0], // Μουσακάς
    courseType: "main",
    servings: 4,
  },
  {
    id: "slot-0-lunch-salad",
    day: 0,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "greek-salad-dakos") || SEED_RECIPES[6], // Χωριάτικη Σαλάτα & Ντάκος
    courseType: "salad",
    servings: 4,
  },
  {
    id: "slot-0-dinner",
    day: 0,
    mealType: "dinner",
    recipe: SEED_RECIPES.find((r) => r.id === "spanakorizo") || SEED_RECIPES[5], // Σπανακόρυζο
    courseType: "main",
    servings: 4,
  },

  // Τρίτη (Day 1)
  {
    id: "slot-1-lunch",
    day: 1,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "fasolakia-ladera") || SEED_RECIPES[4], // Φασολάκια Λαδερά
    courseType: "main",
    servings: 4,
  },
  {
    id: "slot-1-dinner",
    day: 1,
    mealType: "dinner",
    recipe: SEED_RECIPES.find((r) => r.id === "fakes-soup") || SEED_RECIPES[7], // Φακές
    courseType: "main",
    servings: 4,
  },

  // Τετάρτη (Day 2)
  {
    id: "slot-2-lunch",
    day: 2,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "spaghetti-kimas") || SEED_RECIPES[3], // Μακαρόνια με Κιμά
    courseType: "main",
    servings: 4,
  },
  {
    id: "slot-2-dinner",
    day: 2,
    mealType: "dinner",
    recipe: SEED_RECIPES.find((r) => r.id === "gemista") || SEED_RECIPES[1], // Γεμιστά
    courseType: "main",
    servings: 4,
  },

  // Παρασκευή (Day 4)
  {
    id: "slot-4-lunch-main",
    day: 4,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "roast-chicken-potatoes") || SEED_RECIPES[2], // Κοτόπουλο στο Φούρνο
    courseType: "main",
    servings: 4,
  },
  {
    id: "slot-4-lunch-salad",
    day: 4,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "greek-salad-dakos") || SEED_RECIPES[6], // Σαλάτα Ντάκος
    courseType: "salad",
    servings: 4,
  },
  {
    id: "slot-4-dinner",
    day: 4,
    mealType: "dinner",
    recipe: SEED_RECIPES.find((r) => r.id === "fasolakia-ladera") || SEED_RECIPES[4],
    courseType: "main",
    servings: 4,
  },

  // Κυριακή (Day 6)
  {
    id: "slot-6-breakfast",
    day: 6,
    mealType: "breakfast",
    recipe: SEED_RECIPES.find((r) => r.id === "recipe-arabic-pita-wrap") || SEED_RECIPES[8],
    courseType: "breakfast",
    servings: 2,
  },
  {
    id: "slot-6-lunch-main",
    day: 6,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "moussaka") || SEED_RECIPES[0], // Μουσακάς
    courseType: "main",
    servings: 4,
  },
  {
    id: "slot-6-lunch-salad",
    day: 6,
    mealType: "lunch",
    recipe: SEED_RECIPES.find((r) => r.id === "greek-salad-dakos") || SEED_RECIPES[6], // Σαλάτα Ντάκος
    courseType: "salad",
    servings: 4,
  },
];

export const DEFAULT_PANTRY_ITEMS: UserPantryItem[] = [
  {
    id: "pantry-olive-oil",
    name: "Εξαιρετικό Παρθένο Ελαιόλαδο",
    amount: 1,
    unit: "L",
    category: "pantry",
    notes: "Βασικό ντουλάπι μαγειρικής",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-sea-salt",
    name: "Αλάτι Ψιλό Θαλασσινό",
    amount: 1,
    unit: "kg",
    category: "pantry",
    notes: "Ντουλάπι μπαχαρικών",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-oregano",
    name: "Ρίγανη Ελληνική",
    amount: 50,
    unit: "g",
    category: "pantry",
    notes: "Μπαχαρικά & βότανα",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-feta",
    name: "Φέτα Π.Ο.Π. Δοχείο",
    amount: 400,
    unit: "g",
    category: "dairy",
    notes: "Στο ψυγείο",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-onions",
    name: "Κρεμμύδια Ξερά",
    amount: 2,
    unit: "kg",
    category: "produce",
    notes: "Καλάθι μαναβικής",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-cleaning",
    name: "Χαρτί Κουζίνας & Απορρυπαντικό",
    amount: 2,
    unit: "τεμ",
    category: "household",
    notes: "Ντουλάπι καθαριστικών",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "pantry-baby-wipes",
    name: "Μωρομάντηλα Sensitive (Πακέτο)",
    amount: 1,
    unit: "τεμ",
    category: "baby",
    notes: "Βρεφική φροντίδα & καθαριότητα",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
];
