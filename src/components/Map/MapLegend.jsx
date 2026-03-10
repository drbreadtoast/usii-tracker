import { useState } from 'react'
import { ChevronDown, ChevronUp, Info, X } from 'lucide-react'
import { EVENT_COLORS, VERIFICATION_COLORS, INVOLVEMENT_LEVELS } from '../../utils/colors'

export default function MapLegend({ showBases = true }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="absolute bottom-6 left-3 z-[1000] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl max-w-[200px]">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-gray-300 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Info size={12} className="text-gray-500" />
          <span>Legend</span>
        </div>
        {isExpanded ? <X size={12} className="text-gray-400" /> : <ChevronUp size={12} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-2 space-y-2 border-t border-gray-800 max-h-[50vh] overflow-y-auto">
          {/* Event Types — compact 2-col grid */}
          <div className="pt-2">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Event Type</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {Object.entries(EVENT_COLORS).map(([type, info]) => (
                <div key={type} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: info.color }}
                  />
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification — inline */}
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Verification</p>
            <div className="flex gap-3">
              {Object.entries(VERIFICATION_COLORS).map(([status, info]) => (
                <div key={status} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold"
                    style={{
                      backgroundColor: `${info.color}30`,
                      color: info.color,
                      border: `1px ${status === 'rumored' ? 'dashed' : 'solid'} ${info.color}`,
                    }}
                  >
                    {info.icon}
                  </div>
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strikes — compact */}
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Strikes</p>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-white/80" style={{ backgroundColor: '#EF4444' }} />
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full opacity-55" style={{ backgroundColor: '#F59E0B', border: '1.5px dashed rgba(255,255,255,0.5)' }} />
                <span>Reported</span>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              {[
                { name: 'US', color: '#3B82F6' },
                { name: 'ISR', color: '#60A5FA' },
                { name: 'IRN', color: '#EF4444' },
                { name: 'HZB', color: '#F97316' },
              ].map(a => (
                <div key={a.name} className="flex items-center gap-1 text-[9px] text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bases + Blockade — combined row */}
          {showBases && (
            <div>
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Bases & Blockade</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 shrink-0" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                  <span>Struck</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 shrink-0" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                  <span>Intact</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="shrink-0 bg-red-700 border border-red-400 rounded px-1 py-0.5 text-[6px] font-bold text-white leading-none">
                    &#x26D4;
                  </div>
                  <span>Hormuz</span>
                </div>
              </div>
            </div>
          )}

          {/* Global Involvement — inline */}
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Involvement</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {Object.entries(INVOLVEMENT_LEVELS).map(([key, info]) => (
                <div key={key} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <div
                    className="w-2 h-2 shrink-0"
                    style={{ backgroundColor: info.color, transform: 'rotate(45deg)', opacity: 0.85 }}
                  />
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Military Assets — compact */}
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Assets</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {[
                { name: 'Carrier', icon: '⛴', color: '#3B82F6' },
                { name: 'Destroyer', icon: '🚢', color: '#3B82F6' },
                { name: 'Sub', icon: '🔱', color: '#3B82F6' },
                { name: 'ISR', icon: '⚓', color: '#60A5FA' },
              ].map(a => (
                <div key={a.name} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <div
                    className="w-3 h-3 rounded shrink-0 flex items-center justify-center border border-white/40"
                    style={{ backgroundColor: a.color, opacity: 0.9 }}
                  >
                    <span className="text-[7px]">{a.icon}</span>
                  </div>
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Countries — compact row */}
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Countries</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {[
                { name: 'Iran', color: '#EF4444' },
                { name: 'Israel', color: '#60A5FA' },
                { name: 'Iraq', color: '#A855F7' },
                { name: 'Lebanon', color: '#F97316' },
                { name: 'Other', color: '#22C55E' },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <div className="w-2.5 h-1.5 shrink-0 rounded-sm" style={{ backgroundColor: c.color, opacity: 0.6 }} />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
