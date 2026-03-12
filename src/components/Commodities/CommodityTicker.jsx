import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, X } from 'lucide-react'
import gasPriceData from '../../data/gas-prices.json'
import foodPriceData from '../../data/food-prices.json'

// Symbol map for chart modal (ticker symbols that need different chart symbols)
const CHART_SYMBOL_MAP = {
  'FOREXCOM:SPXUSD': 'FOREXCOM:SPXUSD',
}

function PriceChartModal({ symbol, title, onClose }) {
  const chartRef = useRef(null)

  const chartSymbol = CHART_SYMBOL_MAP[symbol] || symbol

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.innerHTML = ''
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        symbols: [[title, chartSymbol]],
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: 'dark',
        autosize: true,
        showVolume: true,
        showMA: true,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
        fontSize: '10',
        noTimeScale: false,
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        chartType: 'area',
        lineWidth: 2,
        lineType: 0,
        dateRanges: ['1d|1', '1w|15', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
      })
      const widgetDiv = document.createElement('div')
      widgetDiv.className = 'tradingview-widget-container__widget'
      widgetDiv.style.height = '100%'
      chartRef.current.appendChild(widgetDiv)
      chartRef.current.appendChild(script)
    }

    return () => {
      if (chartRef.current) chartRef.current.innerHTML = ''
    }
  }, [chartSymbol, title])

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <h2 className="text-sm font-bold text-white">{title} - Price History</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <div ref={chartRef} className="flex-1 tradingview-widget-container overflow-hidden" />
      </div>
    </div>
  )
}

const SYMBOL_GROUPS = {
  energy: {
    label: 'Energy',
    symbols: [
      { proName: 'TVC:USOIL', title: 'WTI Crude' },
      { proName: 'TVC:UKOIL', title: 'Brent Crude' },
      { proName: 'TVC:GOLD', title: 'Gold' },
      { proName: 'TVC:SILVER', title: 'Silver' },
    ]
  },
  markets: {
    label: 'Markets',
    symbols: [
      { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
    ]
  },
  crypto: {
    label: 'Crypto',
    symbols: [
      { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
      { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
    ]
  },
}

const ALL_SYMBOLS = Object.values(SYMBOL_GROUPS).flatMap(g => g.symbols)

function ImpactBadge({ icon, label, preWar, current, changePercent }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded shrink-0">
      <span className="text-sm">{icon}</span>
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-400 font-semibold uppercase">{label}</span>
        <span className="text-[10px] text-gray-500">{preWar}</span>
        <span className="text-[10px] text-gray-600">&rarr;</span>
        <span className="text-[10px] text-red-400 font-bold">{current}</span>
        <span className="text-[9px] bg-red-900/50 text-red-400 px-1 py-0.5 rounded font-medium">{changePercent}</span>
      </div>
    </div>
  )
}

export default function CommodityTicker() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [chartModal, setChartModal] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: ALL_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    containerRef.current.appendChild(widgetContainer)
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div className="bg-gray-900 border-t border-gray-800 shrink-0">
        {/* Desktop: Full TradingView ticker + quick-access buttons */}
        <div className="hidden sm:block">
          {/* Clickable quick-access buttons */}
          <div className="flex items-center gap-0.5 px-1 pt-1 overflow-x-auto">
            {Object.entries(SYMBOL_GROUPS).map(([key, group]) => (
              <div key={key} className="flex items-center gap-0.5 shrink-0">
                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-wider px-1">{group.label}</span>
                {group.symbols.map(s => (
                  <button
                    key={s.proName}
                    onClick={() => setChartModal(s)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    {s.title}
                  </button>
                ))}
                <div className="h-3 w-px bg-gray-700 mx-0.5 shrink-0" />
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <div className="bg-gray-800 px-3 py-2 flex items-center gap-1.5 shrink-0 border-r border-gray-700">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Markets</span>
            </div>
            <div ref={containerRef} className="tradingview-widget-container flex-1 overflow-hidden" />
            <div className="flex items-center gap-1.5 px-2 shrink-0">
              <button onClick={() => navigate('/energy')} className="hover:opacity-80 transition-opacity cursor-pointer" title="Open full Energy page">
                <ImpactBadge
                  icon="⛽"
                  label="US Gas"
                  preWar={`$${gasPriceData.preWarAverage.toFixed(2)}/gal`}
                  current={`$${gasPriceData.currentAverage.toFixed(2)}/gal`}
                  changePercent={`+${gasPriceData.changePercent}%`}
                />
              </button>
              <button onClick={() => navigate('/energy')} className="hover:opacity-80 transition-opacity cursor-pointer" title="Open full Energy page">
                <ImpactBadge
                  icon="🛒"
                  label="Groceries"
                  preWar={`${foodPriceData.groceryImpact.preWarWeekly}/wk`}
                  current={`${foodPriceData.groceryImpact.currentWeekly}/wk`}
                  changePercent={foodPriceData.groceryImpact.changePercent}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Compact scrolling ticker with key prices */}
        <div className="sm:hidden">
          <div className="flex items-center gap-2 px-2 py-1.5 overflow-x-auto">
            <div className="flex items-center gap-1 shrink-0">
              <TrendingUp size={10} className="text-green-400" />
              <span className="text-[9px] font-bold text-gray-500 uppercase">Markets</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <button onClick={() => navigate('/follow-the-oil')} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 shrink-0">
                <span className="text-[9px]">⛽</span>
                <span className="text-[9px] text-gray-400">Gas</span>
                <span className="text-[10px] text-red-400 font-bold">${gasPriceData.currentAverage.toFixed(2)}</span>
                <span className="text-[8px] text-red-500">+{gasPriceData.changePercent}%</span>
              </button>
              <button onClick={() => navigate('/follow-the-oil')} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 shrink-0">
                <span className="text-[9px]">🛒</span>
                <span className="text-[9px] text-gray-400">Groceries</span>
                <span className="text-[10px] text-red-400 font-bold">{foodPriceData.groceryImpact.currentWeekly}/wk</span>
                <span className="text-[8px] text-red-500">{foodPriceData.groceryImpact.changePercent}</span>
              </button>
              <button onClick={() => setChartModal(SYMBOL_GROUPS.energy.symbols[1])} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 shrink-0">
                <span className="text-[9px]">🛢️</span>
                <span className="text-[9px] text-gray-400">Oil</span>
                <span className="text-[10px] text-amber-400 font-bold">Live</span>
              </button>
              <button onClick={() => setChartModal(SYMBOL_GROUPS.markets.symbols[0])} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 shrink-0">
                <span className="text-[9px]">📈</span>
                <span className="text-[9px] text-gray-400">S&P</span>
                <span className="text-[10px] text-green-400 font-bold">Live</span>
              </button>
              <button onClick={() => setChartModal(SYMBOL_GROUPS.crypto.symbols[0])} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 shrink-0">
                <span className="text-[9px]">₿</span>
                <span className="text-[9px] text-gray-400">BTC</span>
                <span className="text-[10px] text-orange-400 font-bold">Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {chartModal && (
        <PriceChartModal
          symbol={chartModal.proName}
          title={chartModal.title}
          onClose={() => setChartModal(null)}
        />
      )}
    </>
  )
}
