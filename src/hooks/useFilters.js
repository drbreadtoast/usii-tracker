import { useState, useCallback } from 'react'
import { EVENT_TYPES, VERIFICATION_STATUSES, COUNTRIES } from '../utils/colors'

export function useFilters() {
  const [activeTypes, setActiveTypes] = useState(new Set(EVENT_TYPES))
  const [activeStatuses, setActiveStatuses] = useState(new Set(VERIFICATION_STATUSES))
  const [activeCountries, setActiveCountries] = useState(new Set(COUNTRIES))
  const [showOnlyMajor, setShowOnlyMajor] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('all') // default: show all events
  const [showBases, setShowBases] = useState(true)
  const [showMissileStrikes, setShowMissileStrikes] = useState(true)

  const toggleType = useCallback((type) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }, [])

  const toggleStatus = useCallback((status) => {
    setActiveStatuses(prev => {
      const next = new Set(prev)
      next.has(status) ? next.delete(status) : next.add(status)
      return next
    })
  }, [])

  const toggleCountry = useCallback((country) => {
    setActiveCountries(prev => {
      const next = new Set(prev)
      next.has(country) ? next.delete(country) : next.add(country)
      return next
    })
  }, [])

  const toggleAllTypes = useCallback((enable) => {
    setActiveTypes(enable ? new Set(EVENT_TYPES) : new Set())
  }, [])

  const toggleAllStatuses = useCallback((enable) => {
    setActiveStatuses(enable ? new Set(VERIFICATION_STATUSES) : new Set())
  }, [])

  const toggleAllCountries = useCallback((enable) => {
    setActiveCountries(enable ? new Set(COUNTRIES) : new Set())
  }, [])

  const filterEvents = useCallback((events) => {
    const now = new Date()
    return events.filter(event => {
      if (!activeTypes.has(event.type)) return false
      if (!activeStatuses.has(event.verificationStatus)) return false
      if (event.attributedTo && !activeCountries.has(event.attributedTo)) return false
      if (showOnlyMajor && !event.isMajor) return false

      // Time filter
      if (timeFilter !== 'all') {
        const eventDate = new Date(event.timestamp)
        const daysMap = { today: 1, week: 7, month: 30, year: 365 }
        const days = daysMap[timeFilter]
        if (days) {
          const cutoff = new Date(now.getTime() - days * 86400000)
          if (eventDate < cutoff) return false
        }
      }

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          (event.tags && event.tags.some(tag => tag.includes(q)))
        )
      }

      return true
    })
  }, [activeTypes, activeStatuses, activeCountries, showOnlyMajor, searchQuery, timeFilter])

  return {
    activeTypes, activeStatuses, activeCountries,
    showOnlyMajor, searchQuery, timeFilter,
    showBases, showMissileStrikes,
    toggleType, toggleStatus, toggleCountry,
    toggleAllTypes, toggleAllStatuses, toggleAllCountries,
    setShowOnlyMajor, setSearchQuery, setTimeFilter,
    setShowBases, setShowMissileStrikes,
    setActiveStatuses,
    filterEvents,
  }
}
