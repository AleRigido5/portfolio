// Servizi offerti: testo statico (Server Component, zero JavaScript nel browser)
const services = [
  {
    title: "Siti web",
    text: "Siti vetrina e aziendali moderni, veloci e ottimizzati per i motori di ricerca, perfetti da smartphone e computer.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
      </>
    ),
  },
  {
    title: "Web app",
    text: "Applicazioni su misura utilizzabili dal browser: aree riservate, dashboard e strumenti interni per lavorare meglio.",
    icon: <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" />,
  },
  {
    title: "Gestionali su misura",
    text: "Software per fatturazione, magazzino, anagrafiche e scadenze, costruito sui processi reali della tua attività.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    title: "Prenotazioni e vendite online",
    text: "Sistemi di prenotazione con calendario delle disponibilità e negozi online semplici da gestire.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
      </>
    ),
  },
  {
    title: "Pannelli di amministrazione",
    text: "Aree di gestione con cui aggiorni contenuti, prodotti e dati in autonomia, senza dover chiedere ogni volta.",
    icon: (
      <>
        <path d="M4 6h10M4 12h6M4 18h10" />
        <circle cx="17" cy="6" r="2" />
        <circle cx="13" cy="12" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  },
  {
    title: "Manutenzione e restyling",
    text: "Aggiornamenti, correzioni, nuove funzionalità e rinnovo grafico di siti e applicazioni già esistenti.",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm text-accent">02 — Servizi</p>
          <h2
            id="services-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Cosa posso realizzare per te
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
            Dal sito vetrina all&apos;applicazione aziendale: progetti web completi,
            pensati per le esigenze di aziende, professionisti e attività locali.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li
              key={service.title}
              style={{ "--i": index % 3 } as React.CSSProperties}
              className="spotlight reveal group rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
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
                  {service.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{service.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}