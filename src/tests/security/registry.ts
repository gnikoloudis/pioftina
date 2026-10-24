import { SecurityRule, OwaspCategory } from "./types";
import { headersSecurityRules } from "./rules/headers-rules";
import { authSecurityRules } from "./rules/auth-rules";
import { accessControlSecurityRules } from "./rules/access-control-rules";
import { ssrfSecurityRules } from "./rules/ssrf-rules";
import { injectionSecurityRules } from "./rules/injection-rules";
import { rateLimitSecurityRules } from "./rules/rate-limit-rules";
import { dataLeakageSecurityRules } from "./rules/data-leakage-rules";
import { customSecurityRules } from "./custom-security-rules";

/**
 * Aggregates all standard and custom security rules
 */
export function getAllSecurityRules(): SecurityRule[] {
  return [
    ...headersSecurityRules,
    ...authSecurityRules,
    ...accessControlSecurityRules,
    ...ssrfSecurityRules,
    ...injectionSecurityRules,
    ...rateLimitSecurityRules,
    ...dataLeakageSecurityRules,
    ...customSecurityRules,
  ];
}

/**
 * Finds a specific security rule by ID
 */
export function getSecurityRuleById(id: string): SecurityRule | undefined {
  return getAllSecurityRules().find((r) => r.id === id);
}

/**
 * Filters security rules by OWASP category
 */
export function getSecurityRulesByCategory(category: OwaspCategory): SecurityRule[] {
  return getAllSecurityRules().filter((r) => r.owaspCategory === category);
}

/**
 * Filters security rules by tag
 */
export function getSecurityRulesByTag(tag: string): SecurityRule[] {
  return getAllSecurityRules().filter((r) => r.tags?.includes(tag));
}
