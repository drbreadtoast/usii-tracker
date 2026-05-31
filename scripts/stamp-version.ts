#!/usr/bin/env tsx
/**
 * stamp-version.ts
 *
 * Pre-build hook. Writes /public/build-id.json with a unique build
 * identifier the client polls to detect new deploys.
 *
 * Why: After a 4×/day refresh deploy, users with stale tabs open
 * keep seeing yesterday's content. The client useFreshBuild() hook
 * polls /build-id.json every 60s; when it changes, the user sees a
 * banner offering to reload.
 *
 * Format:
 *   {
 *     "buildId": "<git-short-sha>-<unix-seconds>",
 *     "builtAt": "2026-05-17T14:00:00.000Z",
 *     "commit": "8b6f3a1",
 *     "manifestLastUpdated": "2026-05-17T14:00:00Z"
 *   }
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_PATH = path.join(PUBLIC_DIR, "build-id.json");
const MANIFEST_PATH = path.join(ROOT, "content", "manifest.json");

function shortSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "nogit";
  }
}

function readManifestLastUpdated(): string | null {
  if (!existsSync(MANIFEST_PATH)) return null;
  try {
    const raw = readFileSync(MANIFEST_PATH, "utf8");
    const m = JSON.parse(raw) as { lastUpdated?: string };
    return m.lastUpdated ?? null;
  } catch {
    return null;
  }
}

function main(): void {
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  const now = new Date();
  const sha = shortSha();
  const epoch = Math.floor(now.getTime() / 1000);
  const buildId = `${sha}-${epoch}`;
  const manifestLastUpdated = readManifestLastUpdated();

  const payload = {
    buildId,
    builtAt: now.toISOString(),
    commit: sha,
    manifestLastUpdated,
  };

  writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + "\n");

  console.log(
    `✅ Stamped build-id.json — ${buildId} (${now.toISOString()})`,
  );
}

main();
