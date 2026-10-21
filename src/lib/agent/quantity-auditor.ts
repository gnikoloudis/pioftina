import {
  AgentParsedRecipe,
  AgentIngredientAudit,
  AgentQuantityWarning,
} from "@/types/recipe-agent";

/**
 * Audits a single ingredient for culinary and portion proportion sanity
 */
export function auditIngredient(
  ing: AgentIngredientAudit,
  servings = 4,
  recipeCategory = "traditional"
): AgentIngredientAudit {
  const warnings: AgentQuantityWarning[] = [...(ing.warnings || [])];
  const nameLow = ing.name.toLowerCase();
  const queryLow = ing.posokaneiQuery.toLowerCase();
  const amount = ing.amount;
  const unit = ing.unit;
  const amountPerServing = Number((amount / Math.max(1, servings)).toFixed(1));

  // 1. Olive oil & cooking fats audit
  if (queryLow.includes("ελαιόλαδο") || nameLow.includes("λάδι")) {
    if (unit === "g") {
      warnings.push({
        id: `warn-oil-unit-${ing.ingredientId}`,
        type: "unit_unusual",
        severity: "info",
        message: "Το ελαιόλαδο μετράται συνήθως σε όγκο (ml) στα ελληνικά supermarkets.",
        suggestedAmount: amount,
        suggestedUnit: "ml",
      });
    }

    if (amountPerServing > 50) {
      const suggested = Math.round(servings * 25);
      warnings.push({
        id: `warn-oil-excess-${ing.ingredientId}`,
        type: "excessive",
        severity: "warning",
        message: `⚠️ Υπερβολικό ελαιόλαδο: ${amount}${unit} για ${servings} μερίδες (${amountPerServing}ml/μερίδα). Συνιστάται: ${suggested}ml.`,
        suggestedAmount: suggested,
        suggestedUnit: "ml",
      });
    } else if (amountPerServing < 10 && recipeCategory !== "healthy") {
      const suggested = Math.round(servings * 20);
      warnings.push({
        id: `warn-oil-low-${ing.ingredientId}`,
        type: "insufficient",
        severity: "info",
        message: `Χαμηλή ποσότητα ελαιολάδου για παραδοσιακό μαγειρευτό (${amountPerServing}ml/μερίδα). Προτείνεται: ${suggested}ml.`,
        suggestedAmount: suggested,
        suggestedUnit: "ml",
      });
    }
  }

  // 2. Meat / Poultry / Fish audit
  if (ing.category === "meat" || queryLow.includes("κιμά") || queryLow.includes("κοτόπουλο") || queryLow.includes("μοσχάρ")) {
    if (unit === "ml") {
      warnings.push({
        id: `warn-meat-unit-${ing.ingredientId}`,
        type: "unit_unusual",
        severity: "error",
        message: "Το κρέας/πουλερικά πρέπει να μετρώνται σε βάρος (g ή kg).",
        suggestedAmount: amount,
        suggestedUnit: "g",
      });
    }

    if (amountPerServing > 350) {
      const suggested = Math.round(servings * 200);
      warnings.push({
        id: `warn-meat-excess-${ing.ingredientId}`,
        type: "excessive",
        severity: "warning",
        message: `⚠️ Υψηλή ποσότητα κρέατος: ${amount}g (${amountPerServing}g/μερίδα). Τυπική οικογενειακή μερίδα: ${suggested}g.`,
        suggestedAmount: suggested,
        suggestedUnit: "g",
      });
    } else if (amountPerServing < 60 && unit === "g") {
      const suggested = Math.round(servings * 150);
      warnings.push({
        id: `warn-meat-low-${ing.ingredientId}`,
        type: "insufficient",
        severity: "warning",
        message: `Πολύ χαμηλή ποσότητα κρέατος για κυρίως γεύμα (${amountPerServing}g/μερίδα). Συνιστάται: ${suggested}g.`,
        suggestedAmount: suggested,
        suggestedUnit: "g",
      });
    }
  }

  // 3. Salt and Spices sanity
  if (nameLow.includes("αλάτι") || queryLow.includes("αλάτι") || nameLow.includes("πιπέρι") || nameLow.includes("ρίγανη")) {
    if (unit === "g" && amount > 25) {
      warnings.push({
        id: `warn-salt-excess-${ing.ingredientId}`,
        type: "excessive",
        severity: "error",
        message: `⚠️ Ύποπτα μεγάλη ποσότητα αλατιού/μπαχαρικού (${amount}g). Πιθανό τυπογραφικό λάθος. Συνιστάται: 5g (1 κ.γ.).`,
        suggestedAmount: 5,
        suggestedUnit: "g",
      });
    }
  }

  // 4. Cheese / Feta audit
  if (queryLow.includes("φέτα") || nameLow.includes("φέτα")) {
    if (amountPerServing > 150 && unit === "g") {
      const suggested = Math.round(servings * 80);
      warnings.push({
        id: `warn-cheese-excess-${ing.ingredientId}`,
        type: "excessive",
        severity: "warning",
        message: `Υψηλή ποσότητα φέτας (${amountPerServing}g/μερίδα). Συνιστάται για ισορροπία: ${suggested}g.`,
        suggestedAmount: suggested,
        suggestedUnit: "g",
      });
    }
  }

  // 5. Rice / Pasta audit
  if (queryLow.includes("ρύζι") || queryLow.includes("σπαγγέτι") || nameLow.includes("μακαρόν")) {
    if (amountPerServing > 180 && unit === "g") {
      const suggested = Math.round(servings * 100);
      warnings.push({
        id: `warn-carbs-excess-${ing.ingredientId}`,
        type: "excessive",
        severity: "warning",
        message: `Υψηλή ποσότητα υδατάνθρακα (${amountPerServing}g/μερίδα άβραστο). Τυπική μερίδα: ${suggested}g.`,
        suggestedAmount: suggested,
        suggestedUnit: "g",
      });
    }
  }

  // Calculate Match Confidence Score
  let confidence = 70;
  if (ing.isCurated && ing.matchedProduct) {
    confidence = 95;
  }
  if (warnings.some((w) => w.severity === "error")) {
    confidence = Math.max(30, confidence - 40);
  } else if (warnings.some((w) => w.severity === "warning")) {
    confidence = Math.max(50, confidence - 20);
  }

  return {
    ...ing,
    amountPerServing,
    warnings,
    matchConfidence: confidence,
  };
}

/**
 * Audits an entire recipe draft across all its ingredients
 */
export function auditEntireRecipe(recipe: AgentParsedRecipe): AgentParsedRecipe {
  const auditedIngredients = recipe.ingredients.map((ing) =>
    auditIngredient(ing, recipe.servings, recipe.category)
  );

  return {
    ...recipe,
    ingredients: auditedIngredients,
  };
}
