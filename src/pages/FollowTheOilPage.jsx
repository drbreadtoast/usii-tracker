import { useState } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  Fuel, Droplet, ChevronDown, ChevronUp,
  ExternalLink, Shield, TrendingUp, BarChart3, AlertTriangle
} from 'lucide-react'
import oilData from '../data/oil-tracker.json'

// --- Helpers ---

function formatMoney(num) {
  if (num == null) return '$0'
  const abs = Math.abs(num)
  if (abs >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
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

// --- Card Components ---

function KeyPlayerCard({ player }) {
  const [expanded, setExpanded] = useState(false)

  const statusColors = {
    active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-950/30' },
    disrupted: { label: 'Disrupted', color: 'text-amber-400', bg: 'bg-amber-950/30' },
    blocked: { label: 'Blocked', color: 'text-red-400', bg: 'bg-red-950/30' },
  }
  const statusInfo = statusColors[player.exportStatus] || statusColors.active

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Droplet size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{player.flag}</span>
            <h4 className="text-sm font-bold text-gray-100">{player.country}</h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusInfo.color} ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
            {player.netExporter && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-orange-400 bg-orange-950/30">
                Net Exporter
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-amber-400">{player.dailyProductionMbpd}</span>
              <span className="text-[10px] text-gray-600">Mbpd</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-400">{player.globalSharePercent}%</span>
              <span className="text-[10px] text-gray-600">global share</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-400">{player.provenReservesBillionBarrels}B</span>
              <span className="text-[10px] text-gray-600">barrels reserves</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">War Impact</span>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">{player.warImpact}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={player.sourceUrl} label="EIA Country Analysis" />
          </div>
        </div>
      )}
    </div>
  )
}

function KeyFactCard({ fact }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 leading-snug">{fact.fact}</p>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{fact.detail}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={fact.sourceUrl} label={fact.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Page ---

export default function FollowTheOilPage() {
  const { oilPrices, keyPlayers, hormuzImpact, consumerImpact, keyFacts, metadata } = oilData

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Follow the Oil</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <Fuel size={12} className="text-amber-400" />
              <span className="text-amber-400 font-bold">${oilPrices.current.wti.price}</span>
              <span>WTI</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <TrendingUp size={12} className="text-red-400" />
              <span className="text-red-400 font-bold">{oilPrices.current.wti.change}</span>
              <span>since pre-war</span>
            </div>
          </div>
        </div>
      </header>

      {/* Intro Banner */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Fuel size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-gray-200">{metadata.title}</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {metadata.methodology}
              </p>
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

      {/* Price Overview */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <SectionHeader
          icon={BarChart3}
          iconColor="text-amber-400"
          title="Oil Price Overview"
          count={null}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* WTI Card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fuel size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">WTI Crude</span>
              <span className="text-[10px] text-gray-600">(NYMEX)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Pre-War</span>
                <span className="text-lg font-bold text-gray-400">${oilPrices.preWar.wti.price}</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">{oilPrices.preWar.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Current</span>
                <span className="text-lg font-bold text-amber-400">${oilPrices.current.wti.price}</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">{oilPrices.current.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Change</span>
                <span className="text-lg font-bold text-red-400">{oilPrices.current.wti.change}</span>
                <span className="text-[10px] text-red-400/70 block mt-0.5">{oilPrices.current.wti.changeDollars}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
              <SourceLink url={oilPrices.current.wti.sourceUrl} label={oilPrices.current.wti.source} />
            </div>
          </div>

          {/* Brent Card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fuel size={14} className="text-orange-400" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Brent Crude</span>
              <span className="text-[10px] text-gray-600">(ICE)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Pre-War</span>
                <span className="text-lg font-bold text-gray-400">${oilPrices.preWar.brent.price}</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">{oilPrices.preWar.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Current</span>
                <span className="text-lg font-bold text-orange-400">${oilPrices.current.brent.price}</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">{oilPrices.current.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Change</span>
                <span className="text-lg font-bold text-red-400">{oilPrices.current.brent.change}</span>
                <span className="text-[10px] text-red-400/70 block mt-0.5">{oilPrices.current.brent.changeDollars}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
              <SourceLink url={oilPrices.current.brent.sourceUrl} label={oilPrices.current.brent.source} />
            </div>
          </div>
        </div>
      </div>

      {/* Key Players Section */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <SectionHeader
          icon={Droplet}
          iconColor="text-amber-400"
          title="Key Oil Producers"
          count={keyPlayers.length}
        />
        <div className="space-y-2">
          {keyPlayers.map((player, i) => (
            <KeyPlayerCard key={i} player={player} />
          ))}
        </div>
      </div>

      {/* Hormuz Impact Section */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <SectionHeader
          icon={AlertTriangle}
          iconColor="text-red-400"
          title="Strait of Hormuz Blockade"
          count={null}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Droplet size={12} className="text-red-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Barrels Blocked</span>
            </div>
            <span className="text-lg font-bold text-red-400">{(hormuzImpact.barrelsBlockedDaily / 1_000_000).toFixed(0)}M</span>
            <span className="text-[10px] text-gray-600 block">bpd</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 size={12} className="text-amber-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Global Supply</span>
            </div>
            <span className="text-lg font-bold text-amber-400">{hormuzImpact.percentGlobalOilSupply}%</span>
            <span className="text-[10px] text-gray-600 block">of world oil blocked</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-red-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Insurance Spike</span>
            </div>
            <span className="text-lg font-bold text-red-400">{hormuzImpact.insuranceCostSpike}</span>
            <span className="text-[10px] text-gray-600 block">war-risk premium</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Fuel size={12} className="text-orange-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Rerouting</span>
            </div>
            <span className="text-lg font-bold text-orange-400">+{hormuzImpact.tankerReroutingDays}</span>
            <span className="text-[10px] text-gray-600 block">days added per voyage</span>
          </div>
        </div>

        {/* Affected countries breakdown */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Affected Countries</span>
          <div className="mt-2 space-y-2">
            {hormuzImpact.affectedCountries.map((entry, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded px-3 py-2">
                <span className="text-xs font-medium text-gray-300">{entry.country}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-red-400">{entry.blockedExportsMbpd}</span>
                    <span className="text-[10px] text-gray-600">Mbpd blocked</span>
                  </div>
                  <span className="text-[10px] text-gray-500 max-w-[200px] text-right hidden sm:inline">{entry.alternativeRoutes}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={hormuzImpact.sourceUrl} label="EIA — World Oil Transit Chokepoints" />
          </div>
        </div>
      </div>

      {/* Consumer Impact Section */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <SectionHeader
          icon={Fuel}
          iconColor="text-orange-400"
          title="Consumer Fuel Prices (US Average)"
          count={consumerImpact.fuels.length}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {consumerImpact.fuels.map((fuel, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{fuel.icon}</span>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{fuel.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Pre-War</span>
                  <span className="text-base font-bold text-gray-400">${fuel.preWar.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Current</span>
                  <span className="text-base font-bold text-orange-400">${fuel.current.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">Change</span>
                  <span className="text-base font-bold text-red-400">{fuel.changePercent}</span>
                  <span className="text-[10px] text-red-400/70 block">{fuel.change}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{fuel.detail}</p>
              <div className="flex items-center justify-end mt-2">
                <SourceLink url={fuel.sourceUrl} label="EIA" />
              </div>
            </div>
          ))}
        </div>

        {/* Household Impact */}
        {consumerImpact.householdImpact && (
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-xs font-bold text-red-300">Average US Household Impact</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap mb-2">
              <div>
                <span className="text-lg font-bold text-red-400">+${consumerImpact.householdImpact.averageMonthlyIncrease}</span>
                <span className="text-[10px] text-gray-500 block">per month</span>
              </div>
              <div>
                <span className="text-lg font-bold text-red-400">${consumerImpact.householdImpact.annualizedCost.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 block">annualized</span>
              </div>
            </div>
            <div className="space-y-1 mt-2">
              {consumerImpact.householdImpact.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-900/40 rounded px-3 py-1.5">
                  <span className="text-xs text-gray-400">{item.category}</span>
                  <span className="text-xs font-bold text-red-400">+${item.monthlyIncrease}/mo</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{consumerImpact.householdImpact.detail}</p>
          </div>
        )}
      </div>

      {/* Key Facts Section */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <SectionHeader
          icon={AlertTriangle}
          iconColor="text-amber-400"
          title="Key Facts"
          count={keyFacts.length}
        />
        <div className="space-y-2">
          {keyFacts.map(fact => (
            <KeyFactCard key={fact.id} fact={fact} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">LIVEFRONT</span>
              <span>Follow the Oil &mdash; Global Oil Market Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Data from EIA, OPEC, IEA, and Reuters commodity reports.</span>
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
