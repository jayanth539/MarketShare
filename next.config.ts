
import type {NextConfig} from 'next';
const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wgwvifmswtgsdelmffpa.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default process.env.TURBOPACK ? nextConfig : withPWA(nextConfig);
