'use client'

/* ──────────────────────────────────────────────────────────────
   D1 / M1 — Sign in to your account (/v3/sign-in)

   Matches David's D1/M1 frames: float-label input, Sign In,
   Forgot username? / Forgot password?, "or", Create a passkey,
   Sign in with Google, the Google email note, and the app panel.
   Study 2 is still phone + one-time code only, so the Forgot links
   and Google button are visible but inert (no navigation, no
   error) — David, Nov 15 11:28 PM CT. The input is prefilled with
   the fictional persona's number (ends 4567, like the code screen).
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react'
import { ExperianHeader, ExperianFooter } from '../_components/Chrome'
import { Field } from '../_components/Form'
import { AppQrPhone } from '../_components/Art'
import { SimPrompt } from '../_components/SimPrompt'
import { ACCOUNT_HREF, CREATE_PASSKEY_HREF, VERIFY_HREF, go } from '../lib/routes'
import {
  abortConditional,
  probePasskeySupport,
  recordPasskeySignIn,
  startConditionalSignIn,
  startPasskeySignIn,
} from '../lib/passkey'
import { PERSONA, digitsOnly, formatPhone, logEvent, readState, writeState } from '../lib/state'

/* Visible, deliberately inert controls (out of scope for Study 2). */
const noop = (e) => e.preventDefault()

function GoogleG() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function SignInPage() {
  const [login, setLogin] = useState(PERSONA.phone)
  const [hasPasskey, setHasPasskey] = useState(false)
  // passkey sign-in CTA: idle → waiting (OS prompt open) → loading (spinner) → done (check)
  const [pkState, setPkState] = useState('idle')
  const timers = useRef([])

  /* Passkey accepted: spinner in the CTA (~1.2s), check (~0.8s), then the account page. */
  const succeed = (result) => {
    recordPasskeySignIn(result)
    setPkState('loading')
    timers.current.push(
      setTimeout(() => setPkState('done'), 1200),
      setTimeout(() => go(ACCOUNT_HREF), 2000),
    )
  }

  useEffect(() => {
    const s = readState()
    if (s.phone) setLogin(formatPhone(s.phone))
    setHasPasskey(Boolean(s.passkey))
    let alive = true
    /* Autofill: the browser offers a saved passkey from the input (autocomplete="username webauthn"). */
    probePasskeySupport().then(() => {
      const p = alive ? startConditionalSignIn() : null
      if (p) p.then((r) => { if (alive && r && r.ok) succeed(r) })
    })
    return () => {
      alive = false
      abortConditional()
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const onPasskeySignIn = () => {
    if (pkState !== 'idle') return
    /* First statement, no await before it — keeps the user gesture. */
    const attempt = startPasskeySignIn()
    setPkState('waiting')
    logEvent('passkey_sign_in_started')
    attempt.then((r) => {
      if (r.ok) succeed(r)
      else {
        // cancel / NotAllowed: stay here, no error — the phone path is still there
        logEvent('passkey_sign_in_cancelled', r.reason)
        setPkState('idle')
      }
    })
  }

  /* Only a 10-digit entry is kept as the phone the later screens mask;
     anything else (username / email) falls back to the persona's 4567. */
  const remember = (flow) => writeState({ phone: digitsOnly(login).length === 10 ? login : PERSONA.phone, flow })

  const onSignIn = () => {
    abortConditional()
    remember('signin')
    logEvent('signin_phone_submitted')
    go(`${VERIFY_HREF}?flow=signin`)
  }

  const onCreatePasskey = () => {
    abortConditional()
    remember('create')
    logEvent('create_passkey_chosen', 'sign-in')
    go(CREATE_PASSKEY_HREF)
  }

  const googleNote = (
    <div style={{ marginTop: 18 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1E1E35' }}>Already have an Experian account?</p>
      <p style={{ margin: '2px 0 0', fontSize: 14, lineHeight: 1.5, color: '#35354E' }}>
        If you sign in with Google, your email address needs to match the one we have on file.
      </p>
    </div>
  )

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
                    label="Enter phone, username or email"
                    name="username"
                    type="text"
                    autoComplete="username webauthn"
                    value={login}
                    onChange={setLogin}
                  />

                  <button type="submit" className="v3-btn v3-btn-primary" style={{ marginTop: 16 }}>
                    <span className="v3-desk-i">Sign In</span>
                    <span className="v3-mob-i">Sign in</span>
                  </button>
                </form>

                <div className="v3-forgot">
                  <button type="button" className="v3-linkbtn" onClick={noop}>Forgot username?</button>
                  <button type="button" className="v3-linkbtn" onClick={noop}>Forgot password?</button>
                </div>

                <div className="v3-divider">or</div>

                {/* Returning tester with a saved passkey: offer it here instead of creating another */}
                {hasPasskey ? (
                  <button
                    type="button"
                    className={`v3-btn ${pkState === 'loading' || pkState === 'done' ? 'v3-btn-primary v3-btn-busy' : 'v3-btn-pink'}`}
                    onClick={onPasskeySignIn}
                    aria-busy={pkState === 'waiting' || pkState === 'loading'}
                  >
                    {pkState === 'loading' ? (
                      <span className="v3-btn-spin" role="status" aria-label="Signing in" />
                    ) : pkState === 'done' ? (
                      <span className="v3-btn-check" role="status" aria-label="Signed in">
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : (
                      'Sign in with a passkey'
                    )}
                  </button>
                ) : (
                  <button type="button" className="v3-btn v3-btn-pink" onClick={onCreatePasskey}>
                    Create a passkey
                  </button>
                )}

                <button type="button" className="v3-google" onClick={noop}>
                  <span className="v3-google-g"><GoogleG /></span>
                  <span className="v3-google-txt">Sign in with Google</span>
                </button>

                {googleNote}
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
      <SimPrompt />
    </div>
  )
}
