"use client";

import { useEffect, useState } from "react";
import { SURVEY_OPEN_EVENT } from "@/lib/survey";
import { readStoredVote, VOTE_LABELS, type VoteChoice } from "@/lib/vote";

const WEB3FORMS_KEY = "b6a6218f-b812-4dd9-a358-26536d4bb141";
const SUBMITTED_KEY = "survey-v1-submitted";

type Status = "idle" | "sending" | "success" | "error";

export default function FeedbackSurveyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [vote, setVote] = useState<VoteChoice | null>(null);

  useEffect(() => {
    function handler(): void {
      setVote(readStoredVote());
      setIsOpen(true);
    }
    window.addEventListener(SURVEY_OPEN_EVENT, handler);
    return () => window.removeEventListener(SURVEY_OPEN_EVENT, handler);
  }, []);

  function close(): void {
    if (status === "sending") return;
    setIsOpen(false);
  }

  function resetForm(): void {
    setRating(null);
    setFeedback("");
    setEmail("");
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (rating === null || !feedback.trim()) return;
    setStatus("sending");

    const body = [
      `Rating: ${rating}/10`,
      vote ? `Vote on banner: ${VOTE_LABELS[vote]} (${vote})` : null,
      `\nFeedback:\n${feedback.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const voteTag = vote ? ` · ${vote}` : "";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[TheOSSreport] Feedback — ${rating}/10${voteTag}`,
          from_name: "TheOSSreport Feedback",
          email: email.trim() || "anonymous@visitor.com",
          message: body,
          botcheck: "",
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
        setStatus("success");
        try {
          localStorage.setItem(SUBMITTED_KEY, "1");
        } catch {
          /* no-op */
        }
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  const canSubmit =
    rating !== null && feedback.trim().length > 0 && status !== "sending";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Submit feedback"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={close}
        aria-hidden
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gray-900 px-5 py-4">
          <div className="flex items-center gap-2">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-amber-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-sm font-bold text-gray-100">Submit feedback</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-gray-500 transition hover:text-gray-300"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm font-semibold text-gray-200">
                Thanks for the feedback!
              </p>
              <p className="max-w-xs text-xs text-gray-500">
                I read every response. Your input shapes what comes next.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {vote && (
                <div className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Your banner vote
                  </p>
                  <p className="mt-0.5 text-xs text-gray-300">
                    {VOTE_LABELS[vote]}
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Rate the site (0 = worst, 10 = best)
                </label>
                <div className="grid grid-cols-11 gap-1">
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => {
                    const active = rating === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-label={`Rate ${n} out of 10`}
                        aria-pressed={active}
                        className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition-colors ${
                          active
                            ? "border-amber-500 bg-amber-500 text-gray-900"
                            : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-amber-500/60 hover:text-amber-300"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                  <span>Worst</span>
                  <span>Best</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="survey-feedback"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                >
                  Tell me what&apos;s working, what isn&apos;t, and what to
                  bring back *
                </label>
                <textarea
                  id="survey-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What's working, what isn't, what to bring back from the old version, what to add…"
                  rows={4}
                  required
                  className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="survey-email"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                >
                  Email{" "}
                  <span className="normal-case text-gray-600">
                    (optional, for follow-up)
                  </span>
                </label>
                <input
                  id="survey-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500"
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="botcheck"
                value=""
                onChange={() => {}}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-gray-900 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-500"
              >
                {status === "sending" ? (
                  <>
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 animate-spin"
                    >
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>Submit feedback</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
