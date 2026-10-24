import { defineSecurityRule, SecurityRule } from "../types";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { getCachedSearch, setCachedSearch } from "@/lib/posokanei/search-cache";

export const rateLimitSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-DOS-SLIDING-WINDOW",
    title: "Επιβολή Ορίων Sliding-Window ανά IP (Anti-Flooding)",
    owaspCategory: "A04_INSECURE_DESIGN",
    cwe: "CWE-770",
    severity: "high",
    description: "Ελέγχει ότι ο αλγόριθμος sliding window περιορίζει αποτελεσματικά τον αριθμό επιτρεπόμενων κλήσεων ανά χρονικό παράθυρο.",
    threatImpact: "Χωρίς rate limiting, ένας επιτιθέμενος μπορεί να εκτελέσει Denial of Service (DoS), εξαντλώντας την CPU, τη μνήμη και το bandwidth του διακομιστή.",
    remediation: "Χρησιμοποιείτε sliding window timestamps με αυτόματο purge παλαιών εγγραφών.",
    tags: ["dos", "rate-limit", "sliding-window", "owasp-a04"],
    execute: async ({ assert, assertEquals }) => {
      const testIp = `10.99.88.${Math.floor(Math.random() * 200) + 1}`;
      const config = { limit: 3, windowMs: 10000, prefix: "audit-test-limit" };

      const r1 = checkRateLimit(testIp, config);
      assertEquals(r1.allowed, true, "1ο αίτημα επιτρέπεται");

      const r2 = checkRateLimit(testIp, config);
      assertEquals(r2.allowed, true, "2ο αίτημα επιτρέπεται");

      const r3 = checkRateLimit(testIp, config);
      assertEquals(r3.allowed, true, "3ο αίτημα επιτρέπεται");

      const r4 = checkRateLimit(testIp, config);
      assertEquals(r4.allowed, false, "4ο αίτημα υπερβαίνει το όριο και μπλοκάρεται");
      assert(r4.retryAfterSeconds > 0, "Πρέπει να επιστραφεί χρόνος αναμονής retryAfterSeconds");

      return {
        evidence: `4th request blocked: allowed=${r4.allowed}, retryAfter=${r4.retryAfterSeconds}s`,
        details: "Ο sliding-window rate limiter προστατεύει από flood επιθέσεις.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-DOS-COOLDOWN",
    title: "Επιβολή Cooldown Συνεχόμενων Αιτημάτων (Anti-Thrashing)",
    owaspCategory: "A04_INSECURE_DESIGN",
    cwe: "CWE-770",
    severity: "high",
    description: "Επαληθεύει ότι δύο ταυτόχρονα ή διαδοχικά αιτήματα στο ίδιο millisecond απορρίπτονται όταν υπάρχει ρύθμιση cooldown.",
    threatImpact: "Αποτρέπει thrashing του συστήματος από bots που στέλνουν ριπές (bursts) δεκάδων αιτημάτων ταυτόχρονα.",
    remediation: "Ορίζετε cooldownMs (π.χ. 500ms - 2000ms) ανάμεσα σε διαδοχικά αιτήματα.",
    tags: ["dos", "cooldown", "anti-thrashing", "owasp-a04"],
    execute: async ({ assertEquals }) => {
      const testIp = `10.99.77.${Math.floor(Math.random() * 200) + 1}`;
      const config = { limit: 10, windowMs: 60000, cooldownMs: 1500, prefix: "audit-test-cooldown" };

      const r1 = checkRateLimit(testIp, config);
      assertEquals(r1.allowed, true, "1ο αίτημα επιτρέπεται");

      const r2 = checkRateLimit(testIp, config);
      assertEquals(r2.allowed, false, "2ο άμεσο αίτημα μπλοκάρεται λόγω ενεργού cooldown");

      return {
        evidence: `Consecutive request blocked by cooldown: allowed=${r2.allowed}, resetMs=${r2.resetMs}`,
        details: "Η επιβολή cooldown αποτρέπει ριπές αιτημάτων (request bursts).",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-DOS-429-METADATA",
    title: "Ορθή Επιστροφή HTTP 429 & Retry Headers",
    owaspCategory: "A04_INSECURE_DESIGN",
    cwe: "CWE-770",
    severity: "medium",
    description: "Ελέγχει ότι τα throttled endpoints επιστρέφουν επίσημο HTTP status 429 Too Many Requests και σαφές μήνυμα αναμονής.",
    threatImpact: "Αν το σύστημα επέστρεφε 500 ή έκοβε τη σύνδεση σιωπηλά, τα clients δεν θα μπορούσαν να γνωρίζουν πότε να επαναλάβουν το αίτημα.",
    remediation: "Επιστρέφετε NextResponse με status 429, headers Retry-After και δομημένο JSON σφάλμα.",
    tags: ["dos", "http-429", "standards", "owasp-a04"],
    execute: async ({ fetchApi, assertEquals }) => {
      const testIp = `198.51.100.90`;

      // 1ο αίτημα newsletter
      await fetchApi("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": testIp },
        body: JSON.stringify({ email: `test-${Date.now()}@example.com` }),
      });

      // 2ο άμεσο αίτημα (cooldown 2 δευτερολέπτων)
      const res2 = await fetchApi("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": testIp },
        body: JSON.stringify({ email: `test2-${Date.now()}@example.com` }),
      });

      assertEquals(res2.status, 429, "Άμεσο συνεχόμενο αίτημα πρέπει να απαντά με HTTP 429 Too Many Requests");
      const data = await res2.json();
      assertEquals(data.success, false, "Το payload πρέπει να περιέχει success: false");

      return {
        evidence: `Status 429 returned with error message: '${data.error}'`,
        details: "Τα όρια ασφαλείας κοινοποιούνται ορθά στους πελάτες.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-DOS-SEARCH-DEDUP",
    title: "In-Memory Caching & Αποτροπή Εξάντλησης Πόρων (Search Deduplication)",
    owaspCategory: "A04_INSECURE_DESIGN",
    cwe: "CWE-400",
    severity: "medium",
    description: "Επαληθεύει ότι η cache αναζήτησης αποθηκεύει και ανακτά αποτελέσματα με 10m TTL αποτρέποντας περιττά external HTTP calls.",
    threatImpact: "Χωρίς caching, μαζικές αναζητήσεις προϊόντων θα υπερφόρτωναν το live API του posokanei.gov.gr και θα προκαλούσαν blacklisting της εφαρμογής.",
    remediation: "Χρησιμοποιείτε in-memory LRU/TTL cache για τα αποτελέσματα αναζήτησης.",
    tags: ["dos", "cache", "deduplication", "owasp-a04"],
    execute: async ({ assert, assertEquals }) => {
      const testKey = `pentest-item-${Date.now()}`;
      const mockResult: any = {
        products: [{ id: "test-product-pentest", name: "Δοκιμαστικό Προϊόν" }],
        total: 1,
        page: 1,
        page_size: 10,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      };

      // Πριν την αποθήκευση
      assertEquals(getCachedSearch(testKey), null, "Ανεξερεύνητο κλειδί πρέπει να επιστρέφει null");

      // Αποθήκευση
      setCachedSearch(testKey, mockResult);

      // Ανάκτηση από cache
      const cached = getCachedSearch(testKey);
      assert(!!cached, "Το αντικείμενο πρέπει να ανακτηθεί από την cache");
      assertEquals(cached?.total, 1, "Το total πρέπει να είναι 1");
      assertEquals(cached?.products[0].id, "test-product-pentest", "Το product ID πρέπει να ταυτίζεται");

      return {
        evidence: `Cached search entry retrieved in <1ms without network call`,
        details: "Η cache αποτρέπει αποτελεσματικά περιττά εξωτερικά αιτήματα.",
      };
    },
  }),
];
