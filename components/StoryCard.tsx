import type { Story } from "@/lib/types";
import { LEAN_ORDER, SECTION_LABELS } from "@/lib/types";
import { formatTimestamp } from "@/lib/content";
import LeanBadge from "./LeanBadge";
import PerspectiveBlock from "./PerspectiveBlock";

interface Props {
  story: Story;
  /**
   * If `compact`, perspectives hide behind a <details> reveal.
   * If `expanded`, perspectives render inline.
   * Default: compact.
   */
  mode?: "compact" | "expanded";
  /** When true, show a small chip with the story's category. */
  showCategory?: boolean;
}

function sortedPerspectives(story: Story) {
  return [...story.perspectives].sort(
    (a, b) => LEAN_ORDER.indexOf(a.lean) - LEAN_ORDER.indexOf(b.lean),
  );
}

export default function StoryCard({
  story,
  mode = "compact",
  showCategory = false,
}: Props) {
  const perspectives = sortedPerspectives(story);
  const updated = formatTimestamp(story.updatedAt);
  const limitedCoverage = perspectives.length < 3;

  return (
    <article
      id={story.id}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition hover:border-accent/30"
    >
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {showCategory && (
            <span className="rounded bg-surface-muted px-2 py-0.5 font-medium uppercase tracking-wide text-foreground/70">
              {SECTION_LABELS[story.category]}
            </span>
          )}
          <span>Updated {updated}</span>
          <span aria-hidden>·</span>
          <span>Importance {story.importance}/5</span>
        </div>
        <h3 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {story.headline}
        </h3>
        <p className="text-base leading-relaxed text-foreground/80">
          {story.summary}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted">Perspectives:</span>
        {perspectives.map((p) => (
          <LeanBadge key={p.lean} lean={p.lean} />
        ))}
      </div>

      {limitedCoverage && (
        <p
          className="rounded-md border border-stale-warn/30 bg-stale-warn/10 px-3 py-2 text-xs text-stale-warn"
          role="note"
        >
          Limited perspective coverage: only {perspectives.length} of 3+ leans
          covered this story in the last 72h.
        </p>
      )}

      {mode === "compact" ? (
        <details className="group rounded-lg border border-border bg-surface-muted">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground/90 transition hover:bg-surface flex items-center justify-between">
            <span>View {perspectives.length} perspectives</span>
            <span
              className="text-muted transition-transform group-open:rotate-180"
              aria-hidden
            >
              ▾
            </span>
          </summary>
          <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
            {perspectives.map((p) => (
              <PerspectiveBlock key={p.lean} perspective={p} />
            ))}
          </div>
        </details>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {perspectives.map((p) => (
            <PerspectiveBlock key={p.lean} perspective={p} />
          ))}
        </div>
      )}
    </article>
  );
}
