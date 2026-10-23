"use client";

// Le icone si alternano solo via CSS (dark:hidden / dark:block):
// niente stato React, quindi nessun errore di idratazione e nessun flash
export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage non disponibile (es. navigazione privata): il tema vale solo per questa visita
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambia tema chiaro o scuro"
      title="Cambia tema"
      className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      {/* Luna: visibile in tema chiaro */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5 dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>

      {/* Sole: visibile in tema scuro */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-5 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}