/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

// Content Security Policy. Allows our own code plus the few outside services the app really uses
// (PayPal button, Clerk sign-in, Google Fonts). Everything else is blocked.
const csp = (frameAncestors) => [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"} https://www.paypal.com https://*.paypal.com https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.paypal.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com",
  "frame-src 'self' https://*.paypal.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  `frame-ancestors ${frameAncestors}`,
].join('; ')

const common = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(self "https://www.paypal.com"), microphone=(self)' },
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }] : []),
]

const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  serverExternalPackages: ['mongoose'],
  async headers() {
    return [
      // the public job-board widget is meant to be embedded on other sites
      { source: '/embed/:path*', headers: [...common, { key: 'Content-Security-Policy', value: csp('*') }] },
      { source: '/((?!embed).*)', headers: [...common, { key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: csp("'none'") }] },
    ]
  },
}

module.exports = nextConfig
