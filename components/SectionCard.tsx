import Link from "next/link";
import type { Category, Story } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { topStoriesByImportance, formatTimestamp } from "@/lib/content";
import LeanBadge from "./LeanBadge";

interface Props {
  category: Category;
  stories: Story[];
  /** How many stories to show in the card. Default 3. */
  limit?: number;
}

function severityLabel(importance: number): {
  text: string;
  className: string;
} {
  if (importance >= 5) {
    return {
      text: "Critical",
      className: "bg-stale-error-bg text-stale-error",
    };
  }
  if (importance >= 4) {
    return {
      text: "High",
      className: "bg-stale-warn-bg text-stale-warn",
    };
  }
  return {
    text: "Standard",
    className: "bg-surface-muted text-muted",
  };
}

export default function SectionCard({
  category,
  stories,
  limit = 3,
}: Props) {
  const visible = topStoriesByImportance(stories, limit);
  const detailHref = category === "headlines" ? "/" : `/${category}`;

  return (
    <section
      className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-sm transition hover:shadow-md"
      aria-labelledby={`${category}-card-heading`}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2
          id={`${category}-card-heading`}
          className="font-serif text-lg font-bold tracking-tight sm:text-xl"
        >
          {SECTION_LABELS[category]}
        </h2>
        {category !== "headlines" && (
          <Link
            href={detailHref as never}
            aria-label={`See all ${SECTION_LABELS[category]} stories`}
            className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted transition hover:text-foreground"
          >
            See all →
          </Link>
        )}
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 py-8 text-center text-sm text-muted">
          No stories yet — next refresh will populate this section.
        </div>
      ) : (
        <ul className="flex flex-1 flex-col divide-y divide-border">
          {visible.map((story) => {
            const sev = severityLabel(story.importance);
            const href =
              category === "headlines"
                ? `/${story.category}#${story.id}`
                : `/${category}#${story.id}`;
            return (
              <li key={story.id} className="px-4 py-3 sm:px-5 sm:py-4">
                <Link
                  href={href as never}
                  className="group flex flex-col gap-2 hover:no-underline"
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.5 font-bold uppercase tracking-wider ${sev.className}`}
                      aria-label={`Severity: ${sev.text}`}
                    >
                      {sev.text}
                    </span>
                    <span className="text-muted">
                      {formatTimestamp(story.updatedAt)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold leading-snug text-foreground transition group-hover:text-foreground sm:text-lg">
                    {story.headline}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {story.perspectives.map((p) => (
                      <LeanBadge key={p.lean} lean={p.lean} />
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
