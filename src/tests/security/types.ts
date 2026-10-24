export type OwaspCategory =
  | "A01_BROKEN_ACCESS_CONTROL"
  | "A02_CRYPTOGRAPHIC_FAILURES"
  | "A03_INJECTION"
  | "A04_INSECURE_DESIGN"
  | "A05_SECURITY_MISCONFIG"
  | "A07_AUTH_FAILURES"
  | "A10_SSRF";

export interface OwaspCategoryMeta {
  id: OwaspCategory;
  code: string;
  name: string;
  nameEn: string;
  description: string;
}

export const OWASP_CATEGORIES_META: Record<OwaspCategory, OwaspCategoryMeta> = {
  A01_BROKEN_ACCESS_CONTROL: {
    id: "A01_BROKEN_ACCESS_CONTROL",
    code: "A01:2021",
    name: "Παραβίαση Ελέγχου Πρόσβασης (Broken Access Control)",
    nameEn: "Broken Access Control",
    description: "Έλεγχος αποτροπής μη εξουσιοδοτημένης πρόσβασης σε προστατευμένα API και διαχειριστικές λειτουργίες.",
  },
  A02_CRYPTOGRAPHIC_FAILURES: {
    id: "A02_CRYPTOGRAPHIC_FAILURES",
    code: "A02:2021",
    name: "Κρυπτογραφικές Αστοχίες (Cryptographic Failures)",
    nameEn: "Cryptographic Failures",
    description: "Έλεγχος γνησιότητας ψηφιακών υπογραφών HMAC, προστασία από timing attacks και διαρροή μυστικών κλειδιών.",
  },
  A03_INJECTION: {
    id: "A03_INJECTION",
    code: "A03:2021",
    name: "Εισαγωγή Κακόβουλου Κώδικα (Injection & Input Validation)",
    nameEn: "Injection & Input Validation",
    description: "Έλεγχος sanitization εισαγωγών, απόρριψη XSS, SQLi και κακόμορφων payloads.",
  },
  A04_INSECURE_DESIGN: {
    id: "A04_INSECURE_DESIGN",
    code: "A04:2021",
    name: "Επισφαλής Σχεδιασμός & Προστασία DoS (Insecure Design & DoS)",
    nameEn: "Insecure Design & Denial of Service",
    description: "Ανθεκτικότητα σε εξάντληση πόρων, rate limiting, cooldowns και request deduplication.",
  },
  A05_SECURITY_MISCONFIG: {
    id: "A05_SECURITY_MISCONFIG",
    code: "A05:2021",
    name: "Εσφαλμένη Ρύθμιση Ασφαλείας (Security Misconfiguration)",
    nameEn: "Security Misconfiguration",
    description: "Επαλήθευση HTTP security headers (CSP, HSTS, X-Frame-Options), cookies και απουσία stack traces.",
  },
  A07_AUTH_FAILURES: {
    id: "A07_AUTH_FAILURES",
    code: "A07:2021",
    name: "Αστοχίες Ταυτοποίησης (Identification & Authentication Failures)",
    nameEn: "Identification & Authentication Failures",
    description: "Έλεγχος διαχείρισης συνεδριών admin, λήξης tokens και προστασίας από brute force.",
  },
  A10_SSRF: {
    id: "A10_SSRF",
    code: "A10:2021",
    name: "Server-Side Request Forgery (SSRF)",
    nameEn: "Server-Side Request Forgery",
    description: "Αποτροπή εκτέλεσης αιτημάτων σε εσωτερικά δίκτυα, localhost και cloud metadata IPs.",
  },
};

export type SecuritySeverity = "critical" | "high" | "medium" | "low" | "info";
export type SecurityCheckStatus = "pass" | "fail" | "warn" | "skip";

export interface SecurityContext {
  baseUrl: string;
  adminToken?: string;
  fetchApi: (pathOrUrl: string, init?: RequestInit) => Promise<Response>;
  assert: (condition: boolean, message: string) => void;
  assertEquals: <T>(actual: T, expected: T, message: string) => void;
}

export interface SecurityRule {
  id: string;
  title: string;
  owaspCategory: OwaspCategory;
  cwe: string;
  severity: SecuritySeverity;
  description: string;
  threatImpact: string;
  remediation: string;
  tags?: string[];
  execute: (ctx: SecurityContext) => Promise<void | {
    status?: SecurityCheckStatus;
    evidence?: string;
    details?: string;
  }>;
}

export interface SecurityCheckResult {
  ruleId: string;
  title: string;
  owaspCategory: OwaspCategory;
  cwe: string;
  severity: SecuritySeverity;
  status: SecurityCheckStatus;
  durationMs: number;
  description: string;
  threatImpact: string;
  remediation: string;
  evidence?: string;
  details?: string;
  error?: string;
}

export interface SecurityCategoryStats {
  category: OwaspCategory;
  code: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  compliancePercent: number;
}

export interface SecurityAuditReport {
  timestamp: string;
  environment: "local" | "vercel";
  securityScore: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
    criticalIssues: number;
    highIssues: number;
    durationMs: number;
  };
  categoryStats: Record<OwaspCategory, SecurityCategoryStats>;
  results: SecurityCheckResult[];
}

export function defineSecurityRule(rule: SecurityRule): SecurityRule {
  return rule;
}
