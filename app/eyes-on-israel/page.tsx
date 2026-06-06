import { getSection } from "@/lib/content";
import { getIsraelFundingTracker } from "@/lib/trackers";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import EoiIntro from "@/components/trackers/EoiIntro";
import FundingOrgsPanel from "@/components/trackers/FundingOrgsPanel";
import TopRecipientsTable from "@/components/trackers/TopRecipientsTable";
import VotingCorrelationPanel from "@/components/trackers/VotingCorrelationPanel";
import TrackerPanel from "@/components/trackers/TrackerPanel";
import KeyFactsList from "@/components/trackers/KeyFactsList";
import TrackerSources from "@/components/trackers/TrackerSources";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS["eyes-on-israel"],
  description:
    "Documented instances of Israeli influence on US policy — lobbying, legislation, and officials — every claim sourced, with responses included.",
};

export default async function EyesOnIsraelPage() {
  const [section, funding] = await Promise.all([
    getSection("eyes-on-israel"),
    getIsraelFundingTracker(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>

      {/* Sourced influence incidents (each with a right-of-reply perspective). */}
      <SectionBlock
        category="eyes-on-israel"
        stories={section.stories}
        fullPage
      />

      {/* Pro-Israel funding tracker. */}
      <section className="mt-12 flex flex-col gap-6 border-t border-border pt-8">
        <header>
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Pro-Israel funding in US politics
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Public campaign-finance and roll-call records, compiled from
            OpenSecrets, the FEC, and Senate/House votes.
          </p>
        </header>

        <EoiIntro disclaimer={funding.disclaimer} />

        <TrackerPanel title="Organizations" icon="🏛️">
          <FundingOrgsPanel orgs={funding.organizations} />
        </TrackerPanel>

        <TrackerPanel title="Top recipients in Congress" icon="🏦">
          <TopRecipientsTable recipients={funding.topRecipients} />
        </TrackerPanel>

        <TrackerPanel title="Funding vs. votes" icon="📊">
          <VotingCorrelationPanel correlations={funding.votingCorrelations} />
        </TrackerPanel>

        <TrackerPanel title="Key facts" icon="📌">
          <KeyFactsList facts={funding.keyFacts} />
        </TrackerPanel>

        <TrackerSources sources={funding.sources} />
      </section>
    </div>
  );
}
