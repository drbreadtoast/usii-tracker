import TabPageLayout from '../components/Layout/TabPageLayout'
import Escalations from '../components/Layout/Escalations'

export default function EscalationsPage() {
  return (
    <TabPageLayout
      title="Escalations"
      subtitle="Major escalation events and tipping points in the conflict, ordered by severity."
      footerNote="Escalation severity assessed from multiple sources."
    >
      <div style={{ minHeight: '60vh' }}>
        <Escalations />
      </div>
    </TabPageLayout>
  )
}
