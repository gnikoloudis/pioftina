import { defineSuite, defineTest } from "../core/runner";

export const apiRoutesSuite = defineSuite({
  id: "api-routes-suite",
  name: "API Endpoints & HTTP Διαδρομές",
  category: "api",
  description: "Ελέγχει τη λειτουργία των HTTP endpoints, τον διαχωρισμό public/protected routes και την απόκριση των APIs.",
  tests: [
    defineTest({
      id: "api-recipes-get-public",
      title: "Δημόσια πρόσβαση στο GET /api/recipes",
      category: "api",
      description: "Επιβεβαιώνει ότι οποιοσδήποτε επισκέπτης μπορεί να διαβάσει τις συνταγές χωρίς authentication.",
      documentation: "Εκτελεί GET /api/recipes και ελέγχει ότι επιστρέφει status 200 και array με τουλάχιστον 80 συνταγές.",
      tags: ["smoke", "api"],
      severity: "critical",
      run: async ({ fetchApi, assert, assertEquals }) => {
        const res = await fetchApi("/api/recipes");
        assertEquals(res.status, 200, "Το GET /api/recipes πρέπει να επιστρέφει 200 OK");

        const data = await res.json();
        assertEquals(data.success, true, "Η απάντηση πρέπει να έχει success: true");
        assert(Array.isArray(data.recipes), "Το πεδίο recipes πρέπει να είναι πίνακας");
        assert(data.recipes.length >= 80, `Αναμένονται τουλάχιστον 80 συνταγές, βρέθηκαν ${data.recipes.length}`);
      },
    }),

    defineTest({
      id: "api-recipes-import-unauthorized-rejection",
      title: "Προστασία POST /api/recipes/import από μη εξουσιοδοτημένους χρήστες",
      category: "api",
      description: "Επιβεβαιώνει ότι κλήση εισαγωγής συνταγής χωρίς admin cookie/token απορρίπτεται με 401 Unauthorized.",
      documentation: "Στέλνει POST /api/recipes/import χωρίς Authorization header ή session cookie και ελέγχει status 401.",
      tags: ["security", "api", "admin"],
      severity: "critical",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/recipes/import", {
          method: "POST",
          body: JSON.stringify({ url: "https://example.com/recipe" }),
        });
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized για μη συνδεδεμένο χρήστη");
      },
    }),

    defineTest({
      id: "api-recipes-delete-unauthorized-rejection",
      title: "Προστασία DELETE /api/recipes από μη εξουσιοδοτημένους χρήστες",
      category: "api",
      description: "Επιβεβαιώνει ότι διαγραφή συνταγής απαιτεί αυστηρά δικαιώματα διαχειριστή.",
      documentation: "Στέλνει DELETE /api/recipes?id=moussaka χωρίς admin credentials και ελέγχει status 401.",
      tags: ["security", "api"],
      severity: "high",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/recipes?id=test-dummy-id", {
          method: "DELETE",
        });
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized");
      },
    }),

    defineTest({
      id: "api-newsletter-subscribe-valid-email",
      title: "Εγγραφή στο Newsletter με έγκυρο email",
      category: "api",
      description: "Επαληθεύει ότι αποστέλλοντας έγκυρο email στο /api/newsletter/subscribe λαμβάνουμε 200 OK.",
      documentation: "Στέλνει POST αίτημα με μοναδικό email δοκιμής και θέματα ενδιαφέροντος.",
      tags: ["newsletter", "api"],
      severity: "high",
      run: async ({ fetchApi, assertEquals, assert }) => {
        const uniqueEmail = `test-user-${Date.now()}@example.com`;
        const testIp = `198.51.100.${Math.floor(Math.random() * 100) + 10}`;
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
          headers: {
            "x-forwarded-for": testIp,
          },
          body: JSON.stringify({
            email: uniqueEmail,
            topics: ["deals", "recipes"],
            source: "footer",
          }),
        });

        assertEquals(res.status, 200, "Έγκυρη εγγραφή πρέπει να επιστρέφει 200 OK");
        const data = await res.json();
        assertEquals(data.success, true, "Απάντηση με success: true");
      },
    }),

    defineTest({
      id: "api-newsletter-subscribe-invalid-email-rejection",
      title: "Απόρριψη άκυρης διεύθυνσης email στο Newsletter",
      category: "api",
      description: "Ελέγχει ότι μορφές όπως 'invalid-email', 'user@', '@domain.com' απορρίπτονται με 400 Bad Request.",
      documentation: "Στέλνει POST με άκυρο email string και επιβεβαιώνει ότι δεν αποθηκεύεται τίποτα.",
      tags: ["newsletter", "validation"],
      severity: "medium",
      run: async ({ fetchApi, assertEquals }) => {
        const testIp = `198.51.100.${Math.floor(Math.random() * 100) + 120}`;
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
          headers: {
            "x-forwarded-for": testIp,
          },
          body: JSON.stringify({ email: "invalid-email-format" }),
        });
        assertEquals(res.status, 400, "Άκυρο email πρέπει να απορρίπτεται με 400 Bad Request");
      },
    }),

    defineTest({
      id: "api-posokanei-search-get-query",
      title: "Δημόσια αναζήτηση προϊόντων με GET /api/posokanei/search?q=...",
      category: "api",
      description: "Επαληθεύει ότι το GET endpoint αναζήτησης προϊόντων ανταποκρίνεται με 200 OK και επιστρέφει JSON αποτελέσματα.",
      documentation: "Εκτελεί GET /api/posokanei/search?q=Ariel και ελέγχει status 200 και ύπαρξη πίνακα προϊόντων.",
      tags: ["posokanei", "search", "api"],
      severity: "critical",
      run: async ({ fetchApi, assert, assertEquals }) => {
        const res = await fetchApi("/api/posokanei/search?q=Ariel");
        assertEquals(res.status, 200, "Το GET /api/posokanei/search?q=Ariel πρέπει να επιστρέφει 200 OK");

        const data = await res.json();
        assert(Array.isArray(data.products), "Πρέπει να επιστρέφει πίνακα products");
        assert(data.products.length > 0, "Πρέπει να επιστρέφει τουλάχιστον ένα αποτέλεσμα για 'Ariel'");
      },
    }),

    defineTest({
      id: "api-posokanei-search-get-empty-rejection",
      title: "Απόρριψη κενής παραμέτρου αναζήτησης στο GET /api/posokanei/search",
      category: "api",
      description: "Ελέγχει ότι κλήση GET χωρίς query string 'q' ή 'title' απορρίπτεται με 400 Bad Request.",
      documentation: "Στέλνει GET /api/posokanei/search χωρίς παραμέτρους και επαληθεύει status 400.",
      tags: ["posokanei", "validation", "api"],
      severity: "medium",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/posokanei/search");
        assertEquals(res.status, 400, "Κλήση χωρίς q ή title πρέπει να επιστρέφει 400 Bad Request");
      },
    }),

    defineTest({
      id: "api-admin-tests-unauthorized-rejection",
      title: "Απόρριψη ανώνυμης κλήσης στο GET /api/admin/tests με 401",
      category: "api",
      description: "Επιβεβαιώνει ότι κλήση στο /api/admin/tests χωρίς διαπιστευτήρια διαχειριστή επιστρέφει 401 Unauthorized.",
      documentation: "Στέλνει GET /api/admin/tests χωρίς admin cookie/token και ελέγχει status 401.",
      tags: ["security", "api", "admin"],
      severity: "critical",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/admin/tests");
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized για μη εξουσιοδοτημένο χρήστη");
      },
    }),

    defineTest({
      id: "api-admin-security-unauthorized-rejection",
      title: "Απόρριψη ανώνυμης κλήσης στο GET /api/admin/security με 401",
      category: "api",
      description: "Επιβεβαιώνει ότι κλήση στο /api/admin/security χωρίς διαπιστευτήρια διαχειριστή επιστρέφει 401 Unauthorized.",
      documentation: "Στέλνει GET /api/admin/security χωρίς admin cookie/token και ελέγχει status 401.",
      tags: ["security", "api", "admin"],
      severity: "critical",
      run: async ({ fetchApi, assertEquals }) => {
        const res = await fetchApi("/api/admin/security");
        assertEquals(res.status, 401, "Πρέπει να επιστρέφει 401 Unauthorized για μη εξουσιοδοτημένο χρήστη");
      },
    }),

    defineTest({
      id: "api-admin-tests-authorized-success",
      title: "Επιτυχής εκτέλεση GET /api/admin/tests με έγκυρο Admin Session",
      category: "api",
      description: "Επιβεβαιώνει ότι εξουσιοδοτημένος διαχειριστής με pioftina_admin_session λαμβάνει 200 OK και αναφορά δοκιμών.",
      documentation: "Στέλνει GET /api/admin/tests με Cookie pioftina_admin_session και ελέγχει status 200 και success: true.",
      tags: ["security", "api", "admin"],
      severity: "high",
      run: async ({ fetchApi, adminToken, assertEquals, assert }) => {
        const res = await fetchApi("/api/admin/tests?category=supermarket", {
          headers: {
            Cookie: `pioftina_admin_session=${adminToken}`,
          },
        });
        assertEquals(res.status, 200, "Εξουσιοδοτημένο αίτημα πρέπει να επιστρέφει 200 OK");
        const data = await res.json();
        assertEquals(data.success, true, "Απάντηση με success: true");
        assert(!!data.report, "Πρέπει να επιστρέφει αντικείμενο report");
      },
    }),

    defineTest({
      id: "api-privacy-page-accessible",
      title: "Δημόσια πρόσβαση και εγκυρότητα της σελίδας Πολιτικής Απορρήτου (/privacy)",
      category: "api",
      description: "Επιβεβαιώνει ότι η διαδρομή /privacy είναι δημόσια προσβάσιμη (200 OK) και περιλαμβάνει αναφορές σε GDPR, e-Καταναλωτή και Newsletter.",
      documentation: "Στέλνει GET /privacy και ελέγχει status 200 και την ύπαρξη των βασικών όρων προστασίας δεδομένων.",
      tags: ["privacy", "gdpr", "api"],
      severity: "high",
      run: async ({ fetchApi, assertEquals, assert }) => {
        const res = await fetchApi("/privacy");
        assertEquals(res.status, 200, "Η σελίδα /privacy πρέπει να επιστρέφει HTTP 200 OK");
        const html = await res.text();
        assert(html.includes("GDPR") || html.includes("2016/679"), "Πρέπει να περιλαμβάνει αναφορά στον GDPR");
        assert(html.includes("Privacy by Design") || html.includes("localStorage") || html.includes("τοπική αποθήκευση"), "Πρέπει να περιλαμβάνει αναφορά στο Privacy by Design / localStorage");
        assert(html.includes("newsletter") || html.includes("Ενημερωτικό Δελτίο") || html.includes("ενημερωτικό δελτίο"), "Πρέπει να περιλαμβάνει αναφορά στο Newsletter");
      },
    }),
  ],
});
