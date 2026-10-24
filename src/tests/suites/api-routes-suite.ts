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
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
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
        const res = await fetchApi("/api/newsletter/subscribe", {
          method: "POST",
          headers: {
            "x-forwarded-for": "198.51.100.99",
          },
          body: JSON.stringify({ email: "invalid-email-format" }),
        });
        assertEquals(res.status, 400, "Άκυρο email πρέπει να απορρίπτεται με 400 Bad Request");
      },
    }),
  ],
});
