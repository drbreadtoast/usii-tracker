import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import breakingData from '../../data/breaking.json'

export default function BreakingBanner({ breakingNews }) {
  const data = breakingNews || breakingData
  if (!data || data.length === 0) return null

  // Sort by timestamp descending, take latest items
  const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const text = sorted.map(item => item.text).join('   ///   ')
  const separator = '   ///   '

  return (
    <Link to="/breaking-news" className="block bg-blue-950/60 border-b border-blue-900/50 overflow-hidden shrink-0 hover:bg-blue-950/80 transition-colors cursor-pointer">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="bg-blue-700 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10">
          <AlertTriangle size={12} className="text-white" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">24 Hour Report</span>
        </div>

        {/* Seamless scrolling text — two identical copies for infinite loop */}
        <div className="overflow-hidden flex-1 py-1.5 group">
          <div className="marquee-track whitespace-nowrap text-sm text-blue-200">
            <span className="inline-block">{text}{separator}</span>
            <span className="inline-block">{text}{separator}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
