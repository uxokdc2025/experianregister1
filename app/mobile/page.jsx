'use client'
import { useState, useEffect, useRef } from 'react'
import { Confetti, SuccessContent } from '../../components/Confetti'

/* ──────────────────────────────────────────────────────────────
   Registration Re-imagined — MOBILE flow
   Fixed 393×852 phone frame, centered. Real-mobile behavior:
   soft vertical intros, bottom-sheet drawers that rise + drag with
   snap-back, CTAs pinned with device safe-area, editable fields,
   and the "Here's what we found" step as a pull-up drawer over a
   blurred dashboard.
   Steps: phone → birthday → passkey → found → dashboard
   ────────────────────────────────────────────────────────────── */

const PINK = 'var(--color-pink-400)'
const MW = 393, MH = 852
const SAFE_BOTTOM = 26
const go = (href) => window.location.assign(href)

/* ─────────────── Shell ─────────────── */
function MobileFrame({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: MW, height: MH, background: '#fff', borderRadius: 46, boxShadow: '0 40px 90px rgba(13,13,31,.40)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
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
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M2 5a9 9 0 0112 0M4.6 7.5a5.3 5.3 0 016.8 0M8 10h.01" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="1" y="1" width="22" height="11" rx="3" stroke={c} strokeWidth="1" opacity=".45" /><rect x="3" y="3" width="17" height="7" rx="1.5" fill={c} /><rect x="24" y="4.5" width="2" height="4" rx="1" fill={c} /></svg>
      </div>
    </div>
  )
}

function Dots({ active = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0, 1, 2].map(i => <span key={i} style={{ width: i === active ? 22 : 8, height: 6, borderRadius: 9999, background: i === active ? PINK : '#D9D9E3', transition: 'width .2s' }} />)}
    </div>
  )
}

function MLogo({ size = 30 }) {
  return <img onClick={() => go('/')} src="/uploads/Experian.png" alt="Experian" title="Back to start" style={{ height: size, width: 'auto', display: 'block', cursor: 'pointer' }} />
}

function CTA({ children, disabled, onClick }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ width: '100%', minHeight: 52, border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', color: '#fff', background: disabled ? 'var(--color-pink-200)' : PINK, cursor: disabled ? 'default' : 'pointer', transition: 'background .15s' }}>
      {children}
    </button>
  )
}

function FloatInput({ label, value, setValue, type = 'text' }) {
  const [focus, setFocus] = useState(false)
  const float = focus || value !== ''
  return (
    <div style={{ position: 'relative' }}>
      <label style={{ position: 'absolute', left: 15, top: float ? 9 : '50%', transform: float ? 'none' : 'translateY(-50%)', fontSize: float ? 11 : 15, fontWeight: float ? 700 : 400, color: focus ? PINK : 'var(--color-neutral-500)', pointerEvents: 'none', transition: 'all .15s' }}>{label}</label>
      <input value={value} onChange={e => setValue(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} type={type}
        style={{ width: '100%', height: 58, border: `1.5px solid ${focus ? PINK : 'var(--color-neutral-200)'}`, borderRadius: 10, padding: float ? '22px 15px 0' : '0 15px', fontSize: 15, fontFamily: 'inherit', color: 'var(--color-neutral-800)', outline: 'none', transition: 'border-color .15s' }} />
    </div>
  )
}

/* Editable boxed field with a persistent top label (identity form). */
function FField({ label, value = '', half }) {
  const [val, setVal] = useState(value)
  const [focus, setFocus] = useState(false)
  const filled = val !== ''
  return (
    <div style={{ flex: half ? 1 : 'none', minWidth: 0 }}>
      <div style={{ border: `1.5px solid ${focus ? PINK : 'var(--color-neutral-200)'}`, borderRadius: 10, padding: '8px 14px 7px', transition: 'border-color .15s' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-500)' }}>{label}</div>
        <input value={val} onChange={e => setVal(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 15, fontWeight: filled ? 600 : 400, color: filled ? 'var(--color-blue-600)' : 'var(--color-neutral-800)', marginTop: 2, padding: 0 }} />
      </div>
    </div>
  )
}

function PromoRow({ title, sub, highlight, delay }) {
  return (
    <div className="intro-rise" style={{ animationDelay: `${delay}s`, display: 'flex', alignItems: 'center', gap: 10, background: highlight ? '#E4E4F3' : '#EDEDF6', borderRadius: 11, padding: '9px 13px' }}>
      {highlight
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 3l7 2.5v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9v-5L12 3z" fill={PINK} /><path d="M9 12l2 2 4-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-success-500)', flexShrink: 0 }} />}
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-800)' }}>{title}</span>
      {sub && <span style={{ fontSize: 12.5, color: 'var(--color-neutral-500)' }}>{sub}</span>}
    </div>
  )
}

function FeatureRow({ tile, icon, title, desc, delay }) {
  return (
    <div className="intro-rise" style={{ animationDelay: `${delay}s`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: tile, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--color-neutral-900)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', lineHeight: 1.4, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  )
}

/* ─────────────── Bottom sheet (rise + drag + snap) ─────────────── */
function BottomSheet({ children, cta }) {
  const [risen, setRisen] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)
  useEffect(() => { const t = setTimeout(() => setRisen(true), 450); return () => clearTimeout(t) }, [])
  const down = (e) => { setDragging(true); startY.current = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const move = (e) => { if (!dragging) return; setDragY(Math.max(-110, Math.min(28, e.clientY - startY.current))) }
  const up = () => { setDragging(false); setDragY(0) }
  const ty = risen ? dragY : 560
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 34px rgba(13,13,31,.13)', transform: `translateY(${ty}px)`, transition: dragging ? 'none' : 'transform .6s cubic-bezier(.22,1.15,.36,1)', display: 'flex', flexDirection: 'column', maxHeight: '82%', zIndex: 10 }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ padding: '11px 0 2px', cursor: 'grab', touchAction: 'none', flexShrink: 0 }}>
        <div style={{ width: 42, height: 5, borderRadius: 9999, background: 'var(--color-neutral-200)', margin: '0 auto' }} />
      </div>
      <div style={{ overflowY: 'auto', padding: '4px 22px 2px', flex: 1 }}>{children}</div>
      <div style={{ flexShrink: 0, padding: `12px 22px ${SAFE_BOTTOM + 4}px`, borderTop: '1px solid var(--color-neutral-100)' }}>{cta}</div>
    </div>
  )
}

/* ─────────────── Promo visuals ─────────────── */
function MGauge({ score = 724 }) {
  const [draw, setDraw] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDraw(true), 250); return () => clearTimeout(t) }, [])
  const size = 150, cx = size / 2, sw = 17, r = (size - sw) / 2 - 2, arcY = size * 0.58
  const circ = Math.PI * r, pct = (score - 300) / 550
  const path = `M ${cx - r} ${arcY} A ${r} ${r} 0 0 1 ${cx + r} ${arcY}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={arcY + 20}>
        <path d={path} fill="none" stroke="#D9D9DE" strokeWidth={sw} strokeLinecap="round" />
        <path d={path} fill="none" stroke={PINK} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={draw ? circ * (1 - pct) : circ} style={{ transition: 'stroke-dashoffset 1.1s var(--ease-default)' }} />
        <text x={cx} y={arcY - 20} textAnchor="middle" fill="var(--color-neutral-800)" fontSize="38" fontWeight="800" fontFamily="var(--font-sans)">{score}</text>
      </svg>
      <span style={{ background: PINK, color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.06em', padding: '3px 14px', borderRadius: 9999, marginTop: -4 }}>GOOD</span>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, fontSize: 11.5, color: 'var(--color-neutral-600)', fontWeight: 500 }}>
        {['Fair', 'Good', 'Very Good', 'Exceptional'].map((l, i) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{l}{i < 3 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-neutral-300)' }} />}</span>)}
      </div>
    </div>
  )
}

function MBoostChart() {
  const [draw, setDraw] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDraw(true), 300); return () => clearTimeout(t) }, [])
  const W = 560, H = 205, padL = 30, padR = 16, padT = 12, padB = 22, yMax = 45
  const days = ['Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22']
  const x = i => padL + (W - padL - padR) * (i / (days.length - 1))
  const y = v => padT + (H - padT - padB) * (1 - v / yMax)
  const boost = [2, 5, 6, 8, 9, 12, 15, 18, 22, 28, 28], base = [2, 1, 3, 4, 5, 6, 7, 9, 11, 15, 19]
  const line = a => a.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ')
  const area = `${line(boost)} L ${x(boost.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '14px 12px 6px', boxShadow: 'var(--shadow-sm)' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {[0, 15, 30, 45].map(v => <line key={v} x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="#EEE" strokeWidth="1" strokeDasharray="3 4" />)}
        <defs><linearGradient id="mba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BA2F7D" stopOpacity="0.18" /><stop offset="1" stopColor="#BA2F7D" stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill="url(#mba)" style={{ opacity: draw ? 1 : 0, transition: 'opacity .9s ease .4s' }} />
        <path d={line(base)} fill="none" stroke="#9A9AAE" strokeWidth="1.6" strokeDasharray="5 4" />
        <path d={line(boost)} fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1500" strokeDashoffset={draw ? 0 : 1500} style={{ transition: 'stroke-dashoffset 1.4s var(--ease-default)' }} />
        <g transform={`translate(${x(7) - 42}, ${y(24) - 26})`} style={{ opacity: draw ? 1 : 0, transition: 'opacity .4s ease 1s' }}>
          <rect width="84" height="22" rx="11" fill={PINK} /><text x="42" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="var(--font-sans)">Boost added</text>
        </g>
        {days.map((d, i) => <text key={d} x={x(i)} y={H - padB + 16} textAnchor="middle" fontSize="8.5" fill="#9A9AAE" fontFamily="var(--font-sans)">{d}</text>)}
      </svg>
    </div>
  )
}

const Ico = {
  bolt: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" fill={PINK} /></svg>,
  bank: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5H4L12 3z" stroke="#406EB3" strokeWidth="1.7" strokeLinejoin="round" /><path d="M6 10v6M10 10v6M14 10v6M18 10v6M4 19.5h16" stroke="#406EB3" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  trend: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 16l5-5 3.5 3.5L20 7" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 7h5v5" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  report: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#406EB3" strokeWidth="1.7" /><path d="M9 11h6M9 14.5h4" stroke="#406EB3" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  faster: () => <svg width="24" height="24" viewBox="0 0 26 26" fill="none"><g stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round"><path d="M13 3v3M13 20v3M3 13h3M20 13h3M6 6l2 2M18 18l2 2M20 6l-2 2M8 18l-2 2" /></g></svg>,
  shieldCheck: () => <svg width="24" height="24" viewBox="0 0 26 26" fill="none"><path d="M13 3l8 3v5.5c0 5-3.5 8.8-8 10.5-4.5-1.7-8-5.5-8-10.5V6l8-3z" stroke="#406EB3" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9.5 12.5l2.4 2.4L17 9.8" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  devices: () => <svg width="24" height="24" viewBox="0 0 26 26" fill="none"><rect x="7" y="3" width="12" height="20" rx="2.5" stroke="#406EB3" strokeWidth="1.8" /><path d="M11 19.5h4" stroke="#406EB3" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  lock: (p) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.5" /><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" /></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="var(--color-neutral-500)" strokeWidth="1.7" strokeLinecap="round" /></svg>,
}

/* ─────────────── Screen 1: phone ─────────────── */
function MPhone({ onNext }) {
  const [v, setV] = useState('')
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#F4F4FB' }}>
      <div style={{ padding: '14px 20px 0' }}>
        <div className="intro-rise"><MLogo size={26} /></div>
        <div className="intro-rise" style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', padding: '4px 12px', borderRadius: 9999 }}>ALWAYS ON</span>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-neutral-800)', lineHeight: 1.2, marginTop: 8 }}>Protection that never sleeps watching 24/7</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
          <PromoRow title="All system clear not threat detected" highlight delay={0.10} />
          <PromoRow title="Dark web scan" sub="Free scan included" delay={0.16} />
          <PromoRow title="Fraud alert" sub="1-year protection" delay={0.22} />
          <PromoRow title="Credit freeze" sub="One tap , instant" delay={0.28} />
          <PromoRow title="Dispute center" sub="Fix error free" delay={0.34} />
        </div>
        <div className="intro-rise" style={{ animationDelay: '.4s', marginTop: 18 }}><Dots active={0} /></div>
      </div>
      <BottomSheet cta={<CTA disabled={!v.trim()} onClick={onNext}>Get started</CTA>}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em' }}>See your free credit score.</h1>
        <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.5, marginTop: 12 }}>Join 100 million people who trust Experian to understand protect and improve their financial health.</p>
        <div style={{ marginTop: 22 }}><FloatInput label="Mobile Number" value={v} setValue={setV} /></div>
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 20 }}>Already have an account? <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Sign in</a></div>
        <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', lineHeight: 1.5, textAlign: 'center', marginTop: 18 }}>By continuing you agree to our <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Terms of Use</a> and <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Privacy Policy</a>. Standard message rates may apply.</p>
      </BottomSheet>
    </div>
  )
}

/* ─────────────── Screen 2: birthday ─────────────── */
function MBirthday({ onNext }) {
  const [v, setV] = useState('')
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#F4F4FB' }}>
      <div style={{ padding: '14px 20px 0' }}>
        <div className="intro-rise"><MLogo size={26} /></div>
        <div className="intro-rise" style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', padding: '4px 12px', borderRadius: 9999 }}>EXPERIAN BOOST</span>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-neutral-800)', lineHeight: 1.2, marginTop: 8 }}>Raise your score just by paying the bills you already pay</h2>
        </div>
        <div className="intro-rise" style={{ animationDelay: '.12s', marginTop: 18 }}><MBoostChart /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
          <FeatureRow tile="#FAE9F2" icon={<Ico.bolt />} title="Instant results in minutes" desc="Cell phones utilities rent, streaming - they all count" delay={0.2} />
          <FeatureRow tile="#EBF1FA" icon={<Ico.bank />} title="Smart Money checking" desc="No monthly fee. $50 bonus with direct deposits" delay={0.26} />
        </div>
        <div className="intro-rise" style={{ animationDelay: '.32s', marginTop: 8 }}><Dots active={1} /></div>
      </div>
      <BottomSheet cta={<CTA disabled={!v.trim()} onClick={onNext}>See my details</CTA>}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em' }}>We recognize you.</h1>
        <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', lineHeight: 1.5, marginTop: 12 }}>We matched your number. Confirm your birthday to pull your credit details.</p>
        <div style={{ marginTop: 22 }}><FloatInput label="Birthday" value={v} setValue={setV} /></div>
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 20 }}>Already have an account? <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Sign in</a></div>
        <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', lineHeight: 1.5, textAlign: 'center', marginTop: 18 }}>By continuing you agree to our <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Terms of Use</a> and <a style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Privacy Policy</a>. Standard message rates may apply.</p>
      </BottomSheet>
    </div>
  )
}

/* ─────────────── Screen 3: passkey ─────────────── */
function PasskeyRow({ icon, title, desc, delay }) {
  return (
    <div className="intro-rise" style={{ animationDelay: `${delay}s`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
      <div><div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-neutral-800)' }}>{title}</div><div style={{ fontSize: 13, color: 'var(--color-neutral-600)', lineHeight: 1.4, marginTop: 2 }}>{desc}</div></div>
    </div>
  )
}

function MPasskey({ onNext }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#F4F4FB' }}>
      <div style={{ padding: '14px 20px 0' }}>
        <div className="intro-rise"><MLogo size={26} /></div>
        <div className="intro-rise" style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', padding: '4px 12px', borderRadius: 9999 }}>FREE FOREVER</span>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-neutral-800)', lineHeight: 1.2, marginTop: 8 }}>Know your real FICO Score the one lenders actually use</h2>
        </div>
        <div className="intro-rise" style={{ animationDelay: '.12s', marginTop: 10 }}><MGauge score={724} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <FeatureRow tile="#FAE9F2" icon={<Ico.trend />} title="Daily score updates" desc="See changes the moment they happen , no surprises" delay={0.2} />
          <FeatureRow tile="#EBF1FA" icon={<Ico.report />} title="Free Experian credit report" desc="Full report, dispute inaccuracies for free anytime" delay={0.26} />
        </div>
        <div className="intro-rise" style={{ animationDelay: '.32s', marginTop: 8 }}><Dots active={2} /></div>
      </div>
      <BottomSheet cta={<CTA onClick={onNext}>Add Passkey</CTA>}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-800)', letterSpacing: '-.02em' }}>Setup Passkey</h1>
        <p style={{ fontSize: 15, color: 'var(--color-neutral-700)', marginTop: 6 }}>Passkeys make it easy to login.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <PasskeyRow icon={<Ico.faster />} title="Login Faster" desc="Unlike passwords, passkeys don't need to be remembered." delay={0.1} />
          <PasskeyRow icon={<Ico.shieldCheck />} title="Enhanced Security" desc="Passkeys provide the strongest level of protection against phishing." delay={0.16} />
          <PasskeyRow icon={<Ico.devices />} title="Multi-Device Support" desc="Passkeys can be accessed across different devices seamlessly." delay={0.22} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'var(--color-neutral-800)', marginTop: 12 }}>Don&#39;t want to use a passkey? <a onClick={onNext} style={{ color: 'var(--color-blue-400)', cursor: 'pointer' }}>Skip for now</a></div>
      </BottomSheet>
    </div>
  )
}

/* ─────────────── "Here's what we found" pull-up drawer ─────────────── */
function FoundDrawer({ onDone }) {
  const [risen, setRisen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)
  useEffect(() => { const t = setTimeout(() => setRisen(true), 240); return () => clearTimeout(t) }, [])
  const down = (e) => { setDragging(true); startY.current = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const move = (e) => { if (!dragging) return; setDragY(Math.max(-40, Math.min(60, e.clientY - startY.current))) }
  const up = () => { setDragging(false); setDragY(0) }
  const finish = () => { setClosing(true); setTimeout(onDone, 720) }
  const ty = closing ? 920 : (risen ? dragY : 840)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '92%', background: '#fff', borderRadius: '26px 26px 0 0', boxShadow: '0 -16px 44px rgba(13,13,31,.28)', transform: `translateY(${ty}px)`, transition: closing ? 'transform .72s cubic-bezier(.4,0,.2,1)' : dragging ? 'none' : 'transform .55s cubic-bezier(.22,1.15,.36,1)', display: 'flex', flexDirection: 'column', zIndex: 30 }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ padding: '11px 0 4px', cursor: 'grab', touchAction: 'none', flexShrink: 0 }}>
        <div style={{ width: 42, height: 5, borderRadius: 9999, background: 'var(--color-neutral-200)', margin: '0 auto' }} />
      </div>
      <div style={{ overflowY: 'auto', padding: '8px 20px 8px', flex: 1 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-900)', letterSpacing: '-.02em' }}>Here&#39;s what we found</h1>
        <p style={{ fontSize: 14.5, color: 'var(--color-neutral-500)', lineHeight: 1.5, marginTop: 8 }}>Make sure everything looks correct and edit anything that needs updating.</p>
        <div style={{ fontSize: 16, fontWeight: 800, color: PINK, margin: '22px 0 14px' }}>About you</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}><FField label="First Name" value="Robert" half /><FField label="Last Name" value="Ross" half /></div>
          <div style={{ display: 'flex', gap: 12 }}><FField label="Date of birth" value="08/23/1983" half /><FField label="Phone Number" value="" half /></div>
          <FField label="Street address" value="732 Capouse Ave" />
          <div style={{ display: 'flex', gap: 12 }}><FField label="Apt,unit,etc" value="" half /><FField label="Zip Code" value="18503" half /></div>
          <div style={{ display: 'flex', gap: 12 }}><FField label="City" value="Scranton" half /><FField label="State" value="UT" half /></div>
          <FField label="Social Security Number" value="XXX-XX-4237" />
          <a style={{ fontSize: 13, color: 'var(--color-blue-400)', cursor: 'pointer' }}>Why do we need this ?</a>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: PINK, margin: '22px 0 14px' }}>Create your account</div>
        <FField label="Email" value="" />
      </div>
      <div style={{ flexShrink: 0, padding: `14px 20px ${SAFE_BOTTOM + 8}px`, borderTop: '1px solid var(--color-neutral-100)' }}>
        <CTA onClick={finish}>Continue</CTA>
      </div>
    </div>
  )
}

/* ─────────────── Dashboard ─────────────── */
function DashCard({ children, pad = 20 }) {
  return <div style={{ border: '1px solid var(--color-neutral-200)', borderRadius: 14, padding: pad }}>{children}</div>
}

function MDash({ unlocked = true }) {
  const blur = unlocked ? 'none' : 'blur(8px)'
  const benefits = ['Credit monitoring', 'Credit report', 'Experian Boost®', 'Exact FICO® Score', 'Score history', 'Dark web scan']
  const progress = [['Account created', 'done'], ['Phone verified', 'done'], ['Confirm identity', unlocked ? 'done' : 'active'], ['Score & report revealed', unlocked ? 'done' : 'todo']]
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflowY: 'auto', background: '#fff' }}>
      <StatusBar />
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 }}><MLogo size={26} /></div>
        <h1 className="intro-rise" style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-neutral-900)', marginTop: 8 }}>{unlocked ? 'Hi, David !' : 'Hi, Good Morning !'}</h1>
        <p className="intro-rise" style={{ animationDelay: '.05s', fontSize: 14.5, color: 'var(--color-neutral-500)', marginTop: 4 }}>Take a look at the big picture of your credit.</p>

        {!unlocked && (
          <div style={{ background: PINK, borderRadius: 14, padding: '18px 20px', marginTop: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>Complete identity verification to see your score</div>
            <button style={{ marginTop: 12, background: '#fff', color: PINK, border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Get Started</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
          <DashCard pad={16}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--color-neutral-500)', marginBottom: 14 }}>SETUP PROGRESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {progress.map(([l, s]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 11 }}><span style={{ width: 15, height: 15, borderRadius: '50%', background: s === 'done' ? 'var(--color-success-500)' : s === 'active' ? PINK : 'transparent', border: s === 'todo' ? '2px solid var(--color-neutral-300)' : 'none' }} /><span style={{ fontSize: 14, fontWeight: s === 'active' ? 700 : 600, color: s === 'active' ? PINK : s === 'todo' ? 'var(--color-neutral-400)' : 'var(--color-neutral-700)' }}>{l}</span></div>)}
            </div>
          </DashCard>

          <DashCard pad={16}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: 'var(--color-neutral-500)', marginBottom: 12 }}>BENEFITS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {benefits.map(b => <div key={b} style={{ background: '#EAF1FA', borderRadius: 8, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, fontWeight: 600, color: 'var(--color-neutral-800)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success-500)' }} />{b}</div>)}
            </div>
          </DashCard>

          <DashCard>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-neutral-900)', marginBottom: 14 }}>Credit</div>
            <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid var(--color-neutral-100)', marginBottom: 16, fontSize: 14 }}>
              <span style={{ paddingBottom: 10, borderBottom: '2px solid var(--color-blue-600)', color: 'var(--color-blue-600)', fontWeight: 700 }}>Experian</span>
              <span style={{ color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center', gap: 5 }}>Equifax <Ico.lock /></span>
              <span style={{ color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center', gap: 5 }}>TransUnion <Ico.lock /></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ fontWeight: 800, color: 'var(--color-blue-600)' }}>FICO<span style={{ color: 'var(--color-neutral-400)' }}> SCORE 8</span></span><span style={{ color: 'var(--color-neutral-500)' }}>Experian Data Dec 24, 2020</span></div>
            <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--color-neutral-900)', lineHeight: 1.1, margin: '4px 0', filter: blur }}>755</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: 'var(--color-neutral-700)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success-500)' }} />VERY GOOD</span>
              <span style={{ background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '4px 11px', fontSize: 12, fontWeight: 800, color: 'var(--color-neutral-700)' }}>+7 POINTS</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>{[0, 1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 6, borderRadius: 9999, background: i < 4 ? 'var(--color-success-500)' : 'var(--color-neutral-200)' }} />)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--color-neutral-500)', fontWeight: 600 }}><span>300</span><span>579</span><span>669</span><span>739</span><span>799</span><span>850</span></div>
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-neutral-500)' }}>TOTAL DEBT</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-neutral-900)', margin: '3px 0 6px', filter: blur }}>$496,245</div><span style={{ background: '#1E1E35', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 5, padding: '2px 8px' }}>$500</span></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-neutral-500)' }}>CREDIT USAGE</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-neutral-900)', margin: '3px 0 6px', filter: blur }}>14%</div><span style={{ background: '#C62828', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 5, padding: '2px 8px' }}>$500</span></div>
            </div>
            <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 16, paddingTop: 14 }}><span style={{ fontSize: 14.5, fontWeight: 700, color: PINK }}>See your report</span></div>
          </DashCard>

          <DashCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-neutral-900)' }}>Money</span><span style={{ fontSize: 13.5, color: 'var(--color-neutral-600)' }}>Accounts <span style={{ background: 'var(--color-neutral-100)', borderRadius: 9999, padding: '2px 8px', fontWeight: 700 }}>1</span></span></div>
            <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--color-neutral-900)', filter: blur }}>$1,587</div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginTop: 2, marginBottom: 16 }}>July cash flow</div>
            {[['Income', '#88D4A8', '82%', '$10,120'], ['Expenses', '#EF9A9A', '62%', '$8,532']].map(([l, c, w, val]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><span style={{ fontSize: 13, color: 'var(--color-neutral-600)', width: 60 }}>{l}</span><div style={{ flex: 1, height: 8, borderRadius: 9999, background: 'var(--color-neutral-100)' }}><div style={{ width: w, height: '100%', borderRadius: 9999, background: c }} /></div><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-700)', width: 56, textAlign: 'right', filter: blur }}>{val}</span></div>)}
            <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 12, paddingTop: 14 }}><span style={{ fontSize: 14.5, fontWeight: 700, color: PINK }}>See details</span></div>
          </DashCard>
        </div>

        <div style={{ marginTop: 30, borderTop: '1px solid var(--color-neutral-100)', paddingTop: 8 }}>
          {['Services', 'Tools', 'Support'].map(s => <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 2px', borderBottom: '1px solid var(--color-neutral-100)', fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-800)' }}>{s}<Ico.plus /></div>)}
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: 'var(--color-neutral-500)' }}>Get the Free Experian app:</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
            <div style={{ background: '#000', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 600 }}> App Store</div>
            <div style={{ background: '#000', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 600 }}>▶ Google Play</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-neutral-500)' }}>Follow us:</div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 10, color: 'var(--color-neutral-700)' }}>
            {['f', '𝕏', 'ig', '▶'].map((s, i) => <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s}</span>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 22, fontSize: 13, color: 'var(--color-neutral-600)' }}>
            {['About Us', 'Ad Targeting Policy', 'Contact Us', 'Terms & Conditions', 'Privacy Policy'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11.5, color: 'var(--color-neutral-400)', lineHeight: 1.5 }}>© 2021 Experian. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Flow ─────────────── */
export default function MobilePage() {
  const [step, setStep] = useState('phone')
  return (
    <MobileFrame>
      {step === 'phone' && <MPhone onNext={() => setStep('birthday')} />}
      {step === 'birthday' && <MBirthday onNext={() => setStep('passkey')} />}
      {step === 'passkey' && <MPasskey onNext={() => setStep('found')} />}
      {step === 'found' && (
        <>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><MDash unlocked={false} /></div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,31,.30)', zIndex: 20 }} />
          <FoundDrawer onDone={() => setStep('celebrate')} />
        </>
      )}
      {step === 'celebrate' && (
        <>
          <div style={{ position: 'absolute', inset: 0 }}><MDash unlocked /></div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(244,244,251,.88)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
            <SuccessContent onDone={() => setStep('dash')} />
          </div>
          <Confetti />
        </>
      )}
      {step === 'dash' && <MDash unlocked />}
    </MobileFrame>
  )
}
