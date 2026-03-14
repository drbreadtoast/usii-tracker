import { Link } from 'react-router-dom'
import { FileText, ArrowLeft, Sparkles, Wrench, Layout, Zap, Globe, BarChart3, MessageCircle, ShieldCheck, Heart, ExternalLink } from 'lucide-react'
import siteMetadata from '../data/site-metadata.json'
// UpdateBadge now rendered globally in App.jsx

const PATCH_NOTES = [
  {
    version: '2.2',
    date: 'March 13, 2026',
    title: 'Fact Check Page, Death Toll Context, UI Improvements',
    icon: ShieldCheck,
    iconColor: 'text-green-400',
    highlights: [
      'New "Rumor Tracker & Fact Check" page — debunking misinformation and verifying trending claims about the conflict with clickable sources for independent verification',
      'Homepage: Split the "Latest Escalations" card into two sections — Escalations + 24hr Report — to fill empty space and surface breaking developments',
      'Death Toll page: Added context notes and source links to Impact & Casualties numbers (injured, displaced, missing, arrested) — numbers now explain WHY with linked evidence',
      'Follow the Oil page: Collapsed the methodology/sources/disclaimer intro box into a dropdown to save space on this high-traffic page',
      'Live video player no longer autoplays — popup appears with "Watch Live" and "Close" buttons so visitors control playback',
      'Renamed "Explore" button to "Menu" in the navigation bar',
      '24hr Report: Individual items now show dates only (no times) to prevent inaccurate timestamps; page-level "Last Refresh" shows date, time, and how long ago',
      'Timeline & Events pages: Removed all time displays and morning/afternoon/evening labels — dates only for accuracy',
    ],
  },
  {
    version: '2.1',
    date: 'March 12, 2026',
    title: 'Timezone Fix, Clickable Breaking News & Time Bar Reorder',
    icon: Wrench,
    iconColor: 'text-green-400',
    highlights: [
      'All timestamps across the site now display in Pacific Time (PT) — eliminated UTC references that caused confusing date/time displays',
      'The red "Breaking News" banner is now clickable and links directly to the 24 Hour Report page',
      'Reordered the world clock bar to prioritize conflict zones: Jerusalem, Tehran, Washington, Beirut, Moscow, Beijing, San Francisco',
      'Rebranded from "USII Tracker" to "The OSS Report" across the entire site',
    ],
  },
  {
    version: '2.0',
    date: 'March 12, 2026',
    title: 'Major Redesign — Quick Brief, Live Video & Global Markets',
    icon: Zap,
    iconColor: 'text-red-400',
    highlights: [
      'New "Quick Brief" — the homepage now opens with a summary of every section so you get the latest intel instantly, no searching required. Click any card to dive deeper.',
      'Quick Brief shows a prominent "Last updated" timestamp so you always know how fresh the data is',
      'Live video popup with Al Jazeera English stream — auto-plays on load with a 5-second dismiss option so you can close it quickly if you want quiet',
      'Added i24NEWS (Israeli perspective) tab with fallback links when the embed is unavailable — see both sides of the conflict',
      'Video popup is draggable and resizable on desktop — move it anywhere on screen and resize to your preference',
      'Minimize the video to a compact pill that keeps audio playing in the background while you explore the map and data',
      'Global markets ticker — S&P 500, crypto, oil, gas & grocery prices now visible on every page, not just the homepage',
      'Enhanced Death Toll page — injured, displaced, and missing stats now shown as prominent styled cards',
      'Breaking news headline now scrolls like the 24hr report so long headlines are fully readable',
      'Redesigned homepage layout — Quick Brief at the top, interactive map and data panels below',
      'Scroll indicator guides you down to the live map and data panels after the Quick Brief',
      'Mobile-optimized: video popup floats above the footer with full minimize/close controls',
      'Changed "Last updated" to "Last news refresh" for clarity',
      'Version bumped to 2.0 to reflect the scope of this update',
    ],
  },
  {
    version: '1.8',
    date: 'March 11, 2026',
    title: 'Source Link Integrity',
    icon: Wrench,
    iconColor: 'text-green-400',
    highlights: [
      'Improved source link accuracy across all data files — links now point to verified, relevant articles',
      'Improved URL validation workflow to catch issues before publishing',
    ],
  },
  {
    version: '1.7',
    date: 'March 10, 2026',
    title: 'Page Consolidation & Quality of Life',
    icon: Layout,
    iconColor: 'text-blue-400',
    highlights: [
      'Consolidated the Oil & Gas and Energy pages into a single comprehensive "Oil, Gas & Energy" page — all energy data in one place',
      'Merged the Events page into the Timeline page as a new "Events Database" tab for easier navigation',
      'Redesigned the live oil price display for a cleaner, more readable layout',
      'Reordered page navigation to prioritize the most-viewed pages',
      'Renamed "Dashboard" to "Home" for clarity',
      'Added automatic update detection — you\'ll now see a notification when fresh data is published, no manual refresh needed',
      'Added this Patch Notes page so you can stay up to date with improvements',
    ],
  },
  {
    version: '1.6',
    date: 'March 10, 2026',
    title: 'Navigation & Layout Improvements',
    icon: Wrench,
    iconColor: 'text-amber-400',
    highlights: [
      'Streamlined site navigation from 16 pages down to 14 — less clutter, same depth',
      'Updated the Explore modal with clearer page descriptions',
      'Improved page routing with smart redirects for old bookmarks',
    ],
  },
  {
    version: '1.5',
    date: 'March 9, 2026',
    title: 'Oil & Gas Page with Live Ticker',
    icon: BarChart3,
    iconColor: 'text-green-400',
    highlights: [
      'Launched the "Follow the Oil" page with live TradingView price data',
      'Added interactive Key Oil Producers section with per-country breakdowns',
      'Added Strait of Hormuz blockade impact tracker with affected country details',
      'Fixed navigation overflow and layout issues across all pages',
      'Improved the breaking news marquee for seamless looping',
    ],
  },
  {
    version: '1.4',
    date: 'March 9, 2026',
    title: '24hr Report & Explore Modal',
    icon: Zap,
    iconColor: 'text-orange-400',
    highlights: [
      'Added the 24-Hour Report page — a curated summary of the last 24 hours of verified developments',
      'Launched the Explore modal for quick access to all pages with descriptions',
      'Added scroll indicators to the navigation bar for better discoverability',
      'Improved timestamp formatting and timezone consistency across the site',
    ],
  },
  {
    version: '1.3',
    date: 'March 8, 2026',
    title: 'Expanded Coverage & Data Pages',
    icon: Globe,
    iconColor: 'text-cyan-400',
    highlights: [
      'Added Follow the Statements page — track what world leaders are saying with fact-check indicators',
      'Added Follow the Damage page — interactive map of strike locations with satellite verification status',
      'Added Follow the Cost page — financial cost breakdown by country',
      'Added Follow the Munitions page — weapons tracking and inventory analysis',
      'Expanded the Death Toll tracker with multi-conflict and verification tier support',
    ],
  },
  {
    version: '1.2',
    date: 'March 7, 2026',
    title: 'Breaking News & Social Intelligence',
    icon: Sparkles,
    iconColor: 'text-purple-400',
    highlights: [
      'Launched the Breaking News banner with live scrolling ticker',
      'Added the Social / OSINT page for tracking analyst posts and social media intelligence',
      'Added the Media page comparing coverage across US left, US right, international, Israeli, and Iranian outlets',
      'Added the Government page for official statements from all sides',
      'Improved the interactive conflict map with better marker clustering',
    ],
  },
  {
    version: '1.0 – 1.1',
    date: 'March 1–6, 2026',
    title: 'Initial Launch',
    icon: MessageCircle,
    iconColor: 'text-gray-400',
    highlights: [
      'Launched The OSS Report with interactive conflict map, timeline, and event database',
      'Built core infrastructure: 24 static JSON data files updated multiple times daily',
      'Added the Escalations page tracking major turning points in the conflict',
      'Added Follow the Money page with lobbying and funding data',
      'Established data verification system: Confirmed, Likely, and Rumored status indicators',
    ],
  },
]

export default function PatchNotesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={12} />
              Home
            </Link>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              <h1 className="text-sm font-bold text-gray-200">Patch Notes</h1>
            </div>
          </div>
          <span className="text-[10px] text-blue-400 font-mono bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/50">
            usiitracker.com
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Developer Message */}
        <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircle size={16} className="text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-blue-300">A note from the developer</span>
                <span className="text-[9px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">March 2026</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                This site is currently semi-automated. The AI agents that help build and update this tracker
                are manually triggered, but I'm working toward making it fully autonomous so it can update
                frequently without manual intervention.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                This project costs money to host and takes significant time to maintain. Every data update,
                new feature, and bug fix is done by one person. If you find this tracker useful, consider
                supporting the project — it directly funds faster updates, better infrastructure, and new features.
              </p>
              <p className="text-[11px] font-semibold text-gray-400 mb-1.5">What your support enables:</p>
              <ul className="space-y-1 mb-3">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-400">Real-time automated updates (currently manual 3x/day)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-400">Push notifications for breaking escalations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-400">Better maps with satellite imagery of strike locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-400">Mobile app with offline support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-400">Historical archive with full-text search across all events</span>
                </li>
              </ul>
              <a
                href={siteMetadata.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full text-sm font-semibold text-amber-200 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 hover:border-amber-500/50 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Heart size={16} />
                Support This Project
                <ExternalLink size={12} className="ml-1 opacity-60" />
              </a>
              <p className="text-[10px] text-gray-600 text-center mt-1.5">Opens Buy Me A Coffee in a new tab</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-3">
                Thank you for being here. — Solo developer
              </p>
            </div>
          </div>
        </div>

        {/* Patch Notes Timeline */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Update History</h2>
          <div className="space-y-4">
            {PATCH_NOTES.map((patch) => {
              const Icon = patch.icon
              return (
                <div
                  key={patch.version}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-gray-800/50 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg bg-gray-800/80 flex items-center justify-center shrink-0`}>
                      <Icon size={14} className={patch.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-100">v{patch.version}</span>
                        <span className="text-[10px] text-gray-500">{patch.date}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{patch.title}</p>
                    </div>
                  </div>
                  <div className="px-5 py-3">
                    <ul className="space-y-2">
                      {patch.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-gray-600 shrink-0 mt-1.5" />
                          <span className="text-xs text-gray-400 leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bars */}
      <div className="h-8" />
    </div>
  )
}
