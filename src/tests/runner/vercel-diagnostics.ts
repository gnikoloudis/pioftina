import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bgRed: "\x1b[41m\x1b[37m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgYellow: "\x1b[43m\x1b[30m",
};

interface DiagnosticOptions {
  project: string;
  mode: "all" | "build" | "runtime" | "errors";
  since?: string;
  limit: number;
  deploymentUrl?: string;
  jsonOutput: boolean;
}

interface DeploymentInfo {
  age: string;
  project: string;
  url: string;
  status: string;
  environment: string;
  duration: string;
}

interface RuntimeLogEntry {
  id?: string;
  timestamp?: string | number;
  time?: string;
  deploymentId?: string;
  level?: string;
  status?: number;
  host?: string;
  method?: string;
  path?: string;
  message?: string;
  source?: string;
  nestedLogs?: Array<{ level: string; message: string }>;
}

function parseArgs(): DiagnosticOptions {
  const args = process.argv.slice(2);
  const options: DiagnosticOptions = {
    project: process.env.VERCEL_PROJECT_NAME || "pioftina",
    mode: "all",
    limit: 50,
    jsonOutput: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--project=")) {
      options.project = arg.split("=")[1];
    } else if (arg.startsWith("--mode=")) {
      const m = arg.split("=")[1] as DiagnosticOptions["mode"];
      if (["all", "build", "runtime", "errors"].includes(m)) {
        options.mode = m;
      }
    } else if (arg.startsWith("--since=")) {
      const val = arg.split("=")[1];
      if (val) options.since = val;
    } else if (arg.startsWith("--limit=")) {
      options.limit = parseInt(arg.split("=")[1], 10) || 50;
    } else if (arg.startsWith("--deployment=")) {
      options.deploymentUrl = arg.split("=")[1];
    } else if (arg === "--json") {
      options.jsonOutput = true;
    }
  }

  return options;
}

async function runVercelCommand(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  const isWin = process.platform === "win32";
  const bin = isWin ? "cmd.exe" : "vercel";
  const finalArgs = isWin ? ["/c", "vercel", ...args, "--no-color"] : [...args, "--no-color"];

  try {
    const { stdout, stderr } = await execFileAsync(bin, finalArgs, {
      maxBuffer: 15 * 1024 * 1024,
      timeout: 30000,
    });
    return { stdout: stdout || "", stderr: stderr || "", code: 0 };
  } catch (err: any) {
    return {
      stdout: err?.stdout || "",
      stderr: err?.stderr || err?.message || "",
      code: typeof err?.code === "number" ? err.code : 1,
    };
  }
}

function parseDeploymentsList(rawOutput: string): DeploymentInfo[] {
  const lines = rawOutput.split(/\r?\n/);
  const deployments: DeploymentInfo[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.includes("https://")) continue;

    const match = trimmed.match(
      /^(\S+)\s+(\S+)\s+(https:\/\/\S+)\s+(?:●\s*)?(Ready|Error|Building|Queued|Canceled)\s+(\S+)\s+(\S+)/i
    );
    if (match) {
      deployments.push({
        age: match[1],
        project: match[2],
        url: match[3],
        status: match[4],
        environment: match[5],
        duration: match[6],
      });
    }
  }

  return deployments;
}

function extractBuildErrorLines(rawBuildLogs: string): string[] {
  const lines = rawBuildLogs.split(/\r?\n/);
  const errorLines: string[] = [];

  let capturingErrorBlock = false;
  for (const line of lines) {
    const clean = line.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s+/, "").trim();
    if (!clean) continue;

    if (
      clean.startsWith("Error:") ||
      clean.includes("Error occurred prerendering") ||
      clean.includes("Export encountered an error") ||
      clean.includes("Failed to compile") ||
      clean.includes("Type error:") ||
      clean.includes("exited with code:") ||
      clean.includes("[BUILD_UTILS_SPAWN")
    ) {
      capturingErrorBlock = true;
    }

    if (capturingErrorBlock) {
      errorLines.push(clean);
    }
  }

  if (errorLines.length === 0) {
    return lines
      .slice(-25)
      .map((l) => l.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s+/, "").trim())
      .filter(Boolean);
  }

  return errorLines;
}

function parseRuntimeLogs(rawOutput: string): RuntimeLogEntry[] {
  const lines = rawOutput.split(/\r?\n/);
  const entries: RuntimeLogEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const obj = JSON.parse(trimmed);
        const tsNum = typeof obj.timestamp === "number" ? obj.timestamp : undefined;
        const formattedTime = tsNum
          ? new Date(tsNum).toISOString().slice(11, 22)
          : obj.time || "";

        entries.push({
          id: obj.id,
          timestamp: obj.timestamp,
          time: formattedTime,
          deploymentId: obj.deploymentId,
          level: (obj.level || obj.type || "info").toLowerCase(),
          status: obj.responseStatusCode || obj.statusCode || obj.status,
          host: obj.domain || obj.host,
          method: obj.requestMethod || "GET",
          path: obj.requestPath || obj.path || obj.url,
          message: obj.message || obj.msg || "(no message)",
          source: obj.source,
          nestedLogs: Array.isArray(obj.logs) ? obj.logs : [],
        });
        continue;
      } catch {
        // Fall through
      }
    }
  }

  return entries;
}

async function main() {
  const options = parseArgs();

  if (!options.jsonOutput) {
    console.log(`\n${c.bold}${c.cyan}========================================================================${c.reset}`);
    console.log(`${c.bold}${c.cyan}   📡 pioftina.gr — Vercel Deployment & Runtime Log Diagnostics         ${c.reset}`);
    console.log(`${c.cyan}========================================================================${c.reset}\n`);
  }

  // 1. Fetch recent deployments list
  const listRes = await runVercelCommand(["list", options.project]);
  const combinedListOutput = `${listRes.stdout}\n${listRes.stderr}`;
  const deployments = parseDeploymentsList(combinedListOutput);
  const latestDeployment = options.deploymentUrl
    ? deployments.find((d) => d.url.includes(options.deploymentUrl!)) || {
        age: "custom",
        project: options.project,
        url: options.deploymentUrl,
        status: "Unknown",
        environment: "Production",
        duration: "-",
      }
    : deployments[0];

  let buildErrors: string[] = [];

  if (!options.jsonOutput) {
    console.log(`${c.bold}${c.blue}▶ 1. Κατάσταση Πρόσφατων Deployments (${options.project})${c.reset}`);
    if (deployments.length === 0) {
      console.log(`  ${c.yellow}⚠ Δεν βρέθηκαν deployments ή απαιτείται σύνδεση (vercel login).${c.reset}\n`);
    } else {
      for (const d of deployments.slice(0, 5)) {
        const badge =
          d.status.toLowerCase() === "ready"
            ? `${c.green}● Ready${c.reset}`
            : d.status.toLowerCase() === "error"
            ? `${c.red}● Error${c.reset}`
            : `${c.yellow}● ${d.status}${c.reset}`;
        console.log(`  ${badge}  ${c.dim}[${d.age}]${c.reset} ${d.url} ${c.dim}(${d.environment}, ${d.duration})${c.reset}`);
      }
      console.log("");
    }
  }

  // 2. Inspect Build Logs if latest deployment failed or --mode=build
  if (
    latestDeployment &&
    (options.mode === "build" ||
      (options.mode === "all" && latestDeployment.status.toLowerCase() === "error"))
  ) {
    if (!options.jsonOutput) {
      console.log(
        `${c.bold}${c.blue}▶ 2. Ανάλυση Build Logs για: ${latestDeployment.url}${c.reset}`
      );
    }

    const inspectRes = await runVercelCommand([
      "inspect",
      latestDeployment.url,
      "--logs",
    ]);
    const rawBuild = `${inspectRes.stdout}\n${inspectRes.stderr}`;
    buildErrors = extractBuildErrorLines(rawBuild);

    if (!options.jsonOutput) {
      if (latestDeployment.status.toLowerCase() === "error") {
        console.log(`  ${c.bgRed} ΒΡΕΘΗΚΕ ΣΦΑΛΜΑ BUILD ΣΤΟ VERCEL ${c.reset}`);
        for (const errLine of buildErrors) {
          const color =
            errLine.startsWith("Error:") || errLine.includes("error")
              ? c.red
              : c.dim;
          console.log(`  ${color}${errLine}${c.reset}`);
        }
      } else {
        console.log(`  ${c.green}✓ Το build ολοκληρώθηκε επιτυχώς.${c.reset}`);
        for (const line of buildErrors.slice(-10)) {
          console.log(`  ${c.dim}${line}${c.reset}`);
        }
      }
      console.log("");
    }
  }

  // 3. Fetch Runtime Logs if mode is all, runtime, or errors
  let runtimeLogs: RuntimeLogEntry[] = [];
  if (options.mode === "all" || options.mode === "runtime" || options.mode === "errors") {
    const fetchLimit = options.mode === "errors" ? Math.max(options.limit, 100) : options.limit;
    const logArgs = [
      "logs",
      "--project",
      options.project,
      "--no-branch",
      "--limit",
      String(fetchLimit),
      "--json",
    ];
    if (options.since) {
      logArgs.push("--since", options.since);
    }

    const logsRes = await runVercelCommand(logArgs);
    const rawLogs = `${logsRes.stdout}\n${logsRes.stderr}`;
    runtimeLogs = parseRuntimeLogs(rawLogs);

    const errorLogs = runtimeLogs.filter(
      (l) =>
        l.level === "error" ||
        l.level === "fatal" ||
        (l.status && l.status >= 500)
    );
    const warnLogs = runtimeLogs.filter(
      (l) =>
        l.level === "warn" ||
        l.level === "warning" ||
        (l.status && l.status >= 400 && l.status < 500 && l.level !== "info")
    );

    if (!options.jsonOutput) {
      console.log(
        `${c.bold}${c.blue}▶ 3. Ανάλυση Runtime Logs (Σύνολο Εγγραφών: ${runtimeLogs.length})${c.reset}`
      );
      console.log(
        `  Σύνοψη: ${c.red}${errorLogs.length} Errors (5xx)${c.reset} | ${c.yellow}${warnLogs.length} Warnings (warn)${c.reset} | ${c.green}${runtimeLogs.length - errorLogs.length - warnLogs.length} Info (2xx/3xx/4xx)${c.reset}\n`
      );

      const displayList =
        options.mode === "errors"
          ? [...errorLogs, ...warnLogs]
          : runtimeLogs.slice(0, 20);

      if (displayList.length === 0) {
        console.log(`  ${c.green}✓ Δεν καταγράφηκαν σφάλματα ή προειδοποιήσεις runtime.${c.reset}\n`);
      } else {
        for (const item of displayList) {
          const lvlColor =
            item.level === "error" || (item.status && item.status >= 500)
              ? c.red
              : item.level === "warn" || item.level === "warning"
              ? c.yellow
              : c.green;
          const timeLabel = item.time || "";
          const statusLabel = item.status ? `[HTTP ${item.status}]` : "";
          const methodPath = `${item.method || "GET"} ${item.path || ""}`.trim();
          console.log(
            `  ${c.dim}${timeLabel}${c.reset} ${lvlColor}${item.level?.toUpperCase().padEnd(5)}${c.reset} ${statusLabel} ${c.bold}${methodPath}${c.reset} — ${item.message || "(OK)"}`
          );
          if (item.nestedLogs && item.nestedLogs.length > 1) {
            for (const sub of item.nestedLogs.slice(1)) {
              console.log(`             ${c.dim}↳ [${sub.level}] ${sub.message}${c.reset}`);
            }
          }
        }
        console.log("");
      }
    }
  }

  if (options.jsonOutput) {
    console.log(
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          project: options.project,
          latestDeployment,
          recentDeployments: deployments.slice(0, 5),
          buildErrors,
          runtimeLogCount: runtimeLogs.length,
          runtimeLogs,
        },
        null,
        2
      )
    );
  }
}

main().catch((err) => {
  console.error("Vercel Diagnostics Runner failed:", err);
  process.exit(1);
});
