import { useMemo } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import { AlertTriangle, Clock, Shield, Zap } from 'lucide-react'
import breakingData from '../data/breaking.json'

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

export default function BreakingNewsPage() {
  const items = useMemo(() => {
    return [...breakingData]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Breaking News</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle size={12} className="text-red-400" />
            <span>{items.length} alerts</span>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="bg-red-950/20 border-b border-red-900/30 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-3">
            <Zap size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-red-400">Breaking News Feed</h2>
              <p className="text-xs text-gray-500 mt-1">
                Live breaking developments from the Iran-Israel conflict. Items shown here cover the past 24 hours.
                Major events graduate to the full timeline page for archival tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News items */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No breaking news in the past 24 hours.</p>
          </div>
        ) : (
          items.map(item => {
            const style = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium
            return (
              <div key={item.id} className={`${style.bg} ${style.border} border rounded-lg p-4 transition-colors hover:bg-gray-900/50`}>
                <div className="flex items-start gap-3">
                  <Zap size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.badge}`}>{style.label}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <UpdateBadge />
        <div className="px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">USII Tracker</span>
              <span>Iran-Israel Conflict Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Breaking news items are under continuous verification.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
