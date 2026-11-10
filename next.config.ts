import type { NextConfig } from "next";

// Pages /fr, /en, /he pré-rendues ; la route /api/create-payment-intent tourne en fonction serveur (Stripe).
// La racine "/" redirige vers /he (vercel.json).
const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
