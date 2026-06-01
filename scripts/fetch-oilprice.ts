#!/usr/bin/env tsx
/**
 * fetch-oilprice.ts
 *
 * Pre-build hook. Scrapes oilprice.com's homepage commodity table,
 * extracts the current quote for each tracked benchmark, and writes
 * /public/oilprice-snapshot.json.
 *
 * The site's HTML is consistent: each commodity row is
 *   <tr class="change_up|change_down link_oilprice_row"
 *       data-hash="Brent-Crude" data-id="46" ...>
 *     <td class="value">93.05 <i ...></i></td>
 *     <td class="change_amount">+1.93</td>
 *     <td class="change_percent">+2.12%</td>
 *     <span class="last_updated">11 mins</span>
 *   </tr>
 *
 * Failure modes:
 *   - Fetch error / non-200 → keep previous snapshot; exit 0
 *     (don't block builds on a transient network blip).
 *   - Parse error → same; log warning.
 *
 * Output:
 *   public/oilprice-snapshot.json = {
 *     "fetchedAt": "<ISO 8601 UTC>",
 *     "source": "oilprice.com",
 *     "quotes": {
 *       "brent": { "price": 93.05, "changeAmount": "+1.93",
 *                  "changePct": 2.12, "ageLabel": "11 mins" },
 *       "wti":   { ... },
 *       ...
 *     }
 *   }
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_PATH = path.join(PUBLIC_DIR, "oilprice-snapshot.json");
const URL = "https://oilprice.com";
const TIMEOUT_MS = 8000;

const TRACKED = [
  { key: "brent", hash: "Brent-Crude" },
  { key: "wti", hash: "WTI-Crude" },
  { key: "murban", hash: "Murban-Crude" },
  { key: "natgas", hash: "Natural-Gas" },
  { key: "heatingOil", hash: "Heating-Oil" },
  { key: "gasoline", hash: "Gasoline" },
] as const;

interface Quote {
  price: number;
  changeAmount: string;
  changePct: number;
  ageLabel: string;
}

interface Snapshot {
  fetchedAt: string;
  source: string;
  quotes: Record<string, Quote>;
}

async function fetchHtml(): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(URL, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Browser-like UA — oilprice.com serves a different HTML
        // payload to bot-style UAs.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) {
      console.warn(`fetch-oilprice: HTTP ${res.status} from ${URL}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.warn(
      `fetch-oilprice: fetch failed: ${e instanceof Error ? e.message : String(e)}`,
    );
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Extract one commodity row by data-hash and parse its cells. */
function parseRow(html: string, hash: string): Quote | null {
  // Find the row's opening tag.
  const rowRegex = new RegExp(
    `<tr[^>]*data-hash="${hash}"[\\s\\S]*?</tr>`,
    "i",
  );
  const rowMatch = html.match(rowRegex);
  if (!rowMatch) return null;
  const row = rowMatch[0];

  const valueMatch = row.match(
    /<td[^>]*class="value"[^>]*>\s*([\d.]+)\s*</i,
  );
  const changeAmountMatch = row.match(
    /<td[^>]*class="change_amount"[^>]*>\s*([+-]?[\d.]+)\s*<\/td>/i,
  );
  const changePctMatch = row.match(
    /<td[^>]*class="change_percent"[^>]*>\s*([+-]?[\d.]+)%\s*<\/td>/i,
  );
  const ageMatch = row.match(
    /<span[^>]*class="last_updated"[^>]*>\s*([^<]+)\s*<\/span>/i,
  );

  if (!valueMatch || !changeAmountMatch || !changePctMatch) return null;

  const price = Number(valueMatch[1]);
  const changePct = Number(changePctMatch[1]);
  if (Number.isNaN(price) || Number.isNaN(changePct)) return null;

  return {
    price,
    changeAmount: changeAmountMatch[1],
    changePct,
    ageLabel: ageMatch ? ageMatch[1].trim() : "",
  };
}

function readPreviousSnapshot(): Snapshot | null {
  if (!existsSync(OUT_PATH)) return null;
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8")) as Snapshot;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  const html = await fetchHtml();
  if (!html) {
    const prev = readPreviousSnapshot();
    if (prev) {
      console.warn(
        "fetch-oilprice: keeping previous snapshot (network failed)",
      );
      // Update only fetchedAt so monitors don't think we're frozen
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
          source: URL,
          quotes: {},
        },
        null,
        2,
      ) + "\n",
    );
    return;
  }

  const quotes: Record<string, Quote> = {};
  const missing: string[] = [];
  for (const { key, hash } of TRACKED) {
    const q = parseRow(html, hash);
    if (q) quotes[key] = q;
    else missing.push(hash);
  }

  if (Object.keys(quotes).length === 0) {
    console.warn(
      "fetch-oilprice: no quotes parsed — HTML structure may have changed. Keeping previous snapshot if any.",
    );
    const prev = readPreviousSnapshot();
    if (prev) {
      prev.fetchedAt = new Date().toISOString();
      writeFileSync(OUT_PATH, JSON.stringify(prev, null, 2) + "\n");
      return;
    }
  }

  const snapshot: Snapshot = {
    fetchedAt: new Date().toISOString(),
    source: URL,
    quotes,
  };

  writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2) + "\n");

  const summary = Object.entries(quotes)
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
  // Don't block builds on this script crashing.
  process.exit(0);
});
