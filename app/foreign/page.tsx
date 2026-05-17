import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS.foreign,
  description:
    "World affairs from Western, Eastern, and Global South outlets — with state media labeled.",
};

export default async function ForeignPage() {
  const section = await getSection("foreign");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>
      <SectionBlock category="foreign" stories={section.stories} fullPage />
    </div>
  );
}
