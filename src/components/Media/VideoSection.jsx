import { Video, ExternalLink, Radio } from 'lucide-react'

export default function VideoSection() {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/80 border-b border-gray-800">
        <Video size={14} className="text-red-400" />
        <span className="text-xs font-semibold text-gray-300">Live Coverage</span>
        <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold ml-auto">
          <Radio size={10} className="animate-pulse" />
          LIVE 24/7
        </span>
      </div>

      {/* Al Jazeera English Live — Brightcove player (always live) */}
      <div className="aspect-video bg-black">
        <iframe
          src="https://players.brightcove.net/665003303001/AvByVmBYDu_default/index.html?videoId=6368602483112"
          title="Al Jazeera English — Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Attribution */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/50 border-t border-gray-800">
        <span className="text-[9px] text-gray-600">Al Jazeera English — 24-hour live broadcast</span>
        <a
          href="https://www.aljazeera.com/video/live"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] text-blue-400/70 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={8} />
          Watch on aljazeera.com
        </a>
      </div>
    </div>
  )
}
