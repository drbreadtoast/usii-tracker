import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-008',
    headline: 'NCTC Director Joe Kent Resigns — Russia Arming Iran — Trump Threatens NATO — Missiles Hit Jerusalem Holy Sites',
    status: 'confirmed',
    lastUpdated: '2026-03-17T21:52:00Z',
    summary: 'Day 18 afternoon: NCTC Director Joe Kent quit over the war, calling Iran "no imminent threat." WSJ reports Russia sharing satellite imagery and drone tech with Iran. Trump threatens to leave NATO after allies refuse Hormuz mission. Missile fragments hit Temple Mount and Holy Sepulchre. Iran deploys new Haj Qasem missile. Shah gas field ablaze.',
    officialStatus: {
      label: 'Impact — Multiple Critical Escalations on Day 18',
      detail: 'Joe Kent, Director of the National Counterterrorism Center, resigned — the highest-profile Trump official to quit. His resignation letter stated Iran "posed no imminent threat" and blamed "pressure from Israel and its powerful American lobby." Trump called him "very weak on security."\n\nWSJ reports Russia is sharing satellite imagery of US force locations and improved Shahed drone components with Iran, drawing on Ukraine warfare experience.\n\nTrump said leaving NATO is "something to think about" after Germany, UK, France, Japan, Italy, and Australia all refused to join a Hormuz escort coalition.\n\nMissile fragments hit Jerusalem\'s Temple Mount/Al-Aqsa, Church of the Holy Sepulchre, and Armenian Quarter. Iran deployed the Haj Qasem ballistic missile (1,400km range, MaRV-equipped) for the first time.\n\nIran struck UAE\'s Shah gas field (20% of UAE gas supply), setting it ablaze. Fujairah hit for the 3rd time in 4 days. Oil surged to $103.50. USS Gerald Ford heading to Crete for fire repairs.',
      sources: [
        { name: 'NPR', url: 'https://www.npr.org/2026/03/17/nx-s1-5750426/joe-kent-counterterrorism-official-resigns-trump' },
        { name: 'US News / WSJ', url: 'https://www.usnews.com/news/world/articles/2026-03-17/russia-is-sharing-satellite-imagery-and-drone-technology-with-iran-wsj-reports' },
        { name: 'Time', url: 'https://time.com/article/2026/03/17/trump-iran-war-nato-allies-strait-of-hormuz/' },
        { name: 'Times of Israel', url: 'https://www.timesofisrael.com/iranian-missile-warhead-fell-less-than-a-kilometer-from-temple-mount-al-aqsa-mosque/' },
      ]
    },
    cyberAttack: null,
    context: 'Day 18 afternoon of the Iran-Israel war saw multiple critical escalations. The Strait of Hormuz remains effectively closed (Day 15 of blockade). Brent crude at $103.50/barrel. US gas at $3.79/gallon. Iran death toll: 2,477 confirmed (1,351 civilian, 1,126 military). Israel: 15 killed. US: 13 killed. Lebanon: 912 killed. Witkoff-Araghchi back-channel reactivated. Kuwait arrested 16-member Hezbollah cell. IDF 36th Division expanding Lebanon buffer zone.'
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
