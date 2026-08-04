'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Confetti, SuccessContent } from '../../components/Confetti'

const PINK = 'var(--color-pink-400)'

/* ─────────────── Icons ─────────────── */
const RIco = {
  lock: (p) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  chevR: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  info: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6.2v3.4M7 4.2v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bell: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3a6 6 0 016 6v3l1.5 3h-15L6 12V9a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9.5 18a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  menu: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  faster: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><g stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"><path d="M13 3v3M13 20v3M3 13h3M20 13h3M6 6l2 2M18 18l2 2M20 6l-2 2M8 18l-2 2"/></g></svg>,
  shieldCheck: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3l8 3v5.5c0 5-3.5 8.8-8 10.5-4.5-1.7-8-5.5-8-10.5V6l8-3z" stroke="#406EB3" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9.5 12.5l2.4 2.4L17 9.8" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  devices: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="7" y="3" width="12" height="20" rx="2.5" stroke="#406EB3" strokeWidth="1.8"/><path d="M11 19.5h4" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  user: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#406EB3" strokeWidth="1.8"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  lockBig: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="9" rx="2" stroke="#406EB3" strokeWidth="1.8"/><path d="M8 10V7.5a4 4 0 018 0V10" stroke="#406EB3" strokeWidth="1.8"/></svg>,
  snow: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><g stroke="#406EB3" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M12 3l-2 2m2-2l2 2M12 21l-2-2m2 2l2-2M4.2 7.5l.3 2.8M4.2 7.5l2.8-.3M19.8 16.5l-.3-2.8M19.8 16.5l-2.8.3M19.8 7.5l-.3 2.8M19.8 7.5l-2.8-.3M4.2 16.5l.3-2.8M4.2 16.5l2.8.3"/></g></svg>,
  car: () => <svg width="44" height="34" viewBox="0 0 50 38" fill="none"><rect x="6" y="16" width="38" height="13" rx="4" fill="#7FA8D9"/><path d="M11 16l4-7h20l4 7" stroke="#7FA8D9" strokeWidth="3" strokeLinejoin="round" fill="#A9C5E8"/><rect x="13" y="11" width="10" height="5" rx="1.5" fill="#F5A623"/><rect x="27" y="11" width="10" height="5" rx="1.5" fill="#F5A623"/><circle cx="15" cy="30" r="4" fill="#1E1E35"/><circle cx="35" cy="30" r="4" fill="#1E1E35"/></svg>,
  x: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
}

/* ─────────────── Benefit icons ─────────────── */
const BIco = {
  shield: () => <svg width="56" height="64" viewBox="0 0 56 64" fill="none"><path d="M28 3l22 8v16c0 14-9.6 24-22 30C15.6 51 6 41 6 27V11l22-8z" fill="url(#shg)"/><path d="M19 31l6.5 6.5L39 23" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="shg" x1="6" y1="3" x2="50" y2="61" gradientUnits="userSpaceOnUse"><stop stopColor="#BA2F7D"/><stop offset="1" stopColor="#8A1D60"/></linearGradient></defs></svg>,
  globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#00A651" strokeWidth="1.8"/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" stroke="#00A651" strokeWidth="1.6"/><path d="M14.5 14.5l2.5 2.5-1 2 2 1" stroke="#00A651" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="#00A651" strokeWidth="1.8"/><path d="M7.5 10.5V8a4.5 4.5 0 019 0v2.5" stroke="#00A651" strokeWidth="1.8"/><circle cx="12" cy="15.2" r="1.4" fill="#00A651"/></svg>,
  trend: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 16l5-5 3.5 3.5L20 7" stroke="#BA2F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 7h5v5" stroke="#BA2F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  report: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#406EB3" strokeWidth="1.8"/><rect x="9" y="2.5" width="6" height="3.5" rx="1.2" stroke="#406EB3" strokeWidth="1.8"/><path d="M9 11h6M9 14.5h4" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bolt: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" fill="#BA2F7D"/></svg>,
  bank: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5H4L12 3z" stroke="#406EB3" strokeWidth="1.8" strokeLinejoin="round"/><path d="M6 10v6M10 10v6M14 10v6M18 10v6M4 19.5h16" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"/></svg>,
}

/* ─────────────── Logo ─────────────── */
function RegLogo({ size = 30 }) {
  return (
    <div onClick={() => window.location.assign('/')} title="Back to homepage" style={{ cursor: 'pointer', width: 'fit-content', lineHeight: 0 }}>
      <img src="/uploads/Experian.png" alt="Experian" style={{ display: 'block', height: size * 1.2, width: 'auto' }} />
    </div>
  )
}

/* ─────────────── Benefit panel parts ─────────────── */
function MiniCard({ title, sub }) {
  return (
    <div className="mini-card" style={{ background: '#EDEDF6', borderRadius: 14, padding: '15px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="pulse-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-success-500)', flexShrink: 0 }} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>{title}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginTop: 6, marginLeft: 17 }}>{sub}</div>
    </div>
  )
}

function FeatureRow({ tile, icon, title, desc }) {
  return (
    <div className="feature-row" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div className="feature-tile" style={{ width: 46, height: 46, borderRadius: 12, background: tile, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
        <div className="feature-title" style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-neutral-900)', letterSpacing: '-.01em', lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--color-neutral-500)', lineHeight: 1.45 }}>{desc}</div>
      </div>
    </div>
  )
}

function SlideHead({ badge, title, sub }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
      <span style={{ display: 'inline-block', background: 'var(--color-pink-400)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.07em', padding: '5px 14px', borderRadius: 9999, marginBottom: 18, whiteSpace: 'nowrap' }}>{badge}</span>
      <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.18 }}>{title}</h2>
      <p style={{ fontSize: 14.5, color: 'var(--color-neutral-600)', lineHeight: 1.5, marginTop: 14, maxWidth: 520, marginInline: 'auto' }}>{sub}</p>
    </div>
  )
}

function BenefitProtection() {
  return (
    <>
      <SlideHead badge="ALWAYS ON" title={<>Protection that never sleeps<br/>watching 24/7</>} sub={<>We scan the dark web, monitor your credit file, and put you<br/>back in control the instant anything looks wrong - all free.</>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 16, margin: '40px auto 0', maxWidth: 560, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MiniCard title="Dark web scan" sub="Free scan included" />
          <MiniCard title="Fraud alert" sub="1-year protection" />
        </div>
        <div style={{ background: '#E3E3F2', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '22px 14px', gap: 14 }}>
          <div className="shield-float"><BIco.shield /></div>
          <div style={{ fontSize: 12.5, color: 'var(--color-neutral-600)', textAlign: 'center', lineHeight: 1.4 }}>All system clear not threat detected</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MiniCard title="Credit freeze" sub="One tap , instant" />
          <MiniCard title="Dispute center" sub="Fix error free" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '42px auto 0', maxWidth: 600 }}>
        <FeatureRow tile="#E7F7EE" icon={<BIco.globe />} title="Free dark web scan" desc="Scan for your SSN, phone number , and email instantly" />
        <FeatureRow tile="#E7F7EE" icon={<BIco.lock />} title="Credit freeze & fraud alert" desc="Block new accounts or add a warning - both free both instant" />
      </div>
    </>
  )
}

function PinkGauge({ score = 724, size = 300 }) {
  const [draw, setDraw] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDraw(true), 80); return () => clearTimeout(t) }, [])
  const cx = size / 2, strokeW = 26, r = (size - strokeW) / 2 - 2, arcY = size * 0.55
  const MIN = 300, MAX = 850, circ = Math.PI * r, pct = (score - MIN) / (MAX - MIN)
  const startX = cx - r, endX = cx + r
  const path = `M ${startX} ${arcY} A ${r} ${r} 0 0 1 ${endX} ${arcY}`
  const labels = ['Fair', 'Good', 'Very Good', 'Exceptional']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18 }}>
      <svg width={size} height={arcY + 26} style={{ overflow: 'visible' }}>
        <path d={path} fill="none" stroke="#D9D9DE" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={path} fill="none" stroke="var(--color-pink-400)" strokeWidth={strokeW} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={draw ? circ * (1 - pct) : circ} style={{ transition: 'stroke-dashoffset 1.2s var(--ease-default)' }} />
        <text x={cx} y={arcY - 26} textAnchor="middle" fill="var(--color-neutral-800)" fontSize="58" fontWeight="800" fontFamily="var(--font-sans)" style={{ opacity: draw ? 1 : 0, transition: 'opacity .6s ease .3s' }}>{score}</text>
      </svg>
      <span className="pop-in" style={{ background: 'var(--color-pink-400)', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '.06em', padding: '4px 16px', borderRadius: 9999, marginTop: -6 }}>GOOD</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
        {labels.map((l, i) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: 'var(--color-neutral-600)', fontWeight: 500 }}>{l}</span>
            {i < labels.length - 1 && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-neutral-300)', display: 'inline-block' }} />}
          </span>
        ))}
      </div>
    </div>
  )
}

function BenefitFico() {
  return (
    <>
      <SlideHead badge="FREE FOREVER" title={<>Know your real FICO Score<br/>the one lenders actually use</>} sub={<>Get your free Experian credit report and FICO Score 8, the same<br/>score 90% of top lenders use, updated daily at no cost.</>} />
      <PinkGauge score={724} size={300} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '40px auto 0', maxWidth: 600 }}>
        <FeatureRow tile="#FAE9F2" icon={<BIco.trend />} title="Daily score updates" desc="See changes the moment they happen , no surprises" />
        <FeatureRow tile="#EBF1FA" icon={<BIco.report />} title="Free Experian credit report" desc="Full report, dispute inaccuracies for free anytime" />
      </div>
    </>
  )
}

function BoostChart() {
  const [draw, setDraw] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDraw(true), 140); return () => clearTimeout(t) }, [])
  const W = 600, H = 300, padL = 44, padR = 20, padT = 20, padB = 34
  const days = ['Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22']
  const yMax = 45
  const x = i => padL + (W - padL - padR) * (i / (days.length - 1))
  const y = v => padT + (H - padT - padB) * (1 - v / yMax)
  const boost = [2, 5, 6, 8, 9, 12, 15, 18, 22, 28, 28]
  const base = [2, 1, 3, 4, 5, 6, 7, 9, 11, 15, 19]
  const base2 = [2, 1, 2, 3, 4, 5, 6, 7, 8, 11, 14]
  const line = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ')
  const area = `${line(boost)} L ${x(boost.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`
  const markX = x(8)
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 18px 10px', boxShadow: 'var(--shadow-sm)', maxWidth: 600, margin: '24px auto 0' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].map(v => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="#EEE" strokeWidth="1" strokeDasharray="3 4" />
            <text x={padL - 8} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="#B3B3C4" fontFamily="var(--font-sans)">{v}</text>
          </g>
        ))}
        <defs><linearGradient id="bArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BA2F7D" stopOpacity="0.18" /><stop offset="1" stopColor="#BA2F7D" stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill="url(#bArea)" style={{ opacity: draw ? 1 : 0, transition: 'opacity .9s ease .5s' }} />
        <line x1={markX} y1={padT} x2={markX} y2={H - padB} stroke="#BA2F7D" strokeWidth="1.4" strokeDasharray="4 4" style={{ opacity: draw ? 1 : 0, transition: 'opacity .5s ease .8s' }} />
        <path d={line(base)} fill="none" stroke="#9A9AAE" strokeWidth="1.6" strokeDasharray="5 4" style={{ opacity: draw ? 1 : 0, transition: 'opacity .8s ease .3s' }} />
        <path d={line(base2)} fill="none" stroke="#BFBFD0" strokeWidth="1.6" strokeDasharray="5 4" style={{ opacity: draw ? 1 : 0, transition: 'opacity .8s ease .3s' }} />
        <path d={line(boost)} fill="none" stroke="var(--color-pink-400)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1500" strokeDashoffset={draw ? 0 : 1500} style={{ transition: 'stroke-dashoffset 1.5s var(--ease-default)' }} />
        {boost.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.4" fill="var(--color-pink-400)" style={{ opacity: draw ? 1 : 0, transition: `opacity .3s ease ${0.5 + i * 0.09}s` }} />)}
        {base.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill="#9A9AAE" style={{ opacity: draw ? 1 : 0, transition: 'opacity .6s ease .3s' }} />)}
        <g transform={`translate(${markX - 44}, ${y(25) - 30})`} style={{ opacity: draw ? 1 : 0, transform: draw ? `translate(${markX - 44}px, ${y(25) - 30}px) scale(1)` : `translate(${markX - 44}px, ${y(25) - 30}px) scale(.4)`, transformOrigin: `${markX}px ${y(25) - 18}px`, transition: 'opacity .4s ease 1s, transform .5s cubic-bezier(.34,1.56,.64,1) 1s' }}>
          <rect width="88" height="24" rx="12" fill="var(--color-pink-400)" />
          <text x="44" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="var(--font-sans)">Boost added</text>
        </g>
        {days.map((d, i) => <text key={d} x={x(i)} y={H - padB + 18} textAnchor="middle" fontSize="9.5" fill="#9A9AAE" fontFamily="var(--font-sans)">{d}</text>)}
      </svg>
    </div>
  )
}

function BenefitBoost() {
  return (
    <>
      <SlideHead badge="EXPERIAN BOOST" title={<>Raise your score just by paying<br/>the bills you already pay</>} sub={<>Connect your bank account and we'll find rent, utilities streaming,<br/>and phone payments that can lift your FICO Score instantly.</>} />
      <BoostChart />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '34px auto 0', maxWidth: 600 }}>
        <FeatureRow tile="#FAE9F2" icon={<BIco.bolt />} title="Instant results in minutes" desc="Cell phones utilities rent, streaming - they all count" />
        <FeatureRow tile="#EBF1FA" icon={<BIco.bank />} title="Smart Money checking" desc="No monthly fee. $50 bonus with direct deposits" />
      </div>
    </>
  )
}

function BenefitPanel({ slide, setSlide }) {
  const slides = [<BenefitProtection key="p" />, <BenefitFico key="f" />, <BenefitBoost key="b" />]
  const [shown, setShown] = useState(slide)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    if (slide === shown) return
    setVis(false)
    const t = setTimeout(() => { setShown(slide); setVis(true) }, 240)
    return () => clearTimeout(t)
  }, [slide])
  return (
    <div style={{ background: '#F4F4FB', borderRadius: 28, padding: '56px 48px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px) scale(.99)', transition: 'opacity .28s var(--ease-default), transform .28s var(--ease-default)', willChange: 'opacity, transform' }}>
          {slides[shown]}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 30 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {[0, 1, 2].map(i => (
            <button key={i} className="dotbtn" onClick={() => setSlide(i)} style={{ border: 'none', cursor: 'pointer', height: 6, width: 34, borderRadius: 9999, background: i <= slide ? 'var(--color-pink-400)' : '#DADAE3' }} />
          ))}
        </div>
        <span style={{ fontSize: 13, color: 'var(--color-neutral-500)', fontWeight: 600 }}>{slide + 1}/3</span>
      </div>
    </div>
  )
}

/* ─────────────── Auth steps ─────────────── */
function SolidBtn({ children, disabled, onClick }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ width: '100%', border: 'none', borderRadius: 8, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer', color: '#fff', background: disabled ? 'var(--color-pink-100)' : PINK, transition: 'background .15s' }}>
      {children}
    </button>
  )
}

function AuthPhone({ onNext }) {
  const [v, setV] = useState('')
  const [focus, setFocus] = useState(false)
  const float = focus || v !== ''
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.12, marginTop: 54 }}>See your free<br />credit score.</h1>
      <p style={{ fontSize: 15, color: 'var(--color-neutral-600)', lineHeight: 1.5, marginTop: 18 }}>Join 100 million people who trust Experian to understand protect and improve their financial health.</p>
      <div style={{ position: 'relative', marginTop: 40 }}>
        <label style={{ position: 'absolute', left: 15, pointerEvents: 'none', whiteSpace: 'nowrap', top: float ? 9 : '50%', transform: float ? 'none' : 'translateY(-50%)', fontSize: float ? 11 : 15, fontWeight: float ? 700 : 400, color: focus ? PINK : 'var(--color-neutral-500)', transition: 'top .15s var(--ease-default), font-size .15s var(--ease-default), color .15s' }}>Mobile number</label>
        <input value={v} onChange={e => setV(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} inputMode="tel"
          style={{ width: '100%', height: 58, border: `1.5px solid ${focus ? PINK : 'var(--color-neutral-200)'}`, borderRadius: 8, padding: float ? '22px 15px 0' : '0 15px', fontSize: 15, fontFamily: 'inherit', color: 'var(--color-neutral-800)', outline: 'none', transition: 'border-color .15s' }} />
      </div>
      <div style={{ marginTop: 14 }}><SolidBtn disabled={!v.trim()} onClick={onNext}>Get started</SolidBtn></div>
      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 22 }}>Already have an account ? <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Sign in</a></div>
      <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', lineHeight: 1.55, textAlign: 'center', marginTop: 26 }}>
        By continuing you agree to our <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Terms of Use</a> and <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Privacy Policy</a>. Standard message rates may apply.</p>
    </div>
  )
}

function AuthOtp({ onNext }) {
  const [d, setD] = useState(['', '', '', '', '', ''])
  const refs = useRef([])
  const full = d.every(x => x !== '')
  const set = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const nd = [...d]; nd[i] = val; setD(nd)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }
  const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus() }
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.12, marginTop: 70 }}>Check your text<br />messages</h1>
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', marginTop: 14 }}>We have sent to code to *** *** *687</p>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 40, marginBottom: 14 }}>Enter your 6 digit code</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {d.map((x, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={x} onChange={e => set(i, e.target.value)} onKeyDown={e => key(i, e)} inputMode="numeric" maxLength={1}
            style={{ width: 52, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700, border: `1px solid ${x ? PINK : 'var(--color-neutral-300)'}`, borderRadius: 8, fontFamily: 'inherit', color: 'var(--color-neutral-800)', outline: 'none' }} />
        ))}
      </div>
      <div style={{ marginTop: 18 }}><SolidBtn disabled={!full} onClick={onNext}>Confirm Code</SolidBtn></div>
      <div style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 22 }}>Didn&#39;t receive code ? <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Resend</a></div>
    </div>
  )
}

function PasskeyRow({ icon, title, desc }) {
  return (
    <div className="intro-rise" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--color-neutral-800)' }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--color-neutral-600)', lineHeight: 1.45, marginTop: 3 }}>{desc}</div>
      </div>
    </div>
  )
}

function AuthPasskey({ onNext }) {
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', marginTop: 70 }}>Setup Passkey</h1>
      <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', marginTop: 14 }}>Passkeys make it easy to login.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 38 }}>
        <PasskeyRow icon={<RIco.faster />} title="Login Faster" desc="Unlike passwords, passkeys don't need to be remembered." />
        <PasskeyRow icon={<RIco.shieldCheck />} title="Enhanced Security" desc="Passkeys provide the strongest level of protection against phishing." />
        <PasskeyRow icon={<RIco.devices />} title="Multi-Device Support" desc="Passkeys can be accessed across different devices seamlessly." />
      </div>
      <div style={{ marginTop: 46 }}><SolidBtn onClick={onNext}>Add Passkey</SolidBtn></div>
      <div style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 24 }}>Don&#39;t want to use a passkey? <a onClick={onNext} style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Skip for now</a></div>
    </div>
  )
}

/* ─────────────── Dashboard ─────────────── */
function DashNav() {
  const items = ['Dashboard', 'My Score', 'Credit Report', 'Protect', 'Offers']
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--color-neutral-100)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px', height: 80, display: 'flex', alignItems: 'center' }}>
        <RegLogo size={24} />
        <nav style={{ display: 'flex', gap: 38, flex: 1, justifyContent: 'center' }}>
          {items.map((n, i) => (
            <div key={n} style={{ position: 'relative', fontSize: 16, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-600)', cursor: 'pointer', paddingBottom: 4 }}>
              {n}
              {i === 0 && <div style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 2.5, background: PINK, borderRadius: 2 }} />}
            </div>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, color: 'var(--color-neutral-700)' }}>
          <div style={{ position: 'relative' }}>
            <RIco.bell />
            <span style={{ position: 'absolute', top: -6, right: -7, background: PINK, color: '#fff', fontSize: 10, fontWeight: 700, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
          </div>
          <RIco.menu style={{ color: 'var(--color-blue-600)' }} />
        </div>
      </div>
    </header>
  )
}

function StepDot({ state }) {
  const bg = state === 'done' ? 'var(--color-success-500)' : state === 'active' ? PINK : 'transparent'
  const border = state === 'todo' ? '2px solid var(--color-neutral-300)' : 'none'
  return <span style={{ width: 16, height: 16, borderRadius: '50%', background: bg, border, flexShrink: 0, display: 'inline-block' }} />
}

function SetupProgress({ unlocked }) {
  const steps = [['Account created', 'done', 'done'], ['Phone verified', 'done', 'done'], ['Confirm identity', 'active', 'done'], ['Score & report revealed', 'todo', 'done']]
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--color-neutral-500)', marginBottom: 16 }}>SETUP PROGRESS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map(([label, locked, done]) => {
          const state = unlocked ? done : locked
          const txtColor = state === 'active' ? PINK : state === 'todo' ? 'var(--color-neutral-400)' : 'var(--color-neutral-700)'
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <StepDot state={state} />
              <span style={{ fontSize: 14.5, fontWeight: state === 'active' ? 700 : 600, color: txtColor, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Benefits({ unlocked }) {
  const active = ['Credit monitoring', 'Credit report', 'Experian Boost®']
  const locked = ['Exact FICO® Score', 'Score history', 'Dark web scan']
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--color-neutral-500)', marginBottom: 16 }}>BENEFITS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {active.map(b => (
          <div key={b} style={{ background: '#EAF1FA', borderRadius: 8, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600, color: 'var(--color-neutral-800)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success-500)' }} />{b}
          </div>
        ))}
        {locked.map(b => (
          <div key={b} data-lock="1" style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: unlocked ? 'var(--color-neutral-800)' : 'var(--color-neutral-400)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>{unlocked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success-500)' }} />}{b}</span>
            {!unlocked && <RIco.lock style={{ color: 'var(--color-neutral-400)' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreTrack() {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', position: 'relative' }}>
        {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 7, borderRadius: 9999, background: i < 4 ? 'var(--color-success-500)' : 'var(--color-neutral-200)' }} />)}
        <div style={{ position: 'absolute', left: '76%', top: '50%', transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: 'var(--color-success-500)', border: '3px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12.5, color: 'var(--color-neutral-500)', fontWeight: 600 }}>
        <span>300</span><span>579</span><span>669</span><span>739</span><span>799</span><span>850</span>
      </div>
    </div>
  )
}

function CreditCard({ unlocked }) {
  const blur = unlocked ? 'none' : 'blur(9px)'
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 14, padding: '24px 26px' }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--color-neutral-900)', marginBottom: 18 }}>Credit</div>
      <div style={{ display: 'flex', gap: 36, borderBottom: '1px solid var(--color-neutral-100)', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 12, borderBottom: '2px solid var(--color-blue-600)', fontSize: 15, fontWeight: 700, color: 'var(--color-blue-600)' }}>
          <span style={{ fontSize: 13 }}>⊞</span> Experian
        </div>
        <div data-lock="1" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-400)' }}>Equifax <RIco.lock /></div>
        <div data-lock="1" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 12, fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-400)' }}>TransUnion <RIco.lock /></div>
      </div>
      <div style={{ border: '1px solid var(--color-neutral-100)', borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-blue-600)', letterSpacing: '.02em', whiteSpace: 'nowrap' }}>FICO<span style={{ color: 'var(--color-neutral-400)' }}>SCORE 8</span> <RIco.info style={{ color: 'var(--color-neutral-300)', display: 'inline' }} /></span>
          <span style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>Experian Data Dec 24, 2020</span>
        </div>
        <div data-lock="1" style={{ fontSize: 66, fontWeight: 800, color: 'var(--color-neutral-900)', lineHeight: 1.05, margin: '6px 0 2px', filter: blur, userSelect: 'none' }}>755</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 4px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '5px 14px', fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-700)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success-500)' }} />VERY GOOD</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><span style={{ background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '4px 11px', fontSize: 12.5, fontWeight: 800, color: 'var(--color-neutral-700)', whiteSpace: 'nowrap' }}>+7 POINTS</span><span style={{ color: 'var(--color-neutral-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', whiteSpace: 'nowrap' }}>What&#39;s changed <RIco.chevR /></span></span>
        </div>
        <ScoreTrack />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 22 }}>
        {[['TOTAL DEBT', '$496,245', '$500', '#1E1E35'], ['CREDIT USAGE', '14%', '$500', '#C62828']].map(([l, v, tag, tagc]) => (
          <div key={l}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.06em', color: 'var(--color-neutral-500)' }}>{l}</div>
            <div data-lock="1" style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-neutral-400)', margin: '4px 0 8px', filter: blur, userSelect: 'none' }}>{v}</div>
            <span style={{ background: tagc, color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 5, padding: '3px 9px' }}>{tag}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 22, paddingTop: 18 }}>
        <span data-lock="1" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 700, color: PINK, cursor: 'pointer' }}>See your report <RIco.lock /></span>
      </div>
    </div>
  )
}

function AutoCard() {
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 14, padding: '24px 26px', marginTop: 24 }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--color-neutral-900)', marginBottom: 18 }}>Auto</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <RIco.car />
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Unlock your auto insurance savings</div>
          <div style={{ fontSize: 14, color: 'var(--color-neutral-500)', marginTop: 2 }}>This is the description</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 18, paddingTop: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: PINK, cursor: 'pointer' }}>See your options</span>
      </div>
    </div>
  )
}

function ProtectionCard() {
  const rows = [['COVERAGE', <RIco.user key="u" />, '#EAF1FA'], ['EXPERIAN CREDITLOCK', <RIco.lockBig key="l" />, '#EAF1FA'], ['SECURITY FREEZE', <RIco.snow key="s" />, '#EAF1FA']]
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 14, padding: '24px 26px' }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--color-neutral-900)', marginBottom: 18 }}>Protection</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(([label, icon]) => (
          <div key={label} style={{ background: 'var(--color-neutral-50)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.06em', color: 'var(--color-neutral-500)', whiteSpace: 'nowrap' }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-neutral-900)', margin: '4px 0 2px' }}>Locked</div>
              <span data-lock="1" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 600, color: PINK, cursor: 'pointer' }}>Unlock <RIco.lock /></span>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 5px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 18, paddingTop: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: PINK, cursor: 'pointer' }}>Go to Protection</span>
      </div>
    </div>
  )
}

function MoneyCard({ unlocked }) {
  const blur = unlocked ? 'none' : 'blur(9px)'
  return (
    <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 14, padding: '24px 26px', marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 21, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Money</span>
        <span style={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>Accounts <span style={{ background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '2px 9px', fontWeight: 700, marginLeft: 4 }}>1</span></span>
      </div>
      <div data-lock="1" style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-neutral-400)', filter: blur, userSelect: 'none' }}>$1,587</div>
      <div style={{ fontSize: 13.5, color: 'var(--color-neutral-500)', marginTop: 2, marginBottom: 18 }}>July cash flow</div>
      {[['Income', '#88D4A8', '82%', '$10,120'], ['Expense', '#EF9A9A', '62%', '$8,500']].map(([l, c, w, v]) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 13.5, color: 'var(--color-neutral-600)', width: 56 }}>{l}</span>
          <div style={{ flex: 1, height: 8, borderRadius: 9999, background: 'var(--color-neutral-100)' }}><div style={{ width: w, height: '100%', borderRadius: 9999, background: c }} /></div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-neutral-400)', filter: blur, userSelect: 'none', width: 54, textAlign: 'right' }}>{v}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 14, paddingTop: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: PINK, cursor: 'pointer' }}>See details</span>
      </div>
    </div>
  )
}

function Dashboard({ unlocked, onGetStarted }) {
  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <DashNav />
      <div className={unlocked ? undefined : 'dash-locked'} onClickCapture={unlocked ? undefined : (e) => { if (e.target.closest('[data-lock]')) onGetStarted() }} style={{ maxWidth: 1320, margin: '0 auto', padding: '44px 40px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-neutral-900)', letterSpacing: '-.01em' }}>Hi, Good Morning{unlocked ? ' David' : ''} !</h1>
        <p style={{ fontSize: 16, color: 'var(--color-neutral-500)', marginTop: 6 }}>Take a look at the big picture of your credit.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 28, marginTop: 34, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <SetupProgress unlocked={unlocked} />
            <Benefits unlocked={unlocked} />
          </div>
          <div>
            {!unlocked && (
              <div style={{ background: PINK, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>Complete identity verification to see your score</span>
                <button onClick={onGetStarted} style={{ background: '#fff', color: PINK, border: 'none', borderRadius: 8, padding: '13px 26px', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' }}>Get Started</button>
              </div>
            )}
            <CreditCard unlocked={unlocked} />
            <AutoCard />
          </div>
          <div>
            <ProtectionCard />
            <MoneyCard unlocked={unlocked} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Identity drawer ─────────────── */
function FloatField({ label, value: initial = '', hint, hintLink, select, className }) {
  const [val, setVal] = useState(initial)
  const [focus, setFocus] = useState(false)
  const float = focus || val !== ''
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <div style={{ position: 'relative' }}>
        <label style={{ position: 'absolute', left: 14, pointerEvents: 'none', whiteSpace: 'nowrap', top: float ? 9 : '50%', transform: float ? 'none' : 'translateY(-50%)', fontSize: float ? 11 : 14.5, fontWeight: float ? 700 : 500, color: focus ? PINK : 'var(--color-neutral-500)', letterSpacing: float ? '.01em' : '0', transition: 'top .15s var(--ease-default), font-size .15s var(--ease-default), color .15s' }}>{label}</label>
        <input value={val} onChange={e => setVal(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: '100%', height: 58, border: `1.5px solid ${focus ? PINK : 'var(--color-neutral-200)'}`, background: '#fff', borderRadius: 8, padding: float ? '22px 14px 0' : '0 14px', fontSize: 14.5, fontFamily: 'inherit', color: 'var(--color-neutral-800)', outline: 'none', transition: 'border-color .15s' }} />
        {select && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-500)', fontSize: 11, pointerEvents: 'none' }}>▲▼</span>}
      </div>
      {hint && <div style={{ marginTop: 5, marginLeft: 2, fontSize: 12, color: hintLink ? 'var(--color-blue-400)' : 'var(--color-neutral-400)', cursor: hintLink ? 'pointer' : 'default' }}>{hint}</div>}
    </div>
  )
}

function SsnBody({ onClose, onContinue }) {
  const [d, setD] = useState(['', '', '', ''])
  const refs = useRef([])
  const full = d.every(x => x !== '')
  const set = (i, v) => { if (!/^\d?$/.test(v)) return; const nd = [...d]; nd[i] = v; setD(nd); if (v && i < 3) refs.current[i + 1]?.focus() }
  const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus() }
  const box = { width: 50, height: 58, textAlign: 'center', fontSize: 22, fontWeight: 700, border: '1.5px solid var(--color-neutral-300)', borderRadius: 8, fontFamily: 'inherit', color: 'var(--color-neutral-800)', outline: 'none' }
  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '34px 40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Verify your identity</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-700)' }}><RIco.x /></button>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', marginTop: 8, lineHeight: 1.55 }}>To keep your account secure, confirm the last 4 digits of your Social Security number. We&#39;ll use it to securely pull your credit profile.</p>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 40, marginBottom: 14 }}>Last 4 digits of your Social Security number</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {d.map((x, i) => (
            <input key={i} ref={el => refs.current[i] = el} value={x} onChange={e => set(i, e.target.value)} onKeyDown={e => key(i, e)} inputMode="numeric" maxLength={1}
              style={{ ...box, borderColor: x ? PINK : 'var(--color-neutral-300)' }} />
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <a style={{ fontSize: 13, color: 'var(--color-blue-400)', cursor: 'pointer' }}>Why do we need this?</a>
        </div>
      </div>
      <div style={{ padding: '18px 40px 26px', borderTop: '1px solid var(--color-neutral-100)' }}>
        <button onClick={full ? onContinue : undefined} disabled={!full} style={{ width: '100%', border: 'none', borderRadius: 8, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', background: full ? PINK : 'var(--color-pink-100)', color: '#fff', cursor: full ? 'pointer' : 'default', transition: 'background .15s' }}>Continue</button>
      </div>
    </>
  )
}

function LoadingBody() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 40, textAlign: 'center' }}>
      <div className="exp-spinner" />
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Verifying your identity</div>
        <div style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', marginTop: 8, maxWidth: 300, lineHeight: 1.55 }}>We&#39;re securely matching your details with the credit bureaus. This only takes a moment.</div>
      </div>
    </div>
  )
}

function FoundBody({ onClose, onVerify }) {
  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '34px 40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Here&#39;s what we found</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-700)' }}><RIco.x /></button>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', marginTop: 8 }}>Make sure everything looks correct and edit anything that needs updating.</p>
        <div style={{ fontSize: 16, fontWeight: 800, color: PINK, marginTop: 26, marginBottom: 18 }}>About you</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="intro-rise" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <FloatField label="First name" value="Robert" />
            <FloatField label="Last name" value="Ross" />
          </div>
          <div className="intro-rise" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <FloatField label="Date of birth" hint="MM/DD/YYYY" value="08/23/1983" />
            <FloatField label="Phone number" />
          </div>
          <div className="intro-rise" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 18 }}>
            <FloatField label="Street address" value="732 Capouse Ave" />
            <FloatField label="Apt, unit, etc." />
          </div>
          <div className="intro-rise" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.3fr 0.9fr', gap: 18 }}>
            <FloatField label="ZIP code" value="18503" />
            <FloatField label="City" value="Scranton" />
            <FloatField label="State" value="UT" select />
          </div>
          <FloatField className="intro-rise" label="Social Security number" value="XXX-XX-4237" hint="Why do we need this?" hintLink />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: PINK, marginTop: 28, marginBottom: 18 }}>Create your account</div>
        <FloatField className="intro-rise" label="Email" />
      </div>
      <div style={{ padding: '18px 40px 26px', borderTop: '1px solid var(--color-neutral-100)' }}>
        <button onClick={onVerify} style={{ width: '100%', border: 'none', borderRadius: 8, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', background: PINK, color: '#fff', cursor: 'pointer' }}>Verify your identity</button>
      </div>
    </>
  )
}

function IdentityDrawer({ open, onClose, onVerify }) {
  const [phase, setPhase] = useState('found')
  useEffect(() => { if (open) setPhase('found') }, [open])
  return (
    <>
      <div onClick={phase === 'celebrate' ? undefined : onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(40,40,70,.45)', zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .25s' }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 560, maxWidth: '92vw', background: '#fff', zIndex: 201, boxShadow: '-8px 0 40px rgba(0,0,0,.18)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s var(--ease-default)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {phase === 'found' && <FoundBody onClose={onClose} onVerify={() => setPhase('celebrate')} />}
        {phase === 'celebrate' && (
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, overflow: 'hidden' }}>
            <Confetti />
            <SuccessContent onDone={onVerify} />
          </div>
        )}
      </aside>
    </>
  )
}

/* ─────────────── Root app ─────────────── */
function ResetBtn({ setStep }) {
  return (
    <button onClick={() => { if (typeof localStorage !== 'undefined') localStorage.removeItem('exp_reg_step'); setStep('phone') }}
      style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 300, background: 'var(--color-neutral-800)', color: '#fff', border: 'none', borderRadius: 9999, padding: '8px 16px', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: .55 }}>↺ Restart flow</button>
  )
}

function RegisterApp() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState('phone')
  const [slide, setSlide] = useState(0)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const p = searchParams.get('step')
    if (p) {
      setStep(p)
    } else if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('exp_reg_step')
      if (saved) setStep(saved)
    }
    if (searchParams.get('drawer') === '1') setDrawer(true)
  }, [])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('exp_reg_step', step)
  }, [step])

  useEffect(() => {
    if (step === 'otp') setSlide(1)
    else if (step === 'passkey') setSlide(2)
    else if (step === 'phone') setSlide(0)
  }, [step])

  useEffect(() => {
    if (step === 'dash-locked') { const t = setTimeout(() => setDrawer(true), 650); return () => clearTimeout(t) }
  }, [step])

  const isAuth = ['phone', 'otp', 'passkey'].includes(step)

  if (isAuth) {
    return (
      <div style={{ minHeight: '100vh', padding: 24, background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.32fr 1fr', gap: 0, maxWidth: 1340, margin: '0 auto', minHeight: 'calc(100vh - 48px)' }}>
          <BenefitPanel slide={slide} setSlide={setSlide} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 56px' }}>
            {step === 'phone' && <AuthPhone onNext={() => setStep('otp')} />}
            {step === 'otp' && <AuthOtp onNext={() => setStep('passkey')} />}
            {step === 'passkey' && <AuthPasskey onNext={() => setStep('dash-locked')} />}
          </div>
        </div>
        <ResetBtn setStep={setStep} />
      </div>
    )
  }

  const unlocked = step === 'dash-unlocked'
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Dashboard unlocked={unlocked} onGetStarted={() => setDrawer(true)} />
      <IdentityDrawer open={drawer} onClose={() => setDrawer(false)} onVerify={() => { setDrawer(false); setStep('dash-unlocked') }} />
      <ResetBtn setStep={setStep} />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterApp />
    </Suspense>
  )
}
