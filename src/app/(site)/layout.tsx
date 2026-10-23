import { BackgroundGrid } from "@/components/layout/background-grid";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PointerSpotlight } from "@/components/layout/pointer-spotlight";
import { siteConfig } from "@/lib/site";

// Layout del sito pubblico (route group "(site)": non compare nell'URL).
// L'admin ha un layout suo, senza navbar e footer del sito.

// Dati strutturati per Google (rich results sulla persona)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  email: `mailto:${siteConfig.email}`,
  sameAs: Object.values(siteConfig.links),
  knowsAbout: ["PHP", "Laravel", "MySQL", "React", "Next.js", "TypeScript"],
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

      <script
        type="application/ld+json"
        // l'escape di "<" impedisce di chiudere il tag script con contenuti malevoli
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
