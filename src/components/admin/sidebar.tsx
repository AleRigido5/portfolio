"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logout } from "@/app/gestione-ar/_actions/auth-actions";
import { ADMIN_PATH } from "@/lib/admin/config";

const NAV = [
  { href: ADMIN_PATH, label: "Dashboard", icon: <path d="M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" /> },
  { href: `${ADMIN_PATH}/messaggi`, label: "Messaggi", icon: <path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /> },
  { href: `${ADMIN_PATH}/progetti`, label: "Progetti", icon: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /> },
  { href: `${ADMIN_PATH}/competenze`, label: "Competenze", icon: <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" /> },
  { href: `${ADMIN_PATH}/esperienze`, label: "Esperienze", icon: <path d="M4 7h16v12H4zM9 7V5h6v2M4 12h16" /> },
];

export function AdminSidebar({ email, newMessages }: { email: string; newMessages: number }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === ADMIN_PATH ? pathname === ADMIN_PATH : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-5">
        <Link href={ADMIN_PATH} className="font-mono text-sm font-semibold">
          <span className="text-accent">&lt;</span>AR<span className="text-accent">/&gt;</span>
          <span className="ml-2 font-sans text-xs font-medium text-muted">Admin</span>
        </Link>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile: barra orizzontale scorrevole; desktop: colonna */}
      <nav aria-label="Navigazione admin" className="overflow-x-auto px-2 pb-2 lg:flex-1 lg:px-3 lg:pb-0">
        <ul className="flex gap-1 lg:flex-col">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    active
                      ? "bg-accent/10 font-medium text-foreground"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 shrink-0 ${active ? "text-accent" : ""}`}
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                  {item.label === "Messaggi" && newMessages > 0 && (
                    <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold text-accent-foreground">
                      {newMessages}
                      <span className="sr-only"> nuovi</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Piede della sidebar (solo desktop) */}
      <div className="hidden border-t border-border p-4 lg:block">
        <p className="truncate text-xs text-muted" title={email}>
          {email}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-xs font-medium text-muted transition-colors hover:text-foreground">
            ↗ Vedi sito
          </Link>
          <ThemeToggle />
        </div>
        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            Esci
          </button>
        </form>
      </div>

      {/* Esci su mobile */}
      <form action={logout} className="absolute top-3 right-14 lg:hidden">
        <button
          type="submit"
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Esci
        </button>
      </form>
    </aside>
  );
}
