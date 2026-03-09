import { useState } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  Target, ChevronDown, ChevronUp, ExternalLink,
  Shield, AlertTriangle, Crosshair, Bomb, Rocket, Factory, BarChart3, Swords,
  Scale, Clock, TrendingDown, MessageCircle
} from 'lucide-react'
import munitionsData from '../data/munitions-data.json'

// --- Helpers ---

function formatMoney(num) {
  if (num == null) return '$0'
  const abs = Math.abs(num)
  if (abs >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
  return `$${num.toLocaleString()}`
}

function SourceLink({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded transition-colors"
    >
      {label} <ExternalLink size={8} />
    </a>
  )
}

function SectionHeader({ icon: Icon, iconColor, title, count }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex items-center gap-2">
        <Icon size={18} className={iconColor} />
        <h2 className="text-lg font-bold text-gray-100">{title}</h2>
      </div>
      <div className="h-px flex-1 bg-gray-800" />
      {count != null && (
        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {count} items
        </span>
      )}
    </div>
  )
}

// --- Badge Config ---

const typeColors = {
  cruise_missile: { label: 'Cruise Missile', color: 'text-blue-400', bg: 'bg-blue-950/30' },
  ballistic_missile: { label: 'Ballistic Missile', color: 'text-orange-400', bg: 'bg-orange-950/30' },
  bomb: { label: 'Bomb', color: 'text-red-400', bg: 'bg-red-950/30' },
  interceptor: { label: 'Interceptor', color: 'text-cyan-400', bg: 'bg-cyan-950/30' },
  drone: { label: 'Drone', color: 'text-purple-400', bg: 'bg-purple-950/30' },
  fighter: { label: 'Fighter', color: 'text-emerald-400', bg: 'bg-emerald-950/30' },
}

const statusColors = {
  operational: { label: 'Operational', color: 'text-green-400', bg: 'bg-green-950/30' },
  limited: { label: 'Limited', color: 'text-amber-400', bg: 'bg-amber-950/30' },
  depleted: { label: 'Depleted', color: 'text-red-400', bg: 'bg-red-950/30' },
}

const countryAccent = {
  us: { color: 'text-blue-400', border: 'border-blue-900/40', barColor: '#3b82f6' },
  israel: { color: 'text-cyan-400', border: 'border-cyan-900/40', barColor: '#22d3ee' },
  iran: { color: 'text-red-400', border: 'border-red-900/40', barColor: '#ef4444' },
}

// --- Card Components ---

function ArsenalCard({ weapon }) {
  const [expanded, setExpanded] = useState(false)
  const tInfo = typeColors[weapon.type] || typeColors.bomb
  const sInfo = statusColors[weapon.status] || statusColors.operational

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Crosshair size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{weapon.name}</h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tInfo.color} ${tInfo.bg}`}>
              {tInfo.label}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sInfo.color} ${sInfo.bg}`}>
              {sInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-green-400" />
              <span className="text-sm font-bold text-gray-200">{weapon.quantity.toLocaleString()}</span>
              <span className="text-[10px] text-gray-600">confirmed</span>
            </div>
            {weapon.estimatedQuantity && (
              <div className="flex items-center gap-1">
                <AlertTriangle size={10} className="text-amber-400" />
                <span className="text-xs font-medium text-amber-400">{weapon.estimatedQuantity.quantity.toLocaleString()}</span>
                <span className="text-[10px] text-gray-600">estimated</span>
              </div>
            )}
            {weapon.rumoredQuantity && (
              <div className="flex items-center gap-1">
                <MessageCircle size={10} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-400">{weapon.rumoredQuantity.quantity.toLocaleString()}</span>
                <span className="text-[10px] text-gray-600">rumored</span>
              </div>
            )}
            {weapon.range_km && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-amber-400">{weapon.range_km.toLocaleString()}</span>
                <span className="text-[10px] text-gray-600">km range</span>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{weapon.description}</p>

          {/* Inventory Tiers */}
          <div className="space-y-2">
            {/* Confirmed Tier */}
            <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Shield size={11} className="text-green-400" />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Confirmed Inventory</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-lg font-bold text-green-400">{weapon.quantity.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 ml-1">total</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-300">{weapon.deployed.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-600">deployed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-400">{weapon.inReserve.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-600">reserve</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <SourceLink url={weapon.sourceUrl} label="View Source" />
              </div>
            </div>

            {/* Estimated Tier */}
            {weapon.estimatedQuantity && (
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={11} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Estimated Inventory</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-amber-400">{weapon.estimatedQuantity.quantity.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 ml-1">estimated total</span>
                </div>
                {weapon.estimatedQuantity.note && (
                  <p className="text-[10px] text-amber-600 mt-1.5 italic leading-relaxed">{weapon.estimatedQuantity.note}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <SourceLink url={weapon.estimatedQuantity.sourceUrl} label={weapon.estimatedQuantity.source} />
                </div>
              </div>
            )}

            {/* Rumored Tier */}
            {weapon.rumoredQuantity && (
              <div className="bg-purple-950/20 border border-dashed border-purple-900/40 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageCircle size={11} className="text-purple-400" />
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Rumored / Unverified</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-purple-400">{weapon.rumoredQuantity.quantity.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 ml-1">rumored total</span>
                </div>
                {weapon.rumoredQuantity.note && (
                  <p className="text-[10px] text-purple-600 mt-1.5 italic leading-relaxed">{weapon.rumoredQuantity.note}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <SourceLink url={weapon.rumoredQuantity.sourceUrl} label={weapon.rumoredQuantity.source} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ConflictUseCard({ usage }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Bomb size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{usage.weapon}</h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${usage.confirmed ? 'text-green-400 bg-green-950/30' : 'text-amber-400 bg-amber-950/30'}`}>
              {usage.confirmed ? 'Confirmed' : 'Unconfirmed'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-red-400">{usage.quantityUsed.toLocaleString()}</span>
              <span className="text-[10px] text-gray-600">used</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">{usage.dateRange}</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Targets</span>
            <ul className="mt-1 space-y-1">
              {usage.targets.map((t, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-red-500 mt-1 shrink-0">&#8226;</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={usage.sourceUrl} label="View Source" />
          </div>
        </div>
      )}
    </div>
  )
}

function DefenseCard({ countryKey, country }) {
  const [expanded, setExpanded] = useState(false)
  const ds = country.defenseSystem
  const accent = countryAccent[countryKey]
  const rateColor = ds.interceptRate >= 80 ? 'text-green-400' : ds.interceptRate >= 60 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className={`bg-gray-900/60 border ${accent.border} rounded-lg overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 hover:bg-gray-900/80 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{country.flag}</span>
            <span className={`text-xs font-bold ${accent.color}`}>{country.name}</span>
          </div>
          <div className="text-gray-600">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 leading-snug">{ds.name}</p>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div>
            <span className={`text-lg font-bold ${accent.color}`}>{ds.interceptorCount.toLocaleString()}</span>
            <span className="text-[10px] text-gray-600 block">interceptors</span>
          </div>
          <div>
            <span className={`text-lg font-bold ${rateColor}`}>{ds.interceptRate}%</span>
            <span className="text-[10px] text-gray-600 block">intercept rate</span>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Interceptor Breakdown</span>
            <div className="mt-1 space-y-1">
              {Object.entries(ds.interceptorBreakdown).map(([sys, count]) => (
                <div key={sys} className="flex items-center justify-between bg-gray-800/40 rounded px-3 py-1.5">
                  <span className="text-xs text-gray-300">{sys}</span>
                  <span className={`text-xs font-bold ${accent.color}`}>{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Notes</span>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">{ds.notes}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={ds.sourceUrl} label="View Source" />
          </div>
        </div>
      )}
    </div>
  )
}

function ProductionCard({ countryKey, country }) {
  const [expanded, setExpanded] = useState(false)
  const accent = countryAccent[countryKey]

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Factory size={16} className={`${accent.color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{country.flag}</span>
            <h4 className="text-sm font-bold text-gray-100">{country.name}</h4>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {Object.entries(country.production.monthlyRate).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1">
                <span className={`text-xs font-bold ${accent.color}`}>{val}</span>
                <span className="text-[10px] text-gray-600">{key}/mo</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Wartime Surge Capacity</span>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">{country.production.wartimeSurgeCapacity}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Key Facilities</span>
            <ul className="mt-1 space-y-1">
              {country.production.keyFacilities.map((f, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className={`${accent.color} mt-1 shrink-0`}>&#8226;</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function UnconfirmedCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const likelihoodInfo = item.likelihood === 'probable'
    ? { label: 'Probable', color: 'text-amber-400', bg: 'bg-amber-950/30' }
    : { label: 'Possible', color: 'text-yellow-400', bg: 'bg-yellow-950/30' }

  return (
    <div className="bg-gray-900/60 rounded-lg border border-red-900/40 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-red-400 bg-red-950/30 uppercase tracking-wider">
              Unconfirmed
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${likelihoodInfo.color} ${likelihoodInfo.bg}`}>
              {likelihoodInfo.label}
            </span>
          </div>
          <p className="text-sm text-gray-200 leading-snug">{item.claim}</p>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Reasoning</span>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">{item.reasoning}</p>
          </div>
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2">
            <p className="text-[10px] text-amber-500/80 leading-relaxed">
              <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
              <strong>Disclaimer:</strong> {item.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
            {item.sources.map((src, i) => {
              try {
                const url = new URL(src)
                return <SourceLink key={i} url={src} label={url.hostname.replace('www.', '')} />
              } catch {
                return <span key={i} className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{src}</span>
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Page ---

export default function FollowTheMunitionsPage() {
  const { metadata, countries, unconfirmed, costPerUnit, productionHistory, conflictExpenditure } = munitionsData
  const countryKeys = ['us', 'israel', 'iran']

  const [costSort, setCostSort] = useState('cost-desc')
  const sortedCosts = [...costPerUnit].sort((a, b) => {
    if (costSort === 'cost-desc') return b.costUsd - a.costUsd
    if (costSort === 'cost-asc') return a.costUsd - b.costUsd
    return a.country.localeCompare(b.country)
  })

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Follow the Munitions</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <Target size={12} className="text-red-400" />
              <span className="text-red-400 font-bold">{conflictExpenditure.grandTotalFormatted}</span>
              <span>total spent</span>
            </div>
          </div>
        </div>
      </header>

      {/* Intro Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-gray-200">{metadata.title}</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{metadata.methodology}</p>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
                {metadata.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded hover:text-blue-300 transition-colors"
                  >
                    {src.name}
                  </a>
                ))}
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mt-2">
                <p className="text-[10px] text-amber-500/80 leading-relaxed">
                  <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                  <strong>Important:</strong> {metadata.disclaimer}
                </p>
              </div>
              <div className="text-[10px] text-gray-600 mt-2">
                Last updated: {metadata.lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Expenditure Overview */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <SectionHeader icon={BarChart3} iconColor="text-red-400" title="Conflict Expenditure Overview" count={null} />
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Swords size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Grand Total Munitions Cost</span>
          </div>
          <span className="text-3xl font-bold text-red-400">{conflictExpenditure.grandTotalFormatted}</span>
          <p className="text-[10px] text-gray-500 mt-1">{conflictExpenditure.summary}</p>
          <p className="text-[10px] text-gray-600 mt-1 italic">{conflictExpenditure.notes}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {countryKeys.map(key => {
            const data = conflictExpenditure.byCountry[key]
            const accent = countryAccent[key]
            return (
              <div key={key} className={`bg-gray-900/60 border ${accent.border} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{countries[key].flag}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${accent.color}`}>{countries[key].name}</span>
                </div>
                <span className={`text-2xl font-bold ${accent.color}`}>{data.totalFormatted}</span>
                <div className="mt-3 space-y-1.5">
                  {data.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300">{b.weapon}</span>
                        <span className="text-[10px] text-gray-600">x{b.qty}</span>
                      </div>
                      <span className={`text-xs font-bold ${accent.color}`}>{formatMoney(b.totalCost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cost Asymmetry & Sustainability Analysis */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <SectionHeader icon={Scale} iconColor="text-amber-400" title="Cost-to-Defend Analysis" count={null} />
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Comparative cost data showing the relationship between offensive munition costs and the defensive interceptors required to neutralize them. All figures sourced from CSIS, CRS, and SIPRI.
        </p>

        {/* Cost Matchup Table */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden mb-4">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] gap-x-4 px-4 py-2 border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
            <span>🇮🇷 Offensive System</span>
            <span className="text-right">Attack Cost</span>
            <span>Interceptor Required</span>
            <span className="text-right">Intercept Cost</span>
            <span className="text-right">Cost Ratio</span>
          </div>
          {[
            { attack: 'Shahed-136 Drone', attackCost: '$20K', defender: '🇮🇱 Iron Dome Tamir', defCost: '$50K', ratio: '1 : 2.5', ratioNote: 'Defender pays 2.5x more', color: 'text-amber-400' },
            { attack: 'Shahed-136 Drone', attackCost: '$20K', defender: '🇺🇸 SM-6 ERAM', defCost: '$4.5M', ratio: '1 : 225', ratioNote: 'Defender pays 225x more', color: 'text-red-400' },
            { attack: 'Fateh-110 SRBM', attackCost: '$200K', defender: '🇮🇱 David\'s Sling Stunner', defCost: '$1M', ratio: '1 : 5', ratioNote: 'Defender pays 5x more', color: 'text-amber-400' },
            { attack: 'Shahab-3/Emad MRBM', attackCost: '$500K', defender: '🇮🇱 Arrow-3', defCost: '$2.5M', ratio: '1 : 5', ratioNote: 'Defender pays 5x more', color: 'text-amber-400' },
            { attack: 'Shahab-3/Emad MRBM', attackCost: '$500K', defender: '🇺🇸 SM-3 Block IIA', defCost: '$12M', ratio: '1 : 24', ratioNote: 'Defender pays 24x more', color: 'text-red-400' },
            { attack: 'Khorramshahr MRBM', attackCost: '$800K', defender: '🇺🇸 THAAD Interceptor', defCost: '$11M', ratio: '1 : 13.75', ratioNote: 'Defender pays ~14x more', color: 'text-red-400' },
            { attack: 'Paveh Cruise Missile', attackCost: '$350K', defender: '🇮🇱 Iron Dome Tamir', defCost: '$50K', ratio: '7 : 1', ratioNote: 'Attacker pays 7x more', color: 'text-green-400' },
            { attack: 'Khorramshahr MRBM', attackCost: '$800K', defender: '🇮🇱 Arrow-3', defCost: '$2.5M', ratio: '1 : 3.1', ratioNote: 'Defender pays ~3x more', color: 'text-amber-400' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-gray-800/50 hover:bg-gray-900/80 transition-colors items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-200">{row.attack}</span>
              </div>
              <span className="text-xs text-red-400 font-bold text-right">{row.attackCost}</span>
              <span className="text-xs text-gray-200">{row.defender}</span>
              <span className={`text-xs font-bold text-right ${row.defender.includes('🇮🇱') ? 'text-cyan-400' : 'text-blue-400'}`}>{row.defCost}</span>
              <div className="text-right">
                <span className={`text-xs font-bold ${row.color}`}>{row.ratio}</span>
                <span className="text-[9px] text-gray-600 block">{row.ratioNote}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800/30 rounded-lg px-3 py-2 mb-6">
          <p className="text-[10px] text-gray-500 italic leading-relaxed">
            Note: Standard doctrine requires 2-3 interceptors per inbound threat (shoot-look-shoot), which multiplies actual defense costs by 2-3x. Drone swarm tactics further degrade defender cost efficiency.
            Sources: CSIS Missile Defense Project, CRS, SIPRI Arms Transfers Database.
          </p>
        </div>

        {/* Replenishment Timeline */}
        <SectionHeader icon={Clock} iconColor="text-cyan-400" title="Replenishment Timeline" count={null} />
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Estimated time to replenish munitions expended in the first 7 days of conflict, based on current production rates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {[
            {
              weapon: 'Shahed-136 Drone', country: 'iran', flag: '🇮🇷',
              used: 650, monthlyRate: 500, months: 1.3,
              color: 'text-red-400', barColor: '#ef4444', border: 'border-red-900/40'
            },
            {
              weapon: 'Iron Dome Tamir', country: 'israel', flag: '🇮🇱',
              used: 480, monthlyRate: 120, months: 4.0,
              color: 'text-cyan-400', barColor: '#22d3ee', border: 'border-cyan-900/40'
            },
            {
              weapon: 'Fateh-110 SRBM', country: 'iran', flag: '🇮🇷',
              used: 120, monthlyRate: 40, months: 3.0,
              color: 'text-red-400', barColor: '#ef4444', border: 'border-red-900/40'
            },
            {
              weapon: 'David\'s Sling Stunner', country: 'israel', flag: '🇮🇱',
              used: 65, monthlyRate: 25, months: 2.6,
              color: 'text-cyan-400', barColor: '#22d3ee', border: 'border-cyan-900/40'
            },
            {
              weapon: 'Shahab-3/Emad MRBM', country: 'iran', flag: '🇮🇷',
              used: 85, monthlyRate: 10, months: 8.5,
              color: 'text-red-400', barColor: '#ef4444', border: 'border-red-900/40'
            },
            {
              weapon: 'Arrow-3 Interceptor', country: 'israel', flag: '🇮🇱',
              used: 35, monthlyRate: 8, months: 4.4,
              color: 'text-cyan-400', barColor: '#22d3ee', border: 'border-cyan-900/40'
            },
            {
              weapon: 'BGM-109 Tomahawk', country: 'us', flag: '🇺🇸',
              used: 325, monthlyRate: 40, months: 8.1,
              color: 'text-blue-400', barColor: '#3b82f6', border: 'border-blue-900/40'
            },
            {
              weapon: 'SM-3 Block IIA', country: 'us', flag: '🇺🇸',
              used: 45, monthlyRate: 12, months: 3.75,
              color: 'text-blue-400', barColor: '#3b82f6', border: 'border-blue-900/40'
            },
          ].map((item, i) => {
            const maxMonths = 10
            const barWidth = Math.min((item.months / maxMonths) * 100, 100)
            return (
              <div key={i} className={`bg-gray-900/60 border ${item.border} rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{item.flag}</span>
                  <span className="text-xs font-bold text-gray-100">{item.weapon}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-2">
                  <span><span className="text-red-400 font-bold">{item.used.toLocaleString()}</span> expended</span>
                  <span><span className={`${item.color} font-bold`}>{item.monthlyRate}</span>/month produced</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-800 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${barWidth}%`, backgroundColor: item.barColor, opacity: 0.7 }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${item.color} w-24 text-right`}>
                    {item.months} months
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Spending Ratio */}
        <SectionHeader icon={TrendingDown} iconColor="text-green-400" title="7-Day Expenditure Comparison" count={null} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-red-950/10 border border-red-900/30 rounded-lg p-4 text-center">
            <span className="text-base">🇮🇷</span>
            <span className="text-xs font-bold text-red-400 ml-2">Iran</span>
            <div className="text-2xl font-bold text-red-400 mt-2">$98.1M</div>
            <div className="text-[10px] text-gray-500 mt-1">918 munitions launched</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Avg. cost per munition: ~$107K</div>
          </div>
          <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-lg p-4 text-center">
            <span className="text-base">🇮🇱</span>
            <span className="text-xs font-bold text-cyan-400 ml-2">Israel</span>
            <div className="text-2xl font-bold text-cyan-400 mt-2">$273.5M</div>
            <div className="text-[10px] text-gray-500 mt-1">580 interceptors + 200 strike munitions</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Avg. cost per munition: ~$351K</div>
          </div>
          <div className="bg-blue-950/10 border border-blue-900/30 rounded-lg p-4 text-center">
            <span className="text-base">🇺🇸</span>
            <span className="text-xs font-bold text-blue-400 ml-2">United States</span>
            <div className="text-2xl font-bold text-blue-400 mt-2">$1.59B</div>
            <div className="text-[10px] text-gray-500 mt-1">668 munitions expended</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Avg. cost per munition: ~$2.38M</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Combined US + Israel Expenditure</span>
            <div className="text-xl font-bold text-amber-400 mt-1">$1.865B</div>
            <div className="text-[10px] text-gray-500 mt-1">vs Iran's $98.1M</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-bold text-amber-400">19 : 1</span>
              <span className="text-[10px] text-gray-500">spending ratio (US+Israel : Iran)</span>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Daily Operational Burn Rate</span>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <span className="text-lg font-bold text-blue-400">$2.6B</span>
                <span className="text-[10px] text-gray-600 block">🇺🇸 US/day</span>
              </div>
              <div>
                <span className="text-lg font-bold text-cyan-400">$870M</span>
                <span className="text-[10px] text-gray-600 block">🇮🇱 Israel/day</span>
              </div>
              <div>
                <span className="text-lg font-bold text-red-400">$460M</span>
                <span className="text-[10px] text-gray-600 block">🇮🇷 Iran/day</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              US+Israel combined daily cost: <span className="text-amber-400 font-bold">$3.47B</span> — 7.5x Iran's daily rate
            </div>
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 italic leading-relaxed">
            All expenditure data from DoD Comptroller, Israeli MoD, and SIPRI. Burn rates include all operational costs (personnel, fuel, logistics, munitions) per country. Iran's lower burn rate reflects both lower unit costs and fewer advanced systems deployed.
          </p>
        </div>
      </div>

      {/* Arsenal Comparison */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Crosshair} iconColor="text-red-400" title="Arsenal Comparison" count={null} />
        {countryKeys.map(key => {
          const c = countries[key]
          const accent = countryAccent[key]
          return (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{c.flag}</span>
                <h3 className={`text-sm font-bold ${accent.color}`}>{c.name}</h3>
                <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                  {c.arsenal.length} systems
                </span>
              </div>
              <div className="space-y-2">
                {c.arsenal.map((w, i) => (
                  <ArsenalCard key={i} weapon={w} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Weapons Used in Conflict */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={Bomb}
          iconColor="text-red-400"
          title="Weapons Used in Conflict"
          count={countryKeys.reduce((s, k) => s + countries[k].usedInConflict.length, 0)}
        />
        {countryKeys.map(key => {
          const c = countries[key]
          const accent = countryAccent[key]
          if (c.usedInConflict.length === 0) return null
          return (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{c.flag}</span>
                <h3 className={`text-sm font-bold ${accent.color}`}>{c.name}</h3>
              </div>
              <div className="space-y-2">
                {c.usedInConflict.map((u, i) => (
                  <ConflictUseCard key={i} usage={u} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Defense Systems */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Shield} iconColor="text-cyan-400" title="Defense Systems" count={3} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {countryKeys.map(key => (
            <DefenseCard key={key} countryKey={key} country={countries[key]} />
          ))}
        </div>
      </div>

      {/* Cost Per Unit */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={BarChart3} iconColor="text-amber-400" title="Cost Per Unit Reference" count={costPerUnit.length} />
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Sort:</span>
          {[
            { key: 'cost-desc', label: 'Cost (High-Low)' },
            { key: 'cost-asc', label: 'Cost (Low-High)' },
            { key: 'country', label: 'Country' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setCostSort(opt.key)}
              className={`text-[10px] px-2 py-0.5 rounded transition-colors ${costSort === opt.key ? 'text-blue-400 bg-blue-950/30' : 'text-gray-500 bg-gray-800 hover:text-gray-300'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
            <span>Weapon System</span>
            <span className="text-right">Country</span>
            <span className="text-right">Unit Cost</span>
          </div>
          {sortedCosts.map((item, i) => {
            const accent = countryAccent[item.country] || countryAccent.us
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-gray-800/50 hover:bg-gray-900/80 transition-colors items-center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-gray-200 truncate">{item.weapon}</span>
                  <SourceLink url={item.sourceUrl} label="" />
                </div>
                <span className="text-base">{countries[item.country]?.flag}</span>
                <span className={`text-xs font-bold text-right ${accent.color}`}>
                  {item.costFormatted}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Production Capacity */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Factory} iconColor="text-emerald-400" title="Production Capacity" count={3} />
        <div className="space-y-2">
          {countryKeys.map(key => (
            <ProductionCard key={key} countryKey={key} country={countries[key]} />
          ))}
        </div>
      </div>

      {/* Production History */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Rocket} iconColor="text-amber-400" title="Production History" count={productionHistory.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {productionHistory.map((ph, idx) => {
            const accent = countryAccent[ph.country]
            const maxQty = Math.max(...ph.data.map(d => d.quantity))
            return (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{countries[ph.country]?.flag}</span>
                  <span className="text-sm font-bold text-gray-100">{ph.weapon}</span>
                  <span className="text-[10px] text-gray-600">({ph.unit})</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {ph.data.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 w-10 text-right font-mono">{d.year}</span>
                      <div className="flex-1 h-3 bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${maxQty > 0 ? (d.quantity / maxQty) * 100 : 0}%`,
                            backgroundColor: accent?.barColor || '#6b7280',
                            opacity: 0.7
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-14 text-right ${accent?.color || 'text-gray-300'}`}>
                        {d.quantity.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{ph.notes}</p>
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
                  <SourceLink url={ph.sourceUrl} label="View Source" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Unconfirmed Intel */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={AlertTriangle} iconColor="text-red-400" title="Unconfirmed Intelligence" count={unconfirmed.length} />
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-red-500/80 leading-relaxed">
            <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
            <strong>Warning:</strong> The following claims are unverified and based on open-source analysis. They should not be treated as confirmed facts.
          </p>
        </div>
        <div className="space-y-2">
          {unconfirmed.map(item => (
            <UnconfirmedCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">USII Tracker</span>
              <span className="text-blue-400 font-mono text-[9px]">usiitracker.com</span>
              <span>Follow the Munitions &mdash; Conflict Munitions Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Data from CSIS, SIPRI, IISS, DoD, CRS, and FAS.</span>
            </div>
          </div>
          <div className="bg-gray-800/40 rounded-lg px-4 py-2.5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              <strong>Disclaimer:</strong> {metadata.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Data Sources:</span>
            {metadata.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded hover:text-blue-300 transition-colors"
              >
                {src.name}
              </a>
            ))}
          </div>
        </div>
        </div>
      </footer>
    </div>
  )
}
