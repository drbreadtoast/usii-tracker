"use client";

import { useSyncExternalStore } from "react";
import { formatRelativeAgo } from "@/lib/refresh";

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
 * "Quick Brief" section header, ported from
 * INBOX/src/components/Layout/HomepageSummary.jsx. Sits above the
 * Top Stories hero with the bold uppercase title, tagline, and a
 * clock-icon stamp showing the relative refresh time. The Day-N
 * counter from v1 was deliberately dropped — the v2 site no longer
 * tracks a single conflict day.
 */
export default function QuickBriefHeader({ lastUpdated }: Props) {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = tick !== 0;
  const relative = hydrated ? formatRelativeAgo(lastUpdated) : "";

  return (
    <div className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-foreground/80">
          Quick Brief
        </p>
        <p className="mt-1 text-[11px] text-muted sm:text-xs">
          Highlights from every section — click &ldquo;See all&rdquo; on any
          card for full details and sources
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span
            className="text-[11px] font-semibold text-[color:var(--lean-left)]"
            suppressHydrationWarning
          >
            Last news refresh: {hydrated ? relative : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
