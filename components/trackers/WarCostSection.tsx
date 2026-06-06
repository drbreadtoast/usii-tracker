import TrackerPanel from "./TrackerPanel";
import CountryCostCard from "./CountryCostCard";
import WeaponCostTable from "./WeaponCostTable";
import EconomicRipplePanel from "./EconomicRipplePanel";
import KeyFactsList from "./KeyFactsList";
import TrackerSources from "./TrackerSources";
import { formatUsd } from "@/lib/trackers";
import type { WarCostTracker } from "@/lib/trackers-types";

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
    <div className="rounded-lg border border-border bg-surface-muted/40 px-3 py-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-foreground">
        {value}
      </div>
      {hint ? <div className="text-[10px] text-muted">{hint}</div> : null}
    </div>
  );
}

export default function WarCostSection({ data }: { data: WarCostTracker }) {
  return (
    <div className="flex flex-col gap-6">
      <TrackerPanel
        title="Daily war cost"
        icon="💸"
        subtitle={`Day ${data.daysOfConflict} · since ${data.conflictStartDate}`}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Stat
            label="Combined burn rate"
            value={formatUsd(data.dailyBurnRate)}
            hint="per day, all parties"
          />
          <Stat
            label="Direct military total"
            value={formatUsd(data.totalCost)}
            hint="all parties, to date"
          />
          <Stat label="Days of conflict" value={String(data.daysOfConflict)} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {data.countries.map((c) => (
            <CountryCostCard key={c.key} country={c} />
          ))}
        </div>
      </TrackerPanel>

      {data.weapons.length > 0 && (
        <TrackerPanel title="Weapon costs" icon="🚀">
          <WeaponCostTable weapons={data.weapons} />
        </TrackerPanel>
      )}

      {data.economicRipple.length > 0 && (
        <TrackerPanel title="Economic ripple effects" icon="🌍">
          <EconomicRipplePanel rows={data.economicRipple} />
        </TrackerPanel>
      )}

      {data.keyFacts.length > 0 && (
        <TrackerPanel title="Key facts" icon="📊">
          <KeyFactsList facts={data.keyFacts} />
        </TrackerPanel>
      )}

      <TrackerSources sources={data.sources} disclaimer={data.disclaimer} />
    </div>
  );
}
