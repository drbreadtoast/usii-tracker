"use client";

import { useSyncExternalStore } from "react";

interface City {
  name: string;
  tz: string;
  abbrev: string;
  flag: string;
}

const CITIES: City[] = [
  { name: "Jerusalem", tz: "Asia/Jerusalem", abbrev: "IST", flag: "🇮🇱" },
  { name: "Tehran", tz: "Asia/Tehran", abbrev: "IRST", flag: "🇮🇷" },
  { name: "Washington", tz: "America/New_York", abbrev: "ET", flag: "🇺🇸" },
  { name: "Moscow", tz: "Europe/Moscow", abbrev: "MSK", flag: "🇷🇺" },
  { name: "Beijing", tz: "Asia/Shanghai", abbrev: "CST", flag: "🇨🇳" },
  { name: "San Francisco", tz: "America/Los_Angeles", abbrev: "PT", flag: "🇺🇸" },
];

// Update every 30s. Sub-minute precision is overkill for a clock strip.
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
  // Sentinel: 0 means "we don't know yet, render placeholders".
  return 0;
}

function formatTime(tz: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function WorldClocks() {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = tick !== 0;

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-6xl overflow-x-auto">
        <ul
          className="flex items-center gap-3 whitespace-nowrap px-4 py-1.5 text-[11px] sm:gap-5 sm:px-6 sm:py-2 sm:text-xs"
          aria-label="World clocks"
        >
          {CITIES.map((c) => (
            <li
              key={c.name}
              className="inline-flex shrink-0 items-center gap-1.5"
            >
              <span aria-hidden className="text-sm leading-none">
                {c.flag}
              </span>
              <span className="text-muted">{c.name}</span>
              <span
                className="font-mono font-semibold tabular-nums text-foreground"
                suppressHydrationWarning
              >
                {hydrated ? formatTime(c.tz) : "--:--"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted">
                {c.abbrev}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
