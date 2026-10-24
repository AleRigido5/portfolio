import type { NextConfig } from "next";

// Header di sicurezza applicati a tutte le pagine (Lighthouse → Best Practices)
const securityHeaders = [
  // Impedisce al browser di "indovinare" il tipo dei file
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Il sito non può essere incorporato in iframe di altri domini (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Ai siti esterni viene passato solo il dominio, non l'URL completo
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disattiva API del browser che il portfolio non usa
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Forza HTTPS per 2 anni (ignorato in locale su http://localhost)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Rimuove l'header "X-Powered-By: Next.js" (inutile esporre lo stack)
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // AVIF dove supportato (più leggero), altrimenti WebP
    formats: ["image/avif", "image/webp"],
    // Le immagini ottimizzate restano in cache 30 giorni
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Larghezze generate: coprono card (368px) e schermi fino a 2x/3x
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512],
    // Le immagini caricate dall'admin ora stanno nel database (/img/<id>).
    // Questa riga serve solo alle vecchie immagini su Vercel Blob:
    // quando le hai ricaricate tutte dall'admin puoi eliminarla.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },

  experimental: {
    // Upload delle copertine dall'admin (max 4 MB, vedi storage.ts)
    serverActions: { bodySizeLimit: "4mb" },
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Il pannello admin non deve mai essere indicizzato
        source: "/gestione-ar/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/gestione-ar",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
