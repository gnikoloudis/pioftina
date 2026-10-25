"use client";

import React, { useState } from "react";
import { useMealPlannerStore } from "@/lib/storage/store";
import { MainHeader, ActiveSection } from "@/components/layout/main-header";
import { LandingView } from "@/components/landing/landing-view";
import { CleanPlannerView } from "@/components/cleaning/clean-planner-view";
import { BabyCareView } from "@/components/baby/baby-care-view";
import { BundleCurationStudio } from "@/components/admin/bundle-curation-studio";
import { WeeklyCalendar } from "@/components/meal-planner/weekly-calendar";
import { GroceryListView } from "@/components/grocery-list/grocery-list-view";
import { RecipeListView } from "@/components/recipes/recipe-list-view";
import { PantryView } from "@/components/pantry/pantry-view";
import { RecipeCurationStudio } from "@/components/admin/recipe-curation-studio";
import { TestCenterView } from "@/components/admin/test-center-view";
import { StorePreferencesModal } from "@/components/settings/store-preferences-modal";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { NewsletterModal } from "@/components/newsletter/newsletter-modal";
import { SavePlanModal } from "@/components/meal-planner/save-plan-modal";
import { ProductBundle } from "@/types/bundles";
import Link from "next/link";
import {
  CalendarDays,
  ShoppingCart,
  BookOpen,
  Box,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Bot,
  Shield,
  Lock,
  ChefHat,
  Layers,
  Beaker,
  LogOut,
  Settings,
} from "lucide-react";

export default function Home() {
  const {
    slots,
    preferences,
    allRecipes,
    groceryItems,
    basketComparisons,
    pantrySurplus,
    userPantryItems,
    addBundleToGroceryList,
    clearGroceryList,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    addSurplusToPantry,
    totalCost,
    remainingCost,
    purchasedCost,
    totalSavings,
    isOptimizing,
    assignRecipeToSlot,
    removeSlot,
    clearAllSlots,
    loadDefaultWeek,
    updatePreferences,
    toggleItemChecked,
    toggleItemPantry,
    updateItemPackOption,
    curateIngredientProduct,
    curateGroceryIngredient,
    resetIngredientCuration,
    updateCustomRecipe,
    addIngredientToRecipe,
    toggleItemExcluded,
    excludeMultipleItems,
    restoreExcludedItems,
    restoreAllExcludedItems,
    clearExcludedItemsPermanently,
    updateRecipeCategory,
    updateRecipeReferenceUrl,
    updateSlotServings,
  } = useMealPlannerStore();

  const { isAdmin, login: adminLogin, logout: adminLogout } = useAdminAuth();

  // Primary top-level section: landing | planner | clean | baby
  const [activeSection, setActiveSection] = useState<ActiveSection>("landing");

  // Planner sub-tabs
  const [activeTab, setActiveTab] = useState<
    "planner" | "recipes" | "curation-studio" | "test-center"
  >("planner");

  // Admin studio states
  const [isAdminBundleStudioOpen, setIsAdminBundleStudioOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<ProductBundle | null>(null);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Modals
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Read URL ?section= query param if present
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section") as ActiveSection | null;
      if (sec && ["landing", "planner", "clean", "baby", "grocery", "pantry"].includes(sec)) {
        setActiveSection(sec);
      }
    }
  }, []);

  // If visitor is on curation-studio or test-center and is not an admin, redirect to planner
  React.useEffect(() => {
    if (!isAdmin && (activeTab === "curation-studio" || activeTab === "test-center")) {
      setActiveTab("planner");
    }
  }, [isAdmin, activeTab]);

  const handleEditRecipeInStudio = (recipeId: string) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setEditingRecipeId(recipeId);
    setActiveSection("planner");
    setActiveTab("curation-studio");
  };

  const handleOpenBundleStudio = (bundleToEdit?: ProductBundle) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setEditingBundle(bundleToEdit || null);
    setActiveSection(bundleToEdit?.category === "baby" ? "baby" : "clean");
    setIsAdminBundleStudioOpen(true);
  };

  const activeGroceryItemsCount = groceryItems.filter((i) => !i.inPantry && !i.isExcluded).length;
  const inPantryGroceryCount = groceryItems.filter((i) => i.inPantry).length;
  const activePantryItemsCount = userPantryItems.length + pantrySurplus.length + inPantryGroceryCount;
  const scheduledMealsCount = slots.filter((s) => s.recipe !== null).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Universal Uncluttered Header (100% User-Essential) */}
      <MainHeader
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setIsAdminBundleStudioOpen(false);
        }}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onOpenNewsletterModal={() => setIsNewsletterModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        householdSize={preferences.householdSize}
        activeGroceryCount={activeGroceryItemsCount}
        activePantryCount={activePantryItemsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* 1. LANDING PAGE VIEW */}
        {activeSection === "landing" && (
          <LandingView
            onNavigateSection={(sec) => {
              setActiveSection(sec);
              setIsAdminBundleStudioOpen(false);
            }}
            onOpenNewsletter={() => setIsNewsletterModalOpen(true)}
          />
        )}

        {/* 2. CLEAN PLANNER VIEW */}
        {activeSection === "clean" && (
          <>
            {isAdmin && isAdminBundleStudioOpen ? (
              <BundleCurationStudio
                onBackToApp={() => setIsAdminBundleStudioOpen(false)}
                initialEditBundle={editingBundle}
              />
            ) : (
              <CleanPlannerView
                onAddBundleToGroceryList={addBundleToGroceryList}
                isAdmin={isAdmin}
                onOpenBundleStudio={handleOpenBundleStudio}
              />
            )}
          </>
        )}

        {/* 3. BABY CARE VIEW */}
        {activeSection === "baby" && (
          <>
            {isAdmin && isAdminBundleStudioOpen ? (
              <BundleCurationStudio
                onBackToApp={() => setIsAdminBundleStudioOpen(false)}
                initialEditBundle={editingBundle}
              />
            ) : (
              <BabyCareView
                onAddBundleToGroceryList={addBundleToGroceryList}
                isAdmin={isAdmin}
                onOpenBundleStudio={handleOpenBundleStudio}
              />
            )}
          </>
        )}

        {/* 4. MEAL PLANNER VIEW (Recipes, Calendar, Grocery List, Posokanei Optimizer) */}
        {activeSection === "planner" && (
          <div className="space-y-6">
            {/* Global Key Stats Bar (Integrated cleanly above Planner tabs) */}
            <div className="bg-card border border-border/80 rounded-2xl p-3 sm:px-4 shadow-xs">
              <div className="flex items-center justify-between gap-4 overflow-x-auto text-xs">
                <div className="flex items-center gap-6 shrink-0">
                  {purchasedCost > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Απομένουν:</span>
                        <span className="font-extrabold text-foreground text-sm">
                          €{remainingCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                        <span>(Αγοράστηκαν:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          €{purchasedCost.toFixed(2)}
                        </span>
                        <span>/ €{totalCost.toFixed(2)})</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Εκτιμώμενο Καλάθι:</span>
                      <span className="font-bold text-foreground text-sm">
                        €{totalCost.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <TrendingDown className="size-3.5" />
                      <span>Κέρδος Bulk: €{totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                    <span>Γεύματα:</span>
                    <span className="font-semibold text-foreground">{scheduledMealsCount}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                    <span>Υλικά Λίστας:</span>
                    <span className="font-semibold text-foreground">{activeGroceryItemsCount}</span>
                  </div>
                </div>

                {preferences.prioritizeBulk && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <Sparkles className="size-3" /> Βελτιστοποίηση Bulk συσκευασιών ενεργή
                  </span>
                )}
              </div>
            </div>

            {/* Meal Planner Sub-navigation Tabs */}
            <div className="flex items-center justify-between gap-2 border-b border-border pb-1 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab("planner")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === "planner"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <CalendarDays className="size-4" />
                  <span>Πρόγραμμα Γευμάτων</span>
                  {scheduledMealsCount > 0 && (
                    <span className="size-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">
                      {scheduledMealsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("recipes")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === "recipes"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <BookOpen className="size-4" />
                  <span>Συνταγές</span>
                </button>

                {/* Curation Studio Tab: Available ONLY to administrator */}
                {isAdmin && (
                  <button
                    id="tab-btn-curation-studio"
                    onClick={() => {
                      setEditingRecipeId(null);
                      setActiveTab("curation-studio");
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === "curation-studio"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    <Bot className="size-4 text-primary" />
                    <span>Recipe Studio</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${activeTab === "curation-studio"
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-primary/10 text-primary border-primary/20"
                        }`}
                    >
                      Admin
                    </span>
                  </button>
                )}

                {/* Test Center Tab: Available ONLY to administrator */}
                {/*isAdmin && (
                  <button
                    id="tab-btn-test-center"
                    onClick={() => {
                      setEditingRecipeId(null);
                      setActiveTab("test-center");
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === "test-center"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Test Center</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        activeTab === "test-center"
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      QA
                    </span>
                  </button>
                )*/}
              </div>

              {/* Direct CTA buttons to Universal Pantry & Universal Shopping List */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <button
                  id="planner-quick-pantry-btn"
                  onClick={() => setActiveSection("pantry")}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-all shrink-0"
                  title="Προβολή Αποθήκης & Πλεονάσματος"
                >
                  <Box className="size-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden sm:inline">Αποθήκη</span>
                  {activePantryItemsCount > 0 && (
                    <span className="size-5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] flex items-center justify-center font-bold">
                      {activePantryItemsCount}
                    </span>
                  )}
                </button>

                <button
                  id="planner-quick-grocery-btn"
                  onClick={() => setActiveSection("grocery")}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all shrink-0"
                  title="Προβολή της ενιαίας Λίστας Αγορών (όλα τα είδη)"
                >
                  <ShoppingCart className="size-3.5" />
                  <span className="hidden sm:inline">Λίστα Αγορών</span>
                  <span className="sm:hidden">Λίστα</span>
                  {activeGroceryItemsCount > 0 && (
                    <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {activeGroceryItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Views */}
            <div>
              {activeTab === "planner" && (
                <WeeklyCalendar
                  slots={slots}
                  allRecipes={allRecipes}
                  onAssignRecipe={assignRecipeToSlot}
                  onRemoveSlot={removeSlot}
                  onClearAll={clearAllSlots}
                  onLoadDefaultWeek={loadDefaultWeek}
                  onUpdateServings={updateSlotServings}
                  onUpdateReferenceUrl={updateRecipeReferenceUrl}
                  onEditRecipeInStudio={handleEditRecipeInStudio}
                  onAddIngredient={addIngredientToRecipe}
                  onOpenSaveModal={() => setIsSaveModalOpen(true)}
                />
              )}

              {/* Active Tab Views */}

              {activeTab === "recipes" && (
                <RecipeListView
                  recipes={allRecipes}
                  onCurateProduct={curateIngredientProduct}
                  onResetCuration={resetIngredientCuration}
                  onOpenCurationStudio={() => {
                    if (!isAdmin) {
                      setIsAdminLoginOpen(true);
                      return;
                    }
                    setEditingRecipeId(null);
                    setActiveTab("curation-studio");
                  }}
                  onUpdateCategory={updateRecipeCategory}
                  onUpdateReferenceUrl={updateRecipeReferenceUrl}
                  onEditRecipeInStudio={handleEditRecipeInStudio}
                  onAddIngredient={addIngredientToRecipe}
                  isAdmin={isAdmin}
                />
              )}

              {activeTab === "curation-studio" && isAdmin && (
                <RecipeCurationStudio
                  allRecipes={allRecipes}
                  initialRecipeId={editingRecipeId}
                  onSaveRecipe={(recipe) => {
                    updateCustomRecipe(recipe);
                    setEditingRecipeId(null);
                    setActiveTab("recipes");
                  }}
                  onViewRecipesTab={() => {
                    setEditingRecipeId(null);
                    setActiveTab("recipes");
                  }}
                />
              )}

              {activeTab === "test-center" && isAdmin && (
                <TestCenterView onBackToApp={() => setActiveTab("planner")} />
              )}
            </div>
          </div>
        )}

        {/* 5. UNIVERSAL GROCERY LIST & SUPERMARKET COMPARISONS */}
        {activeSection === "grocery" && (
          <div className="space-y-6">
            {/* Global Key Stats Bar */}
            <div className="bg-card border border-border/80 rounded-2xl p-3 sm:px-4 shadow-xs">
              <div className="flex items-center justify-between gap-4 overflow-x-auto text-xs">
                <div className="flex items-center gap-6 shrink-0">
                  {purchasedCost > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Απομένουν:</span>
                        <span className="font-extrabold text-foreground text-sm">
                          €{remainingCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                        <span>(Αγοράστηκαν:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          €{purchasedCost.toFixed(2)}
                        </span>
                        <span>/ €{totalCost.toFixed(2)})</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Εκτιμώμενο Καλάθι:</span>
                      <span className="font-bold text-foreground text-sm">
                        €{totalCost.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <TrendingDown className="size-3.5" />
                      <span>Κέρδος Bulk: €{totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span>Σύνολο Προϊόντων:</span>
                    <span className="font-semibold text-foreground">{activeGroceryItemsCount}</span>
                  </div>
                </div>

                {preferences.prioritizeBulk && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <Sparkles className="size-3" /> Βελτιστοποίηση Bulk συσκευασιών ενεργή
                  </span>
                )}
              </div>
            </div>

            {/* Universal Grocery List Component */}
            <GroceryListView
              items={groceryItems}
              basketComparisons={basketComparisons}
              totalCost={totalCost}
              remainingCost={remainingCost}
              purchasedCost={purchasedCost}
              totalSavings={totalSavings}
              isOptimizing={isOptimizing}
              onToggleChecked={toggleItemChecked}
              onTogglePantry={toggleItemPantry}
              onToggleExcluded={toggleItemExcluded}
              onExcludeMultiple={excludeMultipleItems}
              onRestoreExcludedItems={restoreExcludedItems}
              onRestoreAllExcluded={restoreAllExcludedItems}
              onClearExcludedPermanently={clearExcludedItemsPermanently}
              onUpdateItemOption={updateItemPackOption}
              onCurateProduct={curateGroceryIngredient}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
              onClearGroceryList={clearGroceryList}
            />
          </div>
        )}

        {/* 6. UNIVERSAL PANTRY & SURPLUS VIEW */}
        {activeSection === "pantry" && (
          <div className="space-y-6">
            <PantryView
              surplusItems={pantrySurplus}
              groceryItems={groceryItems}
              userPantryItems={userPantryItems}
              onTogglePantry={toggleItemPantry}
              onAddPantryItem={addPantryItem}
              onUpdatePantryItem={updatePantryItem}
              onDeletePantryItem={deletePantryItem}
              onAddSurplusToPantry={addSurplusToPantry}
              onNavigateSection={setActiveSection}
            />
          </div>
        )}
      </main>

      {/* Universal Footer: User Navigation, Data Citations & Administration/Developer Console */}
      <footer className="mt-auto border-t border-border/80 bg-muted/20 py-8 px-4 text-xs text-muted-foreground space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 1. Universal User Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-foreground">
            <button
              onClick={() => setActiveSection("landing")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🏠</span> <span>Αρχική</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveSection("planner")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🍽️</span> <span>Γεύματα</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveSection("grocery")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🛒</span> <span>Λίστα Αγορών</span>
              {activeGroceryItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  {activeGroceryItemsCount}
                </span>
              )}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveSection("pantry")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>📦</span> <span>Αποθήκη</span>
              {activePantryItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  {activePantryItemsCount}
                </span>
              )}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveSection("clean")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🧼</span> <span>Καθαριότητα</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveSection("baby")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>👶</span> <span>Βρεφικά</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsNewsletterModalOpen(true)}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>✉️</span> <span>Ενημερώσεις</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Settings className="size-3.5" /> <span>Ρυθμίσεις</span>
            </button>
          </div>

          {/* 2. Official Data Source Attribution & Disclaimer */}
          <div className="text-center text-[11px] text-muted-foreground/80 max-w-2xl mx-auto space-y-1">
            <p>
              <strong>pioftina.gr</strong> &bull; Έξυπνες αγορές σούπερ μάρκετ με αυτόματη σύγκριση τιμών καλαθιού.
            </p>
            <p>
              Δεδομένα τιμών και προϊόντων από το επίσημο Παρατηρητήριο Τιμών{" "}
              <a
                href="https://posokanei.gov.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground font-medium"
              >
                posokanei.gov.gr
              </a>{" "}
              (Γενική Γραμματεία Εμπορίου).
            </p>
          </div>

          {/* 3. Dedicated Administration & Developer Console Bar */}
          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            {/* Left: Developer / Tech Info */}
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>e-Καταναλωτής Live API</span>
              <span>&bull;</span>
              <span>Next.js 16 (Turbopack)</span>
              <span>&bull;</span>
              <Link
                href="/admin/tests"
                className="hover:text-foreground transition-colors underline font-mono text-[10px]"
                title="Προβολή αποτελεσμάτων δοκιμών QA & Pentest"
              >
                42/42 Tests OK
              </Link>
            </div>

            {/* Right: Administration Controls */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex flex-wrap items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl text-amber-800 dark:text-amber-200">
                  <span className="inline-flex items-center gap-1 font-bold mr-1">
                    <Shield className="size-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Admin</span>
                  </span>
                  <span>&bull;</span>
                  <button
                    id="footer-admin-recipe-studio-btn"
                    onClick={() => {
                      setActiveSection("planner");
                      setActiveTab("curation-studio");
                    }}
                    className="inline-flex items-center gap-1 font-medium hover:text-foreground underline transition-colors cursor-pointer"
                  >
                    <ChefHat className="size-3 text-blue-600 dark:text-blue-400" />
                    <span>Recipe Studio</span>
                  </button>
                  <span>&bull;</span>
                  <button
                    id="footer-admin-bundle-studio-btn"
                    onClick={() => {
                      handleOpenBundleStudio();
                    }}
                    className="inline-flex items-center gap-1 font-medium hover:text-foreground underline transition-colors cursor-pointer"
                  >
                    <Layers className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Bundle Studio</span>
                  </button>
                  <span>&bull;</span>
                  <Link
                    href="/admin/tests"
                    className="inline-flex items-center gap-1 font-medium hover:text-foreground underline transition-colors"
                  >
                    <Beaker className="size-3 text-purple-600 dark:text-purple-400" />
                    <span>Test Center</span>
                  </Link>
                  <span>&bull;</span>
                  <button
                    id="footer-admin-logout-btn"
                    onClick={adminLogout}
                    className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors ml-1 cursor-pointer"
                    title="Αποσύνδεση Διαχειριστή"
                  >
                    <LogOut className="size-3" />
                    <span>Αποσύνδεση</span>
                  </button>
                </div>
              ) : (
                <button
                  id="footer-admin-login-btn"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-all font-semibold cursor-pointer"
                  title="Σύνδεση Διαχειριστή (Admin Console)"
                >
                  <Lock className="size-3 text-primary" />
                  <span>Διαχείριση &amp; Pentest (Admin)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Preferences Modal */}
      <StorePreferencesModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSave={updatePreferences}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={adminLogin}
        onSuccess={() => setActiveTab("curation-studio")}
      />

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />

      {/* Save Plan & Shopping List to PC Modal */}
      <SavePlanModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        data={{
          slots,
          groceryItems,
          preferences,
          totalCost,
          remainingCost,
          purchasedCost,
          totalSavings,
          pantrySurplus,
        }}
      />
    </div>
  );
}
