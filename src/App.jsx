import { Routes, Route } from 'react-router-dom'
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
  return (
    <>
    <BreakingBanner />
    <BreakingAlert />
    <NavBar />
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
    </>
  )
}
