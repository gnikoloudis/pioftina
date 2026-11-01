import fs from "fs/promises";
import os from "os";
import path from "path";

const memoryStore = new Map<string, unknown>();

function getBundledFilePath(filename: string): string {
  return path.join(process.cwd(), "src", "data", filename);
}

function getTmpFilePath(filename: string): string {
  return path.join(os.tmpdir(), "pioftina-data", filename);
}

/**
 * Reads a JSON data file safely across both local development and read-only serverless (Vercel) environments.
 * Checks runtime /tmp overlay and in-memory store first before falling back to bundled src/data/<filename>.
 */
export async function readJsonDataFile<T>(filename: string, defaultValue: T): Promise<T> {
  // 1. On serverless, check /tmp overlay first if written during this instance's lifecycle
  if (process.env.VERCEL) {
    try {
      const tmpRaw = await fs.readFile(getTmpFilePath(filename), "utf-8");
      const parsed = JSON.parse(tmpRaw) as T;
      memoryStore.set(filename, parsed);
      return parsed;
    } catch {
      if (memoryStore.has(filename)) {
        return memoryStore.get(filename) as T;
      }
    }
  }

  // 2. Read from bundled src/data/<filename>
  try {
    const raw = await fs.readFile(getBundledFilePath(filename), "utf-8");
    const parsed = JSON.parse(raw) as T;
    memoryStore.set(filename, parsed);
    return parsed;
  } catch {
    if (memoryStore.has(filename)) {
      return memoryStore.get(filename) as T;
    }
    return defaultValue;
  }
}

/**
 * Writes a JSON data file safely.
 * In local development, writes to src/data/<filename>.
 * In Vercel serverless (or if EROFS/EACCES occurs on a read-only filesystem), writes to /tmp/pioftina-data/<filename> and updates in-memory state.
 */
export async function writeJsonDataFile<T>(filename: string, data: T): Promise<void> {
  memoryStore.set(filename, data);
  const serialized = JSON.stringify(data, null, 2);

  if (!process.env.VERCEL) {
    try {
      const bundledPath = getBundledFilePath(filename);
      await fs.mkdir(path.dirname(bundledPath), { recursive: true });
      await fs.writeFile(bundledPath, serialized, "utf-8");
      return;
    } catch (err: any) {
      if (err?.code !== "EROFS" && err?.code !== "EACCES" && err?.code !== "EPERM") {
        throw err;
      }
    }
  }

  // Fallback for Vercel serverless (/var/task is read-only EROFS; /tmp is writable)
  try {
    const tmpPath = getTmpFilePath(filename);
    await fs.mkdir(path.dirname(tmpPath), { recursive: true });
    await fs.writeFile(tmpPath, serialized, "utf-8");
  } catch {
    // In-memory store already holds the updated data if /tmp is also constrained
  }
}
