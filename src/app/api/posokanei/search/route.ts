import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/posokanei/client";
import { ProductSearchQuery } from "@/lib/posokanei/types";


export async function POST(request: Request) {
  try {
    const body: ProductSearchQuery = await request.json();

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Query 'title' is required" },
        { status: 400 }
      );
    }

    const result = await searchProducts({
      title: body.title,
      category_id: body.category_id,
      category_ids: body.category_ids,
      page: body.page || 1,
      page_size: body.page_size || 24,
      sort_by: body.sort_by || "unit_price",
      sort_order: body.sort_order || "asc",
    });

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
