import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-007',
    headline: 'Israel Kills Ali Larijani, Senior Iranian Leader — Iran Vows "Crushing Response"',
    status: 'confirmed',
    lastUpdated: '2026-03-17T13:19:00Z',
    summary: 'Israel confirmed the targeted killing of Ali Larijani, former Speaker of Iran\'s Parliament and senior adviser to Supreme Leader Mojtaba Khamenei. Iran\'s Parliament Speaker Qalibaf called it a "war crime." Basij paramilitary leadership also eliminated. Cluster missiles hit central Israel.',
    officialStatus: {
      label: 'Impact — Major Escalation on Day 18',
      detail: 'Israel expands targeting from military to political leadership.\n\nAli Larijani, one of Iran\'s most powerful political figures, was killed in a precision Israeli airstrike in Tehran. Defense Minister Katz stated: "No one in the regime is beyond our reach."\n\nLarijani served as Speaker of Parliament (2008-2020) and was a key adviser to Supreme Leader Mojtaba Khamenei. His killing marks the highest-profile political assassination since the war began.\n\nSimultaneously, Israel eliminated senior Basij paramilitary commanders in Tehran. IDF ground forces advanced into southern Lebanon (Khiam). Iranian cluster munitions hit 10+ locations in central Israel including Rishon LeZion.\n\nUS airstrikes on Arak killed 14 civilians. Fujairah oil zone struck for the 3rd consecutive day. Pope Leo XIV made urgent ceasefire appeal. David Sacks (White House AI Czar) publicly called for an "off-ramp."',
      sources: [
        { name: 'Times of Israel', url: 'https://www.timesofisrael.com/liveblog-march-16-2026/' },
        { name: 'Al Jazeera', url: 'https://www.aljazeera.com/news/2026/3/17/iran-vows-retaliation-larijani-killing' },
      ]
    },
    cyberAttack: null,
    context: 'Day 18 of the Iran-Israel war marks a significant escalation with Israel targeting Iran\'s political establishment directly. The Larijani killing follows the elimination of the original Supreme Leader Khamenei on Day 1 (Feb 28). The Strait of Hormuz remains effectively closed (Day 15 of blockade). Oil at $100.21/barrel. US gas at $3.72/gallon. Death toll: Iran 5,844, Israel 12, US 13, Lebanon 886. EU rejects military involvement in Hormuz. G5 nations warn Israel against Lebanon escalation.'
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
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles', hour12: true
  }) + ' PT'

  return (
    <div className="border-b border-red-900/30 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-950/40 transition-colors"
      >
        <StatusBadge status={alert.status} />
        {/* Scrolling headline */}
        <div className="flex-1 min-w-0 overflow-hidden group">
          <div className="marquee-track whitespace-nowrap text-xs text-red-100 font-medium">
            <span className="inline-block">{alert.headline}&nbsp;&nbsp;&nbsp;</span>
            <span className="inline-block">{alert.headline}&nbsp;&nbsp;&nbsp;</span>
          </div>
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

          {/* Official Status — Tech Threat */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">{alert.officialStatus.label}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{alert.officialStatus.detail}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {alert.officialStatus.sources.map((s, i) => (
                <SourceLink key={i} name={s.name} url={s.url} />
              ))}
            </div>
          </div>

          {/* Cyber Attack */}
          {alert.cyberAttack && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">First Cyber Attack on US Company</p>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.cyberAttack.detail}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {alert.cyberAttack.sources.map((s, i) => (
                  <SourceLink key={i} name={s.name} url={s.url} />
                ))}
              </div>
            </div>
          )}

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
          <Link to="/breaking-news" className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded hover:bg-red-500 transition-colors">
            <AlertTriangle size={10} className="text-white animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Breaking News</span>
          </Link>
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
