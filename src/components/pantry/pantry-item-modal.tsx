"use client";

import React, { useState, useEffect } from "react";
import { UserPantryItem, AisleCategory, AISLE_CATEGORIES } from "@/types/meal-planner";
import { X, Box, Plus, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PantryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<UserPantryItem, "id" | "createdAt" | "updatedAt">) => void;
  initialItem?: UserPantryItem | null;
}

const POPULAR_PANTRY_STAPLES = [
  { name: "Ελαιόλαδο Παρθένο", unit: "L", amount: 1, category: "pantry" as AisleCategory },
  { name: "Φέτα Π.Ο.Π.", unit: "g", amount: 400, category: "dairy" as AisleCategory },
  { name: "Ρύζι Καρολίνα", unit: "kg", amount: 1, category: "pantry" as AisleCategory },
  { name: "Αλεύρι για Όλες τις Χρήσεις", unit: "kg", amount: 1, category: "bakery" as AisleCategory },
  { name: "Μακαρόνια Νο 6", unit: "g", amount: 500, category: "pantry" as AisleCategory },
  { name: "Αλάτι Ψιλό", unit: "kg", amount: 1, category: "pantry" as AisleCategory },
  { name: "Ρίγανη", unit: "g", amount: 50, category: "pantry" as AisleCategory },
  { name: "Ζάχαρη Λευκή", unit: "kg", amount: 1, category: "pantry" as AisleCategory },
  { name: "Τοματοπολτός", unit: "g", amount: 400, category: "pantry" as AisleCategory },
  { name: "Αυγά Φρέσκα", unit: "τεμ", amount: 6, category: "dairy" as AisleCategory },
  { name: "Μωρομάντηλα Sensitive", unit: "τεμ", amount: 1, category: "baby" as AisleCategory },
  { name: "Χαρτί Κουζίνας 3πλο", unit: "τεμ", amount: 2, category: "household" as AisleCategory },
  { name: "Απορρυπαντικό Πιάτων", unit: "L", amount: 1, category: "household" as AisleCategory },
];

interface PantryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<UserPantryItem, "id" | "createdAt" | "updatedAt">) => void;
  initialItem?: UserPantryItem | null;
  defaultCategory?: AisleCategory;
}

export function PantryItemModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = "pantry",
}: PantryItemModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState("kg");
  const [category, setCategory] = useState<AisleCategory>(defaultCategory);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setAmount(initialItem.amount);
      setUnit(initialItem.unit);
      setCategory(initialItem.category);
      setNotes(initialItem.notes || "");
    } else {
      setName("");
      setAmount(1);
      setUnit("kg");
      setCategory(defaultCategory);
      setNotes("");
    }
    setError(null);
  }, [initialItem, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Παρακαλούμε εισάγετε όνομα υλικού.");
      return;
    }
    if (amount <= 0 || isNaN(amount)) {
      setError("Παρακαλούμε εισάγετε έγκυρη ποσότητα μεγαλύτερη του 0.");
      return;
    }

    onSave({
      name: name.trim(),
      amount: Number(amount),
      unit,
      category,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const selectSuggestion = (staple: typeof POPULAR_PANTRY_STAPLES[0]) => {
    setName(staple.name);
    setAmount(staple.amount);
    setUnit(staple.unit);
    setCategory(staple.category);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
              <Box className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {initialItem ? "Επεξεργασία Υλικού Αποθήκης" : "Προσθήκη Υλικού στην Αποθήκη"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {initialItem
                  ? "Ενημερώστε την ποσότητα ή τα στοιχεία του υπάρχοντος υλικού."
                  : "Καταγράψτε τι έχετε ήδη στο σπίτι ή στο ντουλάπι σας."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
              {error}
            </div>
          )}

          {/* Quick Suggestions (Add Mode Only) */}
          {!initialItem && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3 text-primary" />
                Συχνά Βασικά Υλικά Ντουλαπιού:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PANTRY_STAPLES.map((staple) => (
                  <button
                    key={staple.name}
                    type="button"
                    onClick={() => selectSuggestion(staple)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/80 transition-colors"
                  >
                    {staple.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Όνομα Υλικού <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="π.χ. Ελαιόλαδο, Φέτα, Ρύζι, Αλάτι..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          {/* Quantity & Unit Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Ποσότητα <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value) || 0);
                  setError(null);
                }}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Μονάδα Μέτρησης
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="kg">Κιλά (kg)</option>
                <option value="g">Γραμμάρια (g)</option>
                <option value="L">Λίτρα (L)</option>
                <option value="ml">Χιλιοστόλιτρα (ml)</option>
                <option value="τεμ">Τεμάχια (τεμ)</option>
                <option value="πακέτο">Πακέτο</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Κατηγορία Διαδρόμου Supermarket
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AisleCategory)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {Object.entries(AISLE_CATEGORIES).map(([catKey, catMeta]) => (
                <option key={catKey} value={catKey}>
                  {catMeta.icon} {catMeta.nameEl}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Σημειώσεις / Τοποθεσία (προαιρετικό)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="π.χ. 2ο ράφι ντουλαπιού, Λήξη: 12/2026..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl"
            >
              Ακύρωση
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl gap-1.5 font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            >
              <Check className="size-4" />
              {initialItem ? "Αποθήκευση Αλλαγών" : "Προσθήκη στην Αποθήκη"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
