import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

// Genera /robots.txt
// Il pannello admin NON è elencato qui (renderebbe pubblico l'indirizzo):
// è già escluso dai motori di ricerca con meta tag e header X-Robots-Tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}