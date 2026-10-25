import { getWorkExperiences, type ExperienceItem } from "@/lib/data/experiences";

// Le colonne DATE di MySQL arrivano come mezzanotte UTC:
// formattiamo in UTC per non slittare al mese precedente
const monthYear = new Intl.DateTimeFormat("it-IT", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonth(iso: string) {
  const label = monthYear.format(new Date(iso)).replace(".", "");
  return label.charAt(0).toUpperCase() + label.slice(1); // "Gen 2026"
}

export async function Experience() {
  const experiences = await getWorkExperiences();

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:py-32">
        {/* Intestazione: resta fissa durante lo scroll su desktop */}
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-sm text-accent">04 — Esperienze</p>
          <h2
            id="experience-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Percorso professionale
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
            Software utilizzato ogni giorno in azienda, dalle prenotazioni online
            alla gestione amministrativa: progettato e sviluppato dal database
            all&apos;interfaccia.
          </p>
        </div>

        {experiences.length === 0 ? (
          <p className="text-muted">Esperienze in aggiornamento.</p>
        ) : (
          <ol className="relative">
            {experiences.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={index === experiences.length - 1}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function TimelineItem({ item, isLast }: { item: ExperienceItem; isLast: boolean }) {
  const isCurrent = item.endDate === null;

  return (
    <li className="relative pb-12 pl-10 last:pb-0">
      {/* Linea verticale: sfuma verso il basso sull'ultima voce */}
      <span
        aria-hidden="true"
        className={`absolute top-3 bottom-0 left-[7px] w-px ${
          isLast ? "bg-gradient-to-b from-border to-transparent" : "bg-border"
        }`}
      />

      {/* Linea accent che si "disegna" scorrendo, sopra quella grigia */}
      <span
        aria-hidden="true"
        className="timeline-draw absolute top-3 bottom-0 left-[7px] w-px origin-top scale-y-0 bg-gradient-to-b from-accent to-accent/0"
      />

      {/* Punto sulla linea: pulsa se l'esperienza è in corso */}
      <span aria-hidden="true" className="absolute top-1.5 left-0 flex size-[15px]">
        {isCurrent && (
          <span className="absolute inline-flex size-full rounded-full bg-accent/40 motion-safe:animate-ping" />
        )}
        <span className="relative inline-flex size-[15px] rounded-full border-2 border-accent bg-background" />
      </span>

      <article className="spotlight reveal group rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 motion-reduce:transition-none sm:p-7">
        {/* Periodo */}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted">
          <span>
            <time dateTime={item.startDate}>{formatMonth(item.startDate)}</time>
            {" — "}
            {item.endDate ? (
              <time dateTime={item.endDate}>{formatMonth(item.endDate)}</time>
            ) : (
              "Presente"
            )}
          </span>
          {isCurrent && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-sans font-medium text-accent">
              In corso
            </span>
          )}
        </p>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          {item.role}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
            >
              {item.organization}
              <span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>
          ) : (
            item.organization
          )}
          {item.location && <> · {item.location}</>}
        </p>

        {item.description && (
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
            {item.description}
          </p>
        )}

        {item.highlights.length > 0 && (
          <>
            <h4 className="mt-6 text-xs font-medium tracking-wider text-muted uppercase">
              Principali attività
            </h4>
            <ul className="mt-3 space-y-2.5">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="reveal flex gap-3 text-sm leading-relaxed text-foreground"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-0.5 size-4 shrink-0 text-accent"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {highlight}
                </li>
              ))}
            </ul>
          </>
        )}

        {item.technologies.length > 0 && (
          <ul aria-label="Tecnologie usate" className="mt-6 flex flex-wrap gap-1.5">
            {item.technologies.map((tech) => (
              <li
                key={tech.slug}
                className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted"
              >
                {tech.name}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}