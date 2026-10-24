export type TestCategory =
  | "recipes"
  | "optimizer"
  | "security"
  | "api"
  | "posokanei"
  | "newsletter"
  | "export"
  | "custom";

export type TestSeverity = "critical" | "high" | "medium" | "low";

export interface TestContext {
  baseUrl: string;
  adminToken: string;
  fetchApi: (path: string, init?: RequestInit) => Promise<Response>;
  assert: (condition: boolean, message: string) => void;
  assertEquals: <T>(actual: T, expected: T, message?: string) => void;
  assertApproxEquals: (actual: number, expected: number, tolerance?: number, message?: string) => void;
  assertInRange: (val: number, min: number, max: number, message?: string) => void;
  assertContains: (container: string | any[], item: any, message?: string) => void;
}

export interface TestCase {
  id: string;
  title: string;
  category: TestCategory;
  description: string;
  documentation: string;
  tags: string[];
  severity: TestSeverity;
  run: (context: TestContext) => Promise<void> | void;
}

export interface TestSuite {
  id: string;
  name: string;
  category: TestCategory;
  description: string;
  tests: TestCase[];
}

export interface TestResult {
  id: string;
  title: string;
  category: TestCategory;
  severity: TestSeverity;
  passed: boolean;
  durationMs: number;
  error?: string;
  stack?: string;
  description: string;
  documentation: string;
  tags: string[];
}

export interface CategorySummary {
  category: TestCategory;
  name: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
}

export interface TestReport {
  timestamp: string;
  environment: "local" | "vercel" | "ci";
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  categories: CategorySummary[];
  results: TestResult[];
}
