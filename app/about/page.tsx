import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "How TheOSSreport works: methodology, source selection, AI-assisted summaries, and what to verify.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        About TheOSSreport
      </h1>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        TheOSSreport aggregates US domestic and foreign affairs and presents each
        story from multiple political and regional perspectives so readers can
        form their own conclusions instead of relying on a single outlet&apos;s
        framing.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">How it works</h2>
        <ul className="list-disc space-y-2 pl-5 text-foreground/85">
          <li>
            Content refreshes four times daily (00:00, 06:00, 12:00, 18:00 ET)
            via a scheduled Claude Code agent that researches and summarizes
            stories from outlets across the bias spectrum.
          </li>
          <li>
            Every summary lists its sources. Click through to read the original
            article. We never quote more than ~one sentence verbatim.
          </li>
          <li>
            Bias ratings are anchored on{" "}
            <a
              href="https://www.allsides.com/media-bias/ratings"
              target="_blank"
              rel="noopener noreferrer"
            >
              AllSides Media Bias Ratings
            </a>{" "}
            with foreign-outlet groupings added.
          </li>
          <li>
            Live market prices are embedded from{" "}
            <a
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TradingView
            </a>{" "}
            (Brent, WTI, BTC, ETH, SOL, gold, silver).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">What we label</h2>
        <ul className="list-disc space-y-2 pl-5 text-foreground/85">
          <li>
            <strong>Left / Center / Right</strong> — US outlets, with AllSides
            ratings shown on each source link.
          </li>
          <li>
            <strong>Foreign — Western / Eastern / Global South</strong> — non-US
            outlets grouped by editorial orientation. State-affiliated media is
            tagged.
          </li>
          <li>
            <strong>Government</strong> — direct statements from official
            sources (White House, State Dept, Federal Reserve).
          </li>
          <li>
            <strong>Social</strong> — when used, tagged as social signal, not
            journalism.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">What to verify</h2>
        <p className="text-foreground/85">
          Summaries are generated with AI assistance from cited sources. They can
          be wrong. Treat every claim as provisional and verify against the
          source links provided. If you spot an error, the bias of the source
          itself, or missing perspectives, that&apos;s normal — that&apos;s why
          we surface multiple sides.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">See also</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Link href="/sources">The full source bias map</Link>
          </li>
          <li>
            <Link href="/feed.xml">RSS feed</Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
