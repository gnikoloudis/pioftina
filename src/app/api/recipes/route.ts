import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Recipe } from "@/types/meal-planner";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";

const DATA_FILE = path.join(process.cwd(), "src", "data", "recipes.json");
const LEGACY_CUSTOM_FILE = path.join(process.cwd(), "src", "data", "custom-recipes.json");

export async function readAllRecipes(): Promise<Recipe[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error("Empty or invalid recipes.json");
  } catch (err: any) {
    // Initialize recipes.json from SEED_RECIPES + any legacy custom recipes
    const initialMap = new Map<string, Recipe>();

    // 1. Add all cleaned seed recipes
    for (const seed of SEED_RECIPES) {
      initialMap.set(seed.id, seed);
    }

    // 2. Overlay any legacy custom recipes
    try {
      const legacyData = await fs.readFile(LEGACY_CUSTOM_FILE, "utf-8");
      const legacyParsed: Recipe[] = JSON.parse(legacyData);
      if (Array.isArray(legacyParsed)) {
        for (const custom of legacyParsed) {
          if (custom && custom.id) {
            initialMap.set(custom.id, custom);
          }
        }
      }
    } catch (_) {}

    const initialRecipes = Array.from(initialMap.values());
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialRecipes, null, 2), "utf-8");
    return initialRecipes;
  }
}

export async function writeAllRecipes(recipes: Recipe[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(recipes, null, 2), "utf-8");
}

export async function GET() {
  try {
    const recipes = await readAllRecipes();
    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    console.error("Failed to get recipes:", error);
    return NextResponse.json(
      { success: false, recipes: SEED_RECIPES, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recipe: Recipe = body.recipe || body;

    if (!recipe || !recipe.id || !recipe.title) {
      return NextResponse.json(
        { success: false, error: "Μη έγκυρη συνταγή (λείπει id ή τίτλος)." },
        { status: 400 }
      );
    }

    const currentRecipes = await readAllRecipes();
    const existingIndex = currentRecipes.findIndex((r) => r.id === recipe.id);

    let updatedRecipes: Recipe[];
    if (existingIndex >= 0) {
      updatedRecipes = [...currentRecipes];
      updatedRecipes[existingIndex] = recipe;
    } else {
      updatedRecipes = [recipe, ...currentRecipes];
    }

    await writeAllRecipes(updatedRecipes);
    return NextResponse.json({ success: true, recipes: updatedRecipes });
  } catch (error) {
    console.error("Failed to save recipe:", error);
    return NextResponse.json(
      { success: false, error: "Αποτυχία αποθήκευσης συνταγής." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
    }

    const currentRecipes = await readAllRecipes();
    const filtered = currentRecipes.filter((r) => r.id !== id);

    await writeAllRecipes(filtered);
    return NextResponse.json({ success: true, recipes: filtered });
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
