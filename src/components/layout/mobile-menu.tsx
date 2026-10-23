"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { NavItem } from "@/lib/site";

export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    // Esc chiude il menu e riporta il focus sul pulsante
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    // Se la finestra passa a desktop, il menu si chiude da solo
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface"
      >
        {/* Hamburger che si trasforma in X */}
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* "invisible" (visibility: hidden) toglie i link dal tab order quando il menu è chiuso */}
      <div
        id={menuId}
        className={`absolute inset-x-0 top-full border-b border-border bg-background px-4 pt-2 pb-4 shadow-lg transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                className="block rounded-md px-3 py-3 text-base text-foreground transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}