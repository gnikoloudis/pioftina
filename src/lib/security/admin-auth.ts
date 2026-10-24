import { NextRequest } from "next/server";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "pioftina_admin_session";
const DEFAULT_ADMIN_SECRET = "admin2026";

/**
 * Returns the configured administrator secret key
 */
export function getAdminSecretKey(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_ADMIN_SECRET;
}

/**
 * Creates a signed admin token with timestamp
 */
export function createAdminToken(): string {
  const secret = getAdminSecretKey();
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", secret).update(`admin:${timestamp}`).digest("hex");
  return `${timestamp}:${hmac}`;
}

/**
 * Verifies if an admin token is valid and not expired (24-hour expiration)
 */
export function verifyAdminToken(token: string): boolean {
  if (!token || !token.includes(":")) return false;
  const [timestampStr, providedHmac] = token.split(":");
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // 24 hour session validity
  const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > MAX_SESSION_AGE_MS) return false;

  const secret = getAdminSecretKey();
  const expectedHmac = crypto.createHmac("sha256", secret).update(`admin:${timestampStr}`).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(providedHmac, "hex"), Buffer.from(expectedHmac, "hex"));
  } catch (_) {
    return false;
  }
}

/**
 * Verifies if an incoming NextRequest has valid admin authorization
 */
export async function verifyAdminRequest(req: NextRequest | Request): Promise<boolean> {
  // 1. Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === getAdminSecretKey() || verifyAdminToken(bearerToken)) {
      return true;
    }
  }

  // 2. Check Cookie in NextRequest or Request headers
  if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    const cookie = (req as NextRequest).cookies.get(ADMIN_COOKIE_NAME);
    if (cookie?.value && verifyAdminToken(cookie.value)) {
      return true;
    }
  }

  const rawCookieHeader = req.headers.get("cookie");
  if (rawCookieHeader) {
    const match = rawCookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match && match[1] && verifyAdminToken(decodeURIComponent(match[1]))) {
      return true;
    }
  }

  return false;
}
