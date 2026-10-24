import { defineSecurityRule, SecurityRule } from "../types";
import { getAdminSecretKey } from "@/lib/security/admin-auth";

export const dataLeakageSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-LEAK-STACK-TRACE",
    title: "Αποτροπή Διαρροής Stack Traces & Εσωτερικών Paths",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-209",
    severity: "high",
    description: "Ελέγχει ότι οι αποκρίσεις σφαλμάτων (4xx, 5xx) δεν εκθέτουν stack traces, ονόματα αρχείων του διακομιστή ή εσωτερικές διαδρομές Node.js.",
    threatImpact: "Η διαρροή stack traces αποκαλύπτει τη δομή φακέλων, εκδόσεις βιβλιοθηκών και εσωτερικά ονόματα συναρτήσεων, βοηθώντας τον επιτιθέμενο να σχεδιάσει στοχευμένες επιθέσεις.",
    remediation: "Αποκρύπτετε τα raw exception messages στην παραγωγή και επιστρέφετε γενικά, φιλικά μηνύματα σφάλματος.",
    tags: ["data-leakage", "stack-trace", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      // Κλήση με κακόμορφο σώμα
      const res = await fetchApi("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.95" },
        body: "invalid-json",
      });

      const text = await res.text();
      assert(
        !text.includes("node_modules") &&
        !text.includes("at Object.") &&
        !text.includes("at async") &&
        !text.includes("webpack-internal") &&
        !text.includes(".ts:"),
        "Η απόκριση σφάλματος δεν πρέπει να περιέχει ίχνη stack trace ή εσωτερικά paths"
      );

      return {
        evidence: `Error response length: ${text.length} chars (No stack trace detected)`,
        details: "Ο διακομιστής δεν διαρρέει ευαίσθητα εσωτερικά δεδομένα σφαλμάτων.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-LEAK-DEFAULT-SECRET",
    title: "Έλεγχος Προεπιλεγμένου Μυστικού Κλειδιού (Admin Secret Key)",
    owaspCategory: "A07_AUTH_FAILURES",
    cwe: "CWE-798",
    severity: "medium",
    description: "Ελέγχει αν έχει ρυθμιστεί προσαρμοσμένο ADMIN_SECRET_KEY στο περιβάλλον παραγωγής αντί για το προεπιλεγμένο αναπτυξιακό κλειδί.",
    threatImpact: "Αν μια εφαρμογή παραγωγής χρησιμοποιεί το γνωστό προεπιλεγμένο μυστικό κλειδί, οποιοσδήποτε μπορεί να συνδεθεί ως διαχειριστής.",
    remediation: "Ορίστε τη μεταβλητή περιβάλλοντος ADMIN_SECRET_KEY στο αρχείο .env.local ή στο Vercel Dashboard με έναν ισχυρό, τυχαίο κωδικό.",
    tags: ["secrets", "admin-key", "owasp-a07"],
    execute: async ({ assert }) => {
      const activeSecret = getAdminSecretKey();
      const isDefault = activeSecret === "admin2026";

      if (isDefault) {
        return {
          status: "warn",
          evidence: "Ενεργό κλειδί: admin2026 (Προεπιλογή Ανάπτυξης)",
          details: "Σε περιβάλλον παραγωγής (Production), συνιστάται θερμά ο ορισμός ADMIN_SECRET_KEY στο .env.local ή στο Vercel Dashboard.",
        };
      }

      return {
        status: "pass",
        evidence: "Προσαρμοσμένο μυστικό κλειδί είναι ρυθμισμένο.",
        details: "Η εφαρμογή δεν χρησιμοποιεί το προεπιλεγμένο αναπτυξιακό κλειδί.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-LEAK-CLIENT-SECRETS",
    title: "Αποτροπή Διαρροής Μυστικών στα Δημόσια Endpoints",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-200",
    severity: "critical",
    description: "Επαληθεύει ότι οι δημόσιες αποκρίσεις καταλόγου (GET /api/recipes) δεν εκθέτουν μυστικά κλειδιά, admin tokens ή διαχειριστικά hashes.",
    threatImpact: "Διαρροή κλειδιών σε δημόσια JSON payloads οδηγεί σε άμεση παραβίαση του συστήματος.",
    remediation: "Αφαιρείτε πάντα ευαίσθητα πεδία πριν από τη σειριοποίηση δεδομένων προς τους πελάτες.",
    tags: ["data-leakage", "public-api", "owasp-a01"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/api/recipes");
      const text = await res.text();
      const secret = getAdminSecretKey();

      assert(
        !text.includes(secret),
        "Το δημόσιο endpoint συνταγών δεν επιτρέπεται να περιέχει το ADMIN_SECRET_KEY"
      );
      assert(
        !text.includes("pioftina_admin_session"),
        "Το δημόσιο endpoint δεν επιτρέπεται να εκθέτει session cookies"
      );

      return {
        evidence: "Δεν ανιχνεύθηκαν διαχειριστικά μυστικά στο δημόσιο JSON απόκρισης.",
        details: "Τα δεδομένα που σερβίρονται στους επισκέπτες είναι πλήρως απολυμασμένα.",
      };
    },
  }),
];
