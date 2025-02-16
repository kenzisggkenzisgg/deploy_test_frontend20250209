/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,   //20250216 NEXT_PUBLICを追記
  }
}

module.exports = nextConfig
