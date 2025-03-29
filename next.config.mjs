/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
},
  images: {
    domains: ['res.cloudinary.com'],
},
  experimental: {
    continueOnError: true, // Ignore export errors
},
typescript: {
  ignoreBuildErrors: true,
},
};

export default nextConfig;
