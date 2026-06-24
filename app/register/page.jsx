'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const PINK = 'var(--color-pink-400)'

/* ───────────────── Icons ───────────────── */
const RIco = {
  lock: (p) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  chevR: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  info: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6.2v3.4M7 4.2v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bell: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3a6 6 0 016 6v3l1.5 3h-15L6 12V9a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9.5 18a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  menu: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  faster: () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><g stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"><path d="M13 4v3M13 19v3M4 13H1M25 13h-3M6.3 6.3L4.2 4.2M21.8 21.8l-2.1-2.1M6.3 19.7l-2.1 2.1M21.8 4.2l-2.1 2.1"/></g><circle cx="13" cy="13" r="5" stroke="#406EB3" strokeWidth="1.8"/></svg>,
}

/* ───────────────── Benefit icons ───────────────── */
const BIco = {
  shield: () => <svg width="72" height="72" viewBox="0 0 72 72" fill="none"><path d="M36 8l22 8v18c0 14-10 24-22 28C24 58 14 48 14 34V16l22-8z" fill="#BA2F7D" opacity=".15"/><path d="M36 8l22 8v18c0 14-10 24-22 28C24 58 14 48 14 34V16l22-8z" stroke="#BA2F7D" strokeWidth="2.5" strokeLinejoin="round"/><path d="M26 36l7 7 13-14" stroke="#BA2F7D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  globe: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M2 10h16M10 2c-2.4 3-3.5 5-3.5 8s1.1 5 3.5 8M10 2c2.4 3 3.5 5 3.5 8s-1.1 5-3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  lock: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="currentColor" strokeWidth="1.5"/></svg>,
  trend: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 14l5-6 4 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 4h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  report: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2.5h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1v-14a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6.5 11h7M6.5 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bolt: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 2L4 11h6l-2 7 10-9h-6l2-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  bank: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 17h16M3 8.5h14M10 3L2 8h16L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 9v8M10 9v8M15 9v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
}

/* ───────────────── Benefit panel parts ───────────────── */
function MiniCard({ title, sub }) {
  return (
    <div className="mini-card" style={{ background: '#fff', borderRadius: 12, padding: '13px 14px', boxShadow: '0 2px 8px rgba(38,71,141,.08)' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-800)', marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: 'var(--color-neutral-500)' }}>{sub}</div>
    </div>
  )
}
function FeatureRow({ tile, icon, title, desc }) {
  return (
    <div className="feature-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div className="feature-tile" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: tile, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-600)' }}>{icon}</div>
      <div>
        <div className="feature-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-800)', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', lineHeight: 1.45 }}>{desc}</div>
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

/* ───────────────── Auth steps ───────────────── */
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
          style={{ width: '100%', border: `1.5px solid ${focus ? PINK : 'var(--color-neutral-200)'}`, borderRadius: 8, padding: '24px 15px 8px', fontSize: 15, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color .15s' }} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-neutral-500)', lineHeight: 1.5, marginTop: 14, marginBottom: 20 }}>
        By continuing you agree to receive a one-time verification code to this number via SMS. Standard message and data rates may apply.
      </p>
      <SolidBtn disabled={v.replace(/\D/g, '').length < 10} onClick={() => onNext('otp', v)}>Continue</SolidBtn>
      <div style={{ marginTop: 22, textAlign: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--color-neutral-600)' }}>Already have an account? </span>
        <a className="lnk" style={{ fontSize: 14, fontWeight: 700, color: PINK }}>Sign in</a>
      </div>
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-neutral-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
          <RIco.lock style={{ color: 'var(--color-neutral-400)' }} />
          <span style={{ fontSize: 12, color: 'var(--color-neutral-500)', fontWeight: 600 }}>Your information is protected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, background: 'var(--color-neutral-50)', borderRadius: 10, overflow: 'hidden' }}>
          {[['256-bit\nEncryption', '#EBF1FA', '#26478D'], ['Bank-level\nSecurity', '#F5EBF9', '#632678'], ['No credit\ncard needed', '#FAE9F2', '#BA2F7D']].map(([label, bg, color]) => (
            <div key={label} style={{ flex: 1, background: bg, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, whiteSpace: 'pre-line', color, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OTPInput({ length = 6, onChange }) {
  const [vals, setVals] = useState(Array(length).fill(''))
  const refs = useRef([])
  const set = (i, v) => {
    if (!/^\d?$/.test(v)) return
    const next = [...vals]; next[i] = v; setVals(next)
    onChange(next.join(''))
    if (v && i < length - 1) refs.current[i + 1]?.focus()
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus()
  }
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {vals.map((v, i) => (
        <input key={i} ref={el => refs.current[i] = el} value={v} maxLength={1} inputMode="numeric"
          onChange={e => set(i, e.target.value)} onKeyDown={e => onKey(i, e)}
          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700, fontFamily: 'inherit', border: `1.5px solid ${v ? PINK : 'var(--color-neutral-200)'}`, borderRadius: 8, outline: 'none', background: '#fff', transition: 'border-color .12s' }} />
      ))}
    </div>
  )
}

function AuthOTP({ phone, onNext, onBack }) {
  const [code, setCode] = useState('')
  const [resent, setResent] = useState(false)
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-neutral-500)', fontSize: 13, fontWeight: 600, marginTop: 24, padding: 0, fontFamily: 'inherit' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.15, marginTop: 36 }}>Enter your<br />verification code</h1>
      <p style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', lineHeight: 1.5, marginTop: 14, marginBottom: 32 }}>We sent a 6-digit code to <strong style={{ color: 'var(--color-neutral-700)' }}>{phone || '+1 (•••) ••• 1234'}</strong></p>
      <OTPInput length={6} onChange={setCode} />
      <div style={{ marginTop: 18, textAlign: 'center' }}>
        {resent
          ? <span style={{ fontSize: 13, color: 'var(--color-success-500)', fontWeight: 600 }}>Code resent ✔</span>
          : <button onClick={() => setResent(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: PINK, fontFamily: 'inherit' }}>Resend code</button>
        }
      </div>
      <div style={{ marginTop: 28 }}>
        <SolidBtn disabled={code.length < 6} onClick={() => onNext('passkey')}>Verify</SolidBtn>
      </div>
    </div>
  )
}

function PasskeyArt() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, margin: '32px 0' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #F5EBF9, #FAE9F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(186,47,125,.18)' }}>
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><ellipse cx="19" cy="14" rx="7" ry="8" stroke="#BA2F7D" strokeWidth="2.2"/><path d="M6 34c0-7.2 5.8-13 13-13s13 5.8 13 13" stroke="#BA2F7D" strokeWidth="2.2" strokeLinecap="round"/><path d="M23 28l3 3 6-6" stroke="#00A651" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {['Face ID', 'Touch ID', 'PIN'].map((m, i) => (
          <div key={m} style={{ background: i === 0 ? 'var(--color-pink-50)' : 'var(--color-neutral-50)', border: `1.5px solid ${i === 0 ? 'var(--color-pink-200)' : 'var(--color-neutral-200)'}`, borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: i === 0 ? PINK : 'var(--color-neutral-500)' }}>{m}</div>
        ))}
      </div>
    </div>
  )
}

function AuthPasskey({ onNext, onSkip }) {
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <div style={{ marginTop: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-success-50)', color: 'var(--color-success-700)', borderRadius: 9999, padding: '5px 14px', fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success-500)', display: 'inline-block' }} />
          Account created successfully
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.18 }}>Set up a passkey<br />for faster sign-in</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-neutral-600)', lineHeight: 1.55, marginTop: 14 }}>Use your device's biometrics or PIN instead of a password — faster, safer, no forgotten credentials.</p>
      </div>
      <PasskeyArt />
      <SolidBtn onClick={() => onNext('done')}>Create passkey</SolidBtn>
      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--color-neutral-500)', fontFamily: 'inherit' }}>Skip for now</button>
      </div>
    </div>
  )
}

function Pill({ children, color = 'var(--color-neutral-100)', textColor = 'var(--color-neutral-600)' }) {
  return <span style={{ display: 'inline-block', background: color, color: textColor, fontSize: 11, fontWeight: 700, letterSpacing: '.04em', padding: '3px 10px', borderRadius: 9999 }}>{children}</span>
}

function SpeedoArt({ size = 110 }) {
  const cx = size / 2, r = size * 0.38, strokeW = size * 0.09
  const arcY = size * 0.6
  const path = `M ${cx - r} ${arcY} A ${r} ${r} 0 0 1 ${cx + r} ${arcY}`
  const pct = 0.65
  const circ = Math.PI * r
  return (
    <svg width={size} height={arcY + strokeW} style={{ overflow: 'visible' }}>
      <path d={path} fill="none" stroke="#EAEAEF" strokeWidth={strokeW} strokeLinecap="round" />
      <path d={path} fill="none" stroke="var(--color-pink-400)" strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} />
      <text x={cx} y={arcY - strokeW * 0.5} textAnchor="middle" fontSize={size * 0.22} fontWeight="800" fill="var(--color-neutral-800)" fontFamily="var(--font-sans)">724</text>
    </svg>
  )
}

function Benefits({ unlocked }) {
  const active = ['Credit monitoring', 'Credit report', 'Experian Boost®']
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--color-neutral-500)', marginBottom: 16 }}>BENEFITS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {active.map((item, i) => (
          <div key={item} className="intro-rise" style={{ display: 'flex', alignItems: 'center', gap: 10, animationDelay: `${i * 0.06}s` }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: unlocked > i ? 'var(--color-success-500)' : 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .4s' }}>
              {unlocked > i
                ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <RIco.lock style={{ color: 'var(--color-neutral-400)', width: 10, height: 10 }} />
              }
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: unlocked > i ? 'var(--color-neutral-800)' : 'var(--color-neutral-400)', transition: 'color .4s' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashPreview({ step }) {
  const unlocked = step === 'phone' ? 0 : step === 'otp' ? 1 : step === 'passkey' ? 2 : 3
  const [tab, setTab] = useState(0)
  const tabs = ['Overview', 'Credit', 'Boost']
  return (
    <div className="dash-locked" style={{ background: '#F4F4FB', borderRadius: 20, padding: '24px 22px', position: 'relative', overflow: 'hidden' }}>
      {unlocked < 3 && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(244,244,251,.6)', backdropFilter: 'blur(3px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13,13,31,.12)' }}>
            <RIco.lock style={{ color: PINK, width: 18, height: 18 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-700)' }}>{unlocked === 0 ? 'Sign up to unlock' : unlocked === 1 ? 'Verify to unlock' : 'Almost there…'}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 1, background: 'var(--color-neutral-100)', borderRadius: 10, padding: 3, marginBottom: 18 }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '6px 0', background: i === tab ? '#fff' : 'transparent', color: i === tab ? 'var(--color-neutral-800)' : 'var(--color-neutral-500)', boxShadow: i === tab ? '0 1px 4px rgba(13,13,31,.08)' : 'none', transition: 'all .15s' }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <SpeedoArt size={130} />
        <div style={{ display: 'flex', gap: 6, marginTop: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Pill color="var(--color-blue-50)" textColor="var(--color-blue-600)">FICO® Score 8</Pill>
          <Pill color="var(--color-success-50)" textColor="var(--color-success-700)">+12 pts this month</Pill>
        </div>
      </div>
      <Benefits unlocked={unlocked} />
    </div>
  )
}

function AuthDone({ onDash }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const steps = [10, 35, 60, 80, 95, 100]
    let i = 0
    const tick = () => { if (i < steps.length) { setPct(steps[i++]); setTimeout(tick, 340) } else { setTimeout(onDash, 600) } }
    const t = setTimeout(tick, 200)
    return () => clearTimeout(t)
  }, [])
  return (
    <div style={{ maxWidth: 380, textAlign: 'center' }}>
      <RegLogo size={30} />
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div className="exp-spinner" />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.2 }}>Setting up your account…</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', lineHeight: 1.5, maxWidth: 300 }}>Pulling your credit profile and calculating your FICO® Score.</p>
        <div style={{ width: '100%', height: 6, borderRadius: 9999, background: 'var(--color-neutral-100)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 9999, background: 'linear-gradient(90deg, var(--color-blue-400), var(--color-pink-400))', transition: 'width .34s var(--ease-default)' }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-500)' }}>{pct}%</span>
      </div>
    </div>
  )
}

function DashboardPreview() {
  const features = [
    { icon: <RIco.faster />, label: 'Daily FICO® updates' },
    { icon: <RIco.bell style={{ color: '#F5A623' }} />, label: 'Real-time alerts' },
    { icon: <RIco.info style={{ color: 'var(--color-blue-400)' }} />, label: 'Score simulator' },
  ]
  return (
    <div style={{ maxWidth: 380 }}>
      <RegLogo size={30} />
      <div style={{ marginTop: 44 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-success-50)', color: 'var(--color-success-700)', borderRadius: 9999, padding: '5px 14px', fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success-500)', display: 'inline-block' }} />
          Your account is ready
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em', lineHeight: 1.15 }}>Welcome to<br />Experian</h1>
        <p style={{ fontSize: 15, color: 'var(--color-neutral-600)', lineHeight: 1.55, marginTop: 14, marginBottom: 28 }}>Your free credit report and FICO® Score are ready. Here's a preview of what you unlocked.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {features.map((f, i) => (
            <div key={i} className="intro-rise" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-neutral-50)', borderRadius: 10, padding: '12px 14px', animationDelay: `${i * 0.07}s` }}>
              <span style={{ flexShrink: 0 }}>{f.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-800)' }}>{f.label}</span>
              <RIco.chevR style={{ marginLeft: 'auto', color: 'var(--color-neutral-300)' }} />
            </div>
          ))}
        </div>
        <SolidBtn onClick={() => window.location.assign('/')}>Go to my dashboard</SolidBtn>
      </div>
    </div>
  )
}

function RegLogo({ size = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
      <img src="/uploads/Experian.png" alt="Experian" style={{ display: 'block', height: size * 1.2, width: 'auto' }} />
    </div>
  )
}

function RegNav({ step, menuOpen, setMenuOpen }) {
  return (
    <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: 64 }}>
        <RegLogo size={26} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
          {step !== 'done' && <a href="/" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-neutral-600)', textDecoration: 'none' }}>Back to home</a>}
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
            <RIco.menu style={{ color: 'var(--color-neutral-600)' }} />
          </button>
        </div>
      </div>
    </header>
  )
}

function RegisterInner() {
  const params = useSearchParams()
  const initialStep = params.get('step') || 'phone'
  const [step, setStep] = useState(initialStep)
  const [phone, setPhone] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [slide, setSlide] = useState(0)

  const goNext = (nextStep, data) => {
    if (nextStep === 'otp' && data) setPhone(data)
    setStep(nextStep)
  }
  const goBack = () => setStep('phone')

  useEffect(() => {
    if (step === 'otp') setSlide(1)
    else if (step === 'passkey') setSlide(2)
    else if (step === 'phone') setSlide(0)
  }, [step])

  const authContent = step === 'phone' ? <AuthPhone onNext={goNext} />
    : step === 'otp' ? <AuthOTP phone={phone} onNext={goNext} onBack={goBack} />
    : step === 'passkey' ? <AuthPasskey onNext={goNext} onSkip={() => goNext('loading')} />
    : step === 'loading' ? <AuthDone onDash={() => setStep('done')} />
    : <DashboardPreview />

  const showBenefit = step !== 'loading' && step !== 'done'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      <RegNav step={step} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: showBenefit ? '1fr 1fr' : '1fr', paddingTop: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
          {authContent}
        </div>
        {showBenefit && (
          <div style={{ background: 'var(--color-neutral-50)', display: 'flex', alignItems: 'stretch', padding: '24px' }}>
            <BenefitPanel slide={slide} setSlide={setSlide} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="exp-spinner" /></div>}>
      <RegisterInner />
    </Suspense>
  )
}
