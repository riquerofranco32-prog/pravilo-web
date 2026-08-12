import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import BookingWizard from "@/components/BookingWizard";
import MobileNav from "@/components/MobileNav";
import ScrollProgress from "@/components/ScrollProgress";
import SectionDots from "@/components/SectionDots";
import Marquee from "@/components/Marquee";
import SpotlightCard from "@/components/SpotlightCard";
import ParallaxHero from "@/components/ParallaxHero";
import {
  INSTAGRAM_URL,
  LOCATION,
  MAPS_EMBED_SRC,
  SITE_URL,
  whatsappLink,
} from "@/lib/constants";
import { PLANES } from "@/lib/plans";

const NAV = [
  { href: "#que-es", label: "¿Qué es?" },
  { href: "#practica", label: "La práctica" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#instructor", label: "Instructor" },
  { href: "#galeria", label: "Galería" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
  { href: "#ubicacion", label: "Ubicación" },
];

const GALERIA = [
  {
    src: "/images/rig-completo.jpg",
    alt: "Aparato de suspensión y tracción PRAVILO armado en Plottier",
  },
  {
    src: "/images/rig-anillas.jpg",
    alt: "Detalle de las anillas del aparato PRAVILO",
  },
  {
    src: "/images/pared-pravilo.jpg",
    alt: "Sector de entrenamiento funcional del centro PRAVILO ARG",
  },
  {
    src: "/images/rig-detalle.jpg",
    alt: "Detalle de la estructura de madera del aparato PRAVILO",
  },
];

const METODO = [
  {
    n: "01",
    title: "Eje",
    desc: "Todo el trabajo se organiza sobre un eje vertical.",
  },
  {
    n: "02",
    title: "Tracción",
    desc: "La suspensión con cuerdas genera tracción controlada.",
  },
  {
    n: "03",
    title: "Simetría",
    desc: "Extensión pareja de los dos lados del cuerpo.",
  },
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

const CREDENCIALES = [
  "Instructor certificado en el sistema PRAVILO",
  "Antropometrista",
  "1er Centro PRAVILO de Argentina",
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
    a: "La Experiencia Individual dura 1h30 e incluye evaluación. La frecuencia ideal se define según tu objetivo — te asesoramos al reservar.",
  },
  {
    q: "¿Dónde queda el centro?",
    a: `Estamos en ${LOCATION}. Te pasamos la dirección exacta al coordinar tu turno.`,
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "PRAVILO ARG",
    description:
      "Primer centro Pravilo de Argentina. Entrenamiento y terapia de movilidad, individual y personalizado.",
    url: SITE_URL,
    telephone: "+5492942564386",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Plottier",
      addressRegion: "Neuquén",
      addressCountry: "AR",
    },
    sameAs: [INSTAGRAM_URL],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ScrollProgress />
      <SectionDots items={NAV} />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="rounded-lg bg-white px-3 py-2">
            <Image
              src="/images/logo.png"
              alt="PRAVILO ARG"
              width={140}
              height={34}
              priority
              className="h-9 w-auto md:h-11"
            />
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
          <div className="flex items-center gap-3">
            <BookingWizard className="btn-shiny rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-transform hover:scale-105" />
            <MobileNav items={NAV} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <ParallaxHero>
          <section className="px-6 py-32 text-center md:py-48">
            <RevealOnScroll>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                1° Centro PRAVILO de Argentina · Plottier, Neuquén
              </p>
              <h1 className="text-shimmer mx-auto max-w-3xl text-5xl font-bold tracking-tight text-balance md:text-7xl">
                Descubrí una nueva forma de cuidar tu cuerpo
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted text-balance">
                Entrenamiento y terapia de movilidad con el método Pravilo.
                Suspensión, tracción y eje — tradición eslava, ahora en
                Plottier.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <BookingWizard className="btn-shiny rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground transition-transform hover:scale-105" />
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-8 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Escribinos por WhatsApp
                </a>
              </div>
              <div className="mx-auto mt-10 max-w-2xl">
                <Marquee items={CREDENCIALES} />
              </div>
            </RevealOnScroll>
          </section>
        </ParallaxHero>

        {/* ¿Qué es PRAVILO? */}
        <section id="que-es" className="mx-auto max-w-4xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              ¿Qué es PRAVILO?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              PRAVILO es un sistema de entrenamiento y terapia de movimiento, de
              tradición eslava, que trabaja la movilidad, la flexibilidad y las
              capas profundas de tu cuerpo —la fascia— para que puedas moverte
              con más libertad y menos tensión. Tu fascia guarda más que
              tensión: guarda tu historia.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Es para todos los que buscan moverse mejor: no importa si sos
              deportista, trabajás muchas horas sentado, manejás largas
              distancias o simplemente querés sentirte mejor en tu cuerpo.
            </p>
          </RevealOnScroll>
        </section>

        {/* La práctica / método */}
        <section id="practica" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-accent">
                La práctica
              </p>
              <h2 className="mt-3 text-center text-3xl font-bold tracking-tight md:text-4xl">
                Suspensión, tracción y eje
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted">
                Cada sesión es individual y personalizada, guiada de principio a
                fin por un instructor certificado en el sistema PRAVILO.
                Empezamos con una evaluación inicial y armamos un proceso
                progresivo, a tu ritmo.
              </p>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="relative mt-10 aspect-21/9 overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/images/accion-suspension.jpg"
                  alt="Sesión de suspensión y tracción del método PRAVILO"
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {METODO.map((step, i) => (
                <RevealOnScroll
                  key={step.title}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="h-full rounded-2xl border border-border bg-background p-6">
                    <span className="text-sm font-semibold text-accent">
                      {step.n}
                    </span>
                    <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted">{step.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Beneficios
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map((b) => (
              <RevealOnScroll key={b.title}>
                <SpotlightCard className="flex h-full flex-col justify-center rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted">{b.desc}</p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Instructor */}
        <section id="instructor" className="bg-surface px-6 py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <RevealOnScroll className="flex flex-col items-center gap-8">
              {/* ponytail: sin foto real todavía — avatar con inicial en vez de simular una foto */}
              <div className="border-beam flex h-28 w-28 items-center justify-center rounded-full border border-accent/40 bg-background text-4xl font-bold text-accent">
                JG
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Juan Garrafa
                </h2>
                <p className="mt-2 text-accent">
                  Instructor PRAVILO &amp; Antropometrista
                </p>
                <blockquote className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted italic">
                  &ldquo;Creé PRAVILO ARG con el objetivo de brindar una
                  atención completamente personalizada, adaptada a las
                  necesidades, objetivos y características de cada persona. Cada
                  experiencia comienza con una evaluación inicial para conocerte
                  y diseñar un recorrido pensado exclusivamente para vos.&rdquo;
                </blockquote>
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
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {GALERIA.map((img) => (
              <RevealOnScroll key={img.src}>
                <div className="relative aspect-4/3 h-full overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Planes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted">
              Elegí el formato que mejor se adapte a tu objetivo. Podés
              cambiarlo antes de confirmar.
            </p>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLANES.map((p) => (
              <RevealOnScroll key={p.title}>
                <SpotlightCard
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    p.highlight
                      ? "border-beam border-accent bg-accent/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-2xl font-bold text-accent">
                    {p.price}
                  </p>
                  <p className="mt-3 text-sm text-muted">{p.desc}</p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Precios de referencia, sujetos a confirmación al reservar.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <RevealOnScroll>
              <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                Preguntas frecuentes
              </h2>
            </RevealOnScroll>
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
              {FAQ.map((item, i) => (
                <div key={item.q} className="p-6">
                  <input
                    type="checkbox"
                    id={`faq-${i}`}
                    className="accordion-toggle peer hidden"
                  />
                  <label
                    htmlFor={`faq-${i}`}
                    className="accordion-header flex cursor-pointer items-center justify-between font-medium"
                  >
                    {item.q}
                    <span className="accordion-icon ml-4 text-accent transition-transform duration-300">
                      +
                    </span>
                  </label>
                  <div className="accordion-content">
                    <div className="accordion-inner">
                      <p className="pt-3 text-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="px-6 py-24 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ubicación
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              {LOCATION}. Coordinamos la dirección exacta y el horario al
              reservar tu turno.
            </p>
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-border">
              <iframe
                src={MAPS_EMBED_SRC}
                title="Mapa de Plottier, Neuquén"
                width="100%"
                height="320"
                loading="lazy"
                className="block invert-[90%] hue-rotate-180 contrast-[.9] brightness-90"
              />
            </div>
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

        {/* Testimonios */}
        <section id="testimonios" className="bg-surface px-6 py-24 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Sé parte de los primeros
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              PRAVILO ARG recién abrió sus puertas como el primer centro de este
              método en el país. Todavía no hay testimonios propios, pero Juan
              llega con formación certificada en el sistema PRAVILO y
              trayectoria como antropometrista. Reservá tu primera sesión y sé
              de los primeros en compartir tu experiencia.
            </p>
          </RevealOnScroll>
        </section>

        {/* CTA final */}
        <section className="bg-surface px-6 py-28 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Empezá tu proceso hoy
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Reservá tu primera sesión en el primer centro PRAVILO de
              Argentina.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <BookingWizard className="btn-shiny rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground transition-transform hover:scale-105" />
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
        <p className="inline-block rounded-lg bg-white px-3 py-2">
          <Image
            src="/images/logo.png"
            alt="PRAVILO ARG"
            width={140}
            height={34}
            className="h-9 w-auto"
          />
        </p>
        <p className="mt-2">{LOCATION}</p>
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
