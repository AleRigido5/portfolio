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
        {/* Logo */}
        <Link
          href="/"
          className="group rounded-md font-mono text-sm font-semibold tracking-tight"
        >
          <span aria-hidden="true">
            <span className="inline-block text-accent transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none">
              &lt;
            </span>
            AR
            <span className="inline-block text-accent transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
              /&gt;
            </span>
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