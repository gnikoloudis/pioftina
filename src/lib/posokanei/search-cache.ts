import { ProductPage, ProductSearchQuery } from "./types";

interface CacheEntry {
  data: ProductPage;
  expiresAt: number;
}

// 60-minute TTL for search queries (supermarket prices do not fluctuate rapidly)
const DEFAULT_TTL_MS = 60 * 60 * 1000;

// In-memory cache map
const searchCache = new Map<string, CacheEntry>();

// In-flight request deduplication map
const pendingSearches = new Map<string, Promise<ProductPage>>();

/**
 * Normalizes Greek search terms by removing accents/diacritics and extra whitespace
 * Example: "Φέτα" -> "φετα", "Ελαιόλαδο" -> "ελαιολαδο"
 */
export function normalizeGreekTerm(term: string): string {
  if (!term) return "";
  return term
    .toLowerCase()
    .trim()
    .replace(/[άα]/g, "α")
    .replace(/[έε]/g, "ε")
    .replace(/[ήη]/g, "η")
    .replace(/[ίιϊΐ]/g, "ι")
    .replace(/[όο]/g, "ο")
    .replace(/[ύυϋΰ]/g, "υ")
    .replace(/[ώω]/g, "ω")
    .replace(/\s+/g, " ");
}

/**
 * Builds a deterministic, normalized cache key for search queries
 */
export function buildNormalizedCacheKey(params: ProductSearchQuery): string {
  const normTitle = normalizeGreekTerm(params.title || "");
  const cat = params.category_id || "";
  const cats = (params.category_ids || []).slice().sort().join(",");
  const page = params.page || 1;
  const size = params.page_size || 24;
  const sort = params.sort_by || "unit_price";
  const order = params.sort_order || "asc";
  return `norm_${normTitle}|cat_${cat}|cats_${cats}|p_${page}|s_${size}|sort_${sort}_${order}`;
}

export function getCachedSearch(key: string): ProductPage | null {
  const entry = searchCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    searchCache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedSearch(
  key: string,
  data: ProductPage,
  ttlMs = DEFAULT_TTL_MS
): void {
  searchCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });

  // Limit cache size to 2000 entries
  if (searchCache.size > 2000) {
    const oldestKey = searchCache.keys().next().value;
    if (oldestKey) searchCache.delete(oldestKey);
  }
}

export function getPendingSearch(key: string): Promise<ProductPage> | undefined {
  return pendingSearches.get(key);
}

export function setPendingSearch(
  key: string,
  promise: Promise<ProductPage>
): void {
  pendingSearches.set(key, promise);
  promise.finally(() => {
    pendingSearches.delete(key);
  });
}
