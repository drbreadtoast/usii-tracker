import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import TradingViewChart from "@/components/TradingViewChart";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS.markets,
  description:
    "Energy, equities, crypto, and metals — with live charts and the macro story behind the prices.",
};

export default async function MarketsPage() {
  const section = await getSection("markets");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Energy benchmarks
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TradingViewChart symbol="TVC:UKOIL" title="Brent" />
          <TradingViewChart symbol="TVC:USOIL" title="WTI" />
        </div>
        <p className="mt-3 text-xs text-muted">
          Live charts via TradingView. For supplemental coverage see{" "}
          <a
            href="https://oilprice.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            oilprice.com
          </a>
          .
        </p>
      </section>

      <SectionBlock category="markets" stories={section.stories} fullPage />
    </div>
  );
}
