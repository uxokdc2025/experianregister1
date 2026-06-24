import './globals.css'

export const metadata = {
  title: 'Experian — Credit Report, FICO® Score & Financial Tools',
  description: 'Get your free credit report and FICO® Score. Monitor, protect, and improve your financial health.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}
