import { useState, useEffect } from 'react'
import { Clock, Heart, RefreshCw } from 'lucide-react'
import siteMetadata from '../../data/site-metadata.json'

function formatRefreshTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = Math.abs(now - date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  let relative = ''
  if (diffMins < 1) relative = 'moments ago'
  else if (diffMins < 60) relative = `${diffMins}m ago`
  else if (diffHours < 24) relative = `${diffHours}h ago`
  else relative = `${Math.floor(diffHours / 24)}d ago`

  const absolute = date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Los_Angeles', hour12: true,
  }) + ' Pacific Time'

  return { relative, absolute }
}

const TIMEZONES = [
  { label: 'Jerusalem', abbr: 'IST', tz: 'Asia/Jerusalem', flag: '🇮🇱' },
  { label: 'Tehran', abbr: 'IRST', tz: 'Asia/Tehran', flag: '🇮🇷' },
  { label: 'Washington', abbr: 'ET', tz: 'America/New_York', flag: '🇺🇸' },
  { label: 'Beirut', abbr: 'EET', tz: 'Asia/Beirut', flag: '🇱🇧' },
  { label: 'Moscow', abbr: 'MSK', tz: 'Europe/Moscow', flag: '🇷🇺' },
  { label: 'Beijing', abbr: 'CST', tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { label: 'San Francisco', abbr: 'PT', tz: 'America/Los_Angeles', flag: '🇺🇸' },
]

export default function WorldClocks() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center bg-gray-900/50 border-b border-gray-800/50">
      <div className="flex items-center gap-3 px-3 py-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        <Clock size={12} className="text-gray-600 shrink-0" />
        {TIMEZONES.map(({ label, abbr, tz, flag }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs shrink-0">
            <span>{flag}</span>
            <span className="text-gray-500">{label}</span>
            <span className="font-mono text-gray-300">
              {time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: tz,
              })}
            </span>
            <span className="text-gray-600 text-[10px]">{abbr}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0 mr-3">
        {/* Refresh timestamp */}
        <div className="flex flex-col items-end shrink-0">
          <p className="text-[8px] text-gray-600 leading-tight hidden sm:block">Updated at least 3x daily — morning, afternoon & evening Pacific Time</p>
          <div className="flex items-center gap-1.5">
            <RefreshCw size={10} className="text-blue-400 shrink-0" />
            <span className="text-[11px] text-white font-semibold">Last news refresh: {formatRefreshTime(siteMetadata.lastUpdated).relative}</span>
            <span className="text-[10px] text-gray-400 hidden md:inline">({formatRefreshTime(siteMetadata.lastUpdated).absolute})</span>
          </div>
        </div>
        <span className="text-gray-700">|</span>
        <a
          href={siteMetadata.donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded transition-colors shrink-0"
        >
          <Heart size={10} />
          <span className="hidden sm:inline">Buy Me a</span> Coffee
        </a>
      </div>
    </div>
  )
}
