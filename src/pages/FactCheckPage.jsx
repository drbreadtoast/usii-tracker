import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ShieldX, ShieldAlert, ShieldQuestion, HelpCircle, ExternalLink, Clock, Filter, ChevronDown, ChevronUp, AlertTriangle, Search, TrendingUp, ArrowLeft, Shield, Newspaper } from 'lucide-react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import factCheckData from '../data/fact-check.json'
import siteMetadata from '../data/site-metadata.json'

const VERDICT_CONFIG = {
  confirmed: {
    label: 'CONFIRMED',
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-950/30',
    border: 'border-green-800/50',
    badge: 'bg-green-600 text-white',
    description: 'Verified true by multiple independent sources',
  },
  debunked: {
    label: 'DEBUNKED',
    icon: ShieldX,
    color: 'text-red-400',
    bg: 'bg-red-950/30',
    border: 'border-red-800/50',
    badge: 'bg-red-600 text-white',
    description: 'Verified false — no credible evidence supports this claim',
  },
  likely: {
    label: 'LIKELY TRUE',
    icon: ShieldAlert,
    color: 'text-amber-400',
    bg: 'bg-amber-950/20',
    border: 'border-amber-800/50',
    badge: 'bg-amber-600 text-white',
    description: 'Evidence supports this claim but not fully confirmed',
  },
  unlikely: {
    label: 'UNLIKELY',
    icon: ShieldQuestion,
    color: 'text-orange-400',
    bg: 'bg-orange-950/20',
    border: 'border-orange-800/50',
    badge: 'bg-orange-600 text-white',
    description: 'Evidence contradicts this claim but not fully debunked',
  },
  unverified: {
    label: 'UNVERIFIED',
    icon: HelpCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-900/40',
    border: 'border-gray-700/50',
    badge: 'bg-gray-600 text-white',
    description: 'Insufficient evidence to confirm or deny',
  },
}

const CATEGORY_LABELS = {
  military: 'Military',
  weapons: 'Weapons',
  political: 'Political',
  energy: 'Energy',
  censorship: 'Censorship',
  domestic: 'Domestic',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    timeZone: 'America/Los_Angeles',
  })
}

function ClaimCard({ claim }) {
  const [expanded, setExpanded] = useState(false)
  const config = VERDICT_CONFIG[claim.verdict] || VERDICT_CONFIG.unverified
  const VerdictIcon = config.icon

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg overflow-hidden transition-colors hover:border-gray-600`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start gap-3">
          <VerdictIcon size={20} className={`${config.color} shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.badge}`}>
                {config.label}
              </span>
              {claim.trending && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 flex items-center gap-0.5">
                  <TrendingUp size={9} />
                  Trending
                </span>
              )}
              <span className="text-[9px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                {CATEGORY_LABELS[claim.category] || claim.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-200 leading-snug">{claim.claim}</p>
            <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
              <Clock size={10} />
              Added {formatDate(claim.dateAdded)} · Last checked {formatDate(claim.lastChecked)}
            </p>
          </div>
          <div className="shrink-0 text-gray-600 pt-0.5">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[32px] border-t border-gray-800/50 pt-3">
          {/* Verdict explanation */}
          <div className={`${config.bg} border ${config.border} rounded-lg p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <VerdictIcon size={14} className={config.color} />
              <span className={`text-xs font-bold ${config.color}`}>Verdict: {config.label}</span>
            </div>
            <p className="text-[10px] text-gray-500 italic">{config.description}</p>
          </div>

          {/* Analysis */}
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Analysis</span>
            <p className="text-xs text-gray-300 leading-relaxed mt-1">{claim.summary}</p>
          </div>

          {/* Origin */}
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Origin of Claim</span>
            <p className="text-xs text-gray-400 mt-1">{claim.origin}</p>
          </div>

          {/* Where it's viral */}
          {claim.viralPlatforms && claim.viralPlatforms.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Viral On</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {claim.viralPlatforms.map((platform, i) => (
                  <span key={i} className="text-[9px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {claim.sources && claim.sources.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sources — Click to Verify</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {claim.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-950/30 px-2 py-1 rounded hover:bg-blue-900/40 hover:text-blue-300 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    {source.name} <ExternalLink size={8} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function FactCheckPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const recentClaims = useMemo(() => {
    const lastUpdate = new Date(siteMetadata.lastUpdated)
    const cutoff = new Date(lastUpdate.getTime() - 24 * 60 * 60 * 1000)

    return [...factCheckData.claims]
      .filter(c => new Date(c.lastChecked) >= cutoff)
      .sort((a, b) => new Date(b.lastChecked) - new Date(a.lastChecked))
  }, [])

  const filteredClaims = useMemo(() => {
    let filtered = [...recentClaims]
    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => c.verdict === activeFilter)
    }
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.claim.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [activeFilter, searchQuery, recentClaims])

  const counts = useMemo(() => {
    const c = { all: recentClaims.length }
    Object.keys(VERDICT_CONFIG).forEach(v => {
      c[v] = recentClaims.filter(cl => cl.verdict === v).length
    })
    return c
  }, [recentClaims])

  const lastUpdateDate = new Date(siteMetadata.lastUpdated)
  const lastUpdatedPT = lastUpdateDate.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/Los_Angeles',
  }) + ' PT'
  const refreshAgo = (() => {
    const diffMs = Date.now() - lastUpdateDate.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMin / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    return `${Math.floor(diffHr / 24)}d ago`
  })()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-400" />
            <h1 className="text-sm font-bold text-gray-300">Rumor Tracker & Fact Check</h1>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white uppercase tracking-wider">Beta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-blue-950/40 border border-blue-800/50 rounded-lg px-3 py-1.5">
              <Clock size={12} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">Last Checked: {lastUpdatedPT}</span>
              <span className="text-[10px] text-blue-400/70 bg-blue-900/40 px-1.5 py-0.5 rounded font-mono">{refreshAgo}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="bg-blue-950/20 border-b border-blue-900/30 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-blue-400">Debunking Misinformation in Real-Time</h2>
              <p className="text-xs text-gray-500 mt-1">
                With misinformation spreading rapidly during the Iran-Israel conflict, we independently research trending claims
                and verify them against multiple credible sources. Every verdict includes clickable source links so you can verify for yourself.
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                Showing {recentClaims.length} claims checked in the last 24 hours.
              </p>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mt-2">
                <p className="text-[10px] text-amber-500/80 leading-relaxed">
                  <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                  <strong>Important:</strong> {factCheckData.metadata.methodology}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict summary bar */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider shrink-0">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
              activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          {Object.entries(VERDICT_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                activeFilter === key ? `${config.badge}` : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {config.label} ({counts[key] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search claims..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-blue-800 transition-colors"
          />
        </div>
      </div>

      {/* Claims list — only last 24 hours */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 space-y-3">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <ShieldQuestion size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">{recentClaims.length === 0 ? 'No claims checked in the past 24 hours.' : 'No claims match your filters.'}</p>
            {recentClaims.length === 0 && (
              <p className="text-xs mt-2">Check back after the next data update.</p>
            )}
          </div>
        ) : (
          filteredClaims.map(claim => (
            <ClaimCard key={claim.id} claim={claim} />
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">The OSS Report</span>
              <span className="text-blue-400 font-mono text-[9px]">usiitracker.com</span>
              <span>Rumor Tracker & Fact Check</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>All verdicts sourced. Click sources to verify independently.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
