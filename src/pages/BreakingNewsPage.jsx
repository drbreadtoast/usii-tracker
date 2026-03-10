import { useMemo } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import { AlertTriangle, Clock, Shield, Zap, ExternalLink, Newspaper } from 'lucide-react'
import breakingData from '../data/breaking.json'
import siteMetadata from '../data/site-metadata.json'

const PRIORITY_STYLES = {
  critical: { bg: 'bg-red-950/40', border: 'border-red-800', badge: 'bg-red-600 text-white', label: 'CRITICAL' },
  high: { bg: 'bg-orange-950/30', border: 'border-orange-800', badge: 'bg-orange-600 text-white', label: 'HIGH' },
  medium: { bg: 'bg-yellow-950/30', border: 'border-yellow-800', badge: 'bg-yellow-600 text-white', label: 'MEDIUM' },
}

function formatTimeAgo(timestamp) {
  const now = new Date()
  const t = new Date(timestamp)
  const diffMs = now - t
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

function SourceBadge({ source }) {
  // Support both string format ("Reuters") and object format ({name, url})
  if (typeof source === 'string') {
    return (
      <span className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded">
        {source}
      </span>
    )
  }
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded hover:bg-blue-900/40 hover:text-blue-300 transition-colors"
    >
      {source.name} <ExternalLink size={8} />
    </a>
  )
}

export default function BreakingNewsPage() {
  const { recentItems, olderItems, cutoffTime } = useMemo(() => {
    const sorted = [...breakingData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // 24-hour window: from 24 hours before the last data update
    const lastUpdate = new Date(siteMetadata.lastUpdated)
    const cutoff = new Date(lastUpdate.getTime() - 24 * 60 * 60 * 1000)

    const recent = sorted.filter(item => new Date(item.timestamp) >= cutoff)
    const older = sorted.filter(item => new Date(item.timestamp) < cutoff)

    return { recentItems: recent, olderItems: older, cutoffTime: cutoff }
  }, [])

  const lastUpdatedPT = new Date(siteMetadata.lastUpdated).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/Los_Angeles',
  }) + ' PT'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper size={14} className="text-blue-400" />
            <h1 className="text-sm font-bold text-gray-300">24 Hour Report</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} className="text-gray-500" />
            <span>Last updated: {lastUpdatedPT}</span>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="bg-blue-950/20 border-b border-blue-900/30 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-3">
            <Zap size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-blue-400">Past 24 Hours — Conflict Developments</h2>
              <p className="text-xs text-gray-500 mt-1">
                All major developments from the Iran-Israel conflict within the past 24 hours.
                Each item is sourced from verified news outlets — click any source to verify.
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                Showing {recentItems.length} developments from the last 24 hours of coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 24-hour news items */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {recentItems.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Newspaper size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No developments in the past 24 hours.</p>
            <p className="text-xs mt-2">Check back after the next data update.</p>
          </div>
        ) : (
          recentItems.map(item => {
            const style = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium
            return (
              <div key={item.id} className={`${style.bg} ${style.border} border rounded-lg p-4 transition-colors hover:bg-gray-900/50`}>
                <div className="flex items-start gap-3">
                  <Zap size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.badge}`}>{style.label}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(item.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                          timeZone: 'America/Los_Angeles',
                        })} PT
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{item.text}</p>
                    {item.sources && item.sources.length > 0 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
                        {item.sources.map((src, i) => (
                          <SourceBadge key={i} source={src} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Older items section */}
        {olderItems.length > 0 && (
          <>
            <div className="flex items-center gap-3 pt-6 pb-2">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Older Developments</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <p className="text-[10px] text-gray-600 text-center -mt-2 mb-4">
              Previous news items beyond the 24-hour window. For full history, visit the Timeline page.
            </p>
            {olderItems.slice(0, 10).map(item => {
              const style = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium
              return (
                <div key={item.id} className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <Zap size={18} className="text-gray-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.badge} opacity-60`}>{style.label}</span>
                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(item.timestamp).toLocaleString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true,
                            timeZone: 'America/Los_Angeles',
                          })} PT
                        </span>
                        <span className="text-[10px] text-gray-700">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                      {item.sources && item.sources.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] text-gray-700 font-semibold uppercase tracking-wider">Sources:</span>
                          {item.sources.map((src, i) => (
                            <SourceBadge key={i} source={src} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">USII Tracker</span>
              <span className="text-blue-400 font-mono text-[9px]">usiitracker.com</span>
              <span>Iran-Israel Conflict Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>All items sourced from verified outlets. Click sources to verify.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
