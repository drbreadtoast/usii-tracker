import { OUTLETS } from "@/lib/sources";
import type { Lean } from "@/lib/types";
import { LEAN_ORDER } from "@/lib/types";
import LeanBadge from "@/components/LeanBadge";

export const metadata = {
  title: "Source bias map",
  description:
    "The outlets TheOSSreport pulls from, grouped by lean. Anchored on AllSides Media Bias Ratings, extended with foreign groupings.",
};

export default function SourcesPage() {
  const grouped = LEAN_ORDER.reduce<Record<Lean, typeof OUTLETS>>(
    (acc, lean) => {
      acc[lean] = OUTLETS.filter((o) => o.primaryLean === lean);
      return acc;
    },
    {} as Record<Lean, typeof OUTLETS>,
  );

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Source bias map
      </h1>
      <p className="mb-8 max-w-prose text-base text-muted">
        The outlets the scheduled agent pulls from, grouped by primary lean. US
        outlets carry their{" "}
        <a
          href="https://www.allsides.com/media-bias/ratings"
          target="_blank"
          rel="noopener noreferrer"
        >
          AllSides
        </a>{" "}
        rating where applicable. Foreign outlets are grouped by editorial
        orientation. State-affiliated media is flagged.
      </p>

      <div className="flex flex-col gap-8">
        {LEAN_ORDER.map((lean) => {
          const outlets = grouped[lean];
          if (outlets.length === 0) return null;
          return (
            <section key={lean}>
              <div className="mb-3 flex items-center gap-2">
                <LeanBadge lean={lean} size="md" />
                <span className="text-sm text-muted">
                  {outlets.length} outlet{outlets.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {outlets.map((o) => (
                  <div
                    key={o.name}
                    className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <div className="min-w-0">
                      <a
                        href={o.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate font-medium text-foreground"
                      >
                        {o.name}
                      </a>
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <span>{o.country}</span>
                        {o.allSidesRating && (
                          <>
                            <span aria-hidden>·</span>
                            <span>AllSides: {o.allSidesRating}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {o.isStateMedia && (
                      <span
                        className="ml-2 rounded bg-stale-warn/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stale-warn"
                        aria-label="State-affiliated media"
                      >
                        State
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="mt-12 rounded-md border border-border bg-surface-muted p-4 text-sm text-foreground/85">
        <p>
          The lean assigned to an outlet reflects its primary editorial
          orientation, not the framing of any individual article. Stories may
          cross outlet category boundaries. Always read the linked source for
          context.
        </p>
        <p className="mt-2">
          AllSides bias ratings are published by{" "}
          <a
            href="https://www.allsides.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            AllSides
          </a>{" "}
          and updated regularly. We do not modify AllSides ratings.
        </p>
      </aside>
    </article>
  );
}
