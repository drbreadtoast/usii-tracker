import { useState, useMemo } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  DollarSign, Building2, Users, ChevronDown, ChevronUp,
  ExternalLink, Shield, TrendingUp, Vote, AlertTriangle, Search,
  Crown, BarChart3, Briefcase
} from 'lucide-react'
import lobbyData from '../data/lobby-data.json'

// --- Helpers ---

function formatMoney(num) {
  if (num == null) return '$0'
  const abs = Math.abs(num)
  if (abs >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
  return `$${num.toLocaleString()}`
}

function formatMoneyFull(num) {
  if (num == null) return '$0'
  return `$${num.toLocaleString()}`
}

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

function PartyBadge({ party }) {
  const styles = {
    R: 'bg-red-500 text-white',
    D: 'bg-blue-500 text-white',
    I: 'bg-gray-500 text-white',
  }
  return (
    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold ${styles[party] || styles.I}`}>
      {party}
    </span>
  )
}

// --- Expandable Card Components ---

function OrganizationCard({ org }) {
  const [expanded, setExpanded] = useState(false)

  const typeLabels = {
    lobby: { label: 'Lobby', color: 'text-purple-400', bg: 'bg-purple-950/30' },
    superPAC: { label: 'Super PAC', color: 'text-orange-400', bg: 'bg-orange-950/30' },
    pac: { label: 'PAC', color: 'text-cyan-400', bg: 'bg-cyan-950/30' },
    advocacy: { label: 'Advocacy', color: 'text-green-400', bg: 'bg-green-950/30' },
  }
  const typeInfo = typeLabels[org.type] || typeLabels.pac

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Building2 size={16} className="text-green-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{org.name}</h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeInfo.color} ${typeInfo.bg}`}>
              {typeInfo.label}
            </span>
            <span className="text-[10px] text-gray-600">Est. {org.founded}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{org.fullName}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-green-400">{formatMoney(org.totalSpending2024Cycle)}</span>
            <span className="text-[10px] text-gray-600">2024 cycle spending</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{org.description}</p>

          {org.notableActions && org.notableActions.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Notable Actions</span>
              <ul className="mt-1 space-y-1">
                {org.notableActions.map((action, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-1 shrink-0">&#8226;</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={org.sourceUrl} label={org.source} />
          </div>
        </div>
      )}
    </div>
  )
}

function RecipientCard({ recipient }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Users size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{recipient.name}</h4>
            <PartyBadge party={recipient.party} />
            <span className="text-[10px] text-gray-500">{recipient.state} &middot; {recipient.chamber}</span>
          </div>
          {recipient.role && (
            <p className="text-[10px] text-cyan-400 mt-0.5 font-medium">{recipient.role}</p>
          )}
          {recipient.warRelevance && (
            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{recipient.warRelevance}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-green-400">{formatMoney(recipient.totalProIsraelFunding)}</span>
            <span className="text-[10px] text-gray-600">total pro-Israel funding ({recipient.cycles})</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          {/* Top Donors */}
          {recipient.topDonors && recipient.topDonors.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Top Donors</span>
              <div className="mt-1 space-y-1">
                {recipient.topDonors.map((donor, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded px-3 py-1.5">
                    <span className="text-xs text-gray-300">{donor.organization}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-400">{formatMoney(donor.amount)}</span>
                      <span className="text-[10px] text-gray-600">{donor.cycle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relevant Votes */}
          {recipient.relevantVotes && recipient.relevantVotes.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Relevant Votes</span>
              <div className="mt-1 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] text-gray-600 uppercase tracking-wider">
                      <th className="text-left py-1 pr-3">Bill</th>
                      <th className="text-left py-1 pr-3">Date</th>
                      <th className="text-left py-1 pr-3">Vote</th>
                      <th className="text-left py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipient.relevantVotes.map((vote, i) => (
                      <tr key={i} className="border-t border-gray-800/50">
                        <td className="py-1.5 pr-3 text-gray-300 font-medium whitespace-nowrap">{vote.bill}</td>
                        <td className="py-1.5 pr-3 text-gray-500 font-mono whitespace-nowrap">{vote.date}</td>
                        <td className="py-1.5 pr-3">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            vote.vote === 'Yea'
                              ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                              : 'bg-red-900/30 text-red-400 border border-red-800/50'
                          }`}>
                            {vote.vote}
                          </span>
                        </td>
                        <td className="py-1.5 text-gray-400">{vote.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={recipient.sourceUrl} label={recipient.source} />
          </div>
        </div>
      )}
    </div>
  )
}

function DonorCard({ donor }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <TrendingUp size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{donor.name}</h4>
            <span className="text-[10px] text-gray-500">{donor.period}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-bold text-green-400">{formatMoney(donor.totalContributions)}</span>
            <span className="text-[10px] text-gray-600">{donor.recipientCount} recipients</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{donor.description}</p>

          {donor.notableRecipients && donor.notableRecipients.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Notable Recipients</span>
              <ul className="mt-1 space-y-1">
                {donor.notableRecipients.map((r, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-1 shrink-0">&#8226;</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={donor.sourceUrl} label={donor.source} />
          </div>
        </div>
      )}
    </div>
  )
}

function CorrelationCard({ correlation }) {
  const [expanded, setExpanded] = useState(false)

  const maxFunding = Math.max(correlation.avgProIsraelFundingYea, correlation.avgProIsraelFundingNay)
  const yeaWidth = maxFunding > 0 ? (correlation.avgProIsraelFundingYea / maxFunding) * 100 : 0
  const nayWidth = maxFunding > 0 ? (correlation.avgProIsraelFundingNay / maxFunding) * 100 : 0

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Vote size={16} className="text-purple-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-100">{correlation.bill}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-500 font-mono">{correlation.date}</span>
            <span className="text-[10px] text-gray-600">&middot;</span>
            <span className="text-[10px] text-gray-500">{correlation.chamber}</span>
            <span className="text-[10px] text-gray-600">&middot;</span>
            <span className="text-[10px] text-green-500">{correlation.yea} Yea</span>
            <span className="text-[10px] text-red-500">{correlation.nay} Nay</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{correlation.description}</p>

          {/* Funding comparison bars */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Avg Pro-Israel Funding by Vote</span>

            <div className="space-y-1.5">
              {/* Yea voters bar */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-green-400 font-medium">Yea Voters</span>
                  <span className="text-xs font-bold text-green-400">{formatMoney(correlation.avgProIsraelFundingYea)}</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500/60 rounded-full transition-all duration-500"
                    style={{ width: `${yeaWidth}%` }}
                  />
                </div>
              </div>

              {/* Nay voters bar */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-red-400 font-medium">Nay Voters</span>
                  <span className="text-xs font-bold text-red-400">{formatMoney(correlation.avgProIsraelFundingNay)}</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500/60 rounded-full transition-all duration-500"
                    style={{ width: `${nayWidth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg px-3 py-2">
            <p className="text-xs text-purple-300/80 leading-relaxed italic">{correlation.insight}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={correlation.sourceUrl} label={correlation.source} />
          </div>
        </div>
      )}
    </div>
  )
}

function KeyFactCard({ fact }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 leading-snug">{fact.fact}</p>
          <span className="text-[10px] text-gray-600 font-mono mt-1 inline-block">{fact.date}</span>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{fact.detail}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={fact.sourceUrl} label={fact.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Trump Connection Card ---

function TrumpConnectionCard({ connection }) {
  const [expanded, setExpanded] = useState(false)

  const categoryColors = {
    donations: { label: 'Donations', color: 'text-green-400', bg: 'bg-green-950/30' },
    policy: { label: 'Policy', color: 'text-blue-400', bg: 'bg-blue-950/30' },
    business: { label: 'Business', color: 'text-amber-400', bg: 'bg-amber-950/30' },
  }
  const catInfo = categoryColors[connection.category] || categoryColors.policy

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Crown size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-gray-100">{connection.title}</h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catInfo.color} ${catInfo.bg}`}>
              {catInfo.label}
            </span>
          </div>
          <span className="text-[10px] text-gray-600 font-mono mt-1 inline-block">{connection.date}</span>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 ml-[28px]">
          <p className="text-xs text-gray-400 leading-relaxed">{connection.detail}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url={connection.sourceUrl} label={connection.source} />
          </div>
        </div>
      )}
    </div>
  )
}

// --- Lobby Comparison Bar ---

function LobbyComparisonBar({ lobby, maxSpending }) {
  const widthPercent = maxSpending > 0 ? (lobby.spending2024 / maxSpending) * 100 : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${lobby.highlight ? 'text-red-400' : 'text-gray-400'}`}>
            {lobby.industry}
          </span>
          {lobby.highlight && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/50">
              PRO-ISRAEL
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${lobby.highlight ? 'text-red-400' : 'text-green-400'}`}>
            {formatMoney(lobby.spending2024)}
          </span>
          <span className="text-[10px] text-gray-600 w-8 text-right">{lobby.congressReachPercent}%</span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${lobby.highlight ? 'bg-red-500/70' : 'bg-green-500/40'}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  )
}

// --- Section Headers ---

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

// --- Main Page ---

export default function FollowTheMoneyPage() {
  const [filterParty, setFilterParty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showIntro, setShowIntro] = useState(false)

  // Calculated totals
  const totalOrgSpending = useMemo(() => {
    return lobbyData.organizations.reduce((sum, org) => sum + (org.totalSpending2024Cycle || 0), 0)
  }, [])

  const totalRecipients = lobbyData.topRecipients.length

  const totalDonorContributions = useMemo(() => {
    return lobbyData.majorDonors.reduce((sum, d) => sum + (d.totalContributions || 0), 0)
  }, [])

  // Filtered and sorted recipients
  const filteredRecipients = useMemo(() => {
    let recipients = [...lobbyData.topRecipients]

    // Party filter
    if (filterParty !== 'all') {
      recipients = recipients.filter(r => r.party === filterParty)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      recipients = recipients.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.chamber.toLowerCase().includes(q)
      )
    }

    // Sort by totalProIsraelFunding, highest first
    recipients.sort((a, b) => b.totalProIsraelFunding - a.totalProIsraelFunding)

    return recipients
  }, [filterParty, searchQuery])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">Follow the Money</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="hidden sm:flex items-center gap-1.5">
              <DollarSign size={12} className="text-green-400" />
              <span className="text-green-400 font-bold">{formatMoney(totalOrgSpending)}</span>
              <span>org spending</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Users size={12} className="text-blue-400" />
              <span className="text-blue-400 font-bold">{totalRecipients}</span>
              <span>recipients tracked</span>
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
            <DollarSign size={18} className="text-green-400 shrink-0" />
            <div className="flex-1 text-left">
              <h2 className="text-sm font-bold text-gray-200">US Political Lobby Money Ties to Israel</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Tap to see methodology, sources & disclaimer</p>
            </div>
            {showIntro ? <ChevronUp size={16} className="text-gray-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
          </button>
          {showIntro && (
            <div className="px-4 pb-4 ml-[30px] border-t border-gray-800/50 pt-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                {lobbyData.metadata.methodology}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
                {lobbyData.metadata.sources.map((src, i) => (
                  <span key={i} className="text-[10px] text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded">
                    {src}
                  </span>
                ))}
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mt-2">
                <p className="text-[10px] text-amber-500/80 leading-relaxed">
                  <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                  <strong>Important:</strong> {lobbyData.metadata.disclaimer}
                </p>
              </div>
              <div className="text-[10px] text-gray-600 mt-2">
                Last updated: {lobbyData.metadata.lastUpdated}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={12} className="text-green-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Org Spending (2024)</span>
            </div>
            <span className="text-lg font-bold text-green-400">{formatMoney(totalOrgSpending)}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={12} className="text-blue-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Recipients Tracked</span>
            </div>
            <span className="text-lg font-bold text-blue-400">{totalRecipients}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-amber-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Major Donor Total</span>
            </div>
            <span className="text-lg font-bold text-amber-400">{formatMoney(totalDonorContributions)}</span>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} className="text-red-400" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Key Fact</span>
            </div>
            <span className="text-xs text-gray-300 leading-snug">75% of Congress received pro-Israel lobby money in 2024</span>
          </div>
        </div>
      </div>

      {/* Organizations Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={Building2}
          iconColor="text-green-400"
          title="Organizations"
          count={lobbyData.organizations.length}
        />
        <div className="space-y-2">
          {lobbyData.organizations.map(org => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      </div>

      {/* Top Recipients Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={Users}
          iconColor="text-blue-400"
          title="Top Recipients"
          count={filteredRecipients.length}
        />

        {/* Filter controls */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {/* Party filter buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mr-1">Party:</span>
            {[
              { value: 'all', label: 'All' },
              { value: 'D', label: 'Democrat' },
              { value: 'R', label: 'Republican' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterParty(opt.value)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                  filterParty === opt.value
                    ? opt.value === 'D'
                      ? 'bg-blue-900/30 border-blue-800 text-blue-400'
                      : opt.value === 'R'
                        ? 'bg-red-900/30 border-red-800 text-red-400'
                        : 'bg-gray-800 border-gray-600 text-gray-200'
                    : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 bg-gray-900/60 border border-gray-800 rounded px-2.5 py-1">
            <Search size={12} className="text-gray-600" />
            <input
              type="text"
              placeholder="Search by name, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-40"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredRecipients.map(recipient => (
            <RecipientCard key={recipient.id} recipient={recipient} />
          ))}
          {filteredRecipients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No recipients match your filters.</p>
              <button
                onClick={() => { setFilterParty('all'); setSearchQuery('') }}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Major Donors Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={TrendingUp}
          iconColor="text-amber-400"
          title="Major Donors"
          count={lobbyData.majorDonors.length}
        />
        <div className="space-y-2">
          {lobbyData.majorDonors.map(donor => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      </div>

      {/* Voting Correlations Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={Vote}
          iconColor="text-purple-400"
          title="Voting Correlations"
          count={lobbyData.votingCorrelations.length}
        />
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Average pro-Israel lobby funding received by members of Congress, compared by how they voted on key legislation.
          Correlation does not establish causation.
        </p>
        <div className="space-y-2">
          {lobbyData.votingCorrelations.map(correlation => (
            <CorrelationCard key={correlation.id} correlation={correlation} />
          ))}
        </div>
      </div>

      {/* Key Facts Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <SectionHeader
          icon={AlertTriangle}
          iconColor="text-amber-400"
          title="Key Facts"
          count={lobbyData.keyFacts.length}
        />
        <div className="space-y-2">
          {lobbyData.keyFacts.map(fact => (
            <KeyFactCard key={fact.id} fact={fact} />
          ))}
        </div>
      </div>

      {/* Trump & Israel Section */}
      {lobbyData.trumpConnections && lobbyData.trumpConnections.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
          <SectionHeader
            icon={Crown}
            iconColor="text-amber-400"
            title="Trump & Israel Connections"
            count={lobbyData.trumpConnections.length}
          />
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Documented connections between Donald Trump's administration, business interests, and Israel policy.
            All entries are sourced from public records and verified reporting.
          </p>
          <div className="space-y-2">
            {lobbyData.trumpConnections.map(connection => (
              <TrumpConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>
      )}

      {/* Lobby Comparison Section */}
      {lobbyData.lobbyComparison && lobbyData.lobbyComparison.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <SectionHeader
            icon={BarChart3}
            iconColor="text-cyan-400"
            title="Lobbying Industry Comparison"
            count={lobbyData.lobbyComparison.length}
          />
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            How pro-Israel lobbying compares to other major US lobbying industries by 2024 cycle spending and congressional reach.
            The "% Congress" column shows the percentage of Congress members who received contributions from that industry.
          </p>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-wider font-semibold pb-1 border-b border-gray-800">
              <span>Industry</span>
              <div className="flex items-center gap-3">
                <span>2024 Spending</span>
                <span className="w-8 text-right">% Congress</span>
              </div>
            </div>
            {[...lobbyData.lobbyComparison]
              .sort((a, b) => b.spending2024 - a.spending2024)
              .map(lobby => (
                <LobbyComparisonBar
                  key={lobby.id}
                  lobby={lobby}
                  maxSpending={Math.max(...lobbyData.lobbyComparison.map(l => l.spending2024))}
                />
              ))
            }
          </div>

          <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3 mt-3">
            <p className="text-xs text-red-300/80 leading-relaxed">
              <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
              <strong>Key insight:</strong> While the pro-Israel lobby is not the highest-spending industry overall, it achieves the highest congressional reach relative to spending — reaching 75% of Congress with $158M, compared to pharma's 90% reach with $374M. Per dollar spent, pro-Israel lobbying has among the highest influence-to-spending ratios of any lobby in US politics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Source:</span>
            <SourceLink url="https://www.opensecrets.org/industries" label="OpenSecrets.org Industry Data" />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-400/80">TheOSSreport.com</span>
              <span>Follow the Money &mdash; US Political Lobby Ties to Israel</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>All data from public FEC filings and official Congressional records.</span>
            </div>
          </div>
          <div className="bg-gray-800/40 rounded-lg px-4 py-2.5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              <strong>Disclaimer:</strong> {lobbyData.metadata.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Data Sources:</span>
            {lobbyData.metadata.sources.map((src, i) => (
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
