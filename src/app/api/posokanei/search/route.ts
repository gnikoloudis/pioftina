import { NextResponse } from "next/server";
import { searchProducts, getFallbackSearchResults } from "@/lib/posokanei/client";
import { ProductSearchQuery } from "@/lib/posokanei/types";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import {
  getCachedSearch,
  setCachedSearch,
  getPendingSearch,
  setPendingSearch,
  buildNormalizedCacheKey,
} from "@/lib/posokanei/search-cache";

async function executeSearchLogic(body: ProductSearchQuery, request: Request) {
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json(
      { error: "Query 'title' is required" },
      { status: 400 }
    );
  }

  const cacheKey = buildNormalizedCacheKey(body);

  // 1. Check in-memory search cache FIRST (0ms, 0 upstream cost, no rate limit penalty)
  const cached = getCachedSearch(cacheKey);
  if (cached) {
    if (body.retailer && cached.products) {
      const sorted = [...cached.products].sort((a, b) => {
        const aHas = a.retailers.includes(body.retailer!);
        const bHas = b.retailers.includes(body.retailer!);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return 0;
      });
      return NextResponse.json({ ...cached, products: sorted });
    }
    return NextResponse.json(cached);
  }

  // 2. Deduplicate in-flight pending searches
  let searchPromise = getPendingSearch(cacheKey);
  if (searchPromise) {
    const result = await searchPromise;
    return NextResponse.json(result);
  }

  // 3. Rate limiting per client for newly initiated searches (max 60 req/min, 0ms cooldown)
  const rateCheck = checkRateLimit(request, {
    limit: 60,
    windowMs: 60 * 1000,
    cooldownMs: 0,
    prefix: "search",
  });

  if (!rateCheck.allowed) {
    // Return verified local fallback gracefully with 200 OK so client console and UI never fail
    const fallback = getFallbackSearchResults(body.title, body);
    const retryAfter = rateCheck.retryAfterSeconds || Math.ceil(rateCheck.resetMs / 1000) || 1;
    return NextResponse.json(
      { ...fallback, rateLimited: true },
      {
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": rateCheck.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(Date.now() + rateCheck.resetMs).toUTCString(),
        },
      }
    );
  }

  // 4. Execute search with upstream governor protection
  searchPromise = searchProducts({
    title: body.title,
    category_id: body.category_id,
    category_ids: body.category_ids,
    page: body.page || 1,
    page_size: body.page_size || 24,
    sort_by: body.sort_by || "unit_price",
    sort_order: body.sort_order || "asc",
  });
  setPendingSearch(cacheKey, searchPromise);

  const result = await searchPromise;
  setCachedSearch(cacheKey, result);

  // If a specific retailer was requested, optionally rank matching items
  if (body.retailer && result.products) {
    result.products.sort((a, b) => {
      const aHas = a.retailers.includes(body.retailer!);
      const bHas = b.retailers.includes(body.retailer!);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body: ProductSearchQuery = await request.json();
    return await executeSearchLogic(body, request);
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("title");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Query 'q' or 'title' is required" },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const pageSize = parseInt(searchParams.get("page_size") || "24", 10) || 24;
    const categoryId = searchParams.get("category_id") || undefined;
    const retailer = searchParams.get("retailer") || undefined;
    const sortBy = (searchParams.get("sort_by") as any) || "unit_price";
    const sortOrder = (searchParams.get("sort_order") as any) || "asc";

    const searchQuery: ProductSearchQuery = {
      title: query.trim(),
      page,
      page_size: pageSize,
      category_id: categoryId,
      retailer,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    return await executeSearchLogic(searchQuery, request);
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: 500 }
    );
  }
}
