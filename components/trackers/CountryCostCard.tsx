import { formatUsd } from "@/lib/trackers";
import type { CountryCost } from "@/lib/trackers-types";

export default function CountryCostCard({ country }: { country: CountryCost }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <span className="text-lg" aria-hidden>
            {country.flag}
          </span>
          {country.name}
        </span>
        <span className="font-mono text-lg font-bold tabular-nums text-foreground">
          {formatUsd(country.directMilitaryTotal)}
        </span>
      </div>
      <div className="mt-0.5 text-right text-[11px] text-muted">
        ~{formatUsd(country.dailyBurnRate)}/day
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 border-t border-border/60 pt-3 text-sm">
        {country.breakdown.map((b, i) => (
          <li
            key={i}
            className="flex items-baseline justify-between gap-3"
            title={b.description}
          >
            <span className="text-foreground/80">{b.label}</span>
            <span className="font-mono tabular-nums text-foreground">
              {formatUsd(b.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
