import TrackerPanel from "./TrackerPanel";
import type { OilTracker } from "@/lib/trackers-types";

function tone(changePercent: number): string {
  if (Math.abs(changePercent) < 0.5) return "text-muted";
  // Consumer cost: an increase is bad (red), a decrease is good (green).
  return changePercent > 0 ? "text-stale-error" : "text-lean-foreign-global-south";
}

export default function FoodImpactPanel({ food }: { food: OilTracker["food"] }) {
  const g = food.groceryImpact;
  return (
    <TrackerPanel title="Food & grocery impact" icon="🌾">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted">
              <th className="py-2 pr-3 font-semibold">Commodity</th>
              <th className="py-2 pr-3 text-right font-semibold">Pre-war</th>
              <th className="py-2 pr-3 text-right font-semibold">Current</th>
              <th className="py-2 text-right font-semibold">Change</th>
            </tr>
          </thead>
          <tbody>
            {food.commodities.map((c) => (
              <tr key={c.name} className="border-b border-border/60 align-top">
                <td className="py-2 pr-3">
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-[11px] leading-snug text-muted">
                    {c.unit ? `${c.unit} · ` : ""}
                    {c.detail}
                  </div>
                </td>
                <td className="py-2 pr-3 text-right font-mono tabular-nums text-muted">
                  ${c.preWar.toFixed(2)}
                </td>
                <td className="py-2 pr-3 text-right font-mono font-semibold tabular-nums text-foreground">
                  ${c.current.toFixed(2)}
                </td>
                <td
                  className={`py-2 text-right font-mono font-semibold tabular-nums ${tone(c.changePercent)}`}
                >
                  {c.changePercent > 0 ? "+" : ""}
                  {c.changePercent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted/40 px-4 py-3">
        <div className="text-sm">
          <span className="font-semibold text-foreground">
            Weekly grocery basket
          </span>{" "}
          <span className="text-muted">(US average)</span>
        </div>
        <div className="flex items-baseline gap-2 font-mono tabular-nums">
          <span className="text-muted line-through">${g.preWarWeekly}</span>
          <span className="text-foreground">→</span>
          <span className="font-bold text-foreground">${g.currentWeekly}</span>
          <span className={`text-sm font-semibold ${tone(g.changePercent)}`}>
            +{g.changePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </TrackerPanel>
  );
}
