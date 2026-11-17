/** @type {import('next').NextConfig} */
const nextConfig = { devIndicators: false }

// V3-only site mode (SITE_MODE=v3, usertest-passkey project only): noindex
// header on everything. /sitemap.xml is sent back to "/". The gate routes
// stay reachable when SITE_GATE=on; otherwise they still redirect home
// (ungated internal-review behaviour). Unset SITE_MODE = config unchanged.
if (process.env.SITE_MODE === 'v3') {
  nextConfig.headers = async () => [
    { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ]
  const blocked = process.env.SITE_GATE === 'on'
    ? ['/sitemap.xml']
    : ['/gate', '/api/gate', '/sitemap.xml']
  nextConfig.redirects = async () =>
    blocked.map((source) => ({ source, destination: '/', permanent: false }))
}

module.exports = nextConfig
