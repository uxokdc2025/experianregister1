import { headers } from 'next/headers'
import { HomeSwitch } from './HomeSwitch'

/* ──────────────────────────────────────────────────────────────
   /v3 — the Study 2 homepage. Rendered per request so the first
   HTML already matches the device: phone/tablet-phone user agents
   (iPhone, Android "Mobile", or Sec-CH-UA-Mobile: ?1) get the
   mobile landing, everything else the desktop one. HomeSwitch then
   re-checks the real width (767px breakpoint) on the client.
   ────────────────────────────────────────────────────────────── */

const MOBILE_UA = /iPhone|iPod|Android.*Mobile|Windows Phone|Mobi/i

export default async function V3HomePage() {
  const h = await headers()
  const isPhone = h.get('sec-ch-ua-mobile') === '?1' || MOBILE_UA.test(h.get('user-agent') || '')
  return <HomeSwitch initialMode={isPhone ? 'mobile' : 'desktop'} />
}
