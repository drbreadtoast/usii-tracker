import { Landmark } from 'lucide-react'
import govData from '../../data/government-statements.json'
import { VERIFICATION_COLORS, COUNTRY_COLORS } from '../../utils/colors'
import { formatFullTimestamp } from '../../utils/verification'

function groupByCountry(statements) {
  const groups = {}
  statements.forEach(s => {
    if (!groups[s.country]) groups[s.country] = []
    groups[s.country].push(s)
  })
  return groups
}

function formatEngagement(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num
}

function StatementCard({ statement }) {
  const verInfo = VERIFICATION_COLORS[statement.verificationStatus]

  return (
    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
            {statement.displayName.charAt(0)}
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-200">{statement.displayName}</span>
            <p className="text-[10px] text-blue-400">{statement.handle}</p>
          </div>
        </div>
        <span className="text-[10px] text-gray-600 shrink-0">{formatFullTimestamp(statement.timestamp)}</span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed">{statement.text}</p>

      <div className="flex items-center justify-between pt-1 flex-wrap gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: `${verInfo?.color}20`, color: verInfo?.color }}
          >
            {verInfo?.icon} Official Statement
          </span>
          <span className="text-[10px] text-gray-600 capitalize">{statement.platform}</span>
        </div>

        {statement.engagement && (
          <div className="flex items-center gap-3 text-[10px] text-gray-600">
            <span>♥ {formatEngagement(statement.engagement.likes)}</span>
            <span>↻ {formatEngagement(statement.engagement.retweets)}</span>
            <span>💬 {formatEngagement(statement.engagement.replies)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Display order for countries
const COUNTRY_ORDER = ['us', 'iran', 'israel']

export default function GovernmentStatements() {
  const sorted = [...govData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const grouped = groupByCountry(sorted)

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <Landmark size={14} className="text-cyan-400" />
          <span className="text-sm font-semibold text-gray-300">Government Statements</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Official positions from US, Iranian, and Israeli government accounts on X/Twitter
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {COUNTRY_ORDER.map(country => {
          const statements = grouped[country]
          if (!statements || statements.length === 0) return null
          const info = COUNTRY_COLORS[country]

          return (
            <div key={country}>
              <div className="flex items-center gap-1.5 px-1 py-1.5 mb-2">
                <span className="text-sm">{info?.flag}</span>
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                  {info?.label}
                </span>
                <div className="flex-1 h-px bg-gray-800 ml-1" />
                <span className="text-[10px] text-gray-600">{statements.length} statements</span>
              </div>
              <div className="space-y-2">
                {statements.map(s => (
                  <StatementCard key={s.id} statement={s} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
