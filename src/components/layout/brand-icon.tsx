import Image from "next/image";

/**
 * Icona {AR} che cambia con il tema:
 * - tema chiaro → public/brand/icona-chiara.svg
 * - tema scuro  → public/brand/icona-scura.svg
 * Il browser mostra solo una delle due grazie a "dark:hidden" / "hidden dark:block".
 * Usata nella navbar e nel menu mobile.
 */
export function BrandIcon({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span aria-hidden="true" className={`relative block size-8 shrink-0 ${className}`}>
      <Image
        src="/brand/icona-chiara.svg"
        alt=""
        width={32}
        height={32}
        unoptimized // gli SVG non passano dall'ottimizzazione di Next
        priority={priority}
        className="size-8 rounded-[7px] ring-1 ring-border dark:hidden"
      />
      <Image
        src="/brand/icona-scura.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        priority={priority}
        className="hidden size-8 dark:block"
      />
    </span>
  );
}