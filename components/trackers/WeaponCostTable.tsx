import { formatUsd } from "@/lib/trackers";
import type { WeaponCost, WarParty } from "@/lib/trackers-types";

const COUNTRY_LABEL: Record<WarParty, string> = {
  us: "US",
  israel: "Israel",
  iran: "Iran",
};

export default function WeaponCostTable({
  weapons,
}: {
  weapons: WeaponCost[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted">
            <th className="py-2 pr-3 font-semibold">Weapon</th>
            <th className="py-2 pr-3 font-semibold">Party</th>
            <th className="py-2 pr-3 text-right font-semibold">Unit cost</th>
            <th className="py-2 pr-3 text-right font-semibold">Used</th>
            <th className="py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w, i) => (
            <tr key={i} className="border-b border-border/60">
              <td className="py-2 pr-3 font-medium text-foreground">
                {w.weapon}
              </td>
              <td className="py-2 pr-3 text-muted">{COUNTRY_LABEL[w.country]}</td>
              <td className="py-2 pr-3 text-right font-mono tabular-nums text-muted">
                {formatUsd(w.unitCost)}
              </td>
              <td className="py-2 pr-3 text-right font-mono tabular-nums text-muted">
                {w.quantityUsed.toLocaleString("en-US")}
              </td>
              <td className="py-2 text-right font-mono font-semibold tabular-nums text-foreground">
                {formatUsd(w.totalCost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
