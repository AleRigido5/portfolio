import type { Metadata } from "next";

// Il pannello non deve mai finire nei motori di ricerca.
// (Non lo elenchiamo in robots.txt: renderebbe pubblico l'indirizzo)
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col">{children}</div>;
}
