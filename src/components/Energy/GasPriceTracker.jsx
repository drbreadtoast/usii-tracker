import { useState } from 'react'
import { Fuel, TrendingUp, ArrowRight, Info, Calculator, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import data from '../../data/gas-prices.json'

function PriceComparison() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Fuel size={12} className="text-amber-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">US Gas Price Impact</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Pre-War</div>
          <div className="text-2xl font-bold text-gray-300">${data.preWarAverage.toFixed(2)}</div>
          <div className="text-[9px] text-gray-600">per gallon</div>
        </div>
        <ArrowRight size={20} className="text-gray-600" />
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Current</div>
          <div className="text-2xl font-bold text-red-400">${data.currentAverage.toFixed(2)}</div>
          <div className="text-[9px] text-gray-600">per gallon</div>
        </div>
        <div className="bg-red-900/50 border border-red-800 rounded-lg px-2.5 py-1.5">
          <div className="text-lg font-bold text-red-400">+{data.changePercent}%</div>
          <div className="text-[8px] text-red-500">increase</div>
        </div>
      </div>
    </div>
  )
}

function PriceChartContent() {
  const history = data.priceHistory
  const prices = history.map((d) => d.price)
  const minPrice = Math.floor(Math.min(...prices) * 10) / 10 - 0.1
  const maxPrice = Math.ceil(Math.max(...prices) * 10) / 10 + 0.1
  const warIdx = history.findIndex((d) => d.isEvent)

  // Truncate labels for chart display
  const shortLabel = (d) => {
    if (!d.label) return ''
    const stripped = d.label.replace(/^Day \d+\s*—?\s*/, '')
    if (stripped.length > 20) return stripped.slice(0, 18) + '…'
    return stripped
  }

  return (
    <div>
      <div className="space-y-0">
        {history.map((d, i) => {
          const pct = ((d.price - minPrice) / (maxPrice - minPrice)) * 100
          const isEvent = d.isEvent
          const dateStr = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          const isWarStart = i === warIdx

          return (
            <div
              key={d.date}
              className={`flex items-center gap-2 py-1 px-1 rounded ${
                isWarStart ? 'bg-red-950/30 border-l-2 border-red-600' :
                i >= warIdx && warIdx >= 0 ? 'bg-red-950/10' : ''
              }`}
            >
              <span className="text-[9px] text-gray-500 w-[52px] shrink-0 text-right font-mono">{dateStr}</span>
              <div className="flex-1 h-3 bg-gray-800/60 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full ${isEvent ? 'bg-gradient-to-r from-amber-600 to-red-500' : 'bg-amber-600/70'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold w-[42px] shrink-0 text-right ${isEvent ? 'text-red-400' : 'text-amber-400'}`}>
                ${d.price.toFixed(2)}
              </span>
              {isEvent && d.label && (
                <span className="text-[8px] text-red-400/80 w-[120px] shrink-0 truncate hidden sm:inline" title={d.label}>
                  {shortLabel(d)}
                </span>
              )}
              {!isEvent && d.label && (d.label === 'Normal market' || d.label === 'Nuclear talks' || d.label === 'Talks collapse') && (
                <span className="text-[8px] text-gray-500 w-[120px] shrink-0 truncate hidden sm:inline">
                  {d.label}
                </span>
              )}
              {!d.label && !isEvent && <span className="w-[120px] shrink-0 hidden sm:inline" />}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-600/70" />
          <span className="text-[8px] text-gray-500">Pre-war</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-600 to-red-500" />
          <span className="text-[8px] text-gray-500">War event</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-red-950/30 border-l-2 border-red-600 rounded-sm" />
          <span className="text-[8px] text-gray-500">War begins (Feb 28)</span>
        </div>
      </div>
    </div>
  )
}

function BreakdownContent() {
  const { preWar, current } = data.breakdown

  return (
    <div>
      {/* Formula */}
      <div className="bg-gray-950 border border-gray-800 rounded px-2 py-1.5 mb-2">
        <div className="text-[9px] text-gray-500 mb-0.5">Formula:</div>
        <div className="text-[10px] text-amber-400 font-mono">{data.formula}</div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[9px]">
          <thead>
            <tr className="text-gray-600 border-b border-gray-800">
              <th className="text-left py-1 pr-1 font-medium">Component</th>
              <th className="text-right py-1 px-1 font-medium">{preWar.label}</th>
              <th className="text-right py-1 px-1 font-medium">{current.label}</th>
              <th className="text-right py-1 pl-1 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {current.components.map((comp, i) => {
              const preComp = preWar.components[i]
              const maxVal = Math.max(
                ...current.components.map(c => c.value),
                ...preWar.components.map(c => c.value)
              )
              const preBarW = (preComp.value / maxVal) * 100
              const curBarW = (comp.value / maxVal) * 100
              const hasChange = comp.change && comp.change !== '$0.00'

              return (
                <tr key={comp.name} className="border-b border-gray-800/50">
                  <td className="py-1.5 pr-1">
                    <div className="text-gray-300 font-medium">{comp.name}</div>
                    <div className="text-[8px] text-gray-600">{comp.formula}</div>
                  </td>
                  <td className="py-1.5 px-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-500 rounded-full"
                          style={{ width: `${preBarW}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-8 text-right">${preComp.value.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${curBarW}%` }}
                        />
                      </div>
                      <span className="text-amber-400 w-8 text-right">${comp.value.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className={`py-1.5 pl-1 text-right font-medium ${hasChange ? 'text-red-400' : 'text-gray-600'}`}>
                    {comp.change || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700">
              <td className="py-1.5 pr-1 text-gray-300 font-bold">Subtotal</td>
              <td className="py-1.5 px-1 text-right text-gray-400 font-bold">${preWar.total.toFixed(2)}</td>
              <td className="py-1.5 px-1 text-right text-amber-400 font-bold">${current.total.toFixed(2)}</td>
              <td className="py-1.5 pl-1 text-right text-red-400 font-bold">
                +${(current.total - preWar.total).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      <div className="mt-2 space-y-1">
        <div className="text-[8px] text-gray-600 flex items-start gap-1">
          <span className="text-gray-500 shrink-0">Pre-war:</span> {preWar.note}
        </div>
        <div className="text-[8px] text-gray-600 flex items-start gap-1">
          <span className="text-amber-600 shrink-0">Current:</span> {current.note}
        </div>
      </div>
    </div>
  )
}

function ContextNote() {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-2 flex items-start gap-2">
      <Info size={12} className="text-blue-400 shrink-0 mt-0.5" />
      <div>
        <div className="text-[9px] font-semibold text-gray-400 mb-0.5">How oil becomes gasoline</div>
        <p className="text-[9px] text-gray-600 leading-relaxed">{data.context}</p>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, iconColor, hint, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={12} className={iconColor} />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-blue-400">{hint}</span>
          {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-gray-800 p-2">
          {children}
        </div>
      )}
    </div>
  )
}

export default function GasPriceTracker() {
  return (
    <div className="space-y-2">
      <PriceComparison />

      <CollapsibleSection
        title="Price History — US Gas Average ($/gal)"
        icon={TrendingUp}
        iconColor="text-green-400"
        hint="Click to view price history ▸"
      >
        <PriceChartContent />
      </CollapsibleSection>

      <CollapsibleSection
        title="Price Breakdown"
        icon={Calculator}
        iconColor="text-purple-400"
        hint="Click to see what makes up the price ▸"
      >
        <BreakdownContent />
      </CollapsibleSection>

      <ContextNote />
      <div className="flex items-center justify-between text-[8px] text-gray-700 px-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Data:</span>
          <a href="https://gasprices.aaa.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">AAA Gas Prices <ExternalLink size={7} /></a>
          <a href="https://www.eia.gov/petroleum/gasdiesel/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">EIA <ExternalLink size={7} /></a>
        </div>
        <span>Updated: {new Date(data.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles', hour12: true })} PT</span>
      </div>
    </div>
  )
}
