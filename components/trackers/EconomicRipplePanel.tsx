import type { EconomicRippleRow } from "@/lib/trackers-types";

export default function EconomicRipplePanel({
  rows,
}: {
  rows: EconomicRippleRow[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map((r, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-surface-muted/40 p-3"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
            {r.label}
          </div>
          <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">
            {r.value}
          </div>
          <p className="mt-1 text-xs leading-snug text-foreground/80">
            {r.detail}
            {r.sourceUrl ? (
              <a
                href={r.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1.5 text-accent hover:underline"
              >
                {r.source ?? "source"}
              </a>
            ) : null}
          </p>
        </div>
      ))}
    </div>
  );
}
