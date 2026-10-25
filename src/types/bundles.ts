import { Product } from "@/lib/posokanei/types";

export type BundleCategory = "cleaning" | "baby";
export type BundleCadence = "weekly" | "monthly" | "quarterly" | "starter";

export interface BundleItem {
  id: string;
  name: string;
  brand: string;
  categoryTag: string; // π.χ. "Απορρυπαντικό Ρούχων", "Πάνες No 4"
  quantity: number;
  unitLabel: string; // π.χ. "70 μεζούρες", "136 πάνες", "1.5L"
  posokaneiQuery: string;
  referencePriceEur: number;
  productId?: string;
  curatedProduct?: Product;
  notes?: string;
}

export interface BundleStorePrice {
  retailerId: string;
  retailerName: string;
  totalPrice: number;
  isAvailable: boolean;
  unavailableCount: number;
  itemPrices: Record<string, number>; // itemId -> price
}

export interface ProductBundle {
  id: string;
  category: BundleCategory;
  title: string;
  slug: string;
  description: string;
  badge: string; // π.χ. "Best Value", "Μηνιαίο Πακέτο", "Mega Saver"
  icon: string; // "🧼" | "👶"
  cadence: BundleCadence;
  cadenceLabel: string;
  items: BundleItem[];
  estimatedTotalEur: number;
  estimatedSavingsEur: number;
  bestStoreId: string;
  bestStoreName: string;
  storePrices?: BundleStorePrice[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
