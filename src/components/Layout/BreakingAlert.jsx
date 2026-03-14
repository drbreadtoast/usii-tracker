import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'

// Breaking alerts — only for major, verified-or-actively-developing stories
const BREAKING_ALERTS = [
  {
    id: 'ba-005',
    headline: 'Is Netanyahu Dead or Alive? Death Rumors Flood Social Media — "Six Fingers" AI Video, Fake Screenshots, Son Yair Missing From Public. Multiple Fact-Checkers Say: ALIVE. Last Confirmed Appearance: March 12 Press Conference.',
    status: 'developing',
    lastUpdated: '2026-03-14T22:30:00Z',
    summary: 'Viral claims that Israeli PM Benjamin Netanyahu was killed in an Iranian missile strike have flooded social media since March 12. The rumors are fueled by a video showing what users claimed were "six fingers" (suggesting AI deepfake), his son Yair\'s absence from social media since March 9, and a fake screenshot of the Israeli PM account announcing his death. Multiple fact-checkers — Snopes, PolitiFact, Lead Stories — have rated the death claims FALSE. Netanyahu\'s last confirmed live appearance was a press conference on March 12, two days ago. No live, time-stamped video has emerged since. Iranian state media (Tasnim News Agency) has actively amplified the rumors.',
    officialStatus: {
      label: 'Research Findings — Multiple Sources Analyzed',
      detail: 'EVIDENCE HE IS ALIVE: (1) Netanyahu held a live press conference on March 12 broadcast by the Israeli Government Press Office. He stated Israel is "becoming stronger than ever" and claimed Israeli strikes killed Iranian nuclear scientists. (2) Netanyahu\'s office dismissed Iranian claims about his fate as "fake news." (3) Official photos released showing security meetings with Defense Minister, IDF Chief of Staff, and Mossad Director. (4) Snopes, PolitiFact, and Lead Stories all rate death claims as FALSE. (5) AI detection tools found only 0.1% likelihood the March 12 video was AI-generated.\n\nSUSPICIOUS ELEMENTS FUELING RUMORS: (1) No live, time-stamped video since March 12 — two days with no visual confirmation. (2) Son Yair Netanyahu has not posted on X/Twitter since March 9 — unusual given his typically active presence. (3) Iran\'s Tasnim News Agency (IRGC-linked) published a detailed report claiming Netanyahu disappeared from public view for "nearly four days." (4) George Galloway publicly questioned why Israel released a video in which Netanyahu "literally sported six fingers." (5) Postponement of visits by Jared Kushner and Steve Witkoff cited as circumstantial evidence.\n\nSIX FINGERS CLAIM DEBUNKED: The viral "six fingers" screenshot was caused by Netanyahu\'s hypothenar eminence (palm muscle) creating a shadow that resembled a sixth finger. Full video analysis shows ordinary motion blur. PolitiFact rated the claim "Pants on Fire."\n\nFAKE DEATH SCREENSHOT: A fabricated screenshot purporting to show the Israeli PM\'s official X account announcing his death was confirmed fake by Snopes — no such post was ever published.\n\nOUR ASSESSMENT: Death rumors appear to be part of Iranian psychological warfare amplified by IRGC-linked media. However, the two-day gap since his last live appearance and his son\'s social media silence are notable. We will continue monitoring for a new live, verifiable appearance.',
      sources: [
        { name: 'Snopes — Was Netanyahu killed in Iranian missile attack?', url: 'https://www.snopes.com/news/2026/03/12/benjamin-netanyahu-dead-rumor/' },
        { name: 'PolitiFact — Netanyahu didn\'t have six fingers, video is real', url: 'https://www.politifact.com/factchecks/2026/mar/13/social-media/netanyahu-dead-video-artificial-intelligence/' },
        { name: 'Lead Stories — Video does NOT show six fingers', url: 'https://leadstories.com/hoax-alert/2026/03/fact-check-video-does-not-show-netanyahu-with-six-fingers-on-his-right-hand.html' },
        { name: 'Snopes — Netanyahu six fingers AI claim debunked', url: 'https://www.snopes.com/fact-check/netanyahu-6-fingers-ai/' },
        { name: 'Al Jazeera — Netanyahu says Israel "stronger than ever"', url: 'https://www.aljazeera.com/news/2026/3/12/netanyahu-says-israel-stronger-than-ever-in-first-speech-since-iran-war' },
        { name: 'Times of Israel — Netanyahu press conference (live)', url: 'https://www.timesofisrael.com/liveblog_entry/watch-netanyahu-holding-his-first-press-conference-of-current-iran-war/' },
        { name: 'Jerusalem Post — Iran publishes false conspiracy theory', url: 'https://www.jpost.com/middle-east/iran-news/article-889415' },
        { name: 'The Week — Israeli media responds to PM\'s situation', url: 'https://www.theweek.in/news/middle-east/2026/03/14/is-benjamin-netanyahu-dead-israeli-media-finally-has-a-response-to-the-prime-ministers-situation.html' },
        { name: 'Sunday Guardian — Yair Netanyahu missing from public', url: 'https://sundayguardianlive.com/fact-check-where-is-yair-netanyahu-benjamin-netanyahus-son-missing-from-public-appearances-for-days-as-viral-posts-claim-israeli-pm-is-dead-176325/' },
        { name: 'Iran\'s Tasnim News — Speculation about Netanyahu', url: 'https://www.tasnimnews.ir/en/news/2026/03/14/3540117/mystery-of-netanyahu-s-ai-speech-disappearance-unraveled' },
      ]
    },
    cyberAttack: null,
    context: 'These rumors have emerged during an unprecedented information war surrounding the 2026 Iran-Israel conflict. Iran\'s intelligence apparatus has been running active disinformation campaigns since the war began on February 28. The death of former Supreme Leader Ayatollah Khamenei in the initial strikes created a motive for retaliatory propaganda. Tasnim News Agency is widely described as IRGC-affiliated and has been sanctioned by the US Treasury. AI-generated images of Netanyahu "injured" and fake audio of him speaking Farsi have also been identified. Meanwhile, legitimate questions about his reduced public appearances remain unanswered — his last confirmed live, time-stamped appearance was the March 12 press conference.'
  },
  {
    id: 'ba-004',
    headline: 'US KC-135 Stratotanker Crashes in Western Iraq — All 6 Crew Members Confirmed Dead. Total US Military Deaths Now 13 in Operation Epic Fury.',
    status: 'confirmed',
    lastUpdated: '2026-03-13T16:00:00Z',
    summary: 'A US Air Force KC-135 Stratotanker refueling aircraft crashed in western Iraq near the Jordanian border on March 12. CENTCOM confirmed all six crew members were killed. A second KC-135 involved in the same mission landed safely in Israel with nearly half its vertical stabilizer missing, suggesting a possible mid-air collision. This brings total US military deaths in Operation Epic Fury to 13. The Islamic Resistance in Iraq claimed responsibility but provided no evidence. CENTCOM stated the crash was "not due to hostile fire or friendly fire."',
    officialStatus: {
      label: 'Confirmed — CENTCOM & Multiple Sources',
      detail: 'CENTCOM confirmed the loss of the KC-135 Stratotanker and all six crew members. The aircraft crashed in western Iraq near Turaibil (Iraqi-Jordanian border) at approximately 2 PM ET on March 12. A second KC-135 from the same mission landed at Ben Gurion Airport in Israel with significant damage to its vertical stabilizer. The damaged aircraft has been identified as serial 63-8017, a KC-135R from the 314th Air Refueling Squadron, 940th Air Refueling Wing, Beale Air Force Base, California. An investigation is underway.',
      sources: [
        { name: 'CNN — US Air Force KC-135 lost over Iraq', url: 'https://www.cnn.com/2026/03/12/middleeast/us-air-force-refueling-aircraft-kc135-lost-intl-hnk-ml' },
        { name: 'Al Jazeera — 6 US service members killed in jet crash', url: 'https://www.aljazeera.com/news/2026/3/12/us-military-announces-loss-of-refueling-aircraft-over-western-iraq' },
        { name: 'CNBC — KC-135 crash details', url: 'https://www.cnbc.com/2026/03/13/us-kc135-crash-iraq-iran-threats-shipping-attacks.html' },
      ]
    },
    cyberAttack: null,
    context: 'This is the fourth US aircraft loss since Operation Epic Fury began on February 28. Three F-15 fighters were previously shot down by friendly fire from Kuwait\'s air defenses. Total US casualties now stand at 13 killed and approximately 140 wounded. Defense Secretary Hegseth stated Iran\'s missile launch capability has been reduced by 90% and drone capability by 95%, with over 15,000 targets struck.'
  }
]

function StatusBadge({ status }) {
  if (status === 'debunked') return (
    <span className="inline-flex items-center gap-1 bg-red-900/60 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <XCircle size={10} /> DEBUNKED
    </span>
  )
  if (status === 'confirmed') return (
    <span className="inline-flex items-center gap-1 bg-green-900/60 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <CheckCircle size={10} /> CONFIRMED
    </span>
  )
  if (status === 'developing') return (
    <span className="inline-flex items-center gap-1 bg-yellow-900/60 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
      <Clock size={10} /> DEVELOPING
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 bg-gray-700/60 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <HelpCircle size={10} /> UNCONFIRMED
    </span>
  )
}

function SourceLink({ name, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
    >
      {name} <ExternalLink size={8} />
    </a>
  )
}

function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false)
  const updatedDate = new Date(alert.lastUpdated)
  const timeStr = updatedDate.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles', hour12: true
  }) + ' PT'

  return (
    <div className="border-b border-red-900/30 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-950/40 transition-colors"
      >
        <StatusBadge status={alert.status} />
        {/* Scrolling headline */}
        <div className="flex-1 min-w-0 overflow-hidden group">
          <div className="marquee-track whitespace-nowrap text-xs text-red-100 font-medium">
            <span className="inline-block">{alert.headline}&nbsp;&nbsp;&nbsp;</span>
            <span className="inline-block">{alert.headline}&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-[9px] text-gray-500 hidden sm:inline">Updated: {timeStr}</span>
          {expanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Summary */}
          <p className="text-[11px] text-gray-300 leading-relaxed">{alert.summary}</p>

          {/* Last updated timestamp */}
          <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
            <Clock size={9} />
            <span>Research last updated: {timeStr}</span>
          </div>

          {/* Official Status — Tech Threat */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">{alert.officialStatus.label}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{alert.officialStatus.detail}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {alert.officialStatus.sources.map((s, i) => (
                <SourceLink key={i} name={s.name} url={s.url} />
              ))}
            </div>
          </div>

          {/* Cyber Attack */}
          {alert.cyberAttack && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">First Cyber Attack on US Company</p>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.cyberAttack.detail}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {alert.cyberAttack.sources.map((s, i) => (
                  <SourceLink key={i} name={s.name} url={s.url} />
                ))}
              </div>
            </div>
          )}

          {/* Context */}
          {alert.context && (
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Context</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">{alert.context}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BreakingAlert() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || BREAKING_ALERTS.length === 0) return null

  return (
    <div className="bg-red-950/70 border-b border-red-800/60 shrink-0">
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-2">
          <Link to="/breaking-news" className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded hover:bg-red-500 transition-colors">
            <AlertTriangle size={10} className="text-white animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Breaking News</span>
          </Link>
          <span className="text-[10px] text-red-300/70">Click to expand for full research & sources</span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-red-800 hover:text-red-400 transition-colors"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
      {BREAKING_ALERTS.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
