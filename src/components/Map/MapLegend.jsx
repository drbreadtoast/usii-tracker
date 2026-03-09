import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
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
        {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-800">
          {/* Event Types */}
          <div className="pt-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Event Type</p>
            <div className="space-y-1">
              {Object.entries(EVENT_COLORS).map(([type, info]) => (
                <div key={type} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: info.color, boxShadow: `0 0 4px ${info.color}60` }}
                  />
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Verification</p>
            <div className="space-y-1">
              {Object.entries(VERIFICATION_COLORS).map(([status, info]) => (
                <div key={status} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold"
                    style={{
                      backgroundColor: `${info.color}30`,
                      color: info.color,
                      border: `1.5px ${status === 'rumored' ? 'dashed' : 'solid'} ${info.color}`,
                    }}
                  >
                    {info.icon}
                  </div>
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Major event indicator */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Importance</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
              <span>Major Event (larger + glow)</span>
            </div>
          </div>

          {/* Missile Strikes */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Missile Strikes</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <div className="w-3 h-3 rounded-full shrink-0 border-2 border-white/80 flex items-center justify-center" style={{ backgroundColor: '#EF4444', boxShadow: '0 0 6px #EF444460' }}>
                  <span className="text-white text-[6px]">✦</span>
                </div>
                <span>Confirmed Strike</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center opacity-55" style={{ backgroundColor: '#F59E0B', border: '2px dashed rgba(255,255,255,0.5)' }}>
                  <span className="text-white text-[5px]">✦</span>
                </div>
                <span>Reported (Unconfirmed)</span>
              </div>
              <div className="mt-1.5 space-y-0.5">
                <p className="text-[9px] text-gray-600 font-semibold">By Attacker:</p>
                {[
                  { name: 'US', color: '#3B82F6' },
                  { name: 'Israel', color: '#60A5FA' },
                  { name: 'Iran', color: '#EF4444' },
                  { name: 'Hezbollah', color: '#F97316' },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* US Bases legend */}
          {showBases && (
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">US Military Bases</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div className="w-4 h-4 bg-red-500 shrink-0 relative" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[5px] font-black">US</span>
                  </div>
                  <span>Struck Base ⚠</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div className="w-4 h-4 bg-blue-500 shrink-0 relative" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[5px] font-black">US</span>
                  </div>
                  <span>Intact Base ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* Hormuz Blockade */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Blockade</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <div className="shrink-0 bg-red-700 border border-red-400 rounded px-1 py-0.5 text-[7px] font-bold text-white leading-none">
                &#x26D4; BLOCKED
              </div>
              <span>Strait of Hormuz</span>
            </div>
          </div>

          {/* Global Involvement */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Global Involvement</p>
            <div className="space-y-1">
              {Object.entries(INVOLVEMENT_LEVELS).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div
                    className="w-2.5 h-2.5 shrink-0"
                    style={{
                      backgroundColor: info.color,
                      transform: 'rotate(45deg)',
                      opacity: 0.85,
                    }}
                  />
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Military Assets */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Military Assets</p>
            <div className="space-y-1">
              {[
                { name: 'US Carrier', icon: '⛴', color: '#3B82F6' },
                { name: 'US Destroyer', icon: '🚢', color: '#3B82F6' },
                { name: 'US Submarine', icon: '🔱', color: '#3B82F6' },
                { name: 'Israeli Vessel', icon: '⚓', color: '#60A5FA' },
              ].map(a => (
                <div key={a.name} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div
                    className="w-4 h-4 rounded shrink-0 flex items-center justify-center border border-white/40"
                    style={{ backgroundColor: a.color, opacity: 0.9 }}
                  >
                    <span className="text-[9px]">{a.icon}</span>
                  </div>
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Countries</p>
            <div className="space-y-1">
              {[
                { name: 'Iran', color: '#EF4444' },
                { name: 'Israel', color: '#60A5FA' },
                { name: 'Iraq', color: '#A855F7' },
                { name: 'Lebanon', color: '#F97316' },
                { name: 'Affected States', color: '#22C55E' },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div className="w-3 h-2 shrink-0 rounded-sm" style={{ backgroundColor: c.color, opacity: 0.6 }} />
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
