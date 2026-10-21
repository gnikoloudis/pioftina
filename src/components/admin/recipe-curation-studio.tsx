"use client";

import React, { useState } from "react";
import {
  AgentParsedRecipe,
  AgentIngredientAudit,
  AgentQuantityWarning,
  IngestionMode,
} from "@/types/recipe-agent";
import { Recipe, RecipeCategory, RECIPE_CATEGORIES, Ingredient, AisleCategory, AISLE_CATEGORIES } from "@/types/meal-planner";
import { Product } from "@/lib/posokanei/types";
import {
  parseRawRecipeText,
  generateRecipeFromPrompt,
  parseIngredientLine,
} from "@/lib/agent/recipe-collector";
import { auditEntireRecipe, auditIngredient } from "@/lib/agent/quantity-auditor";
import { CurateProductModal } from "@/components/recipes/curate-product-modal";
import { AddIngredientModal, AddIngredientResult } from "@/components/admin/add-ingredient-modal";
import { SupermarketBadge } from "@/components/supermarket-badge";
import {
  Bot,
  Sparkles,
  Link as LinkIcon,
  FileText,
  Lightbulb,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Store,
  Package,
  ArrowRight,
  RotateCcw,
  Clock,
  Users,
  Check,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeCurationStudioProps {
  allRecipes: Recipe[];
  onSaveRecipe: (recipe: Recipe) => void;
  onViewRecipesTab: () => void;
  initialRecipeId?: string | null;
}

export function RecipeCurationStudio({
  allRecipes,
  onSaveRecipe,
  onViewRecipesTab,
  initialRecipeId,
}: RecipeCurationStudioProps) {
  const [ingestionMode, setIngestionMode] = useState<IngestionMode>(
    initialRecipeId ? "catalog" : "catalog"
  );
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [selectedCatalogRecipeId, setSelectedCatalogRecipeId] = useState(initialRecipeId || "");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active Draft Recipe under HITL review
  const [draftRecipe, setDraftRecipe] = useState<AgentParsedRecipe | null>(() => {
    if (initialRecipeId) {
      const found = allRecipes.find((r) => r.id === initialRecipeId);
      if (found) {
        const converted: AgentParsedRecipe = {
          id: found.id,
          title: found.title,
          titleEn: found.titleEn,
          description: found.description,
          servings: found.servings,
          prepTimeMinutes: found.prepTimeMinutes,
          cookTimeMinutes: found.cookTimeMinutes,
          imageUrl: found.imageUrl,
          category: found.category,
          instructions: found.instructions || [],
          rawIngredients: found.ingredients.map((i) => `${i.amount} ${i.unit} ${i.name}`),
          ingredients: found.ingredients.map((i) => ({
            ingredientId: i.id,
            name: i.name,
            originalRawText: `${i.amount} ${i.unit} ${i.name}`,
            amount: i.amount,
            unit: i.unit,
            category: i.category,
            posokaneiQuery: i.posokaneiQuery,
            amountPerServing: Number((i.amount / Math.max(1, found.servings)).toFixed(1)),
            warnings: [],
            matchedProduct: i.curatedProduct,
            matchConfidence: i.curatedProduct ? 95 : 65,
            isCurated: !!i.curatedProduct,
          })),
          sourceUrl: found.referenceUrl || "",
          sourceType: "catalog",
        };
        return auditEntireRecipe(converted);
      }
    }
    return null;
  });

  // Modal state for curating an ingredient product
  const [curatingIngredientIndex, setCuratingIngredientIndex] = useState<number | null>(null);

  // Modal state for adding a new ingredient
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);

  // 1. Ingest via URL
  const handleImportUrl = async () => {
    if (!urlInput.trim()) {
      setErrorMessage("Παρακαλούμε εισάγετε ένα έγκυρο URL συνταγής.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Αποτυχία εισαγωγής συνταγής.");
      }

      setDraftRecipe(data.recipe);
      setSuccessMessage("Η συνταγή ανακτήθηκε και αναλύθηκε επιτυχώς!");
    } catch (err: any) {
      setErrorMessage(err.message || "Σφάλμα κατά την ανάκτηση της συνταγής.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Ingest via Text Paste
  const handleParseText = () => {
    if (!textInput.trim()) {
      setErrorMessage("Παρακαλούμε επικολλήστε το κείμενο ή τα υλικά της συνταγής.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const parsed = parseRawRecipeText(textInput);
      const audited = auditEntireRecipe(parsed);
      setDraftRecipe(audited);
      setSuccessMessage("Το κείμενο αναλύθηκε και τα υλικά τυποποιήθηκαν!");
    } catch (e: any) {
      setErrorMessage("Σφάλμα κατά την ανάλυση του κειμένου.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Ingest via Prompt
  const handleGeneratePrompt = () => {
    if (!promptInput.trim()) {
      setErrorMessage("Παρακαλούμε εισάγετε τον τίτλο ή την περιγραφή του πιάτου.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const gen = generateRecipeFromPrompt(promptInput, draftRecipe?.servings || 4);
      const audited = auditEntireRecipe(gen);
      setDraftRecipe(audited);
      setSuccessMessage(`Η συνταγή "${gen.title}" δημιουργήθηκε και επιμελήθηκε από τον Agent!`);
    } catch (e) {
      setErrorMessage("Σφάλμα κατά τη δημιουργία της συνταγής.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Ingest from Catalog
  const handleLoadFromCatalog = (recipeId: string) => {
    setSelectedCatalogRecipeId(recipeId);
    if (!recipeId) {
      setDraftRecipe(null);
      setErrorMessage(null);
      setSuccessMessage(null);
      return;
    }
    const found = allRecipes.find((r) => r.id === recipeId);
    if (!found) {
      setDraftRecipe(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    const converted: AgentParsedRecipe = {
      id: found.id,
      title: found.title,
      titleEn: found.titleEn,
      description: found.description,
      servings: found.servings,
      prepTimeMinutes: found.prepTimeMinutes,
      cookTimeMinutes: found.cookTimeMinutes,
      imageUrl: found.imageUrl,
      category: found.category,
      instructions: found.instructions || [],
      rawIngredients: found.ingredients.map((i) => `${i.amount} ${i.unit} ${i.name}`),
      ingredients: found.ingredients.map((i) => ({
        ingredientId: i.id,
        name: i.name,
        originalRawText: `${i.amount} ${i.unit} ${i.name}`,
        amount: i.amount,
        unit: i.unit,
        category: i.category,
        posokaneiQuery: i.posokaneiQuery,
        amountPerServing: Number((i.amount / Math.max(1, found.servings)).toFixed(1)),
        warnings: [],
        matchedProduct: i.curatedProduct,
        matchConfidence: i.curatedProduct ? 95 : 65,
        isCurated: !!i.curatedProduct,
      })),
      sourceUrl: found.referenceUrl || "",
      sourceType: "catalog",
    };

    const audited = auditEntireRecipe(converted);
    setDraftRecipe(audited);
    setSuccessMessage(`Φορτώθηκε η συνταγή "${found.title}" από τον κατάλογο για επιμέλεια.`);
  };

  // Sync draftRecipe if initialRecipeId changes externally
  React.useEffect(() => {
    if (initialRecipeId) {
      handleLoadFromCatalog(initialRecipeId);
      setIngestionMode("catalog");
    } else {
      setSelectedCatalogRecipeId("");
      setDraftRecipe(null);
    }
  }, [initialRecipeId]);

  // HITL: Scale Servings proportionally
  const handleUpdateServings = (newServings: number) => {
    if (!draftRecipe || newServings < 1 || newServings > 20) return;
    const oldServings = draftRecipe.servings || 4;
    const ratio = newServings / oldServings;

    const scaledIngredients = draftRecipe.ingredients.map((ing) => {
      const newAmount = Math.round(ing.amount * ratio);
      return auditIngredient(
        {
          ...ing,
          amount: newAmount,
        },
        newServings,
        draftRecipe.category
      );
    });

    setDraftRecipe({
      ...draftRecipe,
      servings: newServings,
      ingredients: scaledIngredients,
    });
  };

  // HITL: Update specific ingredient field
  const handleUpdateIngredient = (index: number, updates: Partial<AgentIngredientAudit>) => {
    if (!draftRecipe) return;
    const updated = [...draftRecipe.ingredients];
    const current = updated[index];
    const merged = { ...current, ...updates };

    // Re-run audit for updated ingredient
    const reAudited = auditIngredient(
      merged,
      draftRecipe.servings,
      draftRecipe.category
    );

    updated[index] = reAudited;
    setDraftRecipe({ ...draftRecipe, ingredients: updated });
  };

  // HITL: Apply Agent Suggested Fix
  const handleApplyWarningFix = (index: number, warning: AgentQuantityWarning) => {
    if (!warning.suggestedAmount) return;
    handleUpdateIngredient(index, {
      amount: warning.suggestedAmount,
      unit: warning.suggestedUnit || draftRecipe!.ingredients[index].unit,
    });
  };

  // HITL: Quick +/- adjustment
  const handleQuickAdjustAmount = (index: number, delta: number) => {
    if (!draftRecipe) return;
    const current = draftRecipe.ingredients[index];
    const nextAmount = Math.max(1, Math.round(current.amount + delta));
    handleUpdateIngredient(index, { amount: nextAmount });
  };

  // HITL: Remove Ingredient
  const handleRemoveIngredient = (index: number) => {
    if (!draftRecipe) return;
    const updated = draftRecipe.ingredients.filter((_, i) => i !== index);
    setDraftRecipe({ ...draftRecipe, ingredients: updated });
  };

  // HITL: Open Add Ingredient Modal
  const handleAddIngredient = () => {
    setIsAddIngredientOpen(true);
  };

  // HITL: Complete Add Ingredient from Modal
  const handleAddIngredientComplete = (result: AddIngredientResult) => {
    if (!draftRecipe) return;

    const newId = `ing-${Date.now()}-${draftRecipe.ingredients.length}`;
    const rawText = `${result.amount} ${result.unit} ${result.name}`;

    const newAuditIng: AgentIngredientAudit = {
      ingredientId: newId,
      name: result.name,
      originalRawText: rawText,
      amount: result.amount,
      unit: result.unit,
      category: result.category,
      posokaneiQuery: result.posokaneiQuery,
      amountPerServing: Number((result.amount / Math.max(1, draftRecipe.servings)).toFixed(1)),
      warnings: [],
      matchedProduct: result.product,
      matchConfidence: result.product ? 100 : 70,
      isCurated: !!result.product,
      notes: result.notes,
    };

    const audited = auditIngredient(
      newAuditIng,
      draftRecipe.servings,
      draftRecipe.category
    );

    setDraftRecipe({
      ...draftRecipe,
      ingredients: [...draftRecipe.ingredients, audited],
    });
    setSuccessMessage(`Το υλικό «${result.name}» προστέθηκε επιτυχώς!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // HITL: Curate Product Assignment
  const handleAssignProductToIngredient = (product: Product) => {
    if (curatingIngredientIndex === null || !draftRecipe) return;
    handleUpdateIngredient(curatingIngredientIndex, {
      matchedProduct: product,
      isCurated: true,
      matchConfidence: 98,
    });
    setCuratingIngredientIndex(null);
  };

  // HITL: Publish to Catalog
  const handlePublishRecipe = () => {
    if (!draftRecipe || !draftRecipe.title.trim() || draftRecipe.ingredients.length === 0) {
      setErrorMessage("Παρακαλούμε βεβαιωθείτε ότι η συνταγή έχει τίτλο και τουλάχιστον ένα υλικό.");
      return;
    }

    const recipeId =
      draftRecipe.id || `custom-${draftRecipe.title.toLowerCase().replace(/[^a-z0-9α-ω]/gi, "-")}-${Date.now().toString().slice(-4)}`;

    const canonicalRecipe: Recipe = {
      id: recipeId,
      title: draftRecipe.title.trim(),
      titleEn: draftRecipe.titleEn,
      description: draftRecipe.description.trim(),
      servings: draftRecipe.servings,
      prepTimeMinutes: draftRecipe.prepTimeMinutes,
      cookTimeMinutes: draftRecipe.cookTimeMinutes,
      imageUrl: draftRecipe.imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: draftRecipe.category,
      isCurated: true,
      referenceUrl: draftRecipe.sourceUrl?.trim() || undefined,
      instructions: draftRecipe.instructions,
      ingredients: draftRecipe.ingredients.map((i, idx) => ({
        id: `${recipeId}-ing-${idx}`,
        name: i.name,
        amount: i.amount,
        unit: i.unit,
        category: i.category,
        posokaneiQuery: i.posokaneiQuery,
        curatedProductId: i.matchedProduct?.id,
        curatedProduct: i.matchedProduct,
        isCurated: !!i.matchedProduct,
      })),
    };

    onSaveRecipe(canonicalRecipe);
    setSuccessMessage(`Η συνταγή "${canonicalRecipe.title}" επικυρώθηκε και δημοσιεύθηκε στον κατάλογο!`);
  };

  const totalWarnings = draftRecipe?.ingredients.reduce((acc, i) => acc + (i.warnings?.length || 0), 0) || 0;
  const curatedCount = draftRecipe?.ingredients.filter((i) => i.isCurated || i.matchedProduct).length || 0;

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-blue-500/10 via-primary/5 to-sky-500/10 border border-primary/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
              <Bot className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground font-heading">
                  Recipe Collector &amp; Curation Studio
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Sparkles className="size-3" /> Human In The Loop
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Συλλέξτε συνταγές από το διαδίκτυο, κείμενο ή AI prompt, επιμεληθείτε τις ποσότητες και συνδέστε τα κατάλληλα προϊόντα supermarket.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onViewRecipesTab}
            className="text-xs gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="size-3.5" />
            Προβολή Καταλόγου
          </Button>
        </div>

        {/* Source Ingestion Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setIngestionMode("prompt")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              ingestionMode === "prompt"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <Lightbulb className="size-3.5" />
            <span>AI Recipe Assistant</span>
          </button>

          <button
            onClick={() => setIngestionMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              ingestionMode === "text"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Επικόλληση Κειμένου</span>
          </button>

          <button
            onClick={() => setIngestionMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              ingestionMode === "url"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <LinkIcon className="size-3.5" />
            <span>Web URL Import</span>
          </button>

          <button
            onClick={() => setIngestionMode("catalog")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              ingestionMode === "catalog"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <BookOpen className="size-3.5" />
            <span>Από Κατάλογο</span>
          </button>
        </div>

        {/* Source Input Panes */}
        <div>
          {ingestionMode === "prompt" && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="π.χ. Μοσχαράκι Στιφάδο, Σπανακόπιτα, Φασολάδα παραδοσιακή..."
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  onClick={handleGeneratePrompt}
                  disabled={isLoading}
                  className="gap-1.5 shrink-0"
                >
                  <Sparkles className="size-3.5" />
                  Δημιουργία &amp; Audit
                </Button>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground">
                <span>Δοκιμάστε:</span>
                {["Σπανακόπιτα Χωριάτικη", "Μοσχαράκι Στιφάδο", "Παραδοσιακή Φασολάδα", "Αφράτα Μπιφτέκια"].map(
                  (chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setPromptInput(chip);
                        const gen = generateRecipeFromPrompt(chip, draftRecipe?.servings || 4);
                        setDraftRecipe(auditEntireRecipe(gen));
                      }}
                      className="px-2 py-0.5 rounded-lg bg-card hover:bg-muted border border-border/80 text-foreground transition-colors"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {ingestionMode === "text" && (
            <div className="space-y-2">
              <textarea
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Επικολλήστε τη συνταγή εδώ, π.χ.:\n\nΣπανακόπιτα\nΓια 6 άτομα\nΥλικά:\n1 κιλό σπανάκι\n400 γρ. φέτα\n1/2 φλιτζάνι ελαιόλαδο\n3 αυγά`}
                className="w-full p-3 text-xs font-mono rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleParseText}
                  disabled={isLoading || !textInput.trim()}
                  size="sm"
                  className="gap-1.5"
                >
                  <Bot className="size-3.5" />
                  Ανάλυση Υλικών &amp; Έλεγχος
                </Button>
              </div>
            </div>
          )}

          {ingestionMode === "url" && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/recipies/traditional-moussaka"
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  onClick={handleImportUrl}
                  disabled={isLoading || !urlInput.trim()}
                  className="gap-1.5 shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                  {isLoading ? "Ανάκτηση..." : "Ανάκτηση & Audit"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Υποστηρίζει οποιαδήποτε ελληνική ή διεθνή ιστοσελίδα συνταγών με Schema.org JSON-LD.
              </p>
            </div>
          )}

          {ingestionMode === "catalog" && (
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <select
                value={selectedCatalogRecipeId}
                onChange={(e) => handleLoadFromCatalog(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">-- Επιλέξτε συνταγή από τον κατάλογο --</option>
                {allRecipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.servings} μερίδες - {r.ingredients.length} υλικά)
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Επιλέξτε μια συνταγή για έλεγχο και διόρθωση αναλογιών ή προϊόντων.
              </p>
            </div>
          )}
        </div>

        {/* Feedback banners */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {ingestionMode === "url" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIngestionMode("text");
                  setErrorMessage(null);
                }}
                className="text-[11px] h-7 px-2.5 bg-card/60 hover:bg-card border-destructive/30 text-destructive hover:text-foreground shrink-0"
              >
                <FileText className="size-3 mr-1" />
                Μετάβαση σε Επικόλληση Κειμένου
              </Button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Human in the Loop Workspace */}
      {draftRecipe && (
        <div className="space-y-6">
          {/* Recipe Metadata Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Στοιχεία &amp; Μερίδες Συνταγής
                </h2>
              </div>

              {/* Status Pill & Clear Action */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setDraftRecipe(null);
                    setSelectedCatalogRecipeId("");
                    setPromptInput("");
                    setUrlInput("");
                    setTextInput("");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Καθαρισμός τρέχουσας συνταγής και επιστροφή στην επιλογή"
                >
                  <X className="size-3.5" />
                  Καθαρισμός
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  {curatedCount}/{draftRecipe.ingredients.length} Επιλεγμένα Προϊόντα
                </span>
                {totalWarnings > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    {totalWarnings} Παρατηρήσεις Ποσοτήτων
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Τίτλος Συνταγής
                </label>
                <input
                  type="text"
                  value={draftRecipe.title}
                  onChange={(e) => setDraftRecipe({ ...draftRecipe, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Κατηγορία
                </label>
                <select
                  value={draftRecipe.category}
                  onChange={(e) =>
                    setDraftRecipe({
                      ...draftRecipe,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {RECIPE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference / Source Link */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="size-3.5 text-primary" />
                  Σύνδεσμος Αναφοράς / Πηγή Συνταγής (URL)
                </label>
                {draftRecipe.sourceUrl && draftRecipe.sourceUrl.startsWith("http") && (
                  <a
                    href={draftRecipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="size-3" />
                    Άνοιγμα συνδέσμου
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type="url"
                  value={draftRecipe.sourceUrl || ""}
                  onChange={(e) =>
                    setDraftRecipe({ ...draftRecipe, sourceUrl: e.target.value })
                  }
                  placeholder="π.χ. https://akispetretzikis.com/recipe/2572/spanakopita-me-feta"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <LinkIcon className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Προαιρετικός σύνδεσμος προς την αρχική πηγή, άρθρο ή βίντεο της συνταγής (εμφανίζεται στους χρήστες ως &quot;Πηγή Συνταγής&quot;).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Servings Tuner with instant dynamic scaling */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="size-3.5 text-primary" />
                    Μερίδες:
                  </div>
                  <div className="text-xs text-muted-foreground/70 text-[10px]">
                    (Αυτόματη κλιμάκωση υλικών)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateServings(draftRecipe.servings - 1)}
                    disabled={draftRecipe.servings <= 1}
                    className="size-7 rounded-lg bg-background border border-border font-bold hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-5 text-center">
                    {draftRecipe.servings}
                  </span>
                  <button
                    onClick={() => handleUpdateServings(draftRecipe.servings + 1)}
                    disabled={draftRecipe.servings >= 20}
                    className="size-7 rounded-lg bg-background border border-border font-bold hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Prep Time */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3.5 text-primary" />
                  Προετοιμασία:
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={draftRecipe.prepTimeMinutes}
                    onChange={(e) =>
                      setDraftRecipe({
                        ...draftRecipe,
                        prepTimeMinutes: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-14 px-2 py-1 text-xs text-center font-bold rounded-lg border border-border bg-background"
                  />
                  <span className="text-xs text-muted-foreground">λεπτά</span>
                </div>
              </div>

              {/* Cook Time */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3.5 text-primary" />
                  Μαγείρεμα:
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={draftRecipe.cookTimeMinutes}
                    onChange={(e) =>
                      setDraftRecipe({
                        ...draftRecipe,
                        cookTimeMinutes: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-14 px-2 py-1 text-xs text-center font-bold rounded-lg border border-border bg-background"
                  />
                  <span className="text-xs text-muted-foreground">λεπτά</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient Audit & Correction Workspace */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Υλικά, Ποσότητες &amp; Curation Προϊόντων
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({draftRecipe.ingredients.length} υλικά)
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                id="btn-add-ingredient"
                onClick={handleAddIngredient}
                className="gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                Προσθήκη Υλικού
              </Button>
            </div>

            {/* Ingredients List Cards */}
            <div className="space-y-3">
              {draftRecipe.ingredients.map((ing, index) => {
                const aisle = AISLE_CATEGORIES[ing.category];
                const hasWarnings = ing.warnings && ing.warnings.length > 0;
                const prod = ing.matchedProduct;

                return (
                  <div
                    key={ing.ingredientId || index}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      hasWarnings
                        ? "bg-amber-500/5 border-amber-500/30"
                        : "bg-card border-border hover:border-border/80"
                    }`}
                  >
                    {/* Top Row: Name, Category & Delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-base">{aisle?.icon || "🛒"}</span>
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) =>
                            handleUpdateIngredient(index, { name: e.target.value })
                          }
                          className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.5 w-full sm:w-auto flex-1"
                        />
                        <span className="text-[11px] text-muted-foreground">
                          ({ing.amountPerServing} {ing.unit} / μερίδα)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={ing.category}
                          onChange={(e) =>
                            handleUpdateIngredient(index, {
                              category: e.target.value as AisleCategory,
                            })
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-border bg-background"
                        >
                          <option value="produce">Μαναβική</option>
                          <option value="dairy">Γαλακτοκομικά</option>
                          <option value="meat">Κρεοπωλείο</option>
                          <option value="pantry">Παντοπωλείο</option>
                          <option value="bakery">Αρτοποιείο</option>
                        </select>

                        <button
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Διαγραφή υλικού"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Quantity Tuning & Search Query */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1 border-t border-border/40">
                      {/* Quantity & Unit Controls */}
                      <div className="sm:col-span-6 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                          Ποσότητα:
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuickAdjustAmount(
                                index,
                                ing.unit === "g" ? -50 : -1
                              )
                            }
                            className="size-7 rounded-lg bg-muted border border-border text-xs font-bold hover:bg-muted/80 flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={ing.amount}
                            onChange={(e) =>
                              handleUpdateIngredient(index, {
                                amount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-border bg-background"
                          />
                          <button
                            onClick={() =>
                              handleQuickAdjustAmount(
                                index,
                                ing.unit === "g" ? 50 : 1
                              )
                            }
                            className="size-7 rounded-lg bg-muted border border-border text-xs font-bold hover:bg-muted/80 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        <select
                          value={ing.unit}
                          onChange={(e) =>
                            handleUpdateIngredient(index, {
                              unit: e.target.value as any,
                            })
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-border bg-background font-medium"
                        >
                          <option value="g">g (γραμμάρια)</option>
                          <option value="kg">kg (κιλά)</option>
                          <option value="ml">ml (χιλιοστόλιτρα)</option>
                          <option value="L">L (λίτρα)</option>
                          <option value="τεμ">τεμ (τεμάχια)</option>
                        </select>
                      </div>

                      {/* Posokanei Query Field */}
                      <div className="sm:col-span-6 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                          Αναζήτηση:
                        </span>
                        <input
                          type="text"
                          value={ing.posokaneiQuery}
                          onChange={(e) =>
                            handleUpdateIngredient(index, {
                              posokaneiQuery: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-border bg-background"
                          placeholder="π.χ. φέτα, λάδι, κιμάς..."
                        />
                      </div>
                    </div>

                    {/* Agent Audit Warnings with 1-click Fix */}
                    {hasWarnings && (
                      <div className="space-y-1.5 pt-1">
                        {ing.warnings.map((w) => (
                          <div
                            key={w.id}
                            className={`p-2.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              w.severity === "error"
                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                : "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {w.severity === "error" ? (
                                <AlertTriangle className="size-4 shrink-0" />
                              ) : (
                                <Info className="size-4 shrink-0" />
                              )}
                              <span>{w.message}</span>
                            </div>

                            {w.suggestedAmount && (
                              <button
                                onClick={() => handleApplyWarningFix(index, w)}
                                className="px-2.5 py-1 rounded-lg bg-background border border-border font-bold text-[11px] hover:bg-muted transition-colors shrink-0 flex items-center gap-1"
                              >
                                <Sparkles className="size-3 text-primary" />
                                Εφαρμογή ({w.suggestedAmount}
                                {w.suggestedUnit || ing.unit})
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mapped Supermarket Product Card & Curation Switcher */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                          {prod?.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="size-full object-contain p-0.5"
                            />
                          ) : (
                            <Package className="size-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {prod ? prod.name : `Αυτόματη αναζήτηση για "${ing.posokaneiQuery}"`}
                            </p>
                            {ing.isCurated ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                                <Check className="size-2.5" /> Curated
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                {ing.matchConfidence}% Πρόταση
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                            {prod?.brand && <span>{prod.brand}</span>}
                            {prod && <span>&bull;</span>}
                            <span>{prod ? `${prod.unit_quantity} ${prod.unit}` : ing.category}</span>
                            {prod?.price_stats?.min_price && (
                              <>
                                <span>&bull;</span>
                                <span className="font-medium text-foreground">
                                  από €{prod.price_stats.min_price.toFixed(2)}
                                </span>
                              </>
                            )}

                            {prod?.retailers && (
                              <div className="flex items-center gap-1 ml-1">
                                {prod.retailers.slice(0, 3).map((r) => (
                                  <SupermarketBadge key={r} retailerId={r} size="sm" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCuratingIngredientIndex(index)}
                        className="text-xs gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Store className="size-3.5 text-primary" />
                        Αλλαγή Προϊόντος
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Publishing Bar */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-foreground">
                  Ολοκλήρωση Επιμέλειας Συνταγής
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ελέγξτε ότι τα υλικά και οι ποσότητες είναι σωστές. Η συνταγή θα είναι άμεσα διαθέσιμη στο εβδομαδιαίο πλάνο και στις λίστες αγορών!
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={handlePublishRecipe}
                  size="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-6 shadow-md shadow-primary/20"
                >
                  <CheckCircle2 className="size-4" />
                  Επικύρωση &amp; Δημοσίευση Συνταγής
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no recipe is selected */}
      {!draftRecipe && (
        <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-xs text-center space-y-6">
          <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
            <Bot className="size-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-foreground font-heading">
              Καμία Συνταγή σε Επιμέλεια
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Τα υλικά και οι αντιστοιχίσεις προϊόντων supermarket θα εμφανιστούν μόλις επιλέξετε μια συνταγή από τον κατάλογο ή εισάγετε μια νέα μέσω AI, URL ή κειμένου.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-left">
            <button
              type="button"
              onClick={() => setIngestionMode("catalog")}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                ingestionMode === "catalog"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <BookOpen className="size-4 text-primary" />
                <span>Από Κατάλογο</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Επιλέξτε μια υπάρχουσα συνταγή για έλεγχο και αντιστοίχιση υλικών.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIngestionMode("prompt")}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                ingestionMode === "prompt"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <Sparkles className="size-4 text-primary" />
                <span>AI Recipe Assistant</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Πληκτρολογήστε ένα πιάτο και δημιουργήστε συνταγή αυτόματα.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIngestionMode("text")}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                ingestionMode === "text"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <FileText className="size-4 text-primary" />
                <span>Επικόλληση Κειμένου</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Αντιγράψτε κείμενο συνταγής από βιβλία ή ιστοσελίδες.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIngestionMode("url")}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                ingestionMode === "url"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <LinkIcon className="size-4 text-primary" />
                <span>Web URL Import</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Άμεση ανάκτηση από ιστοσελίδες συνταγών (π.χ. Άκης, Αργυρώ).
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Modal for curating an ingredient product */}
      {curatingIngredientIndex !== null && draftRecipe && (
        <CurateProductModal
          isOpen={true}
          onClose={() => setCuratingIngredientIndex(null)}
          ingredient={{
            id: draftRecipe.ingredients[curatingIngredientIndex].ingredientId,
            name: draftRecipe.ingredients[curatingIngredientIndex].name,
            amount: draftRecipe.ingredients[curatingIngredientIndex].amount,
            unit: draftRecipe.ingredients[curatingIngredientIndex].unit,
            category: draftRecipe.ingredients[curatingIngredientIndex].category,
            posokaneiQuery: draftRecipe.ingredients[curatingIngredientIndex].posokaneiQuery,
            curatedProduct: draftRecipe.ingredients[curatingIngredientIndex].matchedProduct,
            isCurated: draftRecipe.ingredients[curatingIngredientIndex].isCurated,
          }}
          recipeTitle={draftRecipe.title}
          onAssignProduct={handleAssignProductToIngredient}
        />
      )}

      {/* Modal for adding a new ingredient */}
      {isAddIngredientOpen && draftRecipe && (
        <AddIngredientModal
          isOpen={isAddIngredientOpen}
          onClose={() => setIsAddIngredientOpen(false)}
          recipeTitle={draftRecipe.title}
          onAddIngredient={handleAddIngredientComplete}
        />
      )}
    </div>
  );
}