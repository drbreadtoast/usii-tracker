import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import BreakingAlert from './components/Layout/BreakingAlert'
import BreakingBanner from './components/Layout/BreakingBanner'
import NavBar from './components/Layout/NavBar'
import Dashboard from './pages/Dashboard'
import TimelinePage from './pages/TimelinePage'
import FollowTheMoneyPage from './pages/FollowTheMoneyPage'
import BreakingNewsPage from './pages/BreakingNewsPage'
import EventsPage from './pages/EventsPage'
import EscalationsPage from './pages/EscalationsPage'
import SocialPage from './pages/SocialPage'
import MediaPage from './pages/MediaPage'
import GovernmentPage from './pages/GovernmentPage'
import EnergyPage from './pages/EnergyPage'
import DeathsPage from './pages/DeathsPage'
import FollowTheOilPage from './pages/FollowTheOilPage'
import FollowTheMunitionsPage from './pages/FollowTheMunitionsPage'
import FollowTheCostPage from './pages/FollowTheCostPage'
import FollowTheStatementsPage from './pages/FollowTheStatementsPage'
import FollowTheDamagePage from './pages/FollowTheDamagePage'

export default function App() {
  const location = useLocation()
  const mainRef = useRef(null)

  // Scroll content area to top on every route change
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-950 text-gray-100">
      <BreakingBanner />
      <BreakingAlert />
      <NavBar />
      <div ref={mainRef} className="flex-1 min-h-0 overflow-auto flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/follow-the-money" element={<FollowTheMoneyPage />} />
          <Route path="/breaking-news" element={<BreakingNewsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/escalations" element={<EscalationsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/government" element={<GovernmentPage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/deaths" element={<DeathsPage />} />
          <Route path="/follow-the-oil" element={<FollowTheOilPage />} />
          <Route path="/follow-the-munitions" element={<FollowTheMunitionsPage />} />
          <Route path="/follow-the-cost" element={<FollowTheCostPage />} />
          <Route path="/follow-the-statements" element={<FollowTheStatementsPage />} />
          <Route path="/follow-the-damage" element={<FollowTheDamagePage />} />
        </Routes>
      </div>
    </div>
  )
}
