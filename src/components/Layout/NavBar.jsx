import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map, Flame, List, AlertOctagon, MessageCircle, Landmark, Fuel, Skull, ChevronLeft, ChevronRight } from 'lucide-react'

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
  { to: '/follow-the-oil', label: 'Oil', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/follow-the-damage', label: 'Damage', icon: Flame, color: 'text-orange-400 hover:text-orange-300' },
]

export default function NavBar() {
  const location = useLocation()
  const navRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Don't render on the dashboard — it has its own nav in the Header
  if (location.pathname === '/') return null

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

  const scrollNav = (dir) => {
    const el = navRef.current
    if (el) el.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
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
    </div>
  )
}
