import { Filter, ChevronDown, ChevronUp, Search, Star, X, Check } from 'lucide-react'
import { useState } from 'react'
import { EVENT_COLORS, VERIFICATION_COLORS, COUNTRY_COLORS } from '../../utils/colors'

export default function FilterPanel({
  activeTypes, activeStatuses, activeCountries,
  showOnlyMajor, searchQuery,
  showBases, showMissileStrikes,
  toggleType, toggleStatus, toggleCountry,
  toggleAllTypes, toggleAllStatuses, toggleAllCountries,
  setShowOnlyMajor, setSearchQuery,
  setShowBases, setShowMissileStrikes,
  initialExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-sm font-semibold text-gray-300 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <span>Filters</span>
        </div>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-8 pr-8 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Major events */}
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={showOnlyMajor} onChange={(e) => setShowOnlyMajor(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500/50" />
            <Star size={13} className="text-amber-400" />
            <span className="text-gray-400">Major events only</span>
          </label>

          {/* Map Overlays */}
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Map Overlays</span>
            <div className="flex gap-3 mt-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showBases} onChange={(e) => setShowBases(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/50" />
                <span className="text-xs text-gray-400">US Bases</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showMissileStrikes} onChange={(e) => setShowMissileStrikes(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500/50" />
                <span className="text-xs text-gray-400">Missile Strikes</span>
              </label>
            </div>
          </div>

          {/* Country / Actor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country / Actor</span>
                <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full font-mono">
                  {activeCountries.size}/{Object.keys(COUNTRY_COLORS).length}
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => toggleAllCountries(true)} className="text-blue-400 hover:text-blue-300">All</button>
                <button onClick={() => toggleAllCountries(false)} className="text-gray-500 hover:text-gray-400">None</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(COUNTRY_COLORS).map(([key, info]) => {
                const isActive = activeCountries.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleCountry(key)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all hover:ring-1 hover:ring-gray-500 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 line-through opacity-40'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${info.color}30` : '#1f2937',
                      border: `1px solid ${isActive ? `${info.color}60` : '#374151'}`,
                    }}
                  >
                    {isActive && <Check size={8} className="shrink-0" />}
                    {info.flag} {info.short}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Event Types */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Type</span>
                <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full font-mono">
                  {activeTypes.size}/{Object.keys(EVENT_COLORS).length}
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => toggleAllTypes(true)} className="text-blue-400 hover:text-blue-300">All</button>
                <button onClick={() => toggleAllTypes(false)} className="text-gray-500 hover:text-gray-400">None</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(EVENT_COLORS).map(([type, info]) => {
                const isActive = activeTypes.has(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-all text-left hover:ring-1 hover:ring-gray-600 ${
                      isActive ? 'bg-gray-800 text-gray-200' : 'text-gray-600 line-through opacity-40'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 relative"
                      style={{ backgroundColor: isActive ? info.color : '#374151', boxShadow: isActive ? `0 0 6px ${info.color}60` : 'none' }}>
                      {isActive && (
                        <Check size={7} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="truncate">{info.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Verification */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</span>
                <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full font-mono">
                  {activeStatuses.size}/{Object.keys(VERIFICATION_COLORS).length}
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <button onClick={() => toggleAllStatuses(true)} className="text-blue-400 hover:text-blue-300">All</button>
                <button onClick={() => toggleAllStatuses(false)} className="text-gray-500 hover:text-gray-400">None</button>
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(VERIFICATION_COLORS).map(([status, info]) => {
                const isActive = activeStatuses.has(status)
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all text-left hover:ring-1 hover:ring-gray-600 ${
                      isActive ? 'bg-gray-800' : 'text-gray-600 opacity-40'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        backgroundColor: isActive ? `${info.color}30` : '#1f2937',
                        color: isActive ? info.color : '#4b5563',
                        border: `1.5px ${status === 'rumored' ? 'dashed' : 'solid'} ${isActive ? info.color : '#374151'}`,
                      }}
                    >{isActive ? <Check size={10} /> : info.icon}</div>
                    <span className={isActive ? 'text-gray-200' : 'text-gray-600 line-through'}>{info.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
