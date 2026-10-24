"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  FileCode,
  Calendar,
  ShoppingCart,
  Sparkles,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PlanExportData,
  generatePlanAndShoppingListText,
  generatePlanAndShoppingListHtml,
  downloadTextFile,
  downloadJsonFile,
  printPlanDocument,
} from "@/lib/export/plan-exporter";

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PlanExportData;
}

function getDateSlug(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function SavePlanModal({ isOpen, onClose, data }: SavePlanModalProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fullText, setFullText] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setFullText(generatePlanAndShoppingListText(data));
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const scheduledMealsCount = data.slots.filter((s) => s.recipe !== null).length;
  const activeGroceryCount = data.groceryItems.filter(
    (i) => !i.inPantry && !i.isExcluded
  ).length;

  const handleDownloadTxt = () => {
    const content = fullText || generatePlanAndShoppingListText(data);
    const filename = `pioftina-plano-kai-lista-${getDateSlug()}.txt`;
    downloadTextFile(filename, content);
  };

  const handleDownloadJson = () => {
    const filename = `pioftina-backup-${getDateSlug()}.json`;
    const backupPayload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      preferences: data.preferences,
      totalCost: data.totalCost,
      totalSavings: data.totalSavings,
      slots: data.slots.map((s) => ({
        day: s.day,
        mealType: s.mealType,
        recipeId: s.recipe?.id,
        recipeTitle: s.recipe?.title,
        servings: s.servings,
        courseType: s.courseType,
      })),
      activeGroceryItems: data.groceryItems
        .filter((i) => !i.inPantry && !i.isExcluded)
        .map((i) => ({
          name: i.ingredientName,
          category: i.category,
          required: `${i.rawRequiredAmount}${i.rawUnit}`,
          selectedOption: i.selectedOption,
        })),
      pantrySurplus: data.pantrySurplus || [],
    };
    downloadJsonFile(filename, backupPayload);
  };

  const handlePrint = () => {
    const html = generatePlanAndShoppingListHtml(data);
    printPlanDocument(html);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-background border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Download className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground font-heading">
                Αποθήκευση στον Υπολογιστή
              </h2>
              <p className="text-xs text-muted-foreground">
                Κατεβάστε το εβδομαδιαίο πλάνο και τη λίστα αγορών σας σε αρχείο (.txt / .json) ή εκτυπώστε σε PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            title="Κλείσιμο"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Pills Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center gap-2.5">
              <Calendar className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Πρόγραμμα</p>
                <p className="text-xs font-bold text-foreground">{scheduledMealsCount} πιάτα</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center gap-2.5">
              <ShoppingCart className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Λίστα Αγορών</p>
                <p className="text-xs font-bold text-foreground">{activeGroceryCount} είδη</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center gap-2.5">
              <Users className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Νοικοκυριό</p>
                <p className="text-xs font-bold text-foreground">{data.preferences.householdSize} άτομα</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center gap-2.5">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">Καλάθι</p>
                <p className="text-xs font-bold text-foreground">€{data.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option 1: .txt Download */}
            <div className="p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Αρχείο Κειμένου (.txt)
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Δομημένο αρχείο με το 7ήμερο πρόγραμμα και τη λίστα αγορών με κουτάκια [ ]. Ανοίγει στο Σημειωματάριο.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleDownloadTxt}
                className="w-full mt-4 text-xs gap-1.5 rounded-xl font-semibold bg-primary text-primary-foreground"
              >
                <Download className="size-3.5" />
                Λήψη Αρχείου (.txt)
              </Button>
            </div>

            {/* Option 2: Print / PDF */}
            <div className="p-4 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Printer className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Εκτύπωση / Αποθήκευση σε PDF
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Έτοιμη σελίδα A4 με πίνακα γευμάτων και λίστα με κουτάκια επιλογής για το σούπερ μάρκετ.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="w-full mt-4 text-xs gap-1.5 rounded-xl font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
              >
                <Printer className="size-3.5" />
                Εκτύπωση &amp; PDF
              </Button>
            </div>

            {/* Option 3: .json Backup */}
            <div className="p-4 rounded-2xl border border-border bg-card hover:border-amber-500/50 transition-all flex flex-col justify-between group">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileCode className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Αντίγραφο Ασφαλείας (.json)
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Πλήρες ψηφιακό raw αρχείο με όλες τις ρυθμίσεις, μερίδες και συνταγές για αρχειοθέτηση.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadJson}
                className="w-full mt-4 text-xs gap-1.5 rounded-xl font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
              >
                <Download className="size-3.5" />
                Λήψη Backup (.json)
              </Button>
            </div>

            {/* Option 4: Copy All Text */}
            <div className="p-4 rounded-2xl border border-border bg-card hover:border-purple-500/50 transition-all flex flex-col justify-between group">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Copy className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Αντιγραφή Όλου του Κειμένου
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Αντιγραφή στο πρόχειρο για άμεση επικόλληση σε Viber, WhatsApp, Notes ή Email.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="w-full mt-4 text-xs gap-1.5 rounded-xl font-semibold border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span>Αντιγράφηκε Επιτυχώς!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Αντιγραφή Κειμένου</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Collapsible Live Preview Section */}
          <div className="border border-border rounded-2xl overflow-hidden bg-muted/20">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-primary" />
                <span>Προεπισκόπηση Περιεχομένου Αρχείου ({fullText.length} χαρακτήρες)</span>
              </span>
              <span>{showPreview ? "Απόκρυψη ▲" : "Εμφάνιση ▼"}</span>
            </button>

            {showPreview && (
              <div className="p-4 border-t border-border bg-background">
                <pre className="p-4 rounded-xl bg-muted/60 border border-border text-[11px] text-foreground font-mono whitespace-pre-wrap max-h-64 overflow-y-auto select-all">
                  {fullText}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <span>Αποθηκεύεται τοπικά στον υπολογιστή σας χωρίς αποστολή σε τρίτους</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Κλείσιμο
          </Button>
        </div>
      </div>
    </div>
  );
}
