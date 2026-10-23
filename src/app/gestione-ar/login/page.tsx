import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Accesso" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-sm font-semibold">
          <span className="text-accent">&lt;</span>AR<span className="text-accent">/&gt;</span>
        </p>
        <h1 className="mt-4 text-center text-2xl font-semibold tracking-tight">Area riservata</h1>
        <p className="mt-2 text-center text-sm text-muted">Accedi per gestire i contenuti del sito.</p>

        <LoginForm />
      </div>
    </main>
  );
}
