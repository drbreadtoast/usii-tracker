/**
 * Methodology callout for the Foreign Influence funding section. Leads with the
 * correlation-≠-causation disclaimer so the funding-vs-votes data is read in
 * the right light. Server component.
 */
export default function FundingDisclaimer({
  disclaimer,
}: {
  disclaimer: string;
}) {
  return (
    <div className="rounded-xl border border-stale-warn/30 bg-stale-warn-bg/30 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-stale-warn">
        How to read this section
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
        {disclaimer}
      </p>
    </div>
  );
}
