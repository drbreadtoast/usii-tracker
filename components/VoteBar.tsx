"use client";

import { useEffect, useState } from "react";
import {
  readStoredVote,
  sendVote,
  VOTE_CHOICES,
  VOTE_LABELS,
  VOTED_KEY,
  type VoteChoice,
} from "@/lib/vote";

const ACCENT: Record<VoteChoice, string> = {
  keep: "bg-emerald-500/15 border-emerald-500/50 text-emerald-300",
  revert: "bg-rose-500/15 border-rose-500/50 text-rose-300",
  hybrid: "bg-amber-500/15 border-amber-500/50 text-amber-300",
};

type Status = "idle" | "sending" | "sent" | "error";

export default function VoteBar() {
  const [voted, setVoted] = useState<VoteChoice | null>(null);
  const [pending, setPending] = useState<VoteChoice | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVoted(readStoredVote());
    setMounted(true);
  }, []);

  async function handleClick(choice: VoteChoice): Promise<void> {
    if (voted || pending) return;
    setPending(choice);
    setStatus("sending");
    const ok = await sendVote(choice);
    if (ok) {
      try {
        localStorage.setItem(VOTED_KEY, choice);
      } catch {
        /* no-op */
      }
      setVoted(choice);
      setStatus("sent");
    } else {
      setStatus("error");
    }
    setPending(null);
  }

  if (!mounted) return null;

  const locked = voted !== null || pending !== null;

  return (
    <div className="mt-4 rounded-md border border-[color:var(--accent)]/30 bg-background/40 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
        Quick vote — what should I do with the site?
      </p>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {VOTE_CHOICES.map((choice) => {
          const isMine = voted === choice;
          const isPending = pending === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleClick(choice)}
              disabled={locked}
              aria-pressed={isMine}
              aria-label={`Vote: ${VOTE_LABELS[choice]}`}
              className={`relative rounded-md border px-3 py-2 text-left transition ${
                isMine
                  ? ACCENT[choice]
                  : "border-border text-foreground hover:border-[color:var(--accent)]/60 hover:bg-[color:var(--accent)]/5"
              } ${locked && !isMine ? "opacity-60" : ""} ${
                locked ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold">
                  {VOTE_LABELS[choice]}
                </span>
                {isMine && (
                  <span
                    aria-hidden
                    className="shrink-0 text-sm"
                  >
                    ✓
                  </span>
                )}
                {isPending && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 shrink-0 animate-spin"
                  >
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-muted">
        {status === "sent" || voted
          ? "Thanks — your vote was sent. Want to say more? Tap “Submit feedback” below."
          : status === "sending"
            ? "Sending your vote…"
            : status === "error"
              ? "Couldn’t send. Please try again."
              : "One click — your vote goes straight to me."}
      </p>
    </div>
  );
}
