"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { ProjectCardData } from "@/lib/data/projects";

type GalleryProject = ProjectCardData & { cover: NonNullable<ProjectCardData["cover"]> };

/**
 * Gallery a schermo intero dei progetti.
 * Usa il <dialog> nativo: focus intrappolato, Esc per chiudere e livello sopra
 * tutto il resto (anche sopra l'header con backdrop-blur) senza portal.
 */
export function ProjectGallery({
  projects,
  index,
  onChange,
  onClose,
}: {
  projects: GalleryProject[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = index !== null;
  const total = projects.length;
  const project = isOpen ? projects[index] : null;

  const go = (step: number) => {
    if (index === null || total < 2) return;
    onChange((index + step + total) % total); // ciclico: dopo l'ultimo torna al primo
  };

  // Apre/chiude il dialog e blocca lo scroll della pagina sotto
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={project ? `Immagine del progetto ${project.title}` : "Gallery progetti"}
      // Esc o chiusura del browser → aggiorna lo stato del genitore
      onClose={onClose}
      // Click sullo sfondo (fuori dal contenuto) → chiude
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      // Swipe su mobile
      onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
      // "open:flex" e non "flex": da chiuso il dialog deve restare display:none
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center bg-transparent p-4 text-foreground backdrop:bg-black/85 backdrop:backdrop-blur-sm open:flex sm:p-8"
    >
      {project && (
        <>
          <div
            key={project.id}
            className="flex max-h-full w-full max-w-5xl animate-fade-up flex-col overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl motion-reduce:animate-none"
          >
            <div className="relative shrink-0 bg-background">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={project.cover.width}
                height={project.cover.height}
                sizes="(min-width: 1088px) 1024px, 100vw"
                placeholder={project.cover.blurDataURL ? "blur" : "empty"}
                blurDataURL={project.cover.blurDataURL ?? undefined}
                className="mx-auto h-auto max-h-[62dvh] w-auto object-contain"
              />
            </div>

            <div className="border-t border-border p-5 sm:p-6">
              <p className="font-mono text-xs text-muted">
                {index! + 1} / {total}
                {project.year && ` · ${project.year}`}
                {project.client && ` · ${project.client}`}
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight">{project.title}</h3>
              {project.role && <p className="mt-0.5 text-sm text-accent">{project.role}</p>}

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty text-muted whitespace-pre-line">
                {project.description || project.summary}
              </p>

              <ul aria-label="Tecnologie usate" className="mt-4 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <li
                    key={tech.slug}
                    className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted"
                  >
                    {tech.name}
                  </li>
                ))}
              </ul>

              {(project.liveUrl || project.repoUrl) && (
                <div className="mt-5 flex gap-4 text-sm font-medium">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      Demo live ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      Codice ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <GalleryButton label="Chiudi" onClick={onClose} className="top-3 right-3 sm:top-5 sm:right-5">
            <path d="M6 6l12 12M18 6 6 18" />
          </GalleryButton>

          {total > 1 && (
            <>
              <GalleryButton
                label="Progetto precedente"
                onClick={() => go(-1)}
                className="top-1/2 left-2 -translate-y-1/2 sm:left-5"
              >
                <path d="m15 18-6-6 6-6" />
              </GalleryButton>
              <GalleryButton
                label="Progetto successivo"
                onClick={() => go(1)}
                className="top-1/2 right-2 -translate-y-1/2 sm:right-5"
              >
                <path d="m9 18 6-6-6-6" />
              </GalleryButton>
            </>
          )}
        </>
      )}
    </dialog>
  );
}

function GalleryButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-[background-color,transform] hover:bg-black/80 active:scale-95 motion-reduce:transition-none ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        {children}
      </svg>
    </button>
  );
}