import { NextResponse } from "next/server";
import { getRetailers } from "@/lib/posokanei/client";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "GR";

  try {
    const retailers = await getRetailers(country);
    return NextResponse.json({ retailers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch retailers", details: String(error) },
      { status: 500 }
    );
  }
}
