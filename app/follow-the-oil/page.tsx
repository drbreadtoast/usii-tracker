import { getOilTracker } from "@/lib/trackers";
import { readOilPriceSnapshot } from "@/lib/oilprice-snapshot";
import OilHero from "@/components/OilHero";
import StaleBanner from "@/components/StaleBanner";
import TrackerPanel from "@/components/trackers/TrackerPanel";
import HormuzStatusPanel from "@/components/trackers/HormuzStatusPanel";
import GasPricePanel from "@/components/trackers/GasPricePanel";
import FoodImpactPanel from "@/components/trackers/FoodImpactPanel";
import KeyPlayersPanel from "@/components/trackers/KeyPlayersPanel";
import ConsumerImpactPanel from "@/components/trackers/ConsumerImpactPanel";
import KeyFactsList from "@/components/trackers/KeyFactsList";
import TrackerSources from "@/components/trackers/TrackerSources";

export const metadata = {
  title: "Follow the Oil",
  description:
    "Crude prices, the Strait of Hormuz, the pump, and the grocery aisle — how the war is moving energy and the cost of living, with sources.",
};

export default async function FollowTheOilPage() {
  const [oil, oilSnapshot] = await Promise.all([
    getOilTracker(),
    readOilPriceSnapshot(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Live benchmark prices (TradingView + OilPrice.com), shared with home. */}
      <OilHero {...oilSnapshot} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Follow the Oil
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Crude, the Strait of Hormuz, the pump, and the grocery aisle — how
            the war is moving energy markets and the cost of living. Every
            figure is sourced.
          </p>
        </header>

        <div className="mb-6">
          <StaleBanner lastUpdated={oil.lastUpdated} />
        </div>

        <div className="flex flex-col gap-6">
          <HormuzStatusPanel hormuz={oil.hormuz} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GasPricePanel gas={oil.gas} />
            <ConsumerImpactPanel consumerImpact={oil.consumerImpact} />
          </div>

          <FoodImpactPanel food={oil.food} />

          <KeyPlayersPanel players={oil.keyPlayers} />

          <TrackerPanel title="Key facts" icon="📊">
            <KeyFactsList facts={oil.keyFacts} />
          </TrackerPanel>

          <TrackerSources sources={oil.sources} disclaimer={oil.disclaimer} />
        </div>
      </div>
    </div>
  );
}
