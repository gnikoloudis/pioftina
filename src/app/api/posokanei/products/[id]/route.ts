import { NextResponse } from "next/server";
import { getProductById } from "@/lib/posokanei/client";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  }

  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product", details: String(error) },
      { status: 500 }
    );
  }
}
