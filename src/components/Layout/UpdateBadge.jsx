import { Link } from 'react-router-dom'
import { Clock, RefreshCw, FileText, Heart } from 'lucide-react'
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
  const diffMs = Math.abs(now - date)

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
      <div className="bg-gray-900/80 border-t border-gray-800/50 px-4 py-1 flex items-center justify-center gap-2 shrink-0">
        <p className="text-[9px] text-gray-600 text-center">
          v{siteMetadata.version} — Built & updated daily by 1 person. Optimized for desktop, may notice bugs on mobile version. Improvements are ongoing.
        </p>
        <Link
          to="/patch-notes"
          className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/60 border border-blue-900/40 px-2 py-0.5 rounded transition-colors shrink-0"
        >
          <FileText size={9} />
          Patch Notes
        </Link>
        <a
          href={siteMetadata.donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded transition-colors shrink-0"
        >
          <Heart size={9} />
          Coffee
        </a>
      </div>
    </>
  )
}
