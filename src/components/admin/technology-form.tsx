"use client";

import { useState } from "react";

import { saveTechnology } from "@/app/gestione-ar/_actions/technology-actions";
import { CATEGORY_OPTIONS } from "@/lib/admin/options";
import { slugify } from "@/lib/utils";
import { CheckboxField, Field, FormMessage, inputClass, invalidProps, SubmitButton, useAdminForm } from "./form-ui";

export type TechnologyFormData = {
  id: string;
  name: string;
  slug: string;
  category: string;
  showInAbout: boolean;
  sortOrder: number;
};

export function TechnologyForm({ technology }: { technology?: TechnologyFormData }) {
  const { state, formAction, pending, formRef, onSubmit, errorOf } = useAdminForm(saveTechnology);
  const [name, setName] = useState(technology?.name ?? "");

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      className="max-w-2xl space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      {technology && <input type="hidden" name="id" value={technology.id} />}
      <FormMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nome" error={errorOf("name")}>
          <input
            {...invalidProps("name", errorOf("name"))}
            name="name"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Laravel"
            className={inputClass}
          />
        </Field>
        <Field id="slug" label="Slug" error={errorOf("slug")} hint="Usato nei filtri dei progetti.">
          <input
            {...invalidProps("slug", errorOf("slug"))}
            name="slug"
            maxLength={60}
            defaultValue={technology?.slug}
            placeholder={slugify(name)}
            className={inputClass}
          />
        </Field>
        <Field id="category" label="Categoria" error={errorOf("category")}>
          <select
            {...invalidProps("category", errorOf("category"))}
            name="category"
            defaultValue={technology?.category ?? "BACKEND"}
            className={inputClass}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="sortOrder" label="Ordine" error={errorOf("sortOrder")}>
          <input
            {...invalidProps("sortOrder", errorOf("sortOrder"))}
            name="sortOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={technology?.sortOrder ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <CheckboxField
        name="showInAbout"
        label="Mostra in Chi sono"
        hint="Se disattivato resta disponibile per progetti ed esperienze."
        defaultChecked={technology?.showInAbout ?? true}
      />

      <div className="flex justify-end border-t border-border pt-5">
        <SubmitButton pending={pending}>{technology ? "Salva modifiche" : "Aggiungi tecnologia"}</SubmitButton>
      </div>
    </form>
  );
}
