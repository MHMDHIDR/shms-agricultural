/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shms-uploads.s3.eu-west-2.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
