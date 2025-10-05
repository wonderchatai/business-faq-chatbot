/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Explicitly tell Next.js to treat async_hooks as external for Edge environments.
    // This prevents the bundler from trying to resolve/bundle it.
    serverComponentsExternalPackages: ['async_hooks'],
    serverActions: {
      external: ['async_hooks'],
    },
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Keep the webpack externalization for good measure, though the experimental flags
    // are more likely to target the esbuild part for Edge.
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
