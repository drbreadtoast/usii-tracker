import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const TIMEZONES = [
  { label: 'San Francisco', abbr: 'PT', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { label: 'Washington', abbr: 'ET', tz: 'America/New_York', flag: '🇺🇸' },
  { label: 'Tehran', abbr: 'IRST', tz: 'Asia/Tehran', flag: '🇮🇷' },
  { label: 'Jerusalem', abbr: 'IST', tz: 'Asia/Jerusalem', flag: '🇮🇱' },
  { label: 'Beirut', abbr: 'EET', tz: 'Asia/Beirut', flag: '🇱🇧' },
  { label: 'Moscow', abbr: 'MSK', tz: 'Europe/Moscow', flag: '🇷🇺' },
  { label: 'Beijing', abbr: 'CST', tz: 'Asia/Shanghai', flag: '🇨🇳' },
]

export default function WorldClocks() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-900/50 border-b border-gray-800/50 overflow-x-auto scrollbar-hide">
      <Clock size={12} className="text-gray-600 shrink-0" />
      {TIMEZONES.map(({ label, abbr, tz, flag }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs shrink-0">
          <span>{flag}</span>
          <span className="text-gray-500">{label}</span>
          <span className="font-mono text-gray-300">
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: tz,
            })}
          </span>
          <span className="text-gray-600 text-[10px]">{abbr}</span>
        </div>
      ))}
    </div>
  )
}
