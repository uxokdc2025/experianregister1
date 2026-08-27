'use client'

/* ──────────────────────────────────────────────────────────────
   /start/apply — the registration wizard, adaptive by width.
   Reached from the /start homepage CTAs. Below the phone breakpoint
   we render the crafted mobile flow; above it, the desktop flow.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { MobileApp } from '../../v2/mobile/page'
import DesktopFlow from '../../v2/register/page'

const MOBILE_MAX = 767 // ≤ this width → mobile-crafted screens

export default function ApplyPage() {
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const apply = () => setMode(mq.matches ? 'mobile' : 'desktop')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (mode === null) return <div style={{ minHeight: '100dvh', background: '#fff' }} />
  return mode === 'mobile' ? <MobileApp /> : <DesktopFlow />
}
