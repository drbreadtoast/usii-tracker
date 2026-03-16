import { useState } from 'react'
import { Info, X, ChevronDown, ChevronUp, ExternalLink, Bot, Link2, Heart, Clock } from 'lucide-react'
import siteMetadata from '../../data/site-metadata.json'

export default function SourcesNotice() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isDismissed) return null

  return (
    <div className="bg-blue-950/30 border-b border-blue-900/40 shrink-0">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs text-blue-300 hover:text-blue-200 transition-colors group"
        >
          <Info size={12} className="text-cyan-400" />
          <span className="font-semibold text-cyan-300 group-hover:text-cyan-200">How This Site Works & Disclaimers</span>
          <span className="text-[9px] text-cyan-600 bg-cyan-950/50 px-1.5 py-0.5 rounded-full">tap to learn more</span>
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
          {/* AI-Assisted Research */}
          <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/30 rounded-lg p-2.5">
            <Bot size={13} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-blue-200 font-semibold">AI-Assisted Research</p>
              <p className="text-[10px] text-blue-400/80 mt-1 leading-relaxed">
                This tracker uses AI to search the internet, news outlets, government sources, and social media
                to find and compile information. The site is currently semi-automated — the AI agents that help
                build and update this tracker are manually triggered by the developer. While we strive for
                accuracy, AI-gathered data may occasionally contain errors or lag behind developments.
              </p>
            </div>
          </div>

          {/* Sources & Updates */}
          <div className="flex items-start gap-2 bg-cyan-950/30 border border-cyan-900/30 rounded-lg p-2.5">
            <Clock size={13} className="text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-cyan-200 font-semibold">Sources & Update Frequency</p>
              <p className="text-[10px] text-cyan-400/80 mt-1 leading-relaxed">
                Data comes from major news agencies (Reuters, AP, AFP), OSINT analysts, government press
                releases, and verified social media accounts. Every entry is fact-checked where possible
                and marked as confirmed, likely, or rumored. News and data updates are published at least
                3 times daily (morning, afternoon, and evening PT). Our goal is true real-time news updates, but that requires
                infrastructure and resources we are still working toward.
              </p>
            </div>
          </div>

          {/* Source links note */}
          <div className="flex items-start gap-2 bg-gray-800/40 border border-gray-700/30 rounded-lg p-2.5">
            <Link2 size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-300 font-semibold">About Source Links</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                Every entry includes a link to where the information was found. Because this is a fast-moving
                conflict, news outlets sometimes update or reorganize their articles, which can make a link
                appear incorrect even though it was accurate when added. This is rare, but if a link seems
                off, a quick search for the headline should help you find the original reporting.
              </p>
            </div>
          </div>

          {/* Disclaimer + Developer */}
          <div className="bg-gray-900/50 border border-gray-800/40 rounded-lg px-3 py-2.5 space-y-2">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-400">Disclaimer:</span> This is an independent
              project not affiliated with any government, military, or news organization. All parties in
              this conflict have been known to release misleading information. We present what is publicly
              available and encourage readers to think critically and check multiple sources.
            </p>
            <div className="border-t border-gray-800/60 pt-2">
              <p className="text-[10px] text-amber-400/60 leading-relaxed">
                <span className="font-semibold text-amber-300/90">From the Developer:</span> This entire
                site is built and maintained by one person. It's not perfect, but improvements and updates
                are ongoing. Your support keeps this site ad-free and independent.
              </p>
              <a
                href={siteMetadata.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-amber-300 bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/25 hover:border-amber-500/40 px-3 py-1.5 rounded-md transition-colors"
              >
                <Heart size={10} />
                Buy Me a Coffee
                <ExternalLink size={8} className="opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
