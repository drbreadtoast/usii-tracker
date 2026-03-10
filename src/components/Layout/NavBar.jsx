import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map, Flame, List, AlertOctagon, MessageCircle, Landmark, Fuel, Skull, ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: Map, color: 'text-gray-300 hover:text-white' },
  { to: '/timeline', label: 'Timeline', icon: Clock, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/breaking-news', label: '24hr Report', icon: Newspaper, color: 'text-red-400 hover:text-red-300' },
  { to: '/events', label: 'Events', icon: List, color: 'text-red-400 hover:text-red-300' },
  { to: '/escalations', label: 'Escalations', icon: AlertOctagon, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/social', label: 'Social', icon: MessageCircle, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/media', label: 'Media', icon: Newspaper, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/government', label: 'Gov', icon: Landmark, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/energy', label: 'Energy', icon: Fuel, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/deaths', label: 'Deaths', icon: Skull, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-money', label: 'Money', icon: DollarSign, color: 'text-green-400 hover:text-green-300' },
  { to: '/follow-the-oil', label: 'Oil & Gas', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/follow-the-damage', label: 'Damage', icon: Flame, color: 'text-orange-400 hover:text-orange-300' },
]

const EXPLORE_SECTIONS = [
  { title: 'Core Pages', items: [
    { to: '/', label: 'Map Dashboard', icon: Map, desc: 'Interactive conflict map with live markers' },
    { to: '/breaking-news', label: '24hr Report', icon: Newspaper, desc: 'Last 24 hours of verified developments' },
    { to: '/timeline', label: 'Timeline', icon: Clock, desc: 'Day-by-day war record with fact-checks' },
    { to: '/events', label: 'Events', icon: List, desc: 'All verified conflict events' },
    { to: '/escalations', label: 'Escalations', icon: AlertOctagon, desc: 'Major turning points in the conflict' },
  ]},
  { title: 'Intelligence', items: [
    { to: '/social', label: 'Social / OSINT', icon: MessageCircle, desc: 'Social media intel & analyst posts' },
    { to: '/media', label: 'Media', icon: Newspaper, desc: 'Coverage comparison across outlets' },
    { to: '/government', label: 'Government', icon: Landmark, desc: 'Official statements from all sides' },
    { to: '/energy', label: 'Energy', icon: Fuel, desc: 'Gas prices, oil, food & commodity impact' },
    { to: '/deaths', label: 'Deaths', icon: Skull, desc: 'Casualty tracking with sources' },
  ]},
  { title: 'Follow The...', items: [
    { to: '/follow-the-money', label: 'Money', icon: DollarSign, desc: 'Lobbying, funding & financial flows' },
    { to: '/follow-the-oil', label: 'Oil & Gas', icon: Droplet, desc: 'Oil & gas prices, markets & Hormuz impact' },
    { to: '/follow-the-munitions', label: 'Munitions', icon: Target, desc: 'Weapons used, inventory & expenditure' },
    { to: '/follow-the-cost', label: 'Cost', icon: Receipt, desc: 'Financial cost of the war by country' },
    { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, desc: 'Political statements timeline' },
    { to: '/follow-the-damage', label: 'Damage', icon: Flame, desc: 'Strike damage locations & assessment' },
  ]},
]

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)

  const isDashboard = location.pathname === '/'

  const checkScroll = () => {
    const el = navRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    if (isDashboard) return
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
  }, [isDashboard])

  // Close explore on route change
  useEffect(() => {
    setExploreOpen(false)
  }, [location.pathname])

  const scrollNav = (dir) => {
    const el = navRef.current
    if (el) el.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  // Don't render on the dashboard — it has its own nav in the Header
  if (isDashboard) return null

  return (
    <>
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex items-center shrink-0 relative">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <Link to="/" className="text-xs font-bold">
            <span className="text-white">USII</span>
            <span className="text-red-500"> Tracker</span>
          </Link>
          <span className="text-[9px] text-blue-400 font-mono bg-blue-950/30 px-1 py-0.5 rounded border border-blue-900/50">usiitracker.com</span>
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

        {/* Explore button */}
        <div className="flex items-center ml-1.5 shrink-0">
          <button
            onClick={() => setExploreOpen(!exploreOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/30 text-blue-400 hover:text-blue-300 transition-colors"
            title="Explore all pages"
          >
            <LayoutGrid size={10} className="animate-[pulse_3s_ease-in-out_infinite]" />
            <span className="hidden sm:inline">Explore</span>
          </button>
        </div>
      </div>

      {/* Explore Overlay */}
      {exploreOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/70" onClick={() => setExploreOpen(false)}>
          <div className="max-w-3xl mx-auto mt-16 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-gray-200">Explore USII Tracker</span>
                <span className="text-[10px] text-gray-600">16 pages</span>
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
