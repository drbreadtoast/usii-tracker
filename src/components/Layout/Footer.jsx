import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left — Branding */}
          <div>
            <span className="text-[11px] font-bold text-red-400">TheOSSreport.com</span>
            <p className="text-[9px] text-gray-600 mt-0.5">
              Independent conflict tracker. Not affiliated with any government, military, or news organization.
            </p>
          </div>

          {/* Right — Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/about" className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">About</Link>
            <Link to="/privacy" className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/fact-check" className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">Fact Check</Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
          <div className="flex items-center gap-1 text-[9px] text-gray-600">
            <Shield size={9} />
            <span>All data is fact-checked where possible. Verify with primary sources.</span>
          </div>
          <span className="text-[9px] text-gray-700">&copy; {new Date().getFullYear()} TheOSSreport.com</span>
        </div>
      </div>
    </footer>
  )
}
