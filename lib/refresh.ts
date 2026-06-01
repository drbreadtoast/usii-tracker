/**
 * lib/refresh.ts
 *
 * Shared formatters for the "Last news refresh" displays, ported from
 * the v1 INBOX/src/components/Layout/WorldClocks.jsx +
 * HomepageSummary.jsx surfaces. Pure functions — no React, no DOM —
 * so they can be called from both client components and SSR.
 */

/**
 * "May 31, 2026, 05:01 PM Pacific Time" — absolute time stamp in the
 * America/Los_Angeles zone with the explicit "Pacific Time" suffix.
 */
export function formatPacificTime(iso: string): string {
  const formatted = new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    hour12: true,
  });
  return `${formatted} Pacific Time`;
}

/**
 * "4h ago", "12m ago", "moments ago", "2d ago" — coarse relative time
 * matching the v1 thresholds (sub-minute → moments, <60min → Nm,
 * <24h → Nh, else Nd).
 *
 * `now` is injectable so callers can re-render against a controlled
 * tick (useSyncExternalStore) instead of reading Date.now() at render.
 */
export function formatRelativeAgo(iso: string, now: number = Date.now()): string {
  const diffMs = Math.abs(now - new Date(iso).getTime());
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  if (diffMins < 1) return "moments ago";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
