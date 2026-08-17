const BASE = 'https://experianregister1.vercel.app'

export default function sitemap() {
  const routes = [
    '/',
    '/desktop',
    '/mobile-landing',
    '/mobile',
    '/register',
    '/v2/desktop',
    '/v2/mobile-landing',
    '/v2/mobile',
    '/v2/register',
  ]
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date('2026-08-17'),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
