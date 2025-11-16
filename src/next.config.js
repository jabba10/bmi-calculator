module.exports = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Add these for better Cloudflare compatibility
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
}