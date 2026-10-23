"use client";

import { Field, FormMessage, inputClass, SubmitButton, useAdminForm } from "@/components/admin/form-ui";
import { login } from "../_actions/auth-actions";

export function LoginForm() {
  const { state, formAction, pending, formRef, onSubmit } = useAdminForm(login);
  const hasError = state.status === "error";

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <FormMessage state={state} />

      <Field id="email" label="Email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          aria-invalid={hasError}
          className={inputClass}
        />
      </Field>

      <Field id="password" label="Password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={hasError}
          className={inputClass}
        />
      </Field>

      <div className="pt-1 [&>button]:w-full">
        <SubmitButton pending={pending}>Accedi</SubmitButton>
      </div>
    </form>
  );
}
