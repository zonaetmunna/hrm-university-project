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
}

module.exports = nextConfig 