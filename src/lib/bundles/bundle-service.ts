import { ProductBundle, BundleCategory, BundleStorePrice } from "@/types/bundles";
import { SEED_BUNDLES } from "@/lib/bundles/seed-bundles";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";
import { readJsonDataFile, writeJsonDataFile } from "@/lib/storage/json-store";

const DATA_FILENAME = "bundles.json";

const TRACKED_RETAILERS = [
  { id: "sklavenitis", name: "Σκλαβενίτης" },
  { id: "ab_vasilopoulos", name: "ΑΒ Βασιλόπουλος" },
  { id: "lidl", name: "Lidl" },
  { id: "mymarket", name: "My Market" },
  { id: "masoutis", name: "Μασούτης" },
];

/**
 * Calculates store comparison prices for a given bundle based on current Posokanei mock data.
 */
export function calculateBundlePricing(bundle: ProductBundle): ProductBundle {
  const storePrices: BundleStorePrice[] = TRACKED_RETAILERS.map((retailer) => {
    let total = 0;
    let unavailableCount = 0;
    const itemPrices: Record<string, number> = {};

    for (const item of bundle.items) {
      // 1. Try finding price from curatedProduct retailer_prices
      let price: number | undefined;
      if (item.curatedProduct?.retailer_prices) {
        const rp = item.curatedProduct.retailer_prices.find((r) => r.retailer === retailer.id);
        if (rp && rp.price > 0) {
          price = rp.price;
        }
      }

      // 2. Try finding product in MOCK_FALLBACK_PRODUCTS by productId or posokaneiQuery
      if (price === undefined && item.productId) {
        const prod = MOCK_FALLBACK_PRODUCTS.find((p) => p.id === item.productId);
        if (prod?.retailer_prices) {
          const rp = prod.retailer_prices.find((r) => r.retailer === retailer.id);
          if (rp && rp.price > 0) {
            price = rp.price;
          }
        }
      }

      // 3. Fallback: match by name or query substring in MOCK_FALLBACK_PRODUCTS
      if (price === undefined && item.posokaneiQuery) {
        const q = item.posokaneiQuery.toLowerCase();
        const prod = MOCK_FALLBACK_PRODUCTS.find((p) => p.name.toLowerCase().includes(q));
        if (prod?.retailer_prices) {
          const rp = prod.retailer_prices.find((r) => r.retailer === retailer.id);
          if (rp && rp.price > 0) {
            price = rp.price;
          }
        }
      }

      const itemQty = Math.max(1, item.quantity || 1);

      if (price !== undefined) {
        const linePrice = Math.round(price * itemQty * 100) / 100;
        itemPrices[item.id] = linePrice;
        total += linePrice;
      } else {
        // Fallback to reference price if retailer does not carry this exact SKU
        const fallbackLine = Math.round((item.referencePriceEur || 3.5) * itemQty * 100) / 100;
        itemPrices[item.id] = fallbackLine;
        total += fallbackLine;
        unavailableCount++;
      }
    }

    return {
      retailerId: retailer.id,
      retailerName: retailer.name,
      totalPrice: Math.round(total * 100) / 100,
      isAvailable: unavailableCount <= Math.ceil(bundle.items.length * 0.4),
      unavailableCount,
      itemPrices,
    };
  });

  // Determine lowest price store among stores with good availability
  const availableStores = storePrices.filter((s) => s.isAvailable);
  const eligibleStores = availableStores.length > 0 ? availableStores : storePrices;
  const bestStore = [...eligibleStores].sort((a, b) => a.totalPrice - b.totalPrice)[0] || storePrices[0];

  // Calculate estimated total and savings vs highest or average store price
  const allTotals = storePrices.map((s) => s.totalPrice);
  const avgPrice = allTotals.reduce((a, b) => a + b, 0) / (allTotals.length || 1);
  const savings = Math.max(0, Math.round((avgPrice - bestStore.totalPrice) * 100) / 100);

  return {
    ...bundle,
    estimatedTotalEur: bestStore ? bestStore.totalPrice : bundle.estimatedTotalEur,
    estimatedSavingsEur: savings > 0 ? savings : bundle.estimatedSavingsEur,
    bestStoreId: bestStore ? bestStore.retailerId : "sklavenitis",
    bestStoreName: bestStore ? bestStore.retailerName : "Σκλαβενίτης",
    storePrices,
  };
}

/**
 * Reads all bundles from JSON file, initializing with SEED_BUNDLES if needed.
 */
export async function readAllBundles(): Promise<ProductBundle[]> {
  const parsed = await readJsonDataFile<ProductBundle[]>(DATA_FILENAME, []);
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map(calculateBundlePricing);
  }

  return SEED_BUNDLES.map(calculateBundlePricing);
}

/**
 * Writes bundles to file safely across local and serverless environments.
 */
export async function writeAllBundles(bundles: ProductBundle[]): Promise<void> {
  await writeJsonDataFile(DATA_FILENAME, bundles);
}

/**
 * Retrieves bundles with optional filtering.
 */
export async function getBundles(
  category?: BundleCategory,
  includeUnpublished = false
): Promise<ProductBundle[]> {
  const all = await readAllBundles();
  return all.filter((b) => {
    if (!includeUnpublished && !b.isPublished) return false;
    if (category && b.category !== category) return false;
    return true;
  });
}

/**
 * Saves or updates a bundle.
 */
export async function saveBundle(bundle: ProductBundle): Promise<ProductBundle[]> {
  const current = await readAllBundles();
  const index = current.findIndex((b) => b.id === bundle.id);
  const now = new Date().toISOString();

  const prepared: ProductBundle = {
    ...bundle,
    updatedAt: now,
    createdAt: bundle.createdAt || now,
  };

  let updated: ProductBundle[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = prepared;
  } else {
    updated = [prepared, ...current];
  }

  await writeAllBundles(updated);
  return updated.map(calculateBundlePricing);
}

/**
 * Deletes a bundle by id.
 */
export async function deleteBundle(id: string): Promise<ProductBundle[]> {
  const current = await readAllBundles();
  const filtered = current.filter((b) => b.id !== id);
  await writeAllBundles(filtered);
  return filtered.map(calculateBundlePricing);
}
