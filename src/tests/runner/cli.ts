import { getAllSuites } from "../registry";
import { runTestEngine, RunOptions } from "../core/runner";
import { TestCategory } from "../core/types";

// ANSI escape codes for clean terminal styling
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  white: "\x1b[37m",
};

async function main() {
  const args = process.argv.slice(2);
  const options: RunOptions = {};

  for (const arg of args) {
    if (arg.startsWith("--category=")) {
      options.category = arg.split("=")[1] as TestCategory;
    } else if (arg.startsWith("--tags=")) {
      options.tags = arg.split("=")[1].split(",");
    } else if (arg.startsWith("--id=")) {
      options.testId = arg.split("=")[1];
    } else if (arg.startsWith("--baseUrl=")) {
      options.baseUrl = arg.split("=")[1];
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
${c.bold}pioftina.gr CLI Test Runner${c.reset}
Χρήση: npm test [επιλογές]

Επιλογές:
  --category=<cat>   Εκτέλεση συγκεκριμένης κατηγορίας (recipes, optimizer, security, api, posokanei, custom)
  --tags=<t1,t2>     Εκτέλεση tests με συγκεκριμένα tags (π.χ. smoke, critical)
  --id=<test-id>     Εκτέλεση μεμονωμένου test
  --baseUrl=<url>    Εκτέλεση έναντι εξωτερικού host (π.χ. https://pioftina.vercel.app)
  --help, -h         Εμφάνιση αυτής της βοήθειας
`);
      process.exit(0);
    }
  }

  console.log(`\n${c.bold}${c.cyan}========================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}     🧪 pioftina.gr Full Scale Test Suite Runner (Local & Vercel)     ${c.reset}`);
  console.log(`${c.cyan}========================================================================${c.reset}\n`);

  const suites = getAllSuites();
  console.log(`${c.dim}Φόρτωση ${suites.length} σουιτών δοκιμών...${c.reset}\n`);

  const report = await runTestEngine(suites, options);

  // Group and display results by category
  for (const cat of report.categories) {
    console.log(`${c.bold}${c.blue}▶ ${cat.name}${c.reset} ${c.dim}(${cat.passed}/${cat.total} επιτυχίες, ${cat.durationMs}ms)${c.reset}`);

    const catResults = report.results.filter((r) => r.category === cat.category);
    for (const r of catResults) {
      if (r.passed) {
        console.log(`  ${c.green}✓${c.reset} ${r.title} ${c.dim}(${r.durationMs}ms)${c.reset}`);
      } else {
        console.log(`  ${c.red}✗ ${r.title}${c.reset} ${c.dim}(${r.durationMs}ms)${c.reset}`);
        console.log(`    ${c.red}Σφάλμα: ${r.error}${c.reset}`);
        if (r.stack) {
          const firstStackLine = r.stack.split("\n")[1]?.trim();
          if (firstStackLine) {
            console.log(`    ${c.dim}${firstStackLine}${c.reset}`);
          }
        }
      }
    }
    console.log("");
  }

  // Summary box
  console.log(`${c.cyan}------------------------------------------------------------------------${c.reset}`);
  if (report.failed === 0) {
    console.log(`${c.bgGreen}${c.white}${c.bold}  ΟΛΑ ΤΑ TEST ΠΕΡΑΣΑΝ ΕΠΙΤΥΧΩΣ (100%)  ${c.reset}`);
  } else {
    console.log(`${c.bgRed}${c.white}${c.bold}  ΒΡΕΘΗΚΑΝ ${report.failed} ΑΠΟΤΥΧΙΕΣ  ${c.reset}`);
  }

  console.log(`\n  ${c.bold}Σύνολο Tests:${c.reset}     ${report.total}`);
  console.log(`  ${c.bold}${c.green}Επιτυχημένα:${c.reset}      ${report.passed}`);
  console.log(`  ${c.bold}${report.failed > 0 ? c.red : c.dim}Αποτυχημένα:${c.reset}      ${report.failed}`);
  console.log(`  ${c.bold}Διάρκεια:${c.reset}         ${report.durationMs}ms`);
  console.log(`  ${c.bold}Περιβάλλον:${c.reset}       ${report.environment}`);
  console.log(`${c.cyan}------------------------------------------------------------------------${c.reset}\n`);

  if (report.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`${c.red}Fatal Error in Test Runner:${c.reset}`, err);
  process.exit(1);
});
