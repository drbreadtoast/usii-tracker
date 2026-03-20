import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-008',
    headline: 'FIRST HOSTILE HIT: US F-35 Struck by Suspected Iranian Fire — Emergency Landing, Pilot Stable',
    status: 'confirmed',
    lastUpdated: '2026-03-19T22:00:00Z',
    summary: 'A US F-35 stealth fighter was hit by suspected Iranian fire during a combat mission over Iran, forcing an emergency landing at a US air base in the Middle East. The pilot is in stable condition. CENTCOM confirmed the emergency landing but declined to confirm the cause. The IRGC claimed responsibility. This is the first time Iran has hit a US aircraft in the war — and the first confirmed hostile hit on an F-35 in combat history.',
    officialStatus: {
      label: 'Impact — First Hostile F-35 Hit in History',
      detail: 'A US F-35 stealth fighter jet made an emergency landing after being struck during a combat mission over Iran on Day 20 of the conflict.\n\nCENTCOM spokesperson Capt. Tim Hawkins confirmed the aircraft was "flying a combat mission over Iran" and landed safely. The pilot is in stable condition.\n\nThe IRGC issued a statement claiming it targeted the US aircraft. CENTCOM declined to confirm whether the damage was caused by Iranian fire.\n\nThis is historic: no F-35 has ever been confirmed struck by enemy fire in combat since the aircraft entered service in 2015. The F-35 costs upward of $100 million per unit. Both the US and Israel fly F-35s in this conflict.\n\nOther US aircraft losses in the war include 3 F-15s downed by Kuwaiti friendly fire, a KC-135 crash in Iraq killing 6 airmen, and ~12 MQ-9 Reaper drones lost. Total US KIA: 13, with ~200 wounded.',
      sources: [
        { name: 'CNN', url: 'https://www.cnn.com/2026/03/19/politics/f-35-damage-iran-war' },
        { name: 'Al Jazeera', url: 'https://www.aljazeera.com/news/2026/3/19/us-f-35-aircraft-makes-emergency-landing-after-a-combat-mission-over-iran' },
        { name: 'Military Times', url: 'https://www.militarytimes.com/news/your-military/2026/03/19/us-f-35-forced-to-make-emergency-landing-after-iran-combat-mission/' },
        { name: 'The Jerusalem Post', url: 'https://www.jpost.com/middle-east/iran-news/article-890587' },
      ]
    },
    cyberAttack: null,
    context: 'Day 20 of the Iran-Israel war. The F-35 incident challenges US claims of uncontested air superiority over Iran. The Strait of Hormuz remains effectively closed (Day 17 of blockade). Oil at $108.65/barrel. US gas at $3.88/gallon. Total war costs: $144.94B. Death toll: Iran 5,332 confirmed, Israel 23, US 13 KIA, Lebanon 1,031. Hegseth announced the "largest strike package" of the war. Qatar expelled Iranian diplomats. A 7-nation Hormuz coalition is forming.'
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
