/** @type {import('next').NextConfig} */
const nextConfig = { devIndicators: false }

// V3-only site mode (SITE_MODE=v3, experian-passkey project only): noindex
// header on everything, and the gate / sitemap routes (which the middleware
// matcher skips) are sent back to "/". Unset = config unchanged.
if (process.env.SITE_MODE === 'v3') {
  nextConfig.headers = async () => [
    { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ]
  nextConfig.redirects = async () =>
    ['/gate', '/api/gate', '/sitemap.xml'].map((source) => ({ source, destination: '/', permanent: false }))
}

module.exports = nextConfig
