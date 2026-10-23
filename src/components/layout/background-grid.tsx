// Sfondo decorativo di tutto il sito: griglia + due bagliori soffusi.
// È "fixed": resta fermo mentre il contenuto scorre sopra (effetto profondità)
// e il browser lo disegna una sola volta, quindi lo scroll non lo ridisegna.
export function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden will-change-transform"
    >
      {/* Griglia: più visibile in alto, sfuma verso il basso e ai lati */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_90%_85%_at_50%_15%,#000_35%,transparent_100%)] opacity-60" />

      {/* Bagliori agli angoli, molto leggeri: danno colore senza disturbare la lettura.
          Gradienti radiali invece di filter: blur → molto più leggeri da disegnare su mobile */}
      <div className="absolute -top-64 -left-64 size-[44rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_12%,transparent),transparent)]" />
      <div className="absolute -right-64 -bottom-64 size-[44rem] bg-[radial-gradient(closest-side,rgb(217_70_239/0.08),transparent)]" />
    </div>
  );
}