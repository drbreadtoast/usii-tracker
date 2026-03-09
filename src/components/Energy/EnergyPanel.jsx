import { Fuel } from 'lucide-react'
import HormuzStatus from './HormuzStatus'
import GasPriceTracker from './GasPriceTracker'
import FoodImpact from './FoodImpact'

export default function EnergyPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <Fuel size={14} className="text-amber-400" />
          <span className="text-sm font-semibold text-gray-300">Energy, Food & Shipping Impact</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">How the war affects energy, food supply, and US prices</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <HormuzStatus />
        <GasPriceTracker />
        <FoodImpact />
      </div>
    </div>
  )
}
