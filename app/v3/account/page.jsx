'use client'

/* ──────────────────────────────────────────────────────────────
   /v3/account — placeholder. The real D9/M9 account page (with
   the Passkeys section, rename and remove) is card 3; the sign-in
   and "Go to my account" paths land here so the flow is complete
   end to end in the meantime.
   ────────────────────────────────────────────────────────────── */

import { PageShell } from '../_components/Chrome'
import { HOME_HREF, SIGN_IN_HREF, go } from '../lib/routes'
import { PERSONA } from '../lib/state'

export default function AccountPlaceholderPage() {
  return (
    <PageShell>
      <div className="v3-ctr">
        <h1 className="v3-h1" id="passkeys">
          Account (coming in card 3)
        </h1>
        <p className="v3-body" style={{ marginTop: 14 }}>
          You’re signed in as {PERSONA.name}. The account page — including the Passkeys section, rename and remove — is
          built in card 3 of this study.
        </p>

        <button type="button" className="v3-btn v3-btn-primary" style={{ marginTop: 26 }} onClick={() => go(HOME_HREF)}>
          Back to the homepage
        </button>

        <div style={{ marginTop: 12 }}>
          <button type="button" className="v3-linkbtn" onClick={() => go(SIGN_IN_HREF)}>
            Back to sign in
          </button>
        </div>
      </div>
    </PageShell>
  )
}
