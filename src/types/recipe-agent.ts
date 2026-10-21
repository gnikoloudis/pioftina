import { Recipe, Ingredient, AisleCategory, RecipeCategory } from "./meal-planner";
import { Product } from "@/lib/posokanei/types";

export type IngestionMode = "url" | "text" | "prompt" | "catalog";

export interface AgentQuantityWarning {
  id: string;
  type: "excessive" | "insufficient" | "unit_unusual" | "missing_query" | "non_food";
  severity: "error" | "warning" | "info";
  message: string;
  suggestedAmount?: number;
  suggestedUnit?: "g" | "kg" | "ml" | "l" | "L" | "τεμ";
}

export interface AgentIngredientAudit {
  ingredientId: string;
  name: string;
  originalRawText?: string;
  amount: number;
  unit: "g" | "kg" | "ml" | "l" | "L" | "τεμ";
  category: AisleCategory;
  posokaneiQuery: string;
  amountPerServing: number;
  warnings: AgentQuantityWarning[];
  matchedProduct?: Product;
  matchConfidence: number; // 0 to 100
  isCurated: boolean;
  notes?: string;
}

export interface AgentParsedRecipe {
  id?: string;
  title: string;
  titleEn?: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  imageUrl?: string;
  category: RecipeCategory;
  instructions: string[];
  rawIngredients: string[];
  ingredients: AgentIngredientAudit[];
  sourceUrl?: string;
  sourceType: IngestionMode;
}

export interface AgentCurationDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
  recipe: AgentParsedRecipe;
  status: "draft" | "audited" | "published";
  resolvedWarningIds: string[];
}
