import type { ReactNode } from "react";

/**
 * Shared section wrapper for tracker panels (Follow the Oil, War cost, Eyes on
 * Israel). Server component — static markup only. Gives every panel the same
 * card chrome, serif heading, and optional right-aligned subtitle.
 */
export default function TrackerPanel({
  title,
  icon,
  subtitle,
  children,
}: {
  title: string;
  icon?: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-serif text-xl font-bold tracking-tight sm:text-2xl">
          {icon ? (
            <span className="mr-2" aria-hidden>
              {icon}
            </span>
          ) : null}
          {title}
        </h2>
        {subtitle ? (
          <span className="text-xs text-muted sm:text-sm">{subtitle}</span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
