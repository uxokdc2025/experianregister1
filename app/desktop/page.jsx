'use client'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'

/* ───────────── Icons ───────────── */
const Ico = {
  search: (p) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chevDown: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevR: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  info: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6.2v3.4M7 4.3v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

const TabIco = {
  score: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 17a9 9 0 1118 0" stroke="#406EB3" strokeWidth="2.2" strokeLinecap="round"/><path d="M4 17a9 9 0 014-7.5" stroke="#982881" strokeWidth="2.2" strokeLinecap="round"/><path d="M13 17l4-4.5" stroke="#BA2F7D" strokeWidth="2.2" strokeLinecap="round"/><circle cx="13" cy="17" r="1.8" fill="#26478D"/></svg>,
  bell: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 4a5.5 5.5 0 015.5 5.5v2L20 15H6l1.5-3.5v-2A5.5 5.5 0 0113 4z" stroke="#F5A623" strokeWidth="2" strokeLinejoin="round"/><path d="M10.5 18a2.5 2.5 0 005 0" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/><circle cx="19" cy="6" r="3" fill="#BA2F7D"/></svg>,
  piggy: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><ellipse cx="11.5" cy="14" rx="8" ry="6.5" stroke="#BA2F7D" strokeWidth="2"/><path d="M19.5 11.5a3.2 3.2 0 010 5M11.5 7.5V5M8 7.5h7" stroke="#BA2F7D" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="13.5" r="1.1" fill="#BA2F7D"/></svg>,
  car: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M5 13l2.2-5.5h9.6L19 13" stroke="#406EB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="13" width="20" height="6" rx="2" stroke="#406EB3" strokeWidth="2"/><circle cx="8" cy="19" r="1.8" fill="#26478D"/><circle cx="18" cy="19" r="1.8" fill="#26478D"/></svg>,
  card: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="6" width="20" height="14" rx="2.5" stroke="#982881" strokeWidth="2"/><path d="M3 10.5h20" stroke="#982881" strokeWidth="2"/><path d="M6.5 16h4" stroke="#632678" strokeWidth="2" strokeLinecap="round"/></svg>,
}

const HelpIco = {
  freeze: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v16M3.1 6l13.8 8M3.1 14l13.8-8" stroke="var(--color-pink-400)" strokeWidth="1.6" strokeLinecap="round"/><path d="M10 2l-2 2m2-2l2 2M3.1 6l.3 2.7M3.1 6l2.6-.9M16.9 14l-2.6.9m2.6-.9l-.3-2.7M3.1 14l2.6.9M3.1 14l-.3-2.7M16.9 6l-.3 2.7M16.9 6l-2.6-.9M10 18l-2-2m2 2l2-2" stroke="var(--color-pink-400)" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  dispute: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2.5h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1v-14a1 1 0 011-1z" stroke="var(--color-pink-400)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2.5v4h4" stroke="var(--color-pink-400)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6.8 12.2l1.7 1.7 3.4-3.6" stroke="var(--color-pink-400)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  fraud: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l6 2.2v4.3c0 3.7-2.6 6.4-6 7.7-3.4-1.3-6-4-6-7.7V4.2L10 2z" stroke="var(--color-pink-400)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 7v3.2M10 12.6v.1" stroke="var(--color-pink-400)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
}

const Social = {
  fb: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M11.5 18v-7h2.3l.4-2.7h-2.7V6.6c0-.8.2-1.3 1.4-1.3h1.4V2.9c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H6.5V11h2.6v7h2.4z"/></svg>,
  x: () => <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M15.3 2h2.9l-6.3 7.2L19.5 18h-5.8l-4.5-5.9L3.9 18H1l6.8-7.7L1 2h5.9l4.1 5.4L15.3 2zm-1 14.3h1.6L6.3 3.6H4.6l9.7 12.7z"/></svg>,
  ig: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="4.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.6"/><circle cx="14.2" cy="5.8" r="1" fill="currentColor"/></svg>,
  yt: () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="6" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M9.5 9l3.5 2-3.5 2V9z" fill="currentColor"/></svg>,
}

function Logo({ size = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
      <img src="/uploads/Experian.png" alt="Experian" style={{ display: 'block', height: size * 1.2, width: 'auto' }} />
    </div>
  )
}

function UtilityBar() {
  const left = ['Consumer', 'Small Business', 'Business']
  const right = [['Credit Support', true], ['Financial Guidance', false], ['Global Sites', false]]
  return (
    <div style={{ background: 'var(--color-neutral-50)', borderBottom: '1px solid var(--color-neutral-100)' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {left.map((l, i) => <a key={l} className="lnk" style={{ fontSize: 12.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)' }}>{l}</a>)}
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {right.map(([l, c]) => <a key={l} className="lnk" style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-neutral-600)', display: 'flex', alignItems: 'center', gap: 4 }}>{l}{c && <Ico.chevDown />}</a>)}
        </div>
      </div>
    </div>
  )
}

const NAV = ['Credit', 'Protection', 'Money', 'Credit Cards', 'Loans', 'Insurance']
function Nav() {
  const [active, setActive] = useState(null)
  return (
    <header style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 120, boxShadow: '0 1px 0 var(--color-neutral-100)' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: 64 }}>
        <Logo size={26} />
        <nav style={{ display: 'flex', gap: 26, flex: 1, marginLeft: 44 }}>
          {NAV.map(n => (
            <button key={n} onMouseEnter={() => setActive(n)} onMouseLeave={() => setActive(null)}
              style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: active === n ? 'var(--color-blue-600)' : 'var(--color-neutral-700)', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 0' }}>
              {n}<Ico.chevDown style={{ opacity: .6 }} />
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Button variant="secondary" size="md" style={{ borderRadius: 6 }} onClick={() => window.location.assign('/register?step=phone')}>Sign in</Button>
          <Button variant="primary" size="md" style={{ background: 'var(--color-pink-400)', border: 'none', borderRadius: 6 }} onClick={() => window.location.assign('/register?step=phone')}>Sign up</Button>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-neutral-700)', cursor: 'pointer', display: 'flex' }}><Ico.search /></button>
        </div>
      </div>
    </header>
  )
}

const TABS = [
  { ic: TabIco.score, label: 'Get a credit report &\nFICO® Score' },
  { ic: TabIco.bell, label: 'See No Ding Decline™\ncredit cards' },
  { ic: TabIco.piggy, label: 'Save over $600 on\nyour bills' },
  { ic: TabIco.car, label: 'Save on car insurance' },
  { ic: TabIco.card, label: 'Build credit with\ndigital checking' },
]

function HeroTabs({ active, setActive }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, margin: '36px 0 48px' }}>
      {TABS.map((t, i) => {
        const on = i === active
        return (
          <button key={i} onClick={() => setActive(i)}
            style={{ position: 'relative', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: on ? 'var(--color-blue-600)' : '#fff', border: on ? 'none' : '1px solid var(--color-neutral-200)', borderRadius: 12, padding: '16px 16px', minHeight: 74, display: 'flex', alignItems: 'center', gap: 11, boxShadow: on ? '0 8px 20px rgba(38,71,141,.28)' : '0 1px 3px rgba(13,13,31,.06)', transition: 'all .15s var(--ease-default)' }}>
            <span style={{ flexShrink: 0, display: 'flex', filter: on ? 'brightness(0) invert(1)' : 'none' }}>{t.ic()}</span>
            <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'pre-line', color: on ? '#fff' : 'var(--color-neutral-800)' }}>{t.label}</span>
            {on && <span style={{ position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '9px solid var(--color-blue-600)' }} />}
          </button>
        )
      })}
    </div>
  )
}

function RocketArt() {
  return (
    <svg width="144" height="78" viewBox="0 0 144 78" style={{ display: 'block', marginTop: 8, borderRadius: '0 0 8px 8px' }}>
      <rect width="144" height="78" fill="#EAF2FB" />
      <path d="M0 78 L34 50 L60 66 L92 42 L120 60 L144 46 L144 78 Z" fill="#fff" />
      <path d="M0 78 L34 56 L60 70 L92 50 L144 56 L144 78 Z" fill="#DCEAF8" />
      <g transform="translate(78,20) rotate(38)">
        <path d="M6 0 C12 4 12 14 6 22 C0 14 0 4 6 0 Z" fill="#BA2F7D" />
        <circle cx="6" cy="8" r="2.6" fill="#fff" />
        <path d="M2 16 L-2 22 L4 19 Z" fill="#26478D" />
        <path d="M10 16 L14 22 L8 19 Z" fill="#26478D" />
        <path d="M6 22 C4 26 8 26 6 30 C5 27 7 27 6 22Z" fill="#F5A623" />
      </g>
      <g stroke="#BA2F7D" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1 5" fill="none" opacity=".6">
        <path d="M70 56 C66 44 78 34 86 28" />
      </g>
    </svg>
  )
}

function ScoreCard() {
  const pct = ((702 - 300) / 550) * 100
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ background: 'var(--color-blue-600)', borderRadius: 14, padding: '26px 28px 24px', color: '#fff', width: '100%', boxShadow: '0 12px 32px rgba(38,71,141,.25)' }}>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1, letterSpacing: '-.02em' }}>702</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, fontWeight: 600, letterSpacing: '.08em', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }}>
          FICO® SCORE 8 <span style={{ opacity: .65, display: 'flex' }}><Ico.info /></span>
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>300</span>
          <div style={{ position: 'relative', flex: 1, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.18)' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, borderRadius: 9999, background: 'linear-gradient(90deg, #F9CB6B, #F5A623)' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>850</span>
        </div>
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>18% <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>credit usage</span></span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Credit used: $4,660</span>
          </div>
          <div style={{ position: 'relative', marginTop: 10, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.18)' }}>
            <div style={{ position: 'absolute', inset: 0, width: '18%', borderRadius: 9999, background: 'var(--color-success-500)' }} />
            <div style={{ position: 'absolute', top: -1, left: '30%', width: 1.5, height: 8, background: 'rgba(255,255,255,.5)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,.55)' }}>
            <span>0%</span><span>30%</span><span>High impact</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: -26, top: '42%', width: 172, background: '#fff', borderRadius: 14, padding: '14px 14px 0', boxShadow: '0 14px 34px rgba(13,13,31,.18)' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-neutral-800)', lineHeight: 1.25 }}>Your FICO® Score went up!</div>
        <RocketArt />
      </div>
    </div>
  )
}

function Hero() {
  const [tab, setTab] = useState(0)
  return (
    <section style={{ background: '#fff', padding: '48px 0 64px' }}>
      <div className="wrap">
        <h1 style={{ fontSize: 46, fontWeight: 800, textAlign: 'center', letterSpacing: '-.025em', color: 'var(--color-neutral-800)' }}>Reach your credit and money goals</h1>
        <HeroTabs active={tab} setActive={setTab} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 56, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: 'var(--color-neutral-800)', marginBottom: 14 }}>Get your free credit report and FICO® Score<sup style={{ fontSize: 16 }}>*</sup></h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--color-neutral-600)', maxWidth: 420, marginBottom: 26 }}>Then raise your credit scores instantly using bills like your cell phone, utilities, streaming services and eligible rent payments.<sup>ø</sup></p>
            <Button variant="primary" size="lg" onClick={() => window.location.assign('/register?step=phone')} style={{ background: 'var(--color-pink-400)', border: 'none', borderRadius: 6 }}>Let&#39;s get started</Button>
            <hr style={{ margin: '28px 0 18px', border: 'none', borderTop: '1px solid var(--color-neutral-100)' }} />
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: 'var(--color-neutral-500)', marginBottom: 12 }}>
              <sup>*</sup>Credit score calculated based on FICO® Score 8 model. Your lender or insurer may use a different FICO® Score than FICO® Score 8, or another type of credit score altogether. <a className="lnk" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Learn more</a>.
            </p>
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: 'var(--color-neutral-500)' }}>
              <sup>ø</sup>Results will vary. Not all payments are boost-eligible. Some users may not receive an improved score or approval odds. Not all lenders use Experian credit files, and not all lenders use scores impacted by Experian Boost®. <a className="lnk" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Learn more</a>.
            </p>
          </div>
          <ScoreCard />
        </div>
      </div>
    </section>
  )
}

function FauxQR() {
  const N = 21
  const cells = []
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    let on = false
    if (finder(r, c)) {
      const lr = r < 7 ? r : r - (N - 7), lc = c < 7 ? c : c - (N - 7)
      const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6
      const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
      on = edge || core
    } else {
      on = ((r * 7 + c * 13 + (r ^ c) * 5) % 3) === 0
    }
    if (on) cells.push(<rect key={r + '-' + c} x={c * 5} y={r * 5} width="5" height="5" fill="#1E1E35" />)
  }
  return <svg width="105" height="105" viewBox={`0 0 ${N * 5} ${N * 5}`}>{cells}</svg>
}

function DiamondDeco({ size = 340, strokeWidth = 2, style = {} }) {
  const cx = size / 2, cy = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ pointerEvents: 'none', ...style }}>
      <rect x={cx / 2} y={cy / 2} width={cx} height={cy} rx="6" transform={`rotate(45 ${cx} ${cy})`} stroke="white" strokeWidth={strokeWidth} fill="none" opacity="0.22" />
      <rect x={cx / 2 + 18} y={cy / 2 + 18} width={cx - 36} height={cy - 36} rx="4" transform={`rotate(45 ${cx} ${cy})`} stroke="white" strokeWidth={strokeWidth * 0.75} fill="none" opacity="0.14" />
    </svg>
  )
}

function BFF() {
  return (
    <section style={{ background: 'var(--color-purple-600)', overflow: 'hidden', position: 'relative' }}>
      <DiamondDeco size={500} strokeWidth={2.2} style={{ position: 'absolute', left: '12%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
      <DiamondDeco size={320} strokeWidth={1.6} style={{ position: 'absolute', right: '-2%', top: '15%', zIndex: 0 }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '52% 48%', gap: 0, alignItems: 'flex-end', minHeight: 440 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: 440, background: 'rgba(255,255,255,.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, fontWeight: 600 }}>BFF lifestyle photo</span>
          </div>
        </div>
        <div style={{ color: '#fff', padding: '60px 0 52px 24px' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.18, letterSpacing: '-.02em', marginBottom: 18, color: '#fff' }}>Say hi to your Big Financial Friend</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'rgba(255,255,255,.85)', maxWidth: 420, marginBottom: 32 }}>As your BFF, we&#39;ll help you manage your money on the go, send real-time credit alerts straight to your phone, and a lot more.</p>
          <Button variant="secondary-dark" size="lg" style={{ borderRadius: 6 }}>Explore the Experian app</Button>
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Scan to download the app</div>
            <div style={{ width: 132, height: 132, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              <FauxQR />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const HELP = [
  { ic: HelpIco.freeze, title: 'Security freeze', desc: 'Freeze or unfreeze your Experian credit file.' },
  { ic: HelpIco.dispute, title: 'Disputes', desc: 'Correct inaccurate info in your Experian credit file.' },
  { ic: HelpIco.fraud, title: 'Fraud alert', desc: 'Add or remove a fraud alert on your Experian credit file.' },
]
function Help() {
  return (
    <section style={{ background: '#fff', padding: '64px 0 56px' }}>
      <div className="wrap">
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: 'center', letterSpacing: '-.02em', marginBottom: 8 }}>How can we help?</h2>
        <p style={{ fontSize: 16, color: 'var(--color-neutral-600)', textAlign: 'center', fontWeight: 600, marginBottom: 40 }}>Manage your credit basics with these free tools.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 980, margin: '0 auto' }}>
          {HELP.map((h, i) => (
            <Card key={i} variant="bordered" padding="lg" radius="lg" onClick={() => {}} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.ic()}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-800)' }}>{h.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-neutral-600)' }}>{h.desc}</p>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Button variant="secondary" size="md" style={{ borderRadius: 6 }}>See all credit support</Button>
        </div>
      </div>
    </section>
  )
}

const LEGAL_ITEMS = [
  'The Experian Smart Money™ Debit Card is issued by Community Federal Savings Bank (CFSB), pursuant to a license from Mastercard International. Banking services provided by CFSB, Member FDIC. Experian is a Program Manager, not a bank.',
  'Funds in your Experian Smart Money™ Accounts are held in a pooled deposit account at Community Federal Savings Bank and insured up to $250,000 for each account ownership category. Learn more at FDIC.gov.',
  'Experian Smart Money™ Accounts are only available to residents of U.S. states and the District of Columbia, 18 years or older.',
  'Results will vary. Not all payments are boost-eligible. Some users may not receive an improved score or approval odds. Not all lenders use Experian credit files, and not all lenders use scores impacted by Experian Boost®. Learn more.',
  'Early access to your direct deposit into your Experian Smart Money™ Digital Checking Account depends on the timing of receipt of the incoming direct deposit file. We generally make direct deposits available up to 2 days earlier than the payment date specified in the direct deposit file.',
  'Mastercard and the circles design are registered trademarks of Mastercard International Incorporated.',
]
function Legal() {
  return (
    <section style={{ background: '#fff', padding: '8px 0 56px' }}>
      <div className="wrap" style={{ maxWidth: 1180 }}>
        {LEGAL_ITEMS.map((t, i) => (
          <p key={i} style={{ fontSize: 11.5, lineHeight: 1.65, color: 'var(--color-neutral-500)', marginBottom: 12, maxWidth: 980 }}>
            <sup>{['', '§', 'φ', 'ø', '†', '*'][i]}</sup>{t}
          </p>
        ))}
      </div>
    </section>
  )
}

const FCOLS = [
  { h: 'Support', links: ['Security freeze', 'Fraud alert', 'Disputes', 'Denied credit', 'Identity theft victim assistance', 'Active duty military', 'Opt out of prescreen offers', 'Upload a document to Experian'] },
  { h: 'Education & advice', links: ['Credit report & scores', 'Fraud & identity theft', 'Banking', 'Credit cards', 'Loans', 'Insurance', 'Mortgage', 'Investing', 'Personal finance', 'News & research'] },
  { h: 'Credit resources', links: ['Free credit monitoring', 'Credit report & scores', '3-bureau reports & FICO® Scores', 'Check credit', 'Improve credit', 'Establish credit', 'Experian CreditLock', 'Annual credit report', 'Credit file disclosure', 'Credit score disclosure'] },
  { h: 'Experian for businesses', links: ['Business credit reports', 'Customer credit profiles', 'Decisioning software', 'Business fraud management', 'Healthcare solutions', 'Mortgage solutions', 'About Experian'] },
]
const PROMO = [
  { t: 'DOWNLOAD THE FREE EXPERIAN APP', l: 'Carry trusted financial tools with you' },
  { t: "EXPERIAN'S INCLUSION AND BELONGING", l: 'Learn more how Experian is committed' },
  { t: 'DATA PRIVACY', l: 'Your privacy choices' },
]
const LEGALLINKS = ['Legal terms & conditions', 'Privacy center', 'U.S. data privacy policy', 'Press', 'Ad choices', 'Careers', 'Investor relations', 'Contact us']

function Footer() {
  return (
    <footer style={{ background: 'var(--color-neutral-50)', borderTop: '1px solid var(--color-neutral-100)', paddingTop: 48 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, paddingBottom: 40 }}>
          {FCOLS.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-blue-600)', marginBottom: 16 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(l => <a key={l} className="lnk" style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '28px 0', borderTop: '1px solid var(--color-neutral-200)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {PROMO.map(p => (
              <div key={p.t} style={{ maxWidth: 200 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.04em', color: 'var(--color-neutral-800)', marginBottom: 3 }}>{p.t}</div>
                <a className="lnk" style={{ fontSize: 12.5, color: 'var(--color-blue-600)', fontWeight: 600 }}>{p.l}</a>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#00B67A', color: '#fff', padding: '5px 10px', borderRadius: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>★ Trustpilot</span>
              <span style={{ fontSize: 11, opacity: .9 }}>35.9K reviews</span>
            </div>
            <div style={{ display: 'flex', gap: 14, color: 'var(--color-neutral-700)' }}>
              <a className="lnk"><Social.fb /></a><a className="lnk"><Social.x /></a><a className="lnk"><Social.ig /></a><a className="lnk"><Social.yt /></a>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px 26px', flexWrap: 'wrap', padding: '22px 0', borderTop: '1px solid var(--color-neutral-200)' }}>
          {LEGALLINKS.map(l => <a key={l} className="lnk" style={{ fontSize: 12.5, color: 'var(--color-neutral-700)', fontWeight: 600 }}>{l}</a>)}
        </div>
        <div style={{ paddingBottom: 32 }}>
          <p style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginBottom: 12, fontWeight: 600 }}>© 2026 Experian. All rights reserved.</p>
          <p style={{ fontSize: 11.5, lineHeight: 1.65, color: 'var(--color-neutral-500)', maxWidth: 1000, marginBottom: 18 }}>
            Experian and the Experian trademarks used herein are trademarks or registered trademarks of Experian and its affiliates. The use of any other trade name, copyright, or trademark is for identification and reference purposes only and does not imply any association with the copyright or trademark holder of their product or brand. Other product and company names mentioned herein are the property of their respective owners.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Marketplace Licenses and Disclosures', 'Insurance State Licenses', 'Insurance Carrier Partner Details'].map(l => (
              <a key={l} className="lnk" style={{ fontSize: 12.5, color: 'var(--color-blue-600)', fontWeight: 600 }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function StickyBar() {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 130, background: '#fff', boxShadow: '0 -2px 14px rgba(13,13,31,.1)' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20, height: 72 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-800)' }}>Get your free credit report and FICO® Score</span>
        <Button variant="secondary" size="md" style={{ borderRadius: 6 }}>Sign in</Button>
        <Button variant="primary" size="md" style={{ background: 'var(--color-pink-400)', border: 'none', borderRadius: 6 }} onClick={() => window.location.assign('/register?step=phone')}>Sign up for free</Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div style={{ paddingBottom: 72 }}>
      <UtilityBar />
      <Nav />
      <Hero />
      <BFF />
      <Help />
      <Legal />
      <Footer />
      <StickyBar />
    </div>
  )
}
