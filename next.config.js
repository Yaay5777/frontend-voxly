/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Webpack configuration to handle three-mesh-bvh dependency issue
  webpack: (config, { isServer }) => {
    // Ignore three-mesh-bvh to prevent BatchedMesh import error
    config.externals = config.externals || [];
    config.externals.push({
      'three-mesh-bvh': 'three-mesh-bvh'
    });
    
    // Fallback for missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'three-mesh-bvh': false,
    };
    
    return config;
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_TTS_URL: process.env.NEXT_PUBLIC_TTS_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },

  // Image optimization
  images: {
    domains: ['localhost', 'vercel.app'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
