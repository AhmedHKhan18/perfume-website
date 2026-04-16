/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
