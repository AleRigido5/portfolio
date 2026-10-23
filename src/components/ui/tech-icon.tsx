import type { SimpleIcon } from "simple-icons";

// Loghi dei brand con colore molto scuro (es. Next.js, nero) sparirebbero
// sul tema scuro: per questi usiamo il colore del testo (currentColor)
function isTooDark(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

/**
 * Icona SVG inline di una tecnologia (da simple-icons).
 * Renderizzata sul server: nessuna richiesta esterna e nessun JavaScript nel browser.
 */
export function TechIcon({
  icon,
  className = "size-6",
  colored = true,
}: {
  icon: SimpleIcon;
  className?: string;
  colored?: boolean;
}) {
  const fill = colored && !isTooDark(icon.hex) ? `#${icon.hex}` : "currentColor";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}