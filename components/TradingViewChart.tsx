"use client";

import { useEffect, useRef, useState } from "react";

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.innerHTML = "";

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

    let timeout: ReturnType<typeof setTimeout> | null = null;
    script.onerror = () => setFailed(true);
    timeout = setTimeout(() => {
      if (!widget.firstChild) setFailed(true);
    }, 7000);

    node.appendChild(script);
    return () => {
      if (timeout) clearTimeout(timeout);
      node.innerHTML = "";
    };
  }, [symbol, height]);

  if (failed) {
    return (
      <div
        className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-surface-muted p-4 text-center text-sm text-muted"
        role="status"
      >
        <div className="font-medium text-foreground/80">{title}</div>
        <div className="mt-1">Live chart unavailable</div>
      </div>
    );
  }

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
