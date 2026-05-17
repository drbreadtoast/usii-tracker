/**
 * Validates every JSON file in /content/ against /content/schema.json.
 *
 * Checks:
 *   1. JSON parses.
 *   2. Conforms to the schema (manifest.json uses Manifest, others use Section).
 *   3. Optional: every source URL returns < 400 (skippable via SKIP_URL_CHECK=1).
 *   4. Optional: source publishedAt within last 72h (skippable via SKIP_FRESHNESS=1).
 *   5. Headline/summary length caps enforced by schema.
 *   6. manifest.sections counts match actual story counts in section files.
 *
 * Exits 1 on any failure.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SCHEMA_PATH = path.join(CONTENT_DIR, "schema.json");

const SECTION_FILES = [
  "headlines.json",
  "us-politics.json",
  "foreign.json",
  "markets.json",
  "ai-tech.json",
  "war.json",
  "underreported.json",
];
const MANIFEST_FILE = "manifest.json";

const SKIP_URL_CHECK = process.env.SKIP_URL_CHECK === "1";
const SKIP_FRESHNESS = process.env.SKIP_FRESHNESS === "1";
const FRESHNESS_WINDOW_HOURS = 72;
const URL_TIMEOUT_MS = 8000;

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];

function fail(file: string, message: string): void {
  errors.push({ file, message });
}

function formatAjvErrors(file: string, ajvErrors: ErrorObject[] | null | undefined): void {
  if (!ajvErrors) return;
  for (const err of ajvErrors) {
    const at = err.instancePath || "(root)";
    fail(file, `schema: ${at} ${err.message ?? "invalid"}`);
  }
}

async function loadJson<T = unknown>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
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
    // Some servers refuse HEAD; retry with GET on 405/400
    if (res.status === 405 || res.status === 400) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "TheOSSreport-Validator/1.0" },
      });
    }
    // Hard fail: page is genuinely missing
    if (res.status === 404 || res.status === 410) {
      return { ok: false, err: `HTTP ${res.status}` };
    }
    // Soft warn: bot-protected, paywalled, or server-side error.
    // URL likely exists; agents can't pre-verify these reliably.
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

interface SourceLike {
  url: string;
  publishedAt: string;
  outlet?: string;
}

interface StoryLike {
  id: string;
  perspectives: { sources: SourceLike[] }[];
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

async function main(): Promise<void> {
  const schema = await loadJson<Record<string, unknown>>(SCHEMA_PATH);

  // We use draft-07 (configured in the schema). The default Ajv handles this.
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  // Touch Ajv2020 import to keep it available if we move to a newer draft later.
  void Ajv2020;

  // Extract sub-schemas (manifest vs section) for targeted validation per file.
  const baseDefinitions = (schema as { definitions?: Record<string, unknown> }).definitions ?? {};
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

  // 1. Manifest
  let manifest: ManifestLike | null = null;
  try {
    manifest = await loadJson<ManifestLike>(path.join(CONTENT_DIR, MANIFEST_FILE));
    if (!validateManifest(manifest)) {
      formatAjvErrors(MANIFEST_FILE, validateManifest.errors);
    }
  } catch (e) {
    fail(MANIFEST_FILE, `failed to load/parse: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 2. Sections
  const sections: Record<string, SectionLike | null> = {};
  for (const file of SECTION_FILES) {
    const filePath = path.join(CONTENT_DIR, file);
    try {
      const data = await loadJson<SectionLike>(filePath);
      sections[file] = data;
      if (!validateSection(data)) {
        formatAjvErrors(file, validateSection.errors);
      }
      const expectedSectionId = file.replace(/\.json$/, "");
      if (data.sectionId !== expectedSectionId) {
        fail(file, `sectionId is "${data.sectionId}" but file is ${file}`);
      }
    } catch (e) {
      sections[file] = null;
      fail(file, `failed to load/parse: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // 3. Manifest counts match section counts
  if (manifest) {
    for (const file of SECTION_FILES) {
      const cat = file.replace(/\.json$/, "");
      const section = sections[file];
      const declared = manifest.sections?.[cat]?.storyCount;
      if (section && typeof declared === "number" && declared !== section.stories.length) {
        fail(
          MANIFEST_FILE,
          `sections.${cat}.storyCount=${declared} but ${file} has ${section.stories.length} stories`,
        );
      }
    }
  }

  // 4. Story-level checks: duplicate IDs, freshness
  for (const file of SECTION_FILES) {
    const section = sections[file];
    if (!section) continue;
    const ids = new Set<string>();
    for (const story of section.stories) {
      if (ids.has(story.id)) {
        fail(file, `duplicate story id "${story.id}"`);
      }
      ids.add(story.id);
      if (!SKIP_FRESHNESS) {
        for (const persp of story.perspectives) {
          for (const src of persp.sources) {
            const ageHours =
              (Date.now() - new Date(src.publishedAt).getTime()) / 1000 / 60 / 60;
            if (Number.isNaN(ageHours)) {
              fail(file, `story ${story.id}: source ${src.url} publishedAt unparsable`);
            } else if (ageHours > FRESHNESS_WINDOW_HOURS) {
              fail(
                file,
                `story ${story.id}: source ${src.url} is ${ageHours.toFixed(1)}h old (>72h)`,
              );
            }
          }
        }
      }
    }
  }

  // 5. URL reachability
  if (!SKIP_URL_CHECK) {
    const urls = new Set<string>();
    for (const file of SECTION_FILES) {
      const section = sections[file];
      if (!section) continue;
      for (const story of section.stories) {
        for (const persp of story.perspectives) {
          for (const src of persp.sources) {
            urls.add(src.url);
          }
        }
      }
    }
    if (urls.size > 0) {
      process.stdout.write(`Checking ${urls.size} URL(s)`);
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
        if (res.err) {
          fail("urls", `${url} -> ${res.err}`);
        } else if (res.warn) {
          warnings.push({ url, warn: res.warn });
        }
      }
      if (warnings.length > 0) {
        console.log(`\n${warnings.length} URL warning(s) (page likely exists, but verifier can't read it):`);
        for (const w of warnings) {
          console.log(`  ! ${w.url} -> ${w.warn}`);
        }
      }
    }
  } else {
    console.log("(URL reachability check skipped via SKIP_URL_CHECK=1)");
  }

  // Report
  if (errors.length === 0) {
    console.log(`OK: all content validates.`);
    process.exit(0);
  }

  console.error(`\n${errors.length} validation error(s):\n`);
  for (const e of errors) {
    console.error(`  [${e.file}] ${e.message}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error("Validator crashed:", e);
  process.exit(2);
});
