import { getHomepageData } from "@/lib/content";
import { ALL_CATEGORIES } from "@/lib/types";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import TickerTape from "@/components/TickerTape";

export default async function HomePage() {
  const { manifest, sections } = await getHomepageData();

  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-surface">
        <TickerTape />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Every side of the story
            </h1>
            <p className="max-w-2xl text-base text-muted">
              US local and foreign affairs covered from left, center, right, and
              international perspectives — with sources cited so you can verify.
              Refreshed automatically every six hours.
            </p>
          </div>
          <StaleBanner lastUpdated={manifest.lastUpdated} />
        </section>

        <div className="flex flex-col gap-12">
          {ALL_CATEGORIES.map((cat) => (
            <SectionBlock
              key={cat}
              category={cat}
              stories={sections[cat].stories}
              limit={cat === "headlines" ? 3 : 3}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
