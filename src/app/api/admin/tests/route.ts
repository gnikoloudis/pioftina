import { NextRequest, NextResponse } from "next/server";
import { getAllSuites } from "@/tests/registry";
import { runTestEngine, RunOptions } from "@/tests/core/runner";
import { TestCategory } from "@/tests/core/types";
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
    const category = (url.searchParams.get("category") || undefined) as TestCategory | undefined;
    const tagsParam = url.searchParams.get("tags");
    const testId = url.searchParams.get("id") || undefined;

    const options: RunOptions = {
      category,
      tags: tagsParam ? tagsParam.split(",") : undefined,
      testId,
      baseUrl: url.origin,
      environment: process.env.VERCEL ? "vercel" : "local",
    };

    const suites = getAllSuites();
    const report = await runTestEngine(suites, options);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Test execution failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal error running test suite",
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

    const options: RunOptions = {
      category: body.category,
      tags: body.tags,
      testId: body.testId,
      baseUrl: url.origin,
      environment: process.env.VERCEL ? "vercel" : "local",
    };

    const suites = getAllSuites();
    const report = await runTestEngine(suites, options);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Execution error" },
      { status: 500 }
    );
  }
}
