import { NextRequest, NextResponse } from "next/server";
import { runSecurityAudit, ScanOptions } from "@/tests/security/scanner";
import { OwaspCategory, SecuritySeverity } from "@/tests/security/types";
import { verifyAdminRequest } from "@/lib/security/admin-auth";

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Μη εξουσιοδοτημένη πρόσβαση. Απαιτούνται δικαιώματα διαχειριστή.",
      },
      { status: 401 }
    );
  }

  try {
    const url = new URL(req.url);
    const category = (url.searchParams.get("category") || undefined) as OwaspCategory | undefined;
    const severity = (url.searchParams.get("severity") || undefined) as SecuritySeverity | undefined;
    const ruleId = url.searchParams.get("ruleId") || url.searchParams.get("id") || undefined;

    const options: ScanOptions = {
      category,
      severity,
      ruleId,
      baseUrl: url.origin,
      environment: process.env.VERCEL ? "vercel" : "local",
    };

    const report = await runSecurityAudit(options);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Security audit execution failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal error running security audit",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Μη εξουσιοδοτημένη πρόσβαση. Απαιτούνται δικαιώματα διαχειριστή.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const url = new URL(req.url);

    const options: ScanOptions = {
      category: body.category,
      severity: body.severity,
      ruleId: body.ruleId,
      baseUrl: url.origin,
      environment: process.env.VERCEL ? "vercel" : "local",
    };

    const report = await runSecurityAudit(options);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Security audit execution failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal error running security audit",
      },
      { status: 500 }
    );
  }
}
