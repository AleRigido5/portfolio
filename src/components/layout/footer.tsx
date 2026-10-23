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
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © <CurrentYear /> {siteConfig.name}. Tutti i diritti riservati.
        </p>

        <ul className="flex gap-5">
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