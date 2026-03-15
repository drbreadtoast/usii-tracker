import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map, Flame, AlertOctagon, MessageCircle, Landmark, Skull, ChevronLeft, ChevronRight, LayoutGrid, X, Search, ShieldCheck } from 'lucide-react'
import WorldClocks from './WorldClocks'
import eventsData from '../../data/events.json'
import breakingData from '../../data/breaking.json'
import timelineData from '../../data/war-timeline.json'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Map, color: 'text-gray-300 hover:text-white' },
  { to: '/follow-the-oil', label: 'Oil, Gas & Energy', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/fact-check', label: 'Fact Check', icon: ShieldCheck, color: 'text-green-400 hover:text-green-300' },
  { to: '/breaking-news', label: '24hr Report', icon: Newspaper, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/deaths', label: 'Deaths', icon: Skull, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-damage', label: 'Damage', icon: Flame, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/social', label: 'Social', icon: MessageCircle, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/media', label: 'Media', icon: Newspaper, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/government', label: 'Gov', icon: Landmark, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/timeline', label: 'Timeline & Events', icon: Clock, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/escalations', label: 'Escalations', icon: AlertOctagon, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-money', label: 'Money', icon: DollarSign, color: 'text-green-400 hover:text-green-300' },
]

const EXPLORE_SECTIONS = [
  { title: 'Core Pages', items: [
    { to: '/', label: 'Home', icon: Map, desc: 'Interactive conflict map with live markers' },
    { to: '/breaking-news', label: '24hr Report', icon: Newspaper, desc: 'Last 24 hours of verified developments' },
    { to: '/timeline', label: 'Timeline & Events', icon: Clock, desc: 'Day-by-day record + event database with fact-checks' },
    { to: '/escalations', label: 'Escalations', icon: AlertOctagon, desc: 'Major turning points in the conflict' },
    { to: '/fact-check', label: 'Fact Check', icon: ShieldCheck, desc: 'Debunking rumors & verifying trending claims' },
  ]},
  { title: 'Intelligence', items: [
    { to: '/social', label: 'Social / OSINT', icon: MessageCircle, desc: 'Social media intel & analyst posts' },
    { to: '/media', label: 'Media', icon: Newspaper, desc: 'Coverage comparison across outlets' },
    { to: '/government', label: 'Government', icon: Landmark, desc: 'Official statements from all sides' },
    { to: '/deaths', label: 'Deaths', icon: Skull, desc: 'Casualty tracking with sources' },
  ]},
  { title: 'Follow The...', items: [
    { to: '/follow-the-money', label: 'Money', icon: DollarSign, desc: 'Lobbying, funding & financial flows' },
    { to: '/follow-the-oil', label: 'Oil, Gas & Energy', icon: Droplet, desc: 'Oil, gas, food prices, shipping & energy impact' },
    { to: '/follow-the-munitions', label: 'Munitions', icon: Target, desc: 'Weapons used, inventory & expenditure' },
    { to: '/follow-the-cost', label: 'Cost', icon: Receipt, desc: 'Financial cost of the war by country' },
    { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, desc: 'Political statements timeline' },
    { to: '/follow-the-damage', label: 'Damage', icon: Flame, desc: 'Strike damage locations & assessment' },
  ]},
]

// Build search index from static data
const SEARCH_INDEX = [
  ...eventsData.map(e => ({ type: 'event', id: e.id, text: `${e.title} ${e.description} ${e.location || ''}`, title: e.title, route: '/timeline' })),
  ...breakingData.map(b => ({ type: 'breaking', id: b.id, text: b.text, title: b.text.slice(0, 80), route: '/breaking-news' })),
  ...timelineData.map(t => ({ type: 'timeline', id: t.id, text: `${t.title} ${t.description}`, title: t.title, route: '/timeline' })),
]

const TYPE_LABELS = {
  event: { label: 'Event', cls: 'text-red-400 bg-red-950/40' },
  breaking: { label: '24hr', cls: 'text-orange-400 bg-orange-950/40' },
  timeline: { label: 'Timeline', cls: 'text-blue-400 bg-blue-950/40' },
}

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)
  const searchInputRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const checkScroll = () => {
    const el = navRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    checkScroll()
    const el = navRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  // Close overlays on route change
  useEffect(() => {
    setExploreOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const scrollNav = (dir) => {
    const el = navRef.current
    if (el) el.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  const searchResults = searchQuery.trim().length >= 2
    ? SEARCH_INDEX.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 12)
    : []

  return (
    <>
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex items-center shrink-0 relative">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <Link to="/" className="flex items-center">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight">
              <span className="text-white">The</span>
              <span className="text-red-500">OSS</span>
              <span className="text-white">report</span>
              <span className="text-red-500">.com</span>
            </h1>
          </Link>
          <span className="text-[9px] text-gray-500 hidden md:inline">US · Israel · Iran War Tracker</span>
        </div>
        <div className="h-4 w-px bg-gray-700 shrink-0 mr-1" />
        <div className="relative flex items-center min-w-0 flex-1">
          {canScrollLeft && (
            <button
              onClick={() => scrollNav(-1)}
              className="absolute left-0 z-10 h-full flex items-center pl-0.5 pr-3 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent"
              aria-label="Scroll nav left"
            >
              <ChevronLeft size={14} className="text-gray-400" />
            </button>
          )}
          <nav
            ref={navRef}
            className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {NAV_LINKS.map(({ to, label, icon: Icon, color }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap border shrink-0 ${
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
          {canScrollRight && (
            <button
              onClick={() => scrollNav(1)}
              className="absolute right-0 z-10 h-full flex items-center pr-0.5 pl-3 bg-gradient-to-l from-gray-900 via-gray-900/95 to-transparent"
              aria-label="Scroll nav right"
            >
              <ChevronRight size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Right: Explore + Search */}
        <div className="flex items-center gap-1.5 ml-1.5 shrink-0">
          <button
            onClick={() => { setExploreOpen(!exploreOpen); setSearchOpen(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors ring-1 ring-blue-400/30 shadow-lg shadow-blue-900/20"
            title="Menu — all pages"
          >
            <LayoutGrid size={12} />
            Menu
          </button>
          <button
            onClick={() => { setSearchOpen(!searchOpen); setExploreOpen(false) }}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-gray-800/50 hover:bg-gray-700 border border-gray-700/50 text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search size={10} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {/* World Clocks — always visible below nav */}
      <WorldClocks />

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/70" onClick={() => setSearchOpen(false)}>
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

      {/* Explore Overlay */}
      {exploreOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/70" onClick={() => setExploreOpen(false)}>
          <div className="max-w-3xl mx-auto mt-16 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-gray-200">Explore TheOSSreport.com</span>
                <span className="text-[10px] text-gray-600">15 pages</span>
              </div>
              <button onClick={() => setExploreOpen(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {EXPLORE_SECTIONS.map(section => (
                <div key={section.title}>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{section.title}</h3>
                  <div className="space-y-1">
                    {section.items.map(({ to, label, icon: Icon, desc }) => {
                      const isActive = location.pathname === to
                      return (
                        <button
                          key={to}
                          onClick={() => {
                            navigate(to)
                            setExploreOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                            isActive
                              ? 'bg-blue-950/40 border border-blue-800/50'
                              : 'hover:bg-gray-800/60 border border-transparent'
                          }`}
                        >
                          <Icon size={14} className={`shrink-0 mt-0.5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                          <div className="min-w-0">
                            <div className={`text-xs font-medium ${isActive ? 'text-blue-300' : 'text-gray-300'}`}>{label}</div>
                            <div className="text-[10px] text-gray-600 leading-tight">{desc}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
