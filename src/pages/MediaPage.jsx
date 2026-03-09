import TabPageLayout from '../components/Layout/TabPageLayout'
import MediaPerspectives from '../components/Media/MediaPerspectives'

export default function MediaPage() {
  return (
    <TabPageLayout
      title="Media Perspectives"
      subtitle="Compare how different media outlets cover the conflict. Grouped by editorial lean and region."
      footerNote="Media perspectives presented for comparison, not endorsement."
    >
      <div style={{ minHeight: '60vh' }}>
        <MediaPerspectives />
      </div>
    </TabPageLayout>
  )
}
