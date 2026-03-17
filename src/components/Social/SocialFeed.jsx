import { useMemo } from 'react'
import { MessageCircle, Shield, Users, ExternalLink, Info } from 'lucide-react'
import { VERIFICATION_COLORS } from '../../utils/colors'

function formatDate(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) + ' UTC'
}

function getDateGroup(timestamp) {
  const d = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const postDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = Math.floor((today - postDay) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return formatDate(timestamp)
}

function SummaryCard({ post }) {
  const verInfo = VERIFICATION_COLORS[post.verificationStatus]
  const isOsint = post.sourceCategory !== 'lead'

  return (
    <div className={`bg-gray-800/30 border ${isOsint ? 'border-green-900/30' : 'border-amber-900/30'} rounded-lg p-3`}>
      {/* Top row: verification badge + time */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: `${verInfo?.color}20`,
            color: verInfo?.color,
            border: `1px ${post.verificationStatus === 'rumored' ? 'dashed' : 'solid'} ${verInfo?.color}40`,
          }}
        >
          {verInfo?.icon} {verInfo?.label}
        </span>
        <span className="text-[10px] text-gray-500">{formatTime(post.timestamp)}</span>
      </div>

      {/* Summary text */}
      <p className="text-sm text-gray-300 leading-relaxed">
        <span className={`font-semibold ${isOsint ? 'text-green-400' : 'text-amber-400'}`}>{post.displayName}:</span>{' '}
        {post.text}
      </p>

      {/* Verification note */}
      {post.verificationNote && (
        <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
          <Info size={10} className="shrink-0" />
          {post.verificationNote}
        </p>
      )}

      {/* Source link */}
      {post.source && (
        <a
          href={post.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={9} />
          Source
        </a>
      )}
    </div>
  )
}

export default function SocialFeed({ socialPosts }) {
  const { dateGroups, osintCount, leadCount } = useMemo(() => {
    const sorted = [...socialPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    const groups = new Map()
    let osint = 0
    let lead = 0

    sorted.forEach(post => {
      const group = getDateGroup(post.timestamp)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(post)
      if (post.sourceCategory === 'lead') lead++
      else osint++
    })

    return { dateGroups: groups, osintCount: osint, leadCount: lead }
  }, [socialPosts])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-blue-400" />
          <span className="text-sm font-semibold text-gray-300">Analyst Intelligence Feed</span>
          <span className="text-[10px] bg-blue-950/50 text-blue-400 px-1.5 py-0.5 rounded-full">
            {socialPosts.length} reports
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {osintCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <Shield size={9} /> {osintCount} OSINT
            </span>
          )}
          {leadCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <Users size={9} /> {leadCount} lead sources
            </span>
          )}
        </div>
      </div>

      {/* Posts grouped by date */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {[...dateGroups.entries()].map(([dateLabel, posts]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-2 px-1 py-1.5 mb-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dateLabel}</span>
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-[9px] text-gray-600">{posts.length} report{posts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {posts.map(post => (
                <SummaryCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}

        {socialPosts.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-600">
            No analyst reports available
          </div>
        )}
      </div>
    </div>
  )
}
