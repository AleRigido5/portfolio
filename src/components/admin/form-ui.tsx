"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";

import { initialFormState, type FormState } from "@/lib/validations/admin-schemas";

// =============================================================
//  Componenti e hook condivisi dai form dell'admin
// =============================================================

export const inputClass =
  "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow] focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none aria-[invalid=true]:border-red-500";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * useActionState + invio manuale: in caso di errore i campi restano compilati
 * (React 19 svuoterebbe il form) e il focus va sul primo campo non valido.
 */
export function useAdminForm(action: Action) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  const errorOf = (field: string) => state.fieldErrors?.[field]?.[0];

  // formAction va anche su <form action>: il form funziona pure senza JavaScript
  return { state, formAction, pending, formRef, onSubmit, errorOf };
}

export function Field({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/** Attributi a11y per un campo con eventuale errore */
export function invalidProps(id: string, error?: string) {
  return {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm ${
        state.status === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300"
      }`}
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {pending ? "Salvataggio…" : children}
    </button>
  );
}

/**
 * Pulsante di eliminazione a due passaggi: il primo click chiede conferma,
 * il secondo invia. Niente window.confirm (blocca la pagina).
 */
export function DeleteButton({
  action,
  label = "Elimina",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000); // annulla da solo
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <form action={action}>
      {/* key diverse: React crea un nuovo elemento invece di trasformare quello cliccato.
          Senza, il primo click (type="button" → "submit") invierebbe già il form */}
      {confirming ? (
        <button
          key="confirm"
          type="submit"
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
        >
          Conferma eliminazione
        </button>
      ) : (
        <button
          key="ask"
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:border-red-500/50 hover:bg-red-500/10 dark:text-red-400"
        >
          {label}
        </button>
      )}
    </form>
  );
}

/** Elenco di checkbox per scegliere le tecnologie collegate */
export function TechnologyPicker({
  technologies,
  selected,
  error,
}: {
  technologies: { id: string; name: string }[];
  selected: string[];
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground">Tecnologie</legend>
      {technologies.length === 0 ? (
        <p className="text-sm text-muted">Nessuna tecnologia: creane una in Competenze.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <label key={tech.id} className="cursor-pointer">
              <input
                type="checkbox"
                name="technologies"
                value={tech.id}
                defaultChecked={selected.includes(tech.id)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-border bg-background px-3 py-1 text-xs text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-accent/50">
                {tech.name}
              </span>
            </label>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">{error}</p>}
    </fieldset>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}
