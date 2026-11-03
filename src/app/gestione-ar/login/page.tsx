import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Accesso" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/brand/icona-chiara-512.png"
            alt=""
            width={48}
            height={48}
            className="dark:hidden"
          />
          <Image
            src="/brand/icona-scura-512.png"
            alt=""
            width={48}
            height={48}
            className="hidden dark:block"
          />
        </div>
        <h1 className="mt-4 text-center text-2xl font-semibold tracking-tight">Area riservata</h1>
        <p className="mt-2 text-center text-sm text-muted">Accedi per gestire i contenuti del sito.</p>

        <LoginForm />
      </div>
    </main>
  );
}
