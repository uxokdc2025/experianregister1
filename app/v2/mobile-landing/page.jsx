'use client'

/* ──────────────────────────────────────────────────────────────
   Registration Re-imagined — MOBILE landing (experian.com clone)
   Fixed 393×852 phone frame; mirrors the desktop landing content
   in a mobile-first layout. Every CTA hands off to the mobile
   registration flow at /mobile.
   ────────────────────────────────────────────────────────────── */

import { useState } from 'react'

const PINK = 'var(--color-pink-400)'
const BLUE_DEEP = 'var(--color-blue-800)'
const INK = '#0D0D1F'
const MW = 393
const MH = 852
const FLOW_HREF = '/v2/mobile'
const go = (href) => window.location.assign(href)

function MobileFrame({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: MW, height: MH, background: '#fff', borderRadius: 46, boxShadow: '0 40px 90px rgba(13,13,31,.40)', overflow: 'hidden', position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 9999, background: 'rgba(13,13,31,.22)', pointerEvents: 'none', zIndex: 40 }} />
      </div>
    </div>
  )
}

function StatusBar() {
  const c = '#1E1E35'
  return (
    <div style={{ height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px 0 30px', flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: c }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill={c}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg aria-hidden="true" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M2 5a9 9 0 0112 0M4.6 7.5a5.3 5.3 0 016.8 0M8 10h.01" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
        <svg aria-hidden="true" width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="1" y="1" width="22" height="11" rx="3" stroke={c} strokeWidth="1" opacity=".45" /><rect x="3" y="3" width="17" height="7" rx="1.5" fill={c} /><rect x="24" y="4.5" width="2" height="4" rx="1" fill={c} /></svg>
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div style={{ padding: '10px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-neutral-100)', flexShrink: 0 }}>
      <button aria-label="Menu" style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', color: INK }}>
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <img src="/uploads/Experian.png" alt="Experian" style={{ height: 22, width: 'auto' }} />
      <button aria-label="Search" style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer', color: INK }}>
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </div>
  )
}

const TABS = [
  { key: 'score', label: 'Credit report & FICO® Score', icon: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 26 26" fill="none"><path d="M4 17a9 9 0 1118 0" stroke="#406EB3" strokeWidth="2.2" strokeLinecap="round"/><path d="M4 17a9 9 0 014-7.5" stroke="#982881" strokeWidth="2.2" strokeLinecap="round"/><path d="M13 17l4-4.5" stroke="#BA2F7D" strokeWidth="2.2" strokeLinecap="round"/><circle cx="13" cy="17" r="1.8" fill="#26478D"/></svg>
  ) },
  { key: 'ding', label: 'No Ding Decline™ cards', icon: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 26 26" fill="none"><path d="M13 4a5.5 5.5 0 015.5 5.5v2L20 15H6l1.5-3.5v-2A5.5 5.5 0 0113 4z" stroke="#F5A623" strokeWidth="2" strokeLinejoin="round"/><path d="M10.5 18a2.5 2.5 0 005 0" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/><circle cx="19" cy="6" r="3" fill="#BA2F7D"/></svg>
  ) },
  { key: 'bills', label: 'Save on bills', icon: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 26 26" fill="none"><ellipse cx="11.5" cy="14" rx="8" ry="6.5" stroke="#BA2F7D" strokeWidth="2"/><path d="M19.5 11.5a3.2 3.2 0 010 5M11.5 7.5V5M8 7.5h7" stroke="#BA2F7D" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="13.5" r="1.1" fill="#BA2F7D"/></svg>
  ) },
  { key: 'car', label: 'Car insurance', icon: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 26 26" fill="none"><path d="M5 13l2.2-5.5h9.6L19 13" stroke="#406EB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="13" width="20" height="6" rx="2" stroke="#406EB3" strokeWidth="2"/><circle cx="8" cy="19" r="1.8" fill="#26478D"/><circle cx="18" cy="19" r="1.8" fill="#26478D"/></svg>
  ) },
  { key: 'card', label: 'Digital checking', icon: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 26 26" fill="none"><rect x="3" y="6" width="20" height="14" rx="2.5" stroke="#982881" strokeWidth="2"/><path d="M3 10.5h20" stroke="#982881" strokeWidth="2"/><path d="M6.5 16h4" stroke="#632678" strokeWidth="2" strokeLinecap="round"/></svg>
  ) },
]

function TabScroller({ active, setActive }) {
  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '14px 18px 6px', flexShrink: 0, scrollbarWidth: 'none' }}>
      {TABS.map((t, i) => {
        const isOn = active === i
        return (
          <button key={t.key} onClick={() => setActive(i)}
            style={{
              flex: '0 0 auto',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
              width: 128, minHeight: 74,
              padding: '10px 12px',
              background: isOn ? BLUE_DEEP : '#fff',
              color: isOn ? '#fff' : INK,
              border: isOn ? 'none' : '1px solid var(--color-neutral-200)',
              borderRadius: 12,
              fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
              boxShadow: isOn ? '0 6px 14px rgba(20,36,80,.18)' : 'none',
            }}>
            <span style={{ opacity: isOn ? 0.9 : 1 }}>{t.icon}</span>
            <span style={{ fontSize: 12, lineHeight: 1.25, fontWeight: 700 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ScoreCard() {
  return (
    <div style={{
      position: 'relative',
      margin: '16px 18px 4px',
      background: BLUE_DEEP,
      color: '#fff',
      borderRadius: 14,
      padding: '18px 18px 20px',
      boxShadow: '0 14px 28px rgba(20,36,80,.20)',
    }}>
      <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: '-.02em' }}>702</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', opacity: 0.9 }}>
        FICO® SCORE 8
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#fff" strokeWidth="1.2" opacity=".7"/><path d="M7 6.2v3.4M7 4.3v.1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      {/* score gauge */}
      <div style={{ marginTop: 12, position: 'relative', height: 6, borderRadius: 9999, background: 'linear-gradient(90deg,#E4573E 0%,#EFA33B 35%,#F5C848 55%,#7FB750 80%,#3C8B3E 100%)' }}>
        <div style={{ position: 'absolute', top: -4, left: 'calc(70% - 7px)', width: 14, height: 14, borderRadius: '50%', background: '#fff', border: '3px solid #F5C848' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginTop: 6 }}>
        <span>300</span><span>850</span>
      </div>

      <div style={{ marginTop: 16, fontSize: 14, fontWeight: 800 }}>18% credit usage</div>
      <div style={{ marginTop: 6, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.18)', overflow: 'hidden' }}>
        <div style={{ width: '18%', height: '100%', background: '#7FB750' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginTop: 6 }}>
        <span>Credit used: $4,680</span><span>Available: $21k</span>
      </div>

      {/* floating "score went up" chip */}
      <div style={{
        position: 'absolute', right: 8, bottom: -22,
        background: '#fff', color: INK,
        borderRadius: 12, padding: '8px 10px',
        boxShadow: '0 10px 22px rgba(13,13,31,.18)',
        display: 'flex', alignItems: 'center', gap: 8, minWidth: 168,
      }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 15L10 7l3 4 3-3" stroke="#26478D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>Your FICO® Score<br/>went up!</span>
      </div>
    </div>
  )
}

function StickyCta() {
  return (
    <div style={{
      flexShrink: 0,
      borderTop: '1px solid var(--color-neutral-200)',
      background: '#fff',
      padding: '10px 16px 22px',
      display: 'flex', gap: 10,
    }}>
      <button
        onClick={() => go(FLOW_HREF)}
        style={{
          flex: 1, height: 48, borderRadius: 8,
          background: '#fff', color: INK,
          border: '1.5px solid var(--color-neutral-300)',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Sign in
      </button>
      <button
        onClick={() => go(FLOW_HREF)}
        style={{
          flex: 1.4, height: 48, borderRadius: 8,
          background: PINK, color: '#fff',
          border: 'none',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        }}
      >
        Sign up for free
      </button>
    </div>
  )
}

export default function MobileLandingPage() {
  const [active, setActive] = useState(0)
  return (
    <MobileFrame>
      <StatusBar />
      <TopBar />

      <main id="main-content" style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        <div style={{ padding: '18px 18px 4px' }}>
          <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.12, fontWeight: 900, color: INK, letterSpacing: '-.01em' }}>
            Reach your credit and money goals
          </h1>
        </div>

        <TabScroller active={active} setActive={setActive} />

        <div style={{ padding: '10px 18px 0' }}>
          <h2 style={{ margin: '10px 0 8px', fontSize: 20, fontWeight: 900, color: INK, lineHeight: 1.2 }}>
            Get your free credit report and FICO® Score*
          </h2>
          <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.5, color: 'var(--color-neutral-700)' }}>
            Then raise your credit scores instantly using bills like your cell phone, utilities, streaming services and eligible rent payments.
          </p>
          <button
            onClick={() => go(FLOW_HREF)}
            style={{
              height: 46, padding: '0 22px',
              background: PINK, color: '#fff',
              border: 'none', borderRadius: 8,
              fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Let&#39;s get started
          </button>
        </div>

        <ScoreCard />

        <p style={{ margin: '32px 18px 0', fontSize: 10.5, lineHeight: 1.55, color: 'var(--color-neutral-600)' }}>
          *Credit score calculated based on FICO® Score 8 model. Your lender or insurer may use a different FICO® Score than FICO® Score 8, or another type of credit score altogether.
        </p>
        <p style={{ margin: '10px 18px 0', fontSize: 10.5, lineHeight: 1.55, color: 'var(--color-neutral-600)' }}>
          For research purposes only. Not a live Experian product.
        </p>
      </main>

      <StickyCta />
    </MobileFrame>
  )
}
