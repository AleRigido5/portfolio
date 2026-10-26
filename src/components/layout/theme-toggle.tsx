"use client";

function applyTheme(next: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.style.colorScheme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // localStorage non disponibile (es. navigazione privata): il tema vale solo per questa visita
  }
}

// Le icone si alternano solo via CSS (dark:hidden / dark:block):
// niente stato React, quindi nessun errore di idratazione e nessun flash
export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }

    // Dissolvenza: il nuovo tema compare sopra il vecchio (solo opacità → fluida anche su mobile).
    // La classe limita le animazioni del cambio tema (vedi globals.css)
    root.classList.add("theme-transition");
    const transition = document.startViewTransition(() => applyTheme(next));

    transition.finished.finally(() => root.classList.remove("theme-transition"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambia tema chiaro o scuro"
      title="Cambia tema"
      className="group inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
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
        className="size-5 transition-transform duration-500 group-hover:-rotate-12 motion-reduce:transition-none dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>

      {/* Sole: visibile in tema scuro, ruota all'hover */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-5 transition-transform duration-500 group-hover:rotate-45 motion-reduce:transition-none dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}