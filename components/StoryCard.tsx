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

function severity(importance: number): {
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

export default function StoryCard({
  story,
  mode = "compact",
  showCategory = false,
}: Props) {
  const perspectives = sortedPerspectives(story);
  const updated = formatTimestamp(story.updatedAt);
  const limitedCoverage = perspectives.length < 3;
  const sev = severity(story.importance);

  return (
    <article
      id={story.id}
      className="scroll-mt-24 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition hover:border-border-strong sm:p-6"
    >
      <header className="flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 font-bold uppercase tracking-wider ${sev.className}`}
            aria-label={`Severity: ${sev.text}`}
          >
            {sev.text}
          </span>
          {showCategory && (
            <span className="rounded bg-surface-muted px-1.5 py-0.5 font-medium uppercase tracking-wider text-foreground/70">
              {SECTION_LABELS[story.category]}
            </span>
          )}
          <span className="text-muted">Updated {updated}</span>
        </div>

        {/* Headline + summary */}
        <h3 className="font-serif text-2xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-3xl">
          {story.headline}
        </h3>
        <p className="text-[15px] leading-relaxed text-foreground/80 sm:text-base">
          {story.summary}
        </p>
      </header>

      {/* Perspectives strip */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {perspectives.length} perspective{perspectives.length === 1 ? "" : "s"}:
        </span>
        {perspectives.map((p) => (
          <LeanBadge key={p.lean} lean={p.lean} />
        ))}
      </div>

      {limitedCoverage && (
        <p
          className="rounded-md border border-stale-warn/30 bg-stale-warn-bg/60 px-3 py-2 text-xs leading-relaxed text-stale-warn"
          role="note"
        >
          <strong className="font-semibold">Limited coverage:</strong> only{" "}
          {perspectives.length} of 3+ leans covered this story in the last 72h.
        </p>
      )}

      {mode === "compact" ? (
        <details className="group rounded-lg border border-border bg-surface-muted/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground/90 transition hover:bg-surface-muted">
            <span>Read the {perspectives.length} perspectives</span>
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
