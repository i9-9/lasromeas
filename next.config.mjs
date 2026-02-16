import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'www.lasromeas.com' },
      { hostname: 'lasromeas.com' },
    ],
  },
}

export default withPayload(nextConfig)
