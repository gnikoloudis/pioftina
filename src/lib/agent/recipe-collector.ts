import {
  AgentParsedRecipe,
  AgentIngredientAudit,
  AgentQuantityWarning,
} from "@/types/recipe-agent";
import { AisleCategory } from "@/types/meal-planner";
import { getCuratedDefaultProduct } from "@/lib/recipes/curated-products";

/**
 * Normalizes Greek fractions and numbers in text
 */
function parseFraction(raw: string): number | null {
  const trimmed = raw.trim();
  // Vulgar fractions
  if (trimmed === "½") return 0.5;
  if (trimmed === "¼") return 0.25;
  if (trimmed === "¾") return 0.75;
  if (trimmed === "⅓") return 0.33;
  if (trimmed === "⅔") return 0.67;

  // Standard fraction 1/2, 3/4
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }

  // Combined mixed fraction "1 1/2" or "1,5" or "1.5"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const frac = parseFraction(mixedMatch[2]);
    if (!isNaN(whole) && frac !== null) return whole + frac;
  }

  const cleanNum = trimmed.replace(",", ".");
  const num = parseFloat(cleanNum);
  return isNaN(num) ? null : num;
}

/**
 * Detects category from ingredient keywords
 */
export function detectCategory(name: string): AisleCategory {
  const n = name.toLowerCase();

  // Dairy
  if (
    n.includes("φέτα") ||
    n.includes("τυρ") ||
    n.includes("γάλα") ||
    n.includes("γιαούρτ") ||
    n.includes("γραβιέρ") ||
    n.includes("κεφαλοτύρ") ||
    n.includes("ανθότυρ") ||
    n.includes("μυζήθρ") ||
    n.includes("βούτυρ") ||
    n.includes("κρέμα γάλακτος") ||
    n.includes("κασέρι") ||
    n.includes("μοτσαρέλ")
  ) {
    return "dairy";
  }

  // Meat / Poultry / Fish
  if (
    n.includes("κιμά") ||
    n.includes("κοτόπουλ") ||
    n.includes("μοσχάρ") ||
    n.includes("χοιριν") ||
    n.includes("αρν") ||
    n.includes("ψάρ") ||
    n.includes("σολομ") ||
    n.includes("τον") ||
    n.includes("μπιφτέκ") ||
    n.includes("γαλοπούλ") ||
    n.includes("λουκάνικ") ||
    n.includes("μπέικον") ||
    n.includes("καλαμάρ") ||
    n.includes("γαρίδ") ||
    n.includes("χταπόδ")
  ) {
    return "meat";
  }

  // Bakery
  if (
    n.includes("ψωμί") ||
    n.includes("φύλλο") ||
    n.includes("πίτα") ||
    n.includes("φρυγανι") ||
    n.includes("παξιμάδ") ||
    n.includes("τοστ") ||
    n.includes("κρουασάν")
  ) {
    return "bakery";
  }

  // Produce
  if (
    n.includes("ντομάτ") ||
    n.includes("τομάτ") ||
    n.includes("κρεμμύδ") ||
    n.includes("πατάτ") ||
    n.includes("σπανάκ") ||
    n.includes("λεμόν") ||
    n.includes("σκόρδ") ||
    n.includes("μελιτζάν") ||
    n.includes("κολοκυθ") ||
    n.includes("πιπερι") ||
    n.includes("καρότ") ||
    n.includes("μαϊνταν") ||
    n.includes("άνηθ") ||
    n.includes("σέλινο") ||
    n.includes("φασολάκι") ||
    n.includes("αγγούρ") ||
    n.includes("μαρούλ") ||
    n.includes("μπρόκολ") ||
    n.includes("κουνουπίδ") ||
    n.includes("μανιτάρ") ||
    n.includes("δυόσμ")
  ) {
    return "produce";
  }

  // Default to pantry (staples, oils, grains, spices)
  return "pantry";
}

/**
 * Extracts a clean search query for posokanei.gov.gr from an ingredient description
 */
export function extractPosokaneiQuery(name: string): string {
  let q = name.toLowerCase();

  // Strip adjectives, culinary details and marketing buzzwords
  const stopWords = [
    "φρέσκο", "φρέσκα", "φρέσκια", "ξερό", "ξερά", "ψιλοκομμένο", "ψιλοκομμένα",
    "τριμμένο", "τριμμένη", "τριμμένος", "κομμένο", "κομμένα", "καθαρισμένο",
    "καθαρισμένα", "ώριμες", "ώριμα", "ελληνικό", "ελληνικά", "ελληνική",
    "έξτρα", "εξαιρετικό", "παρθένο", "χωρίς κουκούτσι", "σε κύβους", "σε φέτες",
    "πλυμένο", "στεγνό", "χλιαρό", "ζεστό", "κρύο",
    // Marketing buzzwords not tracked in government price observatories
    "high protein", "protein", "πρωτεΐνη", "πρωτεινη", "zero", "bio", "βιολογικό",
    "βιολογικά", "light", "χωρίς γλουτένη", "extra", "deluxe", "premium", "ολικής"
  ];

  for (const sw of stopWords) {
    q = q.replace(new RegExp(`\\b${sw}\\b`, "gi"), "");
  }

  q = q.replace(/[(),;.]/g, " ").replace(/\s+/g, " ").trim();

  // Map to common canonical terms
  if (q.includes("ελαιόλαδ") || q === "λάδι") return "ελαιόλαδο";
  if (q.includes("φέτα")) return "φέτα";
  if (q.includes("σπανάκ")) return "σπανάκι";
  if (q.includes("λεμόν")) return "λεμόνια";
  if (q.includes("πατάτ")) return "πατάτες";
  if (q.includes("κιμά") && q.includes("μοσχαρ")) return "κιμάς μοσχαρίσιος";
  if (q.includes("κιμά")) return "κιμάς μοσχαρίσιος";
  if (q.includes("μοσχάρ")) return "μοσχάρι";
  if (q.includes("κοτόπουλ")) return "κοτόπουλο μπούτια";
  if (q.includes("ντομάτ") || q.includes("τομάτ")) {
    if (q.includes("πελτέ") || q.includes("τριμμέν") || q.includes("passata")) return "τομάτα τριμμένη";
    return "ντομάτες";
  }
  if (q.includes("κρεμμύδ") || q.includes("κρεμμυδ")) return "κρεμμύδια";
  if (q.includes("σκόρδ")) return "σκόρδο";
  if (q.includes("κρασί") || q.includes("κρασι")) return "κόκκινο κρασί";
  if (q.includes("αραβικ") && q.includes("πιτ")) return "αραβικές πίτες";
  if (q.includes("αραβικ")) return "αραβικές πίτες";
  if (q.includes("πίτα για σουβλάκι") || q.includes("πίτες για σουβλάκι")) return "πίτες για σουβλάκι";
  if (q.includes("τορτίγι") || q.includes("τορτιγι")) return "τορτίγιες";
  if (q.includes("ψωμί του τοστ") || q === "τοστ") return "ψωμί του τοστ";
  if (q.includes("ρύζι")) return "ρύζι καρολίνα";
  if (q.includes("μακαρόν") || q.includes("σπαγγέτ")) return "σπαγγέτι no 6";
  if (q.includes("φασολάκ")) return "φασολάκια";
  if (q.includes("γάλα")) return "γάλα πλήρες";
  if (q.includes("γραβιέρ")) return "γραβιέρα";
  if (q.includes("μυζήθρ") || q.includes("κεφαλοτύρ")) return "μυζήθρα τριμμένη";
  if (q.includes("μουστάρδ")) return "μουστάρδα";
  if (q.includes("φακ")) return "φακές";

  return q || name;
}

/**
 * Parses a single raw ingredient text line into structured metric data
 */
export function parseIngredientLine(
  rawLine: string,
  index: number,
  servings = 4
): AgentIngredientAudit {
  const line = rawLine.trim();
  const id = `ing-auto-${Date.now()}-${index}`;

  let amount = 1;
  let unit: "g" | "kg" | "ml" | "l" | "L" | "τεμ" = "τεμ";
  let ingredientName = line;
  const warnings: AgentQuantityWarning[] = [];

  // 1. Look for patterns like "500 γρ. κιμάς" or "1 κιλό πατάτες" or "1/2 φλιτζάνι λάδι"
  const regexUnit =
    /^([\d\.,\/\u00BD\u00BC\u00BE\u2153\u2154]+(?:\s+\d+\/\d+)?)\s*(κιλά|κιλό|kg|kgr|γρ\.|γραμμάρια|γραμμ\.|γρ|g|ml|χιλιοστόλιτρα|λίτρα|λίτρο|lt|l|L|κ\.σ\.|κ\. σ\.|κ\.σ|κουταλιές σούπας|κουταλιά σούπας|κ\.γ\.|κ\. γ\.|κ\.γ|κουταλάκι γλυκού|κουταλάκια γλυκού|φλιτζάνι|φλιτζάνια|κούπα|κούπες|ποτήρι|ποτήρια|πρέζα|πρέζες|τεμ\.|τεμάχια|τεμάχιο|τεμ|pcs|σκελίδες|σκελίδα|ματσάκι|ματσάκια|πακέτο|πακέτα)?\s*(.*)$/i;

  const match = line.match(regexUnit);

  if (match) {
    const rawAmountStr = match[1]?.trim() || "";
    const rawUnitStr = match[2]?.toLowerCase()?.trim() || "";
    const restName = match[3]?.trim() || "";

    const parsedNum = parseFraction(rawAmountStr);
    if (parsedNum !== null && parsedNum > 0) {
      amount = parsedNum;
      ingredientName = restName || line;

      // Unit normalization
      if (rawUnitStr.match(/^(κιλό|κιλά|kg|kgr)$/)) {
        amount = Math.round(amount * 1000);
        unit = "g";
      } else if (rawUnitStr.match(/^(γρ\.|γραμμάρια|γραμμ\.|γρ|g)$/)) {
        unit = "g";
      } else if (rawUnitStr.match(/^(ml|χιλιοστόλιτρα)$/)) {
        unit = "ml";
      } else if (rawUnitStr.match(/^(λίτρο|λίτρα|lt|l|L)$/)) {
        amount = Math.round(amount * 1000);
        unit = "ml";
      } else if (rawUnitStr.match(/^(κ\.σ\.|κ\. σ\.|κ\.σ|κουταλιές σούπας|κουταλιά σούπας)$/)) {
        const isLiquid = detectCategory(ingredientName) === "pantry" && ingredientName.toLowerCase().includes("λάδι");
        amount = Math.round(amount * 15);
        unit = isLiquid ? "ml" : "g";
        warnings.push({
          id: `warn-unit-tbs-${index}`,
          type: "unit_unusual",
          severity: "info",
          message: `Η κουταλιά σούπας (κ.σ.) μετατράπηκε αυτόματα σε ${amount}${unit}`,
        });
      } else if (rawUnitStr.match(/^(κ\.γ\.|κ\. γ\.|κ\.γ|κουταλάκι γλυκού|κουταλάκια γλυκού)$/)) {
        amount = Math.round(amount * 5);
        unit = "g";
        warnings.push({
          id: `warn-unit-tsp-${index}`,
          type: "unit_unusual",
          severity: "info",
          message: `Το κουταλάκι γλυκού (κ.γ.) μετατράπηκε αυτόματα σε ${amount}g`,
        });
      } else if (rawUnitStr.match(/^(φλιτζάνι|φλιτζάνια|κούπα|κούπες|ποτήρι|ποτήρια)$/)) {
        const nLow = ingredientName.toLowerCase();
        if (nLow.includes("λάδι") || nLow.includes("γάλα") || nLow.includes("νερό") || nLow.includes("κρασί")) {
          amount = Math.round(amount * 200);
          unit = "ml";
        } else if (nLow.includes("ρύζι")) {
          amount = Math.round(amount * 220);
          unit = "g";
        } else if (nLow.includes("αλεύρι")) {
          amount = Math.round(amount * 140);
          unit = "g";
        } else {
          amount = Math.round(amount * 200);
          unit = "g";
        }
        warnings.push({
          id: `warn-unit-cup-${index}`,
          type: "unit_unusual",
          severity: "info",
          message: `Η κούπα/φλιτζάνι τυποποιήθηκε σε ${amount}${unit}`,
        });
      } else if (rawUnitStr.match(/^(πρέζα|πρέζες)$/)) {
        amount = Math.max(2, Math.round(amount * 2));
        unit = "g";
      } else if (rawUnitStr.match(/^(σκελίδα|σκελίδες)$/)) {
        amount = Math.max(1, Math.round(amount));
        unit = "τεμ";
      } else if (rawUnitStr.match(/^(ματσάκι|ματσάκια)$/)) {
        amount = 50;
        unit = "g";
      } else if (rawUnitStr.match(/^(πακέτο|πακέτα)$/)) {
        amount = 500;
        unit = "g";
      } else {
        unit = "τεμ";
      }
    }
  } else {
    // If no leading number, check for common patterns like "Αλάτι, πιπέρι"
    ingredientName = line;
    amount = 5;
    unit = "g";
  }

  // Cleanup ingredient name - only strip bullets or numbers with punctuation (e.g. "1. ", "• ")
  ingredientName = ingredientName.replace(/^(?:[-*•]|\d+[\.\)\-–])\s*/, "").trim();
  if (!ingredientName) ingredientName = line;

  const category = detectCategory(ingredientName);
  const posokaneiQuery = extractPosokaneiQuery(ingredientName);

  // Look up default curated product if available
  const defaultProduct =
    getCuratedDefaultProduct(posokaneiQuery) ||
    getCuratedDefaultProduct(ingredientName);

  const amountPerServing = Number((amount / Math.max(1, servings)).toFixed(1));

  return {
    ingredientId: id,
    name: ingredientName,
    originalRawText: rawLine,
    amount,
    unit,
    category,
    posokaneiQuery,
    amountPerServing,
    warnings,
    matchedProduct: defaultProduct || undefined,
    matchConfidence: defaultProduct ? 95 : 60,
    isCurated: !!defaultProduct,
  };
}

/**
 * Parses full recipe raw text (e.g. pasted recipe)
 */
export function parseRawRecipeText(text: string): AgentParsedRecipe {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let title = "Νέα Συνταγή";
  let description = "";
  let servings = 4;
  let prepTimeMinutes = 15;
  let cookTimeMinutes = 30;
  let category: "traditional" | "quick" | "vegetarian" | "comfort" | "healthy" = "traditional";

  const rawIngredients: string[] = [];
  const instructions: string[] = [];

  let section: "header" | "ingredients" | "instructions" = "header";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // First non-empty header line is usually title
    if (i === 0 && !lower.includes("υλικά") && !lower.includes("μερίδες")) {
      title = line.replace(/^[#*]+/, "").trim();
      continue;
    }

    // Check for servings
    const servingsMatch = lower.match(/(?:για|μερίδες|άτομα)[:\s]*(\d+)/i);
    if (servingsMatch) {
      const s = parseInt(servingsMatch[1], 10);
      if (s > 0 && s <= 20) servings = s;
    }

    // Check for times
    const prepMatch = lower.match(/προετοιμασία[:\s]*(\d+)/i);
    if (prepMatch) prepTimeMinutes = parseInt(prepMatch[1], 10);

    const cookMatch = lower.match(/(?:ψήσιμο|μαγείρεμα|βράσιμο)[:\s]*(\d+)/i);
    if (cookMatch) cookTimeMinutes = parseInt(cookMatch[1], 10);

    // Section triggers
    if (lower.startsWith("υλικά") || lower === "υλικά:" || lower.includes("συστατικά")) {
      section = "ingredients";
      continue;
    }

    if (
      lower.startsWith("εκτέλεση") ||
      lower.startsWith("οδηγίες") ||
      lower.includes("τρόπος παρασκευής") ||
      lower.includes("βήματα")
    ) {
      section = "instructions";
      continue;
    }

    if (section === "header") {
      if (description.length < 200) {
        description += (description ? " " : "") + line;
      }
    } else if (section === "ingredients") {
      // Clean bullet points e.g. "• ", "- ", "1. ", "1) " but preserve amounts like "1000 γρ."
      const cleaned = line.replace(/^(?:[-*•]|\d+[\.\)\-–])\s*/, "").trim();
      if (cleaned.length > 1) {
        rawIngredients.push(cleaned);
      }
    } else if (section === "instructions") {
      const cleaned = line.replace(/^(?:[-*•]|\d+[\.\)\-–])\s*/, "").trim();
      if (cleaned.length > 2) {
        instructions.push(cleaned);
      }
    }
  }

  // If no explicit section headers found, treat all bullet-like lines as ingredients
  if (rawIngredients.length === 0 && lines.length > 1) {
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.match(/^[-*•]/) || l.match(/^\d+[\s\w]/)) {
        rawIngredients.push(l.replace(/^(?:[-*•]|\d+[\.\)\-–])\s*/, "").trim());
      } else if (l.length > 30) {
        instructions.push(l);
      }
    }
  }

  if (!description) {
    description = `Παραδοσιακή ελληνική συνταγή για ${title.toLowerCase()}, με ισορροπημένα υλικά για ${servings} μερίδες.`;
  }

  // Determine recipe category
  const fullText = (title + " " + rawIngredients.join(" ")).toLowerCase();
  if (fullText.includes("κοτόπουλο") || fullText.includes("μοσχάρι") || fullText.includes("κιμάς") || fullText.includes("λουκάνικ")) {
    category = "comfort";
  } else if (fullText.includes("φασολάκια") || fullText.includes("σπανάκι") || fullText.includes("γεμιστά") || fullText.includes("λαδερό")) {
    category = "vegetarian";
  } else if (cookTimeMinutes <= 25) {
    category = "quick";
  } else if (fullText.includes("σαλάτα") || fullText.includes("φακές") || fullText.includes("ψάρι")) {
    category = "healthy";
  } else {
    category = "traditional";
  }

  const ingredients = rawIngredients.map((raw, idx) =>
    parseIngredientLine(raw, idx, servings)
  );

  return {
    title,
    description,
    servings,
    prepTimeMinutes: prepTimeMinutes || 15,
    cookTimeMinutes: cookTimeMinutes || 35,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category,
    instructions: instructions.length > 0 ? instructions : [
      "Προετοιμάζουμε και πλένουμε όλα τα υλικά.",
      "Ακολουθούμε το παραδοσιακό μαγείρεμα σε μέτρια φωτιά.",
      "Σερβίρουμε ζεστό με φρέσκο ψωμί ή φέτα."
    ],
    rawIngredients,
    ingredients,
    sourceType: "text",
  };
}

/**
 * Built-in AI Prompt Generator templates for Greek culinary classics
 */
export function generateRecipeFromPrompt(
  prompt: string,
  servings = 4
): AgentParsedRecipe {
  const p = prompt.toLowerCase();

  if (p.includes("σπανακόπιτα") || p.includes("σπανακοπιτα")) {
    return parseRawRecipeText(`Σπανακόπιτα Χωριάτικη με Φέτα
Για ${servings} άτομα
Προετοιμασία: 25 λεπτά
Ψήσιμο: 50 λεπτά
Υλικά:
1000 γρ. σπανάκι φρέσκο
400 γρ. φέτα Π.Ο.Π.
1 πακέτο χωριάτικο φύλλο (500γρ)
1 ματσάκι άνηθος
4 τεμ φρέσκα κρεμμυδάκια
100 ml ελαιόλαδο
3 τεμ αυγά
1 πρέζα αλάτι & πιπέρι
Εκτέλεση:
Πλένουμε και κόβουμε το σπανάκι. Το μαραίνουμε ελαφρώς με λίγο αλάτι.
Σε μπολ ανακατεύουμε το σπανάκι, τη θρυμματισμένη φέτα, τα αυγά, τον άνηθο, τα κρεμμυδάκια και τα 2/3 του ελαιολάδου.
Στρώνουμε τα μισά φύλλα λαδώνοντάς τα, ρίχνουμε τη γέμιση και σκεπάζουμε με τα υπόλοιπα.
Χαράζουμε σε κομμάτια και ψήνουμε στους 180°C για 50 λεπτά μέχρι να ροδίσει.`);
  }

  if (p.includes("στιφάδο") || p.includes("στιφαδο")) {
    return parseRawRecipeText(`Μοσχαράκι Στιφάδο Παραδοσιακό
Για ${servings} άτομα
Προετοιμασία: 20 λεπτά
Μαγείρεμα: 75 λεπτά
Υλικά:
1000 γρ. μοσχάρι σπάλα
1000 γρ. κρεμμυδάκια για στιφάδο
100 ml ελαιόλαδο
500 γρ. ντομάτα στον τρίφτη
100 ml κόκκινο κρασί
3 σκελίδες σκόρδο
2 τεμ δάφνη & μπαχάρι
1 πρέζα αλάτι & πιπέρι
Εκτέλεση:
Σοτάρουμε το κρέας στο ελαιόλαδο μέχρι να ροδίσει καλά από όλες τις πλευρές.
Σβήνουμε με το κρασί και προσθέτουμε την ντομάτα, το σκόρδο και τα μπαχαρικά.
Σε ξεχωριστό τηγάνι ροδίζουμε τα κρεμμυδάκια και τα προσθέτουμε στην κατσαρόλα.
Σιγοβράζουμε για 1 ώρα και 15 λεπτά μέχρι να μαλακώσει το κρέας και να μελώσει η σάλτσα.`);
  }

  if (p.includes("φασολάδα") || p.includes("φασολαδα")) {
    return parseRawRecipeText(`Παραδοσιακή Ελληνική Φασολάδα
Για ${servings} άτομα
Προετοιμασία: 15 λεπτά
Μαγείρεμα: 60 λεπτά
Υλικά:
500 γρ. φασόλια μέτρια
2 τεμ καρότα σε ροδέλες
2 κλωνάρια σέλινο
1 τεμ κρεμμύδι ξερό
400 γρ. ντομάτα στον τρίφτη
120 ml ελαιόλαδο
1 πρέζα αλάτι & πάπρικα
Εκτέλεση:
Μουλιάζουμε τα φασόλια από το προηγούμενο βράδυ.
Βράζουμε τα φασόλια σε άφθονο νερό για 10 λεπτά και στραγγίζουμε.
Προσθέτουμε φρέσκο ζεστό νερό, τα καρότα, το σέλινο, το κρεμμύδι και την ντομάτα.
Σιγοβράζουμε μέχρι να μαλακώσουν και στο τέλος προσθέτουμε το ελαιόλαδο και το αλάτι για να χυλώσει.`);
  }

  if (p.includes("μπιφτέκια") || p.includes("μπιφτεκια")) {
    return parseRawRecipeText(`Αφράτα Μπιφτέκια Φούρνου με Πατάτες
Για ${servings} άτομα
Προετοιμασία: 20 λεπτά
Ψήσιμο: 45 λεπτά
Υλικά:
800 γρ. κιμάς μοσχαρίσιος
1000 γρ. πατάτες
1 τεμ κρεμμύδι τριμμένο
100 γρ. φρυγανιά τριμμένη
80 ml ελαιόλαδο
1 τεμ αυγό
1 κ.σ. ρίγανη
1 πρέζα αλάτι & πιπέρι
Εκτέλεση:
Ζυμώνουμε τον κιμά με το κρεμμύδι, τη φρυγανιά, το αυγό, τη ρίγανη, αλάτι, πιπέρι και 30ml ελαιόλαδο.
Πλάθουμε σε αφράτα μπιφτέκια.
Κόβουμε τις πατάτες κυδωνάτες, τις λαδώνουμε και τις τοποθετούμε στο ταψί μαζί με τα μπιφτέκια.
Ψήνουμε στους 200°C για 45 λεπτά μέχρι να ροδίσουν.`);
  }

  // Default fallback generator based on prompt terms
  return parseRawRecipeText(`${prompt}
Για ${servings} άτομα
Προετοιμασία: 15 λεπτά
Μαγείρεμα: 40 λεπτά
Υλικά:
600 γρ. κοτόπουλο μπούτια
800 γρ. πατάτες
2 τεμ ντομάτες
1 τεμ κρεμμύδι
80 ml ελαιόλαδο
100 γρ. φέτα Π.Ο.Π.
1 πρέζα αλάτι & ρίγανη
Εκτέλεση:
Προετοιμάζουμε τα υλικά κόβοντάς τα σε ομοιόμορφα κομμάτια.
Σοτάρουμε σε ελαιόλαδο και σιγομαγειρεύουμε μέχρι να μαλακώσουν.
Σερβίρουμε με φέτα και φρέσκο ψωμί.`);
}
