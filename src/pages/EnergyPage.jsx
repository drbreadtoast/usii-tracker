import TabPageLayout from '../components/Layout/TabPageLayout'
import EnergyPanel from '../components/Energy/EnergyPanel'

export default function EnergyPage() {
  return (
    <TabPageLayout
      title="Energy, Food & Shipping"
      subtitle="How the war affects energy supply, food prices, Strait of Hormuz shipping, and US gas prices."
      footerNote="Energy data sourced from EIA, shipping data from maritime tracking services."
    >
      <div style={{ minHeight: '60vh' }}>
        <EnergyPanel />
      </div>
    </TabPageLayout>
  )
}
