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
      <div style={{ minHeight: '60vh' }}>
        <DeathToll deathToll={deathToll} />
      </div>
    </TabPageLayout>
  )
}
