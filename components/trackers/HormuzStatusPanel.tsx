import TrackerPanel from "./TrackerPanel";
import type { OilTracker, HormuzStatus } from "@/lib/trackers-types";

const STATUS_CHIP: Record<HormuzStatus, { label: string; cls: string }> = {
  open: {
    label: "Open",
    cls: "border-lean-foreign-global-south/40 bg-lean-foreign-global-south-bg/50 text-lean-foreign-global-south",
  },
  partially_blocked: {
    label: "Partially blocked",
    cls: "border-stale-warn/40 bg-stale-warn-bg/60 text-stale-warn",
  },
  blocked: {
    label: "Blocked",
    cls: "border-stale-error/40 bg-stale-error-bg/60 text-stale-error",
  },
  effectively_closed: {
    label: "Effectively closed",
    cls: "border-stale-error/40 bg-stale-error-bg/60 text-stale-error",
  },
};

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/40 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-foreground">
        {value}
      </div>
      {hint ? <div className="text-[10px] text-muted">{hint}</div> : null}
    </div>
  );
}

export default function HormuzStatusPanel({
  hormuz,
}: {
  hormuz: OilTracker["hormuz"];
}) {
  const chip = STATUS_CHIP[hormuz.status];
  const fmt = (n: number) => n.toLocaleString("en-US");
  return (
    <TrackerPanel
      title="Strait of Hormuz"
      icon="🚢"
      subtitle={`Blockade day ${hormuz.blockadeDay}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-bold uppercase tracking-wide ${chip.cls}`}
        >
          {chip.label}
        </span>
        <span className="text-sm text-muted">
          since {hormuz.blockadeStartDate}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          label="Transits / day"
          value={fmt(hormuz.dailyTransits)}
          hint={`pre-war ${fmt(hormuz.preWarDailyTransits)}`}
        />
        <Stat
          label="Barrels blocked / day"
          value={fmt(hormuz.barrelsBlockedDaily)}
        />
        <Stat
          label="Global oil share"
          value={`${hormuz.globalOilSharePercent}%`}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        <span className="font-semibold uppercase tracking-wider">
          Insurance:
        </span>{" "}
        {hormuz.insuranceStatus}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">
        {hormuz.summary}
      </p>

      {hormuz.timeline.length > 0 && (
        <ol className="mt-5 border-l border-border-strong/60 pl-4">
          {hormuz.timeline.map((t, i) => {
            const tChip = STATUS_CHIP[t.status];
            return (
              <li key={i} className="relative pb-4 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[21px] top-1 inline-block h-2 w-2 rounded-full bg-border-strong"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <time className="font-mono text-xs tabular-nums text-muted">
                    {t.date}
                  </time>
                  <span
                    className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tChip.cls}`}
                  >
                    {tChip.label}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-foreground/90">
                  {t.event}
                  {t.sourceUrl ? (
                    <a
                      href={t.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 text-xs text-accent hover:underline"
                    >
                      {t.source ?? "source"}
                    </a>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </TrackerPanel>
  );
}
