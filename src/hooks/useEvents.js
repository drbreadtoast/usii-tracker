import { useState, useMemo, useCallback } from 'react'
import eventsData from '../data/events.json'
import socialData from '../data/social-posts.json'
import breakingData from '../data/breaking.json'
import deathTollData from '../data/death-toll.json'
import metadataJson from '../data/metadata.json'

export function useEvents() {
  const [events] = useState(eventsData)
  const [socialPosts, setSocialPosts] = useState(socialData)
  const [breakingNews] = useState(breakingData)
  const [deathToll] = useState(deathTollData)
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date().toISOString())

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [events])

  const majorEvents = useMemo(() => {
    return sortedEvents.filter(e => e.isMajor)
  }, [sortedEvents])

  const stats = useMemo(() => {
    const confirmed = events.filter(e => e.verificationStatus === 'confirmed').length
    const likely = events.filter(e => e.verificationStatus === 'likely').length
    const rumored = events.filter(e => e.verificationStatus === 'rumored').length
    const total = events.length
    const major = events.filter(e => e.isMajor).length

    const byType = {}
    events.forEach(e => { byType[e.type] = (byType[e.type] || 0) + 1 })

    // Count by country
    const byCountry = {}
    events.forEach(e => {
      if (e.attributedTo) {
        byCountry[e.attributedTo] = (byCountry[e.attributedTo] || 0) + 1
      }
    })

    return { total, confirmed, likely, rumored, major, byType, byCountry }
  }, [events])

  const sortedSocialPosts = useMemo(() => {
    const sorted = [...socialPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    if (sorted.length === 0) return sorted

    // Compress all posts into the last ~55 minutes
    // Newest post = 2 minutes ago, oldest = 55 minutes ago
    // This makes the feed feel live regardless of original timestamp gaps
    const now = Date.now()
    const newestTarget = now - 120000    // 2 minutes ago
    const oldestTarget = now - 3300000   // 55 minutes ago
    const spread = newestTarget - oldestTarget  // 53 minutes of spread

    return sorted.map((post, i) => ({
      ...post,
      timestamp: new Date(
        newestTarget - (i / Math.max(sorted.length - 1, 1)) * spread
      ).toISOString()
    }))
  }, [socialPosts, lastRefreshTime])

  const refresh = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Shuffle social posts to simulate new data
        setSocialPosts(prev => {
          const shuffled = [...prev]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          return shuffled
        })
        setLastRefreshTime(new Date().toISOString())
        resolve()
      }, 1200)
    })
  }, [])

  return {
    events: sortedEvents,
    majorEvents,
    socialPosts: sortedSocialPosts,
    breakingNews,
    deathToll,
    stats,
    metadata: { ...metadataJson, lastUpdated: lastRefreshTime },
    refresh,
  }
}
