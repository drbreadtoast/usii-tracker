import Link from "next/link";
import type { Category, Story } from "@/lib/types";
import { SECTION_DESCRIPTIONS, SECTION_LABELS } from "@/lib/types";
import { topStoriesByImportance } from "@/lib/content";
import StoryCard from "./StoryCard";

interface Props {
  category: Category;
  stories: Story[];
  /** How many stories to show on the homepage. Default 3. */
  limit?: number;
  /** Set true on detail pages to show all stories without a "see more" link. */
  fullPage?: boolean;
}

export default function SectionBlock({
  category,
  stories,
  limit = 3,
  fullPage = false,
}: Props) {
  const visible = fullPage ? stories : topStoriesByImportance(stories, limit);
  const hasMore = !fullPage && stories.length > visible.length;

  return (
    <section
      id={category}
      className="scroll-mt-20 border-t border-border pt-10"
      aria-labelledby={`${category}-heading`}
    >
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id={`${category}-heading`}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {SECTION_LABELS[category]}
          </h2>
          {!fullPage && category !== "headlines" && (
            <Link
              href={`/${category}` as never}
              className="shrink-0 text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              See all →
            </Link>
          )}
        </div>
        <p className="max-w-prose text-sm text-muted">
          {SECTION_DESCRIPTIONS[category]}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
          No stories in this section yet. The next scheduled refresh will populate it.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              mode={fullPage ? "expanded" : "compact"}
              showCategory={category === "headlines"}
            />
          ))}
        </div>
      )}

      {hasMore && category !== "headlines" && (
        <div className="mt-5 text-center">
          <Link
            href={`/${category}` as never}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            View all {SECTION_LABELS[category].toLowerCase()} →
          </Link>
        </div>
      )}
    </section>
  );
}
