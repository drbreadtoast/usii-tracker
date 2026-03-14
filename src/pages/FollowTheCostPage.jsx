import { useState, useMemo } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  Receipt, ChevronDown, ChevronUp, ExternalLink, Shield,
  AlertTriangle, DollarSign, TrendingUp, TrendingDown, Anchor, Plane,
  Users, Package, BarChart3, Building2, Ship
} from 'lucide-react'
import costData from '../data/war-costs.json'

// --- Helpers ---

function formatMoney(num) {
  if (num == null) return '$0'
  const abs = Math.abs(num)
  if (abs >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(1)}T`
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

const COUNTRY_COLORS = {
  us: { accent: 'text-blue-400', bg: 'bg-blue-950/20', border: 'border-blue-900/40', bar: 'bg-blue-500/60' },
  israel: { accent: 'text-cyan-400', bg: 'bg-cyan-950/20', border: 'border-cyan-900/40', bar: 'bg-cyan-500/60' },
  iran: { accent: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-900/40', bar: 'bg-red-500/60' },
}

const COUNTRY_FLAGS = { us: '\u{1F1FA}\u{1F1F8}', israel: '\u{1F1EE}\u{1F1F1}', iran: '\u{1F1EE}\u{1F1F7}' }

// --- Country Cost Card ---

function CountryCostCard({ countryKey, data }) {
  const [expanded, setExpanded] = useState(false)
  const colors = COUNTRY_COLORS[countryKey] || COUNTRY_COLORS.us
  const directTotal = data.directMilitaryCosts?.total || 0
  const indirectTotal = data.indirectCosts?.total || 0
  const directBreakdown = data.directMilitaryCosts?.breakdown || {}
  const indirectBreakdown = data.indirectCosts?.breakdown || {}
  const maxCategory = Math.max(
    ...Object.values(directBreakdown).map(b => b.amount || 0),
    ...Object.values(indirectBreakdown).map(b => b.amount || 0)
  )

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-4 hover:bg-gray-900/80 transition-colors">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">{data.flag}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold ${colors.accent}`}>{data.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Direct Military</span>
                <span className="text-lg font-bold text-green-400">{formatMoney(directTotal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Indirect Costs</span>
                <span className="text-lg font-bold text-amber-400">{formatMoney(indirectTotal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Combined</span>
                <span className="text-lg font-bold text-gray-100">{formatMoney(directTotal + indirectTotal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Daily Burn</span>
                <span className="text-lg font-bold text-orange-400 animate-pulse">{formatMoney(data.dailyBurnRate)}</span>
                <span className="text-[10px] text-gray-600 block">/day</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-gray-600 pt-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-800/50">
          <div className="pt-3">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Direct Military Cost Breakdown</span>
            <div className="mt-2 space-y-2">
              {Object.entries(directBreakdown).map(([key, item]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xs font-bold text-green-400">{formatMoney(item.amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${maxCategory > 0 ? (item.amount / maxCategory) * 100 : 0}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.description}</p>
                  <SourceLink url={item.sourceUrl} label={item.source} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Indirect / Economic Cost Breakdown</span>
            <div className="mt-2 space-y-2">
              {Object.entries(indirectBreakdown).map(([key, item]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xs font-bold text-amber-400">{formatMoney(item.amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 bg-amber-500/40" style={{ width: `${maxCategory > 0 ? (item.amount / maxCategory) * 100 : 0}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.description}</p>
                  <SourceLink url={item.sourceUrl} label={item.source} />
                </div>
              ))}
            </div>
          </div>
          {data.dailyBurnRateNote && (
            <div className={`${colors.bg} border ${colors.border} rounded-lg px-3 py-2`}>
              <p className={`text-[10px] ${colors.accent} leading-relaxed italic`}>
                <DollarSign size={10} className="inline mr-1 -mt-0.5" />
                {data.dailyBurnRateNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- Weapon Cost Table ---

function WeaponCostTable({ weapons }) {
  const grouped = useMemo(() => {
    const groups = { us: [], israel: [], iran: [] }
    weapons.forEach(w => { if (groups[w.country]) groups[w.country].push(w) })
    Object.values(groups).forEach(arr => arr.sort((a, b) => b.totalCost - a.totalCost))
    return groups
  }, [weapons])

  const maxTotal = Math.max(...weapons.map(w => w.totalCost))

  function CountryWeaponGroup({ countryKey, items }) {
    if (!items.length) return null
    const colors = COUNTRY_COLORS[countryKey]
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 border-b border-gray-800">
          <span className="text-sm">{COUNTRY_FLAGS[countryKey]}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.accent}`}>
            {countryKey === 'us' ? 'United States' : countryKey === 'israel' ? 'Israel' : 'Iran'}
          </span>
          <span className="text-[10px] text-gray-600">{items.length} systems</span>
        </div>
        {items.map((w, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-900/80 transition-colors">
            <div className="col-span-5">
              <span className="text-xs font-medium text-gray-200">{w.weapon}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-xs text-gray-400 font-mono">{formatMoney(w.unitCost)}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-xs text-gray-400 font-mono">{w.quantityUsed.toLocaleString()}</span>
            </div>
            <div className="col-span-3">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-bold text-green-400">{formatMoney(w.totalCost)}</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${(w.totalCost / maxTotal) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden">
      <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 border-b border-gray-800 bg-gray-900/80">
        <div className="col-span-5 text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Weapon System</div>
        <div className="col-span-2 text-right text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Unit Cost</div>
        <div className="col-span-2 text-right text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Qty Used</div>
        <div className="col-span-3 text-right text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Total Cost</div>
      </div>
      <CountryWeaponGroup countryKey="us" items={grouped.us} />
      <CountryWeaponGroup countryKey="israel" items={grouped.israel} />
      <CountryWeaponGroup countryKey="iran" items={grouped.iran} />
      <div className="px-3 py-2.5 border-t border-gray-700 bg-gray-900/80 flex items-center justify-between">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total ({weapons.length} systems)</span>
        <span className="text-sm font-bold text-green-400">{formatMoney(weapons.reduce((s, w) => s + w.totalCost, 0))}</span>
      </div>
    </div>
  )
}

// --- Aid Package Card ---

function AidPackageCard({ pkg }) {
  const [expanded, setExpanded] = useState(false)
  const statusStyles = {
    enacted: { label: 'Enacted', cls: 'text-green-400 bg-green-950/30 border-green-900/50' },
    pending: { label: 'Pending', cls: 'text-amber-400 bg-amber-950/30 border-amber-900/50' },
  }
  const status = statusStyles[pkg.status] || statusStyles.enacted
  const displayAmount = pkg.amount
    ? formatMoney(pkg.amount)
    : pkg.estimatedRange ? `${formatMoney(pkg.estimatedRange.low)} - ${formatMoney(pkg.estimatedRange.high)}` : 'TBD'

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors">
        <Package size={16} className="text-green-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{pkg.name}</h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${status.cls}`}>{status.label}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-bold text-green-400">{displayAmount}</span>
            <span className="text-[10px] text-gray-600 font-mono">{pkg.date}</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{pkg.description}</p>
          {pkg.legislativeReference && (
            <div className="text-[10px] text-gray-500"><span className="font-semibold text-gray-600">Reference:</span> {pkg.legislativeReference}</div>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={pkg.sourceUrl} label={pkg.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Economic Impact Card ---

function EconomicImpactCard({ title, icon: Icon, data }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors">
        <Icon size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-100">{title}</h4>
          {data.estimatedGlobalCost && <span className="text-sm font-bold text-red-400 mt-1 block">{formatMoney(data.estimatedGlobalCost)}</span>}
          {data.estimatedDollarAmount && <span className="text-sm font-bold text-red-400 mt-1 block">{formatMoney(Math.abs(data.estimatedDollarAmount))}</span>}
          {data.percentageIncrease != null && <span className="text-[10px] text-orange-400 mt-0.5 block">+{data.percentageIncrease}% increase</span>}
          {data.percentage != null && <span className="text-[10px] text-red-400 mt-0.5 block">{data.percentage}% global GDP</span>}
        </div>
        <div className="shrink-0 text-gray-600 pt-1">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>
          {data.preConflictPrice && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                <span className="text-[10px] text-gray-500 block">Pre-Conflict</span>
                <span className="text-xs font-bold text-gray-300">${data.preConflictPrice}/bbl</span>
              </div>
              <div className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                <span className="text-[10px] text-gray-500 block">Current</span>
                <span className="text-xs font-bold text-red-400">${data.currentPrice}/bbl</span>
              </div>
              <div className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                <span className="text-[10px] text-gray-500 block">Peak</span>
                <span className="text-xs font-bold text-orange-400">${data.peakPrice}/bbl</span>
              </div>
            </div>
          )}
          {data.hormuzFlowDisruption && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">
              <p className="text-[10px] text-red-300/80 leading-relaxed">
                <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                Strait of Hormuz flow reduced from {data.hormuzFlowDisruption.normalFlowMBD}M to {data.hormuzFlowDisruption.currentFlowMBD}M bbl/day ({data.hormuzFlowDisruption.percentageReduction}% reduction)
              </p>
            </div>
          )}
          {data.preConflictWarRiskPremium != null && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                <span className="text-[10px] text-gray-500 block">Pre-Conflict Premium</span>
                <span className="text-xs font-bold text-gray-300">{data.preConflictWarRiskPremium}%</span>
              </div>
              <div className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                <span className="text-[10px] text-gray-500 block">Current Premium</span>
                <span className="text-xs font-bold text-red-400">{data.currentWarRiskPremium}%</span>
              </div>
            </div>
          )}
          {data.djiaChange != null && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {[
                { label: 'DJIA', val: data.djiaChange },
                { label: 'S&P 500', val: data.sp500Change },
                { label: 'NASDAQ', val: data.nasdaqChange },
                { label: 'Tel Aviv SE', val: data.telAvivSE },
                { label: 'Tehran SE', val: data.tehranSE },
              ].map(item => (
                <div key={item.label} className="bg-gray-800/40 rounded px-2 py-1.5 text-center">
                  <span className="text-[10px] text-gray-500 block">{item.label}</span>
                  <span className={`text-xs font-bold ${item.val < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {item.val > 0 ? '+' : ''}{item.val}%
                  </span>
                </div>
              ))}
            </div>
          )}
          {data.averageShippingDelayDays && (
            <div className="text-[10px] text-gray-500 mt-1">
              Average shipping delay: <span className="text-amber-400 font-bold">{data.averageShippingDelayDays} days</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={data.sourceUrl} label={data.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Key Fact Card ---

function KeyFactCard({ fact }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 leading-snug">{fact.fact}</p>
          {fact.cost && <span className="text-xs font-bold text-green-400 mt-1.5 inline-block">{formatMoney(fact.cost)}</span>}
        </div>
        <div className="shrink-0 text-gray-600 pt-1">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={fact.sourceUrl} label={fact.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Collapsible Intro Banner ---

function CostIntroBanner({ metadata }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-800/40 transition-colors"
        >
          <Receipt size={18} className="text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-200">{metadata.title}</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Click here to learn more about our sources, methodology, and disclaimer ▾
            </p>
          </div>
          <div className="shrink-0 text-gray-600">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-gray-800/50 space-y-2 pt-3">
            <p className="text-xs text-gray-400 leading-relaxed">{metadata.methodology}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
              {metadata.sources.map((src, i) => (
                <SourceLink key={i} url={src.url} label={src.name} />
              ))}
            </div>
            <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2">
              <p className="text-[10px] text-amber-500/80 leading-relaxed">
                <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                <strong>Important:</strong> {metadata.disclaimer}
              </p>
            </div>
            <div className="text-[10px] text-gray-600">
              Last updated: {new Date(metadata.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles', hour12: true })} PT &middot; Day {metadata.daysOfConflict} of conflict
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main Page ---

export default function FollowTheCostPage() {
  const { us, israel, iran } = costData.countryCosts

  const totalDirectCosts = (us.directMilitaryCosts?.total || 0) + (israel.directMilitaryCosts?.total || 0) + (iran.directMilitaryCosts?.total || 0)
  const totalIndirectCosts = (us.indirectCosts?.total || 0) + (israel.indirectCosts?.total || 0) + (iran.indirectCosts?.total || 0)
  const combinedDailyBurn = (us.dailyBurnRate || 0) + (israel.dailyBurnRate || 0) + (iran.dailyBurnRate || 0)

  const totalAidAmount = useMemo(() => {
    return costData.aidPackages.reduce((sum, pkg) => {
      if (pkg.amount) return sum + pkg.amount
      if (pkg.estimatedRange) return sum + pkg.estimatedRange.low
      return sum
    }, 0)
  }, [])

  const economicSections = [
    { key: 'globalGDPImpact', title: 'Global GDP Impact', icon: TrendingDown, data: costData.economicImpact.globalGDPImpact },
    { key: 'oilPriceShock', title: 'Oil Price Shock', icon: TrendingUp, data: costData.economicImpact.oilPriceShock },
    { key: 'tradeDisruption', title: 'Trade Disruption', icon: Ship, data: costData.economicImpact.tradeDisruption },
    { key: 'shippingInsuranceSurge', title: 'Shipping Insurance Surge (+9,900%)', icon: Shield, data: costData.economicImpact.shippingInsuranceSurge },
    { key: 'stockMarketImpact', title: 'Stock Market Impact', icon: BarChart3, data: costData.economicImpact.stockMarketImpact },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Follow the Cost</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <Receipt size={12} className="text-green-400" />
              <span className="text-green-400 font-bold">{formatMoney(costData.totals.combinedTotalCosts)}</span>
              <span>total cost</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <DollarSign size={12} className="text-orange-400" />
              <span className="text-orange-400 font-bold">{formatMoney(combinedDailyBurn)}</span>
              <span>/day</span>
            </div>
          </div>
        </div>
      </header>

      {/* Intro Banner — Collapsible */}
      <CostIntroBanner metadata={costData.metadata} />

      {/* Cost Overview Stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <SectionHeader icon={DollarSign} iconColor="text-green-400" title="Cost Overview" count={3} />
        <div className="space-y-2">
          <CountryCostCard countryKey="us" data={us} />
          <CountryCostCard countryKey="israel" data={israel} />
          <CountryCostCard countryKey="iran" data={iran} />
        </div>

        {/* Grand Total Card */}
        <div className="mt-3 bg-gradient-to-r from-green-950/30 via-gray-900/60 to-red-950/30 border border-gray-700 rounded-lg p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Direct Military</span>
              <span className="text-2xl font-black text-green-400">{formatMoney(costData.totals.allCountriesDirectMilitary)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Combined Total</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-amber-400">
                {formatMoney(costData.totals.combinedTotalCosts)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Global Economic Impact</span>
              <span className="text-2xl font-black text-red-400">{formatMoney(costData.totals.globalEconomicImpact)}</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-lg font-bold text-orange-400 animate-pulse">{formatMoney(combinedDailyBurn)}</span>
            <span className="text-xs text-gray-500 ml-1">burned every day across all parties</span>
          </div>
        </div>
      </div>

      {/* Weapon Cost Reference */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Shield} iconColor="text-orange-400" title="Weapon System Costs" count={costData.weaponCosts.length} />
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Unit costs, quantities expended, and total expenditure grouped by country. Sorted by total cost descending within each group.
        </p>
        <WeaponCostTable weapons={costData.weaponCosts} />
      </div>

      {/* Naval Deployment Costs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Anchor} iconColor="text-blue-400" title="Naval Deployment Costs" />
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'CSG Daily Cost', value: formatMoney(costData.navalDeployments.carrierGroupDailyCost), sub: '/day per group' },
              { label: 'DDG Daily Cost', value: formatMoney(costData.navalDeployments.destroyerDailyCost), sub: '/day per destroyer' },
              { label: 'Total Assets', value: costData.navalDeployments.totalAssetsDeployed, sub: 'ships deployed' },
              { label: 'Total Naval Cost', value: formatMoney(costData.navalDeployments.totalNavalCost), sub: `${costData.navalDeployments.daysDeployed} days`, highlight: true },
            ].map(item => (
              <div key={item.label} className="bg-blue-950/20 border border-blue-900/30 rounded-lg px-3 py-2 text-center">
                <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">{item.label}</span>
                <span className={`text-sm font-bold ${item.highlight ? 'text-green-400' : 'text-blue-400'}`}>{item.value}</span>
                <span className="text-[10px] text-gray-600 block">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* Carrier Groups */}
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Carrier Strike Groups</span>
            <div className="mt-2 space-y-1.5">
              {costData.navalDeployments.carrierGroups.map((csg, i) => (
                <div key={i} className="bg-gray-800/40 rounded px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ship size={14} className="text-blue-400" />
                    <span className="text-xs text-gray-200 font-medium">{csg.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500">{csg.location}</span>
                    <span className="text-[10px] text-blue-400">{csg.vessels} vessels</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Breakdown */}
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Asset Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {Object.entries(costData.navalDeployments.assetBreakdown).map(([key, count]) => (
                <div key={key} className="bg-gray-800/40 rounded px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs font-bold text-blue-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg px-3 py-2">
            <p className="text-[10px] text-blue-300/80 leading-relaxed italic">
              <Anchor size={10} className="inline mr-1 -mt-0.5" />
              Combined daily fleet cost: <span className="font-bold text-blue-400">{formatMoney(costData.navalDeployments.estimatedDailyCost)}/day</span>. {costData.navalDeployments.estimatedDailyCostNote}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={costData.navalDeployments.sourceUrl} label={costData.navalDeployments.source} />
          </div>
        </div>
      </div>

      {/* US Aid to Israel */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={Package} iconColor="text-green-400" title="US Aid to Israel" count={costData.aidPackages.length} />
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Congressional appropriations, MOU allocations, and emergency supplemental packages.
          Total tracked aid: <span className="text-green-400 font-bold">{formatMoney(totalAidAmount)}</span>
        </p>
        <div className="space-y-2">
          {costData.aidPackages.map(pkg => (
            <AidPackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Economic Ripple Effects */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={BarChart3} iconColor="text-red-400" title="Economic Ripple Effects" count={economicSections.length} />
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Beyond direct military costs, the conflict sends shockwaves through global energy markets, trade routes, and financial systems.
        </p>
        <div className="space-y-2">
          {economicSections.map(section => (
            <EconomicImpactCard key={section.key} title={section.title} icon={section.icon} data={section.data} />
          ))}
        </div>
      </div>

      {/* Key Facts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader icon={AlertTriangle} iconColor="text-amber-400" title="Key Cost Facts" count={costData.keyFacts.length} />
        <div className="space-y-2">
          {costData.keyFacts.map(fact => (
            <KeyFactCard key={fact.id} fact={fact} />
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
              <span className="font-bold text-gray-500">The OSS Report</span>
              <span className="text-blue-400 font-mono text-[9px]">usiitracker.com</span>
              <span>Follow the Cost &mdash; Iran-Israel Conflict Cost Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Data from DoD, CRS, SIPRI, CBO, and official government reports.</span>
            </div>
          </div>
          <div className="bg-gray-800/40 rounded-lg px-4 py-2.5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              <strong>Disclaimer:</strong> {costData.metadata.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Data Sources:</span>
            {costData.metadata.sources.map((src, i) => (
              <SourceLink key={i} url={src.url} label={src.name} />
            ))}
          </div>
        </div>
        </div>
      </footer>
    </div>
  )
}
