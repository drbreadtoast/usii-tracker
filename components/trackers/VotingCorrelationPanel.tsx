import { formatUsd } from "@/lib/trackers";
import type { VotingCorrelation } from "@/lib/trackers-types";

/** A single labelled funding bar, scaled against the larger of the two averages. */
function FundingBar({
  label,
  count,
  amount,
  max,
}: {
  label: string;
  count: number;
  amount: number;
  max: number;
}) {
  const pct = max > 0 ? (amount / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-foreground/80">
          {label}{" "}
          <span className="text-muted">(n={count})</span>
        </span>
        <span className="font-mono tabular-nums text-foreground">
          {formatUsd(amount)} avg
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-accent/70"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function VotingCorrelationPanel({
  correlations,
}: {
  correlations: VotingCorrelation[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {correlations.map((c) => {
        const max = Math.max(
          c.avgProIsraelFundingYea,
          c.avgProIsraelFundingNay,
          1,
        );
        return (
          <div
            key={c.id}
            className="rounded-lg border border-border bg-surface-muted/40 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-foreground">{c.bill}</span>
              <span className="font-mono text-xs tabular-nums text-muted">
                {c.chamber} · {c.date} · {c.yea}-{c.nay}
              </span>
            </div>
            <p className="mt-1 text-xs leading-snug text-muted">
              {c.description}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <FundingBar
                label="Voted Yea"
                count={c.yea}
                amount={c.avgProIsraelFundingYea}
                max={max}
              />
              <FundingBar
                label="Voted Nay"
                count={c.nay}
                amount={c.avgProIsraelFundingNay}
                max={max}
              />
            </div>
            <p className="mt-3 border-l-2 border-border-strong pl-3 text-xs leading-relaxed text-foreground/80">
              {c.insight}
              {c.sourceUrl ? (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 text-accent hover:underline"
                >
                  {c.source ?? "roll call"}
                </a>
              ) : null}
            </p>
          </div>
        );
      })}
    </div>
  );
}
