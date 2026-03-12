import { useState } from 'react'
import { Skull, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, Shield, MessageCircle } from 'lucide-react'

function NumberDisplay({ value, className = '' }) {
  if (value === null || value === undefined) return <span className="text-gray-600">N/A</span>
  return <span className={`font-mono font-bold ${className}`}>{value.toLocaleString()}</span>
}

function PartyRow({ party, isExpanded, onToggle }) {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{party.flag}</span>
          <span className="text-sm font-semibold text-gray-200">{party.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Shield size={10} className="text-green-400" />
              <NumberDisplay value={party.confirmed.total} className="text-green-400 text-sm" />
            </div>
          </div>
          {isExpanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-800 bg-gray-900/50">
          {/* Confirmed */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield size={11} className="text-green-400" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Confirmed Deaths</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-800/50 rounded p-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Military</p>
                <NumberDisplay value={party.confirmed.military} className="text-gray-200 text-sm" />
              </div>
              <div className="bg-gray-800/50 rounded p-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Civilian</p>
                <NumberDisplay value={party.confirmed.civilian} className="text-red-400 text-sm" />
              </div>
              <div className="bg-gray-800/50 rounded p-1.5">
                <p className="text-[9px] text-gray-500 uppercase">Total</p>
                <NumberDisplay value={party.confirmed.total} className="text-white text-sm" />
              </div>
            </div>
            {party.confirmed.source && (
              <p className="text-[9px] text-gray-600 mt-1">
                Source: {party.confirmed.sourceUrl ? (
                  <a href={party.confirmed.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    {party.confirmed.source} <ExternalLink size={8} className="inline" />
                  </a>
                ) : party.confirmed.source}
              </p>
            )}
          </div>

          {/* Estimated / Rumored */}
          {party.estimated && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle size={11} className="text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Estimated / Unconfirmed</span>
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded p-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Military</p>
                    <NumberDisplay value={party.estimated.military} className="text-amber-300 text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Civilian</p>
                    <NumberDisplay value={party.estimated.civilian} className="text-amber-300 text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Total</p>
                    <NumberDisplay value={party.estimated.total} className="text-amber-200 text-sm" />
                  </div>
                </div>
                {party.estimated.note && (
                  <p className="text-[9px] text-amber-700 mt-1.5 italic leading-relaxed">
                    {party.estimated.note}
                  </p>
                )}
                {party.estimated.source && (
                  <p className="text-[9px] text-gray-600 mt-0.5">
                    Source: {party.estimated.sourceUrl ? (
                      <a href={party.estimated.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        {party.estimated.source} <ExternalLink size={8} className="inline" />
                      </a>
                    ) : party.estimated.source}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rumored / Social Media Reports */}
          {party.rumored && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageCircle size={11} className="text-purple-400" />
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Rumored / Social Media</span>
              </div>
              <div className="bg-purple-950/20 border border-dashed border-purple-900/40 rounded p-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Military</p>
                    <NumberDisplay value={party.rumored.military} className="text-purple-300 text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Civilian</p>
                    <NumberDisplay value={party.rumored.civilian} className="text-purple-300 text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">Total</p>
                    <NumberDisplay value={party.rumored.total} className="text-purple-200 text-sm" />
                  </div>
                </div>
                {party.rumored.note && (
                  <p className="text-[9px] text-purple-700 mt-1.5 italic leading-relaxed">
                    {party.rumored.note}
                  </p>
                )}
                {party.rumored.socialSources && party.rumored.socialSources.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Sources</span>
                    {party.rumored.socialSources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-800/50 border border-gray-700/50 rounded p-1.5 hover:bg-gray-800 transition-colors group"
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] text-purple-400 font-semibold">{src.handle}</span>
                          <span className="text-[8px] text-gray-600">{src.platform}</span>
                          <span className="text-[8px] text-gray-700">{src.date}</span>
                          <ExternalLink size={8} className="text-gray-600 group-hover:text-blue-400 ml-auto" />
                        </div>
                        <p className="text-[9px] text-gray-400 leading-relaxed">{src.claim}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional stats — injured, displaced, missing, arrested */}
          {(party.injured || party.displaced || party.arrested || party.missing) && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle size={11} className="text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Impact & Casualties</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {party.injured != null && party.injured > 0 && (
                  <div className="bg-orange-950/20 border border-orange-900/30 rounded p-2 text-center">
                    <p className="text-[9px] text-orange-400/70 uppercase font-semibold">Injured</p>
                    <NumberDisplay value={party.injured} className="text-orange-300 text-sm" />
                  </div>
                )}
                {party.displaced != null && party.displaced > 0 && (
                  <div className="bg-purple-950/20 border border-purple-900/30 rounded p-2 text-center">
                    <p className="text-[9px] text-purple-400/70 uppercase font-semibold">Displaced</p>
                    <NumberDisplay value={party.displaced} className="text-purple-300 text-sm" />
                  </div>
                )}
                {party.missing != null && party.missing > 0 && (
                  <div className="bg-blue-950/20 border border-blue-900/30 rounded p-2 text-center">
                    <p className="text-[9px] text-blue-400/70 uppercase font-semibold">Missing</p>
                    <NumberDisplay value={party.missing} className="text-blue-300 text-sm" />
                  </div>
                )}
                {party.arrested != null && party.arrested > 0 && (
                  <div className="bg-red-950/20 border border-red-900/30 rounded p-2 text-center">
                    <p className="text-[9px] text-red-400/70 uppercase font-semibold">Arrested</p>
                    <NumberDisplay value={party.arrested} className="text-red-300 text-sm" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DeathToll({ deathToll }) {
  const [expandedParties, setExpandedParties] = useState(new Set())
  const [expandedConflict, setExpandedConflict] = useState(
    deathToll?.conflicts ? deathToll.conflicts.length - 1 : 0
  )

  const toggleParty = (key) => {
    setExpandedParties(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  if (!deathToll?.conflicts) return null

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <Skull size={14} className="text-red-400" />
          <span className="text-sm font-semibold text-gray-300">Death Toll Tracker</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Updated: {new Date(deathToll.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {deathToll.conflicts.map((conflict, ci) => (
          <div key={ci}>
            <button
              onClick={() => setExpandedConflict(expandedConflict === ci ? -1 : ci)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-gray-300 hover:text-white"
            >
              <span>{conflict.name}</span>
              {expandedConflict === ci ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <p className="text-[9px] text-gray-600 px-2 mb-1.5">{conflict.period}</p>

            {expandedConflict === ci && (
              <div className="space-y-1.5">
                {conflict.parties.map((party, pi) => {
                  const key = `${ci}-${pi}`
                  return (
                    <PartyRow
                      key={key}
                      party={party}
                      isExpanded={expandedParties.has(key)}
                      onToggle={() => toggleParty(key)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
