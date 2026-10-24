import fs from "fs/promises";
import path from "path";
import { getAllSuites } from "./registry";

async function generateDocs() {
  const suites = getAllSuites();
  const allTests = suites.flatMap((s) => s.tests);

  const lines: string[] = [];

  lines.push("# 🧪 Τεκμηρίωση Συστήματος Ελέγχων (Testing System Documentation)");
  lines.push("");
  lines.push("> Αυτό το έγγραφο παράγεται αυτόματα και περιλαμβάνει αναλυτικά όλα τα tests του `pioftina.gr`, τις κατηγορίες τους, τι επαληθεύει το καθένα και πώς να προσθέσετε νέα tests.");
  lines.push("");
  lines.push(`- **Σύνολο Σουιτών**: ${suites.length}`);
  lines.push(`- **Σύνολο Καταχωρημένων Tests**: ${allTests.length}`);
  lines.push(`- **Τελευταία Ενημέρωση**: ${new Date().toLocaleString("el-GR")}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("## 🚀 Πώς να Εκτελέσετε τα Tests");
  lines.push("");
  lines.push("### 1. Τοπικά στη Γραμμή Εντολών (CLI)");
  lines.push("```powershell");
  lines.push("# Εκτέλεση όλων των tests");
  lines.push("npm test");
  lines.push("");
  lines.push("# Εκτέλεση μόνο μιας κατηγορίας (π.χ. recipes, optimizer, security, api)");
  lines.push("npm test -- --category=recipes");
  lines.push("");
  lines.push("# Εκτέλεση μόνο των smoke tests");
  lines.push("npm test -- --tags=smoke");
  lines.push("");
  lines.push("# Ενημέρωση του παρόντος αρχείου τεκμηρίωσης");
  lines.push("npm run test:docs");
  lines.push("```");
  lines.push("");

  lines.push("### 2. Στο Vercel / Cloud Περιβάλλον");
  lines.push("- **Μέσω Web Dashboard**: Επισκεφθείτε τη διαδρομή `/admin/tests` ή πατήστε την καρτέλα **Test Center** μέσα στο Curation Studio.");
  lines.push("- **Μέσω API Endpoint**: Κάντε κλήση στο `/api/admin/tests` (ή `GET https://pioftina.vercel.app/api/admin/tests`) για επιστροφή δομημένου JSON.");
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("## ✍️ Πώς να Προσθέσετε Δικό σας Test σε 1 Λεπτό");
  lines.push("");
  lines.push("Ανοίξτε το αρχείο [`src/tests/suites/custom-user-tests.ts`](src/tests/suites/custom-user-tests.ts) και προσθέστε το δικό σας block:");
  lines.push("");
  lines.push("```typescript");
  lines.push("import { defineTest } from \"../core/runner\";");
  lines.push("");
  lines.push("defineTest({");
  lines.push("  id: \"my-custom-test-id\",");
  lines.push("  title: \"Ο τίτλος του τεστ σας\",");
  lines.push("  category: \"custom\",");
  lines.push("  description: \"Σύντομη περιγραφή του τι ελέγχει\",");
  lines.push("  documentation: \"Αναλυτική εξήγηση για το πώς λειτουργεί.\",");
  lines.push("  tags: [\"custom\"],");
  lines.push("  severity: \"medium\",");
  lines.push("  run: async ({ assert, assertEquals, fetchApi }) => {");
  lines.push("    const res = await fetchApi(\"/api/recipes\");");
  lines.push("    assertEquals(res.status, 200, \"Το API πρέπει να απαντά με 200\");");
  lines.push("  },");
  lines.push("})");
  lines.push("```");
  lines.push("");
  lines.push("Τρέξτε `npm test` και το νέο σας test θα εκτελεστεί αυτόματα!");
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("## 📋 Πλήρης Κατάλογος Καταχωρημένων Tests");
  lines.push("");

  for (const suite of suites) {
    lines.push(`### 📁 ${suite.name} (\`${suite.category}\`)`);
    lines.push(`*${suite.description}*`);
    lines.push("");
    lines.push("| # | Τίτλος Ελέγχου | ID | Βαρύτητα | Tags | Περιγραφή |");
    lines.push("|---|---|---|---|---|---|");

    suite.tests.forEach((t, idx) => {
      const severityIcon =
        t.severity === "critical"
          ? "🔴 Critical"
          : t.severity === "high"
          ? "🟠 High"
          : t.severity === "medium"
          ? "🟡 Medium"
          : "🟢 Low";

      lines.push(
        `| ${idx + 1} | **${t.title}** | \`${t.id}\` | ${severityIcon} | \`${t.tags.join(", ")}\` | ${t.description} |`
      );
    });
    lines.push("");

    lines.push("#### Αναλυτικές Λεπτομέρειες Ελέγχων Σουίτας:");
    for (const t of suite.tests) {
      lines.push(`- **\`${t.id}\` - ${t.title}**:`);
      lines.push(`  - *Σκοπός*: ${t.description}`);
      lines.push(`  - *Τεκμηρίωση*: ${t.documentation}`);
      lines.push(`  - *Tags*: \`${t.tags.join("`, `")}\``);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  const targetPath = path.join(process.cwd(), "TESTS_DOCUMENTATION.md");
  await fs.writeFile(targetPath, lines.join("\n"), "utf-8");
  console.log(`✓ Το αρχείο τεκμηρίωσης ενημερώθηκε επιτυχώς: ${targetPath}`);
}

generateDocs().catch(console.error);
