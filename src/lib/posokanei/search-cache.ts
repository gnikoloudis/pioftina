import { ProductPage } from "./types";

interface CacheEntry {
  data: ProductPage;
  expiresAt: number;
}

// 10-minute TTL for search queries
const DEFAULT_TTL_MS = 10 * 60 * 1000;

// In-memory cache map
const searchCache = new Map<string, CacheEntry>();

// In-flight request deduplication map
const pendingSearches = new Map<string, Promise<ProductPage>>();

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

  // Limit cache size to 1000 entries
  if (searchCache.size > 1000) {
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
