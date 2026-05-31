"use client";

import { useEffect, useRef, useState } from "react";

type TabId = "energy" | "markets" | "crypto" | "metals";

interface TabConfig {
  label: string;
  symbols: Array<{ proName: string; title: string }>;
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
};

const TAB_ORDER: TabId[] = ["energy", "markets", "crypto", "metals"];

export default function MarketTicker() {
  const [tab, setTab] = useState<TabId>("energy");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Hard reset on tab change so the new widget renders fresh.
    node.innerHTML = "";

    const widgetWrap = document.createElement("div");
    widgetWrap.className = "tradingview-widget-container__widget";
    node.appendChild(widgetWrap);

    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.text = JSON.stringify({
      symbols: TABS[tab].symbols,
      showSymbolLogo: true,
      colorTheme: isDark ? "dark" : "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    node.appendChild(script);

    return () => {
      node.innerHTML = "";
    };
  }, [tab]);

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
        {/* Widget — key forces full remount on tab change so React clears
            any stale TradingView DOM the cleanup didn't catch. */}
        <div
          key={tab}
          ref={containerRef}
          className="tradingview-widget-container min-h-[46px]"
          aria-label={`${TABS[tab].label} prices`}
        />
      </div>
    </aside>
  );
}
