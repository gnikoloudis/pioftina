import {
  MealSlot,
  OptimizedGroceryItem,
  UserPreferences,
  PantrySurplusItem,
  DAYS_GREEK,
  MEAL_TYPES_CONFIG,
  AISLE_CATEGORIES,
  AisleCategory,
} from "@/types/meal-planner";
import { getRetailerName } from "@/lib/posokanei/mock-data";

/**
 * Standard Greek uppercase helper that strips tonoi (e.g. ΔΕΥΤΕΡΑ instead of ΔΕΥΤΈΡΑ).
 */
export function toGreekUpper(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export interface PlanExportData {
  slots: MealSlot[];
  groceryItems: OptimizedGroceryItem[];
  preferences: UserPreferences;
  totalCost: number;
  remainingCost: number;
  purchasedCost: number;
  totalSavings: number;
  pantrySurplus?: PantrySurplusItem[];
}

/**
 * Generates a clean, beautifully formatted plain text report of the weekly meal plan
 * and organized grocery shopping list for saving to PC or sharing.
 */
export function generatePlanAndShoppingListText(data: PlanExportData): string {
  const {
    slots,
    groceryItems,
    preferences,
    totalCost,
    totalSavings,
    pantrySurplus = [],
  } = data;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("el-GR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const divider = "=".repeat(76);
  const subDivider = "-".repeat(76);

  let text = `${divider}\n`;
  text += `🍽️ PIOFTINA.GR — ΕΒΔΟΜΑΔΙΑΙΟ ΠΛΑΝΟ ΓΕΥΜΑΤΩΝ & ΛΙΣΤΑ ΑΓΟΡΩΝ SUPERMARKET\n`;
  text += `${divider}\n\n`;

  // Header Summary
  text += `📅 Ημερομηνία Έκδοσης: ${dateFormatted}\n`;
  text += `👥 Μέλη Νοικοκυριού:  ${preferences.householdSize} άτομα\n`;
  text += `💰 Εκτιμώμενο Καλάθι:  €${totalCost.toFixed(2)}`;
  if (totalSavings > 0) {
    text += ` (🎉 Κέρδος Bulk Συσκευασιών: €${totalSavings.toFixed(2)})`;
  }
  text += `\n`;

  if (preferences.preferredSupermarkets && preferences.preferredSupermarkets.length > 0) {
    const storeNames = preferences.preferredSupermarkets
      .map((s) => getRetailerName(s))
      .join(", ");
    text += `🏪 Επιλεγμένα Supermarket: ${storeNames}\n`;
  }
  text += `\n`;

  // SECTION 1: WEEKLY MEAL PLAN
  text += `${subDivider}\n`;
  text += `📅 1. ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΓΡΑΜΜΑ ΓΕΥΜΑΤΩΝ\n`;
  text += `${subDivider}\n\n`;

  let totalMealsCount = 0;

  for (let dayIndex = 0; dayIndex < DAYS_GREEK.length; dayIndex++) {
    const dayName = DAYS_GREEK[dayIndex];
    const daySlots = slots.filter((s) => s.day === dayIndex && s.recipe !== null);

    text += `▶ [${toGreekUpper(dayName)}]\n`;

    if (daySlots.length === 0) {
      text += `   (Δεν έχουν προγραμματιστεί γεύματα για αυτή την ημέρα)\n\n`;
      continue;
    }

    // Order meals: breakfast -> lunch -> snack -> dinner
    const mealOrder: Array<"breakfast" | "lunch" | "snack" | "dinner"> = [
      "breakfast",
      "lunch",
      "snack",
      "dinner",
    ];

    for (const mealType of mealOrder) {
      const slotsForMeal = daySlots.filter((s) => s.mealType === mealType);
      if (slotsForMeal.length === 0) continue;

      const mealConfig = MEAL_TYPES_CONFIG.find((m) => m.id === mealType);
      const mealLabel = mealConfig ? `${mealConfig.icon} ${mealConfig.label}` : mealType;

      for (const slot of slotsForMeal) {
        if (!slot.recipe) continue;
        totalMealsCount++;
        const courseTag =
          slot.courseType === "salad"
            ? " [Σαλάτα]"
            : slot.courseType === "side"
            ? " [Συνοδευτικό]"
            : slot.courseType === "snack"
            ? " [Σνακ]"
            : slot.courseType === "breakfast"
            ? " [Πρωινό]"
            : "";

        const prepCook =
          slot.recipe.prepTimeMinutes || slot.recipe.cookTimeMinutes
            ? ` (~${(slot.recipe.prepTimeMinutes || 0) + (slot.recipe.cookTimeMinutes || 0)}λ)`
            : "";

        text += `   • ${mealLabel}${courseTag}: ${slot.recipe.title}${prepCook}\n`;
        text += `     Μερίδες: ${slot.servings || preferences.householdSize}`;

        if (slot.recipe.ingredients && slot.recipe.ingredients.length > 0) {
          text += ` | Υλικά: ${slot.recipe.ingredients.length}`;
        }
        text += `\n`;
      }
    }
    text += `\n`;
  }

  // SECTION 2: ORGANIZED GROCERY LIST
  text += `${subDivider}\n`;
  text += `🛒 2. ΟΡΓΑΝΩΜΕΝΗ ΛΙΣΤΑ ΑΓΟΡΩΝ SUPERMARKET (Ανά Διάδρομο)\n`;
  text += `${subDivider}\n\n`;

  const activeItems = groceryItems.filter((i) => !i.inPantry && !i.isExcluded);

  if (activeItems.length === 0) {
    text += `(Η λίστα αγορών είναι άδεια ή όλα τα υλικά υπάρχουν ήδη στην Αποθήκη σας!)\n\n`;
  } else {
    const categories = Object.keys(AISLE_CATEGORIES) as AisleCategory[];
    let listedItemsCount = 0;

    for (const cat of categories) {
      const catItems = activeItems.filter((i) => i.category === cat);
      if (catItems.length === 0) continue;

      const meta = AISLE_CATEGORIES[cat];
      text += `${meta.icon} ${toGreekUpper(meta.nameEl)}\n`;

      for (const item of catItems) {
        listedItemsCount++;
        const isBought = item.isChecked ? "[X]" : "[ ]";
        const unitStr = item.rawUnit || "";
        const amountStr = `${item.rawRequiredAmount}${unitStr}`;

        let packDetails = "";
        if (
          item.selectedOption &&
          item.selectedOption.totalPrice > 0 &&
          !item.selectedOption.isSynthetic
        ) {
          const store = (item.selectedOption.retailerName || item.selectedOption.retailer)
            ? ` @ ${item.selectedOption.retailerName || getRetailerName(item.selectedOption.retailer)}`
            : "";
          packDetails = ` -> Συσκευασία: ${item.selectedOption.packCount}x ${item.selectedOption.packSize}${item.selectedOption.packUnit} (€${item.selectedOption.totalPrice.toFixed(2)}${store})`;
        } else {
          packDetails = ` -> (Ανάγκη: ${amountStr})`;
        }

        text += `  ${isBought} ${item.ingredientName} (${amountStr})${packDetails}\n`;
      }
      text += `\n`;
    }
    text += `Σύνολο Απαραίτητων Υλικών: ${listedItemsCount} είδη\n\n`;
  }

  // SECTION 3: PANTRY & SURPLUS (WHAT'S LEFTOVER)
  if (pantrySurplus && pantrySurplus.length > 0) {
    text += `${subDivider}\n`;
    text += `📦 3. ΑΠΟΘΗΚΗ & ΠΛΕΟΝΑΣΜΑ (Υλικά που σας περισσεύουν για επόμενες εβδομάδες)\n`;
    text += `${subDivider}\n\n`;

    for (const item of pantrySurplus) {
      const surplusStr =
        item.amount >= 1000 && item.unit === "g"
          ? `${(item.amount / 1000).toFixed(2)}kg`
          : item.amount >= 1000 && (item.unit === "ml" || item.unit === "l")
          ? `${(item.amount / 1000).toFixed(2)}L`
          : `${item.amount}${item.unit}`;

      const origin = item.originMealNames && item.originMealNames.length > 0 ? ` (από: ${item.originMealNames.join(", ")})` : "";
      text += `  • ${item.ingredientName}: Περισσεύουν ~${surplusStr}${origin}\n`;
    }
    text += `\n`;
  }

  // Footer
  text += `${divider}\n`;
  text += `💡 Δημιουργήθηκε αυτόματα από το pioftina.gr\n`;
  text += `Έξυπνος Προγραμματισμός Γευμάτων & Τιμές Supermarket Ελλάδας (Live posokanei.gov.gr)\n`;
  text += `${divider}\n`;

  return text;
}

/**
 * Generates an elegant, printable A4 HTML document with styles ready for window.print() / Save as PDF.
 */
export function generatePlanAndShoppingListHtml(data: PlanExportData): string {
  const {
    slots,
    groceryItems,
    preferences,
    totalCost,
    totalSavings,
    pantrySurplus = [],
  } = data;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("el-GR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeItems = groceryItems.filter((i) => !i.inPantry && !i.isExcluded);
  const categories = Object.keys(AISLE_CATEGORIES) as AisleCategory[];

  let mealTableRowsHtml = "";
  for (let dayIdx = 0; dayIdx < DAYS_GREEK.length; dayIdx++) {
    const dayName = DAYS_GREEK[dayIdx];
    const daySlots = slots.filter((s) => s.day === dayIdx && s.recipe !== null);

    if (daySlots.length === 0) {
      mealTableRowsHtml += `
        <tr>
          <td class="day-cell"><strong>${dayName}</strong></td>
          <td colspan="4" class="empty-day-cell">Δεν έχουν οριστεί γεύματα</td>
        </tr>
      `;
      continue;
    }

    const breakfasts = daySlots
      .filter((s) => s.mealType === "breakfast")
      .map((s) => `<div>🥞 ${s.recipe?.title} <span class="tag">(${s.servings}μ)</span></div>`)
      .join("");

    const lunches = daySlots
      .filter((s) => s.mealType === "lunch")
      .map((s) => {
        const tag = s.courseType === "salad" ? "🥗 Σαλάτα" : "🍛 Κυρίως";
        return `<div><strong>${tag}:</strong> ${s.recipe?.title} <span class="tag">(${s.servings}μ)</span></div>`;
      })
      .join("");

    const snacks = daySlots
      .filter((s) => s.mealType === "snack")
      .map((s) => `<div>🍎 ${s.recipe?.title} <span class="tag">(${s.servings}μ)</span></div>`)
      .join("");

    const dinners = daySlots
      .filter((s) => s.mealType === "dinner")
      .map((s) => `<div>🌙 ${s.recipe?.title} <span class="tag">(${s.servings}μ)</span></div>`)
      .join("");

    mealTableRowsHtml += `
      <tr>
        <td class="day-cell"><strong>${dayName}</strong></td>
        <td>${breakfasts || '<span class="dash">-</span>'}</td>
        <td>${lunches || '<span class="dash">-</span>'}</td>
        <td>${snacks || '<span class="dash">-</span>'}</td>
        <td>${dinners || '<span class="dash">-</span>'}</td>
      </tr>
    `;
  }

  let shoppingListHtml = "";
  for (const cat of categories) {
    const catItems = activeItems.filter((i) => i.category === cat);
    if (catItems.length === 0) continue;

    const meta = AISLE_CATEGORIES[cat];
    const itemsHtml = catItems
      .map((item) => {
        const amountStr = `${item.rawRequiredAmount}${item.rawUnit || ""}`;
        let packStr = "";
        if (item.selectedOption && item.selectedOption.totalPrice > 0 && !item.selectedOption.isSynthetic) {
          const store = (item.selectedOption.retailerName || item.selectedOption.retailer)
            ? ` &bull; ${item.selectedOption.retailerName || getRetailerName(item.selectedOption.retailer)}`
            : "";
          packStr = `<span class="pack-badge">${item.selectedOption.packCount}x ${item.selectedOption.packSize}${item.selectedOption.packUnit} (€${item.selectedOption.totalPrice.toFixed(2)}${store})</span>`;
        }

        return `
          <div class="grocery-item">
            <span class="checkbox-box"></span>
            <div class="item-text">
              <span class="item-name">${item.ingredientName}</span>
              <span class="item-qty">(${amountStr})</span>
              ${packStr}
            </div>
          </div>
        `;
      })
      .join("");

    shoppingListHtml += `
      <div class="aisle-card">
        <h3 class="aisle-title">${meta.icon} ${meta.nameEl}</h3>
        <div class="aisle-items">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  let surplusHtml = "";
  if (pantrySurplus.length > 0) {
    const surplusItemsHtml = pantrySurplus
      .map((s) => {
        const surplusAmount =
          s.amount >= 1000 && s.unit === "g"
            ? `${(s.amount / 1000).toFixed(2)}kg`
            : s.amount >= 1000 && (s.unit === "ml" || s.unit === "l")
            ? `${(s.amount / 1000).toFixed(2)}L`
            : `${s.amount}${s.unit}`;
        return `<li><strong>${s.ingredientName}:</strong> Περισσεύουν ~${surplusAmount} για επόμενες εβδομάδες</li>`;
      })
      .join("");

    surplusHtml = `
      <div class="surplus-box">
        <h3>📦 Αποθήκη & Πλεόνασμα (Τι περισσεύει)</h3>
        <ul>${surplusItemsHtml}</ul>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="utf-8">
  <title>pioftina.gr - Εβδομαδιαίο Πλάνο & Λίστα Αγορών</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 11pt;
      line-height: 1.4;
    }
    .print-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .brand-title span {
      color: #2563eb;
    }
    .brand-subtitle {
      font-size: 9pt;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .stats-bar {
      display: flex;
      gap: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 9pt;
      margin-bottom: 20px;
    }
    .stat-item strong {
      color: #0f172a;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      border-left: 4px solid #2563eb;
      padding-left: 8px;
      margin: 24px 0 10px 0;
    }
    /* Meal Table */
    table.meal-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 24px;
    }
    table.meal-table th, table.meal-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      vertical-align: top;
    }
    table.meal-table th {
      background: #f1f5f9;
      font-weight: 700;
      text-align: left;
    }
    table.meal-table td.day-cell {
      background: #f8fafc;
      width: 12%;
    }
    table.meal-table td.empty-day-cell {
      color: #94a3b8;
      font-style: italic;
    }
    .tag {
      font-size: 7.5pt;
      color: #475569;
    }
    .dash {
      color: #cbd5e1;
    }
    /* Shopping list grid */
    .shopping-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      page-break-inside: auto;
    }
    .aisle-card {
      background: #fdfdfd;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      break-inside: avoid;
    }
    .aisle-title {
      margin: 0 0 6px 0;
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .grocery-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }
    .checkbox-box {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1.5px solid #64748b;
      border-radius: 2px;
      margin-top: 2px;
      flex-shrink: 0;
    }
    .item-text {
      flex: 1;
    }
    .item-name {
      font-weight: 600;
      color: #0f172a;
    }
    .item-qty {
      color: #64748b;
      font-size: 8pt;
    }
    .pack-badge {
      display: block;
      color: #0369a1;
      font-size: 7.5pt;
    }
    .surplus-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 10px;
      margin-top: 16px;
      font-size: 8.5pt;
      break-inside: avoid;
    }
    .surplus-box h3 {
      margin: 0 0 4px 0;
      font-size: 9pt;
      color: #b45309;
    }
    .surplus-box ul {
      margin: 0;
      padding-left: 18px;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <div>
      <h1 class="brand-title">pioftina<span>.gr</span></h1>
      <p class="brand-subtitle">Έξυπνος Προγραμματισμός Γευμάτων & Τιμές Supermarket Ελλάδας</p>
    </div>
    <div style="text-align: right; font-size: 8.5pt; color: #64748b;">
      <div><strong>${dateFormatted}</strong></div>
      <div>Live posokanei.gov.gr</div>
    </div>
  </div>

  <div class="stats-bar">
    <div class="stat-item">👥 <strong>${preferences.householdSize}</strong> μέλη</div>
    <div class="stat-item">💰 Εκτιμώμενο Καλάθι: <strong>€${totalCost.toFixed(2)}</strong></div>
    ${totalSavings > 0 ? `<div class="stat-item" style="color: #059669;">🎉 Κέρδος Bulk: <strong>€${totalSavings.toFixed(2)}</strong></div>` : ""}
    <div class="stat-item">🛒 <strong>${activeItems.length}</strong> υλικά αγοράς</div>
  </div>

  <h2 class="section-title">1. Εβδομαδιαίο Πρόγραμμα Γευμάτων</h2>
  <table class="meal-table">
    <thead>
      <tr>
        <th>Ημέρα</th>
        <th>Πρωινό</th>
        <th>Μεσημεριανό</th>
        <th>Σνακ</th>
        <th>Βραδινό</th>
      </tr>
    </thead>
    <tbody>
      ${mealTableRowsHtml}
    </tbody>
  </table>

  <h2 class="section-title" style="page-break-before: auto;">2. Οργανωμένη Λίστα Αγορών Supermarket</h2>
  <div class="shopping-grid">
    ${shoppingListHtml}
  </div>

  ${surplusHtml}

  <div class="footer">
    <span>pioftina.gr &bull; Εκτυπώθηκε στις ${now.toLocaleTimeString("el-GR")}</span>
    <span>Σελίδα Προγράμματος & Καλαθιού</span>
  </div>
</body>
</html>`;
}

/**
 * Client-side file download helper using Blob and ObjectURL.
 */
export function downloadBlob(filename: string, content: string, mimeType: string = "text/plain;charset=utf-8") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a structured text file (.txt).
 */
export function downloadTextFile(filename: string, content: string) {
  downloadBlob(filename, content, "text/plain;charset=utf-8");
}

/**
 * Downloads a complete JSON backup file (.json).
 */
export function downloadJsonFile(filename: string, data: any) {
  downloadBlob(filename, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

/**
 * Opens a dedicated popup window and triggers print dialog for PDF/paper print.
 */
export function printPlanDocument(htmlContent: string) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (err) {
        console.error("Print error:", err);
      }
    }, 400);
  } else {
    // Fallback if popup is blocked
    window.print();
  }
}
