import { Link } from 'react-router-dom'
import { AlertOctagon, Skull, Fuel, DollarSign, Target, Newspaper, MessageSquareQuote, MapPin, MessageCircle, Landmark, ExternalLink, ChevronRight, TrendingUp, TrendingDown, Shield, AlertTriangle, Droplet, Clock } from 'lucide-react'
import siteMetadata from '../../data/site-metadata.json'

// Data imports — each section is self-contained
import escalationsData from '../../data/escalations.json'
import deathTollData from '../../data/death-toll.json'
import oilData from '../../data/oil-tracker.json'
import gasData from '../../data/gas-prices.json'
import warCosts from '../../data/war-costs.json'
import missileStrikes from '../../data/missile-strikes.json'
import mediaData from '../../data/media-perspectives.json'
import statementsData from '../../data/statements-timeline.json'
import damageData from '../../data/damage-data.json'
import socialData from '../../data/social-posts.json'
import lobbyData from '../../data/lobby-data.json'
import hormuzData from '../../data/hormuz-shipping.json'

// ----- Reusable section wrapper -----
function SectionCard({ icon: Icon, title, color, route, children }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-sm font-semibold text-gray-200">{title}</span>
        </div>
        <Link to={route} className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors">
          See all <ChevronRight size={10} />
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ----- 1. Escalations -----
function EscalationsSummary() {
  const sorted = [...escalationsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const top = sorted.filter(e => e.severity === 'critical' || e.severity === 'high').slice(0, 3)

  return (
    <SectionCard icon={AlertOctagon} title="Latest Escalations" color="text-orange-400" route="/escalations">
      <div className="space-y-2">
        {top.map(e => (
          <div key={e.id} className="flex items-start gap-2">
            <span className={`shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${
              e.severity === 'critical' ? 'bg-red-900/60 text-red-300' : 'bg-orange-900/60 text-orange-300'
            }`}>{e.severity.toUpperCase()}</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-200 font-medium leading-snug line-clamp-2">{e.title}</p>
              <p className="text-[9px] text-gray-600 mt-0.5">{e.category} · {new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 2. Casualties -----
function CasualtySummary() {
  const currentWar = deathTollData.conflicts.find(c => c.name.includes('2026'))
  if (!currentWar) return null

  return (
    <SectionCard icon={Skull} title="Casualty Summary — 2026 War" color="text-red-400" route="/deaths">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {currentWar.parties.map(p => (
          <div key={p.name} className="bg-gray-800/50 rounded-lg p-2.5 text-center">
            <span className="text-lg">{p.flag}</span>
            <p className="text-[10px] text-gray-400 mt-1 truncate">{p.name}</p>
            <div className="mt-1">
              <p className="text-sm font-bold text-green-400">{p.confirmed.total.toLocaleString()}</p>
              <p className="text-[8px] text-gray-600">confirmed killed</p>
            </div>
            {p.injured > 0 && (
              <p className="text-[9px] text-orange-400 mt-0.5">{p.injured.toLocaleString()} injured</p>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 3. Energy & Oil -----
function EnergySummary() {
  const brentPre = oilData.oilPrices.preWar.brent.price
  const brentNow = oilData.oilPrices.current.brent.price
  const brentChange = ((brentNow - brentPre) / brentPre * 100).toFixed(1)
  const gasPre = gasData.preWarAverage
  const gasNow = gasData.currentAverage

  return (
    <SectionCard icon={Fuel} title="Energy & Oil Impact" color="text-amber-400" route="/follow-the-oil">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-[9px] text-gray-500 uppercase font-semibold">Brent Crude</p>
          <p className="text-lg font-bold text-amber-300">${brentNow.toFixed(2)}<span className="text-[10px] text-gray-500">/bbl</span></p>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp size={10} className="text-red-400" />
            <span className="text-[10px] text-red-400 font-semibold">+{brentChange}% since pre-war</span>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-[9px] text-gray-500 uppercase font-semibold">US Gas Avg</p>
          <p className="text-lg font-bold text-red-300">${gasNow.toFixed(2)}<span className="text-[10px] text-gray-500">/gal</span></p>
          <p className="text-[10px] text-gray-500">was ${gasPre.toFixed(2)} pre-war</p>
        </div>
        <div className="col-span-2 bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
          <Droplet size={16} className="text-red-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-red-300">Strait of Hormuz: {hormuzData.straitStatus.replace(/_/g, ' ').toUpperCase()}</p>
            <p className="text-[10px] text-gray-500">Day {hormuzData.blockadeDay} of blockade · {hormuzData.statistics?.vesselsDamaged || 0} vessels damaged</p>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ----- 4. War Costs -----
function CostSummary() {
  const us = warCosts.countryCosts.us
  const il = warCosts.countryCosts.israel
  const ir = warCosts.countryCosts.iran
  const fmt = (n) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
    return `$${n.toLocaleString()}`
  }

  return (
    <SectionCard icon={DollarSign} title="War Cost Tracker" color="text-green-400" route="/follow-the-cost">
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', direct: us.directMilitaryCosts.total, indirect: us.indirectCosts.total },
          { name: 'Israel', flag: '\u{1F1EE}\u{1F1F1}', direct: il.directMilitaryCosts.total, indirect: il.indirectCosts.total },
          { name: 'Iran', flag: '\u{1F1EE}\u{1F1F7}', direct: ir.directMilitaryCosts?.total || ir.estimatedMilitaryLosses?.total || 0, indirect: ir.indirectCosts?.total || ir.economicDamage?.total || 0 },
        ].map(c => (
          <div key={c.name} className="bg-gray-800/50 rounded-lg p-2.5 text-center">
            <span className="text-lg">{c.flag}</span>
            <p className="text-[10px] text-gray-400 mt-0.5">{c.name}</p>
            <p className="text-sm font-bold text-green-400 mt-1">{fmt(c.direct)}</p>
            <p className="text-[8px] text-gray-600">direct military</p>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-gray-600 mt-2 text-center">Day {warCosts.metadata.daysOfConflict} of conflict · Includes munitions, naval ops, air ops, personnel</p>
    </SectionCard>
  )
}

// ----- 5. Strikes -----
function StrikesSummary() {
  const total = missileStrikes.length
  const latest = [...missileStrikes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  return (
    <SectionCard icon={Target} title="Missile Strikes & Munitions" color="text-orange-400" route="/follow-the-munitions">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-900/30 border border-red-800/40 rounded-lg px-4 py-2 text-center">
          <p className="text-2xl font-bold text-red-400">{total}</p>
          <p className="text-[9px] text-gray-500">tracked strikes</p>
        </div>
        <div className="flex-1 text-[10px] text-gray-500">
          Across {[...new Set(missileStrikes.map(s => s.country))].length} countries. Includes ballistic missiles, cruise missiles, drone strikes, and naval attacks.
        </div>
      </div>
      <div className="space-y-1.5">
        {latest.map(s => (
          <div key={s.id} className="flex items-center gap-2 text-[10px]">
            <span className="text-red-400 shrink-0">●</span>
            <span className="text-gray-300 truncate">{s.city}, {s.country}</span>
            <span className="text-gray-600 shrink-0 ml-auto">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 6. Media -----
function MediaSummary() {
  return (
    <SectionCard icon={Newspaper} title="Media Coverage — Both Sides" color="text-purple-400" route="/media">
      <div className="space-y-2">
        {mediaData.categories.slice(0, 4).map(cat => {
          const latest = cat.outlets[0]
          if (!latest) return null
          return (
            <div key={cat.id} className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <div className="min-w-0">
                <p className="text-[9px] text-gray-500 uppercase font-semibold">{cat.label}</p>
                <p className="text-[10px] text-gray-300 leading-snug line-clamp-1">{latest.headline}</p>
                <p className="text-[9px] text-gray-600">{latest.name}</p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ----- 7. Key Statements -----
function StatementsSummary() {
  // Get latest statement from key speakers
  const keyIds = ['trump', 'khamenei', 'netanyahu']
  const statements = keyIds.map(id => {
    const speaker = statementsData.speakers.find(s => s.id === id)
    if (!speaker || !speaker.statements.length) return null
    const latest = speaker.statements[speaker.statements.length - 1]
    return { speaker, statement: latest }
  }).filter(Boolean)

  return (
    <SectionCard icon={MessageSquareQuote} title="Key Statements" color="text-purple-400" route="/follow-the-statements">
      <div className="space-y-2.5">
        {statements.map(({ speaker, statement }) => (
          <div key={speaker.id} className="bg-gray-800/50 rounded-lg p-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold" style={{ color: speaker.color }}>{speaker.shortName || speaker.name}</span>
              <span className="text-[9px] text-gray-600">{statement.date}</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">{statement.text}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 8. Damage -----
function DamageSummary() {
  const { summary } = damageData
  return (
    <SectionCard icon={MapPin} title="Damage Assessment" color="text-red-400" route="/follow-the-damage">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-gray-800/50 rounded p-2 text-center">
          <p className="text-lg font-bold text-red-400">{summary.totalSites}</p>
          <p className="text-[9px] text-gray-500">sites damaged</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2 text-center">
          <p className="text-lg font-bold text-amber-400">{summary.countriesAffected}</p>
          <p className="text-[9px] text-gray-500">countries</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2 text-center">
          <p className="text-lg font-bold text-green-400">{summary.confirmed}</p>
          <p className="text-[9px] text-gray-500">confirmed</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(summary.categories).map(([cat, count]) => (
          <span key={cat} className="text-[9px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            {cat}: {count}
          </span>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 9. Social Intel -----
function SocialSummary() {
  const sorted = [...socialData].sort((a, b) => {
    const engA = (a.engagement?.likes || 0) + (a.engagement?.retweets || 0)
    const engB = (b.engagement?.likes || 0) + (b.engagement?.retweets || 0)
    return engB - engA
  })
  const top = sorted.slice(0, 3)

  return (
    <SectionCard icon={MessageCircle} title="OSINT & Social Intel" color="text-blue-400" route="/social">
      <div className="space-y-2">
        {top.map(p => (
          <div key={p.id} className="bg-gray-800/50 rounded-lg p-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-blue-300">@{p.handle}</span>
              <span className="text-[9px] text-gray-600">{p.platform}</span>
              {p.verificationStatus === 'verified' && <Shield size={9} className="text-green-400" />}
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">{p.text}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- 10. Follow the Money -----
function MoneySummary() {
  const topOrgs = lobbyData.organizations?.slice(0, 3) || []
  const fmt = (n) => {
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
    if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
    return `$${n}`
  }

  return (
    <SectionCard icon={Landmark} title="Follow the Money" color="text-green-400" route="/follow-the-money">
      <div className="space-y-2">
        {topOrgs.map(org => (
          <div key={org.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200">{org.name}</p>
              <p className="text-[9px] text-gray-500 truncate">{org.fullName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-green-400">{fmt(org.totalSpending2024Cycle)}</p>
              <p className="text-[8px] text-gray-600">2024 cycle</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ----- Main Export -----
export default function HomepageSummary() {
  return (
    <div id="quick-brief" className="bg-gray-950 border-t border-gray-800">
      {/* Section header */}
      <div className="text-center py-6 px-4">
        <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Quick Brief</p>
        <p className="text-[11px] text-gray-600 mt-1">Highlights from every section — click any card to explore the full page</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Clock size={12} className="text-blue-400" />
          <span className="text-[11px] text-blue-400 font-semibold">
            Last updated: {new Date(siteMetadata.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles', hour12: true })} PT
          </span>
          <span className="text-[10px] text-gray-600">· Day {siteMetadata.conflictDay}</span>
        </div>
      </div>

      {/* Grid of summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-8 max-w-[1400px] mx-auto">
        <EscalationsSummary />
        <CasualtySummary />
        <EnergySummary />
        <CostSummary />
        <StrikesSummary />
        <MediaSummary />
        <StatementsSummary />
        <DamageSummary />
        <SocialSummary />
        <MoneySummary />
      </div>

      {/* Footer note */}
      <div className="text-center pb-6 px-4">
        <p className="text-[10px] text-gray-700">Data refreshed multiple times daily from verified sources. Click any section for full details and source links.</p>
      </div>
    </div>
  )
}
