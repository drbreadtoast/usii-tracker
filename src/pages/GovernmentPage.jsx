import TabPageLayout from '../components/Layout/TabPageLayout'
import GovernmentStatements from '../components/Media/GovernmentStatements'

export default function GovernmentPage() {
  return (
    <TabPageLayout
      title="Government Statements"
      subtitle="Official statements from US, Iranian, and Israeli government officials. All statements include verification status."
      footerNote="Government statements sourced from official channels."
    >
      <div style={{ minHeight: '60vh' }}>
        <GovernmentStatements />
      </div>
    </TabPageLayout>
  )
}
