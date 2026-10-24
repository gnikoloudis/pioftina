import {
  SecurityRule,
  SecurityCheckResult,
  SecurityAuditReport,
  SecurityContext,
  OwaspCategory,
  OWASP_CATEGORIES_META,
  SecuritySeverity,
  SecurityCategoryStats,
} from "./types";
import { getAllSecurityRules } from "./registry";

export interface ScanOptions {
  rules?: SecurityRule[];
  category?: OwaspCategory;
  severity?: SecuritySeverity;
  ruleId?: string;
  baseUrl?: string;
  environment?: "local" | "vercel";
}

/**
 * Creates the execution context for security rules
 */
export function createSecurityContext(baseUrl: string): SecurityContext {
  const normalizedBase = baseUrl.replace(/\/$/, "");

  const fetchApi = async (pathOrUrl: string, init?: RequestInit): Promise<Response> => {
    const targetUrl = pathOrUrl.startsWith("http")
      ? pathOrUrl
      : `${normalizedBase}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

    return fetch(targetUrl, init);
  };

  const assert = (condition: boolean, message: string) => {
    if (!condition) {
      throw new Error(message);
    }
  };

  const assertEquals = <T>(actual: T, expected: T, message: string) => {
    if (actual !== expected) {
      throw new Error(`${message} (Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)})`);
    }
  };

  return {
    baseUrl: normalizedBase,
    fetchApi,
    assert,
    assertEquals,
  };
}

/**
 * Main scanner function: executes rules, evaluates evidence and computes security score
 */
export async function runSecurityAudit(options: ScanOptions = {}): Promise<SecurityAuditReport> {
  const startTime = Date.now();
  const environment = options.environment || (process.env.VERCEL ? "vercel" : "local");
  const baseUrl = options.baseUrl || process.env.TEST_BASE_URL || "http://localhost:3000";

  const context = createSecurityContext(baseUrl);

  // Filter rules
  let candidateRules = options.rules || getAllSecurityRules();

  if (options.ruleId) {
    candidateRules = candidateRules.filter((r) => r.id === options.ruleId);
  }
  if (options.category) {
    candidateRules = candidateRules.filter((r) => r.owaspCategory === options.category);
  }
  if (options.severity) {
    candidateRules = candidateRules.filter((r) => r.severity === options.severity);
  }

  const results: SecurityCheckResult[] = [];

  for (const rule of candidateRules) {
    const ruleStart = Date.now();
    try {
      const output = await rule.execute(context);
      const durationMs = Date.now() - ruleStart;

      results.push({
        ruleId: rule.id,
        title: rule.title,
        owaspCategory: rule.owaspCategory,
        cwe: rule.cwe,
        severity: rule.severity,
        status: output?.status || "pass",
        durationMs,
        description: rule.description,
        threatImpact: rule.threatImpact,
        remediation: rule.remediation,
        evidence: output?.evidence,
        details: output?.details,
      });
    } catch (err: any) {
      const durationMs = Date.now() - ruleStart;
      results.push({
        ruleId: rule.id,
        title: rule.title,
        owaspCategory: rule.owaspCategory,
        cwe: rule.cwe,
        severity: rule.severity,
        status: "fail",
        durationMs,
        description: rule.description,
        threatImpact: rule.threatImpact,
        remediation: rule.remediation,
        error: err?.message || String(err),
      });
    }
  }

  // Calculate statistics
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  let skipped = 0;
  let criticalIssues = 0;
  let highIssues = 0;

  // Initialize category summary
  const categoryStats: Record<OwaspCategory, SecurityCategoryStats> = {} as any;
  for (const cat of Object.keys(OWASP_CATEGORIES_META) as OwaspCategory[]) {
    categoryStats[cat] = {
      category: cat,
      code: OWASP_CATEGORIES_META[cat].code,
      name: OWASP_CATEGORIES_META[cat].name,
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      compliancePercent: 100,
    };
  }

  for (const res of results) {
    const cat = res.owaspCategory;
    if (categoryStats[cat]) {
      categoryStats[cat].total++;
    }

    if (res.status === "pass") {
      passed++;
      if (categoryStats[cat]) categoryStats[cat].passed++;
    } else if (res.status === "fail") {
      failed++;
      if (categoryStats[cat]) categoryStats[cat].failed++;
      if (res.severity === "critical") criticalIssues++;
      if (res.severity === "high") highIssues++;
    } else if (res.status === "warn") {
      warnings++;
      if (categoryStats[cat]) categoryStats[cat].warnings++;
    } else if (res.status === "skip") {
      skipped++;
    }
  }

  // Compute category compliance percentages
  for (const cat of Object.keys(categoryStats) as OwaspCategory[]) {
    const stat = categoryStats[cat];
    if (stat.total > 0) {
      stat.compliancePercent = Math.round((stat.passed / stat.total) * 100);
    }
  }

  // Calculate weighted security score (starts at 100)
  let penalty = 0;
  for (const res of results) {
    if (res.status === "fail") {
      if (res.severity === "critical") penalty += 25;
      else if (res.severity === "high") penalty += 15;
      else if (res.severity === "medium") penalty += 8;
      else if (res.severity === "low") penalty += 3;
    } else if (res.status === "warn") {
      penalty += 2;
    }
  }

  const securityScore = Math.max(0, Math.min(100, 100 - penalty));

  // Determine Letter Grade
  let grade: "A+" | "A" | "B" | "C" | "D" | "F" = "F";
  if (securityScore >= 95) grade = "A+";
  else if (securityScore >= 85) grade = "A";
  else if (securityScore >= 70) grade = "B";
  else if (securityScore >= 50) grade = "C";
  else if (securityScore >= 30) grade = "D";

  return {
    timestamp: new Date().toISOString(),
    environment,
    securityScore,
    grade,
    summary: {
      total: results.length,
      passed,
      failed,
      warnings,
      skipped,
      criticalIssues,
      highIssues,
      durationMs: Date.now() - startTime,
    },
    categoryStats,
    results,
  };
}
