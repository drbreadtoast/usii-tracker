import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS.underreported,
  description:
    "Stories covered abroad or by smaller outlets but missing from major US front pages.",
};

export default async function UnderreportedPage() {
  const section = await getSection("underreported");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>
      <SectionBlock
        category="underreported"
        stories={section.stories}
        fullPage
      />
    </div>
  );
}
