/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Webpack configuration to handle three-mesh-bvh dependency issue for 3D components
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
};

module.exports = nextConfig;
