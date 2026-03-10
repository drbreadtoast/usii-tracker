import { Fuel, TrendingUp, ArrowRight, Info, Calculator, ExternalLink } from 'lucide-react'
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

function PriceChart() {
  const history = data.priceHistory
  const prices = history.map((d) => d.price)
  const minPrice = Math.floor(Math.min(...prices) * 10) / 10 - 0.1
  const maxPrice = Math.ceil(Math.max(...prices) * 10) / 10 + 0.1

  const chartW = 500
  const chartH = 160
  const padL = 40
  const padR = 10
  const padT = 15
  const padB = 40
  const plotW = chartW - padL - padR
  const plotH = chartH - padT - padB

  const xScale = (i) => padL + (i / (history.length - 1)) * plotW
  const yScale = (p) => padT + plotH - ((p - minPrice) / (maxPrice - minPrice)) * plotH

  const points = history.map((d, i) => `${xScale(i)},${yScale(d.price)}`)
  const polyline = points.join(' ')

  // Area fill path
  const areaPath = `M ${xScale(0)},${yScale(history[0].price)} ` +
    history.map((d, i) => `L ${xScale(i)},${yScale(d.price)}`).join(' ') +
    ` L ${xScale(history.length - 1)},${padT + plotH} L ${xScale(0)},${padT + plotH} Z`

  // Y-axis ticks
  const yTicks = []
  for (let p = Math.ceil(minPrice * 5) / 5; p <= maxPrice; p += 0.2) {
    yTicks.push(Math.round(p * 100) / 100)
  }

  // War start index
  const warIdx = history.findIndex((d) => d.isEvent)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
      <div className="flex items-center gap-1.5 mb-1">
        <TrendingUp size={12} className="text-green-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price History</span>
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL} y1={yScale(tick)} x2={chartW - padR} y2={yScale(tick)}
              stroke="#1f2937" strokeWidth="0.5"
            />
            <text x={padL - 4} y={yScale(tick) + 3} textAnchor="end" fill="#6b7280" fontSize="7">
              ${tick.toFixed(2)}
            </text>
          </g>
        ))}

        {/* War zone background */}
        {warIdx >= 0 && (
          <rect
            x={xScale(warIdx)} y={padT}
            width={xScale(history.length - 1) - xScale(warIdx)} height={plotH}
            fill="#7f1d1d" opacity="0.15"
          />
        )}

        {/* Area fill */}
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#priceGradient)" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points and labels */}
        {history.map((d, i) => {
          const cx = xScale(i)
          const cy = yScale(d.price)
          const isEvent = d.isEvent
          const isToday = d.label === 'TODAY'
          return (
            <g key={d.date}>
              {/* Dot */}
              <circle
                cx={cx} cy={cy} r={isEvent || isToday ? 3 : 1.5}
                fill={isEvent ? '#ef4444' : isToday ? '#f59e0b' : '#9ca3af'}
                stroke={isEvent ? '#991b1b' : 'none'}
                strokeWidth="1"
              />

              {/* Event label */}
              {(isEvent || isToday || d.label === 'Normal market' || d.label === 'Talks collapse') && d.label && (
                <text
                  x={cx}
                  y={cy - 6}
                  textAnchor="middle"
                  fill={isEvent ? '#fca5a5' : isToday ? '#fbbf24' : '#9ca3af'}
                  fontSize="5.5"
                  fontWeight={isEvent || isToday ? 'bold' : 'normal'}
                >
                  {d.label}
                </text>
              )}

              {/* X-axis date labels - show every other or events */}
              {(i % 2 === 0 || isEvent || isToday) && (
                <text
                  x={cx} y={padT + plotH + 12}
                  textAnchor="middle"
                  fill="#4b5563" fontSize="5.5"
                  transform={`rotate(-30, ${cx}, ${padT + plotH + 12})`}
                >
                  {new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              )}
            </g>
          )
        })}

        {/* War start line */}
        {warIdx >= 0 && (
          <line
            x1={xScale(warIdx)} y1={padT}
            x2={xScale(warIdx)} y2={padT + plotH}
            stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2"
          />
        )}
      </svg>
    </div>
  )
}

function BreakdownTable() {
  const { preWar, current } = data.breakdown

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Calculator size={12} className="text-purple-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price Breakdown</span>
      </div>

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

export default function GasPriceTracker() {
  return (
    <div className="space-y-2">
      <PriceComparison />
      <PriceChart />
      <BreakdownTable />
      <ContextNote />
      <div className="flex items-center justify-between text-[8px] text-gray-700 px-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Data:</span>
          <a href="https://gasprices.aaa.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">AAA Gas Prices <ExternalLink size={7} /></a>
          <a href="https://www.eia.gov/petroleum/gasdiesel/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">EIA <ExternalLink size={7} /></a>
        </div>
        <span>Updated: {new Date(data.lastUpdated).toLocaleString()}</span>
      </div>
    </div>
  )
}
