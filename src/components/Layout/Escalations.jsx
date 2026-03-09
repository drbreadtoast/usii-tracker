import { useState } from 'react'
import { AlertOctagon, Clock, ChevronDown, ChevronUp, ExternalLink, Flame, DollarSign, Shield, Heart } from 'lucide-react'
import escalationsData from '../../data/escalations.json'
import { formatFullTimestamp } from '../../utils/verification'
import { SEVERITY_COLORS, CATEGORY_COLORS } from '../../utils/colors'

const CATEGORY_ICONS = {
  military: Shield,
  economic: DollarSign,
  diplomatic: Flame,
  humanitarian: Heart,
}

function EscalationCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const severity = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.high
  const category = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.military
  const CategoryIcon = CATEGORY_ICONS[item.category] || Shield

  return (
    <div
      className={`border rounded-lg cursor-pointer hover:border-gray-600 transition-all ${severity.bg} border-gray-800`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-200 leading-tight flex-1">{item.title}</h3>
          {isExpanded ? (
            <ChevronUp size={14} className="text-gray-500 shrink-0 mt-0.5" />
          ) : (
            <ChevronDown size={14} className="text-gray-500 shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: `${severity.color}20`, color: severity.color }}
          >
            {severity.label}
          </span>
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
            style={{ backgroundColor: `${category.color}15`, color: category.color }}
          >
            <CategoryIcon size={10} />
            {category.label}
          </span>
          <span className="text-[10px] text-gray-500 ml-auto flex items-center gap-0.5 shrink-0">
            <Clock size={10} />
            {formatFullTimestamp(item.timestamp)}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-gray-800 space-y-2">
            <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>

            <div className="bg-amber-950/20 border border-amber-900/20 rounded p-2">
              <p className="text-[10px] text-amber-400 font-semibold">Impact</p>
              <p className="text-[10px] text-amber-300/80 mt-0.5">{item.impact}</p>
            </div>

            {item.sources && item.sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[9px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    {source.name} <ExternalLink size={8} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Escalations() {
  const sorted = [...escalationsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const criticalCount = sorted.filter(e => e.severity === 'critical').length
  const highCount = sorted.filter(e => e.severity === 'high').length

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <AlertOctagon size={14} className="text-orange-400" />
          <span className="text-sm font-semibold text-gray-300">Major Escalations</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Key events that significantly expanded the conflict
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-950/50 text-red-400 font-semibold">
            {criticalCount} Critical
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-950/50 text-orange-400 font-semibold">
            {highCount} High
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sorted.map(item => (
          <EscalationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
