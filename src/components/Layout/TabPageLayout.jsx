import { Shield } from 'lucide-react'
import UpdateBadge from './UpdateBadge'

export default function TabPageLayout({
  title,
  subtitle,
  headerExtra,
  footerNote,
  children
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-300">{title}</h1>
          {headerExtra && <div className="flex items-center gap-3 text-xs text-gray-500">{headerExtra}</div>}
        </div>
      </header>

      {/* Subtitle banner */}
      {subtitle && (
        <div className="bg-gray-900/50 border-b border-gray-800 px-4 sm:px-6 py-2">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
        <UpdateBadge />
        <div className="px-4 sm:px-6 py-3 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-[10px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-400">TheOSSreport.com</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>{footerNote || 'All data is fact-checked where possible.'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
