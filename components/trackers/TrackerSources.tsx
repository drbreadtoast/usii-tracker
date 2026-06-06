import type { TrackerSourceRef } from "@/lib/trackers-types";

/**
 * Footer block listing a tracker's provenance and (optionally) its methodology
 * disclaimer. Accepts either structured {name,url} refs (oil, war-cost) or a
 * plain list of source names (israel-funding). Server component.
 */
export default function TrackerSources({
  sources,
  disclaimer,
}: {
  sources: (TrackerSourceRef | string)[];
  disclaimer?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted/40 p-4 text-xs leading-relaxed text-muted sm:p-5">
      {disclaimer ? (
        <p className="mb-3 border-l-2 border-border-strong pl-3 text-[13px] text-foreground/80">
          {disclaimer}
        </p>
      ) : null}
      <p className="mb-1 font-semibold uppercase tracking-wider text-foreground/70">
        Sources
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {sources.map((s, i) => {
          if (typeof s === "string") {
            return <li key={i}>{s}</li>;
          }
          return (
            <li key={i}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] hover:underline"
                title={s.description}
              >
                {s.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
