import { useState, useMemo } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  MessageSquareQuote, ChevronDown, ChevronUp, ExternalLink,
  Shield, AlertTriangle, Check, X, HelpCircle, AlertCircle, ArrowUpDown,
  Quote, User
} from 'lucide-react'
import statementsData from '../data/statements-timeline.json'

// --- Helpers ---

function SourceLink({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded transition-colors"
    >
      {label} <ExternalLink size={8} />
    </a>
  )
}

function SectionHeader({ icon: Icon, iconColor, title, count }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex items-center gap-2">
        <Icon size={18} className={iconColor} />
        <h2 className="text-lg font-bold text-gray-100">{title}</h2>
      </div>
      <div className="h-px flex-1 bg-gray-800" />
      {count != null && (
        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {count} items
        </span>
      )}
    </div>
  )
}

// --- Fact-Check Badge ---

function FactCheckBadge({ status }) {
  const configs = {
    true: {
      icon: Check,
      label: 'Verified True',
      color: 'text-green-400',
      bg: 'bg-green-950/40',
      border: 'border-green-800/50',
    },
    misleading: {
      icon: AlertTriangle,
      label: 'Misleading',
      color: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-800/50',
    },
    false: {
      icon: X,
      label: 'False',
      color: 'text-red-400',
      bg: 'bg-red-950/40',
      border: 'border-red-800/50',
    },
    unverified: {
      icon: HelpCircle,
      label: 'Unverified',
      color: 'text-gray-400',
      bg: 'bg-gray-800/40',
      border: 'border-gray-700/50',
    },
  }

  const config = configs[status] || configs.unverified
  const IconComp = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${config.color} ${config.bg} ${config.border}`}
    >
      <IconComp size={10} />
      {config.label}
    </span>
  )
}

// --- Country Badge ---

function CountryBadge({ country }) {
  const styles = {
    US: 'bg-blue-950/30 text-blue-400 border-blue-800/50',
    Iran: 'bg-green-950/30 text-green-400 border-green-800/50',
    Israel: 'bg-sky-950/30 text-sky-400 border-sky-800/50',
    International: 'bg-purple-950/30 text-purple-400 border-purple-800/50',
  }
  return (
    <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${styles[country] || styles.International}`}>
      {country}
    </span>
  )
}

// --- Statement Card ---

function StatementCard({ statement, speaker, isExpanded, onToggleExpand }) {
  const factCheckPanelColors = {
    true: 'bg-green-950/20 border-green-900/30',
    misleading: 'bg-amber-950/20 border-amber-900/30',
    false: 'bg-red-950/20 border-red-900/30',
    unverified: 'bg-gray-800/20 border-gray-700/30',
  }

  return (
    <div
      className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden"
      style={{ borderLeft: `4px solid ${speaker.color}` }}
    >
      {/* Card Header */}
      <div className="px-4 py-3">
        {/* Speaker Info Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-100">{speaker.name}</span>
          </div>
          <span className="text-[10px] text-gray-500">{speaker.title}</span>
          <CountryBadge country={speaker.country} />
        </div>

        {/* Date + Venue Row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] text-gray-600 font-mono">{statement.date}</span>
          <span className="text-[10px] text-gray-700">&middot;</span>
          <span className="text-[10px] text-gray-500">{statement.venue}</span>
        </div>

        {/* Quoted Text */}
        <div className="mt-3 flex items-start gap-2">
          <Quote size={14} className="text-gray-700 shrink-0 mt-0.5" />
          <p className="text-base italic text-gray-200 leading-relaxed">
            &ldquo;{statement.text}&rdquo;
          </p>
        </div>

        {/* Context */}
        {statement.context && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed ml-[22px]">
            {statement.context}
          </p>
        )}

        {/* Fact-Check Badge + Expand Toggle */}
        <div className="flex items-center justify-between mt-3 ml-[22px]">
          <FactCheckBadge status={statement.factCheck} />
          <button
            onClick={() => onToggleExpand(statement.id)}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Hide details</span>
                <ChevronUp size={12} />
              </>
            ) : (
              <>
                <span>Fact-check details</span>
                <ChevronDown size={12} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Fact-Check Detail */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 ml-[22px]">
          {statement.factCheckDetail && (
            <div className={`rounded-lg px-3 py-2.5 border ${factCheckPanelColors[statement.factCheck] || factCheckPanelColors.unverified}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertCircle size={10} className="text-gray-500" />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fact-Check Analysis</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{statement.factCheckDetail}</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={statement.sourceUrl} label={statement.sourceName} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Page ---

export default function FollowTheStatementsPage() {
  const [activeSpeaker, setActiveSpeaker] = useState(null)
  const [activeFactCheck, setActiveFactCheck] = useState(null)
  const [sortOrder, setSortOrder] = useState('newest')
  const [expandedStatements, setExpandedStatements] = useState(new Set())
  const [showIntro, setShowIntro] = useState(false)

  // Toggle a statement's expanded state
  const toggleExpand = (id) => {
    setExpandedStatements(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Flatten all statements with speaker info attached
  const allStatements = useMemo(() => {
    const flat = []
    for (const speaker of statementsData.speakers) {
      for (const stmt of speaker.statements) {
        flat.push({ statement: stmt, speaker })
      }
    }
    return flat
  }, [])

  // Filtered and sorted statements
  const filteredStatements = useMemo(() => {
    let result = allStatements

    if (activeSpeaker) {
      result = result.filter(item => item.speaker.id === activeSpeaker)
    }

    if (activeFactCheck) {
      result = result.filter(item => item.statement.factCheck === activeFactCheck)
    }

    result = [...result].sort((a, b) => {
      const cmp = a.statement.date.localeCompare(b.statement.date)
      return sortOrder === 'newest' ? -cmp : cmp
    })

    return result
  }, [allStatements, activeSpeaker, activeFactCheck, sortOrder])

  // Stats counts
  const totalCount = allStatements.length
  const trueCount = allStatements.filter(s => s.statement.factCheck === 'true').length
  const misleadingCount = allStatements.filter(s => s.statement.factCheck === 'misleading').length
  const falseCount = allStatements.filter(s => s.statement.factCheck === 'false').length
  const unverifiedCount = allStatements.filter(s => s.statement.factCheck === 'unverified').length

  // Fact-check filter options
  const factCheckFilters = [
    { value: null, label: 'All', activeClass: 'bg-gray-800 border-gray-600 text-gray-200' },
    { value: 'true', label: 'True', activeClass: 'bg-green-900/30 border-green-800 text-green-400' },
    { value: 'misleading', label: 'Misleading', activeClass: 'bg-amber-900/30 border-amber-800 text-amber-400' },
    { value: 'false', label: 'False', activeClass: 'bg-red-900/30 border-red-800 text-red-400' },
    { value: 'unverified', label: 'Unverified', activeClass: 'bg-gray-700/30 border-gray-600 text-gray-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Follow the Statements</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <MessageSquareQuote size={12} className="text-purple-400" />
              <span className="text-purple-400 font-bold">{totalCount}</span>
              <span>statements tracked</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <X size={12} className="text-red-400" />
              <span className="text-red-400 font-bold">{falseCount}</span>
              <span>false</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-amber-400 font-bold">{misleadingCount}</span>
              <span>misleading</span>
            </div>
          </div>
        </div>
      </header>

      {/* Intro Banner — Collapsible */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowIntro(!showIntro)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors"
          >
            <MessageSquareQuote size={18} className="text-purple-400 shrink-0" />
            <div className="flex-1 text-left">
              <h2 className="text-sm font-bold text-gray-200">{statementsData.metadata.title}</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Tap to see methodology, sources & disclaimer</p>
            </div>
            {showIntro ? <ChevronUp size={16} className="text-gray-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
          </button>
          {showIntro && (
            <div className="px-4 pb-4 ml-[30px] border-t border-gray-800/50 pt-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                {statementsData.metadata.methodology}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
                {statementsData.metadata.sources.map((src, i) => (
                  <span key={i} className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded">
                    {src}
                  </span>
                ))}
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mt-2">
                <p className="text-[10px] text-amber-500/80 leading-relaxed">
                  <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                  <strong>Important:</strong> {statementsData.metadata.disclaimer}
                </p>
              </div>
              <div className="text-[10px] text-gray-600 mt-2">
                Last updated: {statementsData.metadata.lastUpdated}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquareQuote size={12} className="text-purple-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total</span>
            </div>
            <span className="text-lg font-bold text-purple-400">{totalCount}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Check size={12} className="text-green-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Verified</span>
            </div>
            <span className="text-lg font-bold text-green-400">{trueCount}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Misleading</span>
            </div>
            <span className="text-lg font-bold text-amber-400">{misleadingCount}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <X size={12} className="text-red-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">False</span>
            </div>
            <span className="text-lg font-bold text-red-400">{falseCount}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <HelpCircle size={12} className="text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Unverified</span>
            </div>
            <span className="text-lg font-bold text-gray-400">{unverifiedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-5xl mx-auto px-6 pb-4 space-y-3">
        {/* Speaker Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mr-1">Speaker:</span>
          <button
            onClick={() => setActiveSpeaker(null)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
              activeSpeaker === null
                ? 'bg-gray-800 border-gray-600 text-gray-200'
                : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            All
          </button>
          {statementsData.speakers.map(speaker => (
            <button
              key={speaker.id}
              onClick={() => setActiveSpeaker(activeSpeaker === speaker.id ? null : speaker.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                activeSpeaker === speaker.id
                  ? 'border-opacity-80 text-white'
                  : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
              style={
                activeSpeaker === speaker.id
                  ? {
                      backgroundColor: speaker.color + '20',
                      borderColor: speaker.color + '80',
                      color: speaker.color,
                    }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: speaker.color }}
              />
              {speaker.shortName}
            </button>
          ))}
        </div>

        {/* Fact-Check Filter + Sort Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mr-1">Fact Check:</span>
            {factCheckFilters.map(opt => (
              <button
                key={opt.label}
                onClick={() => setActiveFactCheck(opt.value)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                  activeFactCheck === opt.value
                    ? opt.activeClass
                    : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all"
          >
            <ArrowUpDown size={12} />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Statements Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={Quote}
          iconColor="text-purple-400"
          title="Statement Timeline"
          count={filteredStatements.length}
        />

        <div className="space-y-3">
          {filteredStatements.map(item => (
            <StatementCard
              key={item.statement.id}
              statement={item.statement}
              speaker={item.speaker}
              isExpanded={expandedStatements.has(item.statement.id)}
              onToggleExpand={toggleExpand}
            />
          ))}
          {filteredStatements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No statements match your filters.</p>
              <button
                onClick={() => { setActiveSpeaker(null); setActiveFactCheck(null) }}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-400">TheOSSreport.com</span>
              <span>Follow the Statements &mdash; Rhetoric &amp; Fact-Check Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Fact-checks sourced from Reuters, AP, BBC Verify, and official records.</span>
            </div>
          </div>
          <div className="bg-gray-800/40 rounded-lg px-4 py-2.5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              <strong>Disclaimer:</strong> {statementsData.metadata.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Data Sources:</span>
            {statementsData.metadata.sources.map((src, i) => (
              <span key={i} className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded">
                {src}
              </span>
            ))}
          </div>
        </div>
        </div>
      </footer>
    </div>
  )
}
