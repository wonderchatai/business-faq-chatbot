/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, nextRuntime }) => {
    // Ensure async_hooks is externalized for Edge runtime, as it's a Node.js built-in
    if (isServer && nextRuntime === 'edge') {
      if (!config.externals) {
        config.externals = [];
      }
      config.externals.push('async_hooks');
    }
    return config;
  },
};

export default nextConfig;
