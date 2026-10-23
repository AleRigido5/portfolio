"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";

import type { ProjectCardData } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectGallery } from "./project-gallery";

type Filter = { slug: string; name: string; count: number };

// Il filtro avviene nel browser: la pagina resta statica (niente searchParams)
// e il cambio di filtro è istantaneo, senza richieste al server
export function ProjectsGrid({
  projects,
  filters,
}: {
  projects: ProjectCardData[];
  filters: Filter[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      active
        ? projects.filter((p) => p.technologies.some((t) => t.slug === active))
        : projects,
    [active, projects],
  );

  const activeName = filters.find((f) => f.slug === active)?.name;

  // Gallery: solo i progetti visibili (rispetta il filtro) che hanno un'immagine
  const gallery = useMemo(
    () => visible.filter((p): p is typeof p & { cover: NonNullable<typeof p.cover> } => p.cover !== null),
    [visible],
  );
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  // Con la View Transitions API le card si spostano/riordinano con un'animazione
  // fluida invece di "saltare". Browser senza supporto: cambio immediato.
  function changeFilter(next: string | null) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      setActive(next);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setActive(next));
    });
  }

  return (
    <>
      {/* Barra filtri: pulsanti toggle con aria-pressed */}
      <div
        role="group"
        aria-label="Filtra i progetti per tecnologia"
        className="mt-10 flex flex-wrap gap-2"
      >
        <FilterButton
          label="Tutti"
          count={projects.length}
          pressed={active === null}
          onClick={() => changeFilter(null)}
        />
        {filters.map((filter) => (
          <FilterButton
            key={filter.slug}
            label={filter.name}
            count={filter.count}
            pressed={active === filter.slug}
            onClick={() => changeFilter(active === filter.slug ? null : filter.slug)}
          />
        ))}
      </div>

      {/* Annuncio per screen reader quando cambia il filtro */}
      <p aria-live="polite" className="sr-only">
        {`${visible.length} ${visible.length === 1 ? "progetto" : "progetti"}`}
        {activeName ? ` con ${activeName}` : " in totale"}
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <li
            key={project.id}
            className="reveal"
            style={
              {
                "--i": index % 3,
                // Nome univoco: permette al browser di animare ogni card nella nuova posizione
                viewTransitionName: `project-${project.slug}`,
              } as React.CSSProperties
            }
          >
            <ProjectCard
              project={project}
              activeTech={active}
              onOpenImage={() => setGalleryIndex(gallery.findIndex((p) => p.id === project.id))}
            />
          </li>
        ))}
      </ul>

      <ProjectGallery
        projects={gallery}
        index={galleryIndex}
        onChange={setGalleryIndex}
        onClose={() => setGalleryIndex(null)}
      />
    </>
  );
}

function FilterButton({
  label,
  count,
  pressed,
  onClick,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.96] motion-reduce:transition-none ${
        pressed
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground"
      }`}
    >
      {label}
      <span
        className={`font-mono text-xs ${pressed ? "opacity-80" : "opacity-60"}`}
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}