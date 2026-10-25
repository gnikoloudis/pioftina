import { defineSecurityRule, SecurityRule } from "../types";
import { createAdminToken } from "@/lib/security/admin-auth";

export const ssrfSecurityRules: SecurityRule[] = [
  defineSecurityRule({
    id: "SEC-SSRF-LOOPBACK",
    title: "Αποτροπή SSRF σε Loopback & Localhost (127.0.0.1)",
    owaspCategory: "A10_SSRF",
    cwe: "CWE-918",
    severity: "critical",
    description: "Ελέγχει ότι η λειτουργία εισαγωγής URL απορρίπτει άμεσα διευθύνσεις localhost, 127.0.0.1 και IPv6 ::1.",
    threatImpact: "Επιθέσεις SSRF στο loopback επιτρέπουν σε εισβολείς να αλληλεπιδράσουν με εσωτερικές υπηρεσίες του διακομιστή (π.χ. τοπικές βάσεις δεδομένων, Redis, διαχειριστικά panels) που δεν είναι εκτεθειμένα στο internet.",
    remediation: "Απορρίπτετε οποιοδήποτε hostname ταυτίζεται με localhost ή διευθύνσεις loopback 127.0.0.0/8.",
    tags: ["ssrf", "loopback", "owasp-a10"],
    execute: async ({ fetchApi, assertEquals }) => {
      const adminToken = createAdminToken();
      const loopbackUrls = [
        "http://localhost:3000/api/admin/auth",
        "http://127.0.0.1:8080/admin",
        "http://[::1]:80/status",
      ];

      for (let i = 0; i < loopbackUrls.length; i++) {
        const url = loopbackUrls[i];
        const res = await fetchApi("/api/recipes/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `pioftina_admin_session=${adminToken}`,
            "x-forwarded-for": `198.51.101.${10 + i * 15 + Math.floor(Math.random() * 5)}`,
          },
          body: JSON.stringify({ url }),
        });

        assertEquals(res.status, 400, `SSRF URL '${url}' έπρεπε να απορριφθεί με 400 Bad Request`);
      }

      return {
        evidence: "Όλες οι απόπειρες loopback SSRF (localhost, 127.0.0.1, ::1) απορρίφθηκαν με 400.",
        details: "Ο μηχανισμός επικύρωσης αποτρέπει αιτήματα σε εσωτερικές τοπικές θύρες.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-SSRF-PRIVATE-IP",
    title: "Αποτροπή SSRF σε Ιδιωτικά Δίκτυα (RFC 1918 Private IPs)",
    owaspCategory: "A10_SSRF",
    cwe: "CWE-918",
    severity: "critical",
    description: "Επαληθεύει ότι απορρίπτονται διευθύνσεις εσωτερικού δικτύου (10.x.x.x, 192.168.x.x, 172.16.x.x).",
    threatImpact: "Εισβολέας μπορεί να σαρώσει το εσωτερικό VPC/LAN του cloud provider και να υποκλέψει δεδομένα από εσωτερικούς servers.",
    remediation: "Ελέγξτε και αποκλείστε όλα τα private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) πριν την αποστολή HTTP αιτήματος.",
    tags: ["ssrf", "private-ip", "rfc1918", "owasp-a10"],
    execute: async ({ fetchApi, assertEquals }) => {
      const adminToken = createAdminToken();
      const privateIps = [
        "http://192.168.1.1/router-login",
        "http://10.0.0.5:9200/_cat/indices",
        "http://172.16.0.10:5432/db",
      ];

      for (const url of privateIps) {
        const res = await fetchApi("/api/recipes/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `pioftina_admin_session=${adminToken}`,
            "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
          },
          body: JSON.stringify({ url }),
        });

        assertEquals(res.status, 400, `Private IP '${url}' έπρεπε να απορριφθεί με 400 Bad Request`);
      }

      return {
        evidence: "Όλα τα private IP ranges (10.x, 192.168.x, 172.16.x) μπλοκαρίστηκαν επιτυχώς.",
        details: "Προστασία εσωτερικού δικτύου ενεργή.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-SSRF-METADATA",
    title: "Προστασία Cloud Metadata Services (169.254.169.254)",
    owaspCategory: "A10_SSRF",
    cwe: "CWE-918",
    severity: "critical",
    description: "Ελέγχει ότι απορρίπτεται οποιαδήποτε κλήση προς την ειδική διεύθυνση 169.254.169.254 (AWS, GCP, Azure, DigitalOcean metadata).",
    threatImpact: "Αν το endpoint επικοινωνήσει με το 169.254.169.254, ο επιτιθέμενος μπορεί να διαβάσει IAM credentials, service account tokens και μυστικά κλειδιά της υποδομής cloud.",
    remediation: "Απαγορεύστε ρητά αιτήματα προς τη διεύθυνση 169.254.169.254 και Link-Local ranges.",
    tags: ["ssrf", "cloud-metadata", "iam", "owasp-a10"],
    execute: async ({ fetchApi, assertEquals }) => {
      const adminToken = createAdminToken();
      const metadataUrl = "http://169.254.169.254/latest/meta-data/iam/security-credentials/";

      const res = await fetchApi("/api/recipes/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `pioftina_admin_session=${adminToken}`,
          "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 50}`,
        },
        body: JSON.stringify({ url: metadataUrl }),
      });

      // Πρέπει να απορρίπτεται ως μη έγκυρο / ιδιωτικό
      assertEquals(res.status, 400, "Το Cloud metadata IP πρέπει να απορρίπτεται με 400 Bad Request");
      return {
        evidence: `Cloud metadata URL rejected with 400: ${metadataUrl}`,
        details: "Η υποδομή cloud προστατεύεται από υποκλοπή IAM credentials.",
      };
    },
  }),

  defineSecurityRule({
    id: "SEC-SSRF-PROTOCOLS",
    title: "Αποκλεισμός Επικίνδυνων Πρωτοκόλλων (file://, ftp://, gopher://)",
    owaspCategory: "A10_SSRF",
    cwe: "CWE-918",
    severity: "high",
    description: "Επαληθεύει ότι επιτρέπονται αποκλειστικά ασφαλή web πρωτόκολλα (http, https) και απορρίπτονται file://, ftp://, gopher://, javascript:.",
    threatImpact: "Η χρήση του πρωτοκόλλου file:// επιτρέπει ανάγνωση τοπικών αρχείων του διακομιστή (Local File Inclusion - LFI, π.χ. file:///etc/passwd).",
    remediation: "Ελέγχετε ότι το URL protocol είναι αυστηρά 'http:' ή 'https:'.",
    tags: ["ssrf", "protocols", "lfi", "owasp-a10"],
    execute: async ({ fetchApi, assertEquals }) => {
      const adminToken = createAdminToken();
      const unsafeProtocols = [
        "file:///etc/passwd",
        "file:///C:/Windows/win.ini",
        "ftp://example.com/test",
        "gopher://example.com/",
        "javascript:alert(1)",
      ];

      for (let i = 0; i < unsafeProtocols.length; i++) {
        const url = unsafeProtocols[i];
        const res = await fetchApi("/api/recipes/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `pioftina_admin_session=${adminToken}`,
            "x-forwarded-for": `198.51.103.${10 + i * 15 + Math.floor(Math.random() * 5)}`,
          },
          body: JSON.stringify({ url }),
        });

        assertEquals(res.status, 400, `Επικίνδυνο πρωτόκολλο '${url}' έπρεπε να απορριφθεί με 400`);
      }

      return {
        evidence: "Όλα τα μη-HTTP πρωτόκολλα (file://, ftp://, gopher://, javascript:) απορρίφθηκαν.",
        details: "Αποκλεισμός επιθέσεων Local File Inclusion (LFI).",
      };
    },
  }),
];
