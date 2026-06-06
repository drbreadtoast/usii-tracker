import TrackerPanel from "./TrackerPanel";
import type { OilTracker } from "@/lib/trackers-types";

function Sparkline({
  points,
}: {
  points: OilTracker["gas"]["priceHistory"];
}) {
  if (points.length < 2) return null;
  const W = 320;
  const H = 64;
  const P = 5;
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const x = (i: number) => P + (i / (points.length - 1)) * (W - 2 * P);
  const y = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-16 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="US average gas price history"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--stale-error)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      {points.map((p, i) =>
        p.isEvent ? (
          <circle
            key={i}
            cx={x(i)}
            cy={y(p.price)}
            r="2.5"
            fill="var(--stale-error)"
            vectorEffect="non-scaling-stroke"
          />
        ) : null,
      )}
    </svg>
  );
}

export default function GasPricePanel({ gas }: { gas: OilTracker["gas"] }) {
  const up = gas.changePercent >= 0;
  const maxComp = Math.max(...gas.breakdown.map((b) => b.current), 0.01);
  const first = gas.priceHistory[0];
  const last = gas.priceHistory[gas.priceHistory.length - 1];
  return (
    <TrackerPanel title="US gas prices" icon="⛽" subtitle="National average">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
          ${gas.currentAverage.toFixed(3)}
        </span>
        <span className="text-sm text-muted">{gas.unit}</span>
        <span
          className={`font-mono text-sm font-semibold tabular-nums ${
            up ? "text-stale-error" : "text-lean-foreign-global-south"
          }`}
        >
          {up ? "+" : ""}
          {gas.changePercent.toFixed(1)}% vs pre-war ${gas.preWarAverage.toFixed(2)}
        </span>
      </div>

      {gas.priceHistory.length > 1 && (
        <div className="mt-4">
          <Sparkline points={gas.priceHistory} />
          <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-muted">
            <span>{first?.date}</span>
            <span>{last?.date}</span>
          </div>
        </div>
      )}

      {gas.breakdown.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            What&apos;s in a gallon
          </div>
          <ul className="flex flex-col gap-1.5">
            {gas.breakdown.map((b) => (
              <li key={b.component} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate text-foreground/80">
                  {b.component}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <span
                    className="block h-full rounded-full bg-accent/70"
                    style={{ width: `${(b.current / maxComp) * 100}%` }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right font-mono tabular-nums text-foreground">
                  ${b.current.toFixed(3)}
                  <span className="ml-1 text-[10px] text-muted">
                    (${b.preWar.toFixed(2)})
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {gas.source ? (
            <p className="mt-2 text-[10px] text-muted">
              Source:{" "}
              <a
                href={gas.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {gas.source}
              </a>
            </p>
          ) : null}
        </div>
      )}
    </TrackerPanel>
  );
}
