import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Polls /version.json to detect when the site has been redeployed.
 * When a new version is detected, sets `updateAvailable` to true.
 *
 * The initial version is captured on first load. Subsequent polls compare
 * the timestamp (`t`) field — if it changes, a new deploy happened.
 *
 * @param {number} intervalMs — polling interval in ms (default 60s)
 * @returns {{ updateAvailable: boolean, refresh: () => void, dismiss: () => void, newVersion: string|null }}
 */
export default function useVersionCheck(intervalMs = 60_000) {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [newVersion, setNewVersion] = useState(null)
  const initialTimestamp = useRef(null)
  const dismissed = useRef(false)

  const checkVersion = useCallback(async () => {
    if (dismissed.current) return

    try {
      // Cache-bust to avoid stale CDN responses
      const res = await fetch(`/version.json?_=${Date.now()}`, {
        cache: 'no-store',
      })
      if (!res.ok) return

      const data = await res.json()
      const serverTimestamp = data.t

      // Capture initial timestamp on first successful fetch
      if (initialTimestamp.current === null) {
        initialTimestamp.current = serverTimestamp
        return
      }

      // If server timestamp differs from what we loaded with, new deploy happened
      if (serverTimestamp !== initialTimestamp.current) {
        setUpdateAvailable(true)
        setNewVersion(data.v || null)
      }
    } catch {
      // Network error — silently ignore, will retry next interval
    }
  }, [])

  useEffect(() => {
    // Initial check to capture the baseline
    checkVersion()

    const id = setInterval(checkVersion, intervalMs)
    return () => clearInterval(id)
  }, [checkVersion, intervalMs])

  const refresh = useCallback(() => {
    // Hard reload to bypass all caches
    window.location.reload()
  }, [])

  const dismiss = useCallback(() => {
    dismissed.current = true
    setUpdateAvailable(false)
  }, [])

  return { updateAvailable, newVersion, refresh, dismiss }
}
