import {
  Retailer,
  Product,
  ProductPage,
  ProductSearchQuery,
  CategoryNode,
} from "./types";
import { MOCK_RETAILERS, MOCK_FALLBACK_PRODUCTS } from "./mock-data";

const POSOKANEI_BASE_URL =
  process.env.POSOKANEI_API_URL?.replace(/\\$/, "") ||
  "https://api.posokanei.gov.gr";

const POSOKANEI_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Origin: "https://posokanei.gov.gr",
  Referer: "https://posokanei.gov.gr/",
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Platform": "flutter-web",
  "X-App-Version": "1.0.0",
};

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T, ttlMs = CACHE_TTL_MS): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Fetch retailers tracked by posokanei.gov.gr
 */
export async function getRetailers(country = "GR"): Promise<Retailer[]> {
  const cacheKey = `retailers_${country}`;
  const cached = getCached<Retailer[]>(cacheKey);
  if (cached) return cached;

  // If in browser, use serverless proxy to avoid CORS
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/posokanei/retailers?country=${country}`);
      if (res.ok) {
        const json = await res.json();
        const retailers: Retailer[] = json.retailers || [];
        if (retailers.length > 0) {
          setCached(cacheKey, retailers);
          return retailers;
        }
      }
    } catch (e) {
      console.warn("[Posokanei Client] Proxy fetch failed:", e);
    }
  }

  try {
    const res = await fetch(`${POSOKANEI_BASE_URL}/meta/retailers?countries=${country}`, {
      headers: POSOKANEI_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[Posokanei] /meta/retailers returned HTTP ${res.status}, falling back to mock`);
      return MOCK_RETAILERS;
    }

    const json = await res.json();
    const rawRetailers: Retailer[] = json.retailers || [];
    const filtered = rawRetailers.filter(
      (r) => country === "all" || r.country.toUpperCase() === country.toUpperCase()
    );

    // Map logo URLs to absolute URLs if relative
    const mapped = filtered.map((r) => ({
      ...r,
      logo_url: r.logo_url
        ? r.logo_url.startsWith("http")
          ? r.logo_url
          : `${POSOKANEI_BASE_URL}${r.logo_url}`
        : null,
    }));

    const result = mapped.length > 0 ? mapped : MOCK_RETAILERS;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error("[Posokanei] Error fetching retailers:", error);
    return MOCK_RETAILERS;
  }
}

/**
 * Search products by Greek title across supermarkets
 */
export async function searchProducts(
  params: ProductSearchQuery
): Promise<ProductPage> {
  const cleanTitle = (params.title || "").trim();
  const page = params.page || 1;
  const pageSize = params.page_size || 20;
  const categoryId = params.category_id || "";
  const cacheKey = `search_${cleanTitle}_${categoryId}_${page}_${pageSize}_${params.sort_by || ""}_${params.sort_order || ""}`;

  const cached = getCached<ProductPage>(cacheKey);
  if (cached) return cached;

  // If in browser, use serverless proxy to avoid CORS & 403 Forbidden
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/posokanei/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data: ProductPage = await res.json();
        if (data.products && data.products.length > 0) {
          setCached(cacheKey, data);
          return data;
        }
      }
    } catch (e) {
      console.warn(`[Posokanei Client] Proxy search for "${cleanTitle}" failed:`, e);
    }
  }

  try {
    const searchPayload: Record<string, unknown> = {
      title: cleanTitle,
      page,
      page_size: pageSize,
      sort_by: params.sort_by || "unit_price",
      sort_order: params.sort_order || "asc",
    };
    if (params.category_id) {
      searchPayload.category_id = params.category_id;
    }
    if (params.category_ids && params.category_ids.length > 0) {
      searchPayload.category_ids = params.category_ids;
    }

    const res = await fetch(`${POSOKANEI_BASE_URL}/products/search`, {
      method: "POST",
      headers: POSOKANEI_HEADERS,
      body: JSON.stringify(searchPayload),
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.warn(`[Posokanei] Search for "${cleanTitle}" failed with HTTP ${res.status}`);
      return getFallbackSearchResults(cleanTitle, params);
    }

    const data: ProductPage = await res.json();
    
    // Ensure product image_url is absolute
    if (data.products) {
      data.products = data.products.map((p) => ({
        ...p,
        image_url: p.image_url
          ? p.image_url.startsWith("http")
            ? p.image_url
            : `${POSOKANEI_BASE_URL}${p.image_url}`
          : null,
      }));
    }

    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`[Posokanei] Error searching "${cleanTitle}":`, error);
    return getFallbackSearchResults(cleanTitle, params);
  }
}

/**
 * Get product detail by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const cacheKey = `product_${id}`;
  const cached = getCached<Product>(cacheKey);
  if (cached) return cached;

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/posokanei/products/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.product) {
          setCached(cacheKey, json.product);
          return json.product;
        }
      }
    } catch (e) {
      console.warn(`[Posokanei Client] Proxy fetch for product ${id} failed:`, e);
    }
  }

  try {
    const res = await fetch(
      `${POSOKANEI_BASE_URL}/products/${id}?countries=GR&include_tax=true&include_history=true`,
      {
        headers: POSOKANEI_HEADERS,
        next: { revalidate: 1800 },
      }
    );

    if (!res.ok) {
      const fallback = MOCK_FALLBACK_PRODUCTS.find((p) => p.id === id);
      return fallback || null;
    }

    const product: Product = await res.json();
    if (product.image_url && !product.image_url.startsWith("http")) {
      product.image_url = `${POSOKANEI_BASE_URL}${product.image_url}`;
    }

    setCached(cacheKey, product);
    return product;
  } catch (error) {
    console.error(`[Posokanei] Error getting product ${id}:`, error);
    return MOCK_FALLBACK_PRODUCTS.find((p) => p.id === id) || null;
  }
}

/**
 * Get category tree
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const cacheKey = "category_tree";
  const cached = getCached<CategoryNode[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${POSOKANEI_BASE_URL}/meta/categories/tree?include_counts=true&include_hidden=false`,
      {
        headers: POSOKANEI_HEADERS,
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    const tree: CategoryNode[] = json.tree || [];
    setCached(cacheKey, tree);
    return tree;
  } catch (error) {
    console.error("[Posokanei] Error getting category tree:", error);
    return [];
  }
}

function getFallbackSearchResults(
  query: string,
  params: ProductSearchQuery
): ProductPage {
  const q = query.toLowerCase();
  const matched = MOCK_FALLBACK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  return {
    products: matched,
    total: matched.length,
    page: params.page || 1,
    page_size: params.page_size || 20,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };
}
