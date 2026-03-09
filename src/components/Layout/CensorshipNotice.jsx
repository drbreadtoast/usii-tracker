import { useState } from 'react'
import { AlertTriangle, X, ChevronDown, ChevronUp, Ban, EyeOff, ExternalLink } from 'lucide-react'

export default function CensorshipNotice() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isDismissed) return null

  return (
    <div className="bg-amber-950/40 border-b border-amber-900/50 shrink-0">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 transition-colors"
        >
          <AlertTriangle size={12} />
          <span className="font-semibold">⚠ Reporting Accuracy Notices</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-700 hover:text-amber-400 transition-colors"
          title="Dismiss for this session"
        >
          <X size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-2.5 space-y-2">
          {/* Israel censorship notice */}
          <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-900/30 rounded-lg p-2.5">
            <Ban size={13} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-amber-200 font-semibold">Israeli Military Censorship in Effect</p>
              <p className="text-[10px] text-amber-400/80 mt-1 leading-relaxed">
                Israel has imposed strict military censorship on reporting, filming, and broadcasting
                the aftermath of Iranian missile and drone strikes on Israeli territory. Media outlets operating
                in Israel are subject to these restrictions under Emergency Regulations, which can significantly
                affect the accuracy and completeness of reporting on damage and casualties inside Israel.
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <a
                  href="https://cpj.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[9px] text-amber-500 hover:text-amber-300 transition-colors"
                >
                  Source: Committee to Protect Journalists <ExternalLink size={8} />
                </a>
                <a
                  href="https://rsf.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[9px] text-amber-500 hover:text-amber-300 transition-colors"
                >
                  Reporters Without Borders <ExternalLink size={8} />
                </a>
              </div>
            </div>
          </div>

          {/* Shadow ban / demonetization notice */}
          <div className="flex items-start gap-2 bg-purple-950/30 border border-purple-900/30 rounded-lg p-2.5">
            <EyeOff size={13} className="text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-purple-200 font-semibold">Social Media Content Suppression</p>
              <p className="text-[10px] text-purple-400/80 mt-1 leading-relaxed">
                Multiple independent content creators and journalists report being demonetized, shadow banned,
                or having their accounts restricted for posting footage of Iranian missile and drone strikes
                hitting targets in Israel. This discourages independent media coverage and may reduce the
                availability of first-hand video evidence, affecting reporting accuracy from non-official sources.
              </p>
              <p className="text-[9px] text-purple-600 mt-1.5">
                Based on reports from affected users on X/Twitter, YouTube, and TikTok
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
