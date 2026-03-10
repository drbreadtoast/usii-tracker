import { useState } from 'react'
import { Info, X, ChevronDown, ChevronUp, ExternalLink, Bot, Link2, Search } from 'lucide-react'

export default function SourcesNotice() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isDismissed) return null

  return (
    <div className="bg-blue-950/30 border-b border-blue-900/40 shrink-0">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs text-blue-300 hover:text-blue-200 transition-colors"
        >
          <Info size={12} />
          <span className="font-semibold">About Our Sources & Data</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-blue-800 hover:text-blue-400 transition-colors"
          title="Dismiss for this session"
        >
          <X size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-2.5 space-y-2">
          {/* AI-powered research notice */}
          <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/30 rounded-lg p-2.5">
            <Bot size={13} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-blue-200 font-semibold">AI-Assisted Research</p>
              <p className="text-[10px] text-blue-400/80 mt-1 leading-relaxed">
                This tracker uses AI to search the internet, news outlets, government sources, and social media
                to find and compile information. While we strive for accuracy, AI-gathered data may occasionally
                contain errors or lag behind real-time developments. Always verify critical information through
                official channels.
              </p>
            </div>
          </div>

          {/* Source verification notice */}
          <div className="flex items-start gap-2 bg-cyan-950/30 border border-cyan-900/30 rounded-lg p-2.5">
            <Link2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-cyan-200 font-semibold">Verify Information Yourself</p>
              <p className="text-[10px] text-cyan-400/80 mt-1 leading-relaxed">
                Source links are provided to help you verify the information independently. Some links point
                to institutional pages, news organizations, or government websites that publish relevant analyses.
                Specific details may require navigation within those sites. We encourage you to cross-reference
                information across multiple sources before drawing conclusions.
              </p>
            </div>
          </div>

          {/* How we work notice */}
          <div className="flex items-start gap-2 bg-gray-800/40 border border-gray-700/30 rounded-lg p-2.5">
            <Search size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-300 font-semibold">How We Gather Information</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                Data is collected from major news agencies (Reuters, AP, AFP), OSINT analysts, government
                press releases, military communiques, social media posts from verified accounts, and domain-specific
                tracking services. Updates are made 1-3 times daily. All information is fact-checked where possible,
                and verification status is marked on every entry (confirmed, likely, or rumored).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
