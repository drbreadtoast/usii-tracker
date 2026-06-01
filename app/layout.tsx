import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AlertTicker from "@/components/AlertTicker";
import WorldClocks from "@/components/WorldClocks";
import RefreshStrip from "@/components/RefreshStrip";
import MarketTicker from "@/components/MarketTicker";
import FreshBuildBanner from "@/components/FreshBuildBanner";
import { getManifest } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const SITE_NAME = "TheOSSreport";
const SITE_DESCRIPTION =
  "US and foreign affairs covered from left, center, right, and international perspectives. Live commodity and crypto prices. Refreshed four times daily.";
const SITE_URL = "https://theossreport.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Multi-perspective US & Foreign Affairs`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "news",
    "US politics",
    "foreign affairs",
    "AllSides",
    "media bias",
    "balanced news",
    "oil prices",
    "geopolitics",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Multi-perspective US & Foreign Affairs`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Multi-perspective US & Foreign Affairs`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d18" },
  ],
};

// Dark is the v1-matched brand default. We only opt out of dark if the
// user has explicitly stored 'light' in localStorage.
const themeBootstrap = `
(function() {
  try {
    var s = localStorage.getItem('theme');
    var theme = s || 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const manifest = await getManifest().catch(() => null);
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AlertTicker />
        <Nav />
        <WorldClocks />
        {manifest && <RefreshStrip lastUpdated={manifest.lastUpdated} />}
        <main className="flex flex-1 flex-col">{children}</main>
        <MarketTicker />
        <Footer />
        <FreshBuildBanner />
      </body>
    </html>
  );
}
