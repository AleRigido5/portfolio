"use client";

import { useEffect } from "react";

/**
 * Un solo listener per tutta la pagina: quando il puntatore è sopra un elemento
 * con classe "spotlight", aggiorna le variabili CSS --mx e --my con la sua posizione.
 * Aggiornamenti limitati a uno per frame; disattivato su touch screen.
 */
export function PointerSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!lastEvent) return;
      const target = lastEvent.target as Element | null;
      const card = target?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${lastEvent.clientX - rect.left}px`);
      card.style.setProperty("--my", `${lastEvent.clientY - rect.top}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}