#!/usr/bin/env tsx
/**
 * validate-content.ts
 *
 * Pre-deploy data validation. Catches corruption, drift, and broken
 * cross-file references before content ships.
 *
 * Sections:
 *   1. FILE PRESENCE       — every required file exists
 *   2. JSON SYNTAX         — every file parses
 *   3. SCHEMA              — every file conforms to /content/schema.json
 *   4. STORY IDS           — no duplicates within a section
 *   5. CROSS-FILE          — manifest counts + headlines ⊆ section files
 *   6. FRESHNESS           — source publishedAt within 72h (SKIP_FRESHNESS=1 to skip)
 *   7. URL REACHABILITY    — every source URL responds (SKIP_URL_CHECK=1 to skip)
 *   8. STATEMENTS          — optional statements.json sanity
 *
 * Exit codes:
 *   0 = clean OR warnings only
 *   1 = errors found (blocks deploy)
 *   2 = validator crashed
 *
 * Usage:
 *   tsx scripts/validate-content.ts
 *   SKIP_URL_CHECK=1 tsx scripts/validate-content.ts
 *   SKIP_FRESHNESS=1 SKIP_URL_CHECK=1 tsx scripts/validate-content.ts   # offline
 */

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

// ─── Config ────────────────────────────────────────────────────────────
const CONTENT_DIR = path.join(process.cwd(), "content");
const SCHEMA_PATH = path.join(CONTENT_DIR, "schema.json");

const SECTION_FILES = [
  "headlines.json",
  "us-politics.json",
  "foreign.json",
  "markets.json",
  "ai-tech.json",
  "war.json",
  "eyes-on-israel.json",
  "underreported.json",
] as const;
const MANIFEST_FILE = "manifest.json";
const STATEMENTS_FILE = "statements.json"; // optional

// Documentary sections that legitimately cite records older than the 72h
// breaking-news window (their sources are votes, laws, filings, etc.).
const FRESHNESS_EXEMPT_FILES = new Set<string>(["eyes-on-israel.json"]);

const SKIP_URL_CHECK = process.env.SKIP_URL_CHECK === "1";
const SKIP_FRESHNESS = process.env.SKIP_FRESHNESS === "1";
const FRESHNESS_WINDOW_HOURS = 72;
const URL_TIMEOUT_MS = 8000;

// ─── Terminal colors ───────────────────────────────────────────────────
const C = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
};

let errorCount = 0;
let warnCount = 0;
let okCount = 0;

function err(msg: string): void {
  console.log(`  ${C.red}✗ ERROR${C.reset}  ${msg}`);
  errorCount++;
}
function warn(msg: string): void {
  console.log(`  ${C.yellow}⚠ WARN${C.reset}   ${msg}`);
  warnCount++;
}
function ok(msg: string): void {
  console.log(`  ${C.green}✓ OK${C.reset}     ${msg}`);
  okCount++;
}
function section(n: number, title: string): void {
  console.log(`\n${C.bold}${n}. ${title}${C.reset}`);
}

// ─── Types ─────────────────────────────────────────────────────────────
interface SourceLike {
  url: string;
  publishedAt: string;
  outlet?: string;
}
interface PerspectiveLike {
  lean: string;
  sources: SourceLike[];
}
interface StoryLike {
  id: string;
  category: string;
  perspectives: PerspectiveLike[];
}
interface SectionLike {
  sectionId: string;
  lastUpdated: string;
  stories: StoryLike[];
}
interface ManifestLike {
  lastUpdated: string;
  sections: Record<string, { lastUpdated: string; storyCount: number }>;
}
interface StatementsLike {
  sectionId: string;
  lastUpdated: string;
  statements: Array<{
    id: string;
    speaker: string;
    date: string;
  }>;
}

// ─── Helpers ───────────────────────────────────────────────────────────
async function loadJson<T = unknown>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function formatAjvErrors(
  file: string,
  ajvErrors: ErrorObject[] | null | undefined,
): void {
  if (!ajvErrors) return;
  for (const e of ajvErrors) {
    const at = e.instancePath || "(root)";
    err(`${file} ${at} ${e.message ?? "invalid"}`);
  }
}

type UrlCheckResult = { ok: boolean; warn?: string; err?: string };

async function checkUrlReachable(url: string): Promise<UrlCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), URL_TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "TheOSSreport-Validator/1.0" },
    });
    if (res.status === 405 || res.status === 400) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "TheOSSreport-Validator/1.0" },
      });
    }
    if (res.status === 404 || res.status === 410) {
      return { ok: false, err: `HTTP ${res.status}` };
    }
    if (res.status >= 400) {
      return { ok: true, warn: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

function isBareDomainUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname === "/" && !u.search && !u.hash;
  } catch {
    return false;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log(
    `\n${C.bold}═══════════════════════════════════════════════════${C.reset}`,
  );
  console.log(`${C.bold}  PRE-DEPLOY DATA VALIDATION${C.reset}`);
  console.log(
    `${C.bold}═══════════════════════════════════════════════════${C.reset}`,
  );

  // ─── 1. FILE PRESENCE ────────────────────────────────────────────────
  section(1, "FILE PRESENCE");
  const required = [...SECTION_FILES, MANIFEST_FILE];
  for (const f of required) {
    const p = path.join(CONTENT_DIR, f);
    if (existsSync(p)) ok(f);
    else err(`missing: ${f}`);
  }
  const hasStatements = existsSync(path.join(CONTENT_DIR, STATEMENTS_FILE));
  if (hasStatements) ok(`${STATEMENTS_FILE} (optional)`);
  else
    console.log(
      `  ${C.dim}— ${STATEMENTS_FILE} not present (optional)${C.reset}`,
    );

  // ─── 2. JSON SYNTAX ──────────────────────────────────────────────────
  section(2, "JSON SYNTAX");
  const schemaRaw = await loadJson<Record<string, unknown>>(SCHEMA_PATH);
  ok("schema.json");

  const manifestPath = path.join(CONTENT_DIR, MANIFEST_FILE);
  let manifest: ManifestLike | null = null;
  try {
    manifest = await loadJson<ManifestLike>(manifestPath);
    ok(MANIFEST_FILE);
  } catch (e) {
    err(`${MANIFEST_FILE}: ${e instanceof Error ? e.message : String(e)}`);
  }

  const sections: Record<string, SectionLike | null> = {};
  for (const f of SECTION_FILES) {
    try {
      sections[f] = await loadJson<SectionLike>(path.join(CONTENT_DIR, f));
      ok(f);
    } catch (e) {
      sections[f] = null;
      err(`${f}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  let statements: StatementsLike | null = null;
  if (hasStatements) {
    try {
      statements = await loadJson<StatementsLike>(
        path.join(CONTENT_DIR, STATEMENTS_FILE),
      );
      ok(STATEMENTS_FILE);
    } catch (e) {
      err(`${STATEMENTS_FILE}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // ─── 3. SCHEMA ───────────────────────────────────────────────────────
  section(3, "SCHEMA CONFORMANCE");
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const baseDefinitions =
    (schemaRaw as { definitions?: Record<string, unknown> }).definitions ?? {};
  const manifestSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: baseDefinitions,
    ...((baseDefinitions.manifest as Record<string, unknown>) ?? {}),
  };
  const sectionSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: baseDefinitions,
    ...((baseDefinitions.section as Record<string, unknown>) ?? {}),
  };
  const validateManifest = ajv.compile(manifestSchema);
  const validateSection = ajv.compile(sectionSchema);

  if (manifest) {
    if (validateManifest(manifest)) ok(`${MANIFEST_FILE} → Manifest`);
    else formatAjvErrors(MANIFEST_FILE, validateManifest.errors);
  }
  for (const f of SECTION_FILES) {
    const data = sections[f];
    if (!data) continue;
    if (validateSection(data)) ok(`${f} → Section`);
    else formatAjvErrors(f, validateSection.errors);

    const expected = f.replace(/\.json$/, "");
    if (data.sectionId !== expected)
      err(`${f}: sectionId="${data.sectionId}" does not match filename`);
  }

  // ─── 4. STORY IDS ────────────────────────────────────────────────────
  section(4, "STORY ID INTEGRITY");
  for (const f of SECTION_FILES) {
    const sec = sections[f];
    if (!sec) continue;
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const s of sec.stories) {
      if (seen.has(s.id)) dupes.add(s.id);
      seen.add(s.id);
    }
    if (dupes.size > 0) err(`${f}: duplicate IDs ${Array.from(dupes).join(", ")}`);
    else ok(`${f}: ${seen.size} unique story IDs`);
  }

  // ─── 5. CROSS-FILE CONSISTENCY ───────────────────────────────────────
  section(5, "CROSS-FILE CONSISTENCY");

  // Manifest storyCount matches actual section length
  if (manifest) {
    for (const f of SECTION_FILES) {
      const cat = f.replace(/\.json$/, "");
      const sec = sections[f];
      const declared = manifest.sections?.[cat]?.storyCount;
      if (!sec) continue;
      if (typeof declared !== "number") {
        err(`${MANIFEST_FILE}: missing sections.${cat}.storyCount`);
      } else if (declared !== sec.stories.length) {
        err(
          `${MANIFEST_FILE}: sections.${cat}.storyCount=${declared} but ${f} has ${sec.stories.length} stories`,
        );
      } else {
        ok(`manifest.sections.${cat}.storyCount = ${declared}`);
      }
    }
  }

  // Headlines IDs must also live in their original-category section file
  // (or carry a clear note that they're cross-posted exclusive)
  const headlines = sections["headlines.json"];
  if (headlines) {
    let crossPostMismatch = 0;
    const sectionIdSets = new Map<string, Set<string>>();
    for (const f of SECTION_FILES) {
      if (f === "headlines.json") continue;
      const sec = sections[f];
      if (!sec) continue;
      sectionIdSets.set(
        f.replace(/\.json$/, ""),
        new Set(sec.stories.map((s) => s.id)),
      );
    }
    for (const h of headlines.stories) {
      const cat = h.category;
      if (cat === "headlines") continue;
      const peer = sectionIdSets.get(cat);
      if (!peer) continue;
      if (!peer.has(h.id)) {
        crossPostMismatch++;
        warn(
          `headlines.json: story "${h.id}" claims category="${cat}" but not present in ${cat}.json`,
        );
      }
    }
    if (crossPostMismatch === 0)
      ok(`headlines.json: all story IDs cross-match their section file`);
  }

  // manifest.lastUpdated should be >= all section.lastUpdated
  if (manifest) {
    let manifestStale = 0;
    const manifestT = new Date(manifest.lastUpdated).getTime();
    for (const f of SECTION_FILES) {
      const sec = sections[f];
      if (!sec) continue;
      const sectionT = new Date(sec.lastUpdated).getTime();
      if (sectionT > manifestT) {
        manifestStale++;
        warn(
          `${f}.lastUpdated is later than manifest.lastUpdated — manifest may need re-stamp`,
        );
      }
    }
    if (manifestStale === 0)
      ok(`manifest.lastUpdated is current vs all sections`);
  }

  // ─── 6. SOURCE FRESHNESS ─────────────────────────────────────────────
  section(6, "SOURCE FRESHNESS");
  if (SKIP_FRESHNESS) {
    console.log(
      `  ${C.dim}(skipped via SKIP_FRESHNESS=1)${C.reset}`,
    );
  } else {
    let stale = 0;
    let unparsable = 0;
    let total = 0;
    for (const f of SECTION_FILES) {
      const sec = sections[f];
      if (!sec) continue;
      // Documentary sections (e.g. Eyes on Israel) cite older records by
      // design, so they're exempt from the 72h breaking-news window.
      if (FRESHNESS_EXEMPT_FILES.has(f)) continue;
      for (const story of sec.stories) {
        for (const persp of story.perspectives) {
          for (const src of persp.sources) {
            total++;
            const ms = new Date(src.publishedAt).getTime();
            if (Number.isNaN(ms)) {
              err(
                `${f}: ${story.id} source ${src.outlet ?? "(?)"} publishedAt unparsable: "${src.publishedAt}"`,
              );
              unparsable++;
              continue;
            }
            const ageH = (Date.now() - ms) / 3_600_000;
            if (ageH > FRESHNESS_WINDOW_HOURS) {
              err(
                `${f}: ${story.id} source ${src.outlet ?? "(?)"} is ${ageH.toFixed(1)}h old (>${FRESHNESS_WINDOW_HOURS}h)`,
              );
              stale++;
            }
          }
        }
      }
    }
    if (stale === 0 && unparsable === 0)
      ok(`${total} source publishedAt timestamps all within ${FRESHNESS_WINDOW_HOURS}h`);
  }

  // ─── 7. URL REACHABILITY ─────────────────────────────────────────────
  section(7, "URL REACHABILITY");
  if (SKIP_URL_CHECK) {
    console.log(`  ${C.dim}(skipped via SKIP_URL_CHECK=1)${C.reset}`);
  } else {
    const urls = new Set<string>();
    let bareCount = 0;
    for (const f of SECTION_FILES) {
      const sec = sections[f];
      if (!sec) continue;
      for (const story of sec.stories) {
        for (const persp of story.perspectives) {
          for (const src of persp.sources) {
            urls.add(src.url);
            if (isBareDomainUrl(src.url)) {
              bareCount++;
              warn(
                `${f}: ${story.id} source ${src.outlet ?? "(?)"} uses bare domain "${src.url}" (should be article URL)`,
              );
            }
          }
        }
      }
    }
    if (bareCount === 0) ok(`no bare-domain URLs found`);

    if (urls.size > 0) {
      process.stdout.write(`  checking ${urls.size} URL(s) `);
      const results = await Promise.all(
        Array.from(urls).map(async (url) => {
          const res = await checkUrlReachable(url);
          process.stdout.write(res.err ? "x" : res.warn ? "!" : ".");
          return { url, res };
        }),
      );
      process.stdout.write("\n");
      const warnings: { url: string; warn: string }[] = [];
      for (const { url, res } of results) {
        if (res.err) err(`URL ${url}: ${res.err}`);
        else if (res.warn) warnings.push({ url, warn: res.warn });
      }
      if (warnings.length > 0) {
        console.log(
          `  ${C.yellow}${warnings.length} bot-protected/paywalled URL(s):${C.reset}`,
        );
        for (const w of warnings) {
          console.log(`    ${C.yellow}!${C.reset} ${w.url} → ${w.warn}`);
        }
        warnCount += warnings.length;
      } else if (results.length > 0) {
        ok(`${results.length} URLs reachable`);
      }
    }
  }

  // ─── 8. STATEMENTS (optional) ────────────────────────────────────────
  if (statements) {
    section(8, "STATEMENTS");
    if (statements.sectionId !== "statements")
      err(
        `${STATEMENTS_FILE}: sectionId="${statements.sectionId}" (expected "statements")`,
      );
    else ok(`${STATEMENTS_FILE} sectionId`);

    const sids = new Set<string>();
    const sdupes = new Set<string>();
    for (const s of statements.statements ?? []) {
      if (sids.has(s.id)) sdupes.add(s.id);
      sids.add(s.id);
    }
    if (sdupes.size > 0)
      err(`${STATEMENTS_FILE}: duplicate IDs ${Array.from(sdupes).join(", ")}`);
    else ok(`${STATEMENTS_FILE}: ${sids.size} unique statement IDs`);

    if (!SKIP_FRESHNESS) {
      let stale = 0;
      for (const s of statements.statements ?? []) {
        const ms = new Date(s.date).getTime();
        if (Number.isNaN(ms)) {
          err(`${STATEMENTS_FILE}: ${s.id} date unparsable: "${s.date}"`);
          continue;
        }
        const ageH = (Date.now() - ms) / 3_600_000;
        // Statements have a more generous 14-day freshness window
        if (ageH > 14 * 24) {
          warn(`${STATEMENTS_FILE}: ${s.id} is ${(ageH / 24).toFixed(1)} days old`);
          stale++;
        }
      }
      if (stale === 0) ok(`${STATEMENTS_FILE}: all dates within 14 days`);
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────────
  console.log(
    `\n${C.bold}═══════════════════════════════════════════════════${C.reset}`,
  );
  console.log(
    `  Passed: ${C.green}${okCount}${C.reset}  ` +
      `Warnings: ${C.yellow}${warnCount}${C.reset}  ` +
      `Errors: ${C.red}${errorCount}${C.reset}`,
  );

  if (errorCount > 0) {
    console.log(
      `\n  ${C.red}${C.bold}FAIL${C.reset} — ${errorCount} error(s). Do not deploy.`,
    );
    console.log(
      `${C.bold}═══════════════════════════════════════════════════${C.reset}\n`,
    );
    process.exit(1);
  }
  if (warnCount > 0) {
    console.log(
      `\n  ${C.yellow}${C.bold}PASS WITH WARNINGS${C.reset} — Review before deploying.`,
    );
  } else {
    console.log(
      `\n  ${C.green}${C.bold}PASS${C.reset} — All validation checks passed.`,
    );
  }
  console.log(
    `${C.bold}═══════════════════════════════════════════════════${C.reset}\n`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(`${C.red}Validator crashed:${C.reset}`, e);
  process.exit(2);
});
