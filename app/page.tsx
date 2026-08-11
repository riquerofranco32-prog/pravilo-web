import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import ReserveButton from "@/components/ReserveButton";
import { INSTAGRAM_URL, whatsappLink } from "@/lib/constants";

const NAV = [
  { href: "#que-es", label: "¿Qué es?" },
  { href: "#practica", label: "La práctica" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#instructor", label: "Instructor" },
  { href: "#faq", label: "FAQ" },
  { href: "#ubicacion", label: "Ubicación" },
];

const BENEFICIOS = [
  {
    title: "Más movilidad",
    desc: "Ganá rango de movimiento real en articulaciones y cadera.",
  },
  {
    title: "Menos tensión y dolor",
    desc: "Liberá capas profundas de tejido que acumulan tensión crónica.",
  },
  {
    title: "Mejor postura",
    desc: "Trabajo consciente sobre la alineación de tu cuerpo en el día a día.",
  },
  {
    title: "Recuperación activa",
    desc: "Complementá tu deporte o rutina con un trabajo regenerativo.",
  },
  {
    title: "Rendimiento deportivo",
    desc: "Más amplitud y control de movimiento para cualquier disciplina.",
  },
  {
    title: "Bienestar y autonomía",
    desc: "Una mejor relación con tu cuerpo, a tu ritmo y sin comparaciones.",
  },
];

const GALERIA = [
  "Sala de entrenamiento",
  "Trabajo guiado 1 a 1",
  "Método Pravilo",
  "Movilidad y fascia",
  "Instructor certificado",
  "Espacio en Neuquén",
];

const FAQ = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Las sesiones se adaptan a cualquier nivel, desde quienes recién empiezan hasta deportistas con experiencia.",
  },
  {
    q: "¿Para qué edades es PRAVILO?",
    a: "Está adaptado a todas las edades y niveles. Cada plan se arma según tu cuerpo y tus objetivos.",
  },
  {
    q: "¿Es entrenamiento o terapia?",
    a: "Las dos cosas: combina trabajo físico guiado con un enfoque terapéutico sobre la movilidad y la fascia.",
  },
  {
    q: "¿Cuánto dura una sesión y cada cuánto se recomienda ir?",
    a: "Depende de tu objetivo. Escribinos por WhatsApp y te contamos la duración y frecuencia recomendada para tu caso.",
  },
  {
    q: "¿Dónde queda el centro?",
    a: "Estamos en Neuquén, Argentina. Te pasamos la ubicación exacta al coordinar tu turno.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "PRAVILO ARG",
    description:
      "Primer centro Pravilo de Argentina. Entrenamiento y terapia de movilidad, individual y personalizado.",
    url: "https://pravilo-web.vercel.app",
    telephone: "+5492942564386",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Neuquén",
      addressCountry: "AR",
    },
    sameAs: [INSTAGRAM_URL],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            PRAVILO <span className="text-accent">ARG</span>
          </span>
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ReserveButton className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-105" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-28 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(201,163,90,0.15),transparent_60%)]" />
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            1° Centro PRAVILO de Argentina · Neuquén
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-balance md:text-7xl">
            Movete sin límites
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted text-balance">
            Entrenamiento y terapia de movilidad con el método Pravilo.
            Individual, personalizado y adaptado a todas las edades y niveles.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ReserveButton className="rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground transition-transform hover:scale-105" />
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-8 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </section>

        {/* Qué es PRAVILO */}
        <section id="que-es" className="mx-auto max-w-4xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              ¿Qué es PRAVILO?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              PRAVILO es un sistema de entrenamiento y terapia de movimiento que
              trabaja la movilidad, la flexibilidad y las capas profundas de tu
              cuerpo —la fascia— para que puedas moverte con más libertad y
              menos tensión. Tu fascia guarda más que tensión: guarda tu
              historia. En PRAVILO ARG trabajamos esas capas profundas para que
              tu cuerpo finalmente pueda soltar.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Es para todos los que buscan moverse mejor: no importa si sos
              deportista, trabajás muchas horas sentado, manejás largas
              distancias o simplemente querés sentirte mejor en tu cuerpo.
            </p>
          </RevealOnScroll>
        </section>

        {/* La práctica */}
        <section id="practica" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <RevealOnScroll>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                La práctica
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Cada sesión es individual y personalizada, guiada de principio a
                fin por un instructor certificado en el sistema PRAVILO.
                Empezamos evaluando tu movilidad actual y armamos un proceso
                progresivo, a tu ritmo, sin comparaciones ni exigencias de
                nivel.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                El acompañamiento personalizado busca fomentar la confianza, la
                autonomía y el descubrimiento de que siempre existe un mayor
                potencial de movimiento por explorar.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Beneficios
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map((b) => (
              <RevealOnScroll key={b.title}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted">{b.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Instructor */}
        <section id="instructor" className="bg-surface px-6 py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <RevealOnScroll className="flex flex-col items-center gap-8">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-accent/40 bg-background text-4xl font-bold text-accent">
                J
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Juan
                </h2>
                <p className="mt-2 text-accent">
                  Profesor de Educación Física · Instructor certificado PRAVILO
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                  PRAVILO ARG nace de una búsqueda que fue tanto profesional
                  como personal. Mientras buscaba una alternativa diferente a
                  los métodos tradicionales, Juan también atravesaba su propio
                  proceso físico. Ese recorrido lo llevó a descubrir PRAVILO y a
                  formarse en el sistema, con el deseo de acompañar a otras
                  personas que buscan nuevas posibilidades para su desarrollo y
                  bienestar.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Galería */}
        <section id="galeria" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Galería
            </h2>
          </RevealOnScroll>
          {/* ponytail: tiles de placeholder — reemplazar por fotos reales del centro cuando estén disponibles */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALERIA.map((label) => (
              <div
                key={label}
                className="flex aspect-square items-center justify-center rounded-xl border border-border bg-gradient-to-br from-surface to-background px-4 text-center text-sm text-muted"
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Sumate a los primeros (sección testimonios) */}
        <section className="bg-surface px-6 py-24 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Sé parte de los primeros
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              PRAVILO ARG recién abrió sus puertas como el primer centro de este
              método en el país. Reservá tu primera sesión y formá parte de las
              primeras experiencias de PRAVILO en Argentina.
            </p>
          </RevealOnScroll>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Preguntas frecuentes
            </h2>
          </RevealOnScroll>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {item.q}
                  <span className="ml-4 text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="bg-surface px-6 py-24 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ubicación
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              Neuquén, Argentina. Coordinamos la dirección exacta y el horario
              al reservar tu turno.
            </p>
            <a
              href={whatsappLink(
                "Hola! ¿Me pasás la ubicación exacta del centro?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full border border-border px-8 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Pedí la ubicación por WhatsApp
            </a>
          </RevealOnScroll>
        </section>

        {/* CTA final */}
        <section className="px-6 py-28 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Empezá tu proceso hoy
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Reservá tu primera sesión en el primer centro PRAVILO de
              Argentina.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ReserveButton className="rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground transition-transform hover:scale-105" />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-8 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
        <p className="font-semibold text-foreground">
          PRAVILO <span className="text-accent">ARG</span>
        </p>
        <p className="mt-2">Neuquén, Argentina</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            className="hover:text-foreground"
          >
            Instagram
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            WhatsApp
          </a>
        </div>
        <p className="mt-6">© {new Date().getFullYear()} PRAVILO ARG</p>
      </footer>
    </>
  );
}
