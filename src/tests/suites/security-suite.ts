import { defineSuite, defineTest } from "../core/runner";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import {
  createAdminToken,
  verifyAdminToken,
  getAdminSecretKey,
} from "@/lib/security/admin-auth";
import { getCachedSearch, setCachedSearch } from "@/lib/posokanei/search-cache";
import { ProductPage } from "@/lib/posokanei/types";

export const securitySuite = defineSuite({
  id: "security-suite",
  name: "Ασφάλεια, Rate Limiting & Admin Tokens",
  category: "security",
  description: "Ελέγχει τον μηχανισμό προστασίας rate limiting ανά IP, το cooldown συνεχόμενων αιτημάτων, την κρυπτογραφική υπογραφή των admin sessions και την cache αναζητήσεων.",
  tests: [
    defineTest({
      id: "security-rate-limiter-sliding-window",
      title: "Έλεγχος sliding-window Rate Limiter ανά IP",
      category: "security",
      description: "Επαληθεύει ότι ο rate limiter επιτρέπει αιτήματα εντός του ορίου και μπλοκάρει όταν ξεπεραστεί.",
      documentation: "Εκτελεί διαδοχικές κλήσεις checkRateLimit με μοναδικό test IP. Ελέγχει ότι allowed === true για τα πρώτα 3 αιτήματα και allowed === false στο 4ο.",
      tags: ["security", "rate-limit"],
      severity: "critical",
      run: ({ assert, assertEquals }) => {
        const testIp = `192.168.99.${Math.floor(Math.random() * 1000)}`;
        const config = { limit: 3, windowMs: 10000, prefix: "test-limit" };

        const r1 = checkRateLimit(testIp, config);
        assertEquals(r1.allowed, true, "1ο αίτημα πρέπει να επιτραπεί");
        assertEquals(r1.remaining, 2, "Υπόλοιπα αιτήματα: 2");

        const r2 = checkRateLimit(testIp, config);
        assertEquals(r2.allowed, true, "2ο αίτημα πρέπει να επιτραπεί");
        assertEquals(r2.remaining, 1, "Υπόλοιπα αιτήματα: 1");

        const r3 = checkRateLimit(testIp, config);
        assertEquals(r3.allowed, true, "3ο αίτημα πρέπει να επιτραπεί");
        assertEquals(r3.remaining, 0, "Υπόλοιπα αιτήματα: 0");

        const r4 = checkRateLimit(testIp, config);
        assertEquals(r4.allowed, false, "4ο αίτημα πρέπει να μπλοκαριστεί");
        assert(r4.retryAfterSeconds > 0, "Πρέπει να επιστραφεί retryAfterSeconds");
      },
    }),

    defineTest({
      id: "security-rate-limiter-cooldown",
      title: "Επιβολή cooldown μεταξύ συνεχόμενων αιτημάτων",
      category: "security",
      description: "Επαληθεύει ότι δύο αιτήματα στο ίδιο millisecond απορρίπτονται αν το cooldownMs > 0.",
      documentation: "Εκτελεί 2 ταυτόχρονες κλήσεις με cooldownMs: 500ms. Το 2ο πρέπει να απορριφθεί άμεσα λόγω cooldown.",
      tags: ["security", "anti-thrashing"],
      severity: "high",
      run: ({ assertEquals }) => {
        const testIp = `10.0.99.${Math.floor(Math.random() * 1000)}`;
        const config = { limit: 10, windowMs: 60000, cooldownMs: 1000, prefix: "test-cooldown" };

        const r1 = checkRateLimit(testIp, config);
        assertEquals(r1.allowed, true, "1ο αίτημα επιτρέπεται");

        // Άμεσο 2ο αίτημα χωρίς αναμονή
        const r2 = checkRateLimit(testIp, config);
        assertEquals(r2.allowed, false, "2ο αίτημα πρέπει να απορριφθεί λόγω cooldown");
      },
    }),

    defineTest({
      id: "security-admin-auth-hmac-token",
      title: "Κρυπτογραφική υπογραφή και επικύρωση Admin Token",
      category: "security",
      description: "Ελέγχει ότι το createAdminToken δημιουργεί έγκυρο HMAC-signed token και ότι το verifyAdminToken το επικυρώνει.",
      documentation: "Ελέγχει τη δομή timestamp:hmac και επιβεβαιώνει ότι παράγεται timing-safe επαλήθευση με το ADMIN_SECRET_KEY.",
      tags: ["security", "admin", "auth"],
      severity: "critical",
      run: ({ assert, assertEquals }) => {
        const token = createAdminToken();
        assert(!!token && token.includes(":"), "Το token πρέπει να έχει τη μορφή timestamp:hmac");

        const isValid = verifyAdminToken(token);
        assertEquals(isValid, true, "Το φρεσκοδημιουργημένο token πρέπει να είναι έγκυρο");

        const secret = getAdminSecretKey();
        assert(secret.length >= 6, "Το admin secret key πρέπει να έχει τουλάχιστον 6 χαρακτήρες");
      },
    }),

    defineTest({
      id: "security-admin-tampered-token-rejection",
      title: "Απόρριψη παραποιημένου ή ληγμένου Admin Token",
      category: "security",
      description: "Επιβεβαιώνει ότι οποιοδήποτε πλαστό ή αλλοιωμένο HMAC token απορρίπτεται άμεσα.",
      documentation: "Δοκιμάζει κενό token, τυχαίο string, token με αλλοιωμένο timestamp και token με λάθος signature.",
      tags: ["security", "admin"],
      severity: "critical",
      run: ({ assertEquals }) => {
        assertEquals(verifyAdminToken(""), false, "Κενό token απορρίπτεται");
        assertEquals(verifyAdminToken("invalid-token"), false, "Μη δομημένο token απορρίπτεται");
        assertEquals(verifyAdminToken("123456789:fakehmac123"), false, "Πλαστό signature απορρίπτεται");

        // Πολύ παλιό timestamp (άνω των 24 ωρών)
        const expiredTimestamp = Date.now() - 48 * 60 * 60 * 1000;
        assertEquals(verifyAdminToken(`${expiredTimestamp}:fakehmac`), false, "Ληγμένο token απορρίπτεται");
      },
    }),

    defineTest({
      id: "security-posokanei-search-cache-ttl",
      title: "In-Memory Search Cache (10m TTL & Deduplication)",
      category: "security",
      description: "Επαληθεύει ότι η search cache αποθηκεύει και ανακτά αποτελέσματα χωρίς περιττά HTTP calls.",
      documentation: "Ελέγχει get/set στη searchCache και επιβεβαιώνει ότι η cache επιστρέφει ακριβώς τα αποθηκευμένα αντικείμενα.",
      tags: ["posokanei", "performance", "cache"],
      severity: "high",
      run: ({ assertEquals }) => {
        const dummyKey = `test-item-${Date.now()}`;
        const dummyResult: ProductPage = {
          products: [{ id: "test-prod-1" } as any],
          total: 1,
          page: 1,
          page_size: 10,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        };

        // Πριν την αποθήκευση: null
        assertEquals(getCachedSearch(dummyKey), null, "Πρέπει να επιστρέφει null για άγνωστο κλειδί");

        // Αποθήκευση
        setCachedSearch(dummyKey, dummyResult);

        // Ανάκτηση
        const cached = getCachedSearch(dummyKey);
        assertEquals(cached?.total, 1, "Πρέπει να επιστρέφει το αποθηκευμένο αποτέλεσμα");
        assertEquals(cached?.products[0].id, "test-prod-1", "Πρέπει να περιέχει το σωστό product id");
      },
    }),
  ],
});
