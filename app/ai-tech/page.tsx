import { getSection } from "@/lib/content";
import SectionBlock from "@/components/SectionBlock";
import StaleBanner from "@/components/StaleBanner";
import { SECTION_LABELS } from "@/lib/types";

export const metadata = {
  title: SECTION_LABELS["ai-tech"],
  description:
    "AI, semiconductors, regulation, labor impact, and the tech industry — from multiple perspectives.",
};

export default async function AiTechPage() {
  const section = await getSection("ai-tech");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <StaleBanner lastUpdated={section.lastUpdated} />
      </div>
      <SectionBlock category="ai-tech" stories={section.stories} fullPage />
    </div>
  );
}
