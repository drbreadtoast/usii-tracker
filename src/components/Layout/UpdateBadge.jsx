import { Link } from 'react-router-dom'
import { Clock, RefreshCw, FileText } from 'lucide-react'
import siteMetadata from '../../data/site-metadata.json'

function formatAbsolute(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    hour12: true,
  }) + ' PT'
}

function formatLastUpdated(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date

  // Guard against future timestamps
  if (diffMs < 0) {
    return { relativeTime: 'moments ago', absolute: formatAbsolute(date) }
  }

  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  let relativeTime = ''
  if (diffMins < 1) {
    relativeTime = 'moments ago'
  } else if (diffMins < 60) {
    relativeTime = `${diffMins}m ago`
  } else if (diffHours < 24) {
    relativeTime = `${diffHours}h ago`
  } else {
    const days = Math.floor(diffHours / 24)
    relativeTime = `${days}d ago`
  }

  return { relativeTime, absolute: formatAbsolute(date) }
}

export default function UpdateBadge({ variant = 'full' }) {
  const { relativeTime, absolute } = formatLastUpdated(siteMetadata.lastUpdated)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <Clock size={10} className="text-gray-600" />
        <span>Updated {relativeTime}</span>
        <span className="text-gray-700">|</span>
        <span className="text-gray-600">{absolute}</span>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900/20 via-gray-900/90 to-blue-900/20 border-t border-blue-800/30 px-4 py-2 flex items-center justify-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="relative flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-500/40 rounded-full animate-ping absolute" />
          </div>
          <RefreshCw size={12} className="text-blue-400/80" />
          <span>Updated <span className="text-blue-300 font-semibold">{siteMetadata.updateFrequency}</span></span>
        </div>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} className="text-gray-500" />
          <span>Last news refresh: <span className="text-white font-medium" title={absolute}>{relativeTime}</span></span>
          <span className="text-gray-500 hidden sm:inline">({absolute})</span>
        </div>
      </div>
      <div className="bg-gray-900/80 border-t border-gray-800/50 px-4 py-1 flex items-center justify-center gap-2 shrink-0">
        <p className="text-[9px] text-gray-600 text-center">
          v1.9 — Semi-automated via AI agents (manually triggered). Working toward full autonomy for frequent live updates. High-frequency updates are possible but costly — if this site gains traction, donations may help fund truly live data and new features.
        </p>
        <Link
          to="/patch-notes"
          className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/60 border border-blue-900/40 px-2 py-0.5 rounded transition-colors shrink-0"
        >
          <FileText size={9} />
          Patch Notes
        </Link>
      </div>
    </>
  )
}
