'use client'

import { PageShell } from './Chrome'
import { ShieldCheck, PhoneSignal } from './Art'
import { SimPrompt } from './SimPrompt'

/* ──────────────────────────────────────────────────────────────
   D6 / M6 — "Setting up your passkey…". Rendered in place while
   passkey creation is pending, with no CTA: the browser/OS sheet
   appears on top of this (or the in-page Demo prompt). The spinner is suppressed
   under prefers-reduced-motion.
   ────────────────────────────────────────────────────────────── */

export function SettingUp() {
  return (
    <PageShell>
      <div className="v3-ctr">
        <div className="v3-art v3-desk">
          <ShieldCheck />
        </div>
        <div className="v3-art v3-mob">
          <PhoneSignal />
        </div>

        <h1 className="v3-h1" style={{ marginTop: 22 }}>
          Setting up your passkey…
        </h1>
        <p className="v3-body" style={{ marginTop: 12 }} aria-live="polite">
          Follow the steps from your browser or device. This only takes a moment.
        </p>

        <div className="v3-art" style={{ marginTop: 28 }}>
          <span className="v3-spin" aria-hidden="true" />
        </div>
      </div>
      {/* the real browser/OS sheet appears on top of this; the Demo prompt only on unsupported devices */}
      <SimPrompt />
    </PageShell>
  )
}
