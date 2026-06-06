"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/useTheme";

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
  const theme = useTheme();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Skip re-runs caused by React Strict Mode (dev only) if the widget
    // already attached. We detect this by checking for an existing
    // widget child element.
    if (node.querySelector(".tradingview-widget-container__widget")) {
      return;
    }

    const widgetWrap = document.createElement("div");
    widgetWrap.className = "tradingview-widget-container__widget";
    node.appendChild(widgetWrap);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.text = JSON.stringify({
      symbols: SYMBOLS,
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    node.appendChild(script);

    return () => {
      // Defer cleanup to avoid race with TradingView's async script
      // executing during Strict-Mode double-invoke. In production this
      // runs once on real unmount. Also runs when `theme` changes, so the
      // widget is re-injected with the new colorTheme.
      node.innerHTML = "";
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container min-h-[46px]"
      aria-label="Live market prices ticker"
    />
  );
}
