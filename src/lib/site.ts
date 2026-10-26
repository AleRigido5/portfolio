// =============================================================
//  Configurazione centrale del sito: usata da layout, metadata,
//  navbar, footer, sitemap e dati strutturati (JSON-LD).
// =============================================================

export const siteConfig = {
  name: "Alessandro Rigido",
  role: "Full-stack Web Developer",
  // Titolo della home su Google (max ~60 caratteri visibili): parole chiave prima, nome dopo
  title: "Alessandro Rigido | Sviluppatore Web Full-stack",
  // Descrizione su Google (max ~155 caratteri): cosa fai, con cosa, e un invito all'azione
  description:
    "Sviluppatore web full-stack. Progetto e realizzo siti web, web app e gestionali su misura per aziende e attività locali. Scopri i miei lavori",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "it_IT",
  email: "alessandro.designstudio@gmail.com",
  // Privacy e cookie policy generate con iubenda
  privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/48607351",
  cookiePolicyUrl: "https://www.iubenda.com/privacy-policy/48607351/cookie-policy",
  // Zona in cui lavori (SEO locale), es. "Bari, Puglia". Lascia "" se non vuoi indicarla.
  area: "",
  // Il meta tag "keywords" Google lo ignora: queste parole servono soprattutto
  // come promemoria di cosa scrivere nei testi (titoli, paragrafi, descrizioni dei progetti)
  keywords: [
    "sviluppatore web",
    "sviluppatore web full-stack",
    "realizzazione siti web",
    "sito web aziendale",
    "sviluppo siti web su misura",
    "programmatore web",
    "sviluppo gestionali su misura",
    "gestionale web aziendale",
    "sviluppo web app",
    "software su misura per aziende",
    "sviluppatore Laravel",
    "sviluppatore PHP",
    "sviluppatore Next.js",
    "sviluppatore React",
    "sistema di prenotazione online",
  ],
  // Profili pubblici: quelli lasciati con "tuo-..." vengono ignorati da JSON-LD e footer
  links: {
    github: "https://github.com/AleRigido5",
    linkedin: "https://www.linkedin.com/in/tuo-profilo",
  },
  // "/#..." invece di "#..." così i link funzionano anche dalle pagine di dettaglio
  nav: [
    { label: "Chi sono", href: "/#about" },
    { label: "Servizi", href: "/#services" },
    { label: "Progetti", href: "/#projects" },
    { label: "Esperienze", href: "/#experience" },
    { label: "Contatti", href: "/#contact" },
  ],
} as const;

/** Link social realmente compilati (esclude i segnaposto "tuo-...") */
export const socialProfiles = Object.values(siteConfig.links).filter((url) => !url.includes("tuo-"));

export type NavItem = (typeof siteConfig.nav)[number];