import React from "react";

export interface SupermarketBadgeProps {
  retailerId: string;
  retailerName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
}

const STORE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  sklavenitis: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-800 dark:text-amber-300 font-semibold",
    border: "border-amber-300 dark:border-amber-800",
    label: "Σκλαβενίτης",
  },
  ab_vasilopoulos: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-800 dark:text-blue-300 font-semibold",
    border: "border-blue-300 dark:border-blue-800",
    label: "ΑΒ Βασιλόπουλος",
  },
  lidl: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-blue-900 dark:text-yellow-300 font-bold",
    border: "border-blue-300 dark:border-yellow-700",
    label: "Lidl",
  },
  mymarket: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-800 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "My Market",
  },
  masoutis: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-800 dark:text-rose-300 font-semibold",
    border: "border-rose-300 dark:border-rose-800",
    label: "Μασούτης",
  },
  galaxias: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-800 dark:text-cyan-300 font-semibold",
    border: "border-cyan-300 dark:border-cyan-800",
    label: "Γαλαξίας",
  },
  kritikos: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-red-900 dark:text-red-300 font-semibold",
    border: "border-red-200 dark:border-red-900",
    label: "Κρητικός",
  },
  market_in: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-800 dark:text-orange-300 font-semibold",
    border: "border-orange-300 dark:border-orange-800",
    label: "Market In",
  },
  "market-in": {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-800 dark:text-orange-300 font-semibold",
    border: "border-orange-300 dark:border-orange-800",
    label: "Market In",
  },
  marketin: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-800 dark:text-orange-300 font-semibold",
    border: "border-orange-300 dark:border-orange-800",
    label: "Market In",
  },
  halkiadakis: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "Χαλκιαδάκης",
  },
  chalkiadakis: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "Χαλκιαδάκης",
  },
  xalkiadakis: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "Χαλκιαδάκης",
  },
  "χαλκιαδακης": {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "Χαλκιαδάκης",
  },
  "χαλκιαδάκης": {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300 font-semibold",
    border: "border-red-300 dark:border-red-800",
    label: "Χαλκιαδάκης",
  },
  bazaar: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-800 dark:text-amber-300 font-semibold",
    border: "border-amber-300 dark:border-amber-800",
    label: "Bazaar",
  },
  synka: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-300 font-semibold",
    border: "border-emerald-300 dark:border-emerald-800",
    label: "ΣΥΝ.ΚΑ",
  },
};

export function SupermarketBadge({
  retailerId,
  retailerName,
  className = "",
  size = "md",
}: SupermarketBadgeProps) {
  const normId = (retailerId || "").toLowerCase().trim();
  const store = STORE_STYLES[normId] || {
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-800 dark:text-zinc-200",
    border: "border-zinc-300 dark:border-zinc-700",
    label: retailerName || retailerId,
  };

  let displayLabel = retailerName || store.label;
  const lowerLabel = displayLabel.toLowerCase();
  if (
    lowerLabel === "market_in" ||
    lowerLabel === "market-in" ||
    lowerLabel === "marketin"
  ) {
    displayLabel = "Market In";
  } else if (
    lowerLabel === "halkiadakis" ||
    lowerLabel === "chalkiadakis" ||
    lowerLabel === "xalkiadakis" ||
    lowerLabel === "χαλκιαδακης" ||
    lowerLabel === "χαλκιαδάκης"
  ) {
    displayLabel = "Χαλκιαδάκης";
  }

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs rounded-md",
    md: "px-2.5 py-1 text-xs rounded-full",
    lg: "px-3 py-1.5 text-sm rounded-lg",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${store.bg} ${store.text} ${store.border} ${sizeClasses} shadow-xs transition-colors ${className}`}
      title={displayLabel}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      <span>{displayLabel}</span>
    </span>
  );
}
