import { Product } from "@/lib/posokanei/types";

export type AisleCategory =
  | "dairy"
  | "meat"
  | "produce"
  | "pantry"
  | "bakery"
  | "beverages"
  | "household"
  | "baby";

export interface AisleCategoryMeta {
  key: AisleCategory;
  nameEl: string;
  nameEn: string;
  icon: string;
  badgeColor: string;
}

export const AISLE_CATEGORIES: Record<AisleCategory, AisleCategoryMeta> = {
  dairy: {
    key: "dairy",
    nameEl: "Γαλακτοκομικά & Τυριά",
    nameEn: "Dairy & Cheese",
    icon: "🧀",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  meat: {
    key: "meat",
    nameEl: "Κρεοπωλείο & Ψάρια",
    nameEn: "Meat & Fish",
    icon: "🥩",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  },
  produce: {
    key: "produce",
    nameEl: "Μαναβική & Οπωροπωλείο",
    nameEn: "Produce & Veggies",
    icon: "🥬",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  pantry: {
    key: "pantry",
    nameEl: "Παντοπωλείο & Ζυμαρικά",
    nameEn: "Pantry & Pasta",
    icon: "🥫",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  },
  bakery: {
    key: "bakery",
    nameEl: "Αρτοποιείο & Σνακ",
    nameEn: "Bakery",
    icon: "🥖",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  },
  beverages: {
    key: "beverages",
    nameEl: "Ποτά & Αναψυκτικά",
    nameEn: "Beverages",
    icon: "🧃",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  },
  household: {
    key: "household",
    nameEl: "Είδη Σπιτιού & Φροντίδα",
    nameEn: "Household",
    icon: "🧼",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  baby: {
    key: "baby",
    nameEl: "Βρεφικά Είδη & Φροντίδα",
    nameEn: "Baby Care",
    icon: "👶",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
};

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: "g" | "kg" | "ml" | "l" | "L" | "τεμ";
  category: AisleCategory;
  posokaneiQuery: string;
  curatedProductId?: string;
  curatedProduct?: Product;
  isCurated?: boolean;
  notes?: string;
}

export type RecipeCategory =
  | "traditional"
  | "quick"
  | "vegetarian"
  | "comfort"
  | "healthy"
  | "meat"
  | "fish"
  | "pasta"
  | "pies"
  | string;

export interface RecipeCategoryMeta {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
}

export const RECIPE_CATEGORIES: RecipeCategoryMeta[] = [
  { id: "traditional", label: "🇬🇷 Παραδοσιακά", shortLabel: "Παραδοσιακά", icon: "🇬🇷" },
  { id: "quick", label: "⚡ Γρήγορα", shortLabel: "Γρήγορα", icon: "⚡" },
  { id: "breakfast", label: "🥞 Πρωινά", shortLabel: "Πρωινά", icon: "🥞" },
  { id: "salads", label: "🥗 Σαλάτες", shortLabel: "Σαλάτες", icon: "🥗" },
  { id: "snacks", label: "🍎 Σνακ", shortLabel: "Σνακ", icon: "🍎" },
  { id: "vegetarian", label: "🌿 Λαδερά & Χορτοφαγικά", shortLabel: "Λαδερά/Vegan", icon: "🌿" },
  { id: "comfort", label: "🍲 Comfort", shortLabel: "Comfort", icon: "🍲" },
  { id: "healthy", label: "💪 Υγιεινά & Fit", shortLabel: "Υγιεινά", icon: "💪" },
  { id: "meat", label: "🥩 Κρεατικά", shortLabel: "Κρεατικά", icon: "🥩" },
  { id: "fish", label: "🐟 Ψάρια & Θαλασσινά", shortLabel: "Ψάρια", icon: "🐟" },
  { id: "pasta", label: "🍝 Ζυμαρικά", shortLabel: "Ζυμαρικά", icon: "🍝" },
  { id: "pies", label: "🥧 Πίτες & Ζύμες", shortLabel: "Πίτες", icon: "🥧" },
];

export function getRecipeCategoryMeta(categoryId?: string): RecipeCategoryMeta {
  const match = RECIPE_CATEGORIES.find(
    (c) => c.id.toLowerCase() === (categoryId || "").toLowerCase()
  );
  if (match) return match;
  return {
    id: categoryId || "traditional",
    label: categoryId || "Άλλο",
    shortLabel: categoryId || "Άλλο",
    icon: "🍽️",
  };
}

export interface Recipe {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  imageUrl: string;
  category: RecipeCategory;
  ingredients: Ingredient[];
  instructions?: string[];
  isCurated?: boolean;
  referenceUrl?: string;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Δευτέρα (Monday)

export const DAYS_GREEK = [
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
  "Κυριακή",
];

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export type CourseType = "main" | "salad" | "side" | "snack" | "breakfast";

export interface MealTypeMeta {
  id: MealType;
  label: string;
  icon: string;
  badge: string;
  description: string;
}

export const MEAL_TYPES_CONFIG: MealTypeMeta[] = [
  {
    id: "breakfast",
    label: "Πρωινό",
    icon: "☕",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Πρωινό γεύμα & ροφήματα",
  },
  {
    id: "lunch",
    label: "Μεσημεριανό",
    icon: "☀️",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Κυρίως γεύμα, σαλάτες & συνοδευτικά",
  },
  {
    id: "snack",
    label: "Σνακ",
    icon: "🍎",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Ενδιάμεσα σνακ & φρούτα",
  },
  {
    id: "dinner",
    label: "Βραδινό",
    icon: "🌙",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    description: "Ελαφρύ ή κυρίως βραδινό γεύμα",
  },
];

export interface MealSlot {
  id: string;
  day: DayOfWeek;
  mealType: MealType;
  recipe: Recipe | null;
  customTitle?: string;
  courseType?: CourseType;
  servings: number;
}

export interface UserPreferences {
  householdSize: number;
  preferredSupermarkets: string[];
  prioritizeBulk: boolean;
  showSurplusWarning: boolean;
}

export interface PackOption {
  product: Product;
  packSize: number; // in base units (kg, L, etc.)
  packUnit: string;
  packCount: number;
  totalQuantity: number;
  totalPrice: number;
  unitPrice: number;
  retailer: string;
  retailerName: string;
  isBulk: boolean;
  savingsVsSmallestPercent?: number;
  isSynthetic?: boolean;
  isAvailable?: boolean;
}

export interface OptimizedGroceryItem {
  ingredientId: string;
  ingredientName: string;
  category: AisleCategory;
  rawRequiredAmount: number;
  rawUnit: string;
  normalizedRequiredAmount: number; // in kg or L
  normalizedUnit: string;
  selectedOption: PackOption | null;
  alternativeOptions: PackOption[];
  surplusAmount: number; // leftover amount
  surplusUnit: string;
  isChecked: boolean;
  inPantry: boolean;
  isExcluded?: boolean;
  isAvailable?: boolean;
  curatedProduct?: Product;
  isCurated?: boolean;
  isUnmatched?: boolean;
}

export interface BasketComparison {
  retailerId: string;
  retailerName: string;
  logoUrl: string | null;
  totalCost: number;
  remainingCost: number;
  purchasedCost: number;
  itemCount: number;
  purchasedCount: number;
  totalItems: number;
  isCheapest: boolean;
  savingsVsAverage: number;
  unavailableCount?: number;
}

export interface PantrySurplusItem {
  id: string;
  ingredientName: string;
  amount: number;
  unit: string;
  category: AisleCategory;
  originMealNames: string[];
}

export interface UserPantryItem {
  id: string;
  name: string;
  amount: number;
  unit: "g" | "kg" | "ml" | "l" | "L" | "τεμ" | string;
  category: AisleCategory;
  notes?: string;
  isSurplus?: boolean;
  originMealNames?: string[];
  createdAt: string;
  updatedAt: string;
}

