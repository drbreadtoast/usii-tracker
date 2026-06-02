"use client";

import { useEffect, useState } from "react";
import { openContact } from "@/lib/contact";
import { openSurvey } from "@/lib/survey";
import VoteBar from "./VoteBar";

// Bump this key whenever the welcome message materially changes —
// returning visitors will see the expanded banner once and can collapse again.
const COLLAPSE_KEY = "welcome-v2-collapsed";

export default function WelcomeBanner() {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      /* localStorage unavailable — default to expanded */
    }
    setMounted(true);
  }, []);

  function toggle(): void {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
    } catch {
      /* no-op */
    }
  }

  // Avoid a flash of the wrong state on first paint before localStorage reads.
  if (!mounted) return null;

  if (collapsed) {
    return (
      <div className="border-b border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={false}
            aria-label="Show note from the developer"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/10"
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
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-12z" />
            </svg>
            <span>A note from the developer</span>
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10">
      <div className="mx-auto flex w-full max-w-6xl items-start gap-4 px-4 py-4 sm:px-6">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/20 text-[color:var(--accent)] sm:flex">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-12z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--accent)]">
            A note from the developer
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            Welcome to the new TheOSSreport — formerly the{" "}
            <span className="font-semibold">US · Israel · Iran War Tracker</span>
            , now expanded into{" "}
            <span className="font-semibold">US Local &amp; Foreign Affairs</span>
            . This site is for you, so take a second to{" "}
            <span className="font-semibold">vote below</span>{" "}
            and tell me what&apos;s working, what isn&apos;t, and what to bring
            back. It&apos;s
            version 1 — expect some bugs while I keep fixing, improving, and
            adding more, including bringing back things from the previous
            version.
          </p>
          <VoteBar />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openSurvey()}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 transition hover:bg-amber-400"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Submit feedback
            </button>
            <button
              type="button"
              onClick={() => openContact("bug")}
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--accent)]/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/10"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <rect x="8" y="6" width="8" height="14" rx="4" />
                <path d="M19 7l-3 2M5 7l3 2M19 13h-3M5 13h3M19 19l-3-2M5 19l3-2M12 6V3M9 3h6" />
              </svg>
              Report a bug
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={true}
          aria-label="Collapse welcome message"
          className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-background hover:text-foreground"
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
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
