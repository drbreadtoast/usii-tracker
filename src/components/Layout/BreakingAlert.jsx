import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-009',
    headline: 'IRAN STRIKES DIMONA: Missile hits Israel\'s nuclear city — 47 injured, air defense fails. IAEA: no facility damage.',
    status: 'confirmed',
    lastUpdated: '2026-03-22T03:14:00Z',
    summary: 'An Iranian ballistic missile scored a direct hit on Dimona, the southern Israeli city adjacent to the Negev Nuclear Research Center, on Day 22 of the war. 47 people were hospitalized, including a 12-year-old boy in serious condition. A three-story building collapsed; 12 distinct impact sites confirmed across the city. Israeli air defense systems (Arrow and David\'s Sling) failed to intercept — the IDF has opened a formal probe. The IAEA confirmed no damage to the nuclear research facility itself and no abnormal radiation levels detected.',
    officialStatus: {
      label: 'Confirmed — Iran\'s First Strike on Israel\'s Nuclear City',
      detail: 'An Iranian ballistic missile struck residential areas of Dimona, located approximately 10 km from Israel\'s Negev Nuclear Research Center — the country\'s only nuclear facility.\n\nMagen David Adom (MDA) confirmed 47 casualties: at least 1 serious (a 12-year-old boy with shrapnel wounds), multiple moderate, and the rest light injuries. A three-storey building collapsed and 12 separate impact sites were identified across the city.\n\nIsraeli air defense systems — Arrow and David\'s Sling — were activated but failed to intercept the incoming missile. The IDF described the weapon as "not a special or unfamiliar type," making the interception failure significant. IDF has formally opened an investigation.\n\nThe IAEA stated it was "closely monitoring" the situation and confirmed no increase in off-site radiation levels and no damage to the Negev Nuclear Research Center itself.\n\nThe strike followed Iran\'s IRBM attack on Diego Garcia and a simultaneous direct hit on the city of Arad (74 injured, also with interception failure). Trump subsequently issued a 48-hour ultimatum demanding Iran fully open the Strait of Hormuz or face strikes on Iran\'s power plants.',
      sources: [
        { name: 'Euronews', url: 'https://www.euronews.com/2026/03/21/at-least-40-injured-after-iranian-missile-strikes-israeli-town-home-to-nuclear-facility' },
        { name: 'Times of Israel', url: 'https://www.timesofisrael.com/liveblog_entry/idf-investigating-its-failure-to-intercept-iranian-ballistic-missile-that-hit-dimona/' },
        { name: 'Al Jazeera', url: 'https://www.aljazeera.com/news/2026/3/21/iran-strikes-towns-near-israels-nuclear-site-in-escalating-tit-for-tat' },
        { name: 'PBS NewsHour', url: 'https://www.pbs.org/newshour/world/dozens-injured-in-israel-after-iranian-missile-strikes-target-two-areas-near-main-nuclear-research-center' },
      ]
    },
    cyberAttack: null,
    context: 'Day 22 of the Iran-Israel war. Also on Day 22: Iran struck Arad (74 injured, second simultaneous interception failure), Rishon Lezion hit with cluster munitions (empty daycare), US struck Natanz again, IDF hit Malek-Ashtar nuclear R&D facility in Tehran. Trump issued a 48-hour Hormuz ultimatum threatening Iran\'s power plants. IDF Chief Zamir said campaign is at "halfway stage" with 3 more weeks planned. Strait of Hormuz blockade Day 20. Oil at $112/barrel. US gas at $3.925/gallon.'
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
