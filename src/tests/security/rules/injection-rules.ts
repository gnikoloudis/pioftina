import { defineSecurityRule, SecurityRule } from "../types";
import { createAdminToken } from "@/lib/security/admin-auth";

export const injectionSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-INJ-EMAIL-FORMAT",
    title: "Επικύρωση Μορφής Email & RFC 5322 (Newsletter)",
    owaspCategory: "A03_INJECTION",
    cwe: "CWE-20",
    severity: "medium",
    description: "Ελέγχει ότι κακόμορφες μορφές email (π.χ. 'plainaddress', '#@%^%#$@#$@#.com', 'email@example..com') απορρίπτονται με 400 Bad Request.",
    threatImpact: "Ανεπαρκής έλεγχος εισαγωγής επιτρέπει τη συλλογή σκουπιδιών στη βάση δεδομένων ή αποστολή bounceback emails.",
    remediation: "Χρησιμοποιείτε αυστηρή κανονική έκφραση (regex) επικύρωσης email πριν από οποιαδήποτε αποθήκευση.",
    tags: ["injection", "validation", "email", "owasp-a03"],
    execute: async ({ fetchApi, assertEquals }) => {
      const invalidEmails = [
        "not-an-email",
        "@missingusername.com",
        "username@.com",
        "user space@domain.com",
      ];

      for (const email of invalidEmails) {
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200)}` },
          body: JSON.stringify({ email }),
        });
        assertEquals(res.status, 400, `Το άκυρο email '${email}' πρέπει να απορρίπτεται με 400`);
      }

      return {
        evidence: "Όλες οι κακόμορφες διευθύνσεις email απορρίφθηκαν με 400 Bad Request.",
        details: "Το σύστημα ελέγχει αυστηρά τη δομή RFC των διευθύνσεων email.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-INJ-EMAIL-XSS",
    title: "Αποτροπή Cross-Site Scripting (XSS Payloads σε Πεδία Εισαγωγής)",
    owaspCategory: "A03_INJECTION",
    cwe: "CWE-79",
    severity: "high",
    description: "Επαληθεύει ότι απόπειρες εισαγωγής JavaScript tags (όπως <script>alert(1)</script>) στα πεδία εγγραφής απορρίπτονται.",
    threatImpact: "Εάν τα payloads αποθηκεύονταν στη βάση, θα μπορούσαν να εκτελεστούν στα browser sessions των διαχειριστών που επιθεωρούν τη λίστα συνδρομητών (Stored XSS).",
    remediation: "Εφαρμόζετε sanitization και αυστηρό validation ώστε να μην επιτρέπονται χαρακτήρες <, >, script στα πεδία εισαγωγής.",
    tags: ["injection", "xss", "sanitization", "owasp-a03"],
    execute: async ({ fetchApi, assertEquals }) => {
      const xssPayloads = [
        '<script>alert("xss")</script>@example.com',
        '"><img src=x onerror=alert(1)>@test.com',
        '<svg onload=alert(1)>',
      ];

      for (const payload of xssPayloads) {
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200)}` },
          body: JSON.stringify({ email: payload }),
        });
        assertEquals(res.status, 400, `Το XSS payload '${payload}' πρέπει να απορρίπτεται με 400`);
      }

      return {
        evidence: "Τα HTML/JS payloads απορρίφθηκαν επιτυχώς από το validation layer.",
        details: "Προστασία από Stored και Reflected XSS ενεργή.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-INJ-MALFORMED-JSON",
    title: "Ανθεκτικότητα σε Κακόμορφο JSON (No Unhandled 500 Crashes)",
    owaspCategory: "A03_INJECTION",
    cwe: "CWE-20",
    severity: "medium",
    description: "Ελέγχει ότι η αποστολή κακόμορφων ή ημιτελών JSON σωμάτων (truncated JSON payloads) δεν προκαλεί crash στον διακομιστή.",
    threatImpact: "Απροστασία σε parsing exceptions μπορεί να προκαλέσει διακοπή της διεργασίας Node.js ή αποκάλυψη εσωτερικών stack traces.",
    remediation: "Περικλείετε πάντα την ανάγνωση req.json() σε try/catch blocks και επιστρέφετε 400 Bad Request σε σφάλματα parsing.",
    tags: ["injection", "json", "resilience", "owasp-a03"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": `198.51.210.${Math.floor(Math.random() * 200) + 1}` },
        body: "{ malformed: json, unexpected_token",
      });

      assert(
        res.status === 400 || res.status === 422,
        `Κακόμορφο JSON πρέπει να επιστρέφει 400 ή 422, αλλά ελήφθη: ${res.status}`
      );
      return {
        evidence: `Malformed JSON response status: ${res.status}`,
        details: "Ο διακομιστής διαχειρίζεται τα σφάλματα σύνταξης JSON με ασφάλεια.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-INJ-RECIPE-SCHEMA",
    title: "Αυστηρός Έλεγχος Σχήματος Συνταγής (Schema Validation)",
    owaspCategory: "A03_INJECTION",
    cwe: "CWE-20",
    severity: "high",
    description: "Επαληθεύει ότι το endpoint εγγραφής συνταγών απαιτεί πλήρη δομή (id, τίτλο) και απορρίπτει ελλιπή ή παραμορφωμένα αντικείμενα.",
    threatImpact: "Εισαγωγή κενών ή παραμορφωμένων συνταγών μπορεί να σπάσει τον αλγόριθμο βελτιστοποίησης συσκευασιών και να προκαλέσει client-side crashes στους χρήστες.",
    remediation: "Ελέγχετε την παρουσία και τον τύπο των υποχρεωτικών πεδίων πριν από την αποθήκευση.",
    tags: ["injection", "schema", "validation", "owasp-a03"],
    execute: async ({ fetchApi, assertEquals }) => {
      const adminToken = createAdminToken();

      // Αποστολή αντικειμένου χωρίς τίτλο
      const res = await fetchApi("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `pioftina_admin_session=${adminToken}`,
          "x-forwarded-for": "198.51.100.36",
        },
        body: JSON.stringify({
          recipe: { id: "test-missing-title" }, // Λείπει το title
        }),
      });

      assertEquals(res.status, 400, "Αντικείμενο συνταγής χωρίς τίτλο πρέπει να απορρίπτεται με 400");
      return {
        evidence: `Incomplete recipe schema rejected with status: ${res.status}`,
        details: "Η ακεραιότητα των δεδομένων συνταγών διασφαλίζεται.",
      };
    },
  }),
];
