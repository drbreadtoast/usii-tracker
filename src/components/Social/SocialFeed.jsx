import { useState, useMemo } from 'react'
import { MessageCircle, Heart, Repeat2, MessageSquare, Shield, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { VERIFICATION_COLORS } from '../../utils/colors'
import { formatFullTimestamp } from '../../utils/verification'

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function generateSummary(posts) {
  const totalEngagement = posts.reduce((sum, p) => {
    if (!p.engagement) return sum
    return sum + (p.engagement.likes || 0) + (p.engagement.retweets || 0)
  }, 0)

  // Extract key themes from post texts
  const keywords = new Set()
  posts.forEach(p => {
    const text = p.text.toLowerCase()
    if (text.includes('strike') || text.includes('bomb') || text.includes('attack')) keywords.add('strikes & attacks')
    if (text.includes('missile') || text.includes('drone') || text.includes('uav')) keywords.add('missile/drone activity')
    if (text.includes('casualt') || text.includes('dead') || text.includes('kill')) keywords.add('casualties')
    if (text.includes('oil') || text.includes('crude') || text.includes('hormuz')) keywords.add('oil & energy')
    if (text.includes('nuclear') || text.includes('natanz') || text.includes('isfahan')) keywords.add('nuclear facilities')
    if (text.includes('ship') || text.includes('naval') || text.includes('fleet')) keywords.add('naval operations')
    if (text.includes('ceasefire') || text.includes('diplomati') || text.includes('negotiat')) keywords.add('diplomatic efforts')
    if (text.includes('satellite') || text.includes('imagery')) keywords.add('satellite intelligence')
  })

  const themesStr = [...keywords].slice(0, 3).join(', ')
  const verifiedCount = posts.filter(p => p.verificationStatus === 'confirmed').length

  return {
    themes: themesStr || 'conflict developments',
    postCount: posts.length,
    verifiedCount,
    totalEngagement,
    latestPost: posts[0],
  }
}

function AnalystCard({ handle, displayName, posts, category }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = useMemo(() => generateSummary(posts), [posts])

  const isOsint = category === 'osint'
  const borderColor = isOsint ? 'border-green-900/30' : 'border-amber-900/30'
  const accentColor = isOsint ? 'text-green-400' : 'text-amber-400'

  return (
    <div className={`bg-gray-800/30 border ${borderColor} rounded-lg overflow-hidden`}>
      {/* Analyst header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2.5 flex items-start justify-between hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
            {displayName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">{displayName}</span>
              <span className="text-[10px] text-blue-400">{handle}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              <span className="font-medium">{summary.postCount} post{summary.postCount !== 1 ? 's' : ''}</span>
              {' '}covering <span className={accentColor}>{summary.themes}</span>
              {summary.verifiedCount > 0 && (
                <span className="text-green-500"> · {summary.verifiedCount} verified</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {summary.totalEngagement > 0 && (
            <span className="text-[9px] text-gray-600 font-mono">
              {formatNumber(summary.totalEngagement)} reach
            </span>
          )}
          {isExpanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
        </div>
      </button>

      {/* Latest post preview (always visible) */}
      <div className="px-3 pb-2">
        <div className="bg-gray-900/60 rounded p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] text-gray-600">Latest:</span>
            <span className="text-[9px] text-gray-500">{formatFullTimestamp(summary.latestPost.timestamp)}</span>
            {summary.latestPost.verificationStatus && (
              <span
                className="text-[8px] px-1 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: `${VERIFICATION_COLORS[summary.latestPost.verificationStatus]?.color}20`,
                  color: VERIFICATION_COLORS[summary.latestPost.verificationStatus]?.color,
                }}
              >
                {VERIFICATION_COLORS[summary.latestPost.verificationStatus]?.label}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {summary.latestPost.text}
          </p>
        </div>
      </div>

      {/* Expanded: show all individual posts */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-gray-800">
          <span className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider block pt-2">All Posts</span>
          {posts.map(post => {
            const verInfo = VERIFICATION_COLORS[post.verificationStatus]
            return (
              <div key={post.id} className="bg-gray-900/40 border border-gray-800/50 rounded p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-500">{formatFullTimestamp(post.timestamp)}</span>
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                    style={{
                      backgroundColor: `${verInfo?.color}20`,
                      color: verInfo?.color,
                      border: `1px ${post.verificationStatus === 'rumored' ? 'dashed' : 'solid'} ${verInfo?.color}40`,
                    }}
                  >
                    {verInfo?.icon} {verInfo?.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">{post.text}</p>
                {post.verificationNote && (
                  <p className="text-[9px] text-gray-500 italic">{post.verificationNote}</p>
                )}
                {post.engagement && (
                  <div className="flex items-center gap-3 text-[9px] text-gray-600">
                    <span className="flex items-center gap-0.5"><Heart size={8} />{formatNumber(post.engagement.likes)}</span>
                    <span className="flex items-center gap-0.5"><Repeat2 size={8} />{formatNumber(post.engagement.retweets)}</span>
                    <span className="flex items-center gap-0.5"><MessageSquare size={8} />{formatNumber(post.engagement.replies)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SocialFeed({ socialPosts }) {
  // Group posts by handle, sorted newest-first within each group
  const { osintAnalysts, leadAnalysts } = useMemo(() => {
    const osintMap = new Map()
    const leadMap = new Map()

    const sorted = [...socialPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    sorted.forEach(post => {
      const map = post.sourceCategory === 'lead' ? leadMap : osintMap
      if (!map.has(post.handle)) {
        map.set(post.handle, {
          handle: post.handle,
          displayName: post.displayName,
          posts: [],
          category: post.sourceCategory || 'osint',
        })
      }
      map.get(post.handle).posts.push(post)
    })

    return {
      osintAnalysts: [...osintMap.values()],
      leadAnalysts: [...leadMap.values()],
    }
  }, [socialPosts])

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-blue-400" />
          <span className="text-sm font-semibold text-gray-300">Social Media Intel</span>
          <span className="text-[10px] bg-blue-950/50 text-blue-400 px-1.5 py-0.5 rounded-full">
            {socialPosts.length} posts · {osintAnalysts.length + leadAnalysts.length} sources
          </span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">Grouped by analyst — click to expand individual posts</p>
      </div>

      {/* Scrollable analyst summaries */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* OSINT Analysts section */}
        {osintAnalysts.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-1 py-1">
              <Shield size={12} className="text-green-400" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">OSINT Analysts</span>
              <div className="flex-1 h-px bg-green-900/30 ml-1" />
              <span className="text-[9px] text-gray-600">{osintAnalysts.length} analysts</span>
            </div>
            {osintAnalysts.map(analyst => (
              <AnalystCard
                key={analyst.handle}
                handle={analyst.handle}
                displayName={analyst.displayName}
                posts={analyst.posts}
                category="osint"
              />
            ))}
          </>
        )}

        {/* Lead Sources section */}
        {leadAnalysts.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-1 py-1 mt-3">
              <Users size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">What People Are Saying</span>
              <div className="flex-1 h-px bg-amber-900/30 ml-1" />
              <span className="text-[9px] text-gray-600">{leadAnalysts.length} sources</span>
            </div>
            <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2 mb-1">
              <p className="text-[10px] text-amber-600 italic">
                Unverified social media reports. Treat with caution — click to see individual posts and sources.
              </p>
            </div>
            {leadAnalysts.map(analyst => (
              <AnalystCard
                key={analyst.handle}
                handle={analyst.handle}
                displayName={analyst.displayName}
                posts={analyst.posts}
                category="lead"
              />
            ))}
          </>
        )}

        {socialPosts.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-600">
            No social media posts available
          </div>
        )}
      </div>
    </div>
  )
}
