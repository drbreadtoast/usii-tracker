"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = [
  { proName: "TVC:UKOIL", title: "Brent" },
  { proName: "TVC:USOIL", title: "WTI" },
  { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
  { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
  { proName: "BINANCE:SOLUSDT", title: "Solana" },
  { proName: "TVC:GOLD", title: "Gold" },
  { proName: "TVC:SILVER", title: "Silver" },
];

export default function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

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
      symbols: SYMBOLS,
      showSymbolLogo: true,
      colorTheme: isDark ? "dark" : "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    let timeout: ReturnType<typeof setTimeout> | null = null;
    script.onerror = () => setFailed(true);
    timeout = setTimeout(() => {
      if (!widgetWrap.firstChild) setFailed(true);
    }, 6000);

    node.appendChild(script);

    return () => {
      if (timeout) clearTimeout(timeout);
      node.innerHTML = "";
    };
  }, []);

  if (failed) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 text-xs text-muted"
        role="status"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-stale-warn" />
        Live market ticker unavailable. Refresh the page or check your network.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container min-h-[46px]"
      aria-label="Live market prices ticker"
    />
  );
}
