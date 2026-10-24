# 🧪 Τεκμηρίωση Συστήματος Ελέγχων (Testing System Documentation)

> Αυτό το έγγραφο παράγεται αυτόματα και περιλαμβάνει αναλυτικά όλα τα tests του `pioftina.gr`, τις κατηγορίες τους, τι επαληθεύει το καθένα και πώς να προσθέσετε νέα tests.

- **Σύνολο Σουιτών**: 7
- **Σύνολο Καταχωρημένων Tests**: 28
- **Τελευταία Ενημέρωση**: 24/10/2026, 6:07:02 μ.μ.

---

## 🚀 Πώς να Εκτελέσετε τα Tests

### 1. Τοπικά στη Γραμμή Εντολών (CLI)
```powershell
# Εκτέλεση όλων των tests
npm test

# Εκτέλεση μόνο μιας κατηγορίας (π.χ. recipes, optimizer, security, api)
npm test -- --category=recipes

# Εκτέλεση μόνο των smoke tests
npm test -- --tags=smoke

# Ενημέρωση του παρόντος αρχείου τεκμηρίωσης
npm run test:docs
```

### 2. Στο Vercel / Cloud Περιβάλλον
- **Μέσω Web Dashboard**: Επισκεφθείτε τη διαδρομή `/admin/tests` ή πατήστε την καρτέλα **Test Center** μέσα στο Curation Studio.
- **Μέσω API Endpoint**: Κάντε κλήση στο `/api/admin/tests` (ή `GET https://pioftina.vercel.app/api/admin/tests`) για επιστροφή δομημένου JSON.

---

## ✍️ Πώς να Προσθέσετε Δικό σας Test σε 1 Λεπτό

Ανοίξτε το αρχείο [`src/tests/suites/custom-user-tests.ts`](src/tests/suites/custom-user-tests.ts) και προσθέστε το δικό σας block:

```typescript
import { defineTest } from "../core/runner";

defineTest({
  id: "my-custom-test-id",
  title: "Ο τίτλος του τεστ σας",
  category: "custom",
  description: "Σύντομη περιγραφή του τι ελέγχει",
  documentation: "Αναλυτική εξήγηση για το πώς λειτουργεί.",
  tags: ["custom"],
  severity: "medium",
  run: async ({ assert, assertEquals, fetchApi }) => {
    const res = await fetchApi("/api/recipes");
    assertEquals(res.status, 200, "Το API πρέπει να απαντά με 200");
  },
})
```

Τρέξτε `npm test` και το νέο σας test θα εκτελεστεί αυτόματα!

---

## 📋 Πλήρης Κατάλογος Καταχωρημένων Tests

### 📁 Συνταγές & Curation Supermarket (`recipes`)
*Ελέγχει τη δομή των 80 συνταγών, τις ποσοστώσεις, το 100% curation με ελληνικά σούπερ μάρκετ και τον υπολογισμό κόστους μερίδας.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Επαλήθευση πλήθους 80 βασικών συνταγών** | `recipes-catalog-count` | 🔴 Critical | `smoke, recipes, curation` | Επαληθεύει ότι οι ενσωματωμένες συνταγές είναι τουλάχιστον 80. |
| 2 | **Ποσοστώσεις κατηγοριών (20 Πρωινά, 30 Μεσημεριανά, 20 Βραδινά, 10 Σνακ)** | `recipes-category-quotas` | 🟠 High | `recipes, regression` | Επαληθεύει την ακριβή κατανομή των συνταγών ανά γεύμα της ημέρας. |
| 3 | **100% Curation Audit στα υλικά των 80 συνταγών** | `recipes-100-percent-curation-audit` | 🔴 Critical | `critical, curation, recipes` | Επιβεβαιώνει ότι κάθε συστατικό των 80 συνταγών έχει αντιστοιχιστεί σε πραγματικό προϊόν σούπερ μάρκετ. |
| 4 | **Υπολογισμός κόστους ανά μερίδα (Cost per Serving)** | `recipes-cost-per-serving-check` | 🟠 High | `recipes, pricing, regression` | Ελέγχει ότι ο υπολογισμός κόστους μερίδας παράγει ρεαλιστικές τιμές (>0€ και <15€) για κάθε συνταγή. |
| 5 | **Έλεγχος μετρικών μονάδων και μερίδων** | `recipes-metric-units-and-servings` | 🟡 Medium | `recipes, quality` | Επαληθεύει ότι όλες οι συνταγές χρησιμοποιούν αυστηρά μετρικές μονάδες (g, kg, ml, l, τεμ) και έχουν λογικό αριθμό μερίδων. |
| 6 | **Εγκυρότητα διαδικτυακών πηγών (Reference URLs)** | `recipes-reference-urls-validity` | 🟢 Low | `recipes, sources` | Επιβεβαιώνει ότι όλες οι συνταγές διαθέτουν έγκυρο σύνδεσμο διαδικτύου από αυθεντικές ελληνικές πηγές. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`recipes-catalog-count` - Επαλήθευση πλήθους 80 βασικών συνταγών**:
  - *Σκοπός*: Επαληθεύει ότι οι ενσωματωμένες συνταγές είναι τουλάχιστον 80.
  - *Τεκμηρίωση*: Ελέγχει το μέγεθος του RAW_SEED_RECIPES και SEED_RECIPES. Εξασφαλίζει ότι καμία συνταγή δεν παραλείφθηκε κατά το build.
  - *Tags*: `smoke`, `recipes`, `curation`
- **`recipes-category-quotas` - Ποσοστώσεις κατηγοριών (20 Πρωινά, 30 Μεσημεριανά, 20 Βραδινά, 10 Σνακ)**:
  - *Σκοπός*: Επαληθεύει την ακριβή κατανομή των συνταγών ανά γεύμα της ημέρας.
  - *Τεκμηρίωση*: Ελέγχει τα επιμέρους modular αρχεία: breakfast-recipes (20), lunch-recipes (30), dinner-recipes (20), snack-recipes (10).
  - *Tags*: `recipes`, `regression`
- **`recipes-100-percent-curation-audit` - 100% Curation Audit στα υλικά των 80 συνταγών**:
  - *Σκοπός*: Επιβεβαιώνει ότι κάθε συστατικό των 80 συνταγών έχει αντιστοιχιστεί σε πραγματικό προϊόν σούπερ μάρκετ.
  - *Τεκμηρίωση*: Διασχίζει όλα τα υλικά στο SEED_RECIPES. Ελέγχει ότι i.isCurated === true και ότι υπάρχει έγκυρο curatedProduct με id και τιμή.
  - *Tags*: `critical`, `curation`, `recipes`
- **`recipes-cost-per-serving-check` - Υπολογισμός κόστους ανά μερίδα (Cost per Serving)**:
  - *Σκοπός*: Ελέγχει ότι ο υπολογισμός κόστους μερίδας παράγει ρεαλιστικές τιμές (>0€ και <15€) για κάθε συνταγή.
  - *Τεκμηρίωση*: Εκτελεί τη συνάρτηση calculateRecipeCost σε όλες τις συνταγές και επαληθεύει ότι costPerServing > 0, δεν είναι NaN και δεν ξεπερνά τα λογικά όρια.
  - *Tags*: `recipes`, `pricing`, `regression`
- **`recipes-metric-units-and-servings` - Έλεγχος μετρικών μονάδων και μερίδων**:
  - *Σκοπός*: Επαληθεύει ότι όλες οι συνταγές χρησιμοποιούν αυστηρά μετρικές μονάδες (g, kg, ml, l, τεμ) και έχουν λογικό αριθμό μερίδων.
  - *Τεκμηρίωση*: Ελέγχει servings >= 1 και <= 12, καθώς και τις μονάδες μέτρησης ώστε να μην υπάρχουν αυθαίρετες μονάδες όπως 'κούπα' ή 'κουταλιά' στα υπολογιστικά πεδία.
  - *Tags*: `recipes`, `quality`
- **`recipes-reference-urls-validity` - Εγκυρότητα διαδικτυακών πηγών (Reference URLs)**:
  - *Σκοπός*: Επιβεβαιώνει ότι όλες οι συνταγές διαθέτουν έγκυρο σύνδεσμο διαδικτύου από αυθεντικές ελληνικές πηγές.
  - *Τεκμηρίωση*: Ελέγχει ότι referenceUrl ξεκινά με http:// ή https:// και προέρχεται από αξιόπιστους culinary ιστοτόπους.
  - *Tags*: `recipes`, `sources`

---

### 📁 Μηχανή Βελτιστοποίησης & Συσκευασιών (Optimizer) (`optimizer`)
*Ελέγχει τη συνένωση υλικών της εβδομάδας, την κλιμάκωση μερίδων, τη μετατροπή μονάδων και τη σύγκριση τιμών σούπερ μάρκετ.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Συνένωση κοινών υλικών από πολλαπλά γεύματα** | `optimizer-ingredient-aggregation` | 🔴 Critical | `smoke, optimizer` | Επιβεβαιώνει ότι δύο γεύματα που περιέχουν το ίδιο υλικό αθροίζονται σε ένα ενιαίο grocery item. |
| 2 | **Κανονικοποίηση μονάδων (g -> kg, ml -> L)** | `optimizer-unit-normalization-g-to-kg` | 🟠 High | `optimizer, math` | Επαληθεύει ότι ποσότητες σε γραμμάρια μετατρέπονται σωστά σε δεκαδικά κιλά για αναζήτηση συσκευασιών. |
| 3 | **Σύγκριση συνολικού καλαθιού σούπερ μάρκετ** | `optimizer-supermarket-basket-comparison` | 🔴 Critical | `optimizer, retailers, pricing` | Ελέγχει ότι η συνάρτηση computeBasketComparisons επιστρέφει ορθές τιμές για όλες τις υποστηριζόμενες αλυσίδες. |
| 4 | **Υπολογισμός συνολικού κόστους καλαθιού και κέρδους bulk** | `optimizer-cart-totals-and-savings` | 🟠 High | `optimizer, cart` | Επιβεβαιώνει ότι το computeCartTotals υπολογίζει σωστά το remainingCost και το totalSavings. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`optimizer-ingredient-aggregation` - Συνένωση κοινών υλικών από πολλαπλά γεύματα**:
  - *Σκοπός*: Επιβεβαιώνει ότι δύο γεύματα που περιέχουν το ίδιο υλικό αθροίζονται σε ένα ενιαίο grocery item.
  - *Τεκμηρίωση*: Δημιουργεί 2 slots με συνταγές που περιέχουν ελαιόλαδο. Επαληθεύει ότι το aggregateIngredients παράγει μία μόνο εγγραφή με άθροισμα ποσοτήτων.
  - *Tags*: `smoke`, `optimizer`
- **`optimizer-unit-normalization-g-to-kg` - Κανονικοποίηση μονάδων (g -> kg, ml -> L)**:
  - *Σκοπός*: Επαληθεύει ότι ποσότητες σε γραμμάρια μετατρέπονται σωστά σε δεκαδικά κιλά για αναζήτηση συσκευασιών.
  - *Τεκμηρίωση*: Ελέγχει ότι 500g γίνονται 0.5kg και 1000ml γίνονται 1.0L, επιτρέποντας σωστή διαίρεση με τα μεγέθη συσκευασιών του σούπερ μάρκετ.
  - *Tags*: `optimizer`, `math`
- **`optimizer-supermarket-basket-comparison` - Σύγκριση συνολικού καλαθιού σούπερ μάρκετ**:
  - *Σκοπός*: Ελέγχει ότι η συνάρτηση computeBasketComparisons επιστρέφει ορθές τιμές για όλες τις υποστηριζόμενες αλυσίδες.
  - *Τεκμηρίωση*: Εκτελεί σύγκριση καλαθιού με mock grocery items και ελέγχει ότι δεν παράγονται αρνητικές τιμές ή NaN.
  - *Tags*: `optimizer`, `retailers`, `pricing`
- **`optimizer-cart-totals-and-savings` - Υπολογισμός συνολικού κόστους καλαθιού και κέρδους bulk**:
  - *Σκοπός*: Επιβεβαιώνει ότι το computeCartTotals υπολογίζει σωστά το remainingCost και το totalSavings.
  - *Τεκμηρίωση*: Ελέγχει ότι purchased items αφαιρούνται σωστά από το remainingCost και προστίθενται στο purchasedCost.
  - *Tags*: `optimizer`, `cart`

---

### 📁 Ασφάλεια, Rate Limiting & Admin Tokens (`security`)
*Ελέγχει τον μηχανισμό προστασίας rate limiting ανά IP, το cooldown συνεχόμενων αιτημάτων, την κρυπτογραφική υπογραφή των admin sessions και την cache αναζητήσεων.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Έλεγχος sliding-window Rate Limiter ανά IP** | `security-rate-limiter-sliding-window` | 🔴 Critical | `security, rate-limit` | Επαληθεύει ότι ο rate limiter επιτρέπει αιτήματα εντός του ορίου και μπλοκάρει όταν ξεπεραστεί. |
| 2 | **Επιβολή cooldown μεταξύ συνεχόμενων αιτημάτων** | `security-rate-limiter-cooldown` | 🟠 High | `security, anti-thrashing` | Επαληθεύει ότι δύο αιτήματα στο ίδιο millisecond απορρίπτονται αν το cooldownMs > 0. |
| 3 | **Κρυπτογραφική υπογραφή και επικύρωση Admin Token** | `security-admin-auth-hmac-token` | 🔴 Critical | `security, admin, auth` | Ελέγχει ότι το createAdminToken δημιουργεί έγκυρο HMAC-signed token και ότι το verifyAdminToken το επικυρώνει. |
| 4 | **Απόρριψη παραποιημένου ή ληγμένου Admin Token** | `security-admin-tampered-token-rejection` | 🔴 Critical | `security, admin` | Επιβεβαιώνει ότι οποιοδήποτε πλαστό ή αλλοιωμένο HMAC token απορρίπτεται άμεσα. |
| 5 | **In-Memory Search Cache (10m TTL & Deduplication)** | `security-posokanei-search-cache-ttl` | 🟠 High | `posokanei, performance, cache` | Επαληθεύει ότι η search cache αποθηκεύει και ανακτά αποτελέσματα χωρίς περιττά HTTP calls. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`security-rate-limiter-sliding-window` - Έλεγχος sliding-window Rate Limiter ανά IP**:
  - *Σκοπός*: Επαληθεύει ότι ο rate limiter επιτρέπει αιτήματα εντός του ορίου και μπλοκάρει όταν ξεπεραστεί.
  - *Τεκμηρίωση*: Εκτελεί διαδοχικές κλήσεις checkRateLimit με μοναδικό test IP. Ελέγχει ότι allowed === true για τα πρώτα 3 αιτήματα και allowed === false στο 4ο.
  - *Tags*: `security`, `rate-limit`
- **`security-rate-limiter-cooldown` - Επιβολή cooldown μεταξύ συνεχόμενων αιτημάτων**:
  - *Σκοπός*: Επαληθεύει ότι δύο αιτήματα στο ίδιο millisecond απορρίπτονται αν το cooldownMs > 0.
  - *Τεκμηρίωση*: Εκτελεί 2 ταυτόχρονες κλήσεις με cooldownMs: 500ms. Το 2ο πρέπει να απορριφθεί άμεσα λόγω cooldown.
  - *Tags*: `security`, `anti-thrashing`
- **`security-admin-auth-hmac-token` - Κρυπτογραφική υπογραφή και επικύρωση Admin Token**:
  - *Σκοπός*: Ελέγχει ότι το createAdminToken δημιουργεί έγκυρο HMAC-signed token και ότι το verifyAdminToken το επικυρώνει.
  - *Τεκμηρίωση*: Ελέγχει τη δομή timestamp:hmac και επιβεβαιώνει ότι παράγεται timing-safe επαλήθευση με το ADMIN_SECRET_KEY.
  - *Tags*: `security`, `admin`, `auth`
- **`security-admin-tampered-token-rejection` - Απόρριψη παραποιημένου ή ληγμένου Admin Token**:
  - *Σκοπός*: Επιβεβαιώνει ότι οποιοδήποτε πλαστό ή αλλοιωμένο HMAC token απορρίπτεται άμεσα.
  - *Τεκμηρίωση*: Δοκιμάζει κενό token, τυχαίο string, token με αλλοιωμένο timestamp και token με λάθος signature.
  - *Tags*: `security`, `admin`
- **`security-posokanei-search-cache-ttl` - In-Memory Search Cache (10m TTL & Deduplication)**:
  - *Σκοπός*: Επαληθεύει ότι η search cache αποθηκεύει και ανακτά αποτελέσματα χωρίς περιττά HTTP calls.
  - *Τεκμηρίωση*: Ελέγχει get/set στη searchCache και επιβεβαιώνει ότι η cache επιστρέφει ακριβώς τα αποθηκευμένα αντικείμενα.
  - *Tags*: `posokanei`, `performance`, `cache`

---

### 📁 API Endpoints & HTTP Διαδρομές (`api`)
*Ελέγχει τη λειτουργία των HTTP endpoints, τον διαχωρισμό public/protected routes και την απόκριση των APIs.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Δημόσια πρόσβαση στο GET /api/recipes** | `api-recipes-get-public` | 🔴 Critical | `smoke, api` | Επιβεβαιώνει ότι οποιοσδήποτε επισκέπτης μπορεί να διαβάσει τις συνταγές χωρίς authentication. |
| 2 | **Προστασία POST /api/recipes/import από μη εξουσιοδοτημένους χρήστες** | `api-recipes-import-unauthorized-rejection` | 🔴 Critical | `security, api, admin` | Επιβεβαιώνει ότι κλήση εισαγωγής συνταγής χωρίς admin cookie/token απορρίπτεται με 401 Unauthorized. |
| 3 | **Προστασία DELETE /api/recipes από μη εξουσιοδοτημένους χρήστες** | `api-recipes-delete-unauthorized-rejection` | 🟠 High | `security, api` | Επιβεβαιώνει ότι διαγραφή συνταγής απαιτεί αυστηρά δικαιώματα διαχειριστή. |
| 4 | **Εγγραφή στο Newsletter με έγκυρο email** | `api-newsletter-subscribe-valid-email` | 🟠 High | `newsletter, api` | Επαληθεύει ότι αποστέλλοντας έγκυρο email στο /api/newsletter/subscribe λαμβάνουμε 200 OK. |
| 5 | **Απόρριψη άκυρης διεύθυνσης email στο Newsletter** | `api-newsletter-subscribe-invalid-email-rejection` | 🟡 Medium | `newsletter, validation` | Ελέγχει ότι μορφές όπως 'invalid-email', 'user@', '@domain.com' απορρίπτονται με 400 Bad Request. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`api-recipes-get-public` - Δημόσια πρόσβαση στο GET /api/recipes**:
  - *Σκοπός*: Επιβεβαιώνει ότι οποιοσδήποτε επισκέπτης μπορεί να διαβάσει τις συνταγές χωρίς authentication.
  - *Τεκμηρίωση*: Εκτελεί GET /api/recipes και ελέγχει ότι επιστρέφει status 200 και array με τουλάχιστον 80 συνταγές.
  - *Tags*: `smoke`, `api`
- **`api-recipes-import-unauthorized-rejection` - Προστασία POST /api/recipes/import από μη εξουσιοδοτημένους χρήστες**:
  - *Σκοπός*: Επιβεβαιώνει ότι κλήση εισαγωγής συνταγής χωρίς admin cookie/token απορρίπτεται με 401 Unauthorized.
  - *Τεκμηρίωση*: Στέλνει POST /api/recipes/import χωρίς Authorization header ή session cookie και ελέγχει status 401.
  - *Tags*: `security`, `api`, `admin`
- **`api-recipes-delete-unauthorized-rejection` - Προστασία DELETE /api/recipes από μη εξουσιοδοτημένους χρήστες**:
  - *Σκοπός*: Επιβεβαιώνει ότι διαγραφή συνταγής απαιτεί αυστηρά δικαιώματα διαχειριστή.
  - *Τεκμηρίωση*: Στέλνει DELETE /api/recipes?id=moussaka χωρίς admin credentials και ελέγχει status 401.
  - *Tags*: `security`, `api`
- **`api-newsletter-subscribe-valid-email` - Εγγραφή στο Newsletter με έγκυρο email**:
  - *Σκοπός*: Επαληθεύει ότι αποστέλλοντας έγκυρο email στο /api/newsletter/subscribe λαμβάνουμε 200 OK.
  - *Τεκμηρίωση*: Στέλνει POST αίτημα με μοναδικό email δοκιμής και θέματα ενδιαφέροντος.
  - *Tags*: `newsletter`, `api`
- **`api-newsletter-subscribe-invalid-email-rejection` - Απόρριψη άκυρης διεύθυνσης email στο Newsletter**:
  - *Σκοπός*: Ελέγχει ότι μορφές όπως 'invalid-email', 'user@', '@domain.com' απορρίπτονται με 400 Bad Request.
  - *Τεκμηρίωση*: Στέλνει POST με άκυρο email string και επιβεβαιώνει ότι δεν αποθηκεύεται τίποτα.
  - *Tags*: `newsletter`, `validation`

---

### 📁 Supermarkets & Posokanei Retailers (`posokanei`)
*Ελέγχει τους υποστηριζόμενους λιανεμπόρους (supermarkets), την παρουσία του Χαλκιαδάκη και τη σωστή δομή των μεταδεδομένων τους.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Επαλήθευση βασικών ελληνικών σούπερ μάρκετ** | `posokanei-supported-retailers-count` | 🔴 Critical | `retailers, smoke` | Επιβεβαιώνει ότι υποστηρίζονται όλες οι μεγάλες αλυσίδες σούπερ μάρκετ της Ελλάδας. |
| 2 | **Επαλήθευση ρυθμίσεων & εμφάνισης για τον Χαλκιαδάκη** | `posokanei-chalkiadakis-retailer-metadata` | 🟠 High | `retailers, chalkiadakis` | Ελέγχει ότι ο Χαλκιαδάκης διαθέτει σωστό display name, active: true και brand χρώματα. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`posokanei-supported-retailers-count` - Επαλήθευση βασικών ελληνικών σούπερ μάρκετ**:
  - *Σκοπός*: Επιβεβαιώνει ότι υποστηρίζονται όλες οι μεγάλες αλυσίδες σούπερ μάρκετ της Ελλάδας.
  - *Τεκμηρίωση*: Ελέγχει τον κατάλογο MOCK_RETAILERS για την ύπαρξη Σκλαβενίτη, ΑΒ Βασιλόπουλου, Lidl, Μασούτη, MyMarket.
  - *Tags*: `retailers`, `smoke`
- **`posokanei-chalkiadakis-retailer-metadata` - Επαλήθευση ρυθμίσεων & εμφάνισης για τον Χαλκιαδάκη**:
  - *Σκοπός*: Ελέγχει ότι ο Χαλκιαδάκης διαθέτει σωστό display name, active: true και brand χρώματα.
  - *Τεκμηρίωση*: Επαληθεύει ότι ο χρήστης μπορεί να επιλέξει τον Χαλκιαδάκη στις ρυθμίσεις και ότι δεν υπάρχουν σπασμένα badges.
  - *Tags*: `retailers`, `chalkiadakis`

---

### 📁 Εξαγωγή & Αποθήκευση στον Υπολογιστή (Save to PC) (`export`)
*Δοκιμές για την ορθή παραγωγή του εβδομαδιαίου πλάνου και της λίστας αγορών σε αρχείο .txt, εκτυπώσιμο HTML/PDF και JSON backup.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Ορθή παραγωγή αρχείου κειμένου (.txt) με πλήρες πρόγραμμα και λίστα** | `TEST-EXP-01` | 🟠 High | `export, text, week-plan, grocery-list` | Επαληθεύει ότι το παραγόμενο αρχείο κειμένου περιέχει τις 7 ημέρες, τα προγραμματισμένα γεύματα με μερίδες, και τα είδη της λίστας με κουτάκια [ ]. |
| 2 | **Εκτυπώσιμη HTML διάταξη (A4 Print / Save as PDF)** | `TEST-EXP-02` | 🟠 High | `export, html, print, pdf` | Ελέγχει ότι η παραγόμενη σελίδα HTML για εκτύπωση είναι έγκυρη, περιέχει @media print styles και πίνακα γευμάτων. |
| 3 | **Ανθεκτικότητα σε κενό πλάνο & κενή λίστα αγορών** | `TEST-EXP-03` | 🟡 Medium | `export, resilience, edge-case` | Επιβεβαιώνει ότι η εξαγωγή δεν καταρρέει ακόμη κι αν ο χρήστης δεν έχει επιλέξει κανένα γεύμα ή αν η λίστα είναι κενή. |
| 4 | **Εγκυρότητα δομής ψηφιακού αντιγράφου JSON Backup** | `TEST-EXP-04` | 🟡 Medium | `export, json, backup` | Επαληθεύει ότι τα δεδομένα πλάνου και ρυθμίσεων μπορούν να σειριοποιηθούν σε JSON χωρίς circular references. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`TEST-EXP-01` - Ορθή παραγωγή αρχείου κειμένου (.txt) με πλήρες πρόγραμμα και λίστα**:
  - *Σκοπός*: Επαληθεύει ότι το παραγόμενο αρχείο κειμένου περιέχει τις 7 ημέρες, τα προγραμματισμένα γεύματα με μερίδες, και τα είδη της λίστας με κουτάκια [ ].
  - *Τεκμηρίωση*: Η συνάρτηση generatePlanAndShoppingListText πρέπει να επιστρέφει ένα πλήρες, δομημένο κείμενο UTF-8 με διαχωριστικά και σύνολα.
  - *Tags*: `export`, `text`, `week-plan`, `grocery-list`
- **`TEST-EXP-02` - Εκτυπώσιμη HTML διάταξη (A4 Print / Save as PDF)**:
  - *Σκοπός*: Ελέγχει ότι η παραγόμενη σελίδα HTML για εκτύπωση είναι έγκυρη, περιέχει @media print styles και πίνακα γευμάτων.
  - *Τεκμηρίωση*: Το HTML έγγραφο πρέπει να είναι αυτόνομο με inline CSS για άμεση εκτύπωση ή εξαγωγή σε PDF χωρίς εξωτερικές εξαρτήσεις.
  - *Tags*: `export`, `html`, `print`, `pdf`
- **`TEST-EXP-03` - Ανθεκτικότητα σε κενό πλάνο & κενή λίστα αγορών**:
  - *Σκοπός*: Επιβεβαιώνει ότι η εξαγωγή δεν καταρρέει ακόμη κι αν ο χρήστης δεν έχει επιλέξει κανένα γεύμα ή αν η λίστα είναι κενή.
  - *Τεκμηρίωση*: Πρέπει να εμφανίζονται επεξηγηματικά μηνύματα κενής κατάστασης χωρίς uncaught errors.
  - *Tags*: `export`, `resilience`, `edge-case`
- **`TEST-EXP-04` - Εγκυρότητα δομής ψηφιακού αντιγράφου JSON Backup**:
  - *Σκοπός*: Επαληθεύει ότι τα δεδομένα πλάνου και ρυθμίσεων μπορούν να σειριοποιηθούν σε JSON χωρίς circular references.
  - *Τεκμηρίωση*: Το JSON backup επιτρέπει την τοπική αποθήκευση του πλήρους configuration του χρήστη.
  - *Tags*: `export`, `json`, `backup`

---

### 📁 Προσαρμοσμένα Τεστ Χρήστη (Custom Tests) (`custom`)
*Σουίτα όπου ο χρήστης ή η ομάδα ανάπτυξης μπορεί να προσθέτει εύκολα νέα εξατομικευμένα τεστ με απλό τρόπο.*

| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |
|---|---|---|---|---|---|
| 1 | **Παράδειγμα Χρήστη #1: Έλεγχος προεπιλεγμένων σούπερ μάρκετ** | `custom-quick-supermarket-preferences` | 🟢 Low | `custom, preferences` | Επιβεβαιώνει ότι οι προεπιλεγμένες αλυσίδες περιλαμβάνουν τουλάχιστον Σκλαβενίτη και ΑΒ. |
| 2 | **Παράδειγμα Χρήστη #2: Ύπαρξη υγιεινών συνταγών με βρώμη και γιαούρτι** | `custom-quick-healthy-recipes-check` | 🟢 Low | `custom, healthy` | Ελέγχει ότι το πρωινό περιλαμβάνει τουλάχιστον μία συνταγή με ελληνικό γιαούρτι και μέλι. |

#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:
- **`custom-quick-supermarket-preferences` - Παράδειγμα Χρήστη #1: Έλεγχος προεπιλεγμένων σούπερ μάρκετ**:
  - *Σκοπός*: Επιβεβαιώνει ότι οι προεπιλεγμένες αλυσίδες περιλαμβάνουν τουλάχιστον Σκλαβενίτη και ΑΒ.
  - *Τεκμηρίωση*: Αυτό είναι ένα παράδειγμα custom test. Ελέγχει ότι οι βασικές προτιμήσεις του χρήστη περιλαμβάνουν τις μεγαλύτερες αλυσίδες.
  - *Tags*: `custom`, `preferences`
- **`custom-quick-healthy-recipes-check` - Παράδειγμα Χρήστη #2: Ύπαρξη υγιεινών συνταγών με βρώμη και γιαούρτι**:
  - *Σκοπός*: Ελέγχει ότι το πρωινό περιλαμβάνει τουλάχιστον μία συνταγή με ελληνικό γιαούρτι και μέλι.
  - *Τεκμηρίωση*: Αυτό είναι ένα παράδειγμα custom test. Μπορείτε να προσθέσετε παρόμοιους ελέγχους για συγκεκριμένες συνταγές ή υλικά που σας ενδιαφέρουν.
  - *Tags*: `custom`, `healthy`

---
