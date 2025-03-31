/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
},
  images: {
    domains: ['res.cloudinary.com'],
},
output: "standalone", // Ensures the app runs dynamically
  experimental: {
    continueOnError: true, // Ignore export errors
    appDir: true, // For Next.js App Router
},
generateBuildId: async () => {
  return "skip-static"; // Forces Next.js to avoid static exports
},
typescript: {
  ignoreBuildErrors: true,
},
pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
