import { promises as fs } from "node:fs";
import path from "node:path";
import { getHomepageData, getStatements } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import SectionCard from "@/components/SectionCard";
import StaleBanner from "@/components/StaleBanner";
import MediaCoverageCard from "@/components/MediaCoverageCard";
import KeyStatementsCard from "@/components/KeyStatementsCard";
import OilHero from "@/components/OilHero";
import type { OilHeroProps } from "@/components/OilHero";
import QuickBriefHeader from "@/components/QuickBriefHeader";
import RefreshSummary from "@/components/RefreshSummary";

interface OilPriceSnapshot {
  fetchedAt: string;
  source: string;
  quotes: Record<
    string,
    { price: number; changeAmount: string; changePct: number; ageLabel?: string }
  >;
}

async function readOilPriceSnapshot(): Promise<
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

const GRID_CATEGORIES = [
  "us-politics",
  "foreign",
  "markets",
  "ai-tech",
  "war",
  "underreported",
] as const;

export default async function HomePage() {
  const [{ manifest, sections }, statementsFile, oilSnapshot] =
    await Promise.all([
      getHomepageData(),
      getStatements().catch(() => null),
      readOilPriceSnapshot(),
    ]);
  const headlines = sections.headlines;

  return (
    <div className="flex flex-col">
      {/* Live oil — hero comparison row.
          TradingView columns render their own live widgets;
          OilPrice.com columns read from the build-time snapshot. */}
      <OilHero {...oilSnapshot} />

      {/* Masthead / refresh strip */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
          <div className="max-w-xl">
            <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Every side of the story
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">
              US local and foreign affairs from left, center, right, and
              international perspectives — sources cited.
            </p>
          </div>
          <RefreshSummary lastUpdated={manifest.lastUpdated} />
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
          <StaleBanner lastUpdated={manifest.lastUpdated} />
        </div>
      </div>

      {/* Quick Brief — section header that wraps the home grid */}
      <QuickBriefHeader lastUpdated={manifest.lastUpdated} />

      {/* Top Stories hero + media-coverage sidecar */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionBlock
              category="headlines"
              stories={headlines.stories}
              limit={3}
            />
          </div>
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <MediaCoverageCard stories={headlines.stories} />
            {statementsFile && statementsFile.statements.length > 0 && (
              <KeyStatementsCard
                statements={statementsFile.statements}
                limit={4}
              />
            )}
          </aside>
        </div>
      </div>

      {/* Equal-weight grid */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Sections
          </h2>
          <p className="text-xs text-muted sm:text-sm">
            Tap any card for full coverage
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GRID_CATEGORIES.map((cat) => (
            <SectionCard
              key={cat}
              category={cat}
              stories={sections[cat].stories}
              limit={3}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
