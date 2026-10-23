// =============================================================
//  Seed del portfolio — eseguire con: npx prisma db seed
//  È idempotente: puoi rilanciarlo quante volte vuoi senza duplicati.
// =============================================================
//  NB: qui NON importiamo src/lib/prisma.ts perché contiene "server-only",
//  che va in errore fuori da Next.js. Lo seed crea il proprio client.
// =============================================================

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDbAdapter } from "../src/lib/db-adapter";

const adapter = createDbAdapter(); // stessa connessione dell'app (SSL incluso)
const prisma = new PrismaClient({ adapter });

// -------------------------------------------------------------
//  TECNOLOGIE
// -------------------------------------------------------------

const technologies = [
  { name: "PHP", slug: "php", category: "BACKEND", sortOrder: 1 },
  { name: "Laravel", slug: "laravel", category: "BACKEND", sortOrder: 2 },
  { name: "Livewire", slug: "livewire", category: "BACKEND", sortOrder: 3 },
  { name: "Node.js", slug: "nodejs", category: "BACKEND", sortOrder: 4 },

  { name: "TypeScript", slug: "typescript", category: "FRONTEND", sortOrder: 1 },
  { name: "React", slug: "react", category: "FRONTEND", sortOrder: 2 },
  { name: "Next.js", slug: "nextjs", category: "FRONTEND", sortOrder: 3 },
  { name: "Inertia.js", slug: "inertiajs", category: "FRONTEND", sortOrder: 4 },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "FRONTEND", sortOrder: 5 },

  { name: "MySQL", slug: "mysql", category: "DATABASE", sortOrder: 1 },
  { name: "PostgreSQL", slug: "postgresql", category: "DATABASE", sortOrder: 2 },
  { name: "Prisma", slug: "prisma", category: "DATABASE", sortOrder: 3 },

  { name: "Git", slug: "git", category: "TOOL", sortOrder: 1 },
  { name: "Docker", slug: "docker", category: "DEVOPS", sortOrder: 1 },
  { name: "Vercel", slug: "vercel", category: "DEVOPS", sortOrder: 2 },
] as const;

// -------------------------------------------------------------
//  PROGETTI  (testi e immagini da sostituire con i tuoi)
//  Le immagini vanno messe in public/projects/ — 1600x900 in .webp
// -------------------------------------------------------------

const projects = [
  {
    slug: "gestionale-aziendale",
    title: "Gestionale aziendale",
    summary:
      "Gestionale web per fatturazione, prima nota, DDT, parco mezzi e anagrafiche clienti/fornitori.",
    description:
      "Applicazione Laravel + Livewire con pannello amministrativo completo: fatture di vendita e acquisto, scadenzario pagamenti, generazione PDF dei documenti di trasporto e statistiche sul fatturato.",
    coverImage: "/projects/gestionale-aziendale.webp",
    coverAlt: "Dashboard del gestionale con elenco fatture e grafico del fatturato mensile",
    role: "Full-stack developer",
    client: null,
    featured: true,
    published: true,
    sortOrder: 1,
    completedAt: new Date("2026-08-01"),
    tech: ["php", "laravel", "livewire", "mysql", "tailwindcss"],
  },
  {
    slug: "booking-agriturismo",
    title: "Prenotazioni agriturismo",
    summary:
      "Sito e sistema di prenotazione online per una struttura ricettiva, con gestione disponibilità.",
    description:
      "Sito pubblico per la struttura e area di gestione delle prenotazioni, con calendario disponibilità e pannello admin.",
    coverImage: "/projects/booking-agriturismo.webp",
    coverAlt: "Pagina di prenotazione con calendario delle disponibilità",
    role: "Full-stack developer",
    client: null,
    featured: true,
    published: true,
    sortOrder: 2,
    completedAt: new Date("2026-05-01"),
    tech: ["laravel", "react", "inertiajs", "mysql", "tailwindcss"],
  },
  {
    slug: "portfolio-nextjs",
    title: "Portfolio personale",
    summary:
      "Questo sito: Next.js App Router, Server Actions e Prisma, ottimizzato per Lighthouse 100.",
    description: null,
    coverImage: "/projects/portfolio-nextjs.webp",
    coverAlt: "Home page del portfolio in modalità scura",
    role: "Design & sviluppo",
    client: null,
    featured: false,
    published: true,
    sortOrder: 3,
    completedAt: null,
    tech: ["nextjs", "react", "typescript", "tailwindcss", "prisma", "mysql"],
    repoUrl: "https://github.com/tuo-utente/portfolio",
  },
];

// -------------------------------------------------------------
//  ESPERIENZE  (da sostituire con il tuo percorso reale)
// -------------------------------------------------------------

const experiences = [
  {
    type: "WORK",
    role: "Full-stack Developer",
    organization: "Azienda privata", // nome non mostrato per scelta
    location: "Italia",
    startDate: new Date("2026-01-01"),
    endDate: null, // in corso
    description:
      "Sviluppo e mantengo il software dell'azienda: il sito della struttura ricettiva con la web app di prenotazione e il gestionale interno usato ogni giorno per l'amministrazione.",
    highlights: [
      "Sito del resort con web app di prenotazione online",
      "Gestionale aziendale per fatturazione di vendita e acquisto",
      "Prima nota e scadenzario dei pagamenti",
      "Documenti di trasporto (DDT) con generazione PDF",
      "Gestione parco mezzi con monitoraggio delle scadenze",
      "Anagrafiche clienti e fornitori",
    ],
    sortOrder: 1,
    tech: ["php", "laravel", "livewire", "react", "inertiajs", "mysql", "tailwindcss"],
  },
] as const;

// -------------------------------------------------------------

async function main() {
  console.log("🌱 Seed in corso...");

  // 1. Tecnologie (upsert per slug)
  for (const t of technologies) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      update: { name: t.name, category: t.category, sortOrder: t.sortOrder },
      create: { ...t },
    });
  }
  console.log(`  ✓ ${technologies.length} tecnologie`);

  // 2. Progetti (upsert per slug, relazioni sostituite con "set")
  for (const { tech, ...p } of projects) {
    const data = {
      ...p,
      coverWidth: 1600,
      coverHeight: 900,
    };
    const technologiesRel = tech.map((slug) => ({ slug }));

    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { ...data, technologies: { set: technologiesRel } },
      create: { ...data, technologies: { connect: technologiesRel } },
    });
  }
  console.log(`  ✓ ${projects.length} progetti`);

  // 3. Esperienze (non hanno un campo unico: si ricreano da zero)
  await prisma.experience.deleteMany();
  for (const { tech, highlights, ...e } of experiences) {
    await prisma.experience.create({
      data: {
        ...e,
        highlights: [...highlights],
        technologies: { connect: tech.map((slug) => ({ slug })) },
      },
    });
  }
  console.log(`  ✓ ${experiences.length} esperienze`);

  console.log("✅ Seed completato");
}

main()
  .catch((error) => {
    console.error("❌ Errore durante il seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });