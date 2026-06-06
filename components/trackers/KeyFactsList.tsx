import type { KeyFact } from "@/lib/trackers-types";

/**
 * Renders a list of sourced standalone facts. Shared across all tracker pages.
 * Every fact links to its source so claims are checkable. Server component.
 */
export default function KeyFactsList({ facts }: { facts: KeyFact[] }) {
  if (!facts || facts.length === 0) return null;
  return (
    <ul className="flex flex-col gap-3">
      {facts.map((f, i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-surface-muted/40 p-3 text-sm leading-relaxed sm:p-4"
        >
          <p className="text-foreground/90">{f.fact}</p>
          <p className="mt-2 text-xs text-muted">
            <a
              href={f.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[color:var(--accent)] hover:underline"
            >
              {f.source}
            </a>
            {f.date ? <span className="ml-2 tabular-nums">{f.date}</span> : null}
          </p>
        </li>
      ))}
    </ul>
  );
}
