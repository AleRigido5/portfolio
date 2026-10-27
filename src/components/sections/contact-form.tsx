"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

import { sendContactMessage } from "@/app/actions/contact-actions";
import { siteConfig } from "@/lib/site";
import {
  CONTACT_LIMITS,
  initialContactState,
  type ContactField,
} from "@/lib/validations/contact-schema";

// Ordine dei campi: serve per spostare il focus sul primo campo con errore
const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message", "consent"];

const inputClass =
  "block w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 hover:border-muted/50 focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15 motion-reduce:transition-none sm:text-sm";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialContactState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);

  // Momento in cui il form è diventato interattivo (anti-bot)
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Dopo ogni risposta: reset in caso di successo, focus sul primo errore altrimenti
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      statusRef.current?.focus();
    } else if (state.status === "error") {
      const firstInvalid = FIELD_ORDER.find((field) => state.fieldErrors?.[field]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      else statusRef.current?.focus();
    }
  }, [state]);

  // React 19 svuota il form dopo ogni action, anche con errori.
  // Inviando manualmente i dati, i campi restano compilati se qualcosa va storto.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("elapsed", String(Date.now() - startedAt.current));
    startTransition(() => formAction(formData));
  }

  const errorOf = (field: ContactField) => state.fieldErrors?.[field]?.[0];

  return (
    <form
      ref={formRef}
      action={formAction} // funziona anche senza JavaScript
      onSubmit={handleSubmit}
      noValidate // la validazione la fa Zod, con messaggi in italiano coerenti
      aria-describedby="contact-status"
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      {/* Messaggio di esito, annunciato dagli screen reader */}
      <div
        ref={statusRef}
        id="contact-status"
        role="status"
        tabIndex={-1}
        className="outline-none empty:hidden"
      >
        {state.message && (
          <p
            className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              state.status === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nome" error={errorOf("name")}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            placeholder="Mario Rossi"
            aria-invalid={!!errorOf("name")}
            aria-describedby={errorOf("name") ? "contact-name-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email" error={errorOf("email")}>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            placeholder="mario@esempio.it"
            aria-invalid={!!errorOf("email")}
            aria-describedby={errorOf("email") ? "contact-email-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field
          id="subject"
          label="Oggetto"
          optional
          error={errorOf("subject")}
          className="sm:col-span-2"
        >
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={CONTACT_LIMITS.subject.max}
            placeholder="Es. Nuovo sito per la mia attività"
            aria-invalid={!!errorOf("subject")}
            aria-describedby={errorOf("subject") ? "contact-subject-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field id="message" label="Messaggio" error={errorOf("message")} className="sm:col-span-2">
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            minLength={CONTACT_LIMITS.message.min}
            maxLength={CONTACT_LIMITS.message.max}
            placeholder="Descrivi il progetto: obiettivi, tempistiche ed esigenze principali…"
            aria-invalid={!!errorOf("message")}
            aria-describedby={errorOf("message") ? "contact-message-error" : undefined}
            className={`${inputClass} min-h-36 resize-y`}
          />
        </Field>
      </div>

      {/* Honeypot: nascosto a utenti e screen reader, visibile solo ai bot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company-website">Lascia vuoto questo campo</label>
        <input
          id="contact-company-website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Consenso privacy */}
      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={!!errorOf("consent")}
            aria-describedby={
              errorOf("consent") ? "contact-consent-note contact-consent-error" : "contact-consent-note"
            }
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border accent-[var(--accent)]"
          />
          <label htmlFor="contact-consent" className="cursor-pointer text-sm leading-relaxed text-muted">
            Acconsento al trattamento dei miei dati personali al solo fine di
            ricevere una risposta alla mia richiesta, come descritto nella{" "}
            <a
              href={siteConfig.privacyPolicyUrl}
              target="_blank"
              rel="noopener"
              className="iubenda-noiframe iubenda-embed iubenda-nostyle font-medium text-foreground underline underline-offset-2 hover:text-accent"
            >
              privacy policy
              <span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>
            .
          </label>
        </div>
        {/* Conservazione dei dati: i messaggi vengono cancellati in automatico dopo 12 mesi */}
        <p id="contact-consent-note" className="mt-2 pl-7 text-xs leading-relaxed text-muted">
          I dati inviati vengono usati solo per risponderti e conservati per massimo 12 mesi.
        </p>
        {errorOf("consent") && (
          <p id="contact-consent-error" className="mt-2 pl-7 text-sm text-red-700 dark:text-red-400">
            {errorOf("consent")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none sm:w-auto"
      >
        {isPending ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
            Invio in corso…
          </>
        ) : (
          <>
            Invia messaggio
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              <path d="M3.1 2.3a.75.75 0 0 0-.98.93l1.95 6.02H11a.75.75 0 0 1 0 1.5H4.07l-1.95 6.02a.75.75 0 0 0 .98.93l14.5-6.5a.75.75 0 0 0 0-1.37L3.1 2.3Z" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`contact-${id}`} className="mb-2 flex items-baseline justify-between text-sm font-medium text-foreground">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Facoltativo</span>}
      </label>
      {children}
      {error && (
        <p id={`contact-${id}-error`} className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}