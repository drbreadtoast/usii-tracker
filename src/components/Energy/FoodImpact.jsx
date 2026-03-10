import { Wheat, ArrowRight, Info, ExternalLink } from 'lucide-react'
import data from '../../data/food-prices.json'

function GrocerySummary() {
  const { groceryImpact } = data
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Wheat size={12} className="text-amber-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Food & Essentials Impact</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Pre-War Weekly</div>
          <div className="text-2xl font-bold text-gray-300">{groceryImpact.preWarWeekly}</div>
          <div className="text-[9px] text-gray-600">avg grocery bill</div>
        </div>
        <ArrowRight size={20} className="text-gray-600" />
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-0.5">Current Weekly</div>
          <div className="text-2xl font-bold text-red-400">{groceryImpact.currentWeekly}</div>
          <div className="text-[9px] text-gray-600">avg grocery bill</div>
        </div>
        <div className="bg-red-900/50 border border-red-800 rounded-lg px-2.5 py-1.5">
          <div className="text-lg font-bold text-red-400">{groceryImpact.changePercent}</div>
          <div className="text-[8px] text-red-500">increase</div>
        </div>
      </div>
      <div className="text-center mt-1.5">
        <span className="text-[9px] text-gray-600">Extra cost per week: </span>
        <span className="text-[9px] text-red-400 font-semibold">{groceryImpact.averageWeeklyIncrease}</span>
      </div>
    </div>
  )
}

function CommodityTable() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2">
      <div className="overflow-x-auto">
        <table className="w-full text-[9px]">
          <thead>
            <tr className="text-gray-600 border-b border-gray-800">
              <th className="text-left py-1 pr-1 font-medium">Commodity</th>
              <th className="text-right py-1 px-1 font-medium">Pre-War</th>
              <th className="text-right py-1 px-1 font-medium">Current</th>
              <th className="text-right py-1 pl-1 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {data.commodities.map((item) => (
              <tr key={item.name} className="border-b border-gray-800/50">
                <td className="py-1.5 pr-1">
                  <div className="text-gray-300 font-medium">{item.name}</div>
                  <div className="text-[8px] text-gray-600">{item.detail}</div>
                </td>
                <td className="py-1.5 px-1 text-right text-gray-400">
                  <div>{item.preWar}</div>
                  <div className="text-[8px] text-gray-600">{item.unit}</div>
                </td>
                <td className="py-1.5 px-1 text-right text-amber-400">
                  <div>{item.current}</div>
                  <div className="text-[8px] text-gray-600">{item.unit}</div>
                </td>
                <td className="py-1.5 pl-1 text-right">
                  <span className="bg-red-900/50 text-red-400 font-medium px-1.5 py-0.5 rounded">
                    {item.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ContextNote() {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-2 flex items-start gap-2">
      <Info size={12} className="text-blue-400 shrink-0 mt-0.5" />
      <div>
        <div className="text-[9px] font-semibold text-gray-400 mb-0.5">Food supply disruption</div>
        <p className="text-[9px] text-gray-600 leading-relaxed">{data.context}</p>
      </div>
    </div>
  )
}

export default function FoodImpact() {
  return (
    <div className="space-y-2">
      <GrocerySummary />
      <CommodityTable />
      <ContextNote />
      <div className="flex items-center justify-between text-[8px] text-gray-700 px-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Data:</span>
          <a href="https://www.usda.gov/topics/farming/crop-production" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">USDA <ExternalLink size={7} /></a>
          <a href="https://www.cmegroup.com/markets/agriculture.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">CME Group <ExternalLink size={7} /></a>
          {data.fertilizer?.sourceUrl && (
            <a href={data.fertilizer.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">{data.fertilizer.source || 'Bloomberg'} <ExternalLink size={7} /></a>
          )}
        </div>
        <span>Updated: {new Date(data.lastUpdated).toLocaleString()}</span>
      </div>
    </div>
  )
}
