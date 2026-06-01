#!/usr/bin/env tsx
/**
 * fetch-oilprice.ts
 *
 * Pre-build hook. Calls the shared lib/oilprice fetcher and writes
 * /public/oilprice-snapshot.json — used as the SSR initial-render
 * fallback by app/page.tsx + components/OilHero.tsx.
 *
 * The truly-live values are served by /api/oilprice (which the
 * OilHero polls every 60s while the page is open). This snapshot
 * only matters for the first paint and for moments when the API
 * route is unavailable.
 *
 * Failure modes:
 *   - Fetch error / non-200 → keep previous snapshot (only bump
 *     fetchedAt). Build never blocks.
 *   - Parse error → keep previous snapshot.
 *   - No prior snapshot + scrape fails → write empty quotes; OilHero
 *     uses its own hardcoded OILPRICE_FALLBACK.
 *
 * Exit code: always 0 (don't block builds).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  fetchOilPriceHtml,
  parseOilPriceSnapshot,
  OILPRICE_URL,
  type OilPriceSnapshot,
} from "../lib/oilprice";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUT_PATH = path.join(PUBLIC_DIR, "oilprice-snapshot.json");

function readPreviousSnapshot(): OilPriceSnapshot | null {
  if (!existsSync(OUT_PATH)) return null;
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8")) as OilPriceSnapshot;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  const html = await fetchOilPriceHtml();

  if (!html) {
    const prev = readPreviousSnapshot();
    if (prev) {
      console.warn(
        "fetch-oilprice: keeping previous snapshot (network failed)",
      );
      prev.fetchedAt = new Date().toISOString();
      writeFileSync(OUT_PATH, JSON.stringify(prev, null, 2) + "\n");
      return;
    }
    console.warn(
      "fetch-oilprice: no previous snapshot to fall back to; emitting empty",
    );
    writeFileSync(
      OUT_PATH,
      JSON.stringify(
        {
          fetchedAt: new Date().toISOString(),
          source: OILPRICE_URL,
          quotes: {},
        },
        null,
        2,
      ) + "\n",
    );
    return;
  }

  const { snapshot, missing } = parseOilPriceSnapshot(html);

  if (Object.keys(snapshot.quotes).length === 0) {
    console.warn(
      "fetch-oilprice: no quotes parsed — HTML structure may have changed.",
    );
    const prev = readPreviousSnapshot();
    if (prev) {
      prev.fetchedAt = new Date().toISOString();
      writeFileSync(OUT_PATH, JSON.stringify(prev, null, 2) + "\n");
      return;
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2) + "\n");

  const summary = Object.entries(snapshot.quotes)
    .map(
      ([k, v]) =>
        `${k}=$${v.price.toFixed(2)} (${v.changePct >= 0 ? "+" : ""}${v.changePct}%)`,
    )
    .join("  ");
  console.log(
    `✅ Stamped oilprice-snapshot.json — ${summary}${
      missing.length > 0 ? `  (missing: ${missing.join(", ")})` : ""
    }`,
  );
}

main().catch((e) => {
  console.error("fetch-oilprice crashed:", e);
  process.exit(0);
});
