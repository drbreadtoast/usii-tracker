import TabPageLayout from '../components/Layout/TabPageLayout'
import SocialFeed from '../components/Social/SocialFeed'
import { useEvents } from '../hooks/useEvents'

export default function SocialPage() {
  const { socialPosts } = useEvents()

  return (
    <TabPageLayout
      title="Social Media Intel"
      subtitle="Summaries of key analyst reports and OSINT intelligence. Rolling 24-hour window — updated with each data refresh."
      footerNote="Analyst reports are under continuous verification."
    >
      <div style={{ minHeight: '60vh' }}>
        <SocialFeed socialPosts={socialPosts} />
      </div>
    </TabPageLayout>
  )
}
