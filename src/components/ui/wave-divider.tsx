// Separatore ondulato tra le sezioni: due onde sottili che scorrono lentamente
// a velocità diverse (effetto profondità), sfumate ai bordi, con un punto al centro.
// Server Component: SVG generato sul server, animazione solo CSS (transform → GPU).

const WIDTH = 1440; // larghezza di un "giro" (unità SVG)
const HEIGHT = 48;

/**
 * Onda sinusoidale costruita con curve di Bézier quadratiche.
 * Il periodo divide esattamente WIDTH, quindi due giri affiancati
 * si raccordano senza salti e lo scorrimento è infinito.
 */
function wavePath(period: number, amplitude: number) {
  const mid = HEIGHT / 2;
  const half = period / 2;
  let d = `M0 ${mid} Q${half / 2} ${mid - amplitude} ${half} ${mid}`;
  for (let x = half; x < WIDTH * 2; x += half) {
    d += ` T${x + half} ${mid}`;
  }
  return d;
}

const waves = [
  // onda principale: colore accent, più ampia e più lenta
  { d: wavePath(360, 14), className: "text-accent/60", duration: "26s", reverse: false },
  // onda secondaria: neutra, più fitta e in direzione opposta
  { d: wavePath(240, 8), className: "text-foreground/15", duration: "18s", reverse: true },
];

export function WaveDivider() {
  return (
    <div
      aria-hidden="true"
      className="reveal relative mx-auto h-12 w-full max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_20%,#000_80%,transparent)]"
    >
      {waves.map((wave) => (
        <svg
          key={wave.duration}
          viewBox={`0 0 ${WIDTH * 2} ${HEIGHT}`}
          preserveAspectRatio="none"
          fill="none"
          className={`absolute inset-y-0 left-0 h-full w-[200%] will-change-transform motion-safe:animate-[wave-flow_var(--wave-duration)_linear_infinite] ${wave.className} ${
            wave.reverse ? "[animation-direction:reverse]" : ""
          }`}
          style={{ "--wave-duration": wave.duration } as React.CSSProperties}
        >
          <path
            d={wave.d}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke" // spessore costante anche se l'SVG viene stirato
          />
        </svg>
      ))}
    </div>
  );
}