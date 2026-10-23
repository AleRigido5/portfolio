import Link from "next/link";

import { siteConfig } from "@/lib/site";

const stack = ["PHP", "Laravel", "MySQL", "React", "Next.js", "TypeScript"];

// Server Component, zero JavaScript nel browser.
// L'<h1> è l'elemento LCP: NON viene animato, così compare subito (LCP veloce).
// Le animazioni riguardano solo gli elementi secondari e rispettano prefers-reduced-motion.
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Sfondo decorativo in solo CSS: griglia sfumata + bagliore accent */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-60" />
        <div className="absolute top-[-10rem] left-1/2 h-[28rem] w-[min(48rem,100%)] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:pt-36">
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
          <span className="text-accent">su misura</span>, veloci e affidabili.
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted motion-safe:animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Progetto e realizzo applicazioni web complete: backend solidi con
          PHP, Laravel e MySQL, interfacce moderne con React e Next.js. Dal
          database al deploy, con attenzione a prestazioni e dettagli.
        </p>

        {/* Call to action */}
        <div
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row motion-safe:animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            href="/#projects"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-[opacity,transform,box-shadow] duration-200 hover:opacity-90 hover:shadow-accent/30 active:scale-[0.97] motion-reduce:transition-none"
          >
            Vedi i progetti
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
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
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97] motion-reduce:transition-none"
          >
            Contattami
          </Link>
        </div>

        {/* Stack principale */}
        <div
          className="mt-14 motion-safe:animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <p className="text-xs font-medium tracking-wider text-muted uppercase">
            Stack principale
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border bg-surface/60 px-2.5 py-1 font-mono text-xs text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}