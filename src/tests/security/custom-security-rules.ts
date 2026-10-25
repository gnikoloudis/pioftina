import { defineSecurityRule, SecurityRule } from "./types";

/**
 * ============================================================================
 * 🛡️ ΠΡΟΣΑΡΜΟΣΜΕΝΟΙ ΚΑΝΟΝΕΣ ΑΣΦΑΛΕΙΑΣ ΧΡΗΣΤΗ (CUSTOM SECURITY RULES)
 * ============================================================================
 *
 * Εδώ μπορείτε να προσθέσετε τους δικούς σας ελέγχους ασφαλείας και penetration testing.
 * Κάθε κανόνας αναγνωρίζεται αυτόματα τόσο από το CLI (`npm run pentest`),
 * όσο και από το Web UI (`/admin/tests` -> Security & Pentest Audit) και το Vercel API.
 *
 * Οδηγίες Προσθήκης:
 * 1. Αντιγράψτε το παρακάτω πρότυπο `defineSecurityRule({ ... })`.
 * 2. Ορίστε μοναδικό `id` (π.χ. "SEC-CUST-001"), τίτλο, κατηγορία OWASP και επίπεδο σοβαρότητας.
 * 3. Γράψτε τον έλεγχό σας στη συνάρτηση `execute`. Μπορείτε να χρησιμοποιήσετε:
 *    - `fetchApi(path, options)`: Εκτέλεση HTTP κλήσεων προς την εφαρμογή.
 *    - `assert(condition, message)`: Βασική βεβαίωση αλήθειας.
 *    - `assertEquals(actual, expected, message)`: Έλεγχος ισότητας τιμών.
 * 4. Τρέξτε `npm run pentest` για να δείτε τα αποτελέσματα!
 */

export const customSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-CUST-NEWSLETTER-LIMITS",
    title: "Προσαρμοσμένος Έλεγχος: Μέγιστο Μήκος Πεδίου Email (Buffer Overflow / DoS)",
    owaspCategory: "A03_INJECTION",
    cwe: "CWE-20",
    severity: "low",
    description: "Ελέγχει ότι υπερβολικά μακροσκελείς διευθύνσεις email (> 255 χαρακτήρες) απορρίπτονται από το endpoint του Newsletter.",
    threatImpact: "Αποτρέπει πιθανές καταναλώσεις μνήμης από τεράστια string payloads που στοχεύουν σε DoS ή ReDoS εκφράσεις.",
    remediation: "Εφαρμόστε έλεγχο email.length <= 255 πριν από την επεξεργασία της κανονικής έκφρασης.",
    tags: ["custom", "newsletter", "input-validation"],
    execute: async ({ fetchApi, assertEquals }) => {
      // Κατασκευή τεράστιου email string (> 255 χαρακτήρες)
      const oversizedEmail = "a".repeat(260) + "@example.com";

      const res = await fetchApi("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200)}`,
        },
        body: JSON.stringify({ email: oversizedEmail }),
      });

      assertEquals(res.status, 400, "Υπερμεγέθες email (> 255 χαρακτήρες) πρέπει να απορρίπτεται με 400");
      return {
        evidence: `Oversized email rejected: length=${oversizedEmail.length} chars (HTTP ${res.status})`,
        details: "Το μέγιστο όριο μήκους εισαγωγής επιβάλλεται ορθά.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-CUST-FORM-AUTOFILL-ATTRIBUTES",
    title: "Προσαρμοσμένος Έλεγχος: Αναγνωριστικά Autofill (id, name) & Όριο 255 Χαρακτήρων",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-1021",
    severity: "low",
    description: "Επαληθεύει ότι όλα τα πεδία εισαγωγής φορμών διαθέτουν αναγνωριστικά id και name για τη λειτουργία browser autofill, καθώς και όριο μήκους 255 χαρακτήρων.",
    threatImpact: "Φόρμες χωρίς id/name αποτρέπουν τη σωστή αυτόματη συμπλήρωση από τον browser, ενώ η απουσία ορίου χαρακτήρων εκθέτει σε DoS / client crash.",
    remediation: "Ορίστε μοναδικό id, name='email', autoComplete='email' και maxLength={255} στο form field.",
    tags: ["custom", "autofill", "form-fields", "minor-finding", "owasp-a05"],
    execute: async ({ assert }) => {
      const fs = await import("fs/promises");
      const path = await import("path");
      const componentPath = path.join(process.cwd(), "src", "components", "newsletter", "newsletter-card.tsx");
      const content = await fs.readFile(componentPath, "utf-8");

      assert(content.includes('id="newsletter-email-input"'), "Το πεδίο πρέπει να έχει id attribute (id='newsletter-email-input')");
      assert(content.includes('name="email"'), "Το πεδίο πρέπει να έχει name attribute (name='email')");
      assert(content.includes('autoComplete="email"'), "Το πεδίο πρέπει να υποστηρίζει browser autofill (autoComplete='email')");
      assert(content.includes("maxLength={255}"), "Το πεδίο πρέπει να έχει maxLength={255}");

      return {
        status: "pass",
        evidence: 'Validated form attributes: id="newsletter-email-input", name="email", autoComplete="email", maxLength={255}',
        details: "Όλα τα κρίσιμα πεδία της φόρμας διαθέτουν ορθά αναγνωριστικά autofill και έλεγχο ορίου 255 χαρακτήρων.",
      };
    },
  }),
];
