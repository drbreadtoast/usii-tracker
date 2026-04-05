import { Link } from 'react-router-dom'
import { ArrowLeft, Info, Database, ShieldCheck, Eye, Cpu, Heart, ExternalLink } from 'lucide-react'
import siteMetadata from '../data/site-metadata.json'
import Footer from '../components/Layout/Footer'

const STATS = [
  { label: 'Tracked Events', value: '690+' },
  { label: 'Timeline Entries', value: '611+' },
  { label: 'Missile Strikes', value: '389+' },
  { label: 'Damage Sites', value: '300+' },
  { label: 'Gov Statements', value: '383+' },
  { label: 'Fact-Check Claims', value: '77+' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
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
              <Info size={16} className="text-blue-400" />
              <h1 className="text-sm font-bold text-gray-200">About This Project</h1>
            </div>
          </div>
          <span className="text-[10px] text-red-400 font-bold">TheOSSreport.com</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Mission Statement */}
        <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5">
              <Eye size={16} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-blue-300 mb-2">Our Mission</h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                TheOSSreport.com exists to document the ongoing US-Israel-Iran conflict with neutrality,
                transparency, and rigorous sourcing. This is a public interest project — not propaganda, not
                advocacy, and not entertainment.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                In times of conflict, accurate information is critical. Governments on all sides release
                incomplete or misleading statements. Social media amplifies rumors. News coverage varies
                dramatically by outlet and region. This tracker aggregates, verifies, and organizes information
                from across the spectrum so that anyone — researchers, journalists, students, concerned citizens —
                can access a comprehensive, sourced record of events.
              </p>
            </div>
          </div>
        </div>

        {/* Project Scale */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database size={14} className="text-amber-400" />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Project Scale</h2>
            <span className="text-[9px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded ml-auto">Day {siteMetadata.conflictDay}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            This tracker maintains 24 interconnected data files updated at least 3 times daily, covering
            military events, political statements, economic impact, casualty tracking, media perspectives,
            and more across 15+ specialized pages.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                <div className="text-sm font-bold text-gray-200">{stat.value}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={14} className="text-green-400" />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Methodology</h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Every piece of information on this site goes through a structured verification process:
          </p>
          <div className="space-y-3">
            <div>
              <h3 className="text-[11px] font-semibold text-gray-300 mb-1">Data Sources</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We draw from major wire services (Reuters, AP, AFP), regional outlets (Times of Israel,
                Al Jazeera, Tehran Times), OSINT analysts, government press releases, UN agencies,
                and verified social media accounts. Every entry includes clickable source links for
                independent verification.
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-300 mb-1">Verification Tiers</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                All data carries one of three verification statuses:
              </p>
              <div className="space-y-1.5 ml-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="text-xs text-gray-400"><span className="text-green-400 font-semibold">Confirmed</span> — Corroborated by 2+ independent sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="text-xs text-gray-400"><span className="text-amber-400 font-semibold">Likely</span> — Reported by credible sources, not yet fully corroborated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500/80" />
                  <span className="text-xs text-gray-400"><span className="text-purple-400 font-semibold">Rumored</span> — Based on limited or unverified reports, clearly labeled</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-300 mb-1">Fact-Checking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                A dedicated Fact Check page monitors trending claims, debunks misinformation, and tracks
                the verification status of disputed events. Each claim carries a verdict with supporting evidence.
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-300 mb-1">Update Process</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Data is refreshed at least 3 times daily (morning, afternoon, and evening PT). Research is
                assisted by AI tools that search and aggregate sources, with all content subject to human
                editorial review before publication. AI is a research tool — editorial judgment and verification
                remain human responsibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Standards */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Editorial Standards</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            This site is built on the principle that conflict documentation serves the public interest.
            We adhere to the following standards:
          </p>
          <ul className="space-y-2 ml-1">
            {[
              'Strict neutrality — We do not take sides. All parties to the conflict are documented with equal rigor and scrutiny.',
              'No graphic content — We do not publish graphic imagery, videos of violence, or gratuitous descriptions of injuries or death.',
              'No glorification of violence — Content is presented for informational, educational, and historical purposes only.',
              'No exploitation — This site exists to inform, not to sensationalize or profit from human suffering. Casualty data is presented as sourced statistics for accountability and historical record.',
              'Transparent corrections — When information is updated or corrected, we note the change. We do not silently alter the record.',
              'Source accountability — Every claim has at least one source link. Major claims require 2+ independent sources.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-green-500/60 shrink-0 mt-1.5" />
                <span className="text-xs text-gray-400 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* About the Creator */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">About the Creator</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            This entire project is built and maintained by one person. It started on Day 1 of the conflict
            as a personal attempt to track events in an organized, verifiable way — and grew into a
            comprehensive public resource.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            This is not a company, newsroom, or funded operation. It is an independent project driven by
            the belief that accessible, transparent information matters — especially during war.
          </p>
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
        </div>

        {/* Legal Links */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Legal</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/privacy" className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Terms of Service</Link>
            <Link to="/fact-check" className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Fact Check</Link>
            <Link to="/patch-notes" className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Patch Notes</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
