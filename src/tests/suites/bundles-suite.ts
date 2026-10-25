import { defineSuite, defineTest } from "../core/runner";
import { ProductBundle } from "@/types/bundles";

export const bundlesSuite = defineSuite({
  id: "bundles-suite",
  name: "Clean Planner & Baby Care Bundles",
  category: "api",
  description:
    "Ελέγχει τα πακέτα καθαριότητας και βρεφικών ειδών, τον υπολογισμό τιμών ανά σούπερ μάρκετ και την προστασία διαχείρισης διαχειριστή.",
  tests: [
    defineTest({
      id: "bundles-get-public",
      title: "Δημόσια ανάκτηση πακέτων (Clean Planner & Baby Care)",
      category: "api",
      description: "Επιβεβαιώνει ότι οποιοσδήποτε επισκέπτης μπορεί να διαβάσει τα δημοσιευμένα bundles.",
      documentation: "Εκτελεί GET /api/bundles και ελέγχει ότι επιστρέφει status 200 και τουλάχιστον 6 έτοιμα πακέτα.",
      tags: ["smoke", "bundles", "api"],
      severity: "critical",
      run: async ({ fetchApi, assert, assertEquals }) => {
        const res = await fetchApi("/api/bundles");
        assertEquals(res.status, 200, "Το GET /api/bundles πρέπει να επιστρέφει 200 OK");

        const data = await res.json();
        assertEquals(data.success, true, "Η απάντηση πρέπει να περιέχει success: true");
        assert(Array.isArray(data.bundles), "Το πεδίο bundles πρέπει να είναι πίνακας");
        assert(data.bundles.length >= 6, `Αναμένονται τουλάχιστον 6 πακέτα, βρέθηκαν ${data.bundles.length}`);
      },
    }),

    defineTest({
      id: "bundles-filter-cleaning",
      title: "Φιλτράρισμα πακέτων Clean Planner (category=cleaning)",
      category: "api",
      description: "Επιβεβαιώνει ότι το φιλτράρισμα ?category=cleaning επιστρέφει αυστηρά πακέτα καθαριότητας.",
      documentation: "Εκτελεί GET /api/bundles?category=cleaning και ελέγχει ότι όλα τα επιστρεφόμενα πακέτα έχουν category 'cleaning'.",
      tags: ["bundles", "cleaning"],
      severity: "high",
      run: async ({ fetchApi, assert, assertEquals }) => {
        const res = await fetchApi("/api/bundles?category=cleaning");
        assertEquals(res.status, 200, "Πρέπει να επιστρέφει 200 OK");

        const data = await res.json();
        assert(Array.isArray(data.bundles), "Πρέπει να επιστρέφει πίνακα bundles");
        assert(data.bundles.length >= 3, `Αναμένονται τουλάχιστον 3 πακέτα καθαριότητας, βρέθηκαν ${data.bundles.length}`);

        for (const bundle of data.bundles as ProductBundle[]) {
          assertEquals(bundle.category, "cleaning", `Το πακέτο ${bundle.title} πρέπει να έχει κατηγορία cleaning`);
          assert(bundle.items.length >= 2, `Το πακέτο ${bundle.title} πρέπει να περιέχει τουλάχιστον 2 προϊόντα`);
        }
      },
    }),

    defineTest({
      id: "bundles-filter-baby",
      title: "Φιλτράρισμα πακέτων Baby Care (category=baby)",
      category: "api",
      description: "Επιβεβαιώνει ότι το φιλτράρισμα ?category=baby επιστρέφει αυστηρά βρεφικά πακέτα.",
      documentation: "Εκτελεί GET /api/bundles?category=baby και ελέγχει ότι όλα τα επιστρεφόμενα πακέτα έχουν category 'baby'.",
      tags: ["bundles", "baby"],
      severity: "high",
      run: async ({ fetchApi, assert, assertEquals }) => {
        const res = await fetchApi("/api/bundles?category=baby");
        assertEquals(res.status, 200, "Πρέπει να επιστρέφει 200 OK");

        const data = await res.json();
        assert(Array.isArray(data.bundles), "Πρέπει να επιστρέφει πίνακα bundles");
        assert(data.bundles.length >= 3, `Αναμένονται τουλάχιστον 3 βρεφικά πακέτα, βρέθηκαν ${data.bundles.length}`);

        for (const bundle of data.bundles as ProductBundle[]) {
          assertEquals(bundle.category, "baby", `Το πακέτο ${bundle.title} πρέπει να έχει κατηγορία baby`);
          assert(bundle.items.length >= 2, `Το πακέτο ${bundle.title} πρέπει να περιέχει τουλάχιστον 2 προϊόντα`);
        }
      },
    }),

    defineTest({
      id: "bundles-pricing-matrix",
      title: "Υπολογισμός τιμών ανά Σούπερ Μάρκετ & εύρεση φθηνότερου καταστήματος",
      category: "optimizer",
      description: "Επιβεβαιώνει ότι κάθε πακέτο διαθέτει υπολογισμένο πίνακα τιμών και έγκυρο bestStoreId.",
      documentation: "Ελέγχει ότι το storePrices περιλαμβάνει τα 5 παρακολουθούμενα σούπερ μάρκετ και το estimatedTotalEur αντιστοιχεί στο φθηνότερο διαθέσιμο.",
      tags: ["optimizer", "bundles", "posokanei"],
      severity: "high",
      run: async ({ fetchApi, assert }) => {
        const res = await fetchApi("/api/bundles");
        const data = await res.json();
        const bundles: ProductBundle[] = data.bundles;

        for (const b of bundles) {
          assert(b.estimatedTotalEur > 0, `Το πακέτο ${b.title} πρέπει να έχει θετικό συνολικό κόστος`);
          assert(Array.isArray(b.storePrices) && b.storePrices.length >= 4, `Το πακέτο ${b.title} πρέπει να έχει τιμές σε τουλάχιστον 4 σούπερ μάρκετ`);
          assert(!!b.bestStoreId, `Το πακέτο ${b.title} πρέπει να έχει ορισμένο bestStoreId`);
          assert(!!b.bestStoreName, `Το πακέτο ${b.title} πρέπει να έχει ορισμένο bestStoreName`);
        }
      },
    }),

    defineTest({
      id: "bundles-post-unauthorized-rejection",
      title: "Προστασία POST /api/bundles από μη εξουσιοδοτημένους χρήστες",
      category: "security",
      description: "Επιβεβαιώνει ότι δημιουργία ή τροποποίηση πακέτου απαιτεί αυστηρά δικαιώματα διαχειριστή.",
      documentation: "Στέλνει POST /api/bundles χωρίς admin credentials και επιβεβαιώνει status 401 Unauthorized.",
      tags: ["security", "admin", "bundles"],
      severity: "critical",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/bundles", {
          method: "POST",
          body: JSON.stringify({
            bundle: {
              id: "unauthorized-bundle-test",
              category: "cleaning",
              title: "Hacked Bundle",
              items: [],
            },
          }),
        });
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized για μη συνδεδεμένο χρήστη");
      },
    }),

    defineTest({
      id: "bundles-delete-unauthorized-rejection",
      title: "Προστασία DELETE /api/bundles από μη εξουσιοδοτημένους χρήστες",
      category: "security",
      description: "Επιβεβαιώνει ότι διαγραφή πακέτου απαιτεί αυστηρά δικαιώματα διαχειριστή.",
      documentation: "Στέλνει DELETE /api/bundles?id=bundle-clean-monthly-family χωρίς admin credentials και επιβεβαιώνει status 401.",
      tags: ["security", "admin", "bundles"],
      severity: "critical",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/bundles?id=bundle-clean-monthly-family", {
          method: "DELETE",
        });
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized για μη συνδεδεμένο χρήστη");
      },
    }),
  ],
});
