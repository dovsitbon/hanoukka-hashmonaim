import type { NextConfig } from "next";

// Pages /fr, /en, /he pré-rendues et régénérées (jauge Stripe) ; routes API en fonctions serveur.
// La racine "/" redirige vers /he (vercel.json).
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // L'image de partage lit la photo et les polices sur le disque
  outputFileTracingIncludes: { "/api/og": ["./public/og-hanukkiah.jpg", "./assets/fonts/*"] },
};

export default nextConfig;
