import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function BreakingBanner({ breakingNews }) {
  if (!breakingNews || breakingNews.length === 0) return null

  // Sort by timestamp descending, take latest items
  const sorted = [...breakingNews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const text = sorted.map(item => item.text).join('  ///  ')

  return (
    <div className="bg-red-950/60 border-b border-red-900/50 overflow-hidden shrink-0">
      <div className="flex items-center">
        {/* Fixed label — clickable link to Breaking News page */}
        <Link to="/breaking-news" className="bg-red-600 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10 hover:bg-red-500 transition-colors cursor-pointer">
          <AlertTriangle size={12} className="text-white" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">Breaking</span>
        </Link>

        {/* Scrolling text */}
        <div className="overflow-hidden flex-1 py-1.5 group">
          <div className="animate-marquee whitespace-nowrap text-sm text-red-200">
            {text}  ///  {text}
          </div>
        </div>
      </div>
    </div>
  )
}
