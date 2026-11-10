import type { NextConfig } from "next";

// Export statique : /fr, /en, /he en HTML pur. La racine "/" redirige vers /fr (vercel.json).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
