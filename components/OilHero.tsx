"use client";

import { useEffect, useRef } from "react";

interface QuoteProps {
  symbol: string;
  /** Override the title shown by the widget. */
  symbolName?: string;
}

/**
 * TradingView "Symbol Info" widget — renders a single live quote card
 * with logo, name, description, current price, and change.
 *
 * Strict-Mode safe via the existing-child check.
 */
function TradingViewQuote({ symbol, symbolName }: QuoteProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Skip re-runs from React Strict-Mode if the widget is already there.
    if (node.querySelector(".tradingview-widget-container__widget")) return;

    const widgetWrap = document.createElement("div");
    widgetWrap.className = "tradingview-widget-container__widget";
    node.appendChild(widgetWrap);

    // Read the resolved theme from the documentElement class (set by
    // layout.tsx's beforeInteractive theme bootstrap). Dark is the brand
    // default; fall back to dark if the class isn't there yet.
    const isDark =
      typeof document === "undefined" ||
      document.documentElement.classList.contains("dark") ||
      !document.documentElement.classList.contains("light");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.text = JSON.stringify({
      symbol,
      width: "100%",
      colorTheme: isDark ? "dark" : "light",
      // isTransparent:true was rendering as solid white over the dark
      // page bg. Letting the widget paint its own theme background
      // gives us a readable card in both light and dark modes.
      isTransparent: false,
      locale: "en",
    });
    node.appendChild(script);

    return () => {
      node.innerHTML = "";
    };
  }, [symbol, symbolName]);

  return (
    <div
      ref={ref}
      className="tradingview-widget-container min-h-[200px]"
      aria-label={`${symbolName ?? symbol} live quote`}
    />
  );
}

// OilPrice.com placeholder values. Real-time data isn't publicly
// available without their API; the scheduled agent will sample
// these from public bulletins and update on each refresh.
const OILPRICE_FALLBACK = {
  brent: { price: 91.12, changePct: -1.7 },
  wti: { price: 87.36, changePct: -1.7 },
} as const;

function StaticPriceCell({
  label,
  price,
  changePct,
}: {
  label: string;
  price: number;
  changePct: number;
}) {
  const positive = changePct >= 0;
  const tone = positive
    ? "text-[color:var(--lean-foreign-global-south)]"
    : "text-[color:var(--stale-error)]";
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="inline-flex shrink-0 items-center rounded border border-[color:var(--lean-foreign-global-south)]/40 bg-[color:var(--lean-foreign-global-south-bg)]/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--lean-foreign-global-south)]">
        {label}
      </span>
      <span className="font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
        ${price.toFixed(2)}
      </span>
      <span className={`font-mono text-sm font-medium tabular-nums ${tone}`}>
        {positive ? "+" : ""}
        {changePct.toFixed(1)}%
      </span>
    </div>
  );
}

export default function OilHero() {
  return (
    <section
      aria-label="Live crude oil prices"
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-6 sm:py-4">
        {/* Top row — TradingView live widgets */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-4">
          <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1">
            <span className="inline-flex items-center rounded bg-[color:var(--stale-warn-bg)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--stale-warn)]">
              📈 TradingView
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              Live
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-border-strong">
            <TradingViewQuote symbol="TVC:UKOIL" symbolName="Brent" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border-strong">
            <TradingViewQuote symbol="TVC:USOIL" symbolName="WTI" />
          </div>
        </div>

        {/* Bottom row — OilPrice.com */}
        <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border pt-3 md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-4">
          <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1">
            <a
              href="https://oilprice.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded bg-[color:var(--lean-foreign-global-south-bg)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--lean-foreign-global-south)] no-underline hover:no-underline"
            >
              ⛽ OilPrice.com
            </a>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              Daily
            </span>
          </div>
          <StaticPriceCell
            label="Brent"
            price={OILPRICE_FALLBACK.brent.price}
            changePct={OILPRICE_FALLBACK.brent.changePct}
          />
          <StaticPriceCell
            label="WTI"
            price={OILPRICE_FALLBACK.wti.price}
            changePct={OILPRICE_FALLBACK.wti.changePct}
          />
        </div>

        {/* Caption */}
        <p className="mt-3 flex items-start gap-2 border-t border-border pt-3 text-xs text-[color:var(--lean-left)] sm:text-[13px]">
          <span aria-hidden className="mt-0.5 text-[color:var(--lean-left)]">
            ◉
          </span>
          About two-thirds of crude oil contracts traded globally reference
          Brent, making it the most widely used benchmark. WTI prices the US
          domestic market.
        </p>
      </div>
    </section>
  );
}
