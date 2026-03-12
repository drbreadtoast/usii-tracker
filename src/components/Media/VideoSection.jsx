import { useState } from 'react'
import { Video, ExternalLink, Radio, Minimize2, Maximize2, X, GripHorizontal } from 'lucide-react'

const STREAMS = [
  {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    perspective: 'International / Arab perspective',
    flag: '\u{1F1F6}\u{1F1E6}',
    embedUrl: 'https://players.brightcove.net/665003303001/AvByVmBYDu_default/index.html?videoId=6368602483112',
    link: 'https://www.aljazeera.com/video/live',
  },
  {
    id: 'i24news',
    name: 'i24NEWS English',
    perspective: 'Israeli perspective',
    flag: '\u{1F1EE}\u{1F1F1}',
    embedUrl: 'https://www.dailymotion.com/embed/video/x29atae?autoplay=0',
    link: 'https://www.i24news.tv/en',
  },
]

export default function VideoSection({ onClose }) {
  const [activeStream, setActiveStream] = useState(STREAMS[0])
  const [minimized, setMinimized] = useState(false)

  // Minimized pill — bottom-right corner
  if (minimized) {
    return (
      <div className="fixed bottom-16 right-3 z-[2000] sm:bottom-14 sm:right-4">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl hover:bg-gray-800 transition-colors"
        >
          <Video size={14} className="text-red-400" />
          <span className="text-[11px] font-semibold text-gray-300">Live News</span>
          <span className="flex items-center gap-1 text-[9px] text-red-400 font-semibold">
            <Radio size={8} className="animate-pulse" />
            LIVE
          </span>
          <Maximize2 size={12} className="text-gray-500 ml-1" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-16 right-3 z-[2000] w-[calc(100vw-24px)] max-w-[420px] sm:bottom-14 sm:right-4 sm:w-[400px] shadow-2xl rounded-lg overflow-hidden border border-gray-700">
      {/* Header — acts as drag handle visually */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border-b border-gray-700 cursor-default select-none">
        <GripHorizontal size={12} className="text-gray-600 shrink-0" />
        <Video size={12} className="text-red-400 shrink-0" />
        <span className="text-[10px] font-semibold text-gray-300 truncate">Live News — Both Sides</span>
        <span className="flex items-center gap-1 text-[9px] text-red-400 font-semibold shrink-0">
          <Radio size={8} className="animate-pulse" />
          LIVE
        </span>
        <div className="ml-auto flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => setMinimized(true)}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
            title="Minimize"
          >
            <Minimize2 size={12} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
              title="Close"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Stream selector */}
      <div className="flex bg-gray-900 border-b border-gray-700">
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            onClick={() => setActiveStream(stream)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold transition-colors ${
              activeStream.id === stream.id
                ? 'text-white bg-gray-800/60 border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <span>{stream.flag}</span>
            <span className="truncate">{stream.name}</span>
          </button>
        ))}
      </div>

      {/* Video player */}
      <div className="aspect-video bg-black">
        <iframe
          key={activeStream.id}
          src={activeStream.embedUrl}
          title={activeStream.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Attribution */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-900 border-t border-gray-700">
        <span className="text-[9px] text-gray-500">{activeStream.perspective}</span>
        <a
          href={activeStream.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] text-blue-400/70 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={8} />
          {activeStream.name}
        </a>
      </div>
    </div>
  )
}
