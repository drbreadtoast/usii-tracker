import { useState, useMemo } from 'react'
import { ChevronDown, Maximize2, Minimize2, MapPin, Filter } from 'lucide-react'
import FilterPanel from '../components/Layout/FilterPanel'
import ConflictMap from '../components/Map/ConflictMap'
import VideoSection from '../components/Media/VideoSection'
import HomepageSummary from '../components/Layout/HomepageSummary'
import { useEvents } from '../hooks/useEvents'
import { useFilters } from '../hooks/useFilters'

export default function Dashboard() {
  const { events, socialPosts, breakingNews, deathToll, stats, metadata, refresh } = useEvents()
  const filters = useFilters()

  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(true)

  const filteredEvents = useMemo(() => {
    return filters.filterEvents(events)
  }, [events, filters.filterEvents])


  const handleEventSelect = (event) => {
    setSelectedEvent(null)
    setTimeout(() => setSelectedEvent(event), 50)
    setIsMapFullscreen(false)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 text-gray-100 overflow-y-auto">
      {/* Quick Brief — first thing visitors see (includes notices) */}
      <HomepageSummary />

      {/* Scroll hint — tells users there's a live map below */}
      <div className="bg-gradient-to-b from-gray-950 to-gray-900 border-t border-gray-800 py-3 flex flex-col items-center gap-1 shrink-0 cursor-pointer hover:bg-gray-900/80 transition-colors"
        onClick={() => {
          const el = document.getElementById('live-map')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Scroll for Live Map & Data Panels</span>
        <ChevronDown size={16} className="text-gray-600 animate-bounce" />
      </div>

      <div id="live-map" className="shrink-0 overflow-hidden relative" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        {/* Map Area */}
        <div className="w-full h-full relative">
          <ConflictMap
            events={filteredEvents}
            onEventSelect={handleEventSelect}
            showBases={filters.showBases}
            showMissileStrikes={filters.showMissileStrikes}
            selectedEvent={selectedEvent}
          />

          {/* Map control buttons */}
          <div className="absolute top-3 right-3 z-[1000] flex gap-1.5">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`bg-gray-900/90 border rounded-md p-2 hover:text-white hover:bg-gray-800 transition-colors ${
                isFilterOpen ? 'border-blue-500 text-blue-400' : 'border-gray-700 text-gray-400'
              }`}
              title="Map filters"
            >
              <Filter size={16} />
            </button>
            <button
              onClick={() => setIsMapFullscreen(!isMapFullscreen)}
              className="bg-gray-900/90 border border-gray-700 rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title={isMapFullscreen ? 'Exit fullscreen' : 'Fullscreen map'}
            >
              {isMapFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Filter panel overlay on map */}
          {isFilterOpen && (
            <div className="absolute top-14 right-3 z-[1000] w-[300px] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl max-h-[70vh] overflow-y-auto">
              <FilterPanel
                initialExpanded={true}
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
            </div>
          )}
        </div>

      </div>

      {/* Floating video popup — sits above everything */}
      {showVideo && <VideoSection onClose={() => setShowVideo(false)} />}
    </div>
  )
}
