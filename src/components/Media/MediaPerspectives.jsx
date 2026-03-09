import { useState } from 'react'
import { Newspaper, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import mediaData from '../../data/media-perspectives.json'
import { formatFullTimestamp } from '../../utils/verification'

function OutletCard({ outlet }) {
  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-200">{outlet.name}</span>
        <span className="text-[10px] text-gray-500">{formatFullTimestamp(outlet.timestamp)}</span>
      </div>
      <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-medium">&ldquo;{outlet.headline}&rdquo;</p>
      {outlet.summary && (
        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{outlet.summary}</p>
      )}
      {outlet.url && (
        <a
          href={outlet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 hover:text-blue-300 mt-1.5 transition-colors"
        >
          Visit source <ExternalLink size={8} />
        </a>
      )}
    </div>
  )
}

function CategorySection({ category }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-1 py-1.5 hover:bg-gray-800/30 rounded transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
          <span className="text-xs font-bold text-gray-300">{category.label}</span>
          <span className="text-[10px] text-gray-600">{category.outlets.length} outlets</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={12} className="text-gray-500" />
        ) : (
          <ChevronDown size={12} className="text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="space-y-1.5 pl-4">
          {category.outlets.map((outlet, i) => (
            <OutletCard key={i} outlet={outlet} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MediaPerspectives() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <Newspaper size={14} className="text-purple-400" />
          <span className="text-sm font-semibold text-gray-300">Media Perspectives</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Compare how different media outlets cover the conflict. Read all sides and decide for yourself.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {mediaData.categories.map(cat => (
          <CategorySection key={cat.id} category={cat} />
        ))}
        <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-2 mt-2">
          <p className="text-[9px] text-gray-600 italic text-center">
            Headlines curated from each outlet's coverage of the conflict. Visit source links for full articles.
            Different outlets may frame the same events differently — compare perspectives to form your own view.
          </p>
        </div>
      </div>
    </div>
  )
}
