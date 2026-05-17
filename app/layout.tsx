import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const themeBootstrap = `
(function() {
  try {
    var s = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = s || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        <Nav />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
