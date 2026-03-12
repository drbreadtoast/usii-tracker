import { useState, useRef, useEffect, useCallback } from 'react'
import { Video, ExternalLink, Radio, Minimize2, Maximize2, X, GripHorizontal, Tv } from 'lucide-react'

const STREAMS = [
  {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    perspective: 'International / Arab perspective',
    flag: '\u{1F1F6}\u{1F1E6}',
    embedUrl: 'https://players.brightcove.net/665003303001/AvByVmBYDu_default/index.html?videoId=6368602483112',
    autoplayUrl: 'https://players.brightcove.net/665003303001/AvByVmBYDu_default/index.html?videoId=6368602483112&autoplay=true',
    link: 'https://www.aljazeera.com/video/live',
    hasEmbed: true,
  },
  {
    id: 'i24news',
    name: 'i24NEWS English',
    perspective: 'Israeli / Pro-US perspective',
    flag: '\u{1F1EE}\u{1F1F1}',
    embedUrl: 'https://geo.dailymotion.com/player.html?video=x29atae',
    autoplayUrl: 'https://geo.dailymotion.com/player.html?video=x29atae&autoplay=true',
    link: 'https://www.i24news.tv/en',
    hasEmbed: true,
    fallbackLinks: [
      { name: 'i24NEWS', flag: '\u{1F1EE}\u{1F1F1}', url: 'https://www.i24news.tv/en', desc: 'Israeli 24/7 English news' },
      { name: 'Fox News', flag: '\u{1F1FA}\u{1F1F8}', url: 'https://www.foxnews.com/video', desc: 'US conservative news' },
      { name: 'Newsmax', flag: '\u{1F1FA}\u{1F1F8}', url: 'https://www.newsmaxtv.com/', desc: 'US pro-Trump news' },
    ],
  },
]

const DEFAULT_WIDTH = 400
const MIN_WIDTH = 280
const MAX_WIDTH = 700
const MOBILE_BREAKPOINT = 640

function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

export default function VideoSection({ onClose }) {
  const [activeStream, setActiveStream] = useState(STREAMS[0])
  const [minimized, setMinimized] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)
  const [i24Unavailable, setI24Unavailable] = useState(false)

  // Position & size (desktop only)
  const [pos, setPos] = useState(null)
  const [width, setWidth] = useState(DEFAULT_WIDTH)

  const popupRef = useRef(null)
  const dragging = useRef(false)
  const resizing = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const resizeStart = useRef({ x: 0, width: 0 })
  const i24CheckTimer = useRef(null)

  // Auto-hide overlay after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Check if i24NEWS embed loads — if it shows "unavailable" after 8s, show fallback
  useEffect(() => {
    i24CheckTimer.current = setTimeout(() => {
      setI24Unavailable(true)
    }, 8000)
    return () => clearTimeout(i24CheckTimer.current)
  }, [])

  // --- Drag handlers (desktop only) ---
  const onDragStart = useCallback((e) => {
    if (isMobile()) return
    e.preventDefault()
    dragging.current = true
    const rect = popupRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragStart.current = {
      x: clientX,
      y: clientY,
      posX: rect.left,
      posY: rect.top,
    }
    document.body.style.userSelect = 'none'
  }, [])

  const onDragMove = useCallback((e) => {
    if (!dragging.current) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - dragStart.current.x
    const dy = clientY - dragStart.current.y
    let newX = dragStart.current.posX + dx
    let newY = dragStart.current.posY + dy
    const w = popupRef.current?.offsetWidth || DEFAULT_WIDTH
    const h = popupRef.current?.offsetHeight || 300
    newX = Math.max(0, Math.min(window.innerWidth - w, newX))
    newY = Math.max(0, Math.min(window.innerHeight - h, newY))
    setPos({ x: newX, y: newY })
  }, [])

  // --- Resize handlers (desktop only) ---
  const onResizeStart = useCallback((e) => {
    if (isMobile()) return
    e.preventDefault()
    e.stopPropagation()
    resizing.current = true
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    resizeStart.current = { x: clientX, width }
    document.body.style.userSelect = 'none'
  }, [width])

  const onResizeMove = useCallback((e) => {
    if (!resizing.current) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const dx = clientX - resizeStart.current.x
    let newW = resizeStart.current.width + dx
    newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newW))
    setWidth(newW)
  }, [])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    resizing.current = false
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onDragMove, { passive: false })
    window.addEventListener('touchmove', onResizeMove, { passive: false })
    window.addEventListener('touchend', onPointerUp)
    return () => {
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mousemove', onResizeMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchmove', onResizeMove)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [onDragMove, onResizeMove, onPointerUp])

  const popupStyle = isMobile()
    ? {}
    : {
        ...(pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : {}),
        width,
      }

  const getEmbedUrl = (stream) => {
    if (firstLoad && stream.id === 'aljazeera') return stream.autoplayUrl
    return stream.embedUrl
  }

  const handleStreamSwitch = (stream) => {
    setActiveStream(stream)
    setFirstLoad(false)
  }

  const handleContinue = () => {
    setShowOverlay(false)
  }

  const handleCloseStream = () => {
    setShowOverlay(false)
    if (onClose) onClose()
  }

  // Whether to show fallback for the active stream
  const showFallback = activeStream.id === 'i24news' && i24Unavailable && activeStream.fallbackLinks

  return (
    <>
      {/* Popup — always mounted, hidden when minimized to keep audio */}
      <div
        ref={popupRef}
        className={`fixed z-[2000] shadow-2xl rounded-lg overflow-hidden border border-gray-700 transition-opacity duration-200 ${
          minimized
            ? 'opacity-0 pointer-events-none w-0 h-0 overflow-hidden'
            : 'opacity-100'
        } ${
          !pos && !isMobile()
            ? 'bottom-14 right-4'
            : ''
        } ${
          isMobile()
            ? 'bottom-28 right-3 w-[calc(100vw-24px)]'
            : ''
        }`}
        style={!minimized ? popupStyle : { position: 'fixed', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      >
        {/* Header — drag handle on desktop */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border-b border-gray-700 select-none sm:cursor-grab active:sm:cursor-grabbing"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <GripHorizontal size={12} className="text-gray-600 shrink-0 hidden sm:block" />
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
              onClick={() => handleStreamSwitch(stream)}
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

        {/* Video player / Fallback */}
        <div className="relative aspect-video bg-black">
          {/* Al Jazeera iframe — always mounted to keep audio alive */}
          <iframe
            src={getEmbedUrl(STREAMS[0])}
            title={STREAMS[0].name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            style={{ display: activeStream.id === 'aljazeera' ? 'block' : 'none' }}
          />

          {/* i24NEWS: show iframe behind fallback (attempt load), show fallback overlay if unavailable */}
          {!showFallback && (
            <iframe
              src={getEmbedUrl(STREAMS[1])}
              title={STREAMS[1].name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              style={{ display: activeStream.id === 'i24news' ? 'block' : 'none' }}
            />
          )}

          {/* Fallback UI for i24NEWS */}
          {showFallback && activeStream.id === 'i24news' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 px-4 py-3">
              <Tv size={28} className="text-gray-600 mb-2" />
              <p className="text-[11px] font-semibold text-gray-400 text-center mb-1">
                Live embed currently unavailable
              </p>
              <p className="text-[9px] text-gray-600 text-center mb-3">
                Watch the Israeli & pro-US perspective directly:
              </p>
              <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
                {activeStream.fallbackLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-md transition-colors group"
                  >
                    <span className="text-sm">{link.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white">{link.name}</span>
                      <span className="text-[9px] text-gray-500 ml-1.5">{link.desc}</span>
                    </div>
                    <ExternalLink size={10} className="text-gray-600 group-hover:text-blue-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Auto-play dismiss overlay — fades out after 5s */}
          {showOverlay && activeStream.id === 'aljazeera' && (
            <div className="absolute inset-0 z-10 flex items-end justify-center pb-4 pointer-events-none animate-fade-in">
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={handleContinue}
                  className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-semibold rounded-full shadow-lg backdrop-blur-sm transition-colors"
                >
                  Continue Watching
                </button>
                <button
                  onClick={handleCloseStream}
                  className="px-3 py-1.5 bg-gray-800/90 hover:bg-gray-700 text-gray-300 text-[11px] font-semibold rounded-full shadow-lg backdrop-blur-sm transition-colors"
                >
                  Close Stream
                </button>
              </div>
            </div>
          )}
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

        {/* Resize handle — desktop only */}
        <div
          className="hidden sm:block absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
        >
          <svg viewBox="0 0 16 16" className="w-full h-full text-gray-600">
            <path d="M14 14L8 14L14 8Z" fill="currentColor" opacity="0.4" />
            <path d="M14 14L11 14L14 11Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Minimized pill — visible when minimized, keeps iframe alive above */}
      {minimized && (
        <div className="fixed bottom-28 right-3 z-[2000] sm:bottom-14 sm:right-4">
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
      )}
    </>
  )
}
