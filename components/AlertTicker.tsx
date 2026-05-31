import Link from "next/link";
import { getSection, topStoriesByImportance } from "@/lib/content";

const BREAKING_THRESHOLD = 4; // importance ≥ 4 surfaces here

export default async function AlertTicker() {
  const headlines = await getSection("headlines");
  const breaking = topStoriesByImportance(headlines.stories, 4).filter(
    (s) => s.importance >= BREAKING_THRESHOLD,
  );

  // Hide the strip entirely if nothing meets the threshold.
  if (breaking.length === 0) return null;

  // Combine headlines into one marquee string with a divider.
  const text = breaking.map((s) => s.headline).join("   ///   ");

  // The marquee scrolls the same content twice (one visible, one queued)
  // so the loop is seamless. We render the same string twice; the second
  // copy is aria-hidden.
  return (
    <div
      role="region"
      aria-label="Breaking news"
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-1.5 text-[11px] sm:gap-4 sm:px-6 sm:text-xs">
        <span className="shrink-0 inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.18em] text-[color:var(--stale-warn)]">
          <span aria-hidden>⚠</span>
          Breaking
        </span>
        <div
          className="relative flex-1 overflow-hidden"
          aria-live="polite"
        >
          <div className="animate-marquee inline-flex whitespace-nowrap">
            <span className="pr-12 text-foreground/90 font-medium">
              {breaking.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="mx-3 text-[color:var(--stale-warn)]/70"
                    >
                      {"///"}
                    </span>
                  )}
                  <Link
                    href={`/${s.category}#${s.id}` as never}
                    className="hover:text-[color:var(--stale-warn)] hover:no-underline"
                  >
                    {s.headline}
                  </Link>
                </span>
              ))}
            </span>
            <span
              className="pr-12 text-foreground/90 font-medium"
              aria-hidden
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
