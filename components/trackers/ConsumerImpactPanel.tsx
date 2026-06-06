import TrackerPanel from "./TrackerPanel";
import type { OilTracker } from "@/lib/trackers-types";

export default function ConsumerImpactPanel({
  consumerImpact,
}: {
  consumerImpact: OilTracker["consumerImpact"];
}) {
  return (
    <TrackerPanel title="At the pump & beyond" icon="🧾">
      {consumerImpact.note ? (
        <p className="mb-3 text-sm leading-relaxed text-muted">
          {consumerImpact.note}
        </p>
      ) : null}
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {consumerImpact.fuels.map((f) => {
          const up = f.changePercent >= 0;
          return (
            <li
              key={f.type}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted/40 px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span aria-hidden>{f.icon}</span>
                {f.type}
              </span>
              <span className="flex items-baseline gap-2 font-mono text-sm tabular-nums">
                <span className="text-muted line-through">
                  ${f.preWarPrice.toFixed(2)}
                </span>
                <span className="font-bold text-foreground">
                  ${f.currentPrice.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    up ? "text-stale-error" : "text-lean-foreign-global-south"
                  }`}
                >
                  {up ? "+" : ""}
                  {f.changePercent.toFixed(1)}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </TrackerPanel>
  );
}
