"use client";

import { useEffect, useRef, useState } from "react";

/** Endpoint vercel.json gives no-store cache headers. */
const ENDPOINT = "/build-id.json";
/** How often to poll. 60 seconds is gentle and matches typical reading session. */
const POLL_MS = 60_000;
/** Wait this long after a successful fetch failure before retrying. */
const BACKOFF_MS = 5 * 60_000;

interface BuildPayload {
  buildId: string;
  builtAt?: string;
  commit?: string;
  manifestLastUpdated?: string | null;
}

/**
 * Polls /build-id.json. When the buildId changes from what we loaded
 * the page with, render a small banner prompting the user to refresh
 * for the latest content. Keeps stale tabs from showing yesterday's
 * news after a 4×/day deploy.
 */
export default function FreshBuildBanner() {
  const [hasNewer, setHasNewer] = useState(false);
  const initialBuildId = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function fetchBuildId(): Promise<BuildPayload | null> {
      try {
        const res = await fetch(`${ENDPOINT}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as BuildPayload;
      } catch {
        return null;
      }
    }

    async function tick(): Promise<void> {
      if (cancelled) return;
      const payload = await fetchBuildId();
      if (cancelled) return;

      if (payload?.buildId) {
        if (initialBuildId.current === null) {
          initialBuildId.current = payload.buildId;
        } else if (payload.buildId !== initialBuildId.current) {
          setHasNewer(true);
          return; // stop polling — we already know there's an update
        }
      }
      const next = payload ? POLL_MS : BACKOFF_MS;
      timer = setTimeout(tick, next);
    }

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!hasNewer) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 rounded-lg border border-[color:var(--accent)]/60 bg-surface-muted px-4 py-3 shadow-xl backdrop-blur sm:inset-x-auto sm:right-6"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          New refresh available
        </p>
        <p className="text-xs text-muted">
          Content has been updated since you opened this tab.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex shrink-0 items-center rounded-md bg-[color:var(--accent)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-background transition hover:opacity-90"
      >
        Reload
      </button>
    </div>
  );
}
