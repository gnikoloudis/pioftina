import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Recipe } from "@/types/meal-planner";
import { SEED_RECIPES } from "@/lib/recipes/seed-recipes";
import { verifyAdminRequest } from "@/lib/security/admin-auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";

const DATA_FILE = path.join(process.cwd(), "src", "data", "recipes.json");
const LEGACY_CUSTOM_FILE = path.join(process.cwd(), "src", "data", "custom-recipes.json");

export async function readAllRecipes(): Promise<Recipe[]> {
  const map = new Map<string, Recipe>();

  // 1. Always load all 80 curated SEED_RECIPES
  for (const seed of SEED_RECIPES) {
    map.set(seed.id, seed);
  }

  // 2. Overlay existing stored recipes (custom recipes or user modifications)
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed: Recipe[] = JSON.parse(data);
    if (Array.isArray(parsed)) {
      for (const r of parsed) {
        if (r && r.id) {
          if (r.id.startsWith("custom-")) {
            map.set(r.id, r);
          }
        }
      }
    }
  } catch (_) {}

  // 3. Overlay any legacy custom recipes if present
  try {
    const legacyData = await fs.readFile(LEGACY_CUSTOM_FILE, "utf-8");
    const legacyParsed: Recipe[] = JSON.parse(legacyData);
    if (Array.isArray(legacyParsed)) {
      for (const custom of legacyParsed) {
        if (custom && custom.id) {
          map.set(custom.id, custom);
        }
      }
    }
  } catch (_) {}

  const merged = Array.from(map.values());
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (_) {}

  return merged;
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
    // 1. Admin authorization check
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Απαιτούνται δικαιώματα διαχειριστή για τροποποίηση του καταλόγου συνταγών." },
        { status: 401 }
      );
    }

    // 2. Rate limit on writes (max 20 req/min, 1s cooldown)
    const rateCheck = checkRateLimit(req, {
      limit: 20,
      windowMs: 60 * 1000,
      cooldownMs: 1000,
      prefix: "recipes_write",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

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
    // 1. Admin authorization check
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Απαιτούνται δικαιώματα διαχειριστή για διαγραφή συνταγών." },
        { status: 401 }
      );
    }

    // 2. Rate limit on deletes
    const rateCheck = checkRateLimit(req, {
      limit: 20,
      windowMs: 60 * 1000,
      cooldownMs: 1000,
      prefix: "recipes_delete",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

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

