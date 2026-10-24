import { runSecurityAudit, ScanOptions } from "../scanner";
import { OwaspCategory, OWASP_CATEGORIES_META, SecuritySeverity } from "../types";

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgRed: "\x1b[41m\x1b[37m",
  bgYellow: "\x1b[43m\x1b[30m",
  bgBlue: "\x1b[44m\x1b[37m",
};

function parseArgs(): ScanOptions {
  const args = process.argv.slice(2);
  const options: ScanOptions = {};

  for (const arg of args) {
    if (arg.startsWith("--category=")) {
      options.category = arg.split("=")[1] as OwaspCategory;
    } else if (arg.startsWith("--severity=")) {
      options.severity = arg.split("=")[1] as SecuritySeverity;
    } else if (arg.startsWith("--rule=") || arg.startsWith("--id=")) {
      options.ruleId = arg.split("=")[1];
    } else if (arg.startsWith("--url=")) {
      options.baseUrl = arg.split("=")[1];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log(`\n${colors.cyan}${colors.bold}========================================================================${colors.reset}`);
  console.log(`     ${colors.white}${colors.bold}🛡️  pioftina.gr Penetration Test & OWASP Security Audit${colors.reset}     `);
  console.log(`${colors.cyan}${colors.bold}========================================================================${colors.reset}\n`);

  console.log(`${colors.dim}Συλλογή κανόνων OWASP Top 10, ASVS & εκτέλεση ελέγχων...${colors.reset}\n`);

  const report = await runSecurityAudit(options);

  // Group results by OWASP category
  const grouped: Record<string, typeof report.results> = {};
  for (const res of report.results) {
    if (!grouped[res.owaspCategory]) grouped[res.owaspCategory] = [];
    grouped[res.owaspCategory].push(res);
  }

  for (const [cat, items] of Object.entries(grouped)) {
    const meta = OWASP_CATEGORIES_META[cat as OwaspCategory];
    const catPassed = items.filter((i) => i.status === "pass").length;
    const catTotal = items.length;
    const catColor = catPassed === catTotal ? colors.green : colors.yellow;

    console.log(
      `${colors.bold}${colors.blue}▶ [${meta?.code || cat}] ${meta?.name || cat}${colors.reset} ${catColor}(${catPassed}/${catTotal} ασφαλές)${colors.reset}`
    );

    for (const item of items) {
      const sevBadge =
        item.severity === "critical"
          ? `${colors.red}[CRITICAL]${colors.reset}`
          : item.severity === "high"
          ? `${colors.yellow}[HIGH]${colors.reset}`
          : item.severity === "medium"
          ? `${colors.cyan}[MED]${colors.reset}`
          : `${colors.dim}[LOW]${colors.reset}`;

      if (item.status === "pass") {
        console.log(`  ${colors.green}✓${colors.reset} ${item.title} ${sevBadge} ${colors.dim}(${item.durationMs}ms)${colors.reset}`);
      } else if (item.status === "warn") {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${item.title} ${sevBadge} ${colors.dim}(${item.durationMs}ms)${colors.reset}`);
        if (item.details) {
          console.log(`    ${colors.yellow}Σημείωση: ${item.details}${colors.reset}`);
        }
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${item.title}${colors.reset} ${sevBadge} ${colors.dim}(${item.durationMs}ms)${colors.reset}`);
        if (item.error) {
          console.log(`    ${colors.red}Σφάλμα: ${item.error}${colors.reset}`);
        }
        if (item.remediation) {
          console.log(`    ${colors.dim}Επίλυση: ${item.remediation}${colors.reset}`);
        }
      }
    }
    console.log("");
  }

  // Summary box
  console.log(`${colors.cyan}------------------------------------------------------------------------${colors.reset}`);
  
  const gradeColor =
    report.grade === "A+" || report.grade === "A"
      ? colors.bgGreen
      : report.grade === "B"
      ? colors.bgBlue
      : report.grade === "C"
      ? colors.bgYellow
      : colors.bgRed;

  console.log(`  ${colors.bold}ΤΕΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ ΑΣΦΑΛΕΙΑΣ:${colors.reset}  ${gradeColor} GRADE ${report.grade} (${report.securityScore}/100) ${colors.reset}\n`);

  console.log(`  Σύνολο Κανόνων:      ${colors.bold}${report.summary.total}${colors.reset}`);
  console.log(`  Επιτυχή (Secure):    ${colors.green}${colors.bold}${report.summary.passed}${colors.reset}`);
  console.log(`  Προειδοποιήσεις:     ${colors.yellow}${colors.bold}${report.summary.warnings}${colors.reset}`);
  console.log(`  Ευπάθειες (Failed):  ${report.summary.failed > 0 ? colors.red : colors.green}${colors.bold}${report.summary.failed}${colors.reset} (Critical: ${report.summary.criticalIssues}, High: ${report.summary.highIssues})`);
  console.log(`  Διάρκεια Ελέγχου:    ${colors.dim}${report.summary.durationMs}ms${colors.reset}`);
  console.log(`  Περιβάλλον:          ${colors.dim}${report.environment}${colors.reset}`);
  console.log(`${colors.cyan}------------------------------------------------------------------------${colors.reset}\n`);

  // Exit with non-zero code only if critical or high issues found
  if (report.summary.criticalIssues > 0 || report.summary.highIssues > 0) {
    console.error(`${colors.red}${colors.bold}ΑΠΟΤΥΧΙΑ: Εντοπίστηκαν κρίσιμες ευπάθειες ασφαλείας.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}Η ΕΦΑΡΜΟΓΗ ΠΛΗΡΟΙ ΟΛΕΣ ΤΙΣ ΠΡΟΔΙΑΓΡΑΦΕΣ ΑΣΦΑΛΕΙΑΣ OWASP.${colors.reset}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Σφάλμα κατά την εκτέλεση του ελέγχου ασφαλείας:", err);
  process.exit(1);
});
