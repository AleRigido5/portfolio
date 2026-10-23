// =============================================================
//  Configurazione centrale del sito: usata da layout, metadata,
//  navbar, footer, sitemap e dati strutturati (JSON-LD).
// =============================================================

export const siteConfig = {
  name: "Alessandro Rigido",
  role: "Full-stack Web Developer",
  description:
    "Sviluppatore web full-stack specializzato in PHP/Laravel, database e web app moderne con React e Next.js. Gestionali, siti e applicazioni su misura.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "it_IT",
  email: "alessandro.designstudio@gmail.com",
  keywords: [
    "sviluppatore web",
    "full-stack developer",
    "Laravel",
    "PHP",
    "Next.js",
    "React",
    "MySQL",
    "gestionali su misura",
  ],
  links: {
    github: "https://github.com/AleRigido5",
    // linkedin: "https://www.linkedin.com/in/tuo-profilo",
  },
  // "/#..." invece di "#..." così i link funzionano anche dalle pagine di dettaglio
  nav: [
    { label: "Chi sono", href: "/#about" },
    { label: "Progetti", href: "/#projects" },
    { label: "Esperienze", href: "/#experience" },
    { label: "Contatti", href: "/#contact" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];