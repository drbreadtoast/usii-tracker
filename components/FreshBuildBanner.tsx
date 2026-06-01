"use client";

import { useEffect, useRef, useState } from "react";

/** Endpoint vercel.json gives no-store cache headers. */
const ENDPOINT = "/build-id.json";
/** How often to poll. 60 seconds is gentle and matches typical reading session. */
const POLL_MS = 60_000;
/** Wait this long after a successful fetch failure before retrying. */
const BACKOFF_MS = 5 * 60_000;
/** Seconds to count down before auto-reloading once a new build is detected. */
const AUTO_RELOAD_SECONDS = 120;

interface BuildPayload {
  buildId: string;
  builtAt?: string;
  commit?: string;
  manifestLastUpdated?: string | null;
}

/**
 * Polls /build-id.json. When the buildId changes from what we loaded
 * the page with, render a banner prompting the user to refresh and
 * AUTO-RELOAD after a 120s countdown. User can reload now or dismiss
 * (in which case we won't nag again until the next deploy).
 *
 * Critical for users — especially streamers and people who keep tabs
 * open — to see fresh content without manually refreshing.
 */
export default function FreshBuildBanner() {
  const [hasNewer, setHasNewer] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RELOAD_SECONDS);
  const initialBuildId = useRef<string | null>(null);
  const mounted = useRef(false);
  const dismissed = useRef(false);

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
      if (cancelled || dismissed.current) return;
      const payload = await fetchBuildId();
      if (cancelled || dismissed.current) return;

      if (payload?.buildId) {
        if (initialBuildId.current === null) {
          initialBuildId.current = payload.buildId;
        } else if (payload.buildId !== initialBuildId.current) {
          setHasNewer(true);
          return; // stop polling — countdown takes over from here
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

  // Countdown + auto-reload once a new build is detected.
  useEffect(() => {
    if (!hasNewer) return;
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [hasNewer]);

  function dismiss(): void {
    dismissed.current = true;
    setHasNewer(false);
  }

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
          Auto-reloading in {countdown}s…
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center rounded-md bg-[color:var(--accent)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-background transition hover:opacity-90"
        >
          Reload now
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss update notification"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-background hover:text-foreground"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
