import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { NewsletterSubscriber, NewsletterSubscribeRequest, NewsletterTopic } from "@/types/newsletter";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";

const DATA_FILE = path.join(process.cwd(), "src", "data", "newsletter-subscribers.json");

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

async function readSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

async function writeSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

export async function GET() {
  const subscribers = await readSubscribers();
  const activeCount = subscribers.filter((s) => s.status === "active").length;
  return NextResponse.json({ success: true, count: activeCount });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (max 5 submissions per 15 minutes per IP)
    const rateCheck = checkRateLimit(req, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      cooldownMs: 2000,
      prefix: "newsletter",
    });
    if (!rateCheck.allowed) {
      return createRateLimitResponse(rateCheck);
    }

    let body: NewsletterSubscribeRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Μη έγκυρη μορφή JSON (Malformed JSON payload)." },
        { status: 400 }
      );
    }

    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || rawEmail.length > 254 || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση email (μέγιστο 254 χαρακτήρες)." },
        { status: 400 }
      );
    }

    const subscribers = await readSubscribers();
    const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === rawEmail);

    const now = new Date().toISOString();
    const VALID_TOPICS: NewsletterTopic[] = ["deals", "recipes", "budget_tips"];
    const selectedTopics: NewsletterTopic[] =
      Array.isArray(body.topics) && body.topics.length > 0
        ? (body.topics.filter((t: any): t is NewsletterTopic => VALID_TOPICS.includes(t)) as NewsletterTopic[])
        : ["deals", "recipes", "budget_tips"];
    const source = body.source || "footer";

    let alreadySubscribed = false;

    if (existingIndex >= 0) {
      alreadySubscribed = true;
      subscribers[existingIndex] = {
        ...subscribers[existingIndex],
        topics: selectedTopics,
        status: "active",
        subscribedAt: now,
      };
    } else {
      const newSubscriber: NewsletterSubscriber = {
        id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        email: rawEmail,
        topics: selectedTopics,
        subscribedAt: now,
        source,
        status: "active",
        userAgent: req.headers.get("user-agent") || undefined,
      };
      subscribers.push(newSubscriber);
    }

    await writeSubscribers(subscribers);

    return NextResponse.json({
      success: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "Το email σας είναι ήδη καταχωρημένο στα νέα του pioftina.gr! Οι προτιμήσεις σας ενημερώθηκαν."
        : "Ευχαριστούμε για την εγγραφή σας! Θα λαμβάνετε τα νέα και τις προσφορές μας.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}
