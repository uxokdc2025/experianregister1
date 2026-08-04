'use client'

/* ──────────────────────────────────────────────────────────────
   Registration Re-imagined — test cover sheet
   Entry point for the usability test. Lets the participant choose
   the Desktop or Mobile version of the flow.
   ────────────────────────────────────────────────────────────── */

const go = (href) => window.location.assign(href)

function MonitorIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="7" width="30" height="20" rx="2.5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M14 33h12M20 27v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <rect x="12" y="4" width="16" height="32" rx="3.5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M17.5 8h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="31" r="1.5" fill="currentColor" />
    </svg>
  )
}

const OPTIONS = [
  {
    key: 'desktop',
    href: '/register?step=phone',
    Icon: MonitorIcon,
    label: 'Desktop',
    desc: 'Walk through the re-imagined registration on a full desktop screen.',
    tint: 'var(--color-blue-600)',
    tintBg: 'var(--color-blue-50)',
  },
  {
    key: 'mobile',
    href: '/mobile',
    Icon: PhoneIcon,
    label: 'Mobile',
    desc: 'Experience the same flow in a mobile-first layout.',
    tint: 'var(--color-pink-400)',
    tintBg: 'var(--color-pink-50)',
  },
]

function OptionCard({ opt }) {
  const { Icon } = opt
  return (
    <button
      className="mini-card"
      onClick={() => go(opt.href)}
      style={{
        appearance: 'none',
        fontFamily: 'inherit',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fff',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px 26px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <span
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: opt.tintBg,
          color: opt.tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon />
      </span>
      <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-neutral-800)' }}>{opt.label}</span>
      <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--color-neutral-600)', maxWidth: 220 }}>
        {opt.desc}
      </span>
      <span
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '.02em',
          color: opt.tint,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        Start
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

export default function CoverPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 760,
          background: '#fff',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 6, background: 'var(--gradient-brand)' }} />
        <div style={{ padding: '44px 48px 40px', textAlign: 'center' }}>
          <img
            src="/uploads/Experian.png"
            alt="Experian"
            style={{ height: 34, width: 'auto', margin: '0 auto 22px' }}
          />
          <span
            style={{
              display: 'inline-block',
              background: 'var(--color-pink-400)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              marginBottom: 18,
            }}
          >
            Usability Test
          </span>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '-.025em',
              color: 'var(--color-neutral-800)',
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Registration Re-imagined
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--color-neutral-600)',
              maxWidth: 440,
              margin: '0 auto 34px',
            }}
          >
            Choose how you want to experience the prototype. Each path starts at the first screen of the flow.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {OPTIONS.map((opt) => (
              <OptionCard key={opt.key} opt={opt} />
            ))}
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--color-neutral-500)', marginTop: 30 }}>
            For research purposes only. Not a live Experian product.
          </p>
        </div>
      </div>
    </main>
  )
}
