'use client'

/* ──────────────────────────────────────────────────────────────
   D4 / M4 — Let's verify it's you (/v3/verify)

   One content tree, two chromes: on desktop this is a
   full-screen "Verify identity" step with a bottom action bar;
   on the phone it is the "Security verification" layout from M4.
   ?flow=create (passkey) or ?flow=signin (phone + code only).
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { VerifyTopBar, DesktopActionBar } from '../_components/Chrome'
import { RadioRow } from '../_components/Form'
import { ShieldCheck } from '../_components/Art'
import { CODE_HREF, SIGN_IN_HREF, go } from '../lib/routes'
import { DEFAULT_LAST4, logEvent, maskPhone, readState, writeState } from '../lib/state'

export default function VerifyPage() {
  const [flow, setFlow] = useState('create')
  const [masked, setMasked] = useState(`(***) ***-${DEFAULT_LAST4}`)
  const [method, setMethod] = useState('text')
  const [showNote, setShowNote] = useState(false)

  useEffect(() => {
    const saved = readState()
    const fromUrl = new URLSearchParams(window.location.search).get('flow')
    const next = fromUrl === 'signin' || fromUrl === 'create' ? fromUrl : saved.flow || 'create'
    setFlow(next)
    setMasked(maskPhone(saved.phone))
    if (saved.otpMethod) setMethod(saved.otpMethod)
    writeState({ flow: next })
  }, [])

  const onSendCode = () => {
    writeState({ otpMethod: method, flow })
    logEvent('otp_requested', method)
    go(`${CODE_HREF}?flow=${flow}`)
  }

  const onNoAccess = () => {
    logEvent('no_access_to_phone_clicked')
    setShowNote(true)
  }

  const note = showNote ? (
    <p className="v3-note v3-toast" role="status" style={{ marginTop: 10, color: '#35354E' }}>
      For this study, choose text or call to continue.
    </p>
  ) : null

  return (
    <div className="v3-page">
      <VerifyTopBar title="Verify identity" mobileTitle="Security verification" onClose={() => go(SIGN_IN_HREF)} />

      <main id="main-content" className="v3-main">
        <div className="v3-col v3-col-verify">
          <div className="v3-art v3-desk">
            <ShieldCheck />
          </div>

          <h1 className="v3-h1 v3-ctr-mobleft" style={{ marginTop: 18 }}>
            Let&#39;s verify it&#39;s you
          </h1>

          <p className="v3-body v3-desk v3-ctr" style={{ marginTop: 10 }}>
            We&#39;ll send you a 6-digit verification code. How do you want to receive your code?
          </p>

          <div className="v3-mob">
            <p className="v3-body" style={{ marginTop: 10 }}>
              We&#39;ll send you a 6-digit verification code to confirm your identity. Message, data, and voice rates may
              apply.
            </p>
            <p style={{ margin: '18px 0 0', fontSize: 17, fontWeight: 500, color: '#1E1E35' }}>{masked}</p>
            <p style={{ margin: '20px 0 0', fontSize: 16, fontWeight: 700, color: '#1E1E35' }}>
              How would you like to receive your code?
            </p>
          </div>

          <fieldset style={{ border: 0, margin: '20px 0 0', padding: 0 }}>
            <legend className="sr-only">How would you like to receive your code?</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RadioRow name="otp-method" value="text" checked={method === 'text'} onSelect={setMethod}>
                <span className="v3-desk-i">Text me at {masked}</span>
                <span className="v3-mob-i">Text message</span>
                <span className="v3-mob" style={{ marginTop: 3, fontSize: 13, color: '#6B6B88' }}>
                  * Message and data rates may apply
                </span>
              </RadioRow>

              <RadioRow name="otp-method" value="call" checked={method === 'call'} onSelect={setMethod}>
                <span className="v3-desk-i">Call me at {masked}</span>
                <span className="v3-mob-i">Phone call</span>
              </RadioRow>
            </div>
          </fieldset>

          <div className="v3-desk v3-ctr">
            <p className="v3-note" style={{ marginTop: 18 }}>
              Message and data rates may apply
            </p>
            <button type="button" className="v3-linkbtn" style={{ marginTop: 10 }} onClick={onNoAccess}>
              I no longer have access to this phone
            </button>
            {note}
          </div>
        </div>
      </main>

      <DesktopActionBar>
        <button type="button" className="v3-btn v3-btn-primary v3-btn-auto" onClick={onSendCode}>
          Send code
        </button>
      </DesktopActionBar>

      <div className="v3-mob" style={{ flexShrink: 0, padding: '12px 20px 28px' }}>
        <button type="button" className="v3-btn v3-btn-primary" onClick={onSendCode}>
          Send code
        </button>
        <button type="button" className="v3-btn v3-btn-pink" style={{ marginTop: 10 }} onClick={onNoAccess}>
          I no longer have access to this phone
        </button>
        <div className="v3-ctr">{note}</div>
      </div>
    </div>
  )
}
