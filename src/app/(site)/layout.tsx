import Script from "next/script";

import { BackgroundGrid } from "@/components/layout/background-grid";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PointerSpotlight } from "@/components/layout/pointer-spotlight";
import { siteConfig, socialProfiles } from "@/lib/site";

// Layout del sito pubblico (route group "(site)": non compare nell'URL).
// L'admin ha un layout suo, senza navbar e footer del sito.

// Dati strutturati per Google (schema.org): descrivono chi sei, cosa offri
// e il sito, collegati tra loro tramite "@id"
const personId = `${siteConfig.url}/#person`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "it-IT",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
      url: siteConfig.url,
      jobTitle: "Sviluppatore web full-stack",
      email: `mailto:${siteConfig.email}`,
      ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
      knowsAbout: ["PHP", "Laravel", "MySQL", "React", "Next.js", "TypeScript", "Sviluppo di siti web", "Sviluppo di gestionali"],
      knowsLanguage: "it",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#service`,
      name: `${siteConfig.name} – Sviluppo web`,
      url: siteConfig.url,
      image: `${siteConfig.url}/opengraph-image`,
      email: siteConfig.email,
      description: siteConfig.description,
      founder: { "@id": personId },
      areaServed: siteConfig.area
        ? [{ "@type": "Place", name: siteConfig.area }, { "@type": "Country", name: "Italia" }]
        : { "@type": "Country", name: "Italia" },
      ...(siteConfig.area
        ? { address: { "@type": "PostalAddress", addressLocality: siteConfig.area, addressCountry: "IT" } }
        : {}),
      serviceType: [
        "Realizzazione di siti web",
        "Sviluppo di web app",
        "Sviluppo di gestionali su misura",
        "Sistemi di prenotazione online",
        "Pannelli di amministrazione",
        "Manutenzione e restyling di siti web",
      ],
    },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Primo elemento focusabile: permette di saltare la navigazione da tastiera */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
      >
        Vai al contenuto principale
      </a>

      <BackgroundGrid />
      <Navbar />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <Footer />
      <PointerSpotlight />

      {/* Script di iubenda per i link "Privacy policy" (richiesto dal piano Free).
          lazyOnload: viene caricato solo quando la pagina è completamente pronta,
          così non pesa sulla velocità del sito */}
      <Script src="https://cdn.iubenda.com/iubenda.js" strategy="lazyOnload" />

      <script
        type="application/ld+json"
        // l'escape di "<" impedisce di chiudere il tag script con contenuti malevoli
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}