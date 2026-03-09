import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Radio, RefreshCw, Clock, DollarSign, Newspaper, Droplet, Target, Receipt, MessageSquareQuote, Map } from 'lucide-react'
import { formatTimestamp } from '../../utils/verification'

const NAV_LINKS = [
  { to: '/', label: 'Map', icon: Map, color: 'text-gray-300 hover:text-white' },
  { to: '/timeline', label: 'Timeline', icon: Clock, color: 'text-blue-400 hover:text-blue-300' },
  { to: '/breaking-news', label: 'News', icon: Newspaper, color: 'text-red-400 hover:text-red-300' },
  { to: '/follow-the-money', label: 'Money', icon: DollarSign, color: 'text-green-400 hover:text-green-300' },
  { to: '/follow-the-oil', label: 'Oil', icon: Droplet, color: 'text-amber-400 hover:text-amber-300' },
  { to: '/follow-the-munitions', label: 'Munitions', icon: Target, color: 'text-orange-400 hover:text-orange-300' },
  { to: '/follow-the-cost', label: 'Cost', icon: Receipt, color: 'text-purple-400 hover:text-purple-300' },
  { to: '/follow-the-statements', label: 'Statements', icon: MessageSquareQuote, color: 'text-cyan-400 hover:text-cyan-300' },
]

export default function Header({ metadata, onRefresh }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showRefreshToast, setShowRefreshToast] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between shrink-0 relative">
      {/* Logo / Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Live</span>
        </div>
        <div className="h-6 w-px bg-gray-700" />
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-white">LIVE</span>
          <span className="text-red-500">FRONT</span>
        </h1>
        <span className="text-xs text-gray-500 hidden lg:block">Iran-Israel Conflict Tracker</span>
      </div>

      {/* Page Navigation */}
      <nav className="flex items-center gap-1 mx-4 overflow-x-auto scrollbar-hide">
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

      {/* Right: Refresh + Clock */}
      <div className="flex items-center gap-4 text-xs shrink-0">
        {metadata && (
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (isRefreshing) return
                setIsRefreshing(true)
                setShowRefreshToast(false)
                await onRefresh?.()
                setShowRefreshToast(true)
                setTimeout(() => {
                  setIsRefreshing(false)
                  setTimeout(() => setShowRefreshToast(false), 2000)
                }, 1500)
              }}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isRefreshing
                  ? 'bg-blue-600/80 text-blue-100 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
              }`}
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <span className="text-[10px] text-gray-500 hidden md:inline">
              {formatTimestamp(metadata.lastUpdated)}
            </span>
          </div>
        )}
        <div className="h-4 w-px bg-gray-700" />

        {/* UTC Clock */}
        <div className="flex items-center gap-1.5 text-gray-300 font-mono text-xs">
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
      {showRefreshToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-green-900/90 border border-green-700 text-green-200 text-xs font-medium px-3 py-1.5 rounded-md shadow-lg animate-fade-in whitespace-nowrap">
          Data refreshed successfully
        </div>
      )}
    </header>
  )
}
