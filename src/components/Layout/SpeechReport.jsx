import { useState } from 'react'
import { Mic, ChevronDown, ChevronUp, ExternalLink, TrendingDown, AlertTriangle, Globe, Zap, Fuel, Shield } from 'lucide-react'

const SPEECH_DATA = {
  title: "Trump's Primetime Address to the Nation",
  subtitle: "First formal address on the Iran war since Operation Epic Fury began",
  date: "April 1, 2026",
  day: "Day 33",
  duration: "~19 minutes",
  venue: "The White House",
  sections: [
    {
      icon: 'Zap',
      heading: 'War Status: "Nearing Completion"',
      points: [
        'Declared core strategic objectives "nearing completion" and estimated 2–3 more weeks of active combat.',
        'Promised to hit Iran "extremely hard" but offered no firm timeline or exit strategy.',
        'Claimed Iran\'s navy "absolutely destroyed," air force "in ruins," and missile/drone capability "dramatically curtailed."',
        'Stated key leaders killed, including former Supreme Leader Khamenei.',
      ],
      quote: '"We are gonna finish the job. We are getting very close… We\'re going to bring them back to the stone ages, where they belong."',
    },
    {
      icon: 'Shield',
      heading: 'Regime Change',
      points: [
        'Claimed regime change has occurred while insisting it was never the stated goal.',
        'Called new Iranian leadership "less radical and much more reasonable."',
        'Analysts noted no major defections in the Iranian government contradicting this claim.',
      ],
      quote: '"Regime change was not our goal. We never said regime change. But regime change has occurred because of all of their original leaders\' death — they\'re all dead."',
    },
    {
      icon: 'AlertTriangle',
      heading: 'Threats & Escalation',
      points: [
        'Threatened to strike "each and every one" of Iran\'s electric generating plants simultaneously if no deal is reached.',
        'Said the U.S. "could hit" Iran\'s oil infrastructure.',
        'The April 6 Hormuz deadline remains in effect, though he did not explicitly mention it.',
      ],
      quote: '"If there is no deal, we are going to hit each and every one of their electric generating plants very hard, and probably simultaneously."',
    },
    {
      icon: 'Globe',
      heading: 'Strait of Hormuz — Shifted to Allies',
      points: [
        'Downplayed U.S. reliance on the strait: "We don\'t need it."',
        'Told oil-importing nations to protect the passage themselves.',
        'Soufan Center assessed Trump as "willing to leave the Strait of Hormuz off the table, leaving other nations to deal with the consequences."',
      ],
      quote: '"Countries receiving oil through the strait must take care of that passage. Build up some delayed courage."',
    },
    {
      icon: 'Fuel',
      heading: 'Gas Prices & Economy',
      points: [
        'Blamed Iran entirely for surging gas prices (up 30%+, averaging over $4/gallon nationally).',
        'Promised prices would fall quickly after the war ends.',
        'No acknowledgment of Hormuz blockade\'s role in price surges.',
      ],
      quote: '"The increase was entirely the result of the Iranian regime launching deranged terror attacks against commercial oil tankers."',
    },
    {
      icon: 'Globe',
      heading: 'NATO Pullout Threat',
      points: [
        'In a same-day Telegraph interview, said he is "strongly considering" pulling the U.S. out of NATO because allies refused to join the war.',
        'Called NATO allies "cowards" and France "VERY UNHELPFUL" for blocking military supply flights over French airspace.',
        'Bipartisan pushback from Senators McConnell and Coons, who called NATO "the most successful military alliance in history."',
      ],
      quote: '"Oh yes, I would say (it\'s) beyond reconsideration."',
    },
    {
      icon: 'AlertTriangle',
      heading: 'Nuclear Justification',
      points: [
        'Claimed Iran was "right at the doorstep" of nuclear weapons to justify the war.',
        'Said there would be "no Middle East and no Israel" without his termination of the Obama-era nuclear deal.',
        'Contradicted by intelligence assessments showing no active Iranian weapons program.',
        'In a same-day Reuters interview, said he was no longer concerned about Iran\'s enriched uranium stockpile — a notable contradiction.',
      ],
    },
    {
      icon: 'Shield',
      heading: 'What Was NOT Said',
      points: [
        'No mention of negotiations or diplomacy, despite prior claims of talks with Iran.',
        'No ceasefire announcement or ground invasion escalation — analysts had expected one or the other.',
        'No mention of the 13 U.S. service members killed to date.',
        'Iran has denied any direct talks, acknowledging only messages through intermediaries.',
      ],
    },
  ],
  marketReaction: {
    heading: 'Immediate Market Reaction',
    items: [
      { label: 'Brent Crude', value: '+4%', detail: 'spiked to over $105/barrel', negative: true },
      { label: 'Dow Futures', value: '-260 pts', detail: '(−0.6%)', negative: true },
      { label: 'S&P 500 Futures', value: '-0.7%', detail: '', negative: true },
      { label: 'Nasdaq 100 Futures', value: '-0.8%', detail: '', negative: true },
      { label: 'Japan Nikkei', value: '-1.4%', detail: '', negative: true },
      { label: 'South Korea Kospi', value: '-2.82%', detail: '', negative: true },
    ],
  },
  publicOpinion: {
    heading: 'Public Opinion Context',
    items: [
      '60% of Americans disapprove of the war',
      '67% oppose paying higher gas prices for the conflict',
      'Only 28% overall support; even Republican support at 61%',
    ],
  },
  analystAssessment: 'Analysts broadly concluded the speech contained no new substance — Trump repeated four familiar arguments: the war is necessary, it has been won, it must continue, and it will end soon.',
  sources: [
    { name: 'NPR', url: 'https://www.npr.org/2026/04/01/nx-s1-5770093/trump-address-iran-war' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/news/2026/4/2/trumps-primetime-speech-on-iran-war-key-takeaways' },
    { name: 'CBS News', url: 'https://www.cbsnews.com/news/trump-primetime-speech-iran-today-2026-04-01/' },
    { name: 'Time', url: 'https://time.com/article/2026/04/02/trump-speech-white-house-iran-war-update-end/' },
    { name: 'Washington Post', url: 'https://www.washingtonpost.com/national/2026/04/01/iran-israel-us-lebanon-latest-april-1-2026/e5de1fa4-2d7f-11f1-aac2-f56b5ccad184_story.html' },
    { name: 'CNBC', url: 'https://www.cnbc.com/2026/04/01/trump-address-nation-iran-live-updates.html' },
    { name: 'PBS', url: 'https://www.pbs.org/newshour/world/trump-lashes-out-at-nato-allies-over-unpopular-mideast-war-widening-transatlantic-rift' },
    { name: 'White House', url: 'https://www.whitehouse.gov/releases/2026/04/president-trump-delivers-powerful-primetime-address-on-operation-epic-fury/' },
  ],
}

const iconMap = { Zap, Shield, AlertTriangle, Globe, Fuel }

export default function SpeechReport() {
  const [expanded, setExpanded] = useState(false)
  const [showAllSections, setShowAllSections] = useState(false)
  const d = SPEECH_DATA
  const visibleSections = showAllSections ? d.sections : d.sections.slice(0, 4)

  // Teaser highlights shown when collapsed
  const teaserTopics = [
    { label: 'War "nearing completion"', color: 'text-amber-300' },
    { label: 'Threatens Iran power grid', color: 'text-red-300' },
    { label: 'NATO pullout threat', color: 'text-orange-300' },
    { label: 'Tells allies: protect Hormuz yourselves', color: 'text-blue-300' },
    { label: 'Markets tumble', color: 'text-red-400' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-2">
      <div className={`bg-gradient-to-b from-gray-900 to-gray-900/80 border rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${expanded ? 'border-amber-500/30 shadow-amber-500/5' : 'border-amber-500/40 shadow-amber-500/10'}`}>
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-900/30 via-gray-900 to-gray-900 hover:from-amber-900/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${expanded ? 'bg-amber-500/15' : 'bg-amber-500/20 group-hover:bg-amber-500/25'}`}>
              <Mic size={20} className="text-amber-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-gray-100">{d.title}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full uppercase tracking-wider">Speech Report</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{d.date} · {d.day} · {d.duration} · {d.venue}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!expanded && (
              <span className="hidden sm:inline text-[10px] text-amber-400/70 font-medium group-hover:text-amber-300 transition-colors">
                Click to read full report
              </span>
            )}
            <div className={`p-1 rounded-full transition-colors ${!expanded ? 'bg-amber-500/10 group-hover:bg-amber-500/20' : ''}`}>
              {expanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-amber-400 animate-pulse" />}
            </div>
          </div>
        </button>

        {/* Collapsed teaser — key topics + quote preview */}
        {!expanded && (
          <div
            onClick={() => setExpanded(true)}
            className="px-5 pb-4 cursor-pointer group"
          >
            {/* Key quote teaser */}
            <div className="bg-gray-800/30 border-l-2 border-amber-500/40 rounded-r px-3 py-2 mb-3">
              <p className="text-xs text-amber-200/70 italic leading-relaxed line-clamp-2">
                "We are gonna finish the job. We are getting very close... We're going to bring them back to the stone ages, where they belong."
              </p>
            </div>

            {/* Topic pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {teaserTopics.map((topic, i) => (
                <span key={i} className={`text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-800/60 border border-gray-700/50 ${topic.color}`}>
                  {topic.label}
                </span>
              ))}
            </div>

            {/* Market snapshot */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingDown size={12} className="text-red-400" />
                <span className="text-[10px] text-gray-400">Post-speech:</span>
              </div>
              <span className="text-[10px] text-red-400 font-semibold">Brent +4%</span>
              <span className="text-[10px] text-red-400 font-semibold">Dow -260 pts</span>
              <span className="text-[10px] text-red-400 font-semibold">Kospi -2.82%</span>
            </div>

            {/* Expand prompt */}
            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-gray-800/60">
              <span className="text-[11px] text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">
                Read full speech report — 8 key topics, market reaction, analyst assessment
              </span>
              <ChevronDown size={14} className="text-amber-400 group-hover:text-amber-300 animate-bounce" />
            </div>
          </div>
        )}

        {expanded && (
          <div className="px-5 pb-5">
            {/* Subtitle */}
            <p className="text-sm text-gray-400 italic mt-4 mb-5 border-l-2 border-amber-500/40 pl-3">
              {d.subtitle}
            </p>

            {/* Key Sections */}
            <div className="space-y-4">
              {visibleSections.map((section, i) => {
                const Icon = iconMap[section.icon] || Zap
                return (
                  <div key={i} className="bg-gray-800/40 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Icon size={14} className="text-amber-400 shrink-0" />
                      <h3 className="text-sm font-semibold text-gray-200">{section.heading}</h3>
                    </div>
                    <ul className="space-y-1.5 ml-5">
                      {section.points.map((point, j) => (
                        <li key={j} className="text-xs text-gray-300 leading-relaxed list-disc marker:text-gray-600">
                          {point}
                        </li>
                      ))}
                    </ul>
                    {section.quote && (
                      <div className="mt-3 bg-gray-900/60 border-l-2 border-amber-500/30 rounded-r px-3 py-2">
                        <p className="text-xs text-amber-200/80 italic leading-relaxed">{section.quote}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Show more / less toggle */}
            {d.sections.length > 4 && (
              <button
                onClick={() => setShowAllSections(!showAllSections)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                {showAllSections ? 'Show less' : `Show ${d.sections.length - 4} more sections`}
                {showAllSections ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}

            {/* Market Reaction */}
            <div className="mt-5 bg-gray-800/40 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown size={14} className="text-red-400" />
                <h3 className="text-sm font-semibold text-gray-200">{d.marketReaction.heading}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {d.marketReaction.items.map((item, i) => (
                  <div key={i} className="bg-gray-900/60 rounded px-3 py-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${item.negative ? 'text-red-400' : 'text-green-400'}`}>
                      {item.value} <span className="text-[10px] text-gray-500 font-normal">{item.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Opinion */}
            <div className="mt-3 bg-gray-800/40 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">Public Opinion</h3>
              <div className="flex flex-wrap gap-3">
                {d.publicOpinion.items.map((item, i) => (
                  <span key={i} className="text-[11px] text-gray-400 bg-gray-900/60 px-3 py-1.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Analyst Assessment */}
            <div className="mt-3 bg-amber-900/10 border border-amber-500/15 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-1.5">Analyst Assessment</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{d.analystAssessment}</p>
            </div>

            {/* Sources */}
            <div className="mt-4 pt-3 border-t border-gray-800">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Sources</p>
              <div className="flex flex-wrap gap-2">
                {d.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 px-2 py-1 rounded transition-colors"
                  >
                    {src.name} <ExternalLink size={8} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
