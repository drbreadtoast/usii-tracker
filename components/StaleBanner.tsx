import { hoursSince, formatTimestamp } from "@/lib/content";

interface Props {
  lastUpdated: string;
}

export default function StaleBanner({ lastUpdated }: Props) {
  const hours = hoursSince(lastUpdated);
  const formatted = formatTimestamp(lastUpdated);

  if (hours < 12) {
    return (
      <div
        className="flex items-center gap-2 rounded-md border border-border bg-surface-muted px-3 py-2 text-xs text-muted"
        role="status"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-lean-foreign-global-south" />
        Last refresh: {formatted} ET ({hours.toFixed(1)}h ago)
      </div>
    );
  }

  if (hours < 24) {
    return (
      <div
        className="flex items-center gap-2 rounded-md border border-stale-warn/40 bg-stale-warn/10 px-3 py-2 text-xs text-stale-warn"
        role="status"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-stale-warn" />
        Content may be stale — last refresh {formatted} ET ({hours.toFixed(1)}h
        ago). Scheduled agent may have failed.
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-stale-error/40 bg-stale-error/10 px-3 py-2 text-xs text-stale-error"
      role="alert"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-stale-error" />
      Content is over 24h old — last refresh {formatted} ET. The scheduled agent has
      likely failed; check the run logs.
    </div>
  );
}
