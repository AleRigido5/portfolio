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
  { label: "Privacy Policy", href: siteConfig.privacyPolicyUrl },
  { label: "Cookie Policy", href: siteConfig.cookiePolicyUrl },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Script ufficiale di iubenda (lo stesso del codice di integrazione).
          React 19 lo inserisce nell'HTML della pagina, lo carica una sola volta
          e in modo asincrono: non rallenta il sito. È lui che trasforma i link
          con la classe "iubenda-embed" e che lo scanner di iubenda cerca. */}
      <script src="https://cdn.iubenda.com/iubenda.js" async />

      {/* Mobile e tablet: tutto centrato e in colonna (testo sopra, link sotto).
          Da md in su: testo a sinistra e link a destra sulla stessa riga */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted sm:px-6 md:flex-row md:justify-between md:text-left">
        <p>
          © <CurrentYear /> {siteConfig.name}. Tutti i diritti riservati.
        </p>

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {/* Pulsanti ufficiali iubenda: bianco con il tema chiaro, nero con lo scuro.
              Ci sono entrambi nell'HTML, ma lo span con display:none nasconde quello
              che non serve (anche agli screen reader, quindi niente link doppi). */}
          {legalLinks.map((link) => (
            <li key={link.label} className="flex items-center">
              <span className="dark:hidden">
                <a href={link.href} title={link.label} className="iubenda-white iubenda-noiframe iubenda-embed">
                  {link.label}
                </a>
              </span>
              <span className="hidden dark:inline">
                <a href={link.href} title={link.label} className="iubenda-black iubenda-noiframe iubenda-embed">
                  {link.label}
                </a>
              </span>
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