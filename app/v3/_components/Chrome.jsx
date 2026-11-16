'use client'

import { restartDemo } from '../lib/state'

/* ──────────────────────────────────────────────────────────────
   Shared V3 chrome: Experian header, footer (desktop + stacked
   mobile), the page shell those two wrap, and the "Verify
   identity" bars used by D4/D5.

   Each screen ships ONE content tree; the desktop/mobile
   differences are CSS (.v3-desk / .v3-mob, 767px) so there is no
   first-paint flash and only one <main> per page.

   Every footer link is deliberately inert — this is a prototype.
   ────────────────────────────────────────────────────────────── */

const TRADEMARK =
  'Experian and the Experian trademarks used herein are trademarks or registered trademarks of Experian Information Solutions, Inc., ConsumerInfo.com, Inc. or its affiliates. Other product or company names mentioned herein are the property of their respective owners.'

/* The Experian logo in every V3 header doubles as the demo restart:
   clears all V3 demo state and goes to the V3 homepage. */
export function RestartLogo({ height, imgStyle }) {
  return (
    <button type="button" className="v3-logo-btn" aria-label="Experian home" onClick={restartDemo}>
      <img src="/uploads/Experian.png" alt="Experian" style={{ display: 'block', height, width: 'auto', ...imgStyle }} />
    </button>
  )
}

export function ExperianHeader({ className = '' }) {
  return (
    <header
      className={className}
      style={{
        background: '#fff',
        boxShadow: '0 1px 4px rgba(13,13,31,.10)',
        position: 'relative',
        zIndex: 5,
        flexShrink: 0,
      }}
    >
      <div className="v3-desk" style={{ maxWidth: 1480, margin: '0 auto', padding: '24px 40px' }}>
        <RestartLogo height={42} />
      </div>
      <div className="v3-mob" style={{ padding: '14px 16px' }}>
        <RestartLogo height={30} />
      </div>
    </header>
  )
}

function TrustedSite() {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #D1D1DC',
        borderRadius: 3,
        padding: '5px 10px 3px',
        background: '#fff',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="14" rx="2" fill="#5BA829" />
          <path d="M3.6 7.2l2.2 2.2 4.6-4.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1E1E35' }}>
          Trusted<span style={{ color: '#5BA829' }}>Site</span>
          <sup style={{ fontSize: 7 }}>®</sup>
        </span>
      </span>
      <span style={{ fontSize: 7.5, letterSpacing: '.12em', color: '#6B6B88', marginTop: 1 }}>CERTIFIED SECURE</span>
    </div>
  )
}

function AskEva() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: '#EAF0FA',
        color: '#26478D',
        borderRadius: 9999,
        padding: '10px 18px',
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#26478D" strokeWidth="1.4" />
        <path d="M9 5.5v7M5.5 9h7" stroke="#26478D" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      Ask EVA
    </span>
  )
}

export function ExperianFooter({ className = '' }) {
  const linkStyle = { fontSize: 14, color: '#406EB3', textDecoration: 'underline' }
  return (
    <footer className={className} style={{ flexShrink: 0 }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, #26478D 0%, #406EB3 45%, #BA2F7D 100%)' }} />

      {/* desktop */}
      <div className="v3-desk" style={{ background: '#fff', padding: '26px 40px 36px' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 34px', alignItems: 'baseline' }}>
              <span style={{ fontSize: 14, color: '#1E1E35' }}>© 2026 Experian. All rights reserved.</span>
              <a className="v3-foot-link" style={linkStyle}>Terms of Use Agreement</a>
              <a className="v3-foot-link" style={linkStyle}>Privacy Policy</a>
            </div>
            <p style={{ margin: '14px 0 0', maxWidth: 820, fontSize: 13.5, lineHeight: 1.55, color: '#35354E' }}>{TRADEMARK}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 26px', marginTop: 14 }}>
              <a className="v3-foot-link" style={linkStyle}>Marketplace Licenses and Disclosures</a>
              <a className="v3-foot-link" style={linkStyle}>Insurance State Licenses</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexShrink: 0, paddingTop: 4 }}>
            <TrustedSite />
            <AskEva />
          </div>
        </div>
      </div>

      {/* mobile — stacked, centred */}
      <div className="v3-mob" style={{ background: '#fff', padding: '22px 20px 34px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a className="v3-foot-link" style={{ fontSize: 14, color: '#1E1E35' }}>Terms of Use Agreement</a>
          <a className="v3-foot-link" style={{ fontSize: 14, color: '#1E1E35' }}>Privacy Policy</a>
        </div>
        <hr style={{ border: 0, borderTop: '1px solid #E0E0E8', margin: '20px 12px' }} />
        <p style={{ margin: 0, fontSize: 14, color: '#1E1E35' }}>© 2026 Experian. All rights reserved.</p>
        <p style={{ margin: '16px 0 0', fontSize: 13.5, lineHeight: 1.55, color: '#35354E' }}>{TRADEMARK}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
          <a className="v3-foot-link" style={linkStyle}>Marketplace Licenses and Disclosures</a>
          <a className="v3-foot-link" style={linkStyle}>Insurance State Licenses</a>
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <TrustedSite />
        </div>
      </div>
    </footer>
  )
}

/* Experian header + centred content column + footer (D1, D2, D6, D7, D8). */
export function PageShell({ children, background = '#fff', columnStyle }) {
  return (
    <div className="v3-page" style={{ background }}>
      <ExperianHeader />
      <main id="main-content" className="v3-main">
        <div className="v3-col" style={columnStyle}>{children}</div>
      </main>
      <ExperianFooter />
    </div>
  )
}

export function CloseButton({ onClick, label = 'Close and return to sign in' }) {
  return (
    <button type="button" className="v3-close" onClick={onClick} aria-label={label}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/* D4/D5 desktop title bar ("Verify identity"); on the phone M4 shows the
   same bar titled "Security verification". */
export function VerifyTopBar({ title, mobileTitle, onClose, className = '' }) {
  return (
    <div
      className={className}
      style={{
        flexShrink: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      <h2 className="v3-topbar-title" style={{ margin: 0 }}>
        <span className="v3-desk-i">{title}</span>
        <span className="v3-mob-i">{mobileTitle || title}</span>
      </h2>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
        <CloseButton onClick={onClose} />
      </span>
    </div>
  )
}

/* Right-aligned bottom action bar — desktop only (D4/D5). */
export function DesktopActionBar({ children }) {
  return (
    <div className="v3-desk" style={{ flexShrink: 0, borderTop: '1px solid #EAEAEF', background: '#fff', padding: '18px 40px' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
    </div>
  )
}
