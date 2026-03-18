import { AlertTriangle } from 'lucide-react'
import TabPageLayout from '../components/Layout/TabPageLayout'
import DeathToll from '../components/Layout/DeathToll'
import { useEvents } from '../hooks/useEvents'

export default function DeathsPage() {
  const { deathToll } = useEvents()

  return (
    <TabPageLayout
      title="Death Toll & Casualties"
      subtitle="Confirmed and estimated casualties by conflict and party. Data sourced from government reports, UN agencies, and independent monitors."
      footerNote="Casualty figures include confirmed and estimated. Sources provided per entry."
    >
      <div className="mx-4 mb-4 bg-red-950/40 border border-red-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-1">Casualty numbers are likely much higher than reported</p>
            <p className="text-xs text-red-200/80 leading-relaxed">
              All parties in this conflict — including governments and media on every side — have reasons to suppress, delay, or manipulate casualty figures. Iran's internet has been throttled to ~4% capacity since the war began, making independent verification nearly impossible. Israel enforces military censorship on casualty reporting. The numbers below represent the best available data from official sources, independent monitors (HRANA, Hengaw, HRW), and OSINT analysts — but the true human cost is almost certainly higher.
            </p>
          </div>
        </div>
      </div>
      <div style={{ minHeight: '60vh' }}>
        <DeathToll deathToll={deathToll} />
      </div>
    </TabPageLayout>
  )
}
