import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/src/casestudy/sentinel-audit.html', destination: '/casestudy/sentinel-audit', permanent: true },
      { source: '/src/casestudy/uav-stack.html', destination: '/casestudy/uav-stack', permanent: true },
      { source: '/src/casestudy/maize-classifier.html', destination: '/casestudy/maize-classifier', permanent: true },
      { source: '/src/casestudy/eswatini-dashboard.html', destination: '/casestudy/eswatini-dashboard', permanent: true },
      { source: '/src/casestudy/studio-p.html', destination: '/casestudy/studio-p', permanent: true },
      { source: '/src/casestudy/brt-platform.html', destination: '/casestudy/brt-platform', permanent: true },
      { source: '/onboard', destination: '/onboarding', permanent: true },
      { source: '/invoice', destination: '/invoices', permanent: true },
      { source: '/tools', destination: '/dashboard', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://va.vercel-scripts.com 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
              "media-src 'self' blob: https:",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/(dashboard|crm|proposals|invoices|runbooks|status)(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default config
