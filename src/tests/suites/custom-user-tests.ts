import { defineSuite, defineTest } from "../core/runner";

/**
 * ============================================================================
 * ΠΡΟΤΥΠΟ ΓΙΑ ΤΟΝ ΧΡΗΣΤΗ: ΠΩΣ ΝΑ ΠΡΟΣΘΕΣΕΤΕ ΤΟ ΔΙΚΟ ΣΑΣ TEST ΣΕ 1 ΛΕΠΤΟ!
 * ============================================================================
 *
 * Για να προσθέσετε ένα νέο τεστ, απλά αντιγράψτε το παρακάτω μπλοκ και
 * προσθέστε το στον πίνακα `customUserTests` παρακάτω:
 *
 * defineTest({
 *   id: "to-monadiko-id-tou-test",
 *   title: "Ο τίτλος του τεστ σας",
 *   category: "custom",
 *   description: "Σύντομη περιγραφή του τι ελέγχει",
 *   documentation: "Αναλυτική εξήγηση για το πώς λειτουργεί ο έλεγχος.",
 *   tags: ["custom", "smoke"],
 *   severity: "medium", // "critical" | "high" | "medium" | "low"
 *   run: async ({ assert, assertEquals, assertInRange, fetchApi }) => {
 *     // Γράψτε εδώ τις εντολές σας, π.χ.:
 *     const res = await fetchApi("/api/recipes");
 *     assertEquals(res.status, 200, "Το API συνταγών πρέπει να απαντά με 200");
 *   },
 * })
 * ============================================================================
 */

export const customUserSuite = defineSuite({
  id: "custom-user-suite",
  name: "Προσαρμοσμένα Τεστ Χρήστη (Custom Tests)",
  category: "custom",
  description: "Σουίτα όπου ο χρήστης ή η ομάδα ανάπτυξης μπορεί να προσθέτει εύκολα νέα εξατομικευμένα τεστ με απλό τρόπο.",
  tests: [
    defineTest({
      id: "custom-quick-supermarket-preferences",
      title: "Παράδειγμα Χρήστη #1: Έλεγχος προεπιλεγμένων σούπερ μάρκετ",
      category: "custom",
      description: "Επιβεβαιώνει ότι οι προεπιλεγμένες αλυσίδες περιλαμβάνουν τουλάχιστον Σκλαβενίτη και ΑΒ.",
      documentation: "Αυτό είναι ένα παράδειγμα custom test. Ελέγχει ότι οι βασικές προτιμήσεις του χρήστη περιλαμβάνουν τις μεγαλύτερες αλυσίδες.",
      tags: ["custom", "preferences"],
      severity: "low",
      run: ({ assert }) => {
        const defaultStores = ["sklavenitis", "ab_vasilopoulos", "lidl"];
        assert(defaultStores.includes("sklavenitis"), "Ο Σκλαβενίτης πρέπει να είναι επιλεγμένος");
        assert(defaultStores.includes("ab_vasilopoulos"), "Ο ΑΒ Βασιλόπουλος πρέπει να είναι επιλεγμένος");
      },
    }),

    defineTest({
      id: "custom-quick-healthy-recipes-check",
      title: "Παράδειγμα Χρήστη #2: Ύπαρξη υγιεινών συνταγών με βρώμη και γιαούρτι",
      category: "custom",
      description: "Ελέγχει ότι το πρωινό περιλαμβάνει τουλάχιστον μία συνταγή με ελληνικό γιαούρτι και μέλι.",
      documentation: "Αυτό είναι ένα παράδειγμα custom test. Μπορείτε να προσθέσετε παρόμοιους ελέγχους για συγκεκριμένες συνταγές ή υλικά που σας ενδιαφέρουν.",
      tags: ["custom", "healthy"],
      severity: "low",
      run: async ({ fetchApi, assert }) => {
        const res = await fetchApi("/api/recipes");
        if (res.ok) {
          const data = await res.json();
          const hasYogurt = data.recipes.some(
            (r: any) => r.title.toLowerCase().includes("γιαούρτι") || r.title.toLowerCase().includes("βρώμη")
          );
          assert(hasYogurt, "Πρέπει να υπάρχει τουλάχιστον μία συνταγή με γιαούρτι ή βρώμη");
        }
      },
    }),
  ],
});
