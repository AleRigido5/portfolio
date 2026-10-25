import Link from "next/link";
import {
  siLaravel,
  siLivewire,
  siMysql,
  siNextdotjs,
  siPhp,
  siReact,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

import { TechIcon } from "@/components/ui/tech-icon";
import { siteConfig } from "@/lib/site";

// Importando le singole icone, nel bundle finiscono solo queste (tree-shaking)
const stack = [
  siPhp,
  siLaravel,
  siLivewire,
  siMysql,
  siReact,
  siNextdotjs,
  siTypescript,
  siTailwindcss,
];

// Server Component, zero JavaScript nel browser.
// L'<h1> è l'elemento LCP: il testo NON viene animato, così compare subito.
// Si animano solo decorazioni ed elementi secondari, sempre con motion-safe.
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Bagliori in movimento (la griglia ora è lo sfondo globale, in BackgroundGrid) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* Gradienti radiali (niente filter: blur): stesso effetto morbido, costo minimo */}
        <div className="absolute top-[-18rem] left-[2%] size-[38rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_28%,transparent),transparent)] will-change-transform motion-safe:animate-aurora-1" />
        <div className="absolute top-[-12rem] right-[-4%] size-[34rem] bg-[radial-gradient(closest-side,rgb(217_70_239/0.16),transparent)] will-change-transform motion-safe:animate-aurora-2" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start px-4 pt-20 sm:px-6 sm:pt-28 lg:pt-36">
        {/* Badge disponibilità */}
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur motion-safe:animate-fade-up">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Disponibile per nuovi progetti
        </p>

        <p className="mt-8 font-mono text-sm text-accent">
          {siteConfig.name} — {siteConfig.role}
        </p>

        <h1
          id="hero-title"
          className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          Sviluppo web app e gestionali{" "}
          {/* "su misura" e la virgola restano sempre sulla stessa riga */}
          <span className="whitespace-nowrap">
            <span className="relative inline-block text-accent">
              su misura
            </span>
            ,
          </span>{" "}
          veloci e affidabili.
        </h1>


        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted motion-safe:animate-fade-up"
          style={{ animationDelay: "80ms" }}
        > 
          Realizzo applicazioni web complete: backend solidi con
          PHP, Laravel e MySQL, interfacce moderne con React e Next.js. 
          Seguo ogni progetto dal database alla pubblicazione online, con cura per le prestazioni e i dettagli.
        </p>

        {/* Call to action */}
        <div
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row motion-safe:animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            href="/#projects"
            className="shine group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/25 transition-[opacity,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Vedi i progetti
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.64l-4.22-4.22a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.22-4.22H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Contattami
          </Link>
        </div>

        {/* Etichetta dello stack: il nastro vero e proprio è sotto, a tutta larghezza */}
        <p
          className="mt-16 text-xs font-medium tracking-wider text-muted uppercase motion-safe:animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          Tecnologie che uso
        </p>

        {/* Elenco per screen reader: il nastro visivo è decorativo */}
        <ul className="sr-only">
          {stack.map((tech) => (
            <li key={tech.slug}>{tech.title}</li>
          ))}
        </ul>
      </div>

      {/* Nastro delle tecnologie a tutta larghezza dello schermo */}
      <div
        aria-hidden="true"
        // mask-image: le icone sfumano entrando ed uscendo ai bordi dello schermo
        className="overflow-hidden pt-6 pb-20 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] motion-safe:animate-fade-up motion-reduce:overflow-visible motion-reduce:[mask-image:none] sm:pb-28 sm:[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex w-max motion-safe:animate-marquee motion-reduce:mx-auto motion-reduce:w-auto motion-reduce:max-w-6xl motion-reduce:px-4 sm:motion-reduce:px-6">
          {/* Due copie identiche: traslando del 50% il giro è senza interruzioni */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className={`flex shrink-0 items-center gap-12 py-2 pr-12 sm:gap-20 sm:pr-20 ${
                copy === 1 ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:gap-8"
              }`}
            >
              {/* Icone ripetute 3 volte per copia: ogni copia è più larga anche
                  di uno schermo molto grande, così il nastro non ha mai buchi */}
              {[...stack, ...stack, ...stack].map((tech, index) => (
                <span
                  key={`${tech.slug}-${index}`}
                  title={tech.title}
                  className={`inline-flex shrink-0 text-foreground transition-transform duration-300 hover:scale-125 motion-reduce:transition-none ${
                    index >= stack.length ? "motion-reduce:hidden" : ""
                  }`}
                >
                  <TechIcon icon={tech} className="size-10 sm:size-14" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}