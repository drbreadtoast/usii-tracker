"use client";

import { useEffect, useRef } from "react";

interface Props {
  symbol: string;
  title: string;
  height?: number;
}

export default function TradingViewChart({
  symbol,
  title,
  height = 320,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Skip Strict-Mode re-runs that would create a second widget.
    if (node.querySelector(".tradingview-widget-container__widget")) {
      return;
    }

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = `${height}px`;
    widget.style.width = "100%";
    node.appendChild(widget);

    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.text = JSON.stringify({
      symbol,
      width: "100%",
      height,
      locale: "en",
      dateRange: "1M",
      colorTheme: isDark ? "dark" : "light",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    node.appendChild(script);
    return () => {
      node.innerHTML = "";
    };
  }, [symbol, height]);

  return (
    <div className="rounded-lg border border-border bg-surface p-2">
      <div className="px-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </div>
      <div
        ref={ref}
        className="tradingview-widget-container"
        style={{ minHeight: height }}
        aria-label={`${title} live chart`}
      />
    </div>
  );
}
