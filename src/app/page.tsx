"use client";

import React, { useState } from "react";
import { useMealPlannerStore } from "@/lib/storage/store";
import { WeeklyCalendar } from "@/components/meal-planner/weekly-calendar";
import { GroceryListView } from "@/components/grocery-list/grocery-list-view";
import { RecipeListView } from "@/components/recipes/recipe-list-view";
import { PantryView } from "@/components/pantry/pantry-view";
import { RecipeCurationStudio } from "@/components/admin/recipe-curation-studio";
import { TestCenterView } from "@/components/admin/test-center-view";
import Link from "next/link";
import { StorePreferencesModal } from "@/components/settings/store-preferences-modal";
import { SupermarketBadge } from "@/components/supermarket-badge";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { NewsletterModal } from "@/components/newsletter/newsletter-modal";
import { SavePlanModal } from "@/components/meal-planner/save-plan-modal";
import {
  CalendarDays,
  ShoppingCart,
  BookOpen,
  Box,
  Settings,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Users,
  Bot,
  Shield,
  Lock,
  Mail,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    slots,
    preferences,
    allRecipes,
    groceryItems,
    basketComparisons,
    pantrySurplus,
    userPantryItems,
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
    restoreAllExcludedItems,
    updateRecipeCategory,
    updateRecipeReferenceUrl,
    updateSlotServings,
  } = useMealPlannerStore();

  const { isAdmin, login: adminLogin, logout: adminLogout } = useAdminAuth();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "planner" | "grocery" | "recipes" | "pantry" | "curation-studio" | "test-center"
  >("planner");
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    setActiveTab("curation-studio");
  };

  const activeGroceryItemsCount = groceryItems.filter((i) => !i.inPantry && !i.isExcluded).length;
  const scheduledMealsCount = slots.filter((s) => s.recipe !== null).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative size-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-blue-700/25 ring-2 ring-blue-500/30 overflow-hidden">
              <span className="relative z-10 font-black">π</span>
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <div className="w-full h-1 bg-white" />
                <div className="h-full w-1 bg-white absolute" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg tracking-tight text-foreground font-heading">
                  pioftina<span className="text-primary font-black">.gr</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-primary border border-blue-500/20">
                  <span className="size-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                  Live posokanei.gov.gr
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Meal Planning &amp; Bulk Shopping Optimizer Greece
              </p>
            </div>
          </div>

          {/* Quick Actions, Newsletter, Preferences & Admin Status */}
          <div className="flex items-center gap-2">
            {/* Save to PC Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              id="header-save-plan-btn"
              onClick={() => setIsSaveModalOpen(true)}
              className="h-9 px-3 rounded-xl gap-1.5 text-xs font-semibold text-foreground border-border hover:bg-muted/50"
              title="Αποθήκευση του εβδομαδιαίου πλάνου και της λίστας αγορών στον υπολογιστή"
            >
              <Download className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Αποθήκευση στον Υπολογιστή</span>
            </Button>

            {/* Newsletter Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewsletterModalOpen(true)}
              className="h-9 px-3 rounded-xl gap-1.5 text-xs font-semibold text-primary border-primary/20 hover:bg-primary/5"
              title="Εγγραφή για νέα και προσφορές"
            >
              <Mail className="size-3.5" />
              <span className="hidden md:inline">Νέα &amp; Προσφορές</span>
            </Button>

            {/* Admin Badge if logged in */}
            {isAdmin && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold shrink-0">
                <Shield className="size-3.5 text-amber-600" />
                <span>Admin</span>
                <button
                  onClick={adminLogout}
                  className="ml-1 text-[10px] text-muted-foreground hover:text-foreground underline"
                  title="Αποσύνδεση διαχειριστή"
                >
                  Έξοδος
                </button>
              </div>
            )}

            <div
              onClick={() => setIsSettingsOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted/40 cursor-pointer transition-colors text-xs"
              title="Κάντε κλικ για αλλαγή supermarket & μελών νοικοκυριού"
            >
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Users className="size-3.5 text-primary" />
                {preferences.householdSize} άτομα
              </span>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                {preferences.preferredSupermarkets.slice(0, 4).map((st) => (
                  <SupermarketBadge key={st} retailerId={st} size="sm" />
                ))}
                {preferences.preferredSupermarkets.length > 4 && (
                  <span className="text-[10px] font-semibold text-muted-foreground px-1">
                    +{preferences.preferredSupermarkets.length - 4}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="size-9 p-0 rounded-xl"
              title="Ρυθμίσεις"
            >
              <Settings className="size-4" />
            </Button>

            {!isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                id="header-admin-login-btn"
                onClick={() => setIsAdminLoginOpen(true)}
                className="size-9 p-0 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-muted/50"
                title="Σύνδεση Διαχειριστή (Admin)"
              >
                <Lock className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="bg-muted/40 border-t border-border/60 py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs">
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
                <span className="font-semibold text-foreground">
                  {scheduledMealsCount}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                <span>Υλικά Λίστας:</span>
                <span className="font-semibold text-foreground">
                  {activeGroceryItemsCount}
                </span>
              </div>
            </div>

            {preferences.prioritizeBulk && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <Sparkles className="size-3" /> Βελτιστοποίηση Bulk συσκευασιών ενεργή
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "planner"
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
            onClick={() => setActiveTab("grocery")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "grocery"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <ShoppingCart className="size-4" />
            <span>Λίστα Αγορών &amp; Τιμές</span>
            {activeGroceryItemsCount > 0 && (
              <span className="size-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">
                {activeGroceryItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "recipes"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BookOpen className="size-4" />
            <span>Συνταγές</span>
          </button>

          <button
            onClick={() => setActiveTab("pantry")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "pantry"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Box className="size-4" />
            <span>Αποθήκη &amp; Πλεόνασμα</span>
            {(userPantryItems.length > 0 || pantrySurplus.length > 0) && (
              <span className="size-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-center font-bold">
                {userPantryItems.length + pantrySurplus.length}
              </span>
            )}
          </button>
          {/* Curation Studio Tab: Available ONLY to administrator */}
          {isAdmin && (
            <button
              id="tab-btn-curation-studio"
              onClick={() => {
                setEditingRecipeId(null);
                setActiveTab("curation-studio");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "curation-studio"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Bot className="size-4 text-primary" />
              <span>Curation Studio</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                  activeTab === "curation-studio"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                Admin
              </span>
            </button>
          )}

          {/* Test Center Tab: Available ONLY to administrator */}
          {isAdmin && (
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
          )}
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

          {activeTab === "grocery" && (
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
              onRestoreAllExcluded={restoreAllExcludedItems}
              onUpdateItemOption={updateItemPackOption}
              onCurateProduct={curateGroceryIngredient}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
            />
          )}

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

          {activeTab === "pantry" && (
            <PantryView
              surplusItems={pantrySurplus}
              groceryItems={groceryItems}
              userPantryItems={userPantryItems}
              onTogglePantry={toggleItemPantry}
              onAddPantryItem={addPantryItem}
              onUpdatePantryItem={updatePantryItem}
              onDeletePantryItem={deletePantryItem}
              onAddSurplusToPantry={addSurplusToPantry}
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
      </main>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
        <NewsletterCard source="footer" />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/80 bg-muted/20 py-6 px-4 text-center text-xs text-muted-foreground space-y-2">
        <p>
          pioftina.gr &bull; Δεδομένα τιμών και προϊόντων από το επίσημο Παρατηρητήριο Τιμών{" "}
          <a
            href="https://posokanei.gov.gr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground font-medium"
          >
            posokanei.gov.gr
          </a>
        </p>
        <p className="mt-1">
          Έξυπνος προγραμματισμός γευμάτων &bull; Βελτιστοποίηση μεγεθών συσκευασίας &bull; Μείωση σπατάλης τροφίμων
        </p>

        {/* Administrator Link / Status */}
        <div className="pt-2 text-[11px] text-muted-foreground/70 flex items-center justify-center gap-2">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20">
              <Shield className="size-3" />
              <span>Συνδεδεμένος ως Διαχειριστής</span>
              <span>&bull;</span>
              <Link href="/admin/tests" className="underline hover:text-foreground">
                Test Center
              </Link>
              <span>&bull;</span>
              <button
                onClick={adminLogout}
                className="underline hover:text-foreground transition-colors cursor-pointer"
              >
                Αποσύνδεση
              </button>
            </span>
          ) : (
            <button
              id="footer-admin-login-btn"
              onClick={() => setIsAdminLoginOpen(true)}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer opacity-70 hover:opacity-100"
            >
              <Lock className="size-3" />
              <span>Διαχείριση (Admin)</span>
            </button>
          )}
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
