import type { Source } from "@/lib/types";

interface Props {
  source: Source;
}

export default function SourceLink({ source }: Props) {
  const date = new Date(source.publishedAt);
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block group rounded-md border border-border/60 bg-surface px-3 py-2 text-sm transition hover:border-accent/40 hover:bg-surface-muted"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{source.outlet}</span>
        <span className="text-xs text-muted">{dateLabel}</span>
      </div>
      <div className="mt-1 text-foreground/85 group-hover:text-foreground">
        {source.title}
      </div>
      {source.isStateMedia && (
        <div
          className="mt-1 inline-block rounded bg-stale-warn/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stale-warn"
          aria-label="State-affiliated media"
        >
          State media
        </div>
      )}
    </a>
  );
}
