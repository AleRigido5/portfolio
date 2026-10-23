"use client";

import Link from "next/link";

import { sectionIdFromHref, useActiveSection } from "@/hooks/use-active-section";
import type { NavItem } from "@/lib/site";

export function DesktopNav({ items }: { items: readonly NavItem[] }) {
  const { active, select } = useActiveSection(items.map((item) => sectionIdFromHref(item.href)));

  return (
    <ul className="hidden items-center gap-1 md:flex">
      {items.map((item) => {
        const id = sectionIdFromHref(item.href);
        const isActive = active === id;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => select(id)}
              // Indica agli screen reader la sezione corrente
              aria-current={isActive ? "location" : undefined}
              className={`relative block rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                isActive
                  ? "text-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {item.label}
              {/* Indicatore sotto il link attivo */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 -bottom-px h-0.5 origin-center rounded-full bg-accent transition-transform duration-300 motion-reduce:transition-none ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}