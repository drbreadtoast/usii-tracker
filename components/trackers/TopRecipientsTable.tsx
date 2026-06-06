import { formatUsd } from "@/lib/trackers";
import type { FundingRecipient, Party } from "@/lib/trackers-types";

const PARTY_CHIP: Record<Party, { cls: string }> = {
  D: { cls: "border-lean-left/40 bg-lean-left-bg/50 text-lean-left" },
  R: { cls: "border-lean-right/40 bg-lean-right-bg/50 text-lean-right" },
  I: { cls: "border-border bg-surface-muted text-muted" },
};

export default function TopRecipientsTable({
  recipients,
}: {
  recipients: FundingRecipient[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {recipients.map((r) => (
        <div
          key={r.id}
          className="rounded-lg border border-border bg-surface-muted/40 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${PARTY_CHIP[r.party].cls}`}
                >
                  {r.party}-{r.state}
                </span>
              </div>
              <div className="text-[11px] text-muted">{r.role}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-base font-bold tabular-nums text-foreground">
                {formatUsd(r.totalProIsraelFunding)}
              </div>
              <div className="text-[10px] text-muted">pro-Israel funding</div>
            </div>
          </div>

          {r.topDonors.length > 0 && (
            <div className="mt-3 border-t border-border/60 pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Top donors
              </div>
              <ul className="mt-1 flex flex-col gap-0.5 text-xs">
                {r.topDonors.map((d, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="text-foreground/80">{d.organization}</span>
                    <span className="font-mono tabular-nums text-muted">
                      {formatUsd(d.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {r.relevantVotes.length > 0 && (
            <div className="mt-2 border-t border-border/60 pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Relevant votes
              </div>
              <ul className="mt-1 flex flex-col gap-1 text-xs">
                {r.relevantVotes.map((v, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-2">
                    <span className="text-foreground/80">{v.bill}</span>
                    <span className="shrink-0 rounded border border-border bg-surface px-1.5 text-[10px] font-semibold uppercase text-muted">
                      {v.vote}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
