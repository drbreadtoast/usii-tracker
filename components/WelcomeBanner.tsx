"use client";

import { useEffect, useState } from "react";
import { openContact } from "@/lib/contact";

// Bump this key whenever the welcome message materially changes —
// returning visitors will see the new banner once and can dismiss again.
const DISMISS_KEY = "welcome-v1-dismissed";

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, etc.) — show by default
      setVisible(true);
    }
  }, []);

  function dismiss(): void {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* no-op */
    }
  }

  if (!visible) return null;

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
            Welcome to the new TheOSSreport. The site formerly known as the{" "}
            <span className="font-semibold">US · Israel · Iran War Tracker</span>{" "}
            has expanded into{" "}
            <span className="font-semibold">US Local &amp; Foreign Affairs</span>{" "}
            — multi-perspective coverage across politics, foreign affairs,
            markets, AI &amp; tech, war, and underreported stories. This is
            version 1 of the new site, so you may run into some bugs. I&apos;ll
            be actively fixing, improving, and adding more. Feel free to report
            a bug or send feedback.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openContact("suggestion")}
              className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--accent)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-background transition hover:opacity-90"
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Send feedback
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
          onClick={dismiss}
          aria-label="Dismiss welcome message"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
