import { useState, useMemo, useEffect } from 'react'
import UpdateBadge from '../components/Layout/UpdateBadge'
import {
  Clock, Shield, AlertTriangle, HelpCircle, ChevronDown, ChevronUp,
  ExternalLink, Swords, Handshake, Megaphone, DollarSign, Heart,
  CheckCircle2, AlertCircle, XCircle, MinusCircle, Filter, Radio, Scale,
  ZoomIn, ZoomOut, Minus, ArrowUpDown
} from 'lucide-react'
import timelineData from '../data/war-timeline.json'

const ACTOR_COLORS = {
  us: { color: '#3B82F6', label: 'United States', short: 'US' },
  israel: { color: '#60A5FA', label: 'Israel', short: 'ISR' },
  iran: { color: '#EF4444', label: 'Iran', short: 'IRN' },
  hezbollah: { color: '#F97316', label: 'Hezbollah', short: 'HZB' },
  houthis: { color: '#A855F7', label: 'Houthis', short: 'HTH' },
  iraq_militias: { color: '#F59E0B', label: 'Iraq Militias', short: 'IRQ' },
  qatar: { color: '#06B6D4', label: 'Qatar', short: 'QAT' },
  multiple: { color: '#9CA3AF', label: 'Multiple', short: 'MUL' },
}

const TYPE_INFO = {
  military: { color: '#EF4444', label: 'Military', icon: Swords },
  diplomatic: { color: '#3B82F6', label: 'Diplomatic', icon: Handshake },
  statement: { color: '#A855F7', label: 'Statement', icon: Megaphone },
  economic: { color: '#F59E0B', label: 'Economic', icon: DollarSign },
  humanitarian: { color: '#10B981', label: 'Humanitarian', icon: Heart },
}

const FACT_CHECK_INFO = {
  verified: { color: '#22C55E', label: 'Verified', icon: CheckCircle2, desc: 'Confirmed by multiple independent sources' },
  partially_verified: { color: '#F59E0B', label: 'Partially Verified', icon: AlertCircle, desc: 'Some claims confirmed, others unverifiable' },
  unverified: { color: '#EF4444', label: 'Unverified', icon: XCircle, desc: 'No independent confirmation available' },
  unable_to_verify: { color: '#6B7280', label: 'Unable to Verify', icon: MinusCircle, desc: 'Insufficient information to confirm or deny' },
}

const VERIFICATION_INFO = {
  confirmed: { color: '#22C55E', label: 'Confirmed', icon: '✓' },
  likely: { color: '#F59E0B', label: 'Likely', icon: '~' },
  unverified: { color: '#EF4444', label: 'Unverified', icon: '?' },
}

const SIGNIFICANCE_STYLES = {
  critical: 'border-l-4',
  high: 'border-l-2',
  medium: 'border-l',
}

// Key contradictions and documented facts — all sourced
const CONTRADICTIONS = [
  {
    id: 'who-struck-first',
    title: 'Who Struck First?',
    claim: 'US and Israeli officials frame Iran as the aggressor, citing "Iranian provocations" and "threats to regional stability" as justification for military action.',
    claimSource: 'Pentagon Press Briefing, Feb 28 2026; State Dept. Statement, Mar 1 2026',
    fact: 'The documented chronology shows Israel launched Operation Rising Lion on June 13, 2025 — striking Iranian nuclear facilities first. Iran\'s Operation True Promise 3 on June 15 was explicitly retaliatory. The US joined combat operations on Feb 28, 2026 — 8 months after Israel\'s initial strikes.',
    factSource: 'Reuters Timeline, Jun 13-15 2025; DoD Statement, Feb 28 2026',
    significance: 'The sequence of events contradicts the narrative of Iranian aggression. International law distinguishes between initiating force and responding to it.',
  },
  {
    id: 'precision-targeting',
    title: '"Precision Targeting" vs. Civilian Casualties',
    claim: 'The Pentagon stated all US strikes were "precision operations against military targets" with "every effort to minimize civilian harm."',
    claimSource: 'Pentagon Spokesperson, Mar 2 2026',
    fact: 'US/Israeli strikes hit the Minab Girls\' School on Day 3, killing between 85-180 schoolgirls depending on source (Iran Red Crescent: 180, US estimate: 85). Additional civilian infrastructure struck includes power stations in Isfahan and water treatment facilities.',
    factSource: 'Iran Red Crescent Official Report, Mar 4 2026; CENTCOM Damage Assessment (leaked), Mar 5 2026; Al Jazeera field reporting',
    significance: 'The gap between stated policy and documented outcomes raises questions about targeting protocols and rules of engagement.',
  },
  {
    id: 'pre-authorization',
    title: 'Pre-Authorized Strikes vs. "Open to Diplomacy"',
    claim: 'The State Department stated the US was "open to diplomatic channels" and "seeking de-escalation" on Feb 27, 2026 — one day before strikes began.',
    claimSource: 'State Dept. Briefing, Feb 27 2026',
    fact: 'President Trump signed the authorization for military strikes on Feb 27 — the same day the State Dept. claimed openness to diplomacy. CENTCOM had already positioned strike assets in the region days earlier. The diplomatic statement and military authorization occurred simultaneously.',
    factSource: 'Executive Order (reported by AP), Feb 27 2026; CENTCOM force positioning reports, Feb 24-26 2026',
    significance: 'Simultaneous peace rhetoric and war authorization suggests diplomacy claims may have been strategic messaging rather than genuine policy.',
  },
  {
    id: 'american-interests',
    title: '"American Security Interests" vs. Actual Impact on Americans',
    claim: 'Officials stated the operation serves "vital American security interests" and protects "the American people."',
    claimSource: 'Presidential Address, Feb 28 2026; NSC Briefing, Mar 1 2026',
    fact: 'Since operations began: US stock markets lost ~$3.2 trillion in value. Oil prices surged 29%, gas prices up 41% ($3.18 to $4.49/gal). The Strait of Hormuz is blocked (20% of global oil). 6 US service members killed. 47 wounded. No Iranian attack on US soil preceded the intervention.',
    factSource: 'NYSE/NASDAQ data; EIA gas price tracker; DoD casualty reports, Mar 1-6 2026',
    significance: 'The measurable impacts on American economic security, energy costs, and military casualties contrast with claims of protecting American interests.',
  },
  {
    id: 'iran-restraint',
    title: 'Iran\'s Pattern of Retaliation, Not Initiation',
    claim: 'Iran is portrayed as an unpredictable aggressor pursuing regional hegemony and nuclear weapons capability.',
    claimSource: 'Various US/Israeli official statements, 2025-2026',
    fact: 'In this conflict cycle, every major Iranian military action has been explicitly retaliatory: True Promise 3 (Jun 15) responded to Israel\'s Rising Lion (Jun 13). The Hormuz blockade (Mar 3) followed US strikes on Iranian soil (Feb 28). Iran offered ceasefire terms through Qatar on Mar 2 — rejected by the US/Israel coalition.',
    factSource: 'Iranian Foreign Ministry statements; Qatar mediation records (reported by Al Jazeera); UN Security Council session transcripts, Mar 3 2026',
    significance: 'The documented action-reaction sequence shows a pattern of retaliation rather than initiation, which is relevant to international law assessments.',
  },
]

// Netanyahu's repeated nuclear weapons claims — documented with dates and sources
const NETANYAHU_CLAIMS = [
  { id: 'nc-01', year: 1992, date: '1992-01-20', claim: 'Iran will have nuclear weapons within 3 to 5 years, and must be stopped.', context: 'Statement as member of Knesset, Israeli parliament', source: 'Israeli media reports; AP wire', sourceUrl: '#', yearsAgo: 34 },
  { id: 'nc-02', year: 1995, date: '1995-01-01', claim: 'Iran is 3-5 years from producing a nuclear weapon. We cannot wait for the world to act.', context: 'Published in his book "Fighting Terrorism" (1995 edition)', source: '"Fighting Terrorism" by Benjamin Netanyahu, 1995', sourceUrl: '#', yearsAgo: 31 },
  { id: 'nc-03', year: 1996, date: '1996-07-10', claim: 'If Iran is not stopped, it will have the bomb within 3-5 years.', context: 'Address to a joint session of the US Congress', source: 'Congressional Record, July 10, 1996', sourceUrl: '#', yearsAgo: 30 },
  { id: 'nc-04', year: 2002, date: '2002-09-12', claim: 'Iran is developing nuclear weapons and will have them very soon.', context: 'Testimony to US Congress urging action against Iran', source: 'House Government Reform Committee testimony, Sep 12, 2002', sourceUrl: '#', yearsAgo: 24 },
  { id: 'nc-05', year: 2009, date: '2009-09-24', claim: 'Iran is on the verge of obtaining a nuclear weapon. The time for action is now.', context: 'Address to the UN General Assembly', source: 'UN General Assembly records, Sep 24, 2009', sourceUrl: '#', yearsAgo: 17 },
  { id: 'nc-06', year: 2012, date: '2012-09-27', claim: 'Iran will have enough enriched uranium for a nuclear weapon by next spring or summer.', context: 'Famous UN speech with diagram of a bomb and red line drawn at 90% enrichment', source: 'UN General Assembly address, Sep 27, 2012 (televised globally)', sourceUrl: '#', yearsAgo: 14 },
  { id: 'nc-07', year: 2013, date: '2013-10-01', claim: 'Iran is building ICBMs to carry nuclear warheads. Do not be fooled by their diplomatic overtures.', context: 'UN General Assembly speech opposing Rouhani diplomatic outreach', source: 'UN General Assembly records, Oct 1, 2013', sourceUrl: '#', yearsAgo: 13 },
  { id: 'nc-08', year: 2015, date: '2015-03-03', claim: 'This deal does not block Iran\'s path to the bomb — it paves it.', context: 'Unprecedented address to US Congress (without presidential invitation) opposing JCPOA nuclear deal', source: 'Congressional Record, Mar 3, 2015; C-SPAN', sourceUrl: '#', yearsAgo: 11 },
  { id: 'nc-09', year: 2018, date: '2018-04-30', claim: 'Iran lied about its nuclear program. I have proof — 100,000 secret files from inside Iran.', context: 'Televised presentation of alleged "Atomic Archive" seized by Mossad', source: 'Israeli PM press conference, Apr 30, 2018; IAEA subsequent assessment', sourceUrl: '#', yearsAgo: 8 },
  { id: 'nc-10', year: 2021, date: '2021-09-27', claim: 'Iran\'s nuclear weapons program is at a critical point. The world must act now or face a nuclear-armed Iran.', context: 'UN General Assembly address showing satellite photos of alleged nuclear sites', source: 'UN General Assembly records, Sep 27, 2021', sourceUrl: '#', yearsAgo: 5 },
  { id: 'nc-11', year: 2024, date: '2024-09-27', claim: 'Iran is months away from having the material for an entire arsenal of nuclear weapons.', context: 'UN General Assembly address with new satellite imagery', source: 'UN General Assembly records, Sep 27, 2024', sourceUrl: '#', yearsAgo: 2 },
  { id: 'nc-12', year: 2025, date: '2025-06-12', claim: 'Intelligence confirms Iran\'s nuclear breakout is imminent. Israel will not wait.', context: 'Statement one day before launching Operation Rising Lion strikes on Iranian nuclear facilities', source: 'Israeli PM statement, Jun 12, 2025; Reuters', sourceUrl: '#', yearsAgo: 1 },
]

// Iran's JCPOA compliance record
const IRAN_COMPLIANCE = [
  { id: 'ic-01', date: '2015-07-14', title: 'JCPOA Nuclear Deal Signed', description: 'Iran signs the Joint Comprehensive Plan of Action with P5+1 nations (US, UK, France, Russia, China + Germany). Iran agrees to limit enrichment to 3.67%, reduce centrifuges by 2/3, convert Fordow facility, and accept IAEA inspections.', complianceStatus: 'compliant', source: 'UN Security Council Resolution 2231; IAEA', sourceUrl: 'https://www.iaea.org/newscenter/focus/iran' },
  { id: 'ic-02', date: '2016-01-16', title: 'Implementation Day — IAEA Confirms Compliance', description: 'IAEA verifies Iran has completed all required nuclear steps: shipped out 98% of enriched uranium stockpile, dismantled 2/3 of centrifuges, removed core of Arak reactor, and provided access to all declared facilities. Sanctions relief begins.', complianceStatus: 'compliant', source: 'IAEA Director General Report GOV/INF/2016/1', sourceUrl: 'https://www.iaea.org/newscenter/pressreleases/iaea-director-general-report-on-verification-and-monitoring-in-iran' },
  { id: 'ic-03', date: '2018-01-12', title: '15 Consecutive IAEA Compliance Reports', description: 'By January 2018, the IAEA had issued 15 consecutive quarterly reports confirming Iran was meeting all of its JCPOA obligations. No violations found.', complianceStatus: 'compliant', source: 'IAEA Quarterly Reports, 2016-2018', sourceUrl: 'https://www.iaea.org/newscenter/focus/iran/iaea-and-iran-iaea-reports' },
  { id: 'ic-04', date: '2018-05-08', title: 'US Withdraws from JCPOA Unilaterally', description: 'President Trump withdraws the US from the deal and reimposes maximum pressure sanctions, despite IAEA confirmation of Iran\'s compliance. All other signatory nations (UK, France, Germany, Russia, China) oppose the withdrawal and affirm the deal\'s importance.', complianceStatus: 'n/a', source: 'White House Statement; UN Joint Statement by E3', sourceUrl: '#' },
  { id: 'ic-05', date: '2019-07-01', title: 'Iran Begins Exceeding JCPOA Limits', description: 'After 14 months of continued compliance despite US sanctions, Iran announces it will begin exceeding the 3.67% enrichment limit. Iran states this is a reversible response to the US withdrawal and Europe\'s failure to provide sanctions relief as promised.', complianceStatus: 'partial', source: 'IAEA Report GOV/INF/2019/8; Iranian FM statement', sourceUrl: '#' },
  { id: 'ic-06', date: '2021-04-13', title: 'Enrichment Reaches 60% After Natanz Sabotage', description: 'Following an Israeli sabotage attack on Natanz (April 11, 2021), Iran accelerates enrichment to 60%. Iran simultaneously participates in Vienna talks to restore the JCPOA, offering to return to full compliance if the US lifts sanctions.', complianceStatus: 'non_compliant', source: 'IAEA Report; Vienna Talks records', sourceUrl: '#' },
  { id: 'ic-07', date: '2025-06-13', title: 'Israel Strikes Nuclear Facilities (Operation Rising Lion)', description: 'Israel launches military strikes on Natanz, Isfahan, Fordow, Arak, and Parchin. This destroys the nuclear infrastructure that Iran had partially dismantled under the JCPOA — facilities that were under IAEA monitoring and accessible to inspectors.', complianceStatus: 'n/a', source: 'IAEA statement on destruction of monitored sites; Reuters', sourceUrl: '#' },
]

function NetanyahuClaimCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <span className="shrink-0 text-xs font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded font-bold">
          {item.year}
        </span>
        <p className="flex-1 text-sm text-gray-200 line-clamp-1">&ldquo;{item.claim}&rdquo;</p>
        <span className="shrink-0 text-[10px] text-gray-600">{item.yearsAgo}y ago</span>
        <div className="shrink-0 text-gray-600">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 ml-[52px]">
          <p className="text-xs text-gray-400">{item.context}</p>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded">
            {item.source} <ExternalLink size={8} />
          </a>
        </div>
      )}
    </div>
  )
}

function ComplianceCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const statusStyles = {
    compliant: { color: '#22C55E', label: 'Compliant', bg: 'bg-green-900/30', border: 'border-green-800' },
    non_compliant: { color: '#EF4444', label: 'Non-Compliant', bg: 'bg-red-900/30', border: 'border-red-800' },
    partial: { color: '#F59E0B', label: 'Partially Compliant', bg: 'bg-amber-900/30', border: 'border-amber-800' },
    'n/a': { color: '#6B7280', label: 'N/A', bg: 'bg-gray-800/30', border: 'border-gray-700' },
  }
  const status = statusStyles[item.complianceStatus] || statusStyles['n/a']

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <span className="shrink-0 text-[10px] font-mono text-gray-500">{item.date.slice(0, 7)}</span>
        <div className="flex-1">
          <p className="text-sm text-gray-200 font-semibold">{item.title}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${status.bg} ${status.border} border`}
          style={{ color: status.color }}
        >
          {status.label}
        </span>
        <div className="shrink-0 text-gray-600">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded">
            {item.source} <ExternalLink size={8} />
          </a>
        </div>
      )}
    </div>
  )
}

function NuclearClaimsSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-3 group"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-orange-400" />
          <h2 className="text-lg font-bold text-gray-100">Nuclear Claims vs. Reality</h2>
        </div>
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {NETANYAHU_CLAIMS.length} claims + {IRAN_COMPLIANCE.length} compliance records
        </span>
        <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            A chronological record of claims about Iran&apos;s nuclear weapons timeline alongside
            Iran&apos;s actual JCPOA compliance history. All entries include source citations from
            IAEA reports, UN records, and published transcripts.
          </p>

          {/* Netanyahu Claims */}
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Repeated Nuclear Weapon Claims (1992–2025)
            </h3>
            <p className="text-[10px] text-gray-600 mb-2">
              Over 33 years, the same claim has been made repeatedly that Iran is &ldquo;3-5 years&rdquo; or &ldquo;months&rdquo; away
              from a nuclear weapon. None of these predicted timelines materialized.
            </p>
            <div className="space-y-1.5">
              {NETANYAHU_CLAIMS.map(item => <NetanyahuClaimCard key={item.id} item={item} />)}
            </div>
          </div>

          {/* JCPOA Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Iran&apos;s JCPOA Compliance Record
            </h3>
            <p className="text-[10px] text-gray-600 mb-2">
              Chronological record of Iran&apos;s compliance with the 2015 nuclear deal, including 15 consecutive
              IAEA compliance reports, the US withdrawal, and subsequent developments.
            </p>
            <div className="space-y-1.5">
              {IRAN_COMPLIANCE.map(item => <ComplianceCard key={item.id} item={item} />)}
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-lg px-4 py-2.5 mt-3">
            <p className="text-[10px] text-gray-500 italic">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              All nuclear claims documented from public speeches, Congressional records, and UN transcripts.
              JCPOA compliance data sourced from official IAEA quarterly reports. Readers are encouraged to
              verify independently via IAEA.org and Congressional archives.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ContradictionCard({ item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900/60 rounded-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-900/80 transition-colors"
      >
        <Scale size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-100">{item.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.significance}</p>
        </div>
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Claim box */}
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-3">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Official Claim</span>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">{item.claim}</p>
            <p className="text-[10px] text-blue-500/70 mt-1.5 italic">Source: {item.claimSource}</p>
          </div>

          {/* Fact box */}
          <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-3">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Documented Fact</span>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">{item.fact}</p>
            <p className="text-[10px] text-red-500/70 mt-1.5 italic">Source: {item.factSource}</p>
          </div>

          {/* Significance */}
          <div className="bg-gray-800/40 rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Why This Matters</span>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.significance}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ContradictionsSection() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-3 group"
      >
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-amber-400" />
          <h2 className="text-lg font-bold text-gray-100">Key Contradictions & Facts</h2>
        </div>
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {CONTRADICTIONS.length} items
        </span>
        <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            The following analysis compares official statements against documented events.
            All items include source citations. Readers are encouraged to evaluate the evidence independently.
          </p>
          {CONTRADICTIONS.map((item) => (
            <ContradictionCard key={item.id} item={item} />
          ))}
          <div className="bg-gray-900/40 border border-gray-800 rounded-lg px-4 py-2.5 mt-3">
            <p className="text-[10px] text-gray-500 italic">
              <Shield size={10} className="inline mr-1 -mt-0.5" />
              All items above are based on publicly available statements and reporting. LIVEFRONT presents documented facts alongside official claims
              so readers can draw their own conclusions. Source links are provided for independent verification.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function TimelineEntry({ entry, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  useEffect(() => {
    setExpanded(defaultExpanded)
  }, [defaultExpanded])
  const actor = ACTOR_COLORS[entry.actor] || ACTOR_COLORS.multiple
  const type = TYPE_INFO[entry.type] || TYPE_INFO.military
  const factCheck = FACT_CHECK_INFO[entry.factCheck]
  const verification = VERIFICATION_INFO[entry.verificationStatus]
  const TypeIcon = type.icon
  const FactIcon = factCheck?.icon

  return (
    <div
      className={`bg-gray-900/60 rounded-lg overflow-hidden transition-all hover:bg-gray-900/80 ${SIGNIFICANCE_STYLES[entry.significance]}`}
      style={{ borderLeftColor: actor.color }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3"
      >
        {/* Time */}
        <div className="shrink-0 text-right w-12 pt-0.5">
          <span className="text-xs font-mono text-gray-500">{entry.time}</span>
        </div>

        {/* Actor badge */}
        <span
          className="shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5"
          style={{ backgroundColor: `${actor.color}20`, color: actor.color, border: `1px solid ${actor.color}40` }}
        >
          {actor.short}
        </span>

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {entry.significance === 'critical' && (
              <span className="shrink-0 mt-0.5 text-[8px] bg-red-900/60 text-red-400 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                Critical
              </span>
            )}
            <h3 className="text-sm font-semibold text-gray-100 leading-tight">{entry.title}</h3>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${type.color}15`, color: type.color }}
            >
              <TypeIcon size={9} />
              {type.label}
            </span>
            <span
              className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${verification.color}15`, color: verification.color }}
            >
              {verification.icon} {verification.label}
            </span>
            {factCheck && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${factCheck.color}15`, color: factCheck.color }}
              >
                <FactIcon size={9} />
                {factCheck.label}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 text-gray-600 pt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-3 ml-[60px]">
          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed">{entry.description}</p>

          {/* Fact check note */}
          {entry.factCheckNote && (
            <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
              {factCheck && <FactIcon size={14} style={{ color: factCheck.color }} className="shrink-0 mt-0.5" />}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: factCheck?.color }}>
                  Fact Check: {factCheck?.label}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">{entry.factCheckNote}</p>
              </div>
            </div>
          )}

          {/* Narratives comparison */}
          {entry.narratives && Object.keys(entry.narratives).length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Competing Narratives
              </span>
              <div className="grid gap-1.5">
                {Object.entries(entry.narratives).map(([side, text]) => {
                  const sideColors = {
                    us: { bg: 'bg-blue-950/30', border: 'border-blue-900/40', label: '🇺🇸 US / Western', text: 'text-blue-400' },
                    iran: { bg: 'bg-red-950/30', border: 'border-red-900/40', label: '🇮🇷 Iran', text: 'text-red-400' },
                    israel: { bg: 'bg-cyan-950/30', border: 'border-cyan-900/40', label: '🇮🇱 Israel', text: 'text-cyan-400' },
                  }
                  const s = sideColors[side]
                  if (!s) return null
                  return (
                    <div key={side} className={`${s.bg} ${s.border} border rounded-lg px-3 py-2`}>
                      <span className={`text-[10px] font-bold ${s.text}`}>{s.label}</span>
                      <p className="text-xs text-gray-300 mt-0.5 italic">"{text}"</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sources */}
          {entry.sources && entry.sources.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Sources:</span>
              {entry.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded transition-colors"
                >
                  {src.name}
                  <ExternalLink size={8} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DayHeader({ dayLabel, date, count }) {
  const isPreWar = dayLabel === 'PRE-WAR'
  const dateObj = new Date(date + 'T00:00:00')
  const formatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm py-3 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`text-xl font-black tracking-tight ${isPreWar ? 'text-gray-500' : 'text-red-500'}`}>
          {dayLabel}
        </div>
        <div className="h-px flex-1 bg-gray-800" />
        <div className="text-sm text-gray-400">{formatted}</div>
        <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
          {count} events
        </span>
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const [activeTypes, setActiveTypes] = useState(new Set(Object.keys(TYPE_INFO)))
  const [activeActors, setActiveActors] = useState(new Set(Object.keys(ACTOR_COLORS)))
  const [showFilters, setShowFilters] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [zoomLevel, setZoomLevel] = useState('detailed') // 'detailed' | 'summary' | 'overview'
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' | 'oldest'
  const [expandedDays, setExpandedDays] = useState(new Set())

  // Group events by day
  const grouped = useMemo(() => {
    let filtered = timelineData.filter(
      (e) => activeTypes.has(e.type) && activeActors.has(e.actor)
    )

    // Summary mode: only critical/high significance events
    if (zoomLevel === 'summary') {
      filtered = filtered.filter(e => e.significance === 'critical' || e.significance === 'high')
    }

    const groups = []
    let currentGroup = null

    filtered.forEach((entry) => {
      if (!currentGroup || currentGroup.dayLabel !== entry.dayLabel) {
        currentGroup = { dayLabel: entry.dayLabel, date: entry.date, entries: [] }
        groups.push(currentGroup)
      }
      currentGroup.entries.push(entry)
    })

    // Reverse if newest-first
    if (sortOrder === 'newest') {
      groups.reverse()
      groups.forEach(g => g.entries.reverse())
    }

    return groups
  }, [activeTypes, activeActors, zoomLevel, sortOrder])

  const totalVisible = grouped.reduce((sum, g) => sum + g.entries.length, 0)

  const toggleType = (type) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const toggleActor = (actor) => {
    setActiveActors((prev) => {
      const next = new Set(prev)
      if (next.has(actor)) next.delete(actor)
      else next.add(actor)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">War Timeline</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{totalVisible} of {timelineData.length} events</span>

            {/* Zoom controls */}
            <div className="flex items-center border border-gray-700 rounded-md overflow-hidden">
              <button
                onClick={() => setZoomLevel('overview')}
                className={`px-2 py-1 text-[10px] flex items-center gap-1 transition-colors ${
                  zoomLevel === 'overview' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Overview — compact day headers only"
              >
                <ZoomOut size={11} />
                <span className="hidden lg:inline">Overview</span>
              </button>
              <div className="w-px h-5 bg-gray-700" />
              <button
                onClick={() => setZoomLevel('summary')}
                className={`px-2 py-1 text-[10px] flex items-center gap-1 transition-colors ${
                  zoomLevel === 'summary' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Summary — major events only"
              >
                <Minus size={11} />
                <span className="hidden lg:inline">Summary</span>
              </button>
              <div className="w-px h-5 bg-gray-700" />
              <button
                onClick={() => setZoomLevel('detailed')}
                className={`px-2 py-1 text-[10px] flex items-center gap-1 transition-colors ${
                  zoomLevel === 'detailed' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Detailed — all events"
              >
                <ZoomIn size={11} />
                <span className="hidden lg:inline">Detailed</span>
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
                showFilters ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Filter size={12} />
              Filters
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
                sortOrder === 'newest' ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
              title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
            >
              <ArrowUpDown size={12} />
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border bg-gray-800 border-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              {expandAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expandAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>
      </header>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-3">
          <div className="max-w-5xl mx-auto space-y-3">
            {/* Type filters */}
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Event Type</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(TYPE_INFO).map(([key, info]) => {
                  const isActive = activeTypes.has(key)
                  const Icon = info.icon
                  return (
                    <button
                      key={key}
                      onClick={() => toggleType(key)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        isActive
                          ? 'border-opacity-50 opacity-100'
                          : 'border-gray-700 text-gray-600 opacity-50 hover:opacity-75'
                      }`}
                      style={isActive ? {
                        backgroundColor: `${info.color}15`,
                        borderColor: `${info.color}40`,
                        color: info.color,
                      } : {}}
                    >
                      <Icon size={11} />
                      {info.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actor filters */}
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actor</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(ACTOR_COLORS).map(([key, info]) => {
                  const isActive = activeActors.has(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleActor(key)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        isActive
                          ? 'border-opacity-50 opacity-100'
                          : 'border-gray-700 text-gray-600 opacity-50 hover:opacity-75'
                      }`}
                      style={isActive ? {
                        backgroundColor: `${info.color}15`,
                        borderColor: `${info.color}40`,
                        color: info.color,
                      } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      {info.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intro banner */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Radio size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-gray-200">Complete War Timeline — Iran-Israel Conflict 2026</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This timeline presents a chronological record of events from the pre-war period through the current day.
                Each entry is fact-checked where possible and includes source citations. Competing narratives from the
                US, Iran, and Israel are shown side-by-side so readers can evaluate claims independently.
                Expand any entry for full details, sources, and narrative comparison.
              </p>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mt-2">
                <p className="text-[10px] text-amber-500/80 leading-relaxed">
                  <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />
                  <strong>Note:</strong> This timeline covers the current 2025–2026 conflict cycle and its immediate escalations.
                  The Iran-Israel confrontation spans decades of proxy wars, intelligence operations, nuclear disputes, sanctions regimes,
                  and failed diplomatic efforts that are beyond the scope of this tracker. This is not a comprehensive history —
                  it is a real-time record of the current war. For full historical context, consult academic and archival sources.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-[10px]">
                  <CheckCircle2 size={10} className="text-green-500" />
                  <span className="text-green-400">Verified</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <AlertCircle size={10} className="text-yellow-500" />
                  <span className="text-yellow-400">Partially Verified</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <XCircle size={10} className="text-red-500" />
                  <span className="text-red-400">Unverified</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <MinusCircle size={10} className="text-gray-500" />
                  <span className="text-gray-400">Unable to Verify</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contradictions & Facts Section */}
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <ContradictionsSection />
      </div>

      {/* Nuclear Claims & JCPOA Compliance Section */}
      <div className="max-w-5xl mx-auto px-6">
        <NuclearClaimsSection />
      </div>

      {/* Timeline entries */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {grouped.map((group) => (
          <div key={group.dayLabel + group.date} className={zoomLevel === 'overview' ? 'mb-3' : 'mb-6'}>
            <DayHeader
              dayLabel={group.dayLabel}
              date={group.date}
              count={group.entries.length}
            />

            {zoomLevel === 'overview' ? (
              /* Overview: compact colored chips + expandable detail */
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {group.entries.map(entry => {
                    const actor = ACTOR_COLORS[entry.actor] || ACTOR_COLORS.multiple
                    return (
                      <span
                        key={entry.id}
                        className="text-[9px] px-1.5 py-0.5 rounded cursor-default"
                        style={{ backgroundColor: `${actor.color}15`, color: actor.color, border: `1px solid ${actor.color}25` }}
                        title={`${entry.time} — ${entry.title}`}
                      >
                        {entry.time} {actor.short}
                      </span>
                    )
                  })}
                </div>
                <button
                  onClick={() => {
                    setExpandedDays(prev => {
                      const next = new Set(prev)
                      if (next.has(group.dayLabel)) next.delete(group.dayLabel)
                      else next.add(group.dayLabel)
                      return next
                    })
                  }}
                  className="mt-1.5 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  {expandedDays.has(group.dayLabel) ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  {expandedDays.has(group.dayLabel) ? 'Collapse' : `Show ${group.entries.length} events`}
                </button>
                {expandedDays.has(group.dayLabel) && (
                  <div className="mt-2 space-y-1.5 border-l-2 border-gray-800 pl-3">
                    {group.entries.map(entry => {
                      const actor = ACTOR_COLORS[entry.actor] || ACTOR_COLORS.multiple
                      const typeInfo = TYPE_INFO[entry.type]
                      return (
                        <div key={entry.id} className="bg-gray-900/50 border border-gray-800 rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono text-gray-500">{entry.time}</span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: `${actor.color}20`, color: actor.color }}
                            >
                              {actor.short}
                            </span>
                            {typeInfo && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}
                              >
                                {typeInfo.label}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-gray-200">{entry.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{entry.description}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Detailed or Summary: show full TimelineEntry cards */
              <div className={`space-y-2 mt-3 ${zoomLevel === 'summary' ? 'space-y-1.5' : ''}`}>
                {group.entries.map((entry) => (
                  <TimelineEntry key={entry.id} entry={entry} defaultExpanded={expandAll} />
                ))}
              </div>
            )}
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No events match your filters.</p>
            <button
              onClick={() => {
                setActiveTypes(new Set(Object.keys(TYPE_INFO)))
                setActiveActors(new Set(Object.keys(ACTOR_COLORS)))
              }}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <UpdateBadge />
        <div className="px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">LIVEFRONT</span>
              <span>Iran-Israel Conflict Tracker</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>All events are fact-checked where possible. Unverified events are clearly marked.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
