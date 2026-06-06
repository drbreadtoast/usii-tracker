import { formatUsd } from "@/lib/trackers";
import type { FundingOrg, OrgType } from "@/lib/trackers-types";

const ORG_TYPE_LABEL: Record<OrgType, string> = {
  lobby: "Lobby",
  superPAC: "Super PAC",
  pac: "PAC",
  advocacy: "Advocacy",
};

export default function FundingOrgsPanel({ orgs }: { orgs: FundingOrg[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {orgs.map((o) => (
        <div
          key={o.id}
          className="flex flex-col rounded-lg border border-border bg-surface-muted/40 p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold leading-tight text-foreground">
              {o.name}
            </span>
            <span className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
              {ORG_TYPE_LABEL[o.type]}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold tabular-nums text-foreground">
              {formatUsd(o.totalSpending2024Cycle)}
            </span>
            <span className="text-[11px] text-muted">
              2024 cycle · founded {o.founded}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/80">
            {o.description}
          </p>
          {o.sourceUrl ? (
            <a
              href={o.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[11px] text-accent hover:underline"
            >
              {o.source ?? "Source"}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
