import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

// Server Component: solo il menu mobile e il toggle del tema vanno al browser come JS
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
            <span className="text-accent transition-transform duration-200 group-hover:-translate-x-0.5 inline-block motion-reduce:transition-none">
              &lt;
            </span>
            AR
            <span className="text-accent transition-transform duration-200 group-hover:translate-x-0.5 inline-block motion-reduce:transition-none">
              /&gt;
            </span>
          </span>
          <span className="sr-only">{siteConfig.name}, torna alla home</span>
        </Link>

        {/* Link desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Azioni */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu items={siteConfig.nav} />
        </div>
      </nav>
    </header>
  );
}