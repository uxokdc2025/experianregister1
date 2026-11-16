'use client'

/* ──────────────────────────────────────────────────────────────
   /v3 — the Study 2 homepage, and where every tester starts.
   Adaptive at the same 767px breakpoint as /start: the phone
   gets the crafted mobile landing, anything wider gets the
   desktop landing. Both send "Sign in" (and every other CTA)
   to /v3/sign-in, where the passkey journey begins.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { V3DesktopLanding } from './home/desktop'
import { V3MobileLanding } from './home/mobile'

const MOBILE_MAX = 767 // ≤ this width → mobile-crafted screens

/* initialMode comes from the server (user agent), so a phone gets
   the mobile landing in the very first HTML — no blank or desktop
   first paint. After mount the real viewport width decides, and it
   keeps following resizes / rotation. */
export function HomeSwitch({ initialMode = 'desktop' }) {
  const [mode, setMode] = useState(initialMode)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const apply = () => setMode(mq.matches ? 'mobile' : 'desktop')
    apply()
    // addEventListener on MediaQueryList is iOS 14+; older Safari only has addListener.
    if (mq.addEventListener) mq.addEventListener('change', apply)
    else mq.addListener(apply)
    window.addEventListener('resize', apply)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply)
      else mq.removeListener(apply)
      window.removeEventListener('resize', apply)
    }
  }, [])

  return mode === 'mobile' ? <V3MobileLanding /> : <V3DesktopLanding />
}
