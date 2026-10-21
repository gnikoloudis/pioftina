import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { parseRawRecipeText, parseIngredientLine } from "@/lib/agent/recipe-collector";
import { auditEntireRecipe } from "@/lib/agent/quantity-auditor";
import { AgentParsedRecipe } from "@/types/recipe-agent";

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "el-GR,el;q=0.9,en-US;q=0.8,en;q=0.7",
  "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/**
 * Resilient fallback using system curl to bypass Cloudflare bot challenges (JA3/JA4)
 * that block Node.js undici TLS fingerprints.
 */
async function fetchWithCurlFallback(targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const curlBin = isWindows ? "curl.exe" : "curl";

    const args = [
      "-s",
      "-L",
      "--max-time",
      "15",
      "-H",
      `User-Agent: ${BROWSER_HEADERS["User-Agent"]}`,
      "-H",
      `Accept: ${BROWSER_HEADERS["Accept"]}`,
      "-H",
      `Accept-Language: ${BROWSER_HEADERS["Accept-Language"]}`,
      "-H",
      `Sec-Ch-Ua: ${BROWSER_HEADERS["Sec-Ch-Ua"]}`,
      "-H",
      `Sec-Ch-Ua-Mobile: ${BROWSER_HEADERS["Sec-Ch-Ua-Mobile"]}`,
      "-H",
      `Sec-Ch-Ua-Platform: ${BROWSER_HEADERS["Sec-Ch-Ua-Platform"]}`,
      "-H",
      `Sec-Fetch-Dest: ${BROWSER_HEADERS["Sec-Fetch-Dest"]}`,
      "-H",
      `Sec-Fetch-Mode: ${BROWSER_HEADERS["Sec-Fetch-Mode"]}`,
      "-H",
      `Sec-Fetch-Site: ${BROWSER_HEADERS["Sec-Fetch-Site"]}`,
      "-H",
      `Sec-Fetch-User: ${BROWSER_HEADERS["Sec-Fetch-User"]}`,
      "-H",
      `Upgrade-Insecure-Requests: ${BROWSER_HEADERS["Upgrade-Insecure-Requests"]}`,
      targetUrl,
    ];

    execFile(curlBin, args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout) => {
      if (error || !stdout || stdout.trim().length === 0) {
        return reject(error || new Error("Empty response from curl"));
      }
      resolve(stdout);
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "Παρακαλούμε εισάγετε έγκυρο σύνδεσμο (URL) συνταγής." },
        { status: 400 }
      );
    }

    // Basic SSRF protection
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.toLowerCase();
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "::1" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.startsWith("172.16.") ||
        host.endsWith(".local")
      ) {
        return NextResponse.json(
          { success: false, error: "Μη έγκυρη διεύθυνση URL (ιδιωτικό δίκτυο)." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Μη έγκυρη σύνταξη URL." },
        { status: 400 }
      );
    }

    // Multi-tier HTML fetching
    let html = "";
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        html = await res.text();
        // Check for Cloudflare challenge in HTML body
        if (
          html.includes("cf-mitigated") ||
          html.includes("challenges.cloudflare.com") ||
          html.includes("<title>Just a moment...</title>")
        ) {
          html = await fetchWithCurlFallback(url);
        }
      } else if (res.status === 403 || res.status === 503 || res.status === 429) {
        // Cloudflare / bot mitigation block - fallback to system curl
        html = await fetchWithCurlFallback(url);
      } else {
        throw new Error(`Αποτυχία ανάκτησης (${res.status} ${res.statusText})`);
      }
    } catch (fetchErr) {
      // Fallback to system curl
      try {
        html = await fetchWithCurlFallback(url);
      } catch (curlErr) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Αποτυχία ανάκτησης σελίδας. Ο ιστότοπος προστατεύεται από Cloudflare ή Captcha. Μπορείτε να αντιγράψετε και να επικολλήσετε τα υλικά στην καρτέλα 'Επικόλληση Κειμένου'.",
          },
          { status: 502 }
        );
      }
    }

    // 1. Check for Schema.org JSON-LD Recipe
    let structuredRecipe: AgentParsedRecipe | null = null;
    const jsonLdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        const items = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];

        for (const item of items) {
          const type = item["@type"];
          const isRecipe =
            type === "Recipe" || (Array.isArray(type) && type.includes("Recipe"));

          if (isRecipe) {
            const title = item.name || "Εισαγόμενη Συνταγή";
            const description = item.description || "";
            let servings = 4;
            if (item.recipeYield) {
              const y = Array.isArray(item.recipeYield)
                ? item.recipeYield[0]
                : item.recipeYield;
              const num = parseInt(String(y).match(/\d+/)?.[0] || "4", 10);
              if (num > 0) servings = num;
            }

            const rawIngredients: string[] = item.recipeIngredient || [];
            const instructions: string[] = [];

            if (Array.isArray(item.recipeInstructions)) {
              for (const inst of item.recipeInstructions) {
                if (typeof inst === "string") {
                  instructions.push(inst);
                } else if (inst?.text) {
                  instructions.push(inst.text);
                } else if (inst?.itemListElement) {
                  for (const step of inst.itemListElement) {
                    if (step?.text) instructions.push(step.text);
                  }
                }
              }
            }

            const imageUrl =
              typeof item.image === "string"
                ? item.image
                : Array.isArray(item.image)
                ? item.image[0]
                : item.image?.url;

            const ingredients = rawIngredients.map((raw, idx) =>
              parseIngredientLine(raw, idx, servings)
            );

            structuredRecipe = {
              title,
              description,
              servings,
              prepTimeMinutes: 20,
              cookTimeMinutes: 40,
              imageUrl,
              category: "traditional",
              instructions,
              rawIngredients,
              ingredients,
              sourceUrl: url,
              sourceType: "url",
            };
            break;
          }
        }
        if (structuredRecipe) break;
      } catch (e) {
        // Continue searching other JSON-LD blocks
      }
    }

    // 2. Next.js __NEXT_DATA__ payload parser fallback (e.g. akispetretzikis.com)
    if (!structuredRecipe) {
      const nextDataMatch = html.match(
        /<script\s+id=["']__NEXT_DATA__["']\s+type=["']application\/json["']>([\s\S]*?)<\/script>/i
      );
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          const rData =
            nextData?.props?.pageProps?.data?.recipe ||
            nextData?.props?.pageProps?.recipe ||
            nextData?.props?.pageProps?.initialState?.recipe;

          if (rData && (rData.title || rData.name)) {
            const title = rData.title || rData.name;
            const description = rData.description || rData.seo_description || "";
            const servings = parseInt(
              String(rData.yield || rData.servings || "4").match(/\d+/)?.[0] || "4",
              10
            );
            const prepTimeMinutes = parseInt(
              String(rData.prep_time || "20").match(/\d+/)?.[0] || "20",
              10
            );
            const cookTimeMinutes = parseInt(
              String(rData.cook_time || "40").match(/\d+/)?.[0] || "40",
              10
            );

            const rawIngredients: string[] = [];
            if (Array.isArray(rData.ingredients)) {
              for (const grp of rData.ingredients) {
                const items =
                  grp?.items || grp?.ingredients || (typeof grp === "string" ? [grp] : []);
                for (const item of items) {
                  if (typeof item === "string") {
                    rawIngredients.push(item);
                  } else if (item?.title || item?.name) {
                    const qty = item.quantity ? `${item.quantity} ` : "";
                    const u = item.unit ? `${item.unit} ` : "";
                    rawIngredients.push(`${qty}${u}${item.title || item.name}`.trim());
                  }
                }
              }
            }

            if (rawIngredients.length > 0) {
              const ingredients = rawIngredients.map((raw, idx) =>
                parseIngredientLine(raw, idx, servings)
              );
              structuredRecipe = {
                title,
                description,
                servings,
                prepTimeMinutes,
                cookTimeMinutes,
                imageUrl: rData.image?.url || rData.assets?.[0]?.url,
                category: "traditional",
                instructions: Array.isArray(rData.instructions) ? rData.instructions : [],
                rawIngredients,
                ingredients,
                sourceUrl: url,
                sourceType: "url",
              };
            }
          }
        } catch (e) {
          // Fall through
        }
      }
    }

    // 3. Fallback: Parse from page title and body text if no structured schema
    if (!structuredRecipe) {
      const titleMatch =
        html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : "Εισαγόμενη Συνταγή";

      // Strip HTML tags to extract readable text
      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, "\n")
        .replace(/&nbsp;/g, " ")
        .replace(/\n\s*\n/g, "\n");

      structuredRecipe = parseRawRecipeText(`${title}\n${cleanText.slice(0, 3000)}`);
      structuredRecipe.sourceUrl = url;
      structuredRecipe.sourceType = "url";
    }

    // Run quantity and proportion audit on the structured recipe
    const auditedRecipe = auditEntireRecipe(structuredRecipe);

    return NextResponse.json({
      success: true,
      recipe: auditedRecipe,
    });
  } catch (error) {
    console.error("Recipe import error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Παρουσιάστηκε σφάλμα κατά την ανάκτηση της συνταγής. Δοκιμάστε να επικολλήσετε το κείμενο της συνταγής.",
      },
      { status: 500 }
    );
  }
}
