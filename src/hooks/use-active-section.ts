"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Dopo un click lo scroll fluido attraversa altre sezioni:
// per questo tempo ignoriamo l'observer, così il link cliccato resta attivo
const CLICK_LOCK_MS = 1000;

/**
 * Restituisce l'id della sezione visibile al centro dello schermo (scroll-spy).
 * `select(id)` la attiva subito, ad esempio al click su un link.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const lockUntil = useRef(0);
  const idsKey = ids.join(",");

  useEffect(() => {
    const sectionIds = idsKey.split(",");
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Pagine senza queste sezioni (es. future pagine di dettaglio): nessun link attivo
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        if (Date.now() < lockUntil.current) return;
        setActive(sectionIds.find((id) => visible.get(id)) ?? null);
      },
      // Una fascia sottile a metà schermo: è "attiva" la sezione che la attraversa
      { rootMargin: "-45% 0px -50% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  const select = useCallback((id: string) => {
    lockUntil.current = Date.now() + CLICK_LOCK_MS;
    setActive(id);
  }, []);

  return { active, select };
}

/** "/#about" → "about" */
export function sectionIdFromHref(href: string) {
  return href.split("#")[1] ?? "";
}