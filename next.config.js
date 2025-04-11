/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Optional: Also disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure Prisma can generate in serverless environments
  env: {
    PRISMA_GENERATE: 'true',
  },
  // For Vercel deployments
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}

module.exports = nextConfig 