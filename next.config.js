/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ud-media.s3.us-east-2.amazonaws.com",
        port: "",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/:path*`,
      },
    ]
  }
};

module.exports = nextConfig;
