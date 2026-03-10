import { Anchor, Ship, AlertTriangle, Clock, ShieldAlert, Waves, Skull, Ban, ExternalLink } from 'lucide-react'
import data from '../../data/hormuz-shipping.json'

const statusColors = {
  effectively_closed: { bg: 'bg-red-900/50', border: 'border-red-600', text: 'text-red-400', dot: 'bg-red-500' },
  blocked: { bg: 'bg-red-900/40', border: 'border-red-700', text: 'text-red-400', dot: 'bg-red-500' },
  partially_blocked: { bg: 'bg-amber-900/40', border: 'border-amber-700', text: 'text-amber-400', dot: 'bg-amber-500' },
  open: { bg: 'bg-green-900/40', border: 'border-green-700', text: 'text-green-400', dot: 'bg-green-500' },
}

function StatusBar() {
  const colors = statusColors[data.straitStatus] || statusColors.blocked
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg px-3 py-2 flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors.dot}`} />
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
          Strait of Hormuz: {data.straitStatus.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <Clock size={10} />
        <span>Day {data.blockadeDay} of blockade</span>
      </div>
    </div>
  )
}

function StatsGrid() {
  const stats = [
    {
      icon: <Clock size={14} className="text-red-400" />,
      label: 'Blockade Day',
      value: data.blockadeDay,
      sub: `Since ${new Date(data.blockadeStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    },
    {
      icon: <Anchor size={14} className="text-amber-400" />,
      label: 'Vessels Anchored',
      value: data.statistics.vesselsAnchored,
      sub: `${data.statistics.vesselsDamaged} damaged, ${data.statistics.vesselsSunk} sunk`,
    },
    {
      icon: <Ship size={14} className="text-blue-400" />,
      label: 'Daily Barrels',
      value: `${(data.statistics.currentDailyBarrels / 1000000).toFixed(0)}/${(data.statistics.normalDailyBarrels / 1000000).toFixed(0)}M`,
      sub: 'Current vs normal flow',
    },
    {
      icon: <Ban size={14} className="text-red-400" />,
      label: 'Global Oil Cut',
      value: `${data.statistics.globalOilSharePercent}%`,
      sub: 'Of world supply blocked',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {stats.map((s) => (
        <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-center">
          <div className="flex justify-center mb-1">{s.icon}</div>
          <div className="text-sm font-bold text-gray-100">{s.value}</div>
          <div className="text-[9px] text-gray-500 leading-tight">{s.label}</div>
          <div className="text-[8px] text-gray-600 mt-0.5">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}

function Timeline() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Waves size={12} className="text-blue-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Blockade Timeline</span>
      </div>
      <div className="space-y-1">
        {data.timeline.map((entry, i) => {
          const isBlocked = entry.status === 'blocked' || entry.status === 'effectively_closed'
          const dotColor = isBlocked ? 'bg-red-500' : 'bg-amber-500'
          const isLast = i === data.timeline.length - 1
          return (
            <div key={entry.date} className="flex items-start gap-2">
              <div className="flex flex-col items-center pt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                {!isLast && <div className="w-px h-full bg-gray-800 min-h-[12px]" />}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-600 font-mono shrink-0">
                    {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-[8px] px-1 py-0.5 rounded font-medium ${
                    isBlocked ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'
                  }`}>
                    {entry.barrels === 0 ? '0 bbl' : `${(entry.barrels / 1000000).toFixed(0)}M bbl`}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{entry.event}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ImpactTable() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle size={12} className="text-red-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Commodity Impact</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="text-gray-600 border-b border-gray-800">
              <th className="text-left py-1 pr-2 font-medium">Commodity</th>
              <th className="text-left py-1 pr-2 font-medium">Normal</th>
              <th className="text-left py-1 pr-2 font-medium">Current</th>
              <th className="text-right py-1 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.impactedGoods.map((item) => (
              <tr key={item.commodity} className="border-b border-gray-800/50">
                <td className="py-1.5 pr-2 text-gray-300 font-medium">{item.commodity}</td>
                <td className="py-1.5 pr-2 text-gray-500">{item.normalFlow}</td>
                <td className="py-1.5 pr-2 text-red-400 font-medium">{item.currentFlow}</td>
                <td className="py-1.5 text-right">
                  <span className="bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded font-bold">
                    {item.priceImpact}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {data.impactedGoods.map((item) => (
          <span key={item.commodity} className="text-[8px] text-gray-600 bg-gray-800/50 px-1.5 py-0.5 rounded">
            {item.commodity}: {item.detail}
          </span>
        ))}
      </div>
    </div>
  )
}

function NaviesPresent() {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <ShieldAlert size={10} className="text-blue-400 shrink-0" />
      <span className="text-[9px] text-gray-600">Naval forces present:</span>
      <div className="flex gap-1 flex-wrap">
        {data.statistics.naviesPresent.map((navy) => (
          <span key={navy} className="text-[8px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900/50">
            {navy}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HormuzStatus() {
  return (
    <div className="space-y-2">
      <StatusBar />
      <StatsGrid />
      <Timeline />
      <ImpactTable />
      <NaviesPresent />
      <div className="space-y-1 px-1">
        <div className="flex items-center gap-2 text-[8px] text-gray-700">
          <span className="text-gray-600">Data:</span>
          <a href="https://www.lloydslist.com/LL1149520/Shipping-disruption-tracker" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">Lloyd's List <ExternalLink size={7} /></a>
          <a href="https://www.marinetraffic.com/en/ais/home" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">MarineTraffic <ExternalLink size={7} /></a>
          <a href="https://www.reuters.com/business/energy/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">Reuters Energy <ExternalLink size={7} /></a>
        </div>
        <div className="flex items-center justify-between text-[8px] text-gray-700">
          <span>Insurance: {data.statistics.insuranceStatus.toUpperCase()}</span>
          <span>Updated: {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
