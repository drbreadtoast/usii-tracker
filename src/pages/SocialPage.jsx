import TabPageLayout from '../components/Layout/TabPageLayout'
import SocialFeed from '../components/Social/SocialFeed'
import { useEvents } from '../hooks/useEvents'

export default function SocialPage() {
  const { socialPosts } = useEvents()

  return (
    <TabPageLayout
      title="Social Media Intel"
      subtitle="Curated posts from OSINT analysts and lead sources on X/Twitter. Verification status shown for each post."
      footerNote="Social media posts are under continuous verification."
    >
      <div style={{ minHeight: '60vh' }}>
        <SocialFeed socialPosts={socialPosts} />
      </div>
    </TabPageLayout>
  )
}
