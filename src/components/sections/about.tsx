import { getSkillGroups } from "@/lib/data/technologies";

// Come lavoro: testo statico, da personalizzare
const principles = [
  {
    title: "Dal dato all'interfaccia",
    text: "Parto dalla struttura del database e dalle regole di business, poi costruisco API e interfacce sopra fondamenta solide.",
  },
  {
    title: "Codice tipizzato e manutenibile",
    text: "TypeScript, convenzioni chiare e componenti riutilizzabili: il progetto resta facile da estendere anche dopo mesi.",
  },
  {
    title: "Prestazioni e accessibilità",
    text: "Pagine leggere, immagini ottimizzate e interfacce usabili da tastiera e screen reader, misurate con Lighthouse.",
  },
  {
    title: "Rilascio e manutenzione",
    text: "Deploy, migrazioni e aggiornamenti gestiti con cura, con un rapporto diretto e continuo con il cliente.",
  },
];

// Icone per categoria (SVG inline: niente richieste esterne)
const categoryIcons: Record<string, React.ReactNode> = {
  BACKEND: <path d="M4 6h16M4 12h16M4 18h16M7 6v.01M7 12v.01M7 18v.01" />,
  FRONTEND: <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" />,
  DATABASE: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </>
  ),
  DEVOPS: <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />,
  TOOL: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
};

// Server Component asincrono: legge le competenze dal database (in cache)
export async function About() {
  const skillGroups = await getSkillGroups();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-32">
        {/* Colonna sinistra: bio e metodo */}
        <div className="reveal">
          <p className="font-mono text-sm text-accent">01 — Chi sono</p>
          <h2
            id="about-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Sviluppatore full-stack, con il backend nel DNA.
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-pretty text-muted">
            <p>
              Sono Alessandro, sviluppatore web full-stack. Lavoro soprattutto
              con <strong className="font-medium text-foreground">PHP e Laravel</strong>{" "}
              e con i database relazionali, e realizzo interfacce moderne con{" "}
              <strong className="font-medium text-foreground">React e Next.js</strong>.
            </p>
            <p>
              Progetto e sviluppo gestionali, web app e siti su misura per aziende:
              dalla fatturazione alla logistica, dalle prenotazioni online ai
              pannelli di amministrazione. Seguo ogni progetto dall&apos;analisi
              al deploy, con un&apos;attenzione particolare a chiarezza del
              codice, prestazioni e semplicità d&apos;uso.
            </p>
          </div>

          <h3 className="mt-12 text-sm font-medium tracking-wider text-muted uppercase">
            Come lavoro
          </h3>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {principles.map((item, index) => (
              <li
                key={item.title}
                className="reveal flex gap-3"
                style={{ "--i": index % 2 } as React.CSSProperties}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 size-5 shrink-0 text-accent"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonna destra: competenze dal database */}
        <div className="reveal">
          <h3 className="text-sm font-medium tracking-wider text-muted uppercase">
            Competenze tecniche
          </h3>

          {skillGroups.length === 0 ? (
            <p className="mt-5 text-muted">Competenze in aggiornamento.</p>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {skillGroups.map((group, index) => (
                <li
                  key={group.category}
                  style={{ "--i": index % 2 } as React.CSSProperties}
                  className="spotlight reveal group rounded-2xl border border-border bg-surface p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5"
                      >
                        {categoryIcons[group.category]}
                      </svg>
                    </span>
                    <h4 className="font-medium text-foreground">{group.label}</h4>
                  </div>

                  <ul
                    aria-label={`Tecnologie ${group.label}`}
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {group.items.map((tech) => (
                      <li
                        key={tech.id}
                        className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        {tech.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}