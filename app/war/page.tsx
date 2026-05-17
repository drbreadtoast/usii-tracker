import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS.war,
  description:
    "Active armed conflicts and the diplomatic actions around them, from multiple perspectives.",
};

export default async function WarPage() {
  const section = await getSection("war");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>
      <SectionBlock category="war" stories={section.stories} fullPage />
    </div>
  );
}
