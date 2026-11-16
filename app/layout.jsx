import './globals.css'

/* SITE_MODE=v3 (usertest-passkey only): head metadata uses "Usertesting
   Passkey" and must not mention Experian. The gated usertestingdemo site
   keeps the original metadata below when the switch is unset. */
const IS_V3 = process.env.SITE_MODE === 'v3'
const SITE_NAME = IS_V3 ? 'Usertesting Passkey' : 'Experian Registration Prototype'
const SITE_DESCRIPTION = IS_V3
  ? 'A UX research prototype for passkey sign-in usability testing.'
  : 'A UX research prototype exploring a re-imagined Experian sign-up experience. Two design iterations run side-by-side for usability testing.'
const SITE_URL = IS_V3 ? 'https://usertest-passkey.vercel.app' : 'https://usertestingdemo.vercel.app'
const SITE_TITLE = IS_V3 ? SITE_NAME : `${SITE_NAME} — Usability Test`

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  ...(IS_V3 ? { appleWebApp: { title: SITE_NAME } } : {}),
  keywords: IS_V3
    ? ['UX prototype', 'usability testing', 'passkey', 'sign-in UX']
    : [
        'UX prototype',
        'usability testing',
        'registration flow',
        'sign-up UX',
        'credit score UX',
        'accessible form design',
        'Experian prototype',
      ],
  authors: [{ name: 'UX Research' }],
  creator: 'UX Research',
  publisher: 'UX Research',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23BA2F7D'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='16' font-weight='700' fill='white' text-anchor='middle'%3ED%3C/text%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
  },
  formatDetection: { telephone: false, address: false, email: false },
  category: 'design',
  other: {
    'x-robots-tag': 'noindex, nofollow',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#BA2F7D',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&display=swap"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div
          role="note"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2147483647,
            background: '#1E1E35',
            color: '#fff',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '5px 14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <span style={{ font: '600 11px/1.3 system-ui, sans-serif', letterSpacing: '.01em' }}>
            Demo prototype — user testing only
          </span>
        </div>
        {children}
      </body>
    </html>
  )
}
