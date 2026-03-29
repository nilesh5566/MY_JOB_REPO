/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: { serverComponentsExternalPackages: ['mongoose'] },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
