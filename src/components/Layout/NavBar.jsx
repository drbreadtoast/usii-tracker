import { Link, useLocation } from 'react-router-dom'
import { Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map, Flame } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: Map, color: 'text-gray-300 hover:text-white' },
  { to: '/timeline', label: 'Timeline', icon: Clock, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/breaking-news', label: 'News', icon: Newspaper, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-money', label: 'Money', icon: DollarSign, color: 'text-green-400 hover:text-green-300' },
  { to: '/follow-the-oil', label: 'Oil', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
  { to: '/follow-the-damage', label: 'Damage', icon: Flame, color: 'text-orange-400 hover:text-orange-300' },
]

export default function NavBar() {
  const location = useLocation()

  // Don't render on the dashboard — it has its own nav in the Header
  if (location.pathname === '/') return null

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide shrink-0">
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold">
          <span className="text-white">LIVE</span>
          <span className="text-red-500">FRONT</span>
        </span>
      </div>
      <div className="h-4 w-px bg-gray-700 shrink-0" />
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
  )
}
