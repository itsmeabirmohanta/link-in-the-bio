/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@iconify/react', 'lucide-react'],
  }
}

module.exports = nextConfig 