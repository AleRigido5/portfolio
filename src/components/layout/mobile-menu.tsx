"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { sectionIdFromHref, useActiveSection } from "@/hooks/use-active-section";
import { siteConfig, type NavItem } from "@/lib/site";

// true solo nel browser: il pannello viene montato nel <body> tramite portal.
// Serve perché l'header ha backdrop-blur, che "intrappola" gli elementi position: fixed
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  const { active, select } = useActiveSection(items.map((item) => sectionIdFromHref(item.href)));

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const root = document.documentElement;

    // Blocca lo scroll della pagina sotto il pannello
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Focus sul primo elemento del pannello, al frame successivo:
    // prima il browser deve applicare "visible" (un elemento nascosto non riceve il focus)
    const frame = requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>("a, button")?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      // Focus trap: Tab e Shift+Tab restano dentro il pannello
      if (event.key === "Tab" && panel) {
        const focusable = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    // Passando a desktop il menu si chiude da solo
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && close(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Apri il menu"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M4 7h16M4 12h16M10 17h10" />
        </svg>
      </button>

      {isClient &&
        createPortal(
          <div className="md:hidden">
            {/* Sfondo scuro: un click chiude il menu */}
            <div
              aria-hidden="true"
              onClick={() => close()}
              className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            {/* Pannello laterale: entra da destra */}
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              // inert: da chiuso non è raggiungibile né con Tab né dagli screen reader
              inert={!open}
              // Da chiuso: fuori schermo e "invisible", così nemmeno l'ombra sborda sul bordo destro.
              // All'apertura diventa visibile subito; alla chiusura solo a fine animazione
              className={`fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,85vw)] flex-col border-l border-border bg-background shadow-2xl duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                open
                  ? "visible translate-x-0 transition-transform"
                  : "invisible translate-x-full transition-[transform,visibility]"
              }`}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <p id={titleId} className="font-mono text-sm font-semibold">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={() => close()}
                  aria-label="Chiudi il menu"
                  className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    className="size-5"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav aria-label="Navigazione mobile" className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {items.map((item, index) => {
                    const id = sectionIdFromHref(item.href);
                    const isActive = active === id;

                    return (
                      <li
                        key={item.href}
                        // Ingresso a cascata dei link quando il pannello si apre
                        className={`transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
                          open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                        }`}
                        style={{ transitionDelay: open ? `${80 + index * 40}ms` : "0ms" }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            select(id);
                            close(false);
                          }}
                          aria-current={isActive ? "location" : undefined}
                          className={`flex items-center justify-between rounded-lg px-4 py-3 text-base transition-colors ${
                            isActive
                              ? "bg-accent/10 font-medium text-foreground"
                              : "text-muted hover:bg-surface hover:text-foreground"
                          }`}
                        >
                          {item.label}
                          <span
                            aria-hidden="true"
                            className={`size-1.5 rounded-full bg-accent transition-opacity ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-border px-5 py-5 text-sm">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block truncate rounded-sm text-muted transition-colors hover:text-foreground"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}