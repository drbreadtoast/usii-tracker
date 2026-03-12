import { Link } from 'react-router-dom'
import { FileText, ArrowLeft, Sparkles, Wrench, Layout, Zap, Globe, BarChart3, MessageCircle } from 'lucide-react'
import UpdateBadge from '../components/Layout/UpdateBadge'

const PATCH_NOTES = [
  {
    version: '1.9',
    date: 'March 12, 2026',
    title: 'Live Video, AI Automation & Day 13 Refresh',
    icon: Zap,
    iconColor: 'text-red-400',
    highlights: [
      'Added live video section to the home page — watch Al Jazeera\'s live stream and curated conflict clips directly on the dashboard',
      'Website is now semi-automated via AI agents (manually triggered) — working toward full autonomy for frequent live updates',
      'Full Day 13 data refresh with latest developments: Iraq oil tanker attacks, Iran\'s 3 ceasefire conditions, and more',
      'Changed "Last updated" to "Last news refresh" so it\'s clear the timestamp refers to data freshness, not code changes',
      'Note from developer: High-frequency live updates are technically possible but costly. If the site gains traction, donations could help fund truly live data and many new features',
    ],
  },
  {
    version: '1.8',
    date: 'March 11, 2026',
    title: 'Source Link Integrity & Data Refresh',
    icon: Wrench,
    iconColor: 'text-green-400',
    highlights: [
      'Fixed 46 broken source URLs across all data files — every link now points to a verified, real article',
      'Added mandatory source relevance rules to ensure every link matches the claim it supports',
      'Full Day 12 evening data refresh across all 24 data files',
      'Improved URL validation workflow to prevent broken links in future updates',
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
      'Launched USII Tracker with interactive conflict map, timeline, and event database',
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
              <p className="text-xs text-gray-300 leading-relaxed">
                This site is an evolving project, and I appreciate your patience as it grows.
                I'm a solo developer using AI-assisted tools to make this tracker possible — every page,
                every data point, and every update is reviewed and published by one person. The site will
                continue to improve over time with better data, more features, and a smoother experience.
                Thank you for being here.
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

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-8">
        <UpdateBadge />
      </footer>
    </div>
  )
}
