"use client";

import { useSyncExternalStore } from "react";
import { formatPacificTime, formatRelativeAgo } from "@/lib/refresh";

const TICK_MS = 30_000;

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const id = setInterval(callback, TICK_MS);
  return () => clearInterval(id);
}
function getSnapshot(): number {
  return Math.floor(Date.now() / TICK_MS);
}
function getServerSnapshot(): number {
  return 0;
}

interface Props {
  lastUpdated: string;
}

/**
 * Thin strip under the WorldClocks row showing the cadence message on
 * the left and the relative + absolute Pacific Time stamp on the right.
 * Ported from INBOX/src/components/Layout/WorldClocks.jsx.
 */
export default function RefreshStrip({ lastUpdated }: Props) {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = tick !== 0;
  const relative = hydrated ? formatRelativeAgo(lastUpdated) : "";
  const absolute = formatPacificTime(lastUpdated);

  return (
    <div className="border-b border-border bg-background/70">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-1 sm:px-6">
        <p className="hidden text-[10px] text-muted sm:block">
          Updated at least 3x daily — morning, afternoon &amp; evening Pacific
          Time
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 shrink-0 text-[color:var(--lean-left)]"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span
            className="text-[11px] font-semibold text-foreground"
            suppressHydrationWarning
          >
            Last news refresh: {hydrated ? relative : "—"}
          </span>
          <span
            className="hidden text-[10px] text-muted md:inline"
            suppressHydrationWarning
          >
            ({absolute})
          </span>
        </div>
      </div>
    </div>
  );
}
