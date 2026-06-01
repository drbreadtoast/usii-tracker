/**
 * lib/oilprice.ts
 *
 * Shared fetcher + parser for oilprice.com's homepage commodity table.
 * Used by both:
 *   - scripts/fetch-oilprice.ts (build-time snapshot for SSR fallback)
 *   - app/api/oilprice/route.ts (runtime API endpoint, ~60s cache)
 *
 * The HTML structure we depend on:
 *   <tr class="change_up|change_down link_oilprice_row"
 *       data-hash="Brent-Crude" data-id="46" ...>
 *     <td class="value">93.05 <i ...></i></td>
 *     <td class="change_amount">+1.93</td>
 *     <td class="change_percent">+2.12%</td>
 *     <span class="last_updated">11 mins</span>
 *   </tr>
 */

export const OILPRICE_URL = "https://oilprice.com";
export const OILPRICE_TIMEOUT_MS = 8000;

export interface OilPriceQuote {
  price: number;
  changeAmount: string;
  changePct: number;
  ageLabel: string;
}

export interface OilPriceSnapshot {
  fetchedAt: string;
  source: string;
  quotes: Record<string, OilPriceQuote>;
}

export const TRACKED = [
  { key: "brent", hash: "Brent-Crude" },
  { key: "wti", hash: "WTI-Crude" },
  { key: "murban", hash: "Murban-Crude" },
  { key: "natgas", hash: "Natural-Gas" },
  { key: "heatingOil", hash: "Heating-Oil" },
  { key: "gasoline", hash: "Gasoline" },
] as const;

const BROWSER_HEADERS: Record<string, string> = {
  // Browser-like UA — oilprice.com serves a different HTML payload to
  // bot-style UAs.
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/**
 * Fetch the homepage HTML. Returns null on any failure — caller decides
 * whether to fall back or surface the error.
 */
export async function fetchOilPriceHtml(
  signal?: AbortSignal,
): Promise<string | null> {
  const controller = signal ? null : new AbortController();
  const sig = signal ?? controller!.signal;
  const timer = controller
    ? setTimeout(() => controller.abort(), OILPRICE_TIMEOUT_MS)
    : null;
  try {
    const res = await fetch(OILPRICE_URL, {
      redirect: "follow",
      signal: sig,
      headers: BROWSER_HEADERS,
      // Important for Next.js fetch — we control caching at the route
      // level via the response headers, not here.
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Extract one commodity row by data-hash and parse its cells. */
export function parseOilPriceRow(
  html: string,
  hash: string,
): OilPriceQuote | null {
  const rowRegex = new RegExp(
    `<tr[^>]*data-hash="${hash}"[\\s\\S]*?</tr>`,
    "i",
  );
  const rowMatch = html.match(rowRegex);
  if (!rowMatch) return null;
  const row = rowMatch[0];

  const valueMatch = row.match(/<td[^>]*class="value"[^>]*>\s*([\d.]+)\s*</i);
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

/**
 * Parse all tracked commodities from one HTML payload.
 * Returns the snapshot plus the list of hashes that didn't parse (for
 * monitoring HTML structure drift).
 */
export function parseOilPriceSnapshot(
  html: string,
  fetchedAt: string = new Date().toISOString(),
): { snapshot: OilPriceSnapshot; missing: string[] } {
  const quotes: Record<string, OilPriceQuote> = {};
  const missing: string[] = [];
  for (const { key, hash } of TRACKED) {
    const q = parseOilPriceRow(html, hash);
    if (q) quotes[key] = q;
    else missing.push(hash);
  }
  return {
    snapshot: { fetchedAt, source: OILPRICE_URL, quotes },
    missing,
  };
}
