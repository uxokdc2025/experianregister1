'use client'

import { clearState } from '../lib/state'
import { HOME_HREF } from '../lib/routes'

/* ──────────────────────────────────────────────────────────────
   Slim study bar under the global "Demo prototype" banner.
   ↺ Restart wipes the exp_v3 key and drops the tester back on
   the V3 homepage. It cannot remove a passkey from the device's
   password manager — that is expected, and card 3's /v3/done
   screen explains how to delete it.
   ────────────────────────────────────────────────────────────── */

export function DemoBar() {
  return (
    <div className="v3-demobar" role="note">
      <span style={{ font: '600 11px/1.3 system-ui, sans-serif', opacity: 0.7 }}>Study 2 · passkey prototype (V3)</span>
      <button
        type="button"
        onClick={() => {
          clearState()
          window.location.assign(HOME_HREF)
        }}
      >
        ↺ Restart
      </button>
    </div>
  )
}
