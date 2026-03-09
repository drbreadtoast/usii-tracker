import { TIME_FILTERS } from '../../utils/colors'

export default function TimeFilter({ timeFilter, setTimeFilter }) {
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 border-b border-gray-800 overflow-x-auto">
      {Object.entries(TIME_FILTERS).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => setTimeFilter(key)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
            timeFilter === key
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
