import { getHomepageData } from "@/lib/content";
import { ALL_CATEGORIES, SECTION_LABELS } from "@/lib/types";
import type { Story } from "@/lib/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://theossreport.dev";
const SITE_NAME = "TheOSSreport";
const SITE_DESCRIPTION =
  "US and foreign affairs covered from left, center, right, and international perspectives.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function storyToItem(story: Story): string {
  const link = `${SITE_URL}/${story.category}#${story.id}`;
  const pubDate = new Date(story.updatedAt).toUTCString();
  const sourceCount = story.perspectives.reduce(
    (sum, p) => sum + p.sources.length,
    0,
  );
  const description = `${story.summary} (${story.perspectives.length} perspectives from ${sourceCount} sources)`;
  return [
    "    <item>",
    `      <title>${escapeXml(story.headline)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="false">${escapeXml(story.id)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    `      <category>${escapeXml(SECTION_LABELS[story.category])}</category>`,
    `      <description>${escapeXml(description)}</description>`,
    "    </item>",
  ].join("\n");
}

export async function GET(): Promise<Response> {
  const { manifest, sections } = await getHomepageData();
  const allStories: Story[] = ALL_CATEGORIES.filter(
    (c) => c !== "headlines",
  ).flatMap((c) => sections[c].stories);

  // Deduplicate by story id (headlines often references stories that also live
  // in their section file).
  const seen = new Set<string>();
  const unique = allStories.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  unique.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const lastBuildDate = new Date(manifest.lastUpdated).toUTCString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(SITE_URL)}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `    <language>en-us</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml"/>`,
    ...unique.slice(0, 50).map(storyToItem),
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
