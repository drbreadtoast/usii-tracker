import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Site
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/sources">Source bias map</Link>
              </li>
              <li>
                <Link href="/feed.xml">RSS</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Sections
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={"/us-politics" as never}>US Politics</Link>
              </li>
              <li>
                <Link href={"/foreign" as never}>Foreign Affairs</Link>
              </li>
              <li>
                <Link href={"/markets" as never}>Markets</Link>
              </li>
              <li>
                <Link href={"/war" as never}>War</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Methodology
            </h3>
            <p className="text-sm text-muted">
              Source bias ratings anchored on{" "}
              <a
                href="https://www.allsides.com/media-bias/ratings"
                target="_blank"
                rel="noopener noreferrer"
              >
                AllSides
              </a>
              . Content refreshed four times daily by a scheduled agent.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              Not original reporting. Summaries generated with AI assistance from
              cited sources. © linked outlets. Quotation use is limited under
              fair use; visit the linked source for full articles.
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-4 text-xs text-muted">
          TheOSSreport · Built with Next.js, hosted on Vercel · Live prices via
          TradingView
        </div>
      </div>
    </footer>
  );
}
