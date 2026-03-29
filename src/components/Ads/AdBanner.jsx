import { useEffect, useRef } from 'react'

const AD_CONFIG = {
  enabled: true,
  showOnMobile: true,
  mobileBreakpoint: 768,
}

export default function AdBanner({ className = '', format = 'auto', layout = 'in-article' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!AD_CONFIG.enabled) return
    if (!AD_CONFIG.showOnMobile && window.innerWidth < AD_CONFIG.mobileBreakpoint) return

    try {
      if (!pushed.current && adRef.current) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        pushed.current = true
      }
    } catch (e) {
      // Ad blocker or AdSense not loaded — fail silently
    }
  }, [])

  if (!AD_CONFIG.enabled) return null

  return (
    <div className={`ad-container ${className}`}>
      <p className="text-[10px] text-gray-600 text-center mb-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6904645068332527"
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  )
}
