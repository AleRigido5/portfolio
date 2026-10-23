"use client";

import Image from "next/image";
import { useState } from "react";

import { saveProject } from "@/app/gestione-ar/_actions/project-actions";
import { slugify, toMonthInput } from "@/lib/utils";
import {
  CheckboxField,
  Field,
  FormMessage,
  inputClass,
  invalidProps,
  SubmitButton,
  TechnologyPicker,
  useAdminForm,
} from "./form-ui";

export type ProjectFormData = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  coverImage: string | null; // null se il file non esiste più
  coverAlt: string;
  liveUrl: string | null;
  repoUrl: string | null;
  role: string | null;
  client: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  completedAt: Date | null;
  technologyIds: string[];
};

export function ProjectForm({
  project,
  technologies,
}: {
  project?: ProjectFormData;
  technologies: { id: string; name: string }[];
}) {
  const { state, formAction, pending, formRef, onSubmit, errorOf } = useAdminForm(saveProject);
  const [title, setTitle] = useState(project?.title ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} className="space-y-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <FormMessage state={state} />

      <Section title="Contenuto">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="title" label="Titolo" error={errorOf("title")}>
            <input
              {...invalidProps("title", errorOf("title"))}
              name="title"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field id="slug" label="Slug (URL)" error={errorOf("slug")} hint={`Vuoto = ${slugify(title) || "generato dal titolo"}`}>
            <input
              {...invalidProps("slug", errorOf("slug"))}
              name="slug"
              maxLength={120}
              defaultValue={project?.slug}
              placeholder={slugify(title)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="summary" label="Descrizione breve" error={errorOf("summary")} hint="Compare nella card del progetto (max 280 caratteri).">
          <textarea
            {...invalidProps("summary", errorOf("summary"))}
            name="summary"
            rows={2}
            required
            maxLength={280}
            defaultValue={project?.summary}
            className={inputClass}
          />
        </Field>

        <Field id="description" label="Descrizione completa" error={errorOf("description")} hint="Facoltativa. Per una futura pagina di dettaglio.">
          <textarea
            {...invalidProps("description", errorOf("description"))}
            name="description"
            rows={6}
            defaultValue={project?.description ?? ""}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Copertina">
        <div className="grid gap-5 sm:grid-cols-[1fr_14rem]">
          <div className="space-y-5">
            <Field
              id="cover"
              label={project ? "Sostituisci immagine" : "Immagine"}
              error={errorOf("cover")}
              hint="JPG, PNG, WebP o AVIF fino a 4 MB. Viene ridimensionata e convertita in WebP."
            >
              <input
                {...invalidProps("cover", errorOf("cover"))}
                name="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required={!project}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20"
              />
            </Field>
            <Field id="coverAlt" label="Testo alternativo" error={errorOf("coverAlt")} hint="Descrive l'immagine a chi non la vede (accessibilità e SEO).">
              <input
                {...invalidProps("coverAlt", errorOf("coverAlt"))}
                name="coverAlt"
                required
                maxLength={200}
                defaultValue={project?.coverAlt}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-background">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- anteprima locale (blob:) del file scelto
              <img src={preview} alt="" className="size-full object-cover" />
            ) : project?.coverImage ? (
              <Image src={project.coverImage} alt="" fill sizes="224px" className="object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-xs text-muted">Anteprima</span>
            )}
          </div>
        </div>
      </Section>

      <Section title="Dettagli">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="role" label="Ruolo" error={errorOf("role")}>
            <input {...invalidProps("role", errorOf("role"))} name="role" maxLength={120} defaultValue={project?.role ?? ""} placeholder="Full-stack developer" className={inputClass} />
          </Field>
          <Field id="client" label="Cliente" error={errorOf("client")} hint="Lascia vuoto per progetti riservati.">
            <input {...invalidProps("client", errorOf("client"))} name="client" maxLength={120} defaultValue={project?.client ?? ""} className={inputClass} />
          </Field>
          <Field id="liveUrl" label="Link demo / sito" error={errorOf("liveUrl")}>
            <input {...invalidProps("liveUrl", errorOf("liveUrl"))} name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="repoUrl" label="Link repository" error={errorOf("repoUrl")}>
            <input {...invalidProps("repoUrl", errorOf("repoUrl"))} name="repoUrl" type="url" defaultValue={project?.repoUrl ?? ""} placeholder="https://github.com/..." className={inputClass} />
          </Field>
          <Field id="completedAt" label="Completato il" error={errorOf("completedAt")}>
            <input {...invalidProps("completedAt", errorOf("completedAt"))} name="completedAt" type="month" defaultValue={toMonthInput(project?.completedAt)} className={inputClass} />
          </Field>
          <Field id="sortOrder" label="Ordine" error={errorOf("sortOrder")} hint="Numeri più bassi compaiono prima.">
            <input {...invalidProps("sortOrder", errorOf("sortOrder"))} name="sortOrder" type="number" min={0} max={9999} defaultValue={project?.sortOrder ?? 0} className={inputClass} />
          </Field>
        </div>

        <TechnologyPicker technologies={technologies} selected={project?.technologyIds ?? []} error={errorOf("technologies")} />
      </Section>

      <Section title="Visibilità">
        <div className="grid gap-4 sm:grid-cols-2">
          <CheckboxField name="published" label="Pubblicato" hint="Visibile sul sito." defaultChecked={project?.published ?? true} />
          <CheckboxField name="featured" label="In evidenza" hint="Mostrato per primo, con etichetta." defaultChecked={project?.featured} />
        </div>
      </Section>

      <div className="flex justify-end border-t border-border pt-6">
        <SubmitButton pending={pending}>{project ? "Salva modifiche" : "Crea progetto"}</SubmitButton>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
