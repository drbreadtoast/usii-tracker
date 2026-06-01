"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface QuoteProps {
  symbol: string;
  /** Override the title shown by the widget. */
  symbolName?: string;
}

interface OilPriceApiResponse {
  fetchedAt: string;
  source: string;
  quotes: Record<
    string,
    {
      price: number;
      changeAmount: string;
      changePct: number;
      ageLabel: string;
    }
  >;
  error?: string;
  missing?: string[];
}

/** Poll /api/oilprice every 60s while the page is open. */
const POLL_INTERVAL_MS = 60_000;

interface LiveOilPriceState {
  brent: OilPriceQuote | undefined;
  wti: OilPriceQuote | undefined;
  fetchedAt: string | undefined;
  isLive: boolean;
}

function useLiveOilPrices(initial?: {
  brent?: OilPriceQuote;
  wti?: OilPriceQuote;
  fetchedAt?: string;
}): LiveOilPriceState {
  const [data, setData] = useState<LiveOilPriceState>(() => ({
    brent: initial?.brent,
    wti: initial?.wti,
    fetchedAt: initial?.fetchedAt,
    isLive: false,
  }));

  useEffect(() => {
    let cancelled = false;
    async function fetchOnce(): Promise<void> {
      try {
        const res = await fetch(`/api/oilprice?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as OilPriceApiResponse;
        if (cancelled) return;
        const brent = json.quotes?.brent;
        const wti = json.quotes?.wti;
        if (brent || wti) {
          setData({
            brent: brent
              ? {
                  price: brent.price,
                  changePct: brent.changePct,
                  ageLabel: brent.ageLabel,
                }
              : data.brent,
            wti: wti
              ? {
                  price: wti.price,
                  changePct: wti.changePct,
                  ageLabel: wti.ageLabel,
                }
              : data.wti,
            fetchedAt: json.fetchedAt,
            isLive: true,
          });
        }
      } catch {
        // Silent — keep previous data, retry next interval.
      }
    }
    fetchOnce();
    const id = setInterval(fetchOnce, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // We intentionally don't depend on `data` to avoid restart loops —
    // the closure capture is fine for the silent fallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}

/** "Live · 12s ago" indicator that updates every second. */
function useSecondsSince(fetchedAt: string | undefined): number {
  const subscribe = (cb: () => void): (() => void) => {
    if (typeof window === "undefined") return () => {};
    const id = setInterval(cb, 1000);
    return () => clearInterval(id);
  };
  const getSnapshot = (): number => {
    if (!fetchedAt) return 0;
    return Math.max(
      0,
      Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 1000),
    );
  };
  const getServerSnapshot = (): number => 0;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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

// OilPrice.com quotes are fetched at build time by scripts/fetch-oilprice.ts
// from oilprice.com's homepage HTML. When that fetch fails (or the page
// shape changes), we fall back to these "last sane" values so the row
// still renders. The caller (HomePage) reads the snapshot and passes
// the actual values in via props; this fallback only fires if the
// snapshot is missing or empty.
const OILPRICE_FALLBACK = {
  brent: { price: 91.12, changePct: -1.7, ageLabel: "stale" },
  wti: { price: 87.36, changePct: -1.7, ageLabel: "stale" },
} as const;

export interface OilPriceQuote {
  price: number;
  changePct: number;
  ageLabel?: string;
}

export interface OilHeroProps {
  oilPriceBrent?: OilPriceQuote;
  oilPriceWti?: OilPriceQuote;
  oilPriceFetchedAt?: string;
}

function StaticPriceCell({
  label,
  price,
  changePct,
  ageLabel,
}: {
  label: string;
  price: number;
  changePct: number;
  ageLabel?: string;
}) {
  const positive = changePct >= 0;
  const tone = positive
    ? "text-[color:var(--lean-foreign-global-south)]"
    : "text-[color:var(--stale-error)]";
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:gap-x-4">
      <span className="inline-flex shrink-0 items-center rounded border border-[color:var(--lean-foreign-global-south)]/40 bg-[color:var(--lean-foreign-global-south-bg)]/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--lean-foreign-global-south)]">
        {label}
      </span>
      <span className="font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
        ${price.toFixed(2)}
      </span>
      <span className={`font-mono text-sm font-medium tabular-nums ${tone}`}>
        {positive ? "+" : ""}
        {changePct.toFixed(2)}%
      </span>
      {ageLabel && (
        <span className="text-[10px] text-muted">{ageLabel} ago</span>
      )}
    </div>
  );
}

export default function OilHero({
  oilPriceBrent,
  oilPriceWti,
  oilPriceFetchedAt,
}: OilHeroProps = {}) {
  // SSR / build-time props feed the initial render. The hook then
  // polls /api/oilprice every 60s and replaces with live values.
  const live = useLiveOilPrices({
    brent: oilPriceBrent,
    wti: oilPriceWti,
    fetchedAt: oilPriceFetchedAt,
  });
  const brent = live.brent ?? OILPRICE_FALLBACK.brent;
  const wti = live.wti ?? OILPRICE_FALLBACK.wti;
  const secondsSinceFetch = useSecondsSince(live.fetchedAt);
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
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
              {live.isLive ? (
                <>
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--lean-foreign-global-south)] animate-pulse"
                  />
                  Live · {secondsSinceFetch}s ago
                </>
              ) : (
                "Snapshot"
              )}
            </span>
          </div>
          <StaticPriceCell
            label="Brent"
            price={brent.price}
            changePct={brent.changePct}
            ageLabel={brent.ageLabel}
          />
          <StaticPriceCell
            label="WTI"
            price={wti.price}
            changePct={wti.changePct}
            ageLabel={wti.ageLabel}
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
