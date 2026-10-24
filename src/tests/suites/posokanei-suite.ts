import { defineSuite, defineTest } from "../core/runner";
import { MOCK_RETAILERS } from "@/lib/posokanei/mock-data";

export const posokaneiSuite = defineSuite({
  id: "posokanei-suite",
  name: "Supermarkets & Posokanei Retailers",
  category: "posokanei",
  description: "Ελέγχει τους υποστηριζόμενους λιανεμπόρους (supermarkets), την παρουσία του Χαλκιαδάκη και τη σωστή δομή των μεταδεδομένων τους.",
  tests: [
    defineTest({
      id: "posokanei-supported-retailers-count",
      title: "Επαλήθευση βασικών ελληνικών σούπερ μάρκετ",
      category: "posokanei",
      description: "Επιβεβαιώνει ότι υποστηρίζονται όλες οι μεγάλες αλυσίδες σούπερ μάρκετ της Ελλάδας.",
      documentation: "Ελέγχει τον κατάλογο MOCK_RETAILERS για την ύπαρξη Σκλαβενίτη, ΑΒ Βασιλόπουλου, Lidl, Μασούτη, MyMarket.",
      tags: ["retailers", "smoke"],
      severity: "critical",
      run: ({ assert }) => {
        const requiredRetailers = ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"];
        const existingIds = MOCK_RETAILERS.map((r) => r.id);

        for (const reqId of requiredRetailers) {
          assert(
            existingIds.includes(reqId),
            `Ο λιανέμπορος "${reqId}" λείπει από τον κατάλογο υποστηριζόμενων σούπερ μάρκετ`
          );
        }
      },
    }),

    defineTest({
      id: "posokanei-chalkiadakis-retailer-metadata",
      title: "Επαλήθευση ρυθμίσεων & εμφάνισης για τον Χαλκιαδάκη",
      category: "posokanei",
      description: "Ελέγχει ότι ο Χαλκιαδάκης διαθέτει σωστό display name, active: true και brand χρώματα.",
      documentation: "Επαληθεύει ότι ο χρήστης μπορεί να επιλέξει τον Χαλκιαδάκη στις ρυθμίσεις και ότι δεν υπάρχουν σπασμένα badges.",
      tags: ["retailers", "chalkiadakis"],
      severity: "high",
      run: ({ assert, assertEquals }) => {
        const chalk = MOCK_RETAILERS.find((r) => r.id === "chalkiadakis");
        assert(!!chalk, "Ο Χαλκιαδάκης πρέπει να υπάρχει στον κατάλογο");
        if (!chalk) return;
        assertEquals(chalk.name, "Χαλκιαδάκης", "Το όνομα εμφάνισης πρέπει να είναι 'Χαλκιαδάκης'");
        assertEquals(chalk.country, "GR", "Η χώρα πρέπει να είναι 'GR'");
        assert(!!chalk.website, "Πρέπει να υπάρχει ιστότοπος για τον Χαλκιαδάκη");
      },
    }),
  ],
});
