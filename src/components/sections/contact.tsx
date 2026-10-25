import { siteConfig } from "@/lib/site";
import { ContactForm } from "./contact-form";

const details = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: <path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
  },
  {
    label: "Sede",
    value: "Italia · disponibile anche da remoto",
    icon: (
      <>
        <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    label: "Tempi di risposta",
    value: "Entro 24–48 ore lavorative",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
];

// Server Component statico: solo il form è un Client Component
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-32">
        <div className="reveal">
          <p className="font-mono text-sm text-accent">05 — Contatti</p>
          <h2
            id="contact-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Parliamo del tuo progetto
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted">
            Ti serve un sito web, una web app o un gestionale su misura?
            Descrivimi la tua esigenza: ti risponderò con una prima valutazione
            e i passi per iniziare.
          </p>

          <ul className="mt-10 space-y-5">
            {details.map((item) => (
              <li key={item.label} className="group flex items-center gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-accent transition-[transform,background-color,color,border-color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    {item.icon}
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wider text-muted uppercase">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block truncate rounded-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-foreground">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}