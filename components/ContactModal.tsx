"use client";

import { useEffect, useState } from "react";
import { CONTACT_OPEN_EVENT, type ContactCategory } from "@/lib/contact";

// Same Web3Forms access key the v1 USII Tracker used — keeps feedback
// routing to the same inbox without any re-signup.
const WEB3FORMS_KEY = "b6a6218f-b812-4dd9-a358-26536d4bb141";

const CATEGORIES: {
  id: ContactCategory;
  label: string;
  // Each category renders a different inline SVG icon (no icon-library
  // dependency).
  icon: "bug" | "question" | "lightbulb";
  accent: string;
}[] = [
  { id: "bug", label: "Bug Report", icon: "bug", accent: "text-red-400" },
  {
    id: "question",
    label: "Question",
    icon: "question",
    accent: "text-blue-400",
  },
  {
    id: "suggestion",
    label: "Suggestion",
    icon: "lightbulb",
    accent: "text-amber-400",
  },
];

type Status = "idle" | "sending" | "success" | "error";

interface OpenEventDetail {
  category?: ContactCategory;
}

function CategoryIcon({
  kind,
  className,
}: {
  kind: "bug" | "question" | "lightbulb";
  className?: string;
}) {
  switch (kind) {
    case "bug":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="8" y="6" width="8" height="14" rx="4" />
          <path d="M19 7l-3 2M5 7l3 2M19 13h-3M5 13h3M19 19l-3-2M5 19l3-2M12 6V3M9 3h6" />
        </svg>
      );
    case "question":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-12z" />
        </svg>
      );
  }
}

/**
 * Global contact modal — floating button bottom-left, modal opens on
 * click OR when any client dispatches the CONTACT_OPEN_EVENT (e.g. the
 * "Send feedback" CTA inside the WelcomeBanner).
 *
 * Submission flows through Web3Forms (no backend required). The same
 * access key the v1 site used — emails land in the same inbox.
 */
export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<ContactCategory>("suggestion");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // External-open listener: lets WelcomeBanner (or anything else) open
  // the modal and optionally preselect a category.
  useEffect(() => {
    function handler(e: Event): void {
      const detail = (e as CustomEvent<OpenEventDetail>).detail;
      if (detail?.category) setCategory(detail.category);
      setIsOpen(true);
    }
    window.addEventListener(CONTACT_OPEN_EVENT, handler);
    return () => window.removeEventListener(CONTACT_OPEN_EVENT, handler);
  }, []);

  function close(): void {
    if (status === "sending") return;
    setIsOpen(false);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[TheOSSreport] ${category.charAt(0).toUpperCase()}${category.slice(1)} from visitor`,
          from_name: "TheOSSreport Contact Form",
          email: email.trim() || "anonymous@visitor.com",
          message: `Category: ${category}\n\n${message}`,
          botcheck: "",
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setMessage("");
          setEmail("");
          setCategory("suggestion");
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Floating launcher — bottom-left, above MarketTicker */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open contact form"
          className="fixed bottom-24 left-4 z-[60] flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/30 transition hover:scale-105 hover:bg-blue-500 sm:px-4"
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="hidden sm:inline">Contact</span>
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={close}
            aria-hidden
          />

          <div className="relative w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-blue-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h2 className="text-sm font-bold text-gray-100">Contact</h2>
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
                <div className="flex flex-col items-center gap-3 py-8">
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
                    Message sent!
                  </p>
                  <p className="text-xs text-gray-500">
                    Thanks — I&apos;ll review it shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const active = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                              active
                                ? "border-blue-500 bg-blue-600 text-white"
                                : "border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700"
                            }`}
                          >
                            <CategoryIcon
                              kind={cat.icon}
                              className={`h-3 w-3 ${active ? "text-white" : cat.accent}`}
                            />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Email{" "}
                      <span className="normal-case text-gray-600">
                        (optional, for reply)
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the bug, ask a question, or share a suggestion..."
                      rows={4}
                      required
                      className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  {/* Honeypot — hidden from users, catches bots */}
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
                    disabled={status === "sending" || !message.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
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
                      <>
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
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
