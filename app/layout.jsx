import './globals.css'

export const metadata = {
  title: 'Experian — Credit Report, FICO® Score & Financial Tools',
  description: 'Get your free credit report and FICO® Score. Monitor, protect, and improve your financial health.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
