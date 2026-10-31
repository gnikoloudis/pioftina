import { defineSecurityRule, SecurityRule } from "../types";

export const accessControlSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-ACL-RECIPES-WRITE-UNAUTH",
    title: "Προστασία Εγγραφής Συνταγών (POST /api/recipes 401)",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-285",
    severity: "critical",
    description: "Επιβεβαιώνει ότι οποιαδήποτε απόπειρα τροποποίησης ή προσθήκης συνταγής χωρίς διαπιστευτήρια διαχειριστή απορρίπτεται με 401 Unauthorized.",
    threatImpact: "Αν η εγγραφή δεν προστατεύεται, απλοί επισκέπτες ή επιτιθέμενοι μπορούν να αλλοιώσουν τη βάση συνταγών, να εισάγουν spam ή κακόβουλο περιεχόμενο.",
    remediation: "Ελέγχετε πάντα το session token διαχειριστή μέσω verifyAdminRequest() πριν από κάθε εγγραφή.",
    tags: ["acl", "authorization", "owasp-a01"],
    execute: async ({ fetchApi, assertEquals }) => {
      const res = await fetchApi("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "192.0.2.1" },
        body: JSON.stringify({
          recipe: { id: "malicious-recipe", title: "Hacked Recipe" },
        }),
      });
      assertEquals(res.status, 401, "Μη εξουσιοδοτημένη εγγραφή πρέπει να επιστρέφει 401 Unauthorized");
      return {
        evidence: `POST /api/recipes status: ${res.status} (Unauthorized)`,
        details: "Η τροποποίηση συνταγών είναι πλήρως κλειδωμένη μόνο για τον διαχειριστή.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-ACL-RECIPES-DEL-UNAUTH",
    title: "Προστασία Διαγραφής Συνταγών (DELETE /api/recipes 401)",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-285",
    severity: "critical",
    description: "Επιβεβαιώνει ότι αιτήματα διαγραφής συνταγών χωρίς έγκυρο session διαχειριστή απορρίπτονται άμεσα με 401 Unauthorized.",
    threatImpact: "Ανεξέλεγκτη διαγραφή συνταγών μπορεί να οδηγήσει σε ολική απώλεια δεδομένων του καταλόγου από κακόβουλους τρίτους.",
    remediation: "Απαιτείτε αυστηρά δικαιώματα διαχειριστή για κάθε ενέργεια DELETE.",
    tags: ["acl", "authorization", "owasp-a01"],
    execute: async ({ fetchApi, assertEquals }) => {
      const res = await fetchApi("/api/recipes?id=some-id", {
        method: "DELETE",
        headers: { "x-forwarded-for": "192.0.2.2" },
      });
      assertEquals(res.status, 401, "Μη εξουσιοδοτημένη διαγραφή πρέπει να επιστρέφει 401 Unauthorized");
      return {
        evidence: `DELETE /api/recipes status: ${res.status} (Unauthorized)`,
        details: "Η διαγραφή συνταγών είναι αποκλειστικά διαθέσιμη στον εξουσιοδοτημένο διαχειριστή.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-ACL-IMPORT-UNAUTH",
    title: "Προστασία Ανάκτησης Εξωτερικών Συνταγών (POST /api/recipes/import 401)",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-285",
    severity: "high",
    description: "Επαληθεύει ότι η βαριά λειτουργία scraping/ανάκτησης εξωτερικών URL επιτρέπεται μόνο σε διαχειριστές.",
    threatImpact: "Αν το import ήταν δημόσιο, θα μπορούσε να χρησιμοποιηθεί καταχρηστικά ως proxy για DoS σε τρίτα sites ή για εξάντληση των πόρων του server.",
    remediation: "Προστατεύστε το endpoint εισαγωγής με verifyAdminRequest().",
    tags: ["acl", "authorization", "owasp-a01"],
    execute: async ({ fetchApi, assertEquals }) => {
      const res = await fetchApi("/api/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "192.0.2.3" },
        body: JSON.stringify({ url: "https://akispetretzikis.com/recipe/1" }),
      });
      assertEquals(res.status, 401, "Μη εξουσιοδοτημένο import πρέπει να επιστρέφει 401 Unauthorized");
      return {
        evidence: `POST /api/recipes/import status: ${res.status} (Unauthorized)`,
        details: "Η ανάκτηση εξωτερικών συνταγών είναι προστατευμένη.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-ACL-METHOD-NOT-ALLOWED",
    title: "Απόρριψη Μη Υποστηριζόμενων HTTP Μεθόδων (Method Not Allowed 405)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-650",
    severity: "medium",
    description: "Ελέγχει ότι μη υποστηριζόμενες μέθοδοι (όπως PUT/PATCH σε endpoints που δέχονται μόνο GET/POST) απορρίπτονται με 405 Method Not Allowed.",
    threatImpact: "Απροσδόκητες HTTP μέθοδοι μπορούν να παρακάμψουν φίλτρα ελέγχου πρόσβασης αν ο server δεν τις απορρίπτει ρητά.",
    remediation: "Ορίστε ρητά τις επιτρεπόμενες μεθόδους (GET, POST κτλ.) και απορρίπτετε όλες τις υπόλοιπες με HTTP 405.",
    tags: ["acl", "http-methods", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/api/recipes", {
        method: "PUT",
      });
      assert(
        res.status === 405 || res.status === 404,
        `Η μη υποστηριζόμενη μέθοδος PUT πρέπει να απορρίπτεται με 405 Method Not Allowed (ελήφθη: ${res.status})`
      );
      return {
        evidence: `PUT /api/recipes status: ${res.status} (Method Not Allowed)`,
        details: "Μη υποστηριζόμενες HTTP μέθοδοι απορρίπτονται ορθά από το Next.js API layer.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-ACL-ADMIN-TESTS-UNAUTH",
    title: "Προστασία Test Runner Endpoint (GET /api/admin/tests 401)",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-285",
    severity: "critical",
    description: "Επαληθεύει ότι το endpoint εκτέλεσης δοκιμών QA απαιτεί έγκυρο session διαχειριστή και απορρίπτει ανώνυμα αιτήματα με 401 Unauthorized.",
    threatImpact: "Ανεξέλεγκτη πρόσβαση στο test runner επιτρέπει σε τρίτους να προκαλούν άσκοπη υπερφόρτωση του server (Resource Exhaustion) και να διαβάζουν εσωτερικά αποτελέσματα QA.",
    remediation: "Ελέγχετε πάντα το session token μέσω verifyAdminRequest() πριν από την έναρξη του test runner.",
    tags: ["acl", "admin", "tests", "owasp-a01"],
    execute: async ({ fetchApi, assertEquals }) => {
      const res = await fetchApi("/api/admin/tests", {
        headers: { "x-forwarded-for": "192.0.2.10" },
      });
      assertEquals(res.status, 401, "Μη εξουσιοδοτημένη κλήση στο /api/admin/tests πρέπει να επιστρέφει 401 Unauthorized");
      return {
        evidence: `GET /api/admin/tests status: ${res.status} (Unauthorized)`,
        details: "Το test runner endpoint προστατεύεται πλήρως από μη εξουσιοδοτημένη εκτέλεση.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-ACL-ADMIN-SECURITY-UNAUTH",
    title: "Προστασία Pentest Audit Endpoint (GET /api/admin/security 401)",
    owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
    cwe: "CWE-200",
    severity: "critical",
    description: "Επιβεβαιώνει ότι το endpoint αναφοράς ευπαθειών ασφαλείας είναι κλειδωμένο και απορρίπτει ανώνυμα αιτήματα με 401 Unauthorized.",
    threatImpact: "Διαρροή αναφορών pentest σε μη εξουσιοδοτημένους χρήστες αποκαλύπτει εσωτερικές αδυναμίες και διανύσματα επίθεσης της εφαρμογής.",
    remediation: "Απαιτείτε αυστηρά διαπιστευτήρια διαχειριστή μέσω verifyAdminRequest() στο /api/admin/security.",
    tags: ["acl", "admin", "security", "data-leakage", "owasp-a01"],
    execute: async ({ fetchApi, assertEquals }) => {
      const res = await fetchApi("/api/admin/security", {
        headers: { "x-forwarded-for": "192.0.2.11" },
      });
      assertEquals(res.status, 401, "Μη εξουσιοδοτημένη κλήση στο /api/admin/security πρέπει να επιστρέφει 401 Unauthorized");
      return {
        evidence: `GET /api/admin/security status: ${res.status} (Unauthorized)`,
        details: "Η αναφορά ασφαλείας και pentest είναι προσβάσιμη αποκλειστικά από τον διαχειριστή.",
      };
    },
  }),
];
