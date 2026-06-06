import TrackerPanel from "./TrackerPanel";
import type { OilTracker, ExportStatus } from "@/lib/trackers-types";

const EXPORT_CHIP: Record<ExportStatus, { label: string; cls: string }> = {
  active: {
    label: "Exporting",
    cls: "border-lean-foreign-global-south/40 bg-lean-foreign-global-south-bg/50 text-lean-foreign-global-south",
  },
  disrupted: {
    label: "Disrupted",
    cls: "border-stale-warn/40 bg-stale-warn-bg/60 text-stale-warn",
  },
  blocked: {
    label: "Blocked",
    cls: "border-stale-error/40 bg-stale-error-bg/60 text-stale-error",
  },
};

export default function KeyPlayersPanel({
  players,
}: {
  players: OilTracker["keyPlayers"];
}) {
  return (
    <TrackerPanel title="Key producers" icon="🛢️">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {players.map((p) => {
          const chip = EXPORT_CHIP[p.exportStatus];
          return (
            <div
              key={p.country}
              className="rounded-lg border border-border bg-surface-muted/40 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    {p.flag}
                  </span>
                  <span className="font-semibold text-foreground">
                    {p.country}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${chip.cls}`}
                >
                  {chip.label}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-muted">
                <span>
                  <span className="text-foreground">{p.dailyProductionMbpd}</span>{" "}
                  Mbpd
                </span>
                <span>
                  <span className="text-foreground">{p.globalSharePercent}%</span>{" "}
                  global
                </span>
                <span>
                  <span className="text-foreground">
                    {p.provenReservesBillionBarrels}
                  </span>{" "}
                  Bbbl reserves
                </span>
              </div>
              <p className="mt-2 text-xs leading-snug text-foreground/80">
                {p.warImpact}
              </p>
            </div>
          );
        })}
      </div>
    </TrackerPanel>
  );
}
