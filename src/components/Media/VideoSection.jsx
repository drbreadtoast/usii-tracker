import { useState } from 'react'
import { Video, ExternalLink, Radio } from 'lucide-react'

const VIDEOS = [
  {
    id: 'live',
    title: 'Al Jazeera English — Live',
    description: 'Live coverage of the Iran-Israel conflict',
    embedId: 'gCNeDWCI0vo',
    isLive: true,
    channel: 'Al Jazeera English',
  },
  {
    id: 'clip-1',
    title: "Iran sets 3 conditions for ceasefire",
    description: 'President Pezeshkian outlines peace demands',
    embedId: 'F_7TCG-0R-4',
    isLive: false,
    channel: 'Al Jazeera English',
  },
  {
    id: 'clip-2',
    title: 'Iraq oil tankers attacked in Persian Gulf',
    description: 'Two foreign oil tankers hit, port operations shut down',
    embedId: 'HkfBMih_eJI',
    isLive: false,
    channel: 'Al Jazeera English',
  },
]

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0])

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/80 border-b border-gray-800">
        <Video size={14} className="text-red-400" />
        <span className="text-xs font-semibold text-gray-300">Live & Recent Coverage</span>
        {activeVideo.isLive && (
          <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold ml-auto">
            <Radio size={10} className="animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Main video player */}
      <div className="aspect-video bg-black">
        <iframe
          key={activeVideo.embedId}
          src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=0&rel=0`}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Video selector tabs */}
      <div className="flex border-t border-gray-800">
        {VIDEOS.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className={`flex-1 px-2 py-2 text-left transition-colors border-r border-gray-800 last:border-r-0 ${
              activeVideo.id === video.id
                ? 'bg-gray-800/60 text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {video.isLive && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
              )}
              <span className="text-[10px] font-semibold truncate">{video.title}</span>
            </div>
            <p className="text-[9px] text-gray-500 truncate mt-0.5">{video.description}</p>
          </button>
        ))}
      </div>

      {/* Attribution */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/50 border-t border-gray-800">
        <span className="text-[9px] text-gray-600">Videos via YouTube</span>
        <a
          href="https://www.youtube.com/@AlJazeeraEnglish"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] text-blue-400/70 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={8} />
          Al Jazeera English
        </a>
      </div>
    </div>
  )
}
