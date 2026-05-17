import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const SITE_TITLE = "TheOSSreport";
const SITE_TAGLINE = "US & foreign affairs from every side";

const NAV_LINKS = [
  { href: "/us-politics", label: "US Politics" },
  { href: "/foreign", label: "Foreign" },
  { href: "/markets", label: "Markets" },
  { href: "/ai-tech", label: "AI & Tech" },
  { href: "/war", label: "War" },
  { href: "/underreported", label: "Underreported" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex flex-col leading-tight no-underline hover:no-underline">
          <span className="text-lg font-bold tracking-tight">{SITE_TITLE}</span>
          <span className="hidden text-[11px] uppercase tracking-wide text-muted sm:block">
            {SITE_TAGLINE}
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as never}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/75 transition hover:bg-surface-muted hover:text-foreground hover:no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="hidden text-xs font-medium text-muted hover:text-foreground sm:inline"
          >
            About
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <nav
        aria-label="Section navigation"
        className="overflow-x-auto border-t border-border md:hidden"
      >
        <ul className="flex w-max gap-1 px-4 py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as never}
                className="inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium text-foreground/75 hover:bg-surface-muted hover:no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
