import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Footer from '../components/Layout/Footer'

const SECTIONS = [
  {
    title: 'About This Project',
    content: [
      'TheOSSreport.com is an independent, non-partisan conflict tracking project. It is not affiliated with, endorsed by, or connected to any government, military organization, intelligence agency, or news outlet.',
      'The site is operated by a solo developer as a public interest resource. All content is produced independently with the goal of documenting events for public awareness and historical record.',
    ],
  },
  {
    title: 'Content Accuracy and Limitations',
    content: [
      'Information on this site is compiled from publicly available sources including news agencies (Reuters, AP, AFP), open-source intelligence (OSINT), government press releases, and verified social media reports.',
      'Research is assisted by AI tools with human editorial oversight. While we strive for accuracy, we cannot guarantee that all information is complete, current, or error-free. Conflict situations are inherently chaotic, and information is frequently revised as events unfold.',
      'All data entries carry a verification status: Confirmed (corroborated by multiple independent sources), Likely (reported by credible sources but not fully corroborated), or Rumored (based on limited or unverified reports). Users should evaluate information according to these tiers.',
    ],
  },
  {
    title: 'Editorial Standards',
    content: [
      'This site adheres to the following editorial principles:',
    ],
    list: [
      'Neutrality \u2014 We do not advocate for any party to the conflict. All sides are documented with equal rigor.',
      'No graphic content \u2014 We do not publish graphic imagery, videos of violence, or gratuitous descriptions of harm.',
      'No promotion of violence \u2014 Content is presented for informational and historical purposes, not to glorify, encourage, or exploit conflict.',
      'Transparent sourcing \u2014 Every claim is accompanied by source links so readers can verify information independently.',
      'Fact-checking \u2014 A dedicated Fact Check page actively debunks misinformation and verifies trending claims.',
    ],
  },
  {
    title: 'Use of This Site',
    content: [
      'By accessing and using this site, you agree to the following:',
    ],
    list: [
      'You will not scrape, mirror, or bulk-download content from this site without written permission.',
      'You will not misrepresent data from this site as official government, military, or intelligence information.',
      'You will not use this site\u2019s data to incite violence, harassment, or discrimination.',
      'You may link to and share content from this site with proper attribution to TheOSSreport.com.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'The original compilation, analysis, editorial commentary, and visual design of this site are the intellectual property of TheOSSreport.com. Underlying factual data is drawn from public sources and is attributed accordingly.',
      'Third-party content (quotes, statistics, source material) remains the property of its respective owners and is used under fair use principles for news reporting and public interest documentation.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'This site is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. TheOSSreport.com is not liable for any damages arising from the use of or reliance on information presented on this site.',
      'We do not guarantee uninterrupted access, real-time accuracy, or completeness of any data. Users should cross-reference critical information with primary sources before making decisions based on content from this site.',
    ],
  },
  {
    title: 'Advertisements',
    content: [
      'This site may display advertisements served by Google AdSense and other advertising partners. The presence of advertisements does not constitute endorsement of the products or services advertised. Ad revenue helps fund the continued operation and maintenance of this free public resource.',
    ],
  },
  {
    title: 'Changes to These Terms',
    content: [
      'We reserve the right to update these Terms of Service at any time. Changes take effect immediately upon posting. Continued use of the site after changes constitutes acceptance of the updated terms.',
    ],
  },
  {
    title: 'Contact',
    content: [
      'If you have questions about these Terms of Service, use the contact button available on every page of this site to reach us.',
    ],
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={12} />
              Home
            </Link>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              <h1 className="text-sm font-bold text-gray-200">Terms of Service</h1>
            </div>
          </div>
          <span className="text-[10px] text-red-400 font-bold">TheOSSreport.com</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-gray-300 font-semibold">Effective Date: April 4, 2026</span>
            <br /><br />
            These Terms of Service govern your use of TheOSSreport.com, the United States &middot; Israel &middot; Iran Conflict Tracker.
            By accessing this site, you agree to these terms.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">{section.title}</h2>
            {section.content.map((para, i) => (
              <p key={i} className="text-xs text-gray-400 leading-relaxed mb-2">{para}</p>
            ))}
            {section.list && (
              <ul className="space-y-1.5 my-2 ml-1">
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1 h-1 rounded-full bg-blue-500/60 shrink-0 mt-1.5" />
                    <span className="text-xs text-gray-400 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
