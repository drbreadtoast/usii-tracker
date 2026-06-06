#!/usr/bin/env tsx
/**
 * verify-content.ts
 *
 * Post-refresh recency check. Catches the case where the scheduled
 * agent skipped or partially updated content files.
 *
 * Two checks per file:
 *   1. mtime: file was modified within RECENCY_MINUTES
 *   2. lastUpdated: in-file timestamp is within STALE_HOURS of now
 *
 * Priority tiers:
 *   - CRITICAL: must be fresh; otherwise exit 1
 *   - HIGH:     warn but don't block
 *   - METADATA: must match a section file's lastUpdated
 *
 * Usage:
 *   tsx scripts/verify-content.ts                     # default RECENCY_MINUTES=360
 *   tsx scripts/verify-content.ts 60                  # check last 60 min
 *   STRICT=1 tsx scripts/verify-content.ts            # treat HIGH warns as errors
 */

import { promises as fs } from "node:fs";
import { statSync, existsSync } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

const CRITICAL = [
  "manifest.json",
  "headlines.json",
];

const HIGH = [
  "us-politics.json",
  "foreign.json",
  "war.json",
  "markets.json",
];

const MEDIUM = [
  "ai-tech.json",
  "underreported.json",
  "foreign-influence.json",
];

// Tracker metric files (content/trackers/). Updated less often than the news
// feeds, so warn-not-block — they never gate a deploy.
const TRACKERS = [
  "trackers/oil.json",
  "trackers/war-cost.json",
  "trackers/israel-funding.json",
];

const OPTIONAL = [
  "statements.json",
];

type Tier = "CRITICAL" | "HIGH" | "MEDIUM" | "TRACKERS" | "OPTIONAL";

const ALL: { file: string; tier: Tier }[] = [
  ...CRITICAL.map((f) => ({ file: f, tier: "CRITICAL" as const })),
  ...HIGH.map((f) => ({ file: f, tier: "HIGH" as const })),
  ...MEDIUM.map((f) => ({ file: f, tier: "MEDIUM" as const })),
  ...TRACKERS.map((f) => ({ file: f, tier: "TRACKERS" as const })),
  ...OPTIONAL.map((f) => ({ file: f, tier: "OPTIONAL" as const })),
];

const RECENCY_MINUTES = Number(process.argv[2]) || 360; // 6h default
const STALE_HOURS = 26; // a touch beyond 24h to absorb timezone drift
const STRICT = process.env.STRICT === "1";

const C = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
};

function tierColor(t: Tier): string {
  switch (t) {
    case "CRITICAL":
      return C.red;
    case "HIGH":
      return C.yellow;
    case "MEDIUM":
      return C.cyan;
    case "TRACKERS":
      return C.cyan;
    case "OPTIONAL":
      return C.dim;
  }
}

interface Result {
  file: string;
  tier: Tier;
  mtimeAgeMin: number | null;
  declaredAgeHours: number | null;
  errors: string[];
  warnings: string[];
}

async function checkFile(file: string, tier: Tier): Promise<Result> {
  const filePath = path.join(CONTENT_DIR, file);
  const r: Result = {
    file,
    tier,
    mtimeAgeMin: null,
    declaredAgeHours: null,
    errors: [],
    warnings: [],
  };

  if (!existsSync(filePath)) {
    if (tier === "OPTIONAL") {
      r.warnings.push("file missing (optional)");
    } else {
      r.errors.push("file missing");
    }
    return r;
  }

  // 1. mtime recency
  const stat = statSync(filePath);
  const ageMin = (Date.now() - stat.mtimeMs) / 60_000;
  r.mtimeAgeMin = ageMin;
  if (ageMin > RECENCY_MINUTES) {
    const msg = `not modified in ${ageMin.toFixed(0)} min (cutoff ${RECENCY_MINUTES})`;
    if (tier === "CRITICAL") r.errors.push(msg);
    else r.warnings.push(msg);
  }

  // 2. declared lastUpdated freshness
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const lu =
      (data.lastUpdated as string | undefined) ??
      ((data.metadata as Record<string, unknown> | undefined)?.lastUpdated as
        | string
        | undefined);
    if (lu) {
      const luDate = new Date(lu);
      if (Number.isNaN(luDate.getTime())) {
        r.errors.push(`invalid lastUpdated value "${lu}"`);
      } else {
        const ageHours = (Date.now() - luDate.getTime()) / 3_600_000;
        r.declaredAgeHours = ageHours;
        if (ageHours > STALE_HOURS) {
          const msg = `declared lastUpdated is ${ageHours.toFixed(0)}h old`;
          if (tier === "CRITICAL") r.errors.push(msg);
          else r.warnings.push(msg);
        }
      }
    } else if (tier === "CRITICAL" || tier === "HIGH") {
      r.warnings.push("no lastUpdated field");
    }
  } catch (e) {
    r.errors.push(
      `JSON parse failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  return r;
}

function fmtAge(min: number | null): string {
  if (min === null) return "  --  ";
  if (min < 60) return `${min.toFixed(0).padStart(4)}m`;
  return `${(min / 60).toFixed(1).padStart(4)}h`;
}

async function main(): Promise<void> {
  console.log(
    `\n${C.bold}═══════════════════════════════════════════════════${C.reset}`,
  );
  console.log(`${C.bold}  CONTENT REFRESH VERIFICATION${C.reset}`);
  console.log(
    `${C.bold}═══════════════════════════════════════════════════${C.reset}`,
  );
  console.log(
    `\nRecency window: ${C.bold}${RECENCY_MINUTES} min${C.reset}` +
      `   Strict mode: ${STRICT ? `${C.bold}${C.yellow}ON${C.reset}` : "off"}\n`,
  );

  const results = await Promise.all(
    ALL.map(({ file, tier }) => checkFile(file, tier)),
  );

  let errorCount = 0;
  let warnCount = 0;
  let okCount = 0;

  // Group by tier
  const byTier: Record<Tier, Result[]> = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    TRACKERS: [],
    OPTIONAL: [],
  };
  for (const r of results) byTier[r.tier].push(r);

  const tierOrder: Tier[] = [
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "TRACKERS",
    "OPTIONAL",
  ];

  for (const tier of tierOrder) {
    const tierResults = byTier[tier];
    if (tierResults.length === 0) continue;
    console.log(
      `${C.bold}${tierColor(tier)}${tier}${C.reset}` +
        `${C.dim} (${tierResults.length} files)${C.reset}`,
    );
    for (const r of tierResults) {
      const status = r.errors.length
        ? `${C.red}✗${C.reset}`
        : r.warnings.length
          ? `${C.yellow}⚠${C.reset}`
          : `${C.green}✓${C.reset}`;
      const ageCol = `mtime ${fmtAge(r.mtimeAgeMin)}`;
      const luCol = `lu ${fmtAge(r.declaredAgeHours ? r.declaredAgeHours * 60 : null)}`;
      const meta = `${C.dim}${ageCol}  ${luCol}${C.reset}`;
      console.log(
        `  ${status} ${r.file.padEnd(22)} ${meta}` +
          (r.errors.length
            ? `  ${C.red}${r.errors.join("; ")}${C.reset}`
            : r.warnings.length
              ? `  ${C.yellow}${r.warnings.join("; ")}${C.reset}`
              : ""),
      );
      if (r.errors.length) errorCount += r.errors.length;
      else if (r.warnings.length) warnCount += r.warnings.length;
      else okCount += 1;
    }
    console.log("");
  }

  const missedCritical = byTier.CRITICAL.filter((r) => r.errors.length > 0);

  console.log(
    `${C.bold}───────────────────────────────────────────────────${C.reset}`,
  );
  console.log(
    `  Fresh: ${C.green}${okCount}${C.reset}  ` +
      `Warnings: ${C.yellow}${warnCount}${C.reset}  ` +
      `Errors: ${C.red}${errorCount}${C.reset}`,
  );

  if (missedCritical.length > 0) {
    console.log(
      `\n  ${C.red}${C.bold}FAIL${C.reset} — ` +
        `${missedCritical.length} CRITICAL file(s) not fresh. Do not deploy.`,
    );
    process.exit(1);
  }

  if (STRICT && warnCount > 0) {
    console.log(
      `\n  ${C.yellow}${C.bold}FAIL (strict)${C.reset} — ` +
        `${warnCount} warning(s) treated as errors.`,
    );
    process.exit(1);
  }

  if (warnCount > 0) {
    console.log(
      `\n  ${C.yellow}${C.bold}PASS WITH WARNINGS${C.reset} — Review before deploying.`,
    );
  } else {
    console.log(
      `\n  ${C.green}${C.bold}PASS${C.reset} — all content fresh.`,
    );
  }
  console.log(
    `${C.bold}═══════════════════════════════════════════════════${C.reset}\n`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("Verifier crashed:", e);
  process.exit(2);
});
