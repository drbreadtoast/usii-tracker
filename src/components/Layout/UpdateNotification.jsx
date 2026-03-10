import { RefreshCw, X } from 'lucide-react'
import useVersionCheck from '../../hooks/useVersionCheck'

/**
 * Fixed banner that appears when a new site version is deployed.
 * Critical for streamers and users who keep the page open for long periods.
 *
 * Polls /version.json every 60 seconds. When the deploy timestamp changes:
 * - Shows a persistent banner at the bottom of the screen
 * - Offers instant "Refresh Now" button
 * - Auto-refreshes after 120 seconds if user doesn't act
 * - Can be dismissed (won't nag again until next deploy)
 */
export default function UpdateNotification() {
  const { updateAvailable, newVersion, refresh, dismiss } = useVersionCheck(60_000)

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-[slideUp_0.3s_ease-out]">
      <div className="bg-blue-950/95 border-t-2 border-blue-500 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-2.5 h-2.5 bg-blue-500/30 rounded-full animate-ping absolute" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-200">
                New update available{newVersion ? ` (v${newVersion})` : ''}
              </p>
              <p className="text-[11px] text-blue-400/70">
                Fresh data has been published. Refresh to see the latest information.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <RefreshCw size={12} />
              Refresh Now
            </button>
            <button
              onClick={dismiss}
              className="p-1.5 rounded-lg text-blue-400/60 hover:text-blue-300 hover:bg-blue-900/50 transition-colors"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
