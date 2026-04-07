import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import Footer from '../components/Layout/Footer'

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: [
      'TheOSSreport.com does not require user accounts, logins, or registration. We do not collect personal information such as names, email addresses, or passwords through normal site usage.',
      'If you contact us through the on-site contact form (powered by Web3Forms), your email address and message content are transmitted to us via Web3Forms\u2019 service. We use this information solely to respond to your inquiry.',
    ],
  },
  {
    title: 'Cookies and Tracking Technologies',
    content: [
      'We use the following third-party services that may set cookies or collect anonymous usage data:',
    ],
    list: [
      'Google AdSense \u2014 Serves advertisements and may use cookies to personalize ads based on your browsing activity. You can learn more about Google\u2019s data practices at policies.google.com/privacy.',
      'Vercel Analytics \u2014 Collects anonymous, aggregated page view data to help us understand site traffic. No personally identifiable information is collected.',
      'Vercel Speed Insights \u2014 Measures anonymous page performance metrics to help us optimize load times.',
    ],
    extra: 'You can control and delete cookies through your browser settings. Disabling cookies may affect the display of advertisements but will not impact your ability to use this site.',
  },
  {
    title: 'How We Use Information',
    content: [
      'Any data collected through the services listed above is used exclusively to: operate and improve this website, understand aggregate traffic patterns, serve relevant advertisements, and respond to user inquiries submitted through the contact form.',
      'We do not sell, share, or transfer any user data to third parties beyond the services described in this policy.',
    ],
  },
  {
    title: 'Third-Party Services',
    content: [
      'This site integrates the following third-party services, each governed by their own privacy policies:',
    ],
    list: [
      'Google AdSense (ads) \u2014 policies.google.com/privacy',
      'Vercel (hosting and analytics) \u2014 vercel.com/legal/privacy-policy',
      'Web3Forms (contact form) \u2014 web3forms.com/privacy',
    ],
  },
  {
    title: 'Data Retention',
    content: [
      'We do not store personal data on our servers. All site content is static and served without server-side processing. Contact form submissions are retained only as long as necessary to respond to inquiries.',
    ],
  },
  {
    title: 'Children\u2019s Privacy',
    content: [
      'This site contains content about armed conflict that may not be suitable for children. We do not knowingly collect information from children under the age of 13. If you believe a child has submitted information through our contact form, please contact us so we can delete it.',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'Depending on your jurisdiction, you may have the following rights regarding your personal data:',
    ],
    list: [
      'Right to access \u2014 Request information about what data, if any, we hold about you.',
      'Right to deletion \u2014 Request deletion of any personal data (e.g., contact form submissions).',
      'Right to opt out \u2014 Disable cookies through your browser settings or use Google\u2019s Ad Settings to control ad personalization.',
    ],
    extra: 'For California residents (CCPA): We do not sell personal information. For EU/EEA residents (GDPR): Our lawful basis for processing is legitimate interest in operating and improving this website.',
  },
  {
    title: 'Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated effective date. Continued use of the site after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: 'Contact',
    content: [
      'If you have questions about this Privacy Policy, use the contact button available on every page of this site to reach us.',
    ],
  },
]

export default function PrivacyPolicyPage() {
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
              <Shield size={16} className="text-blue-400" />
              <h1 className="text-sm font-bold text-gray-200">Privacy Policy</h1>
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
            TheOSSreport.com (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the United States &middot; Israel &middot; Iran Conflict Tracker.
            This Privacy Policy explains what information we collect, how we use it, and your choices regarding that information.
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
            {section.extra && (
              <p className="text-xs text-gray-500 leading-relaxed mt-2">{section.extra}</p>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
