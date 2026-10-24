import fs from "fs/promises";
import path from "path";
import { getAllSecurityRules } from "./registry";
import { OwaspCategory, OWASP_CATEGORIES_META } from "./types";

async function generateSecurityDocumentation() {
  const rules = getAllSecurityRules();
  const outputPath = path.join(process.cwd(), "SECURITY_AUDIT_RULES.md");

  // Group by OWASP category
  const grouped: Partial<Record<OwaspCategory, typeof rules>> = {};
  for (const rule of rules) {
    if (!grouped[rule.owaspCategory]) {
      grouped[rule.owaspCategory] = [];
    }
    grouped[rule.owaspCategory]!.push(rule);
  }

  const lines: string[] = [];

  lines.push("# 🛡️ Τεκμηρίωση Κανόνων Ασφαλείας & Penetration Testing (OWASP Security Audit)");
  lines.push("");
  lines.push("> Αυτό το έγγραφο παράγεται αυτόματα και περιλαμβάνει αναλυτικά όλους τους κανόνες ασφαλείας του `pioftina.gr`, τις κατηγορίες OWASP Top 10, το μοντέλο απειλών (Threat Impact) και οδηγίες επίλυσης (Remediation).");
  lines.push("");
  lines.push(`- **Σύνολο Κανόνων Ασφαλείας**: ${rules.length}`);
  lines.push(`- **Πρότυπα Συμμόρφωσης**: OWASP Top 10 (2021/2025), OWASP ASVS v4.0, CWE Standards`);
  lines.push(`- **Τελευταία Ενημέρωση**: ${new Date().toLocaleString("el-GR")}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 🚀 Πώς να Εκτελέσετε το Penetration Test Tool");
  lines.push("");
  lines.push("### 1. Στη Γραμμή Εντολών (CLI)");
  lines.push("```powershell");
  lines.push("# Εκτέλεση όλων των ελέγχων ασφαλείας & βαθμολόγηση");
  lines.push("npm run pentest");
  lines.push("");
  lines.push("# Εκτέλεση συγκεκριμένης κατηγορίας (π.χ. A10_SSRF, A05_SECURITY_MISCONFIG, A07_AUTH_FAILURES)");
  lines.push("npm run pentest -- --category=A10_SSRF");
  lines.push("");
  lines.push("# Εκτέλεση μόνο κρίσιμων ελέγχων (critical)");
  lines.push("npm run pentest -- --severity=critical");
  lines.push("");
  lines.push("# Ενημέρωση του παρόντος εγγράφου τεκμηρίωσης");
  lines.push("npm run pentest:docs");
  lines.push("```");
  lines.push("");
  lines.push("### 2. Στο Web App & Vercel Dashboard");
  lines.push("- **In-App Dashboard**: Μεταβείτε στη διαδρομή `/admin/tests` και επιλέξτε την καρτέλα **Security & Pentest Audit**.");
  lines.push("- **Serverless API Endpoint**: Κάντε κλήση στο `/api/admin/security` (ή `GET https://pioftina.vercel.app/api/admin/security`) για επιστροφή δομημένης αναφοράς JSON.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## ✍️ Πώς να Προσθέσετε Δικό σας Κανόνα Ασφαλείας σε 1 Λεπτό");
  lines.push("");
  lines.push("Ανοίξτε το αρχείο [`src/tests/security/custom-security-rules.ts`](src/tests/security/custom-security-rules.ts) και προσθέστε το δικό σας block:");
  lines.push("");
  lines.push("```typescript");
  lines.push('import { defineSecurityRule } from "./types";');
  lines.push("");
  lines.push("defineSecurityRule({");
  lines.push('  id: "SEC-CUST-CUSTOM-CHECK",');
  lines.push('  title: "Ο τίτλος του ελέγχου σας",');
  lines.push('  owaspCategory: "A05_SECURITY_MISCONFIG",');
  lines.push('  cwe: "CWE-693",');
  lines.push('  severity: "medium",');
  lines.push('  description: "Σύντομη περιγραφή του τι ελέγχει.",');
  lines.push('  threatImpact: "Ποιος είναι ο κίνδυνος αν αποτύχει.",');
  lines.push('  remediation: "Πώς διορθώνεται η αδυναμία.",');
  lines.push("  execute: async ({ fetchApi, assert, assertEquals }) => {");
  lines.push('    const res = await fetchApi("/api/some-endpoint");');
  lines.push('    assert(res.status !== 500, "Το endpoint δεν πρέπει να καταρρέει");');
  lines.push("  },");
  lines.push("})");
  lines.push("```");
  lines.push("");
  lines.push("Τρέξτε `npm run pentest` και ο νέος σας κανόνας θα εκτελεστεί αυτόματα!");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 📋 Πλήρης Κατάλογος Κανόνων Ασφαλείας & Ευπαθειών");
  lines.push("");

  for (const [catKey, catRules] of Object.entries(grouped)) {
    const cat = catKey as OwaspCategory;
    const meta = OWASP_CATEGORIES_META[cat];

    lines.push(`### 🛡️ [${meta.code}] ${meta.name}`);
    lines.push(`*${meta.description}*`);
    lines.push("");

    for (const rule of catRules!) {
      const sevIcon =
        rule.severity === "critical"
          ? "🔴 **CRITICAL**"
          : rule.severity === "high"
          ? "🟠 **HIGH**"
          : rule.severity === "medium"
          ? "🟡 **MEDIUM**"
          : "🟢 **LOW**";

      lines.push(`#### \`${rule.id}\` — ${rule.title}`);
      lines.push(`- **Σοβαρότητα**: ${sevIcon}`);
      lines.push(`- **Πρότυπο CWE**: [${rule.cwe}](https://cwe.mitre.org/data/definitions/${rule.cwe.replace("CWE-", "")}.html)`);
      lines.push(`- **Περιγραφή Ελέγχου**: ${rule.description}`);
      lines.push(`- **Μοντέλο Απειλής (Threat Impact)**: ${rule.threatImpact}`);
      lines.push(`- **Οδηγίες Επίλυσης (Remediation)**: ${rule.remediation}`);
      if (rule.tags && rule.tags.length > 0) {
        lines.push(`- **Tags**: ${rule.tags.map((t) => `\`${t}\``).join(", ")}`);
      }
      lines.push("");
    }
  }

  await fs.writeFile(outputPath, lines.join("\n"), "utf-8");
  console.log(`✓ Το αρχείο τεκμηρίωσης ασφαλείας ενημερώθηκε επιτυχώς: ${outputPath}`);
}

generateSecurityDocumentation().catch((err) => {
  console.error("Σφάλμα κατά την παραγωγή της τεκμηρίωσης:", err);
  process.exit(1);
});
