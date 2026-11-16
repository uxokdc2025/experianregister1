export default function robots() {
  // V3-only site (SITE_MODE=v3): disallow all, no host pointing at the gated study site.
  if (process.env.SITE_MODE === 'v3') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
    host: 'https://usertestingdemo.vercel.app',
  }
}
