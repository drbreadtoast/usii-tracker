import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, ChevronUp, ChevronDown, Newspaper } from 'lucide-react'
import breakingData from '../../data/breaking.json'
import siteMetadata from '../../data/site-metadata.json'

const PRIORITY_STYLES = {
  critical: { badge: 'bg-red-600 text-white', label: 'Critical' },
  high: { badge: 'bg-orange-500 text-white', label: 'High' },
  medium: { badge: 'bg-yellow-600 text-white', label: 'Medium' },
}

const CATEGORY_MAP = {
  'OIL': { label: '$ Economic', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/40' },
  'ECONOMIC': { label: '$ Economic', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/40' },
  'STRIKE': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'STRIKES': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'MILITIA': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'MILITARY': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'GREEN ZONE HIT': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'MILITIA CHIEF KILLED': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'PENTAGON': { label: 'Military', color: 'text-red-400 bg-red-950/40 border-red-800/40' },
  'DIPLOMATIC': { label: 'Diplomatic', color: 'text-blue-400 bg-blue-950/40 border-blue-800/40' },
  'TURKEY': { label: 'Diplomatic', color: 'text-blue-400 bg-blue-950/40 border-blue-800/40' },
  'UAE': { label: 'Diplomatic', color: 'text-blue-400 bg-blue-950/40 border-blue-800/40' },
  'ENERGY': { label: '$ Economic', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/40' },
  'INFRASTRUCTURE': { label: 'Infrastructure', color: 'text-purple-400 bg-purple-950/40 border-purple-800/40' },
  'HUMANITARIAN': { label: 'Humanitarian', color: 'text-green-400 bg-green-950/40 border-green-800/40' },
  'CYBER': { label: 'Cyber', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40' },
}

function parseBreakingText(text) {
  // Format: "CATEGORY: Description"
  const colonIdx = text.indexOf(':')
  if (colonIdx > 0 && colonIdx < 30) {
    const rawCategory = text.substring(0, colonIdx).trim()
    const description = text.substring(colonIdx + 1).trim()
    return { category: rawCategory, description }
  }
  return { category: null, description: text }
}

function getCategoryInfo(category) {
  if (!category) return { label: 'Update', color: 'text-gray-400 bg-gray-800/40 border-gray-700/40' }
  return CATEGORY_MAP[category] || { label: category, color: 'text-gray-400 bg-gray-800/40 border-gray-700/40' }
}

function formatBannerDate(eventDate, timestamp) {
  const dateStr = eventDate || timestamp
  const [datePart] = dateStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const localDate = new Date(year, month - 1, day)
  return localDate.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTimePT(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/Los_Angeles',
  }) + ' PT'
}

export default function BreakingBanner({ breakingNews }) {
  const [collapsed, setCollapsed] = useState(false)
  const data = breakingNews || breakingData
  if (!data || data.length === 0) return null

  // Filter to only events from the last 24 hours based on eventDate
  const lastUpdate = new Date(siteMetadata.lastUpdated)
  const cutoff = new Date(lastUpdate.getTime() - 24 * 60 * 60 * 1000)
  const sorted = [...data]
    .filter(item => {
      if (item.eventDate) {
        const [y, m, d] = item.eventDate.split('-').map(Number)
        return new Date(Date.UTC(y, m - 1, d, 23, 59, 59)) >= cutoff
      }
      return new Date(item.timestamp) >= cutoff
    })
    .sort((a, b) => {
      // Sort by priority first (critical > high > medium), then by timestamp
      const priorityOrder = { critical: 0, high: 1, medium: 2 }
      const pa = priorityOrder[a.priority] ?? 2
      const pb = priorityOrder[b.priority] ?? 2
      if (pa !== pb) return pa - pb
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  if (sorted.length === 0) return null

  // Pick the top item for the Quick Brief
  const topItem = sorted[0]
  const { category, description } = parseBreakingText(topItem.text)
  const categoryInfo = getCategoryInfo(category)
  const priorityStyle = PRIORITY_STYLES[topItem.priority] || PRIORITY_STYLES.medium
  const dateStr = formatBannerDate(topItem.eventDate, topItem.timestamp)
  const timeStr = formatTimePT(topItem.timestamp)

  // Build a headline from category + first sentence
  const sentences = description.split('. ')
  const headline = sentences[0].replace(/\.$/, '')
  const detail = sentences.length > 1 ? sentences.slice(1).join('. ') : null

  return (
    <div className="bg-gray-900/80 border-b border-gray-800/60 shrink-0">
      {/* Compact header bar — always visible */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Newspaper size={12} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Quick Brief</span>
          <span className="text-gray-700 shrink-0">|</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityStyle.badge} shrink-0`}>
            {priorityStyle.label}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${categoryInfo.color} shrink-0`}>
            {categoryInfo.label}
          </span>
          {/* Headline preview on collapsed */}
          {collapsed && (
            <span className="text-xs text-gray-300 truncate min-w-0">{headline}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-gray-500 hidden sm:inline">{dateStr}, {timeStr}</span>
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
            aria-label={collapsed ? 'Expand brief' : 'Collapse brief'}
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {!collapsed && (
        <div className="px-3 sm:px-4 pb-3 pt-0">
          <div className="max-w-5xl mx-auto">
            {/* Headline */}
            <h3 className="text-sm font-bold text-gray-100 leading-snug mb-1.5">
              {headline}
            </h3>

            {/* Description */}
            {detail && (
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                {detail}
              </p>
            )}

            {/* Impact box — summarize from other recent items */}
            {sorted.length > 1 && (
              <div className="bg-gray-800/40 border border-gray-700/30 rounded px-3 py-2 mb-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Impact</span>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                  {sorted.slice(1, 4).map(item => {
                    const { description: desc } = parseBreakingText(item.text)
                    // Take just first sentence
                    return desc.split('. ')[0].replace(/\.$/, '')
                  }).join('. ')}.
                </p>
              </div>
            )}

            {/* Sources + link to full report */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {topItem.sources && topItem.sources.map((src, i) => (
                  <a
                    key={i}
                    href={typeof src === 'string' ? '#' : src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {typeof src === 'string' ? src : src.name}
                    <ExternalLink size={8} />
                  </a>
                ))}
              </div>
              <Link
                to="/breaking-news"
                className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                View full 24h report ({sorted.length} items) &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
