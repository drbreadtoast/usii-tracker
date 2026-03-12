import { useState } from 'react'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-003',
    headline: 'THREAT: Iran Publishes Target List of US Tech Giant Offices — Amazon, Google, Microsoft, Nvidia, Palantir, IBM, Oracle Facilities in Israel & Gulf States Threatened',
    status: 'developing',
    lastUpdated: '2026-03-12T13:25:00Z',
    summary: 'Iran\'s Tasnim news agency, closely linked to the IRGC, has published detailed target lists of US technology company offices located in Israel and Gulf states. Companies named include Amazon, Google, Microsoft, Nvidia, Palantir, IBM, and Oracle. The IRGC declared US-Israeli "economic centres and banks" as legitimate military targets. Separately, a pro-Iran hacking group carried out the first significant cyberattack on a US company since the war began — targeting Stryker, a medical technology firm. International bank employees have begun evacuating families from Dubai.',
    officialStatus: {
      label: 'Confirmed — Multiple Sources',
      detail: 'Iran\'s Tasnim news agency published the target lists, naming Amazon, Google, Microsoft, Nvidia, Palantir, IBM, and Oracle offices across Israel and Gulf states. The IRGC formally declared US-Israeli economic infrastructure as legitimate targets. This marks a major escalation from military-to-military operations to economic and infrastructure warfare. International companies have begun reviewing security protocols for regional offices.',
      sources: [
        { name: 'Times of Israel — Iran threatens tech giants', url: 'https://www.timesofisrael.com/liveblog_entry/iran-threatens-israel-and-gulf-offices-of-us-tech-giants-amazon-google-microsoft-and-nvidia/' },
        { name: 'The Register — Infrastructure warfare', url: 'https://www.theregister.com/2026/03/11/iran_threatens_us_tech_companies/' },
        { name: 'Al Jazeera Liveblog — Day 13', url: 'https://www.aljazeera.com/news/liveblog/2026/3/12/iran-war-live-oil-tankers-hit-in-iraq-tehran-sets-3-conditions-for-peace' },
      ]
    },
    cyberAttack: {
      detail: 'A pro-Iran hacking group claimed responsibility for a cyberattack on US medical technology company Stryker — the first significant cyber operation against an American company since the war began. The attack is seen as a signal that Iran is willing to extend the conflict into cyberspace targeting US corporate infrastructure, not just military systems.',
      sources: [
        { name: 'NBC News — Iran cyberattack on Stryker', url: 'https://www.nbcnews.com/world/iran/iran-appears-conducted-significant-cyberattack-us-company-first-war-st-rcna263084' },
        { name: 'ABC News — Stryker hack confirmed', url: 'https://abcnews.com/International/pro-iran-hacking-group-claims-responsibility-cyberattack-stryker/story?id=130979414' },
      ]
    },
    context: 'Day 13 marks a significant escalation in Iran\'s strategy — expanding the war from military targets to economic infrastructure, technology companies, and cyber operations against US companies. The IRGC\'s declaration makes this the first time a state actor has formally designated US tech company offices as military targets during an active conflict. Oil prices surged to Brent $94.77 and WTI $93.24. International bank employees have begun leaving Dubai with families.'
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
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Confirmed Threat — Tech Company Target List</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.officialStatus.detail}</p>
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
