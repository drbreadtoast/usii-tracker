import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS["us-politics"],
  description:
    "US domestic politics from left, center, right, and government perspectives.",
};

export default async function UsPoliticsPage() {
  const section = await getSection("us-politics");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>
      <SectionBlock
        category="us-politics"
        stories={section.stories}
        fullPage
      />
    </div>
  );
}
