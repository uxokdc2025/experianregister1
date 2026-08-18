import './globals.css'

const SITE_NAME = 'Experian Registration Prototype'
const SITE_DESCRIPTION =
  'A UX research prototype exploring a re-imagined Experian sign-up experience. Two design iterations run side-by-side for usability testing.'
const SITE_URL = 'https://experianregister1.vercel.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Usability Test`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
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
    title: `${SITE_NAME} — Usability Test`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/uploads/Experian.png',
        width: 1200,
        height: 630,
        alt: 'Experian Registration Prototype',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Usability Test`,
    description: SITE_DESCRIPTION,
    images: ['/uploads/Experian.png'],
  },
  icons: {
    icon: [
      { url: '/uploads/Experian.svg', type: 'image/svg+xml' },
      { url: '/uploads/Experian.png' },
    ],
    apple: '/uploads/Experian.png',
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
        {children}
      </body>
    </html>
  )
}
