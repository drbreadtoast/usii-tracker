import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { List, MessageCircle, Skull, ChevronLeft, ChevronRight, Maximize2, Minimize2, AlertOctagon, Newspaper, Landmark, Fuel, Clock, PanelRightOpen, PanelRightClose, DollarSign, AlertTriangle, ExternalLink, Target, Receipt, MessageSquareQuote, Droplet, MapPin, Layers, Filter } from 'lucide-react'
import Header from '../components/Layout/Header'
import WorldClocks from '../components/Layout/WorldClocks'
import CensorshipNotice from '../components/Layout/CensorshipNotice'
import SourcesNotice from '../components/Layout/SourcesNotice'
import FilterPanel from '../components/Layout/FilterPanel'
import TimeFilter from '../components/Layout/TimeFilter'
import DeathToll from '../components/Layout/DeathToll'
import Escalations from '../components/Layout/Escalations'
import ConflictMap from '../components/Map/ConflictMap'
import EventTimeline from '../components/Timeline/EventTimeline'
import SocialFeed from '../components/Social/SocialFeed'
import MediaPerspectives from '../components/Media/MediaPerspectives'
import GovernmentStatements from '../components/Media/GovernmentStatements'
import EnergyPanel from '../components/Energy/EnergyPanel'
import CommodityTicker from '../components/Commodities/CommodityTicker'
import UpdateBadge from '../components/Layout/UpdateBadge'
import { useEvents } from '../hooks/useEvents'
import { useFilters } from '../hooks/useFilters'

// Tab color map for inline styles (Tailwind can't purge dynamic class names)
const TAB_COLORS = {
  red: '#EF4444',
  orange: '#F97316',
  blue: '#3B82F6',
  purple: '#A855F7',
  cyan: '#06B6D4',
  amber: '#F59E0B',
}

export default function Dashboard() {
  const { events, socialPosts, breakingNews, deathToll, stats, metadata, refresh } = useEvents()
  const filters = useFilters()

  const [activePanel, setActivePanel] = useState('escalations')
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mobileView, setMobileView] = useState('map') // 'map' or 'panel' — mobile toggle
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    return filters.filterEvents(events)
  }, [events, filters.filterEvents])


  const handleEventSelect = (event) => {
    // Fly to event on map and open popup
    setSelectedEvent(null) // Reset first to re-trigger if same event
    setTimeout(() => setSelectedEvent(event), 50)
    setIsMapFullscreen(false)
  }

  const handleStatClick = (status) => {
    // Open the events panel
    setActivePanel('timeline')
    setIsPanelOpen(true)
    setIsMapFullscreen(false)

    if (status === 'all') {
      // Reset to show all statuses
      filters.setActiveStatuses(new Set(['confirmed', 'likely', 'rumored']))
    } else {
      // Show only the clicked status
      filters.setActiveStatuses(new Set([status]))
    }
  }

  const TABS = [
    { id: 'escalations', label: 'Escal.', icon: AlertOctagon, color: 'orange', route: '/escalations' },
    { id: 'timeline', label: 'Events', icon: List, color: 'red', route: '/events' },
    { id: 'social', label: 'Social', icon: MessageCircle, color: 'blue', route: '/social' },
    { id: 'media', label: 'Media', icon: Newspaper, color: 'purple', route: '/media' },
    { id: 'government', label: 'Gov.', icon: Landmark, color: 'cyan', route: '/government' },
    { id: 'energy', label: 'Energy', icon: Fuel, color: 'amber', route: '/energy' },
    { id: 'deaths', label: 'Deaths', icon: Skull, color: 'red', route: '/deaths' },
  ]

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      <Header metadata={metadata} />
      <WorldClocks />
      <CensorshipNotice />
      <SourcesNotice />

      {/* Mobile toggle bar — visible only on small screens */}
      <div className="flex sm:hidden items-center border-b border-gray-800 bg-gray-900 shrink-0">
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
            mobileView === 'map'
              ? 'text-blue-400 bg-gray-800/60 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <MapPin size={14} />
          Map
        </button>
        <button
          onClick={() => setMobileView('panel')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
            mobileView === 'panel'
              ? 'text-amber-400 bg-gray-800/60 border-b-2 border-amber-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Layers size={14} />
          Info Panels
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Area — hidden on mobile when panel view is active */}
        <div className={`flex-1 relative transition-all duration-300 ${isMapFullscreen ? 'w-full' : ''} ${mobileView === 'panel' ? 'hidden sm:block' : ''}`}>
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
            {!isPanelOpen && !isMapFullscreen && (
              <button
                onClick={() => setIsPanelOpen(true)}
                className="bg-gray-900/90 border border-gray-700 rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <button
              onClick={() => {
                setIsMapFullscreen(!isMapFullscreen)
                if (!isMapFullscreen) setIsPanelOpen(false)
                else setIsPanelOpen(true)
              }}
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

        {/* Side Panel — on mobile: shown when mobileView==='panel', on desktop: shown when isPanelOpen */}
        {((mobileView === 'panel') || (isPanelOpen && !isMapFullscreen)) && (
          <div className={`${panelExpanded ? 'w-full sm:w-[650px]' : 'w-full sm:w-[400px]'} ${mobileView === 'panel' ? 'flex' : 'hidden'} sm:flex relative sm:relative sm:inset-auto sm:z-auto transition-all duration-300 border-l border-gray-800 flex-col bg-gray-950 shrink-0`}>
            {/* Tab bar — compact pill-style tabs, all visible */}
            <div className="flex items-center border-b border-gray-800 bg-gray-900 shrink-0">
              {TABS.map(tab => {
                const isActive = activePanel === tab.id
                const color = TAB_COLORS[tab.color]
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold transition-all ${
                      isActive
                        ? 'text-white bg-gray-800/60'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                    style={isActive ? { borderBottom: `2px solid ${color}`, color } : {}}
                  >
                    <tab.icon size={11} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
              <button
                onClick={() => setPanelExpanded(!panelExpanded)}
                className="px-1.5 py-2 text-gray-600 hover:text-gray-300 transition-colors shrink-0 border-l border-gray-800"
                title={panelExpanded ? 'Collapse panel' : 'Expand panel'}
              >
                {panelExpanded ? <PanelRightClose size={12} /> : <PanelRightOpen size={12} />}
              </button>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="px-1.5 py-2 text-gray-600 hover:text-gray-300 transition-colors shrink-0 border-l border-gray-800"
              >
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Page links */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 border-b border-gray-800 shrink-0 flex-wrap">
              <Link to="/breaking-news" className="flex items-center gap-1 text-[9px] text-red-400 hover:text-red-300 transition-colors font-medium">
                <AlertTriangle size={9} />News
              </Link>
              <Link to="/timeline" className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 transition-colors font-medium">
                <Clock size={9} />Timeline
              </Link>
              <Link to="/follow-the-money" className="flex items-center gap-1 text-[9px] text-green-400 hover:text-green-300 transition-colors font-medium">
                <DollarSign size={9} />Money
              </Link>
              <Link to="/follow-the-oil" className="flex items-center gap-1 text-[9px] text-amber-400 hover:text-amber-300 transition-colors font-medium">
                <Droplet size={9} />Oil & Gas
              </Link>
              <Link to="/follow-the-munitions" className="flex items-center gap-1 text-[9px] text-orange-400 hover:text-orange-300 transition-colors font-medium">
                <Target size={9} />Munitions
              </Link>
              <Link to="/follow-the-cost" className="flex items-center gap-1 text-[9px] text-pink-400 hover:text-pink-300 transition-colors font-medium">
                <Receipt size={9} />Cost
              </Link>
              <Link to="/follow-the-statements" className="flex items-center gap-1 text-[9px] text-purple-400 hover:text-purple-300 transition-colors font-medium">
                <MessageSquareQuote size={9} />Statements
              </Link>
            </div>

            {/* See More link for active tab */}
            <div className="flex items-center justify-end px-3 py-1 bg-gray-900/30 border-b border-gray-800 shrink-0">
              <Link
                to={TABS.find(t => t.id === activePanel)?.route || '/'}
                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <ExternalLink size={9} />
                See Full {TABS.find(t => t.id === activePanel)?.label} Page →
              </Link>
            </div>

            {/* Time filter (for events tab) */}
            {activePanel === 'timeline' && (
              <TimeFilter timeFilter={filters.timeFilter} setTimeFilter={filters.setTimeFilter} />
            )}

            {/* Panel content */}
            <div className="flex-1 overflow-hidden">
              {activePanel === 'timeline' && (
                <EventTimeline events={filteredEvents} onEventSelect={handleEventSelect} />
              )}
              {activePanel === 'escalations' && (
                <Escalations />
              )}
              {activePanel === 'social' && (
                <SocialFeed socialPosts={socialPosts} />
              )}
              {activePanel === 'media' && (
                <MediaPerspectives />
              )}
              {activePanel === 'government' && (
                <GovernmentStatements />
              )}
              {activePanel === 'energy' && (
                <EnergyPanel />
              )}
              {activePanel === 'deaths' && (
                <DeathToll deathToll={deathToll} />
              )}
            </div>
          </div>
        )}
      </div>

      <UpdateBadge />
      <CommodityTicker />
    </div>
  )
}
