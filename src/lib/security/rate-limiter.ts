import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number; // Maximum requests allowed in the time window
  windowMs: number; // Time window in milliseconds
  cooldownMs?: number; // Minimum gap in ms required between consecutive requests
  prefix?: string; // Prefix for distinguishing routes/action types
}

interface ClientRecord {
  timestamps: number[];
  lastRequestTime: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
  error?: string;
}

// In-memory store with periodic cleanup to prevent memory leaks
const clientStore = new Map<string, ClientRecord>();

// Clean expired records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of clientStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length === 0 && now - record.lastRequestTime > windowMs) {
      clientStore.delete(key);
    }
  }
}

/**
 * Extracts a unique client identifier from request headers (IP or custom client token)
 */
export function getClientIdentifier(req: NextRequest | Request | string): string {
  if (typeof req === "string") return req;
  const headers = req?.headers;
  if (!headers || typeof headers.get !== "function") return "127.0.0.1";

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  // Check optional client token header/cookie
  const clientToken = headers.get("x-client-id");
  if (clientToken && clientToken.trim()) return clientToken.trim();

  return "127.0.0.1";
}

/**
 * Checks rate limits and request cooldowns for a client
 */
export function checkRateLimit(
  req: NextRequest | Request | string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  purgeExpiredRecords(config.windowMs);

  const clientId = getClientIdentifier(req);
  const key = `${config.prefix || "global"}:${clientId}`;

  let record = clientStore.get(key);
  if (!record) {
    record = { timestamps: [], lastRequestTime: 0 };
    clientStore.set(key, record);
  }

  // 1. Check cooldown (minimum time gap between requests)
  if (config.cooldownMs && record.lastRequestTime > 0) {
    const elapsedSinceLast = now - record.lastRequestTime;
    if (elapsedSinceLast < config.cooldownMs) {
      const waitSeconds = Math.ceil((config.cooldownMs - elapsedSinceLast) / 1000);
      return {
        allowed: false,
        limit: config.limit,
        remaining: 0,
        resetMs: config.cooldownMs - elapsedSinceLast,
        retryAfterSeconds: Math.max(1, waitSeconds),
        error: `Παρακαλώ περιμένετε ${Math.max(1, waitSeconds)} δευτερόλεπτα πριν την επόμενη ενέργεια.`,
      };
    }
  }

  // 2. Sliding window check
  record.timestamps = record.timestamps.filter((ts) => now - ts < config.windowMs);

  if (record.timestamps.length >= config.limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = config.windowMs - (now - oldestTimestamp);
    const retryAfterSeconds = Math.max(1, Math.ceil(resetMs / 1000));

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetMs,
      retryAfterSeconds,
      error: `Υπερβήκατε το επιτρεπόμενο όριο (${config.limit} αιτήματα). Δοκιμάστε ξανά σε ${retryAfterSeconds} δευτερόλεπτα.`,
    };
  }

  // Record allowed request
  record.timestamps.push(now);
  record.lastRequestTime = now;

  return {
    allowed: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - record.timestamps.length),
    resetMs: config.windowMs,
    retryAfterSeconds: 0,
  };
}

/**
 * Creates standard HTTP 429 response if rate limit is exceeded
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: result.error || "Πάρα πολλά αιτήματα. Παρακαλώ περιμένετε.",
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": result.retryAfterSeconds.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetMs.toString(),
      },
    }
  );
}
