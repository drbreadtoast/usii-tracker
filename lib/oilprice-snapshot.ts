import { promises as fs } from "node:fs";
import path from "node:path";
import type { OilHeroProps } from "@/components/OilHero";

interface OilPriceSnapshot {
  fetchedAt: string;
  source: string;
  quotes: Record<
    string,
    { price: number; changeAmount: string; changePct: number; ageLabel?: string }
  >;
}

/**
 * Reads the build-time oil-price snapshot (public/oilprice-snapshot.json,
 * produced by scripts/fetch-oilprice.ts) for SSR of the OilHero row. Shared
 * by the homepage and the Follow the Oil page. Returns {} on any failure so
 * the caller falls back to OilHero's last-sane defaults.
 */
export async function readOilPriceSnapshot(): Promise<
  Pick<OilHeroProps, "oilPriceBrent" | "oilPriceWti" | "oilPriceFetchedAt">
> {
  try {
    const snapshotPath = path.join(
      process.cwd(),
      "public",
      "oilprice-snapshot.json",
    );
    const raw = await fs.readFile(snapshotPath, "utf8");
    const snap = JSON.parse(raw) as OilPriceSnapshot;
    return {
      oilPriceBrent: snap.quotes.brent
        ? {
            price: snap.quotes.brent.price,
            changePct: snap.quotes.brent.changePct,
            ageLabel: snap.quotes.brent.ageLabel,
          }
        : undefined,
      oilPriceWti: snap.quotes.wti
        ? {
            price: snap.quotes.wti.price,
            changePct: snap.quotes.wti.changePct,
            ageLabel: snap.quotes.wti.ageLabel,
          }
        : undefined,
      oilPriceFetchedAt: snap.fetchedAt,
    };
  } catch {
    return {};
  }
}
