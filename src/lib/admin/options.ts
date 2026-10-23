// Opzioni condivise da pagine (server) e form (client).
// Stanno in un file senza "use client": le costanti esportate da un modulo
// client non sono utilizzabili come dati nei Server Components.

export const CATEGORY_OPTIONS = [
  { value: "BACKEND", label: "Backend" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "DATABASE", label: "Database" },
  { value: "DEVOPS", label: "DevOps & Deploy" },
  { value: "TOOL", label: "Strumenti" },
] as const;

export const EXPERIENCE_TYPE_OPTIONS = [
  { value: "WORK", label: "Lavoro" },
  { value: "EDUCATION", label: "Formazione" },
  { value: "CERTIFICATION", label: "Certificazione" },
] as const;
