import Image from "next/image";

import type { ProjectCardData } from "@/lib/data/projects";

// Le card stanno in griglia: 1 colonna su mobile, 2 da sm, 3 da lg.
// "sizes" dice al browser quale larghezza scaricare → immagini mai sovradimensionate
const IMAGE_SIZES = "(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw";

export function ProjectCard({
  project,
  activeTech,
}: {
  project: ProjectCardData;
  activeTech: string | null;
}) {
  const meta = [project.client, project.year].filter(Boolean).join(" · ");

  return (
    <article className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* Copertina: contenitore con proporzioni fisse → nessun layout shift */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-background">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={IMAGE_SIZES}
            placeholder={project.cover.blurDataURL ? "blur" : "empty"}
            blurDataURL={project.cover.blurDataURL ?? undefined}
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <CoverPlaceholder title={project.title} />
        )}

        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            In evidenza
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {meta && <p className="font-mono text-xs text-muted">{meta}</p>}

        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>
        {project.role && <p className="mt-0.5 text-sm text-accent">{project.role}</p>}

        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
          {project.summary}
        </p>

        <ul aria-label="Tecnologie usate" className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <li
              key={tech.slug}
              className={`rounded-md border px-2 py-0.5 font-mono text-xs transition-colors ${
                tech.slug === activeTech
                  ? "border-accent/50 bg-accent/10 text-foreground"
                  : "border-border bg-background text-muted"
              }`}
            >
              {tech.name}
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-auto flex gap-4 pt-5 text-sm font-medium">
            {project.liveUrl && (
              <ExternalLink href={project.liveUrl} label="Demo live" projectTitle={project.title}>
                <path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </ExternalLink>
            )}
            {project.repoUrl && (
              <ExternalLink href={project.repoUrl} label="Codice" projectTitle={project.title}>
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ExternalLink({
  href,
  label,
  projectTitle,
  children,
}: {
  href: string;
  label: string;
  projectTitle: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-sm text-foreground transition-colors hover:text-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        {children}
      </svg>
      {label}
      {/* Testo completo per screen reader: "Demo live di Gestionale aziendale..." */}
      <span className="sr-only">
        {" "}
        di {projectTitle} (si apre in una nuova scheda)
      </span>
    </a>
  );
}

// Copertina generata in CSS quando l'immagine non è ancora disponibile
function CoverPlaceholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_25%,transparent),transparent_60%),linear-gradient(135deg,var(--surface),var(--background))]"
    >
      <span className="font-mono text-4xl font-semibold text-accent/70 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none">
        {title
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </span>
    </div>
  );
}