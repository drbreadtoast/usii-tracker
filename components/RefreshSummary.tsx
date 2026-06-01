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
 * Right-aligned "Refreshed 4×/day / Last refresh ... Pacific Time · 4h ago"
 * block in the home-page masthead. Same timestamp surface as RefreshStrip
 * and QuickBriefHeader, kept in sync via the shared lib/refresh.ts.
 */
export default function RefreshSummary({ lastUpdated }: Props) {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = tick !== 0;
  const absolute = formatPacificTime(lastUpdated);
  const relative = hydrated ? formatRelativeAgo(lastUpdated) : "";

  return (
    <div className="flex flex-col gap-1.5 text-xs sm:text-right sm:text-[13px]">
      <span className="font-medium uppercase tracking-wider text-muted">
        Refreshed 4×/day
      </span>
      <span className="text-foreground/80" suppressHydrationWarning>
        Last refresh {absolute}
        <span className="text-muted">
          {" "}
          · {hydrated ? relative : "—"}
        </span>
      </span>
    </div>
  );
}
