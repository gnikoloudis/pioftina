import { NextRequest, NextResponse } from "next/server";
import { getBundles, saveBundle, deleteBundle } from "@/lib/bundles/bundle-service";
import { verifyAdminRequest } from "@/lib/security/admin-auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { BundleCategory, ProductBundle } from "@/types/bundles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as BundleCategory | null;
    const includeAll = searchParams.get("all") === "true";

    let includeUnpublished = false;
    if (includeAll) {
      includeUnpublished = await verifyAdminRequest(req);
    }

    const bundles = await getBundles(category || undefined, includeUnpublished);
    return NextResponse.json({ success: true, bundles });
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Admin authorization check
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Απαιτούνται δικαιώματα διαχειριστή για διαχείριση πακέτων." },
        { status: 401 }
      );
    }

    // 2. Rate limit check (20 req/min, 1s cooldown)
    const rateCheck = checkRateLimit(req, {
      limit: 20,
      windowMs: 60 * 1000,
      cooldownMs: 1000,
      prefix: "bundles_write",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

    const body = await req.json();
    const bundle: ProductBundle = body.bundle || body;

    if (!bundle || !bundle.id || !bundle.title || !bundle.category || !Array.isArray(bundle.items)) {
      return NextResponse.json(
        { success: false, error: "Μη έγκυρα στοιχεία πακέτου (απαιτούνται id, title, category, items)." },
        { status: 400 }
      );
    }

    const updatedBundles = await saveBundle(bundle);
    return NextResponse.json({ success: true, bundles: updatedBundles });
  } catch (error) {
    console.error("Failed to save bundle:", error);
    return NextResponse.json(
      { success: false, error: "Αποτυχία αποθήκευσης πακέτου." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Admin authorization check
    const isAdmin = await verifyAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Απαιτούνται δικαιώματα διαχειριστή για διαγραφή πακέτων." },
        { status: 401 }
      );
    }

    // 2. Rate limit check
    const rateCheck = checkRateLimit(req, {
      limit: 20,
      windowMs: 60 * 1000,
      cooldownMs: 1000,
      prefix: "bundles_delete",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Λείπει η παράμετρος id." },
        { status: 400 }
      );
    }

    const updatedBundles = await deleteBundle(id);
    return NextResponse.json({ success: true, bundles: updatedBundles });
  } catch (error) {
    console.error("Failed to delete bundle:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
