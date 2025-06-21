/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vercel-blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
