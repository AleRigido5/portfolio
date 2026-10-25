// =============================================================
//  Configurazione centrale del sito: usata da layout, metadata,
//  navbar, footer, sitemap e dati strutturati (JSON-LD).
// =============================================================


export const siteConfig = {
  name: "Alessandro Rigido",
  role: "Full-stack Web Developer",

  // Titolo SEO: servizi principali e nome
  title:
    "Alessandro Rigido | Sviluppatore Web Full-stack",

  // Descrizione SEO
  description:
    "Sviluppatore web full-stack specializzato in gestionali aziendali, web app e siti web su misura con PHP, Laravel, MySQL, React e Next.js. Contattami per il tuo progetto.",

  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ar-webdev.it"
  ).replace(/\/$/, ""),

  locale: "it_IT",
  email: "alessandro.designstudio@gmail.com",

  // Privacy e cookie policy generate con iubenda
  privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/48607351",
  cookiePolicyUrl: "https://www.iubenda.com/privacy-policy/48607351/cookie-policy",

  // Area geografica di riferimento
  area: "Gioia del Colle (BA), Puglia",

  // Argomenti e servizi da utilizzare nei contenuti SEO
  keywords: [
    "sviluppatore web full-stack",
    "programmatore web freelance",
    "sviluppo gestionali aziendali",
    "gestionali web personalizzati",
    "software gestionale su misura",
    "sviluppo applicazioni web",
    "realizzazione siti web",
    "sviluppatore Laravel",
    "sviluppatore PHP",
    "sviluppatore MySQL",
    "sviluppatore React",
    "sviluppatore Next.js",
    "sviluppo frontend e backend",
    "database SQL",
    "digitalizzazione processi aziendali",
    "sviluppatore web Puglia",
    "sviluppatore web Bari",
  ],
  // Profili pubblici: quelli lasciati con "tuo-..." vengono ignorati da JSON-LD e footer
  links: {
    github: "https://github.com/AleRigido5",
    linkedin: "https://www.linkedin.com/in/tuo-profilo",
  },
  // "/#..." invece di "#..." così i link funzionano anche dalle pagine di dettaglio
  nav: [
    { label: "Chi sono", href: "/#about" },
    { label: "Progetti", href: "/#projects" },
    { label: "Esperienze", href: "/#experience" },
    { label: "Contatti", href: "/#contact" },
  ],
} as const;

/** Link social realmente compilati (esclude i segnaposto "tuo-...") */
export const socialProfiles = Object.values(siteConfig.links).filter((url) => !url.includes("tuo-"));

export type NavItem = (typeof siteConfig.nav)[number];