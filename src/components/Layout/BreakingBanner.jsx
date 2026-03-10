import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import breakingData from '../../data/breaking.json'

export default function BreakingBanner({ breakingNews }) {
  const data = breakingNews || breakingData
  if (!data || data.length === 0) return null

  // Sort by timestamp descending, take latest items
  const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const text = sorted.map(item => item.text).join('  ///  ')

  return (
    <div className="bg-blue-950/60 border-b border-blue-900/50 overflow-hidden shrink-0">
      <div className="flex items-center">
        {/* Fixed label — clickable link to Breaking News page */}
        <Link to="/breaking-news" className="bg-blue-700 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10 hover:bg-blue-600 transition-colors cursor-pointer">
          <AlertTriangle size={12} className="text-white" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">Latest News</span>
        </Link>

        {/* Scrolling text */}
        <div className="overflow-hidden flex-1 py-1.5 group">
          <div className="animate-marquee whitespace-nowrap text-sm text-blue-200">
            {text}  ///  {text}
          </div>
        </div>
      </div>
    </div>
  )
}
