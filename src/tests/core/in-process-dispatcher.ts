import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nextConfig from "../../../next.config";

import * as recipesRoute from "@/app/api/recipes/route";
import * as recipesImportRoute from "@/app/api/recipes/import/route";
import * as bundlesRoute from "@/app/api/bundles/route";
import * as newsletterSubscribeRoute from "@/app/api/newsletter/subscribe/route";
import * as posokaneiSearchRoute from "@/app/api/posokanei/search/route";
import * as posokaneiRetailersRoute from "@/app/api/posokanei/retailers/route";
import * as posokaneiProductByIdRoute from "@/app/api/posokanei/products/[id]/route";
import * as adminAuthRoute from "@/app/api/admin/auth/route";
import * as adminTestsRoute from "@/app/api/admin/tests/route";
import * as adminSecurityRoute from "@/app/api/admin/security/route";

const NEWSLETTER_DATA_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "newsletter-subscribers.json"
);

/**
 * Checks whether a target URL points to localhost / loopback.
 */
export function isLocalhostUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

/**
 * Reads security headers configured in next.config.ts and applies them to a Response.
 */
async function applyNextConfigHeaders(res: Response): Promise<Response> {
  const headers = new Headers(res.headers);

  if (typeof nextConfig.headers === "function") {
    const headerRules = await nextConfig.headers();
    for (const rule of headerRules) {
      for (const h of rule.headers) {
        if (!headers.has(h.key)) {
          headers.set(h.key, h.value);
        }
      }
    }
  }

  if (nextConfig.poweredByHeader === false) {
    headers.delete("x-powered-by");
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function methodNotAllowed(): Response {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed" },
    { status: 405 }
  );
}

/**
 * Executes an HTTP request in-process against the Next.js App Router handlers
 * when a live local dev/production server is not listening on localhost.
 */
export async function dispatchInProcessRequest(
  urlStr: string,
  init?: RequestInit
): Promise<Response> {
  const parsedUrl = new URL(urlStr);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
  const method = (init?.method || "GET").toUpperCase();

  const requestInit: RequestInit = {
    method,
    headers: init?.headers,
    body: method !== "GET" && method !== "HEAD" ? init?.body : undefined,
  };

  const nextReq = new NextRequest(parsedUrl.toString(), requestInit as any);
  let response: Response;

  if (pathname === "/") {
    response = new NextResponse("<!DOCTYPE html><html lang=\"el\"><head><title>pioftina.gr</title></head><body></body></html>", {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } else if (pathname === "/privacy") {
    if (method !== "GET" && method !== "HEAD") {
      response = methodNotAllowed();
    } else {
      const privacySourcePath = path.join(
        process.cwd(),
        "src",
        "app",
        "privacy",
        "page.tsx"
      );
      const sourceContent = await fs.readFile(privacySourcePath, "utf-8");
      response = new NextResponse(
        `<!DOCTYPE html><html lang="el"><body>${sourceContent}</body></html>`,
        {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        }
      );
    }
  } else if (pathname === "/api/recipes") {
    if (method === "GET") {
      response = await recipesRoute.GET();
    } else if (method === "POST") {
      response = await recipesRoute.POST(nextReq);
    } else if (method === "DELETE") {
      response = await recipesRoute.DELETE(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/recipes/import") {
    if (method === "POST") {
      response = await recipesImportRoute.POST(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/bundles") {
    if (method === "GET") {
      response = await bundlesRoute.GET(nextReq);
    } else if (method === "POST") {
      response = await bundlesRoute.POST(nextReq);
    } else if (method === "DELETE") {
      response = await bundlesRoute.DELETE(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/newsletter/subscribe") {
    if (method === "GET") {
      response = await newsletterSubscribeRoute.GET();
    } else if (method === "POST") {
      let snapshot: string | null = null;
      try {
        snapshot = await fs.readFile(NEWSLETTER_DATA_FILE, "utf-8");
      } catch {
        snapshot = null;
      }

      try {
        response = await newsletterSubscribeRoute.POST(nextReq);
      } finally {
        if (snapshot !== null) {
          try {
            await fs.writeFile(NEWSLETTER_DATA_FILE, snapshot, "utf-8");
          } catch {
            // ignore restore errors
          }
        }
      }
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/posokanei/search") {
    if (method === "GET") {
      response = await posokaneiSearchRoute.GET(nextReq);
    } else if (method === "POST") {
      response = await posokaneiSearchRoute.POST(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/posokanei/retailers") {
    if (method === "GET") {
      response = await posokaneiRetailersRoute.GET(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname.startsWith("/api/posokanei/products/")) {
    const id = pathname.slice("/api/posokanei/products/".length);
    if (method === "GET") {
      response = await posokaneiProductByIdRoute.GET(nextReq, {
        params: Promise.resolve({ id }),
      });
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/admin/auth") {
    if (method === "GET") {
      response = await adminAuthRoute.GET(nextReq);
    } else if (method === "POST") {
      response = await adminAuthRoute.POST(nextReq);
    } else if (method === "DELETE") {
      response = await adminAuthRoute.DELETE();
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/admin/tests") {
    if (method === "GET") {
      response = await adminTestsRoute.GET(nextReq);
    } else if (method === "POST") {
      response = await adminTestsRoute.POST(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else if (pathname === "/api/admin/security") {
    if (method === "GET") {
      response = await adminSecurityRoute.GET(nextReq);
    } else if (method === "POST") {
      response = await adminSecurityRoute.POST(nextReq);
    } else {
      response = methodNotAllowed();
    }
  } else {
    response = NextResponse.json(
      { success: false, error: "Not Found" },
      { status: 404 }
    );
  }

  return applyNextConfigHeaders(response);
}
