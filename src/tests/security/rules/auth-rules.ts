import { defineSecurityRule, SecurityRule } from "../types";
import {
  createAdminToken,
  verifyAdminToken,
  getAdminSecretKey,
  ADMIN_COOKIE_NAME,
} from "@/lib/security/admin-auth";

export const authSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-AUTH-HMAC-VERIFY",
    title: "Κρυπτογραφική Επαλήθευση HMAC-SHA256 Admin Token",
    owaspCategory: "A02_CRYPTOGRAPHIC_FAILURES",
    cwe: "CWE-326",
    severity: "critical",
    description: "Επαληθεύει ότι οι συνεδρίες διαχειριστή προστατεύονται από αυθεντική κρυπτογραφική υπογραφή HMAC με μυστικό κλειδί.",
    threatImpact: "Αν τα tokens δεν υπογράφονται κρυπτογραφικά, ο οποιοσδήποτε μπορεί να κατασκευάσει πλαστά διαχειριστικά tokens και να αποκτήσει πλήρη έλεγχο της εφαρμογής.",
    remediation: "Χρησιμοποιείτε πάντα crypto.createHmac('sha256', secret) με υψηλής εντροπίας μυστικό κλειδί.",
    tags: ["auth", "crypto", "hmac", "owasp-a02"],
    execute: async ({ assert }) => {
      const validToken = createAdminToken();
      assert(!!validToken && validToken.includes(":"), "Το token πρέπει να περιέχει timestamp και hmac hash");
      const isValid = verifyAdminToken(validToken);
      assert(isValid === true, "Ένα νόμιμα παραγόμενο token πρέπει να επαληθεύεται επιτυχώς");
      return {
        evidence: `Valid token generated & verified: ${validToken.slice(0, 15)}...`,
        details: "Η κρυπτογραφική επαλήθευση λειτουργεί ορθά με HMAC-SHA256.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-AUTH-TAMPER-REJECT",
    title: "Απόρριψη Παραποιημένων Tokens (Tamper Resistance)",
    owaspCategory: "A07_AUTH_FAILURES",
    cwe: "CWE-353",
    severity: "critical",
    description: "Ελέγχει ότι οποιαδήποτε τροποποίηση έστω και ενός χαρακτήρα στο payload ή στο HMAC προκαλεί άμεση απόρριψη.",
    threatImpact: "Αποτρέπει επιθέσεις tampering και privilege escalation όπου ο εισβολέας τροποποιεί τα δεδομένα της συνεδρίας.",
    remediation: "Απορρίπτετε άμεσα οποιοδήποτε token του οποίου το hash δεν ταυτίζεται επακριβώς με το αναμενόμενο HMAC.",
    tags: ["auth", "tamper-resistance", "owasp-a07"],
    execute: async ({ assert }) => {
      const validToken = createAdminToken();
      const [ts, hmac] = validToken.split(":");
      
      // Παραποίηση HMAC
      const tamperedHmac = `${ts}:${hmac.slice(0, -2)}99`;
      assert(verifyAdminToken(tamperedHmac) === false, "Παραποιημένο HMAC πρέπει να απορριφθεί");

      // Παραποίηση timestamp
      const tamperedTs = `${parseInt(ts, 10) + 1000}:${hmac}`;
      assert(verifyAdminToken(tamperedTs) === false, "Παραποιημένο timestamp πρέπει να απορριφθεί");

      // Αυθαίρετο string
      assert(verifyAdminToken("admin:true") === false, "Αυθαίρετο token string πρέπει να απορριφθεί");
      return {
        evidence: "Όλες οι προσπάθειες εισαγωγής παραποιημένων tokens απέτυχαν.",
        details: "Το σύστημα αντιστέκεται πλήρως σε αλλοιώσεις και πλαστογράφηση.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-AUTH-EXPIRE-REJECT",
    title: "Επιβολή Χρονικής Λήξης Συνεδρίας (Max 24h Expiry)",
    owaspCategory: "A07_AUTH_FAILURES",
    cwe: "CWE-613",
    severity: "high",
    description: "Επαληθεύει ότι παλιά tokens άνω των 24 ωρών ακυρώνονται αυτόματα ακόμα κι αν η υπογραφή τους ήταν έγκυρη.",
    threatImpact: "Αν τα tokens δεν λήγουν, ένα διαρρεύσαν token μπορεί να χρησιμοποιείται επ' άπειρον από εισβολείς (Replay Attack).",
    remediation: "Ελέγχετε πάντα τη διαφορά Date.now() - timestamp ώστε να μην υπερβαίνει το μέγιστο όριο ζωής της συνεδρίας.",
    tags: ["auth", "session-expiry", "owasp-a07"],
    execute: async ({ assert }) => {
      // Token παλαιότερο των 25 ωρών
      const oldTimestamp = Date.now() - 25 * 60 * 60 * 1000;
      const secret = getAdminSecretKey();
      const crypto = await import("crypto");
      const oldHmac = crypto.createHmac("sha256", secret).update(`admin:${oldTimestamp}`).digest("hex");
      const expiredToken = `${oldTimestamp}:${oldHmac}`;

      assert(
        verifyAdminToken(expiredToken) === false,
        "Token άνω των 24 ωρών πρέπει να απορρίπτεται ως ληγμένο"
      );
      return {
        evidence: `Expired token timestamp: ${new Date(oldTimestamp).toISOString()} (Rejected)`,
        details: "Η χρονική λήξη συνεδρίας 24 ωρών επιβάλλεται αυστηρά.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-AUTH-COOKIE-FLAGS",
    title: "Ασφάλεια Cookie Συνεδρίας (HttpOnly & SameSite Protection)",
    owaspCategory: "A05_SECURITY_MISCONFIG",
    cwe: "CWE-1004",
    severity: "high",
    description: "Επαληθεύει ότι το cookie διαχειριστή 'pioftina_admin_session' ρυθμίζεται με HttpOnly και SameSite για αποτροπή κλοπής μέσω XSS ή CSRF.",
    threatImpact: "Χωρίς HttpOnly, ένα σενάριο XSS μπορεί να διαβάσει το document.cookie και να κλέψει το session token του διαχειριστή.",
    remediation: "Ορίζετε πάντα httpOnly: true, sameSite: 'lax' ή 'strict' και secure: true στην παραγωγή.",
    tags: ["auth", "cookies", "httponly", "csrf", "owasp-a05"],
    execute: async ({ fetchApi, assert }) => {
      const secret = getAdminSecretKey();
      const testIp = `10.99.${Math.floor(Math.random() * 200) + 1}.${Math.floor(Math.random() * 200) + 1}`;
      const res = await fetchApi("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": testIp },
        body: JSON.stringify({ password: secret }),
      });

      assert(res.status === 200, "Η είσοδος με σωστό κωδικό πρέπει να επιστρέφει 200 OK");
      const setCookie = res.headers.get("set-cookie") || "";

      assert(
        setCookie.toLowerCase().includes("httponly"),
        "Το cookie συνεδρίας διαχειριστή ΠΡΕΠΕΙ να έχει το flag HttpOnly"
      );
      assert(
        setCookie.toLowerCase().includes("samesite"),
        "Το cookie συνεδρίας διαχειριστή ΠΡΕΠΕΙ να έχει το flag SameSite"
      );

      return {
        evidence: `Set-Cookie flags: ${setCookie}`,
        details: "Το cookie είναι προστατευμένο από πρόσβαση μέσω JavaScript και προστατεύει από CSRF.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-AUTH-BRUTEFORCE",
    title: "Προστασία Brute-Force Σύνδεσης Διαχειριστή (Login Throttling)",
    owaspCategory: "A07_AUTH_FAILURES",
    cwe: "CWE-307",
    severity: "high",
    description: "Ελέγχει ότι η διαδρομή /api/admin/auth μπλοκάρει επιθέσεις λεξικού και αυτοματοποιημένες απόπειρες μαντέματος κωδικού με HTTP 429.",
    threatImpact: "Χωρίς rate limiting, επιτιθέμενοι μπορούν να δοκιμάσουν εκατομμύρια πιθανούς κωδικούς το δευτερόλεπτο μέχρι να βρουν τον σωστό.",
    remediation: "Εφαρμόστε sliding window rate limiting (π.χ. μέγιστο 10 προσπάθειες ανά 5 λεπτά) στο authentication endpoint.",
    tags: ["auth", "brute-force", "rate-limit", "owasp-a07"],
    execute: async ({ fetchApi, assert }) => {
      const testIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
      let hitRateLimit = false;

      // Εκτελούμε διαδοχικές αποτυχημένες προσπάθειες
      for (let i = 0; i < 12; i++) {
        const res = await fetchApi("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-forwarded-for": testIp },
          body: JSON.stringify({ password: "wrong_password_attempt" }),
        });

        if (res.status === 429) {
          hitRateLimit = true;
          break;
        }
      }

      assert(hitRateLimit, "Μετά από 10 αποτυχημένες προσπάθειες, το endpoint ΠΡΕΠΕΙ να επιστρέψει HTTP 429 Too Many Requests");
      return {
        evidence: "HTTP 429 Too Many Requests triggered on automated flood.",
        details: "Το σύστημα προστατεύεται πλήρως από επιθέσεις brute-force και credential stuffing.",
      };
    },
  }),
];
