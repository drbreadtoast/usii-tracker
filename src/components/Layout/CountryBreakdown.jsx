import { COUNTRY_COLORS } from '../../utils/colors'

export default function CountryBreakdown({ stats }) {
  if (!stats?.byCountry) return null

  const sorted = Object.entries(stats.byCountry)
    .sort(([, a], [, b]) => b - a)

  const maxCount = sorted.length > 0 ? sorted[0][1] : 1

  return (
    <div className="px-3 py-2 border-b border-gray-800 bg-gray-900/50">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Events by Country/Actor</p>
      <div className="space-y-1">
        {sorted.map(([country, count]) => {
          const info = COUNTRY_COLORS[country]
          if (!info) return null
          const pct = (count / maxCount) * 100
          return (
            <div key={country} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center shrink-0">{info.flag}</span>
              <span className="text-[10px] text-gray-400 w-8 shrink-0 font-mono">{info.short}</span>
              <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: info.color }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-300 w-5 text-right shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
