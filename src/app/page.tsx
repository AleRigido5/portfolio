import { Hero } from "@/components/sections/hero";

// Sezioni ancora provvisorie: verranno sostituite una alla volta dai componenti reali
const sections = [
  { id: "about", title: "Chi sono" },
  { id: "projects", title: "Progetti" },
  { id: "experience", title: "Esperienze" },
  { id: "contact", title: "Contatti" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="mx-auto min-h-[60vh] max-w-6xl border-t border-border px-4 py-20 sm:px-6"
        >
          <h2 id={`${section.id}-title`} className="text-2xl font-semibold tracking-tight">
            {section.title}
          </h2>
          <p className="mt-2 text-muted">Sezione in arrivo.</p>
        </section>
      ))}
    </>
  );
}