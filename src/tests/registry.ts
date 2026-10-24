import { TestSuite, TestCase, TestCategory } from "./core/types";
import { recipesSuite } from "./suites/recipes-suite";
import { optimizerSuite } from "./suites/optimizer-suite";
import { securitySuite } from "./suites/security-suite";
import { apiRoutesSuite } from "./suites/api-routes-suite";
import { posokaneiSuite } from "./suites/posokanei-suite";
import { customUserSuite } from "./suites/custom-user-tests";
import { exportSuite } from "./suites/export-suite";

const REGISTERED_SUITES: TestSuite[] = [
  recipesSuite,
  optimizerSuite,
  securitySuite,
  apiRoutesSuite,
  posokaneiSuite,
  exportSuite,
  customUserSuite,
];

/**
 * Returns all registered test suites in the application
 */
export function getAllSuites(): TestSuite[] {
  return [...REGISTERED_SUITES];
}

/**
 * Returns all individual test cases across all suites
 */
export function getAllTests(): TestCase[] {
  return REGISTERED_SUITES.flatMap((s) => s.tests);
}

/**
 * Allows the Antigravity agent or user plugins to register an additional test suite dynamically
 */
export function registerSuite(suite: TestSuite): void {
  const existingIdx = REGISTERED_SUITES.findIndex((s) => s.id === suite.id);
  if (existingIdx >= 0) {
    REGISTERED_SUITES[existingIdx] = suite;
  } else {
    REGISTERED_SUITES.push(suite);
  }
}

/**
 * Retrieves a suite by its category
 */
export function getSuitesByCategory(category: TestCategory): TestSuite[] {
  return REGISTERED_SUITES.filter((s) => s.category === category);
}
