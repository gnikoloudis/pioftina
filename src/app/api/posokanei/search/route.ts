import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/posokanei/client";
import { ProductSearchQuery } from "@/lib/posokanei/types";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import {
  getCachedSearch,
  setCachedSearch,
  getPendingSearch,
  setPendingSearch,
} from "@/lib/posokanei/search-cache";

export async function POST(request: Request) {
  try {
    // 1. Rate limiting per client (max 30 requests/min, 400ms cooldown)
    const rateCheck = checkRateLimit(request, {
      limit: 30,
      windowMs: 60 * 1000,
      cooldownMs: 400,
      prefix: "search",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

    const body: ProductSearchQuery = await request.json();

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Query 'title' is required" },
        { status: 400 }
      );
    }

    const cacheKey = JSON.stringify({
      title: body.title.trim().toLowerCase(),
      cat: body.category_id || "",
      cats: body.category_ids || [],
      page: body.page || 1,
      size: body.page_size || 24,
      sort: body.sort_by || "unit_price",
      order: body.sort_order || "asc",
    });

    // 2. Check in-memory search cache
    const cached = getCachedSearch(cacheKey);
    if (cached) {
      // If retailer ranking requested, apply
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

    // 3. Deduplicate in-flight pending searches
    let searchPromise = getPendingSearch(cacheKey);
    if (!searchPromise) {
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
    }

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
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: 500 }
    );
  }
}
