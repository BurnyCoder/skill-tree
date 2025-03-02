/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React strict mode to avoid double hydration
  reactStrictMode: true,
  // Suppress the hydration errors in development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig; 