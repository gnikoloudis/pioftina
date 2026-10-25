# 🛡️ Τεκμηρίωση Κανόνων Ασφαλείας & Penetration Testing (OWASP Security Audit)

> Αυτό το έγγραφο παράγεται αυτόματα και περιλαμβάνει αναλυτικά όλους τους κανόνες ασφαλείας του `pioftina.gr`, τις κατηγορίες OWASP Top 10, το μοντέλο απειλών (Threat Impact) και οδηγίες επίλυσης (Remediation).

- **Σύνολο Κανόνων Ασφαλείας**: 32
- **Πρότυπα Συμμόρφωσης**: OWASP Top 10 (2021/2025), OWASP ASVS v4.0, CWE Standards
- **Τελευταία Ενημέρωση**: 25/10/2026, 2:12:33 μ.μ.

---

## 🚀 Πώς να Εκτελέσετε το Penetration Test Tool

### 1. Στη Γραμμή Εντολών (CLI)
```powershell
# Εκτέλεση όλων των ελέγχων ασφαλείας & βαθμολόγηση
npm run pentest

# Εκτέλεση συγκεκριμένης κατηγορίας (π.χ. A10_SSRF, A05_SECURITY_MISCONFIG, A07_AUTH_FAILURES)
npm run pentest -- --category=A10_SSRF

# Εκτέλεση μόνο κρίσιμων ελέγχων (critical)
npm run pentest -- --severity=critical

# Ενημέρωση του παρόντος εγγράφου τεκμηρίωσης
npm run pentest:docs
```

### 2. Στο Web App & Vercel Dashboard
- **In-App Dashboard**: Μεταβείτε στη διαδρομή `/admin/tests` και επιλέξτε την καρτέλα **Security & Pentest Audit**.
- **Serverless API Endpoint**: Κάντε κλήση στο `/api/admin/security` (ή `GET https://pioftina.vercel.app/api/admin/security`) για επιστροφή δομημένης αναφοράς JSON.

---

## ✍️ Πώς να Προσθέσετε Δικό σας Κανόνα Ασφαλείας σε 1 Λεπτό

Ανοίξτε το αρχείο [`src/tests/security/custom-security-rules.ts`](src/tests/security/custom-security-rules.ts) και προσθέστε το δικό σας block:

```typescript
import { defineSecurityRule } from "./types";

defineSecurityRule({
  id: "SEC-CUST-CUSTOM-CHECK",
  title: "Ο τίτλος του ελέγχου σας",
  owaspCategory: "A05_SECURITY_MISCONFIG",
  cwe: "CWE-693",
  severity: "medium",
  description: "Σύντομη περιγραφή του τι ελέγχει.",
  threatImpact: "Ποιος είναι ο κίνδυνος αν αποτύχει.",
  remediation: "Πώς διορθώνεται η αδυναμία.",
  execute: async ({ fetchApi, assert, assertEquals }) => {
    const res = await fetchApi("/api/some-endpoint");
    assert(res.status !== 500, "Το endpoint δεν πρέπει να καταρρέει");
  },
})
```

Τρέξτε `npm run pentest` και ο νέος σας κανόνας θα εκτελεστεί αυτόματα!

---

## 📋 Πλήρης Κατάλογος Κανόνων Ασφαλείας & Ευπαθειών

### 🛡️ [A05:2021] Εσφαλμένη Ρύθμιση Ασφαλείας (Security Misconfiguration)
*Επαλήθευση HTTP security headers (CSP, HSTS, X-Frame-Options), cookies και απουσία stack traces.*

#### `SEC-HDR-XCTO` — Προστασία MIME-Sniffing (X-Content-Type-Options: nosniff)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-693](https://cwe.mitre.org/data/definitions/693.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι ο διακομιστής στέλνει την κεφαλίδα 'X-Content-Type-Options: nosniff' σε όλες τις απαντήσεις.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς αυτή την κεφαλίδα, παλαιότεροι ή κακόβουλοι browsers μπορούν να εκτελέσουν αρχεία κειμένου/εικόνων ως JavaScript (MIME Confusion Attack).
- **Οδηγίες Επίλυσης (Remediation)**: Ρυθμίστε στο next.config.ts την κεφαλίδα X-Content-Type-Options με τιμή 'nosniff'.
- **Tags**: `headers`, `mime`, `owasp-a05`

#### `SEC-HDR-XFO` — Προστασία Clickjacking (X-Frame-Options: DENY)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι η ιστοσελίδα απαγορεύει την ενσωμάτωσή της μέσα σε <iframe> άλλων ιστότοπων.
- **Μοντέλο Απειλής (Threat Impact)**: Επιτιθέμενοι μπορούν να τοποθετήσουν την εφαρμογή μέσα σε διαφανές iframe και να ξεγελάσουν τον χρήστη ώστε να πατήσει κουμπιά αγορών ή διαγραφής (Clickjacking / UI Redress).
- **Οδηγίες Επίλυσης (Remediation)**: Ρυθμίστε την κεφαλίδα X-Frame-Options σε 'DENY' ή 'SAMEORIGIN' στο next.config.ts.
- **Tags**: `headers`, `clickjacking`, `owasp-a05`

#### `SEC-HDR-HSTS` — Επιβολή Κρυπτογραφημένου HTTPS (Strict-Transport-Security)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι αποστέλλεται η οδηγία HSTS για υποχρεωτική επικοινωνία αποκλειστικά μέσω κρυπτογραφημένου HTTPS.
- **Μοντέλο Απειλής (Threat Impact)**: Αποτρέπει επιθέσεις Man-In-The-Middle (MITM) και SSL-stripping όπου ένας ενδιάμεσος υποβιβάζει τη σύνδεση σε μη κρυπτογραφημένο HTTP.
- **Οδηγίες Επίλυσης (Remediation)**: Προσθέστε 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' στις κεφαλίδες του Next.js.
- **Tags**: `headers`, `hsts`, `ssl`, `owasp-a05`

#### `SEC-HDR-RP` — Προστασία Διαρροής Συνδέσμων (Referrer-Policy)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι η κεφαλίδα Referrer-Policy προστατεύει ευαίσθητα URLs και query parameters κατά την πλοήγηση σε τρίτους ιστοτόπους.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς αυστηρό Referrer-Policy, παράμετροι αναζητήσεων, tokens ή εσωτερικά IDs διαδρομών μπορούν να διαρρεύσουν στα logs τρίτων διακομιστών.
- **Οδηγίες Επίλυσης (Remediation)**: Ρυθμίστε 'Referrer-Policy: strict-origin-when-cross-origin' στο next.config.ts.
- **Tags**: `headers`, `referrer`, `privacy`, `owasp-a05`

#### `SEC-HDR-PP` — Περιορισμός Δικαιωμάτων Browser (Permissions-Policy)
- **Σοβαρότητα**: 🟢 **LOW**
- **Πρότυπο CWE**: [CWE-693](https://cwe.mitre.org/data/definitions/693.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι ευαίσθητα περιφερειακά του επισκέπτη (κάμερα, μικρόφωνο, γεωεντοπισμός) απενεργοποιούνται ρητά.
- **Μοντέλο Απειλής (Threat Impact)**: Αν κάποιο τρίτο script ενσωματωθεί κακόβουλα, δεν θα έχει άδεια πρόσβασης στο μικρόφωνο, στην κάμερα ή στη γεωγραφική θέση του χρήστη.
- **Οδηγίες Επίλυσης (Remediation)**: Προσθέστε 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()' στο next.config.ts.
- **Tags**: `headers`, `permissions`, `owasp-a05`

#### `SEC-HDR-NO-PWR` — Απόκρυψη Ταυτότητας Διακομιστή (X-Powered-By Suppression)
- **Σοβαρότητα**: 🟢 **LOW**
- **Πρότυπο CWE**: [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι ο διακομιστής δεν εκθέτει κεφαλίδες όπως 'X-Powered-By' που αποκαλύπτουν εκδόσεις τεχνολογιών.
- **Μοντέλο Απειλής (Threat Impact)**: Η αποκάλυψη της ακριβούς τεχνολογίας και έκδοσης (π.χ. Express, Next.js x.y.z) επιτρέπει σε εισβολείς να στοχεύσουν γνωστές ευπάθειες CVE της έκδοσης.
- **Οδηγίες Επίλυσης (Remediation)**: Απενεργοποιήστε το X-Powered-By μέσω 'poweredByHeader: false' στο next.config.ts.
- **Tags**: `headers`, `fingerprinting`, `owasp-a05`

#### `SEC-AUTH-COOKIE-FLAGS` — Ασφάλεια Cookie Συνεδρίας (HttpOnly & SameSite Protection)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-1004](https://cwe.mitre.org/data/definitions/1004.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι το cookie διαχειριστή 'pioftina_admin_session' ρυθμίζεται με HttpOnly και SameSite για αποτροπή κλοπής μέσω XSS ή CSRF.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς HttpOnly, ένα σενάριο XSS μπορεί να διαβάσει το document.cookie και να κλέψει το session token του διαχειριστή.
- **Οδηγίες Επίλυσης (Remediation)**: Ορίζετε πάντα httpOnly: true, sameSite: 'lax' ή 'strict' και secure: true στην παραγωγή.
- **Tags**: `auth`, `cookies`, `httponly`, `csrf`, `owasp-a05`

#### `SEC-ACL-METHOD-NOT-ALLOWED` — Απόρριψη Μη Υποστηριζόμενων HTTP Μεθόδων (Method Not Allowed 405)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-650](https://cwe.mitre.org/data/definitions/650.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι μη υποστηριζόμενες μέθοδοι (όπως PUT/PATCH σε endpoints που δέχονται μόνο GET/POST) απορρίπτονται με 405 Method Not Allowed.
- **Μοντέλο Απειλής (Threat Impact)**: Απροσδόκητες HTTP μέθοδοι μπορούν να παρακάμψουν φίλτρα ελέγχου πρόσβασης αν ο server δεν τις απορρίπτει ρητά.
- **Οδηγίες Επίλυσης (Remediation)**: Ορίστε ρητά τις επιτρεπόμενες μεθόδους (GET, POST κτλ.) και απορρίπτετε όλες τις υπόλοιπες με HTTP 405.
- **Tags**: `acl`, `http-methods`, `owasp-a05`

#### `SEC-LEAK-STACK-TRACE` — Αποτροπή Διαρροής Stack Traces & Εσωτερικών Paths
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-209](https://cwe.mitre.org/data/definitions/209.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι οι αποκρίσεις σφαλμάτων (4xx, 5xx) δεν εκθέτουν stack traces, ονόματα αρχείων του διακομιστή ή εσωτερικές διαδρομές Node.js.
- **Μοντέλο Απειλής (Threat Impact)**: Η διαρροή stack traces αποκαλύπτει τη δομή φακέλων, εκδόσεις βιβλιοθηκών και εσωτερικά ονόματα συναρτήσεων, βοηθώντας τον επιτιθέμενο να σχεδιάσει στοχευμένες επιθέσεις.
- **Οδηγίες Επίλυσης (Remediation)**: Αποκρύπτετε τα raw exception messages στην παραγωγή και επιστρέφετε γενικά, φιλικά μηνύματα σφάλματος.
- **Tags**: `data-leakage`, `stack-trace`, `owasp-a05`

#### `SEC-CUST-FORM-AUTOFILL-ATTRIBUTES` — Προσαρμοσμένος Έλεγχος: Αναγνωριστικά Autofill (id, name) & Όριο 255 Χαρακτήρων
- **Σοβαρότητα**: 🟢 **LOW**
- **Πρότυπο CWE**: [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι όλα τα πεδία εισαγωγής φορμών διαθέτουν αναγνωριστικά id και name για τη λειτουργία browser autofill, καθώς και όριο μήκους 255 χαρακτήρων.
- **Μοντέλο Απειλής (Threat Impact)**: Φόρμες χωρίς id/name αποτρέπουν τη σωστή αυτόματη συμπλήρωση από τον browser, ενώ η απουσία ορίου χαρακτήρων εκθέτει σε DoS / client crash.
- **Οδηγίες Επίλυσης (Remediation)**: Ορίστε μοναδικό id, name='email', autoComplete='email' και maxLength={255} στο form field.
- **Tags**: `custom`, `autofill`, `form-fields`, `minor-finding`, `owasp-a05`

### 🛡️ [A02:2021] Κρυπτογραφικές Αστοχίες (Cryptographic Failures)
*Έλεγχος γνησιότητας ψηφιακών υπογραφών HMAC, προστασία από timing attacks και διαρροή μυστικών κλειδιών.*

#### `SEC-AUTH-HMAC-VERIFY` — Κρυπτογραφική Επαλήθευση HMAC-SHA256 Admin Token
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-326](https://cwe.mitre.org/data/definitions/326.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι οι συνεδρίες διαχειριστή προστατεύονται από αυθεντική κρυπτογραφική υπογραφή HMAC με μυστικό κλειδί.
- **Μοντέλο Απειλής (Threat Impact)**: Αν τα tokens δεν υπογράφονται κρυπτογραφικά, ο οποιοσδήποτε μπορεί να κατασκευάσει πλαστά διαχειριστικά tokens και να αποκτήσει πλήρη έλεγχο της εφαρμογής.
- **Οδηγίες Επίλυσης (Remediation)**: Χρησιμοποιείτε πάντα crypto.createHmac('sha256', secret) με υψηλής εντροπίας μυστικό κλειδί.
- **Tags**: `auth`, `crypto`, `hmac`, `owasp-a02`

### 🛡️ [A07:2021] Αστοχίες Ταυτοποίησης (Identification & Authentication Failures)
*Έλεγχος διαχείρισης συνεδριών admin, λήξης tokens και προστασίας από brute force.*

#### `SEC-AUTH-TAMPER-REJECT` — Απόρριψη Παραποιημένων Tokens (Tamper Resistance)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-353](https://cwe.mitre.org/data/definitions/353.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι οποιαδήποτε τροποποίηση έστω και ενός χαρακτήρα στο payload ή στο HMAC προκαλεί άμεση απόρριψη.
- **Μοντέλο Απειλής (Threat Impact)**: Αποτρέπει επιθέσεις tampering και privilege escalation όπου ο εισβολέας τροποποιεί τα δεδομένα της συνεδρίας.
- **Οδηγίες Επίλυσης (Remediation)**: Απορρίπτετε άμεσα οποιοδήποτε token του οποίου το hash δεν ταυτίζεται επακριβώς με το αναμενόμενο HMAC.
- **Tags**: `auth`, `tamper-resistance`, `owasp-a07`

#### `SEC-AUTH-EXPIRE-REJECT` — Επιβολή Χρονικής Λήξης Συνεδρίας (Max 24h Expiry)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-613](https://cwe.mitre.org/data/definitions/613.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι παλιά tokens άνω των 24 ωρών ακυρώνονται αυτόματα ακόμα κι αν η υπογραφή τους ήταν έγκυρη.
- **Μοντέλο Απειλής (Threat Impact)**: Αν τα tokens δεν λήγουν, ένα διαρρεύσαν token μπορεί να χρησιμοποιείται επ' άπειρον από εισβολείς (Replay Attack).
- **Οδηγίες Επίλυσης (Remediation)**: Ελέγχετε πάντα τη διαφορά Date.now() - timestamp ώστε να μην υπερβαίνει το μέγιστο όριο ζωής της συνεδρίας.
- **Tags**: `auth`, `session-expiry`, `owasp-a07`

#### `SEC-AUTH-BRUTEFORCE` — Προστασία Brute-Force Σύνδεσης Διαχειριστή (Login Throttling)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-307](https://cwe.mitre.org/data/definitions/307.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι η διαδρομή /api/admin/auth μπλοκάρει επιθέσεις λεξικού και αυτοματοποιημένες απόπειρες μαντέματος κωδικού με HTTP 429.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς rate limiting, επιτιθέμενοι μπορούν να δοκιμάσουν εκατομμύρια πιθανούς κωδικούς το δευτερόλεπτο μέχρι να βρουν τον σωστό.
- **Οδηγίες Επίλυσης (Remediation)**: Εφαρμόστε sliding window rate limiting (π.χ. μέγιστο 10 προσπάθειες ανά 5 λεπτά) στο authentication endpoint.
- **Tags**: `auth`, `brute-force`, `rate-limit`, `owasp-a07`

#### `SEC-LEAK-DEFAULT-SECRET` — Έλεγχος Προεπιλεγμένου Μυστικού Κλειδιού (Admin Secret Key)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-798](https://cwe.mitre.org/data/definitions/798.html)
- **Περιγραφή Ελέγχου**: Ελέγχει αν έχει ρυθμιστεί προσαρμοσμένο ADMIN_SECRET_KEY στο περιβάλλον παραγωγής αντί για το προεπιλεγμένο αναπτυξιακό κλειδί.
- **Μοντέλο Απειλής (Threat Impact)**: Αν μια εφαρμογή παραγωγής χρησιμοποιεί το γνωστό προεπιλεγμένο μυστικό κλειδί, οποιοσδήποτε μπορεί να συνδεθεί ως διαχειριστής.
- **Οδηγίες Επίλυσης (Remediation)**: Ορίστε τη μεταβλητή περιβάλλοντος ADMIN_SECRET_KEY στο αρχείο .env.local ή στο Vercel Dashboard με έναν ισχυρό, τυχαίο κωδικό.
- **Tags**: `secrets`, `admin-key`, `owasp-a07`

### 🛡️ [A01:2021] Παραβίαση Ελέγχου Πρόσβασης (Broken Access Control)
*Έλεγχος αποτροπής μη εξουσιοδοτημένης πρόσβασης σε προστατευμένα API και διαχειριστικές λειτουργίες.*

#### `SEC-ACL-RECIPES-WRITE-UNAUTH` — Προστασία Εγγραφής Συνταγών (POST /api/recipes 401)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-285](https://cwe.mitre.org/data/definitions/285.html)
- **Περιγραφή Ελέγχου**: Επιβεβαιώνει ότι οποιαδήποτε απόπειρα τροποποίησης ή προσθήκης συνταγής χωρίς διαπιστευτήρια διαχειριστή απορρίπτεται με 401 Unauthorized.
- **Μοντέλο Απειλής (Threat Impact)**: Αν η εγγραφή δεν προστατεύεται, απλοί επισκέπτες ή επιτιθέμενοι μπορούν να αλλοιώσουν τη βάση συνταγών, να εισάγουν spam ή κακόβουλο περιεχόμενο.
- **Οδηγίες Επίλυσης (Remediation)**: Ελέγχετε πάντα το session token διαχειριστή μέσω verifyAdminRequest() πριν από κάθε εγγραφή.
- **Tags**: `acl`, `authorization`, `owasp-a01`

#### `SEC-ACL-RECIPES-DEL-UNAUTH` — Προστασία Διαγραφής Συνταγών (DELETE /api/recipes 401)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-285](https://cwe.mitre.org/data/definitions/285.html)
- **Περιγραφή Ελέγχου**: Επιβεβαιώνει ότι αιτήματα διαγραφής συνταγών χωρίς έγκυρο session διαχειριστή απορρίπτονται άμεσα με 401 Unauthorized.
- **Μοντέλο Απειλής (Threat Impact)**: Ανεξέλεγκτη διαγραφή συνταγών μπορεί να οδηγήσει σε ολική απώλεια δεδομένων του καταλόγου από κακόβουλους τρίτους.
- **Οδηγίες Επίλυσης (Remediation)**: Απαιτείτε αυστηρά δικαιώματα διαχειριστή για κάθε ενέργεια DELETE.
- **Tags**: `acl`, `authorization`, `owasp-a01`

#### `SEC-ACL-IMPORT-UNAUTH` — Προστασία Ανάκτησης Εξωτερικών Συνταγών (POST /api/recipes/import 401)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-285](https://cwe.mitre.org/data/definitions/285.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι η βαριά λειτουργία scraping/ανάκτησης εξωτερικών URL επιτρέπεται μόνο σε διαχειριστές.
- **Μοντέλο Απειλής (Threat Impact)**: Αν το import ήταν δημόσιο, θα μπορούσε να χρησιμοποιηθεί καταχρηστικά ως proxy για DoS σε τρίτα sites ή για εξάντληση των πόρων του server.
- **Οδηγίες Επίλυσης (Remediation)**: Προστατεύστε το endpoint εισαγωγής με verifyAdminRequest().
- **Tags**: `acl`, `authorization`, `owasp-a01`

#### `SEC-LEAK-CLIENT-SECRETS` — Αποτροπή Διαρροής Μυστικών στα Δημόσια Endpoints
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι οι δημόσιες αποκρίσεις καταλόγου (GET /api/recipes) δεν εκθέτουν μυστικά κλειδιά, admin tokens ή διαχειριστικά hashes.
- **Μοντέλο Απειλής (Threat Impact)**: Διαρροή κλειδιών σε δημόσια JSON payloads οδηγεί σε άμεση παραβίαση του συστήματος.
- **Οδηγίες Επίλυσης (Remediation)**: Αφαιρείτε πάντα ευαίσθητα πεδία πριν από τη σειριοποίηση δεδομένων προς τους πελάτες.
- **Tags**: `data-leakage`, `public-api`, `owasp-a01`

### 🛡️ [A10:2021] Server-Side Request Forgery (SSRF)
*Αποτροπή εκτέλεσης αιτημάτων σε εσωτερικά δίκτυα, localhost και cloud metadata IPs.*

#### `SEC-SSRF-LOOPBACK` — Αποτροπή SSRF σε Loopback & Localhost (127.0.0.1)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-918](https://cwe.mitre.org/data/definitions/918.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι η λειτουργία εισαγωγής URL απορρίπτει άμεσα διευθύνσεις localhost, 127.0.0.1 και IPv6 ::1.
- **Μοντέλο Απειλής (Threat Impact)**: Επιθέσεις SSRF στο loopback επιτρέπουν σε εισβολείς να αλληλεπιδράσουν με εσωτερικές υπηρεσίες του διακομιστή (π.χ. τοπικές βάσεις δεδομένων, Redis, διαχειριστικά panels) που δεν είναι εκτεθειμένα στο internet.
- **Οδηγίες Επίλυσης (Remediation)**: Απορρίπτετε οποιοδήποτε hostname ταυτίζεται με localhost ή διευθύνσεις loopback 127.0.0.0/8.
- **Tags**: `ssrf`, `loopback`, `owasp-a10`

#### `SEC-SSRF-PRIVATE-IP` — Αποτροπή SSRF σε Ιδιωτικά Δίκτυα (RFC 1918 Private IPs)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-918](https://cwe.mitre.org/data/definitions/918.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι απορρίπτονται διευθύνσεις εσωτερικού δικτύου (10.x.x.x, 192.168.x.x, 172.16.x.x).
- **Μοντέλο Απειλής (Threat Impact)**: Εισβολέας μπορεί να σαρώσει το εσωτερικό VPC/LAN του cloud provider και να υποκλέψει δεδομένα από εσωτερικούς servers.
- **Οδηγίες Επίλυσης (Remediation)**: Ελέγξτε και αποκλείστε όλα τα private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) πριν την αποστολή HTTP αιτήματος.
- **Tags**: `ssrf`, `private-ip`, `rfc1918`, `owasp-a10`

#### `SEC-SSRF-METADATA` — Προστασία Cloud Metadata Services (169.254.169.254)
- **Σοβαρότητα**: 🔴 **CRITICAL**
- **Πρότυπο CWE**: [CWE-918](https://cwe.mitre.org/data/definitions/918.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι απορρίπτεται οποιαδήποτε κλήση προς την ειδική διεύθυνση 169.254.169.254 (AWS, GCP, Azure, DigitalOcean metadata).
- **Μοντέλο Απειλής (Threat Impact)**: Αν το endpoint επικοινωνήσει με το 169.254.169.254, ο επιτιθέμενος μπορεί να διαβάσει IAM credentials, service account tokens και μυστικά κλειδιά της υποδομής cloud.
- **Οδηγίες Επίλυσης (Remediation)**: Απαγορεύστε ρητά αιτήματα προς τη διεύθυνση 169.254.169.254 και Link-Local ranges.
- **Tags**: `ssrf`, `cloud-metadata`, `iam`, `owasp-a10`

#### `SEC-SSRF-PROTOCOLS` — Αποκλεισμός Επικίνδυνων Πρωτοκόλλων (file://, ftp://, gopher://)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-918](https://cwe.mitre.org/data/definitions/918.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι επιτρέπονται αποκλειστικά ασφαλή web πρωτόκολλα (http, https) και απορρίπτονται file://, ftp://, gopher://, javascript:.
- **Μοντέλο Απειλής (Threat Impact)**: Η χρήση του πρωτοκόλλου file:// επιτρέπει ανάγνωση τοπικών αρχείων του διακομιστή (Local File Inclusion - LFI, π.χ. file:///etc/passwd).
- **Οδηγίες Επίλυσης (Remediation)**: Ελέγχετε ότι το URL protocol είναι αυστηρά 'http:' ή 'https:'.
- **Tags**: `ssrf`, `protocols`, `lfi`, `owasp-a10`

### 🛡️ [A03:2021] Εισαγωγή Κακόβουλου Κώδικα (Injection & Input Validation)
*Έλεγχος sanitization εισαγωγών, απόρριψη XSS, SQLi και κακόμορφων payloads.*

#### `SEC-INJ-EMAIL-FORMAT` — Επικύρωση Μορφής Email & RFC 5322 (Newsletter)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-20](https://cwe.mitre.org/data/definitions/20.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι κακόμορφες μορφές email (π.χ. 'plainaddress', '#@%^%#$@#$@#.com', 'email@example..com') απορρίπτονται με 400 Bad Request.
- **Μοντέλο Απειλής (Threat Impact)**: Ανεπαρκής έλεγχος εισαγωγής επιτρέπει τη συλλογή σκουπιδιών στη βάση δεδομένων ή αποστολή bounceback emails.
- **Οδηγίες Επίλυσης (Remediation)**: Χρησιμοποιείτε αυστηρή κανονική έκφραση (regex) επικύρωσης email πριν από οποιαδήποτε αποθήκευση.
- **Tags**: `injection`, `validation`, `email`, `owasp-a03`

#### `SEC-INJ-EMAIL-XSS` — Αποτροπή Cross-Site Scripting (XSS Payloads σε Πεδία Εισαγωγής)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι απόπειρες εισαγωγής JavaScript tags (όπως <script>alert(1)</script>) στα πεδία εγγραφής απορρίπτονται.
- **Μοντέλο Απειλής (Threat Impact)**: Εάν τα payloads αποθηκεύονταν στη βάση, θα μπορούσαν να εκτελεστούν στα browser sessions των διαχειριστών που επιθεωρούν τη λίστα συνδρομητών (Stored XSS).
- **Οδηγίες Επίλυσης (Remediation)**: Εφαρμόζετε sanitization και αυστηρό validation ώστε να μην επιτρέπονται χαρακτήρες <, >, script στα πεδία εισαγωγής.
- **Tags**: `injection`, `xss`, `sanitization`, `owasp-a03`

#### `SEC-INJ-MALFORMED-JSON` — Ανθεκτικότητα σε Κακόμορφο JSON (No Unhandled 500 Crashes)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-20](https://cwe.mitre.org/data/definitions/20.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι η αποστολή κακόμορφων ή ημιτελών JSON σωμάτων (truncated JSON payloads) δεν προκαλεί crash στον διακομιστή.
- **Μοντέλο Απειλής (Threat Impact)**: Απροστασία σε parsing exceptions μπορεί να προκαλέσει διακοπή της διεργασίας Node.js ή αποκάλυψη εσωτερικών stack traces.
- **Οδηγίες Επίλυσης (Remediation)**: Περικλείετε πάντα την ανάγνωση req.json() σε try/catch blocks και επιστρέφετε 400 Bad Request σε σφάλματα parsing.
- **Tags**: `injection`, `json`, `resilience`, `owasp-a03`

#### `SEC-INJ-RECIPE-SCHEMA` — Αυστηρός Έλεγχος Σχήματος Συνταγής (Schema Validation)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-20](https://cwe.mitre.org/data/definitions/20.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι το endpoint εγγραφής συνταγών απαιτεί πλήρη δομή (id, τίτλο) και απορρίπτει ελλιπή ή παραμορφωμένα αντικείμενα.
- **Μοντέλο Απειλής (Threat Impact)**: Εισαγωγή κενών ή παραμορφωμένων συνταγών μπορεί να σπάσει τον αλγόριθμο βελτιστοποίησης συσκευασιών και να προκαλέσει client-side crashes στους χρήστες.
- **Οδηγίες Επίλυσης (Remediation)**: Ελέγχετε την παρουσία και τον τύπο των υποχρεωτικών πεδίων πριν από την αποθήκευση.
- **Tags**: `injection`, `schema`, `validation`, `owasp-a03`

#### `SEC-CUST-NEWSLETTER-LIMITS` — Προσαρμοσμένος Έλεγχος: Μέγιστο Μήκος Πεδίου Email (Buffer Overflow / DoS)
- **Σοβαρότητα**: 🟢 **LOW**
- **Πρότυπο CWE**: [CWE-20](https://cwe.mitre.org/data/definitions/20.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι υπερβολικά μακροσκελείς διευθύνσεις email (> 255 χαρακτήρες) απορρίπτονται από το endpoint του Newsletter.
- **Μοντέλο Απειλής (Threat Impact)**: Αποτρέπει πιθανές καταναλώσεις μνήμης από τεράστια string payloads που στοχεύουν σε DoS ή ReDoS εκφράσεις.
- **Οδηγίες Επίλυσης (Remediation)**: Εφαρμόστε έλεγχο email.length <= 255 πριν από την επεξεργασία της κανονικής έκφρασης.
- **Tags**: `custom`, `newsletter`, `input-validation`

### 🛡️ [A04:2021] Επισφαλής Σχεδιασμός & Προστασία DoS (Insecure Design & DoS)
*Ανθεκτικότητα σε εξάντληση πόρων, rate limiting, cooldowns και request deduplication.*

#### `SEC-DOS-SLIDING-WINDOW` — Επιβολή Ορίων Sliding-Window ανά IP (Anti-Flooding)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-770](https://cwe.mitre.org/data/definitions/770.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι ο αλγόριθμος sliding window περιορίζει αποτελεσματικά τον αριθμό επιτρεπόμενων κλήσεων ανά χρονικό παράθυρο.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς rate limiting, ένας επιτιθέμενος μπορεί να εκτελέσει Denial of Service (DoS), εξαντλώντας την CPU, τη μνήμη και το bandwidth του διακομιστή.
- **Οδηγίες Επίλυσης (Remediation)**: Χρησιμοποιείτε sliding window timestamps με αυτόματο purge παλαιών εγγραφών.
- **Tags**: `dos`, `rate-limit`, `sliding-window`, `owasp-a04`

#### `SEC-DOS-COOLDOWN` — Επιβολή Cooldown Συνεχόμενων Αιτημάτων (Anti-Thrashing)
- **Σοβαρότητα**: 🟠 **HIGH**
- **Πρότυπο CWE**: [CWE-770](https://cwe.mitre.org/data/definitions/770.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι δύο ταυτόχρονα ή διαδοχικά αιτήματα στο ίδιο millisecond απορρίπτονται όταν υπάρχει ρύθμιση cooldown.
- **Μοντέλο Απειλής (Threat Impact)**: Αποτρέπει thrashing του συστήματος από bots που στέλνουν ριπές (bursts) δεκάδων αιτημάτων ταυτόχρονα.
- **Οδηγίες Επίλυσης (Remediation)**: Ορίζετε cooldownMs (π.χ. 500ms - 2000ms) ανάμεσα σε διαδοχικά αιτήματα.
- **Tags**: `dos`, `cooldown`, `anti-thrashing`, `owasp-a04`

#### `SEC-DOS-429-METADATA` — Ορθή Επιστροφή HTTP 429 & Retry Headers
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-770](https://cwe.mitre.org/data/definitions/770.html)
- **Περιγραφή Ελέγχου**: Ελέγχει ότι τα throttled endpoints επιστρέφουν επίσημο HTTP status 429 Too Many Requests και σαφές μήνυμα αναμονής.
- **Μοντέλο Απειλής (Threat Impact)**: Αν το σύστημα επέστρεφε 500 ή έκοβε τη σύνδεση σιωπηλά, τα clients δεν θα μπορούσαν να γνωρίζουν πότε να επαναλάβουν το αίτημα.
- **Οδηγίες Επίλυσης (Remediation)**: Επιστρέφετε NextResponse με status 429, headers Retry-After και δομημένο JSON σφάλμα.
- **Tags**: `dos`, `http-429`, `standards`, `owasp-a04`

#### `SEC-DOS-SEARCH-DEDUP` — In-Memory Caching & Αποτροπή Εξάντλησης Πόρων (Search Deduplication)
- **Σοβαρότητα**: 🟡 **MEDIUM**
- **Πρότυπο CWE**: [CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- **Περιγραφή Ελέγχου**: Επαληθεύει ότι η cache αναζήτησης αποθηκεύει και ανακτά αποτελέσματα με 10m TTL αποτρέποντας περιττά external HTTP calls.
- **Μοντέλο Απειλής (Threat Impact)**: Χωρίς caching, μαζικές αναζητήσεις προϊόντων θα υπερφόρτωναν το live API του posokanei.gov.gr και θα προκαλούσαν blacklisting της εφαρμογής.
- **Οδηγίες Επίλυσης (Remediation)**: Χρησιμοποιείτε in-memory LRU/TTL cache για τα αποτελέσματα αναζήτησης.
- **Tags**: `dos`, `cache`, `deduplication`, `owasp-a04`
