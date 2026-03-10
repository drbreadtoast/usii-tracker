import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Radio, Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map, Flame, List, AlertOctagon, MessageCircle, Landmark, Fuel, Skull, Search, X } from 'lucide-react'
import eventsData from '../../data/events.json'
import breakingData from '../../data/breaking.json'
import timelineData from '../../data/war-timeline.json'

const NAV_LINKS = [
  { to: '/', label: 'Map', icon: Map, color: 'text-gray-300 hover:text-white' },
  { to: '/timeline', label: 'Timeline', icon: Clock, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/breaking-news', label: 'News', icon: Newspaper, color: 'text-red-400 hover:text-red-300' },
  { to: '/events', label: 'Events', icon: List, color: 'text-red-400 hover:text-red-300' },
  { to: '/escalations', label: 'Escalations', icon: AlertOctagon, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/social', label: 'Social', icon: MessageCircle, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/media', label: 'Media', icon: Newspaper, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/government', label: 'Gov', icon: Landmark, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/energy', label: 'Energy', icon: Fuel, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/deaths', label: 'Deaths', icon: Skull, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-money', label: 'Money', icon: DollarSign, color: 'text-green-400 hover:text-green-300' },
  { to: '/follow-the-oil', label: 'Oil', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/follow-the-damage', label: 'Damage', icon: Flame, color: 'text-rose-400 hover:text-rose-300' },
]

// Build search index from static data
const SEARCH_INDEX = [
  ...eventsData.map(e => ({ type: 'event', id: e.id, text: `${e.title} ${e.description} ${e.location || ''}`, title: e.title, route: '/events' })),
  ...breakingData.map(b => ({ type: 'breaking', id: b.id, text: b.text, title: b.text.slice(0, 80), route: '/breaking-news' })),
  ...timelineData.map(t => ({ type: 'timeline', id: t.id, text: `${t.title} ${t.description}`, title: t.title, route: '/timeline' })),
]

export default function Header({ metadata }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  const searchResults = searchQuery.trim().length >= 2
    ? SEARCH_INDEX.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 12)
    : []

  const TYPE_LABELS = {
    event: { label: 'Event', cls: 'text-red-400 bg-red-950/40' },
    breaking: { label: 'Breaking', cls: 'text-orange-400 bg-orange-950/40' },
    timeline: { label: 'Timeline', cls: 'text-blue-400 bg-blue-950/40' },
  }

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between shrink-0 relative">
        {/* Logo / Title + URL */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-white">USII</span>
              <span className="text-red-500"> Tracker</span>
            </h1>
          </Link>
          <span className="text-[10px] text-blue-400 font-mono bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/50 hidden sm:inline">usiitracker.com</span>
          <span className="text-[9px] text-gray-500 hidden md:inline">US · Israel · Iran War Tracker</span>
        </div>

        {/* Page Navigation */}
        <nav className="flex items-center gap-1 mx-2 sm:mx-4 overflow-x-auto scrollbar-hide">
          {NAV_LINKS.map(({ to, label, icon: Icon, color }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap border ${
                  isActive
                    ? 'bg-gray-700 border-gray-600 ' + color.split(' ')[0]
                    : 'bg-gray-800/50 hover:bg-gray-700 border-gray-700/50 ' + color
                }`}
              >
                <Icon size={10} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Search + UTC Clock */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-gray-800/50 hover:bg-gray-700 border border-gray-700/50 text-gray-400 hover:text-white transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search size={10} />
            <span className="hidden sm:inline">Search</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-gray-300 font-mono text-xs">
            <Radio size={12} className="text-red-500" />
            <span>
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'UTC',
              })}
            </span>
            <span className="text-gray-600">UTC</span>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-0 z-[2000] bg-black/70" onClick={() => setSearchOpen(false)}>
          <div className="max-w-2xl mx-auto mt-16 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
              <Search size={16} className="text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events, news, timeline..."
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              {searchQuery.trim().length < 2 ? (
                <div className="px-4 py-6 text-center text-gray-600 text-sm">
                  Type at least 2 characters to search...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-600 text-sm">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map(result => {
                  const typeInfo = TYPE_LABELS[result.type]
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        navigate(result.route)
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 flex items-start gap-3"
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${typeInfo.cls}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-sm text-gray-300 line-clamp-2">{result.title}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
