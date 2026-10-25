import { getPublishedProjects, type ProjectTech } from "@/lib/data/projects";
import { ProjectsGrid } from "./projects-grid";

// Server Component: legge i progetti (in cache) e prepara i filtri.
// Solo la griglia filtrabile è un Client Component.
export async function Projects() {
  const projects = await getPublishedProjects();

  // Filtri = tecnologie effettivamente usate nei progetti, ordinate per frequenza
  const counts = new Map<string, { tech: ProjectTech; count: number }>();
  for (const project of projects) {
    for (const tech of project.technologies) {
      const entry = counts.get(tech.slug);
      if (entry) entry.count += 1;
      else counts.set(tech.slug, { tech, count: 1 });
    }
  }
  const filters = [...counts.values()]
    .sort((a, b) => b.count - a.count || a.tech.name.localeCompare(b.tech.name))
    .map(({ tech, count }) => ({ ...tech, count }));

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm text-accent">02 — Progetti</p>
          <h2
            id="projects-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Progetti selezionati
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
            Gestionali, web app e siti realizzati per aziende e privati. Usa i
            filtri per vedere i progetti in base alla tecnologia utilizzata.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="mt-12 text-muted">Nuovi progetti in arrivo.</p>
        ) : (
          <ProjectsGrid projects={projects} filters={filters} />
        )}
      </div>
    </section>
  );
}