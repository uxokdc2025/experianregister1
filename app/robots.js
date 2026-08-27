export default function robots() {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
    host: 'https://usertestingdemo.vercel.app',
  }
}
