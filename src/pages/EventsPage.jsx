import TabPageLayout from '../components/Layout/TabPageLayout'
import EventTimeline from '../components/Timeline/EventTimeline'
import FilterPanel from '../components/Layout/FilterPanel'
import TimeFilter from '../components/Layout/TimeFilter'
import { useEvents } from '../hooks/useEvents'
import { useFilters } from '../hooks/useFilters'
import { useMemo } from 'react'

export default function EventsPage() {
  const { events } = useEvents()
  const filters = useFilters()

  const filteredEvents = useMemo(() => {
    return filters.filterEvents(events)
  }, [events, filters.filterEvents])


  return (
    <TabPageLayout
      title="Events Timeline"
      subtitle="All tracked events in the Iran-Israel conflict. Filter by type, country, verification status, and time range."
      footerNote="Events verified where possible. Unverified events clearly marked."
    >
      <TimeFilter timeFilter={filters.timeFilter} setTimeFilter={filters.setTimeFilter} />
      <FilterPanel
        activeTypes={filters.activeTypes}
        activeStatuses={filters.activeStatuses}
        activeCountries={filters.activeCountries}
        showOnlyMajor={filters.showOnlyMajor}
        searchQuery={filters.searchQuery}
        showBases={filters.showBases}
        showMissileStrikes={filters.showMissileStrikes}
        toggleType={filters.toggleType}
        toggleStatus={filters.toggleStatus}
        toggleCountry={filters.toggleCountry}
        toggleAllTypes={filters.toggleAllTypes}
        toggleAllStatuses={filters.toggleAllStatuses}
        toggleAllCountries={filters.toggleAllCountries}
        setShowOnlyMajor={filters.setShowOnlyMajor}
        setSearchQuery={filters.setSearchQuery}
        setShowBases={filters.setShowBases}
        setShowMissileStrikes={filters.setShowMissileStrikes}
      />
      <div className="mt-4" style={{ minHeight: '60vh' }}>
        <EventTimeline events={filteredEvents} onEventSelect={() => {}} />
      </div>
    </TabPageLayout>
  )
}
