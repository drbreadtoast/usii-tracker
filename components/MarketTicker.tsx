"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/useTheme";

type TabId = "energy" | "markets" | "crypto" | "metals" | "costs";

interface TabConfig {
  label: string;
  symbols?: Array<{ proName: string; title: string }>;
  /** When set, this tab renders the static cost-of-living strip instead
   *  of a TradingView widget. */
  costs?: CostItem[];
}

interface CostItem {
  name: string;
  current: string;
  baseline: string;
  changePct: number; // signed percent vs baseline
}

/**
 * Symbol IDs are TradingView ticker codes verified to render via the
 * `embed-widget-ticker-tape` widget. Codes that show a ⚠ chip are
 * either invalid or restricted; keep this list to known-working ones.
 */
const TABS: Record<TabId, TabConfig> = {
  energy: {
    label: "Energy",
    symbols: [
      { proName: "TVC:UKOIL", title: "Brent" },
      { proName: "TVC:USOIL", title: "WTI" },
    ],
  },
  markets: {
    label: "Indices",
    symbols: [
      { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
      { proName: "FOREXCOM:NSXUSD", title: "Nasdaq" },
      { proName: "FOREXCOM:DJI", title: "Dow" },
    ],
  },
  crypto: {
    label: "Crypto",
    symbols: [
      { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
      { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
      { proName: "BINANCE:SOLUSDT", title: "Solana" },
    ],
  },
  metals: {
    label: "Metals",
    symbols: [
      { proName: "TVC:GOLD", title: "Gold" },
      { proName: "TVC:SILVER", title: "Silver" },
    ],
  },
  costs: {
    label: "Costs",
    // Placeholder values; the scheduled agent should overwrite these
    // from a content file once a cost-of-living data source is wired up.
    // Baseline is "pre-2025" / mid-2024 for reference.
    costs: [
      { name: "Gas (US avg)", current: "$3.42/gal", baseline: "$3.18/gal", changePct: 7.5 },
      { name: "Groceries (weekly)", current: "$182/wk", baseline: "$168/wk", changePct: 8.3 },
      { name: "Eggs (dozen)", current: "$3.85", baseline: "$2.45", changePct: 57.1 },
      { name: "Milk (gallon)", current: "$4.12", baseline: "$3.85", changePct: 7.0 },
      { name: "Rent (US median)", current: "$1,540/mo", baseline: "$1,420/mo", changePct: 8.5 },
    ],
  },
};

const TAB_ORDER: TabId[] = ["energy", "markets", "crypto", "metals", "costs"];

function CostsStrip({ items }: { items: CostItem[] }) {
  return (
    <div className="overflow-x-auto">
      <ul className="flex items-center gap-0 whitespace-nowrap divide-x divide-border">
        {items.map((c) => {
          const positive = c.changePct >= 0;
          // Cost increases are bad (stale-error red); decreases are good
          // (foreign-global-south green). Treat near-zero as neutral.
          const tone =
            Math.abs(c.changePct) < 0.5
              ? "text-muted"
              : positive
                ? "text-[color:var(--stale-error)]"
                : "text-[color:var(--lean-foreign-global-south)]";
          return (
            <li
              key={c.name}
              className="shrink-0 px-4 py-2 sm:px-5"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {c.name}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {c.current}
                </span>
                <span className={`font-mono text-xs tabular-nums ${tone}`}>
                  {positive ? "+" : ""}
                  {c.changePct.toFixed(1)}%
                </span>
              </div>
              <div className="text-[10px] text-muted">
                was {c.baseline}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MarketTicker() {
  const [tab, setTab] = useState<TabId>("energy");
  const containerRef = useRef<HTMLDivElement>(null);
  const isCosts = tab === "costs";
  const theme = useTheme();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Hard reset on tab change so the new widget renders fresh.
    node.innerHTML = "";

    if (isCosts) return; // No TradingView widget for costs tab.

    const widgetWrap = document.createElement("div");
    widgetWrap.className = "tradingview-widget-container__widget";
    node.appendChild(widgetWrap);

    const symbols = TABS[tab].symbols;
    if (!symbols) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.text = JSON.stringify({
      symbols,
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    node.appendChild(script);

    return () => {
      node.innerHTML = "";
    };
  }, [tab, isCosts, theme]);

  const costs = TABS.costs.costs ?? [];

  return (
    <aside
      aria-label="Market ticker"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Tab selector */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-3 py-1.5 sm:gap-3 sm:px-6">
          <span
            className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-xs"
            aria-hidden
          >
            <span>◆</span> Live
          </span>
          <div
            role="tablist"
            aria-label="Market category"
            className="flex shrink-0 items-center gap-0.5"
          >
            {TAB_ORDER.map((id) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition sm:text-xs ${
                    active
                      ? "bg-surface-muted text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {TABS[id].label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Body — TradingView widget OR Costs strip */}
        {isCosts ? (
          <CostsStrip items={costs} />
        ) : (
          <div
            key={tab}
            ref={containerRef}
            className="tradingview-widget-container min-h-[46px]"
            aria-label={`${TABS[tab].label} prices`}
          />
        )}
      </div>
    </aside>
  );
}
