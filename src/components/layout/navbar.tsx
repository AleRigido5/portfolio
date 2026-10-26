import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

// Server Component: logo e struttura sono HTML statico,
// solo link (scroll-spy), menu mobile e toggle del tema sono client
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Navigazione principale"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Logo: icona {AR} chiara o scura in base al tema + nome */}
        <Link href="/" className="group flex items-center gap-2.5 rounded-md">
          {/* Tema chiaro: visibile, nascosta in tema scuro */}
          <Image
            src="/brand/icona-chiara.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            priority
            className="size-8 shrink-0 rounded-[7px] ring-1 ring-border transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none dark:hidden"
          />
          {/* Tema scuro: nascosta in tema chiaro */}
          <Image
            src="/brand/icona-scura.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            priority
            className="hidden size-8 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none dark:block"
          />
          <span
            aria-hidden="true"
            className="text-[0.95rem] font-semibold tracking-tight text-foreground"
          >
            {siteConfig.name}
          </span>
          <span className="sr-only">{siteConfig.name}, torna alla home</span>
        </Link>

        <DesktopNav items={siteConfig.nav} />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu items={siteConfig.nav} />
        </div>
      </nav>

      {/* Barra di avanzamento dello scroll (solo CSS, vedi .scroll-progress) */}
      <span
        aria-hidden="true"
        className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-accent"
      />
    </header>
  );
}