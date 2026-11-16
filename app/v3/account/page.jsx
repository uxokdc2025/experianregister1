'use client'

/* ──────────────────────────────────────────────────────────────
   D9 / M9 — Your account › Passkeys (/v3/account)
   plus D10 / M10 Rename, the Remove confirm, and the X1 SMS notice.

   Everything is the fictional persona and lives in exp_v3 only.
   Remove clears the passkey from this prototype's state (and asks
   the browser, best-effort, to forget it); it can't delete the
   credential from the device — the dialog says so.
   "Add a passkey" calls create() synchronously in its click.
   ────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react'
import { RestartLogo, ExperianFooter } from '../_components/Chrome'
import { Field } from '../_components/Form'
import { Modal } from '../_components/Modal'
import { SettingUp } from '../_components/SettingUp'
import { ShieldCheck } from '../_components/Art'
import { finishCreation, probePasskeySupport, signalRemoved, startPasskeyCreation } from '../lib/passkey'
import { DONE_HREF, go } from '../lib/routes'
import { PERSONA, formatDate, logEvent, readState, writeState } from '../lib/state'

const NAV = ['Credit', 'Money', 'Identity', 'Credit Cards', 'Loans', 'Auto & Insurance']
const TABS = ['Account information', 'Experian Smart Money™', 'Connected accounts', 'Notification preferences', 'Privacy and sharing', 'Membership details']

const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const lastUsedText = (iso) => (!iso ? 'Not used yet' : sameDay(new Date(iso), new Date()) ? 'Last used today' : `Last used ${formatDate(new Date(iso))}`)

/* "Nov 16, 2026 at 9:58 AM" in Central time */
function ctStamp(iso) {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }).format(d)
  return `${date} at ${time}`
}

function Icon({ d, size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}
const PENCIL = 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4'
const INFO = 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.5'
const BELL = 'M6 16V11a6 6 0 1112 0v5l2 2H4l2-2zM10 20a2 2 0 004 0'
const USER = 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 12a3 3 0 100-6 3 3 0 000 6zM6.5 18a6 6 0 0111 0'
const MENU = 'M4 7h16M4 12h16M4 17h16'
const TRASH = 'M5 7h14M10 11v6M14 11v6M7 7l1 13h8l1-13M9 7V4h6v3'

function SignedInHeader() {
  return (
    <header className="v3-acct-header">
      <div className="v3-desk">
        <div className="v3-acct-wrap" style={{ display: 'flex', alignItems: 'center', gap: 30, height: 74 }}>
          <RestartLogo height={34} />
          <nav aria-label="Experian" style={{ display: 'flex', gap: 30, flex: 1 }}>
            {NAV.map((n) => (
              <a key={n} className="v3-acct-nav">{n}</a>
            ))}
          </nav>
          <span className="v3-upgrade">Upgrade</span>
          <span style={{ color: '#1E1E35' }}><Icon d={BELL} size={24} /></span>
          <span style={{ color: '#1E1E35' }}><Icon d={USER} size={28} /></span>
        </div>
      </div>
      <div className="v3-mob">
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 18 }}>
          <span style={{ flex: 1 }}><RestartLogo height={30} /></span>
          <span style={{ color: '#1E1E35' }}><Icon d={BELL} size={26} /></span>
          <span style={{ color: '#26478D' }}><Icon d={MENU} size={30} /></span>
        </div>
      </div>
    </header>
  )
}

function Row({ label, value, edit = true, children }) {
  return (
    <div className="v3-acct-row">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="v3-acct-label">{label}</div>
        {value ? <div className="v3-acct-value">{value}</div> : null}
        {children}
      </div>
      {edit ? (
        <span className="v3-acct-edit" aria-hidden="true"><Icon d={PENCIL} /></span>
      ) : null}
    </div>
  )
}

function SmsNotice({ iso, onClose }) {
  return (
    <div className="v3-sms" role="status" aria-label="Text message from Experian">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span className="v3-sms-app">Messages</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>now</span>
        <button type="button" className="v3-sms-x" onClick={onClose} aria-label="Dismiss message">×</button>
      </div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45 }}>
        Experian: A passkey was added to your account on {ctStamp(iso)} CT. If this wasn’t you, sign in at experian.com to
        review your account.
      </p>
    </div>
  )
}

export default function AccountPage() {
  const [passkey, setPasskey] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState('')
  const [removing, setRemoving] = useState(false)
  const [removedNote, setRemovedNote] = useState(false)
  const [sms, setSms] = useState(null)
  const [tip, setTip] = useState(false)
  const smsTimer = useRef(null)

  useEffect(() => {
    probePasskeySupport()
    const s = readState()
    setPasskey(s.passkey || null)
    setLoaded(true)
    if (s.smsPending && s.passkey) {
      // X1: the security text arrives a moment after the account page opens, once per creation
      smsTimer.current = setTimeout(() => setSms(s.smsPending), 900)
      writeState({ smsPending: null })
      logEvent('sms_notice_shown')
    }
    if (window.location.hash === '#passkeys') {
      setTimeout(() => document.getElementById('passkeys')?.scrollIntoView({ block: 'center' }), 50)
    }
    return () => clearTimeout(smsTimer.current)
  }, [])

  const onAdd = () => {
    /* First statement, no await before it — keeps the user gesture. */
    const creation = startPasskeyCreation()
    setBusy(true)
    logEvent('passkey_creation_started', 'account')
    creation.then((result) => finishCreation(result))
  }

  const saveName = () => {
    const clean = name.trim().slice(0, 40)
    if (!clean) return
    const next = { ...passkey, name: clean }
    writeState({ passkey: next })
    setPasskey(next)
    setRenaming(false)
    logEvent('passkey_renamed')
  }

  const confirmRemove = () => {
    signalRemoved(passkey && passkey.id)
    writeState({ passkey: null })
    setPasskey(null)
    setRemoving(false)
    setRemovedNote(true)
    logEvent('passkey_removed')
  }

  if (busy) return <SettingUp />

  const passkeysSection = (
    <section id="passkeys" className="v3-acct-passkeys" aria-labelledby="v3-passkeys-h">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h2 id="v3-passkeys-h" className="v3-acct-label" style={{ margin: 0 }}>Passkeys</h2>
        <span className="v3-tip-wrap">
          <button
            type="button"
            className="v3-tip-btn"
            aria-label="What is a passkey?"
            aria-describedby={tip ? 'v3-passkey-tip' : undefined}
            onClick={() => setTip((t) => !t)}
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
          >
            <Icon d={INFO} size={16} />
          </button>
          {tip ? (
            <span id="v3-passkey-tip" role="tooltip" className="v3-tip">
              A passkey lets you sign in without having to remember a password.
            </span>
          ) : null}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button" className="v3-acct-link" onClick={onAdd}>Add a passkey</button>
      </div>

      {loaded && passkey ? (
        <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0 }}>
          <li className="v3-pk-row">
            <span className="v3-pk-meta">
              <span className="v3-pk-name">{passkey.name}</span>
              {' · '}
              {passkey.createdAt ? `Created ${formatDate(new Date(passkey.createdAt))}` : 'Created earlier'}
              {' · '}
              {lastUsedText(passkey.lastUsed)}
            </span>
            <span className="v3-pk-actions">
              <button type="button" className="v3-acct-act" onClick={() => { setName(passkey.name); setRenaming(true) }}>
                <Icon d={PENCIL} size={15} /> Rename
              </button>
              <button type="button" className="v3-acct-act" onClick={() => setRemoving(true)}>
                <Icon d={TRASH} size={15} /> Remove
              </button>
            </span>
          </li>
        </ul>
      ) : loaded ? (
        <p className="v3-acct-value" style={{ marginTop: 10 }}>No passkeys yet.</p>
      ) : null}

      {removedNote ? (
        <p className="v3-note v3-toast v3-pk-removed" role="status">
          Passkey removed from your Experian account. To delete it from this device too, remove it in your device’s password
          manager.
        </p>
      ) : null}
    </section>
  )

  return (
    <div className="v3-page v3-acct-page">
      <SignedInHeader />

      <main id="main-content" className="v3-main">
        <div className="v3-acct-wrap" style={{ paddingTop: 26, paddingBottom: 56 }}>
          <h1 className="v3-acct-h1">Your account</h1>
          <p className="v3-acct-sub">Manage your account info, settings and membership details.</p>

          <div className="v3-tabs" role="tablist" aria-label="Account sections">
            {TABS.map((t, i) => (
              <span key={t} role="tab" aria-selected={i === 0} className={`v3-tab${i === 0 ? ' is-on' : ''}`}>{t}</span>
            ))}
          </div>

          <div className="v3-acct-grid">
            <div style={{ minWidth: 0 }}>
              <div className="v3-acct-card">
                <Row label="Username" value={PERSONA.username} />
                <Row label="Security questions" value="***********" />
                <Row label="4-digit PIN" value="****" />
                <div className="v3-acct-row" style={{ alignItems: 'center' }}>
                  <span style={{ color: '#6B6B88', marginLeft: 12 }}><Icon d={INFO} size={16} /></span>
                  <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                    <div className="v3-acct-label">Use 2-Step Verification</div>
                    <div className="v3-acct-value" style={{ color: '#6B6B88' }}>Adds security with a sign-in code</div>
                  </div>
                  <span className="v3-toggle" role="switch" aria-checked="false" aria-label="Use 2-Step Verification" />
                </div>
                {passkeysSection}
              </div>

              <div className="v3-acct-card" style={{ marginTop: 26 }}>
                <Row label="Name" value={PERSONA.displayName} edit={false} />
                <Row label="Address" value={PERSONA.address} />
                <Row label="Phone number" value={PERSONA.phone}>
                  <div className="v3-acct-callout">
                    <div>Verify your Phone number for added security</div>
                    <a className="v3-acct-link" style={{ display: 'inline-block', marginTop: 6 }}>Verify</a>
                  </div>
                </Row>
                <Row label="Email" value={PERSONA.email} />
                <div className="v3-acct-row" style={{ alignItems: 'center' }}>
                  <span style={{ color: '#6B6B88', marginLeft: 12 }}><Icon d={INFO} size={16} /></span>
                  <div className="v3-acct-label" style={{ flex: 1, marginLeft: 8 }}>Annual income</div>
                  <a className="v3-acct-link">Add</a>
                </div>
              </div>

              {/* End of study: the demo bars are gone, so the tester's way out lives here */}
              <p className="v3-finish">
                Done with the study? <button type="button" className="v3-linkbtn" onClick={() => go(DONE_HREF)}>Finish study</button>
              </p>
            </div>

            <aside className="v3-acct-side" aria-label="More from Experian">
              <div className="v3-acct-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="v3-know-art" aria-hidden="true">
                  <span style={{ background: '#E5003A' }}>EQ</span>
                  <span style={{ background: '#1E3A6E' }}>EX</span>
                  <span style={{ background: '#0E6B8C' }}>TU</span>
                </div>
                <div style={{ padding: '18px 16px 18px', textAlign: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1E1E35' }}>Know where you stand</h2>
                  <p style={{ margin: '12px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#55556E' }}>
                    Stay up-to-date on your Experian, TransUnion and Equifax credit reports and FICO® Scores.
                  </p>
                  <span className="v3-btn v3-btn-primary" style={{ marginTop: 16, minHeight: 44, fontSize: 14 }}>Check all 3 now</span>
                </div>
              </div>
              <div className="v3-acct-card" style={{ marginTop: 22, padding: '22px 22px 10px' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E1E35', textAlign: 'center', lineHeight: 1.4 }}>
                  Update your info regularly to keep your account secure
                </h2>
                {[
                  ['Phone number', 'Adds another way to sign in plus it helps us contact you directly if there’s ever any fraud detected on your account.'],
                  ['Email address', 'Enjoy easier sign ins, quicker access to password resets and peace of mind being able to get back into your account.'],
                  ['Home address', 'Inconsistent addresses may cause problems when you try and apply for financial products.'],
                ].map(([h, b]) => (
                  <div key={h} style={{ borderTop: '1px solid #EAEAEF', padding: '14px 4px', marginTop: h === 'Phone number' ? 16 : 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1E1E35' }}>{h}</div>
                    <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#55556E' }}>{b}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ExperianFooter />

      {sms ? <SmsNotice iso={sms} onClose={() => setSms(null)} /> : null}

      {renaming ? (
        <Modal labelledBy="v3-rename-h" onClose={() => setRenaming(false)}>
          <div className="v3-modal-head">
            <h2 id="v3-rename-h" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E1E35' }}>Rename passkey</h2>
            <button type="button" className="v3-close" onClick={() => setRenaming(false)} aria-label="Close">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="v3-art v3-desk" style={{ marginTop: 18 }}><ShieldCheck size={64} /></div>
          <p className="v3-body v3-ctr" style={{ marginTop: 16, color: '#1E1E35' }}>
            Give your passkey a name you’ll recognize. Changing the name won’t change how your passkey works.
          </p>
          <form style={{ marginTop: 16 }} onSubmit={(e) => { e.preventDefault(); saveName() }}>
            <Field label="Passkey Name" name="passkey-name" value={name} onChange={setName} maxLength={40} />
            <button type="submit" className="v3-btn v3-btn-primary" style={{ marginTop: 22 }} disabled={!name.trim()}>Save</button>
            <button type="button" className="v3-btn v3-btn-pink" style={{ marginTop: 10 }} onClick={() => setRenaming(false)}>Cancel</button>
          </form>
        </Modal>
      ) : null}

      {removing ? (
        <Modal labelledBy="v3-remove-h" onClose={() => setRemoving(false)}>
          <h2 id="v3-remove-h" className="v3-sub" style={{ fontSize: 20 }}>Remove this passkey?</h2>
          <p className="v3-body" style={{ marginTop: 10 }}>
            You won’t be able to use it to sign in to Experian. To delete it from your device too, remove it in your device’s
            password manager.
          </p>
          <div className="v3-modal-actions" style={{ gap: 10 }}>
            <button type="button" className="v3-btn v3-btn-pink v3-modal-cta" onClick={() => setRemoving(false)}>Cancel</button>
            <button type="button" className="v3-btn v3-btn-primary v3-modal-cta" onClick={confirmRemove}>Remove</button>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
