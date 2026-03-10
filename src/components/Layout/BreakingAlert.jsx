import { useState } from 'react'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-001',
    headline: 'Reports Claim Netanyahu\'s Brother Iddo Killed by Iranian Missile — DEBUNKED',
    status: 'debunked',
    lastUpdated: '2026-03-10T14:00:00Z',
    summary: 'Viral social media claims that Iddo Netanyahu (Benjamin Netanyahu\'s younger brother) was killed by an Iranian missile strike on the Netanyahu family residence have been debunked by multiple fact-checking organizations. The viral video used as "evidence" has been traced to an unrelated house fire in Galloway, New Jersey on February 9, 2026 — weeks before the conflict began. No credible news organization has confirmed the claim. Netanyahu\'s office has dismissed it as "deliberate disinformation."',
    officialStatus: {
      label: 'Debunked — False',
      detail: 'Netanyahu\'s office called reports "deliberate disinformation." No credible news outlet has confirmed any harm to Iddo Netanyahu. Multiple fact-checkers traced viral video to a New Jersey house fire from February 9, 2026.',
      sources: [
        { name: 'Lead Stories Fact Check', url: 'https://leadstories.com/hoax-alert/2026/03/fact-check-video-of-house-fire-predates-2026-war-between-us-israel-and-iran.html' },
        { name: 'Yahoo News Fact Check', url: 'https://www.yahoo.com/news/articles/fact-check-video-purporting-show-013744721.html' },
        { name: 'Jerusalem Post — Iranian disinfo campaign', url: 'https://www.jpost.com/middle-east/iran-news/article-889415' },
        { name: 'Deccan Chronicle Fact Check', url: 'https://www.deccanchronicle.com/world/fact-check-social-media-rumours-about-iddo-netanyahus-death-ben-gvir-injury-unverified-1942759' },
      ]
    },
    socialMediaClaims: {
      detail: 'The claim originated from Scott Ritter (former UN weapons inspector) on an RT-affiliated program, then spread virally on X/Twitter. A video purporting to show the Netanyahu house on fire was identified as footage from an unrelated house fire in New Jersey. Iran\'s IRGC-affiliated Tasnim News Agency amplified the claims but even they acknowledged it was unconfirmed.',
      sources: [
        { name: 'Egypt Independent — Netanyahu office debunks rumors', url: 'https://www.egyptindependent.com/netanyahus-office-releases-meeting-footage-debunking-assassination-rumors/' },
        { name: 'NewsX — Truth behind viral claims', url: 'https://www.newsx.com/world/israel-iran-us-conflict-war-live-benjamin-netanyahu-killed-in-iran-strike-israeli-pm-ben-gvir-netanyahu-brother-iddo-netanyahu-injured-killed-180178/' },
        { name: 'Defence Security Asia — Viral missile claims', url: 'https://defencesecurityasia.com/en/iran-missile-strike-netanyahu-home-claims-israel-leadership-iran-israel-conflict/' },
        { name: 'The Week — Iran state media speculates', url: 'https://www.theweek.in/news/middle-east/2026/03/10/netanyahu-wounded-irans-state-media-speculates-about-israeli-pms-health.html' },
      ]
    },
    context: 'Iddo Netanyahu (born 1952) is Benjamin Netanyahu\'s younger brother — a physician and playwright living in Jerusalem. Their eldest brother Yonatan ("Yoni") Netanyahu was killed leading the 1976 Entebbe rescue operation. This false claim is part of a documented pattern of Iranian information warfare during the conflict, which has also included false claims about Netanyahu being assassinated, fleeing the country, and other senior officials being targeted.'
  }
]

function StatusBadge({ status }) {
  if (status === 'debunked') return (
    <span className="inline-flex items-center gap-1 bg-red-900/60 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <XCircle size={10} /> DEBUNKED
    </span>
  )
  if (status === 'confirmed') return (
    <span className="inline-flex items-center gap-1 bg-green-900/60 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <CheckCircle size={10} /> CONFIRMED
    </span>
  )
  if (status === 'developing') return (
    <span className="inline-flex items-center gap-1 bg-yellow-900/60 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
      <Clock size={10} /> DEVELOPING
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 bg-gray-700/60 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <HelpCircle size={10} /> UNCONFIRMED
    </span>
  )
}

function SourceLink({ name, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
    >
      {name} <ExternalLink size={8} />
    </a>
  )
}

function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false)
  const updatedDate = new Date(alert.lastUpdated)
  const timeStr = updatedDate.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: true
  }) + ' UTC'

  return (
    <div className="border-b border-red-900/30 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-950/40 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <StatusBadge status={alert.status} />
          <span className="text-xs text-red-100 font-medium truncate">{alert.headline}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-[9px] text-gray-500 hidden sm:inline">Updated: {timeStr}</span>
          {expanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Summary */}
          <p className="text-[11px] text-gray-300 leading-relaxed">{alert.summary}</p>

          {/* Last updated timestamp */}
          <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
            <Clock size={9} />
            <span>Research last updated: {timeStr}</span>
          </div>

          {/* Official Status */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1">Official Status & Fact-Checks</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.officialStatus.detail}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {alert.officialStatus.sources.map((s, i) => (
                <SourceLink key={i} name={s.name} url={s.url} />
              ))}
            </div>
          </div>

          {/* Social Media Claims */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">Social Media & Iranian State Media Claims</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.socialMediaClaims.detail}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {alert.socialMediaClaims.sources.map((s, i) => (
                <SourceLink key={i} name={s.name} url={s.url} />
              ))}
            </div>
          </div>

          {/* Context */}
          {alert.context && (
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Context</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">{alert.context}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BreakingAlert() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || BREAKING_ALERTS.length === 0) return null

  return (
    <div className="bg-red-950/70 border-b border-red-800/60 shrink-0">
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded">
            <AlertTriangle size={10} className="text-white animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Breaking News</span>
          </div>
          <span className="text-[10px] text-red-300/70">Click to expand for full research & sources</span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-red-800 hover:text-red-400 transition-colors"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
      {BREAKING_ALERTS.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
