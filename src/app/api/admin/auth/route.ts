import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  getAdminSecretKey,
  verifyAdminRequest,
} from "@/lib/security/admin-auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  return NextResponse.json({ success: true, isAdmin });
}

export async function POST(req: NextRequest) {
  // Throttling: max 10 login attempts per 5 minutes per IP
  const rateCheck = checkRateLimit(req, {
    limit: 10,
    windowMs: 5 * 60 * 1000,
    cooldownMs: 1000,
    prefix: "admin_login",
  });
  if (!rateCheck.allowed) {
    return createRateLimitResponse(rateCheck);
  }

  try {
    const body = await req.json();
    const password = body?.password?.trim() || "";

    const secretKey = getAdminSecretKey();

    if (!password || password !== secretKey) {
      return NextResponse.json(
        { success: false, error: "Λανθασμένος κωδικός διαχειριστή." },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      isAdmin: true,
      message: "Συνδεθήκατε επιτυχώς ως διαχειριστής.",
    });

    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Σφάλμα κατά τη σύνδεση." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    isAdmin: false,
    message: "Αποσυνδεθήκατε επιτυχώς.",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
