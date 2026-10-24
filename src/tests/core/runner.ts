import {
  TestCase,
  TestSuite,
  TestResult,
  TestReport,
  CategorySummary,
  TestCategory,
  TestContext,
} from "./types";
import { createTestContext } from "./context";

export interface RunOptions {
  category?: TestCategory | "all";
  tags?: string[];
  testId?: string;
  baseUrl?: string;
  environment?: "local" | "vercel" | "ci";
}

export function defineTest(test: TestCase): TestCase {
  return test;
}

export function defineSuite(suite: TestSuite): TestSuite {
  return suite;
}

const CATEGORY_NAMES: Record<TestCategory, string> = {
  recipes: "Συνταγές & Επιμέλεια Προϊόντων",
  optimizer: "Μηχανή Βελτιστοποίησης & Συσκευασίες",
  security: "Ασφάλεια, Rate Limiting & Admin Auth",
  api: "API Endpoints & HTTP Διαδρομές",
  posokanei: "Supermarkets & Posokanei Cache",
  newsletter: "Newsletter & Συνδρομητές",
  export: "Εξαγωγή & Αποθήκευση στον Υπολογιστή (Save to PC)",
  custom: "Προσαρμοσμένα Τεστ Χρήστη (Custom)",
};

/**
 * Runs a single test case safely with timing and error capturing
 */
export async function executeSingleTest(
  test: TestCase,
  context: TestContext
): Promise<TestResult> {
  const start = performance.now();
  try {
    await test.run(context);
    const durationMs = Math.round(performance.now() - start);
    return {
      id: test.id,
      title: test.title,
      category: test.category,
      severity: test.severity,
      passed: true,
      durationMs,
      description: test.description,
      documentation: test.documentation,
      tags: test.tags,
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    return {
      id: test.id,
      title: test.title,
      category: test.category,
      severity: test.severity,
      passed: false,
      durationMs,
      error: err?.message || String(err),
      stack: err?.stack,
      description: test.description,
      documentation: test.documentation,
      tags: test.tags,
    };
  }
}

/**
 * Runs all provided test suites and produces a structured TestReport
 */
export async function runTestEngine(
  suites: TestSuite[],
  options: RunOptions = {}
): Promise<TestReport> {
  const overallStart = performance.now();
  const context = createTestContext(options.baseUrl);

  // Filter tests based on options
  const targetCategory = options.category && options.category !== "all" ? options.category : null;
  const targetTags = options.tags && options.tags.length > 0 ? options.tags : null;
  const targetTestId = options.testId || null;

  const results: TestResult[] = [];
  const categoriesMap = new Map<TestCategory, CategorySummary>();

  for (const suite of suites) {
    for (const test of suite.tests) {
      if (targetCategory && test.category !== targetCategory) continue;
      if (targetTestId && test.id !== targetTestId) continue;
      if (
        targetTags &&
        !test.tags.some((t) => targetTags.includes(t))
      ) {
        continue;
      }

      const res = await executeSingleTest(test, context);
      results.push(res);

      // Track category stats
      const catKey = res.category;
      const existing = categoriesMap.get(catKey) || {
        category: catKey,
        name: CATEGORY_NAMES[catKey] || catKey,
        total: 0,
        passed: 0,
        failed: 0,
        durationMs: 0,
      };

      existing.total += 1;
      if (res.passed) existing.passed += 1;
      else existing.failed += 1;
      existing.durationMs += res.durationMs;
      categoriesMap.set(catKey, existing);
    }
  }

  const durationMs = Math.round(performance.now() - overallStart);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  const env =
    options.environment ||
    (process.env.VERCEL ? "vercel" : process.env.CI ? "ci" : "local");

  return {
    timestamp: new Date().toISOString(),
    environment: env,
    total: results.length,
    passed,
    failed,
    skipped: 0,
    durationMs,
    categories: Array.from(categoriesMap.values()),
    results,
  };
}
