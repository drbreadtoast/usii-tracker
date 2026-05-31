import type { SpeakerLean, Statement } from "@/lib/types";

interface Props {
  statements: Statement[];
  /** Max statements to display. Default 4. */
  limit?: number;
}

const SPEAKER_COLORS: Record<SpeakerLean, string> = {
  red: "text-[color:var(--stale-error)]",
  blue: "text-[color:var(--lean-left)]",
  gold: "text-[color:var(--stale-warn)]",
  green: "text-[color:var(--lean-foreign-global-south)]",
  purple: "text-[color:var(--lean-foreign-western)]",
  gray: "text-foreground/80",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function KeyStatementsCard({ statements, limit = 4 }: Props) {
  const visible = [...statements]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);

  if (visible.length === 0) return null;

  return (
    <section
      aria-labelledby="key-statements-heading"
      className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-sm"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2
          id="key-statements-heading"
          className="font-serif text-lg font-bold tracking-tight sm:text-xl"
        >
          Key statements
        </h2>
        <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted">
          Quoted today
        </span>
      </header>

      <ul className="flex flex-1 flex-col divide-y divide-border">
        {visible.map((s) => {
          const speakerClass = SPEAKER_COLORS[s.speakerLean];
          const content = (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span
                  className={`font-bold uppercase tracking-wider ${speakerClass}`}
                >
                  {s.speaker}
                </span>
                <span className="text-muted">{formatDate(s.date)}</span>
              </div>
              <p className="font-serif text-[15px] leading-snug text-foreground/90">
                <span aria-hidden className="mr-1 text-muted">“</span>
                {s.quote}
                <span aria-hidden className="ml-0.5 text-muted">”</span>
              </p>
              {s.context && (
                <p className="text-xs leading-relaxed text-muted">
                  {s.context}
                  {s.sourceOutlet && (
                    <>
                      {" · "}
                      <span className="text-foreground/70">
                        {s.sourceOutlet}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          );
          return (
            <li key={s.id} className="px-4 py-4 sm:px-5">
              {s.sourceUrl ? (
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block hover:no-underline"
                  aria-label={`Read ${s.speaker} statement source`}
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
