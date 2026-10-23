import { z } from "zod";

// Schema condiviso: usato dalla Server Action (validazione vera)
// e dal form per tipi e limiti di lunghezza
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 },
} as const;

export const contactSchema = z.object({
  name: z
    .string("Inserisci il tuo nome.")
    .trim()
    .min(CONTACT_LIMITS.name.min, "Il nome deve avere almeno 2 caratteri.")
    .max(CONTACT_LIMITS.name.max, "Il nome può avere al massimo 100 caratteri."),
  email: z
    .string("Inserisci la tua email.")
    .trim()
    .toLowerCase()
    .max(CONTACT_LIMITS.email.max, "L'email è troppo lunga.")
    .pipe(z.email("Inserisci un indirizzo email valido.")),
  subject: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.subject.max, "L'oggetto può avere al massimo 150 caratteri.")
    .optional()
    .transform((value) => value || undefined), // stringa vuota → nessun oggetto
  message: z
    .string("Scrivi un messaggio.")
    .trim()
    .min(CONTACT_LIMITS.message.min, "Il messaggio deve avere almeno 10 caratteri.")
    .max(CONTACT_LIMITS.message.max, "Il messaggio può avere al massimo 5000 caratteri."),
  consent: z.literal("on", "Serve il consenso per poterti rispondere."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof z.input<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
};

export const initialContactState: ContactState = { status: "idle" };