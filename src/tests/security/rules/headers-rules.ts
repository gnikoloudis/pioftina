import { defineSecurityRule, SecurityRule } from "../types";

export const headersSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-HDR-XCTO",
    title: "Προστασία MIME-Sniffing (X-Content-Type-Options: nosniff)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-693",
    severity: "high",
    description: "Ελέγχει ότι ο διακομιστής στέλνει την κεφαλίδα 'X-Content-Type-Options: nosniff' σε όλες τις απαντήσεις.",
    threatImpact: "Χωρίς αυτή την κεφαλίδα, παλαιότεροι ή κακόβουλοι browsers μπορούν να εκτελέσουν αρχεία κειμένου/εικόνων ως JavaScript (MIME Confusion Attack).",
    remediation: "Ρυθμίστε στο next.config.ts την κεφαλίδα X-Content-Type-Options με τιμή 'nosniff'.",
    tags: ["headers", "mime", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const headerVal = res.headers.get("x-content-type-options");
      assert(
        headerVal?.toLowerCase() === "nosniff",
        `Αναμενόταν 'X-Content-Type-Options: nosniff', αλλά ελήφθη: '${headerVal || "κανένα"}'`
      );
      return {
        evidence: `X-Content-Type-Options: ${headerVal}`,
        details: "Η κεφαλίδα nosniff είναι ενεργή και προστατεύει από MIME confusion.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-HDR-XFO",
    title: "Προστασία Clickjacking (X-Frame-Options: DENY)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-1021",
    severity: "high",
    description: "Επαληθεύει ότι η ιστοσελίδα απαγορεύει την ενσωμάτωσή της μέσα σε <iframe> άλλων ιστότοπων.",
    threatImpact: "Επιτιθέμενοι μπορούν να τοποθετήσουν την εφαρμογή μέσα σε διαφανές iframe και να ξεγελάσουν τον χρήστη ώστε να πατήσει κουμπιά αγορών ή διαγραφής (Clickjacking / UI Redress).",
    remediation: "Ρυθμίστε την κεφαλίδα X-Frame-Options σε 'DENY' ή 'SAMEORIGIN' στο next.config.ts.",
    tags: ["headers", "clickjacking", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const headerVal = res.headers.get("x-frame-options");
      const isProtected = headerVal && (headerVal.toUpperCase() === "DENY" || headerVal.toUpperCase() === "SAMEORIGIN");
      assert(
        !!isProtected,
        `Αναμενόταν 'X-Frame-Options: DENY' ή 'SAMEORIGIN', αλλά ελήφθη: '${headerVal || "κανένα"}'`
      );
      return {
        evidence: `X-Frame-Options: ${headerVal}`,
        details: "Η ενσωμάτωση σε εξωτερικά iframes είναι πλήρως αποκλεισμένη.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-HDR-HSTS",
    title: "Επιβολή Κρυπτογραφημένου HTTPS (Strict-Transport-Security)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-319",
    severity: "medium",
    description: "Ελέγχει ότι αποστέλλεται η οδηγία HSTS για υποχρεωτική επικοινωνία αποκλειστικά μέσω κρυπτογραφημένου HTTPS.",
    threatImpact: "Αποτρέπει επιθέσεις Man-In-The-Middle (MITM) και SSL-stripping όπου ένας ενδιάμεσος υποβιβάζει τη σύνδεση σε μη κρυπτογραφημένο HTTP.",
    remediation: "Προσθέστε 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' στις κεφαλίδες του Next.js.",
    tags: ["headers", "hsts", "ssl", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const headerVal = res.headers.get("strict-transport-security");
      assert(
        !!headerVal && headerVal.includes("max-age"),
        `Αναμενόταν Strict-Transport-Security με max-age, αλλά ελήφθη: '${headerVal || "κανένα"}'`
      );
      return {
        evidence: `Strict-Transport-Security: ${headerVal}`,
        details: "Η πολιτική HSTS επιβάλλει ασφαλείς συνδέσεις TLS.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-HDR-RP",
    title: "Προστασία Διαρροής Συνδέσμων (Referrer-Policy)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-200",
    severity: "medium",
    description: "Ελέγχει ότι η κεφαλίδα Referrer-Policy προστατεύει ευαίσθητα URLs και query parameters κατά την πλοήγηση σε τρίτους ιστοτόπους.",
    threatImpact: "Χωρίς αυστηρό Referrer-Policy, παράμετροι αναζητήσεων, tokens ή εσωτερικά IDs διαδρομών μπορούν να διαρρεύσουν στα logs τρίτων διακομιστών.",
    remediation: "Ρυθμίστε 'Referrer-Policy: strict-origin-when-cross-origin' στο next.config.ts.",
    tags: ["headers", "referrer", "privacy", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const headerVal = res.headers.get("referrer-policy");
      assert(
        !!headerVal && (headerVal.includes("strict-origin") || headerVal.includes("no-referrer")),
        `Αναμενόταν ασφαλές Referrer-Policy, αλλά ελήφθη: '${headerVal || "κανένα"}'`
      );
      return {
        evidence: `Referrer-Policy: ${headerVal}`,
        details: "Περιορίζεται η διαρροή πληροφοριών προέλευσης σε εξωτερικούς συνδέσμους.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-HDR-PP",
    title: "Περιορισμός Δικαιωμάτων Browser (Permissions-Policy)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-693",
    severity: "low",
    description: "Επαληθεύει ότι ευαίσθητα περιφερειακά του επισκέπτη (κάμερα, μικρόφωνο, γεωεντοπισμός) απενεργοποιούνται ρητά.",
    threatImpact: "Αν κάποιο τρίτο script ενσωματωθεί κακόβουλα, δεν θα έχει άδεια πρόσβασης στο μικρόφωνο, στην κάμερα ή στη γεωγραφική θέση του χρήστη.",
    remediation: "Προσθέστε 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()' στο next.config.ts.",
    tags: ["headers", "permissions", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const headerVal = res.headers.get("permissions-policy");
      assert(
        !!headerVal,
        `Αναμενόταν κεφαλίδα Permissions-Policy, αλλά ελήφθη: '${headerVal || "κανένα"}'`
      );
      return {
        evidence: `Permissions-Policy: ${headerVal}`,
        details: "Τα περιττά δικαιώματα browser είναι απενεργοποιημένα.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-HDR-NO-PWR",
    title: "Απόκρυψη Ταυτότητας Διακομιστή (X-Powered-By Suppression)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-200",
    severity: "low",
    description: "Ελέγχει ότι ο διακομιστής δεν εκθέτει κεφαλίδες όπως 'X-Powered-By' που αποκαλύπτουν εκδόσεις τεχνολογιών.",
    threatImpact: "Η αποκάλυψη της ακριβούς τεχνολογίας και έκδοσης (π.χ. Express, Next.js x.y.z) επιτρέπει σε εισβολείς να στοχεύσουν γνωστές ευπάθειες CVE της έκδοσης.",
    remediation: "Απενεργοποιήστε το X-Powered-By μέσω 'poweredByHeader: false' στο next.config.ts.",
    tags: ["headers", "fingerprinting", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const res = await fetchApi("/");
      const poweredBy = res.headers.get("x-powered-by");
      assert(
        !poweredBy,
        `Βρέθηκε ανεπιθύμητη κεφαλίδα αποτύπωσης τεχνολογίας: 'X-Powered-By: ${poweredBy}'`
      );
      return {
        evidence: "X-Powered-By: Απών (Προστατευμένο)",
        details: "Ο διακομιστής δεν εκθέτει εκδόσεις ή εσωτερικά frameworks.",
      };
    },
  }),
];
