"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const SITE_TITLE = "TheOSSreport";
const SITE_TAGLINE = "Every side of the story";

const PRIMARY_LINKS = [
  { href: "/us-politics", label: "US Politics" },
  { href: "/foreign", label: "Foreign" },
  { href: "/markets", label: "Markets" },
  { href: "/ai-tech", label: "AI & Tech" },
  { href: "/war", label: "War" },
  { href: "/underreported", label: "Underreported" },
];

const SECONDARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/sources", label: "Sources" },
  { href: "/feed.xml", label: "RSS" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // No backdrop-blur on the header — it creates a containing block that
  // would trap the fixed mobile menu inside the header (height collapses
  // to header_height - 57px). Solid bg keeps the same visual weight.
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:py-4">
        <Link
          href="/"
          className="flex flex-col leading-tight no-underline hover:no-underline"
          aria-label={`${SITE_TITLE} home`}
        >
          <span className="font-serif text-xl font-bold tracking-tight sm:text-2xl">
            {SITE_TITLE}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
            {SITE_TAGLINE}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {PRIMARY_LINKS.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href as never}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition hover:bg-surface-muted hover:no-underline ${
                      active
                        ? "text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/about"
            className="hidden text-xs font-medium text-muted hover:text-foreground lg:inline"
          >
            About
          </Link>
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition hover:bg-surface-muted md:hidden"
          >
            <span
              aria-hidden
              className="relative block h-3.5 w-4"
            >
              <span
                className={`absolute left-0 right-0 top-0 h-0.5 rounded bg-current transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-[6px] h-0.5 rounded bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded bg-current transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile overlay menu — z-50 to sit above the TradingView ticker
          iframe, which uses its own elevated z-index internally. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`md:hidden fixed inset-x-0 top-[57px] bottom-0 z-50 transform border-t border-border bg-background transition-transform duration-200 ease-out ${
          open ? "translate-y-0" : "-translate-y-2 pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Sections"
          className="mx-auto h-full w-full max-w-6xl overflow-y-auto px-4 py-6"
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            Sections
          </p>
          <ul className="mb-6 flex flex-col">
            {PRIMARY_LINKS.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href as never}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                    className={`flex items-center justify-between border-b border-border py-3 text-lg font-medium hover:no-underline ${
                      active ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    <span className="font-serif">{link.label}</span>
                    <span aria-hidden className="text-muted">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            About
          </p>
          <ul className="flex flex-col">
            {SECONDARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as never}
                  onClick={close}
                  className="block border-b border-border py-3 text-base text-foreground/80 hover:no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
