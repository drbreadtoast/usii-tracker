import { useState } from 'react'
import { Radio, ChevronDown, CheckCircle, XCircle, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import developingStories from '../../data/developing-stories.json'

export default function DevelopingBanner() {
  const [expanded, setExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})

  if (!developingStories || developingStories.length === 0) return null
  const story = developingStories[0]

  const toggleSection = (sIdx) => {
    setExpandedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }))
  }

  const statusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={10} className="text-green-400 shrink-0" />
      case 'debunked': return <XCircle size={10} className="text-red-400 shrink-0" />
      case 'likely': return <HelpCircle size={10} className="text-yellow-400 shrink-0" />
      default: return <HelpCircle size={10} className="text-gray-400 shrink-0" />
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'debunked': return 'text-red-400'
      case 'likely': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="bg-red-950/60 border-b border-red-900/50 shrink-0">
      {/* Top bar — red scrolling ticker like the blue 24hr report */}
      <div
        className="flex items-center cursor-pointer hover:bg-red-950/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Fixed label */}
        <div className="bg-red-700 px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10">
          <Radio size={12} className="text-white animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">Developing</span>
        </div>

        {/* Seamless scrolling text — two identical copies for infinite loop */}
        <div className="overflow-hidden flex-1 py-1.5 group">
          <div className="marquee-track whitespace-nowrap text-sm text-red-200">
            <span className="inline-block">{story.tickerText}{'   ///   '}</span>
            <span className="inline-block">{story.tickerText}{'   ///   '}</span>
          </div>
        </div>

        {/* Expand arrow */}
        <div className="px-3 shrink-0">
          <ChevronDown size={14} className={`text-red-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expandable breakdown panel */}
      {expanded && (
        <div className="border-t border-red-900/40 bg-gray-950/95 max-h-[70vh] overflow-y-auto">
          {/* Summary */}
          <div className="px-4 py-3 border-b border-gray-800/60">
            <p className="text-[11px] text-gray-300 leading-relaxed">{story.summary}</p>
            <p className="text-[9px] text-gray-600 mt-1.5">
              Last updated: {new Date(story.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
            </p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-gray-800/40">
            {story.sections.map((section, sIdx) => {
              const sectionOpen = expandedSections[sIdx] !== false
              return (
                <div key={sIdx}>
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-900/40 hover:bg-gray-800/40 transition-colors cursor-pointer text-left"
                  >
                    {statusIcon(section.status)}
                    <span className="text-[10px] font-bold text-gray-200 flex-1">{section.title}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${statusColor(section.status)}`}>
                      {section.status}
                    </span>
                    <ChevronDown size={12} className={`text-gray-500 shrink-0 transition-transform duration-200 ${sectionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {sectionOpen && (
                    <div className="px-4 py-2 space-y-2.5">
                      {section.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-gray-800/30 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[11px] font-semibold text-gray-200 leading-snug flex-1">{item.label}</p>
                            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.value === 'DEBUNKED' ? 'bg-red-900/50 text-red-300' :
                              item.value === 'CONFIRMED' ? 'bg-green-900/50 text-green-300' :
                              item.value === 'UNVERIFIED' ? 'bg-yellow-900/50 text-yellow-300' :
                              'bg-gray-800 text-gray-300'
                            }`}>
                              {item.value}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed mt-1.5">{item.detail}</p>
                          {item.source && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <ExternalLink size={8} className="text-blue-400 shrink-0" />
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors truncate"
                              >
                                {item.source}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Disclaimer */}
            <div className="px-4 py-3 bg-gray-900/30">
              <div className="flex items-start gap-1.5">
                <AlertTriangle size={10} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-amber-300/80 leading-relaxed">
                  <strong className="text-amber-200">This is an active developing story.</strong> IRGC claims about sinking US ships have been systematically debunked. Viral videos have been traced to video game footage. Independent verification is limited by operational security restrictions and Iran's internet blackout (~4% connectivity).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
