import { getSection } from "@/lib/content";
import { getWarCostTracker } from "@/lib/trackers";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import WarCostSection from "@/components/trackers/WarCostSection";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS.war,
  description:
    "Active armed conflicts and the diplomacy around them, from multiple perspectives — plus a dedicated Iran–Israel–US daily war-cost tracker.",
};

export default async function WarPage() {
  const [section, warCost] = await Promise.all([
    getSection("war"),
    getWarCostTracker(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>

      <SectionBlock category="war" stories={section.stories} fullPage />

      <section className="mt-12 border-t border-border pt-8">
        <header className="mb-6">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            The Iran–Israel–US war, by the numbers
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            What the conflict is costing each party and the wider economy. All
            figures are sourced estimates and vary widely between analysts.
          </p>
        </header>
        <WarCostSection data={warCost} />
      </section>
    </div>
  );
}
