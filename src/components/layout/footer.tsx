import { cacheLife } from "next/cache";

import { siteConfig } from "@/lib/site";

// Con Cache Components (Next.js 16) un valore che cambia nel tempo come new Date()
// va messo in cache esplicitamente: l'anno viene calcolato al build e
// ricalcolato al massimo una volta al giorno, così la pagina resta statica.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github, external: true },
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  { label: "Email", href: `mailto:${siteConfig.email}`, external: false },
].filter((link) => !link.href.includes("tuo-")); // niente link segnaposto

const legalLinks = [
  { label: "Privacy policy", href: siteConfig.privacyPolicyUrl },
  { label: "Cookie policy", href: siteConfig.cookiePolicyUrl },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Mobile e tablet: tutto centrato e in colonna (testo sopra, link sotto).
          Da md in su: testo a sinistra e link a destra sulla stessa riga */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted sm:px-6 md:flex-row md:justify-between md:text-left">
        <p>
          © <CurrentYear /> {siteConfig.name}. Tutti i diritti riservati.
        </p>

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {/* Classi iubenda: lo script (caricato nel layout) gestisce i link alle policy.
              "iubenda-nostyle" mantiene lo stile del sito invece del pulsante di iubenda */}
          {legalLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                title={link.label}
                target="_blank"
                rel="noopener"
                className="iubenda-noiframe iubenda-embed iubenda-nostyle rounded-sm transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </li>
          ))}
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="rounded-sm transition-colors hover:text-foreground"
              >
                {link.label}
                {link.external && (
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}