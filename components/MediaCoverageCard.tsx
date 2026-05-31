import Link from "next/link";
import type { Story } from "@/lib/types";
import { LEAN_LABELS, LEAN_ORDER } from "@/lib/types";
import { topStoriesByImportance } from "@/lib/content";
import LeanBadge from "./LeanBadge";

interface Props {
  /** The pool to pick a story from. Usually headlines.stories. */
  stories: Story[];
}

/**
 * v1-inspired compact card showing the same story as covered by
 * multiple outlets across the bias spectrum. Each row = one lean,
 * one source title, one outlet name. Designed to be scannable in
 * three seconds.
 */
export default function MediaCoverageCard({ stories }: Props) {
  // Pick the highest-importance story that has the most diverse coverage.
  const candidates = topStoriesByImportance(stories, 5);
  const story =
    candidates.find((s) => s.perspectives.length >= 3) ?? candidates[0];
  if (!story) return null;

  const sortedPerspectives = [...story.perspectives].sort(
    (a, b) => LEAN_ORDER.indexOf(a.lean) - LEAN_ORDER.indexOf(b.lean),
  );

  // Pull the lead source from each perspective.
  const rows = sortedPerspectives
    .map((p) => {
      const source = p.sources[0];
      if (!source) return null;
      return { lean: p.lean, source };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <section
      aria-labelledby="media-coverage-heading"
      className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-sm"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2
          id="media-coverage-heading"
          className="font-serif text-lg font-bold tracking-tight sm:text-xl"
        >
          Media coverage — both sides
        </h2>
        <Link
          href={`/${story.category}#${story.id}` as never}
          className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted transition hover:text-foreground"
        >
          See all →
        </Link>
      </header>

      <div className="px-4 py-3 sm:px-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Same story, different framings
        </p>
        <p className="mb-4 font-serif text-base font-semibold leading-snug text-foreground sm:text-lg">
          {story.headline}
        </p>

        <ul className="flex flex-col divide-y divide-border">
          {rows.map(({ lean, source }) => (
            <li key={lean} className="py-3 first:pt-0 last:pb-0">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex flex-col gap-1.5 hover:no-underline"
              >
                <div className="flex items-center justify-between gap-2">
                  <LeanBadge lean={lean} />
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    {source.outlet}
                    {source.isStateMedia && (
                      <span
                        className="ml-1.5 rounded bg-stale-warn-bg px-1 py-0.5 text-[9px] font-bold text-[color:var(--stale-warn)]"
                        aria-label="State-affiliated media"
                      >
                        STATE
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-sm leading-snug text-foreground/85 transition group-hover:text-foreground">
                  {source.title}
                </p>
                <span className="sr-only">
                  Read on {source.outlet} ({LEAN_LABELS[lean]} perspective)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
