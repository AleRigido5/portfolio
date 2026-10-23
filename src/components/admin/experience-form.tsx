"use client";

import { useState } from "react";

import { saveExperience } from "@/app/gestione-ar/_actions/experience-actions";
import { EXPERIENCE_TYPE_OPTIONS } from "@/lib/admin/options";
import { toMonthInput } from "@/lib/utils";
import {
  Field,
  FormMessage,
  inputClass,
  invalidProps,
  SubmitButton,
  TechnologyPicker,
  useAdminForm,
} from "./form-ui";

export type ExperienceFormData = {
  id: string;
  type: string;
  role: string;
  organization: string;
  location: string | null;
  url: string | null;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  highlights: string[];
  sortOrder: number;
  technologyIds: string[];
};

export function ExperienceForm({
  experience,
  technologies,
}: {
  experience?: ExperienceFormData;
  technologies: { id: string; name: string }[];
}) {
  const { state, formAction, pending, formRef, onSubmit, errorOf } = useAdminForm(saveExperience);
  const [current, setCurrent] = useState(experience ? experience.endDate === null : true);

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} className="space-y-6">
      {experience && <input type="hidden" name="id" value={experience.id} />}
      <FormMessage state={state} />

      <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="type" label="Tipo" error={errorOf("type")}>
            <select {...invalidProps("type", errorOf("type"))} name="type" defaultValue={experience?.type ?? "WORK"} className={inputClass}>
              {EXPERIENCE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="role" label="Ruolo / titolo" error={errorOf("role")}>
            <input {...invalidProps("role", errorOf("role"))} name="role" required maxLength={120} defaultValue={experience?.role} placeholder="Full-stack Developer" className={inputClass} />
          </Field>
          <Field id="organization" label="Azienda / ente" error={errorOf("organization")}>
            <input {...invalidProps("organization", errorOf("organization"))} name="organization" required maxLength={120} defaultValue={experience?.organization} className={inputClass} />
          </Field>
          <Field id="location" label="Luogo" error={errorOf("location")}>
            <input {...invalidProps("location", errorOf("location"))} name="location" maxLength={120} defaultValue={experience?.location ?? ""} placeholder="Italia" className={inputClass} />
          </Field>
          <Field id="url" label="Sito web" error={errorOf("url")} hint="Facoltativo: il nome diventa un link.">
            <input {...invalidProps("url", errorOf("url"))} name="url" type="url" defaultValue={experience?.url ?? ""} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="sortOrder" label="Ordine" error={errorOf("sortOrder")}>
            <input {...invalidProps("sortOrder", errorOf("sortOrder"))} name="sortOrder" type="number" min={0} max={9999} defaultValue={experience?.sortOrder ?? 0} className={inputClass} />
          </Field>
          <Field id="startDate" label="Inizio" error={errorOf("startDate")}>
            <input {...invalidProps("startDate", errorOf("startDate"))} name="startDate" type="month" required defaultValue={toMonthInput(experience?.startDate)} className={inputClass} />
          </Field>
          <Field id="endDate" label="Fine" error={errorOf("endDate")}>
            <input
              {...invalidProps("endDate", errorOf("endDate"))}
              name="endDate"
              type="month"
              disabled={current}
              defaultValue={toMonthInput(experience?.endDate)}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="current"
            checked={current}
            onChange={(e) => setCurrent(e.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          <span className="text-sm font-medium">In corso</span>
        </label>

        <Field id="description" label="Descrizione" error={errorOf("description")}>
          <textarea {...invalidProps("description", errorOf("description"))} name="description" rows={3} defaultValue={experience?.description ?? ""} className={inputClass} />
        </Field>

        <Field id="highlights" label="Cosa ho realizzato" error={errorOf("highlights")} hint="Un punto per riga.">
          <textarea
            {...invalidProps("highlights", errorOf("highlights"))}
            name="highlights"
            rows={6}
            defaultValue={experience?.highlights.join("\n")}
            placeholder={"Sito con web app di prenotazione\nGestionale per la fatturazione"}
            className={inputClass}
          />
        </Field>

        <TechnologyPicker technologies={technologies} selected={experience?.technologyIds ?? []} error={errorOf("technologies")} />
      </div>

      <div className="flex justify-end">
        <SubmitButton pending={pending}>{experience ? "Salva modifiche" : "Aggiungi esperienza"}</SubmitButton>
      </div>
    </form>
  );
}
