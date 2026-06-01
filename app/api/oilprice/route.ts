/**
 * GET /api/oilprice
 *
 * Runtime serverless endpoint that returns oilprice.com's current
 * homepage quotes for Brent, WTI, Murban, Natural Gas, Heating Oil,
 * Gasoline. This is what makes the OilHero's "OILPRICE.COM" column
 * truly always-live — the client polls this endpoint every 60s
 * while the page is open.
 *
 * Caching:
 *   - Vercel CDN: s-maxage=60, stale-while-revalidate=300
 *   - So upstream oilprice.com is hit at most ~1x/min per Vercel
 *     region. Stale-while-revalidate means a brief upstream outage
 *     keeps users served from cache up to 5 min before they see
 *     stale-error behavior.
 *
 * Failure shape:
 *   - 200 with {fetchedAt, source, quotes: {}} + a previous-snapshot
 *     fallback marker — clients show the build-time snapshot.
 *   - Never 500 — we always return a parseable body so the client
 *     doesn't spam retries.
 */

import { NextResponse } from "next/server";
import {
  fetchOilPriceHtml,
  parseOilPriceSnapshot,
  OILPRICE_URL,
} from "@/lib/oilprice";

// Force this to be a dynamic route — we want each cache-miss to hit
// our handler, not be statically frozen at build.
export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(): Promise<Response> {
  const html = await fetchOilPriceHtml();

  if (!html) {
    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        source: OILPRICE_URL,
        quotes: {},
        error: "upstream-unreachable",
      },
      {
        status: 200,
        headers: {
          // Brief cache so we don't hammer oilprice.com if they're
          // having a moment, but short enough to retry soon.
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  }

  const { snapshot, missing } = parseOilPriceSnapshot(html);

  if (Object.keys(snapshot.quotes).length === 0) {
    return NextResponse.json(
      {
        ...snapshot,
        error: "parse-failed",
        missing,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  }

  return NextResponse.json(
    { ...snapshot, missing: missing.length > 0 ? missing : undefined },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
