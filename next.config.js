/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shmsagricultural.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'shms-uploads.s3.eu-west-2.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'modo3.com',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'media.kenanaonline.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'mqalla.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.agroinvestspain.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'maan.gov.ae',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'assets.raya.com',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
