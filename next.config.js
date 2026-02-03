/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.lasromeas.com",
      },
      {
        hostname: "lasromeas.com",
      },
    ],
  },
};

module.exports = nextConfig;
