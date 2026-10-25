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
    title: "Gestionale aziendale su misura",
    summary:
      "Web app gestionale che riunisce fatturazione, prima nota, documenti di trasporto, parco mezzi e anagrafiche in un'unica piattaforma.",
    description: [
      "Applicazione web sviluppata con Laravel e Livewire, utilizzata ogni giorno dal personale amministrativo dell'azienda. Riunisce in un'unica piattaforma le principali attività di gestione:",
      "",
      "• fatture di vendita e di acquisto, con note di credito e scadenzario dei pagamenti;",
      "• prima nota e statistiche sul fatturato;",
      "• documenti di trasporto con generazione automatica dei PDF;",
      "• parco mezzi con il controllo delle scadenze;",
      "• anagrafiche di clienti e fornitori.",
      "",
      "L'accesso è riservato e ogni utente dispone di ruoli e permessi dedicati.",
    ].join("\n"),
    coverImage: "/projects/gestionale-aziendale.webp",
    coverAlt: "Dashboard del gestionale aziendale con ultimi pagamenti e comunicazioni",
    role: "Web app · Sviluppo full-stack",
    client: null,
    featured: true,
    published: true,
    sortOrder: 1,
    completedAt: new Date("2026-08-01"),
    tech: ["php", "laravel", "livewire", "mysql", "tailwindcss"],
  },
  {
    slug: "booking-agriturismo",
    title: "Sito web con prenotazioni online",
    summary:
      "Sito web per una struttura ricettiva con sistema di prenotazione online, calendario delle disponibilità e area di gestione.",
    description: [
      "Sito web responsive che presenta la struttura e i servizi offerti, con un sistema di prenotazione integrato: gli ospiti verificano le date disponibili e inviano la prenotazione direttamente online.",
      "",
      "Il gestore dispone di un'area di amministrazione riservata, da cui controlla prenotazioni e calendario delle disponibilità in autonomia.",
      "",
      "Realizzato con Laravel per la parte server e React con Inertia.js per un'interfaccia rapida e fluida, su ogni dispositivo.",
    ].join("\n"),
    coverImage: "/projects/booking-agriturismo.webp",
    coverAlt: "Pagina del sito web della struttura ricettiva con il modulo di prenotazione online",
    role: "Sito web · Sviluppo full-stack",
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
      "Il sito che stai visitando: portfolio sviluppato con Next.js, con pannello di amministrazione per gestire progetti ed esperienze.",
    description: [
      "Sito web progettato e sviluppato da zero con Next.js, TypeScript e Tailwind CSS, curato per velocità, accessibilità e visibilità sui motori di ricerca.",
      "",
      "I contenuti sono salvati in un database MySQL e si aggiornano da un pannello di amministrazione riservato: progetti, immagini, competenze ed esperienze.",
      "",
      "Il modulo di contatto archivia le richieste, invia una notifica via email e include protezioni contro lo spam.",
    ].join("\n"),
    coverImage: "/projects/portfolio-nextjs.webp",
    coverAlt: "Home page del portfolio in modalità scura",
    role: "Sito web · Design e sviluppo",
    client: null,
    featured: false,
    published: true,
    sortOrder: 3,
    completedAt: null,
    tech: ["nextjs", "react", "typescript", "tailwindcss", "prisma", "mysql"],
    repoUrl: "https://github.com/AleRigido5/portfolio",
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
      "Mi occupo dello sviluppo e della manutenzione del software aziendale: il sito web della struttura ricettiva, con il sistema di prenotazione online, e il gestionale interno utilizzato ogni giorno per l'amministrazione.",
    highlights: [
      "Sito web della struttura con prenotazioni online",
      "Gestionale per la fatturazione di vendita e di acquisto",
      "Prima nota e scadenzario dei pagamenti",
      "Documenti di trasporto (DDT) con generazione dei PDF",
      "Gestione del parco mezzi e delle relative scadenze",
      "Anagrafiche di clienti e fornitori",
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