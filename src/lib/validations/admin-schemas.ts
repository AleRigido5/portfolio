import { z } from "zod";

// -------------------------------------------------------------
//  Helper per i campi dei form (FormData restituisce sempre stringhe)
// -------------------------------------------------------------

/** Testo facoltativo: stringa vuota → null */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label}: massimo ${max} caratteri.`)
    .transform((v) => v || null);

/** URL facoltativo (http/https): stringa vuota → null */
const optionalUrl = z
  .string()
  .trim()
  .max(255, "URL troppo lungo.")
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Inserisci un URL completo (https://...).")
  .transform((v) => v || null);

/** Checkbox: "on" se spuntato, assente altrimenti */
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

/** Numero intero per l'ordinamento */
const sortOrder = z.coerce
  .number("Ordine non valido.")
  .int("L'ordine deve essere un numero intero.")
  .min(0, "L'ordine non può essere negativo.")
  .max(9999, "Ordine troppo alto.");

/** <input type="month"> → "2026-01" → Date (primo giorno del mese, UTC) */
const monthDate = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Seleziona mese e anno.")
  .transform((v) => new Date(`${v}-01T00:00:00Z`));

const optionalMonthDate = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (!v) return null;
    if (!/^\d{4}-\d{2}$/.test(v)) {
      ctx.addIssue({ code: "custom", message: "Data non valida." });
      return z.NEVER;
    }
    return new Date(`${v}-01T00:00:00Z`);
  });

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(120, "Slug troppo lungo.")
  .refine((v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), "Solo lettere minuscole, numeri e trattini.");

// -------------------------------------------------------------
//  Schemi
// -------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Inserisci un'email valida.")),
  password: z.string().min(1, "Inserisci la password.").max(200),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Titolo troppo corto.").max(120, "Titolo troppo lungo."),
  slug, // vuoto → generato dal titolo
  summary: z.string().trim().min(10, "Descrizione breve troppo corta.").max(280, "Massimo 280 caratteri."),
  description: optionalText(20000, "Descrizione"),
  coverAlt: z.string().trim().min(5, "Descrivi l'immagine (testo alternativo).").max(200, "Massimo 200 caratteri."),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  role: optionalText(120, "Ruolo"),
  client: optionalText(120, "Cliente"),
  featured: checkbox,
  published: checkbox,
  sortOrder,
  completedAt: optionalMonthDate,
  technologies: z.array(z.string().min(1)).max(30, "Troppe tecnologie selezionate."),
});

export const technologySchema = z.object({
  name: z.string().trim().min(1, "Inserisci il nome.").max(60, "Massimo 60 caratteri."),
  slug: slug.refine((v) => v.length <= 60, "Massimo 60 caratteri."),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "TOOL"], "Scegli una categoria."),
  showInAbout: checkbox,
  sortOrder,
});

export const experienceSchema = z
  .object({
    type: z.enum(["WORK", "EDUCATION", "CERTIFICATION"], "Scegli un tipo."),
    role: z.string().trim().min(2, "Inserisci il ruolo.").max(120, "Massimo 120 caratteri."),
    organization: z.string().trim().min(2, "Inserisci l'organizzazione.").max(120, "Massimo 120 caratteri."),
    location: optionalText(120, "Luogo"),
    url: optionalUrl,
    startDate: monthDate,
    endDate: optionalMonthDate,
    current: checkbox,
    description: optionalText(5000, "Descrizione"),
    // Una voce per riga
    highlights: z
      .string()
      .transform((v) => v.split("\n").map((line) => line.trim()).filter(Boolean))
      .pipe(z.array(z.string().max(200, "Ogni punto può avere al massimo 200 caratteri.")).max(15, "Massimo 15 punti.")),
    sortOrder,
    technologies: z.array(z.string().min(1)).max(30, "Troppe tecnologie selezionate."),
  })
  .transform((data) => ({ ...data, endDate: data.current ? null : data.endDate }))
  .refine((d) => d.current || d.endDate !== null, {
    path: ["endDate"],
    message: "Indica la data di fine oppure spunta \"In corso\".",
  })
  .refine((d) => !d.endDate || d.endDate >= d.startDate, {
    path: ["endDate"],
    message: "La fine non può essere prima dell'inizio.",
  });

/** Stato restituito dalle Server Action dei form admin */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialFormState: FormState = { status: "idle" };

/** Converte un errore Zod nello stato del form */
export function zodErrorState(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Controlla i campi evidenziati.",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[] | undefined>,
  };
}
