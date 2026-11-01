import { TestContext } from "./types";
import {
  assert,
  assertEquals,
  assertApproxEquals,
  assertInRange,
  assertContains,
} from "./assertions";
import { createAdminToken } from "@/lib/security/admin-auth";
import {
  dispatchInProcessRequest,
  isLocalhostUrl,
} from "./in-process-dispatcher";

/**
 * Creates an execution context for running tests either locally or against a deployed server (Vercel)
 */
export function createTestContext(baseUrlOverride?: string): TestContext {
  const defaultHost =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  const baseUrl = baseUrlOverride || defaultHost;
  const adminToken = createAdminToken();

  const fetchApi = async (path: string, init?: RequestInit): Promise<Response> => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${baseUrl}${cleanPath}`;

    const headers = new Headers(init?.headers);
    if (!headers.has("Content-Type") && init?.method && init.method !== "GET") {
      headers.set("Content-Type", "application/json");
    }

    try {
      return await fetch(url, {
        ...init,
        headers,
      });
    } catch (err) {
      if (isLocalhostUrl(url)) {
        return dispatchInProcessRequest(url, {
          ...init,
          headers,
        });
      }
      throw err;
    }
  };

  return {
    baseUrl,
    adminToken,
    fetchApi,
    assert,
    assertEquals,
    assertApproxEquals,
    assertInRange,
    assertContains,
  };
}
