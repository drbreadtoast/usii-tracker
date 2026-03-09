import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const TIMEZONES = [
  { label: 'Tehran', tz: 'Asia/Tehran', flag: '🇮🇷' },
  { label: 'Jerusalem', tz: 'Asia/Jerusalem', flag: '🇮🇱' },
  { label: 'Beirut', tz: 'Asia/Beirut', flag: '🇱🇧' },
  { label: 'Washington', tz: 'America/New_York', flag: '🇺🇸' },
  { label: 'Moscow', tz: 'Europe/Moscow', flag: '🇷🇺' },
]

export default function WorldClocks() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-900/50 border-b border-gray-800/50 overflow-x-auto">
      <Clock size={12} className="text-gray-600 shrink-0" />
      {TIMEZONES.map(({ label, tz, flag }) => (
        <div key={tz} className="flex items-center gap-1.5 text-xs shrink-0">
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
        </div>
      ))}
    </div>
  )
}
