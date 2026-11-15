'use client'

/* ──────────────────────────────────────────────────────────────
   D1 / M1 — Sign in to your account (/v3/sign-in)

   Study 2 is phone + one-time code only: there is no password
   field here, and no "Forgot username / password" or "Sign in
   with Google" (David removed those; the Figma PNGs still show
   them). The affordance under test is "Create a passkey".
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { ExperianHeader, ExperianFooter } from '../_components/Chrome'
import { Field } from '../_components/Form'
import { AppQrPhone } from '../_components/Art'
import { CREATE_PASSKEY_HREF, VERIFY_HREF, go } from '../lib/routes'
import { PERSONA, formatPhone, logEvent, readState, writeState } from '../lib/state'

export default function SignInPage() {
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const saved = readState().phone
    if (saved) {
      setPhone(formatPhone(saved))
      return
    }
    /* D1 shows the number already filled in for a returning desktop
       user; M1 starts empty. Either way the tester never has to type. */
    if (window.matchMedia('(min-width: 768px)').matches) setPhone(PERSONA.phone)
  }, [])

  const onSignIn = () => {
    writeState({ phone, flow: 'signin' })
    logEvent('signin_phone_submitted')
    go(`${VERIFY_HREF}?flow=signin`)
  }

  const onCreatePasskey = () => {
    writeState({ phone, flow: 'create' })
    logEvent('create_passkey_chosen', 'sign-in')
    go(CREATE_PASSKEY_HREF)
  }

  return (
    <div className="v3-page v3-signin-page">
      <ExperianHeader />

      <main id="main-content" className="v3-main">
        <div className="v3-signin-wrap">
          <div className="v3-signin-card">
            <h1 className="v3-h1">Sign in to your account</h1>

            <div className="v3-signin-grid">
              <div>
                {/* one field, so Enter — and the phone keyboard's Go key — signs in */}
                <form onSubmit={(e) => { e.preventDefault(); onSignIn() }}>
                  <Field
                    label="Enter mobile number"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(v) => setPhone(formatPhone(v))}
                  />

                  <button type="submit" className="v3-btn v3-btn-primary" style={{ marginTop: 16 }}>
                    Sign In
                  </button>
                </form>

                <div className="v3-divider">or</div>

                <button type="button" className="v3-btn v3-btn-pink" onClick={onCreatePasskey}>
                  Create a passkey
                </button>
              </div>

              <aside className="v3-app-panel">
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E1E35', lineHeight: 1.3 }}>
                    Continue with the free Experian app
                  </h2>
                  <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#55556E' }}>
                    Securely and instantly access all of your account information in one place.
                  </p>
                  <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#55556E' }}>
                    Scan the QR code with your device and download the free Experian app now.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <AppQrPhone width={96} />
                </div>
              </aside>
            </div>
          </div>

          <div className="v3-ctr" style={{ marginTop: 26 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E1E35' }}>Don&#39;t have an account?</p>
            <a className="v3-foot-link" style={{ display: 'inline-block', marginTop: 4, fontSize: 15, fontWeight: 600 }}>
              Learn more about our services.
            </a>
          </div>
        </div>
      </main>

      <ExperianFooter />
    </div>
  )
}
