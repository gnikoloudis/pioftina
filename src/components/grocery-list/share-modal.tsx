"use client";

import React, { useState } from "react";
import { OptimizedGroceryItem, AISLE_CATEGORIES } from "@/types/meal-planner";
import { X, Copy, Check, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OptimizedGroceryItem[];
  totalCost: number;
}

export function ShareModal({
  isOpen,
  onClose,
  items,
  totalCost,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format text representation for WhatsApp / Viber
  const generateTextList = () => {
    let text = `🛒 *Λίστα Αγορών Supermarket* (Σύνολο: ~€${totalCost.toFixed(2)})\n`;
    text += `Δημιουργήθηκε μέσω pioftina.gr\n\n`;

    const categories = Object.keys(AISLE_CATEGORIES) as (keyof typeof AISLE_CATEGORIES)[];

    for (const cat of categories) {
      const catItems = items.filter((i) => i.category === cat && !i.inPantry && !i.isExcluded);
      if (catItems.length === 0) continue;

      const meta = AISLE_CATEGORIES[cat];
      text += `${meta.icon} *${meta.nameEl}*\n`;

      for (const item of catItems) {
        const checkMark = item.isChecked ? "✅" : "⬜";
        const isUnavailable = item.isAvailable === false || !item.selectedOption || (item.selectedOption.totalPrice ?? 0) <= 0 || item.selectedOption?.isSynthetic;
        const packInfo = isUnavailable
          ? ` (${item.rawRequiredAmount}${item.rawUnit} - Μη διαθέσιμο)`
          : item.selectedOption
          ? ` (${item.selectedOption.packCount}x ${item.selectedOption.packSize}${item.selectedOption.packUnit} - €${item.selectedOption.totalPrice.toFixed(2)})`
          : ` (${item.rawRequiredAmount}${item.rawUnit})`;
        text += `${checkMark} ${item.ingredientName}${packInfo}\n`;
      }
      text += `\n`;
    }

    return text;
  };

  const handleCopy = () => {
    const text = generateTextList();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = generateTextList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-lg max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Κοινοποίηση Λίστας Αγορών
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Μπορείτε να αντιγράψετε τη λίστα για να τη στείλετε στο WhatsApp, Viber, Notes, ή να την εκτυπώσετε.
          </p>

          <pre className="p-4 rounded-xl bg-muted/60 border border-border text-xs text-foreground font-mono whitespace-pre-wrap max-h-72 overflow-y-auto select-all">
            {shareText}
          </pre>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs gap-1.5"
          >
            <Printer className="size-3.5" />
            Εκτύπωση
          </Button>

          <Button
            size="sm"
            onClick={handleCopy}
            className="text-xs gap-1.5 bg-primary text-primary-foreground font-medium"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                Αντιγράφηκε!
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Αντιγραφή (WhatsApp/Viber)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
