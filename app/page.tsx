import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import BookingWizard from "@/components/BookingWizard";
import MobileNav from "@/components/MobileNav";
import ScrollProgress from "@/components/ScrollProgress";
import SectionDots from "@/components/SectionDots";
import Marquee from "@/components/Marquee";
import Gallery from "@/components/Gallery";
import BenefitIcon from "@/components/BenefitIcon";
import SpotlightCard from "@/components/SpotlightCard";
import MagneticButton from "@/components/MagneticButton";
import ParallaxHero from "@/components/ParallaxHero";
import {
  GOOGLE_REVIEWS_URL,
  INSTAGRAM_URL,
  LOCATION,
  LOCATION_SHORT,
  MAPS_EMBED_SRC,
  SITE_URL,
  whatsappLink,
} from "@/lib/constants";
import { PLANES_EXPERIENCIA, PLANES_FUNCIONAL } from "@/lib/plans";

const NAV = [
  { href: "#que-es", label: "¿Qué es?" },
  { href: "#practica", label: "La práctica" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#instructor", label: "Instructor" },
  { href: "#galeria", label: "Galería" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
  { href: "#ubicacion", label: "Ubicación" },
];

const GALERIA_ACCION = [
  {
    src: "/images/pravilo-sign-suspension.jpg",
    alt: "Sesión de suspensión invertida frente al cartel PRAVILO",
  },
  {
    src: "/images/pravilo-pulley-tension.jpg",
    alt: "Trabajo de tracción en el sistema de poleas de PRAVILO",
  },
  {
    src: "/images/pravilo-neon-suspension.jpg",
    alt: "Sesión de suspensión con iluminación neón en el estudio",
  },
  {
    src: "/images/pravilo-mirror-suspension.jpg",
    alt: "Ejercicio de suspensión reflejado en el espejo del estudio",
  },
  {
    src: "/images/pravilo-estudio-completo.jpg",
    alt: "Vista completa del estudio PRAVILO ARG",
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

const TIPOS_EXPERIENCIA = [
  {
    icon: "isotipo" as const,
    title: "Experiencia PRAVILO",
    tagline: "Individual · Suspensión y tracción",
    desc: "Sesiones uno a uno guiadas por el instructor sobre el aparato de suspensión: trabajo profundo de fascia, movilidad y eje corporal. Empieza con una evaluación inicial.",
    bullets: [
      "Evaluación inicial incluida",
      "1h 30m por sesión",
      "A tu ritmo, sin grupo",
    ],
  },
  {
    icon: "funcional" as const,
    title: "Entrenamiento Funcional",
    tagline: "Semanal · Fuerza y resistencia",
    desc: "Rutinas funcionales de piso pensadas para complementar el trabajo de movilidad: fuerza, resistencia y control, con la misma mirada personalizada.",
    bullets: [
      "2 o 3 sesiones por semana",
      "Complementa cualquier deporte",
      "Seguimiento mensual",
    ],
  },
];

const BENEFICIOS = [
  {
    icon: "movilidad" as const,
    title: "Más movilidad",
    desc: "Ganá rango de movimiento real en articulaciones y cadera.",
  },
  {
    icon: "tension" as const,
    title: "Menos tensión y dolor",
    desc: "Liberá capas profundas de tejido que acumulan tensión crónica.",
  },
  {
    icon: "postura" as const,
    title: "Mejor postura",
    desc: "Trabajo consciente sobre la alineación de tu cuerpo en el día a día.",
  },
  {
    icon: "recuperacion" as const,
    title: "Recuperación activa",
    desc: "Complementá tu deporte o rutina con un trabajo regenerativo.",
  },
  {
    icon: "rendimiento" as const,
    title: "Rendimiento deportivo",
    desc: "Más amplitud y control de movimiento para cualquier disciplina.",
  },
  {
    icon: "bienestar" as const,
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
    q: "¿Para qué sirve PRAVILO?",
    a: "PRAVILO ayuda a mejorar la fuerza, movilidad, flexibilidad, postura, equilibrio y coordinación, promoviendo un cuerpo más funcional, saludable y preparado para la vida diaria.",
  },
  {
    q: "¿Qué hace diferente a PRAVILO?",
    a: "PRAVILO no se enfoca únicamente en entrenar. Busca desarrollar el cuerpo de manera integral, promoviendo movimiento, bienestar, conciencia corporal y una mejor calidad de vida.",
  },
  {
    q: "¿Cómo es una sesión y cuánto dura?",
    a: "Cada sesión comienza con una rutina de movilidad articular y una fase de activación, para después trabajar en la máquina de PRAVILO. La duración es de aproximadamente 60 minutos.",
  },
  {
    q: "¿Cómo es la primera sesión?",
    a: "La primera sesión incluye una evaluación inicial para conocer tu estado físico, tus condiciones actuales y observar tu postura.",
  },
  {
    q: "¿Necesito experiencia o estar en buen estado físico para empezar?",
    a: "No. PRAVILO se adapta a cada persona según su condición física, experiencia, necesidades y objetivos. La evaluación inicial nos permite ajustar el trabajo a tu punto de partida.",
  },
  {
    q: "¿Hay límite de edad?",
    a: "No. PRAVILO puede adaptarse a diferentes edades y niveles de condición física. Lo más importante es realizar una evaluación inicial para adecuar el trabajo a cada persona.",
  },
  {
    q: "¿Qué debo llevar a la sesión?",
    a: "Solo necesitás asistir con ropa cómoda que te permita moverte con libertad y una botella de agua. Nosotros nos encargamos del resto.",
  },
  {
    q: "¿Cuántas veces por semana se recomienda?",
    a: "Generalmente se recomienda entre 2 y 3 sesiones por semana, permitiendo que el cuerpo tenga tiempo para recuperarse y adaptarse. La frecuencia puede variar según cada persona, sus necesidades y sus objetivos.",
  },
  {
    q: "¿Qué esperar después de la primera sesión?",
    a: "Es común sentir mayor movilidad, alivio de tensiones, más conciencia corporal y una sensación de claridad mental y bienestar general.",
  },
  {
    q: "¿Dónde queda el centro?",
    a: `Estamos en ${LOCATION}.`,
  },
];

const TRUST_CARDS = [
  {
    title: "Exelente",
    subtitle: "Javier Garrafa · Google, 5★",
  },
  {
    title: "1er Centro PRAVILO de Argentina",
    subtitle: "Método traído por primera vez al país",
  },
  {
    title: "Instructor certificado en el sistema PRAVILO",
    subtitle: "Juan I. Garrafa, Profesor de Educación Física",
  },
  {
    title: "Evaluación inicial incluida",
    subtitle: "En cada primera sesión",
  },
  {
    title: "Sesiones 100% individuales",
    subtitle: "Sin grupos, a tu ritmo",
  },
  {
    title: "Antropometrista Nivel I",
    subtitle: "Formación certificada del instructor",
  },
];

function TrustCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="h-full w-64 rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted">{subtitle}</p>
    </div>
  );
}

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
          <Image
            src="/images/logo-transparent.png"
            alt="PRAVILO ARG"
            width={900}
            height={176}
            priority
            className="h-8 w-auto md:h-10"
          />
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
            <MagneticButton>
              <BookingWizard className="btn-shiny rounded-full bg-accent px-5 py-2 text-sm font-condensed font-semibold text-accent-foreground" />
            </MagneticButton>
            <MobileNav items={NAV} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <ParallaxHero>
          <section className="grain px-6 pt-28 pb-20 md:pt-36 md:pb-28">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
              <RevealOnScroll>
                <span className="eyebrow">
                  1° Centro PRAVILO de Argentina · Plottier, Neuquén
                </span>
                <h1 className="mt-6 font-condensed text-[15vw] leading-[0.85] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="hero-line" style={{ animationDelay: "0ms" }}>
                    Explorá
                  </span>
                  <span
                    className="hero-line text-accent-text"
                    style={{ animationDelay: "110ms" }}
                  >
                    tu cuerpo
                  </span>
                  <span
                    className="hero-line"
                    style={{ animationDelay: "220ms" }}
                  >
                    a otro nivel.
                  </span>
                </h1>
                <p className="mt-6 max-w-lg text-lg text-muted text-balance">
                  Entrenamiento y terapia de movilidad con el método Pravilo,
                  tradición eslava, ahora en Plottier.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <MagneticButton>
                    <BookingWizard className="btn-shiny rounded-full bg-accent px-8 py-3 font-condensed text-lg font-semibold text-accent-foreground" />
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-full border border-border px-8 py-3 font-condensed text-lg font-semibold transition-colors hover:border-accent hover:text-accent-text"
                    >
                      Escribinos por WhatsApp
                    </a>
                  </MagneticButton>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {["Evaluación inicial incluida", "Sesiones individuales"].map(
                    (t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 text-sm text-muted"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="h-3.5 w-3.5 shrink-0 text-accent-text"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 10.5l4 4 8-9"
                          />
                        </svg>
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </RevealOnScroll>
              <RevealOnScroll className="mx-auto w-full max-w-sm lg:max-w-none">
                <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-border shadow-[0_0_60px_-15px_var(--accent)]">
                  <video
                    poster="/images/pravilo-sign-suspension.jpg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source
                      src="/videos/hero-suspension-real.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </RevealOnScroll>
            </div>
            <RevealOnScroll className="mt-16 hidden justify-center lg:flex">
              <a
                href="#que-es"
                aria-label="Ver más"
                className="flex flex-col items-center gap-2 text-muted transition-colors hover:text-accent-text"
              >
                <span className="text-xs tracking-widest uppercase">
                  Scroll
                </span>
                <svg
                  viewBox="0 0 20 28"
                  className="h-7 w-5 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="1" y="1" width="18" height="26" rx="9" />
                  <circle cx="10" cy="8" r="1.6" fill="currentColor" />
                </svg>
              </a>
            </RevealOnScroll>
          </section>
        </ParallaxHero>

        {/* Cinta de credenciales */}
        <div className="border-y border-border bg-accent py-3">
          <Marquee
            items={CREDENCIALES}
            itemClassName="font-condensed text-sm font-bold text-accent-foreground"
          />
        </div>

        {/* ¿Qué es PRAVILO? */}
        <section id="que-es" className="mx-auto max-w-4xl px-6 py-24">
          <RevealOnScroll>
            <span className="eyebrow">¿Qué es PRAVILO?</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Movilidad, tracción y memoria del cuerpo
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              PRAVILO es un método de entrenamiento y trabajo corporal que
              utiliza un sistema de tensión y tracción para trabajar el cuerpo
              de forma integral, profunda y personalizada. A través de un
              dispositivo diseñado específicamente para este método, el cuerpo
              interactúa con diferentes fuerzas: la tensión, el propio peso y la
              gravedad. Esta combinación permite realizar posiciones y
              movimientos en múltiples direcciones, integrando movilidad,
              activación muscular, estiramiento y descompresión en un mismo
              sistema de trabajo.
            </p>
            <p className="mt-8 border-l-2 border-accent py-1 pl-6 font-condensed text-2xl leading-snug font-semibold text-balance md:text-3xl">
              Tu fascia guarda más que tensión: guarda tu historia.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-muted">
              PRAVILO no es simplemente una máquina ni se limita al
              estiramiento. Detrás de cada sesión existe una metodología
              específica, en la que el trabajo se adapta a las características,
              capacidades y objetivos de cada persona, siempre bajo la guía de
              un profesional capacitado.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-muted">
              El método propone una forma diferente de entender y trabajar el
              cuerpo: no como partes aisladas, sino como un sistema integrado,
              donde músculos, articulaciones, cadenas de movimiento y tejidos
              conectivos interactúan entre sí. Una experiencia corporal
              diferente, donde tensión, movimiento y gravedad se combinan para
              explorar, desafiar y desarrollar las capacidades del cuerpo.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Movilidad", desc: "Rango real de movimiento" },
                { label: "Tracción", desc: "Suspensión controlada" },
                { label: "Fascia", desc: "Memoria del cuerpo" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <p className="font-condensed text-lg font-bold text-accent-text">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        {/* Simetría / Vitruvio */}
        <section className="grain relative overflow-hidden bg-black px-6 py-24 text-center">
          <video
            poster="/images/vitruvian-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          >
            <source src="/videos/vitruvian.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
          <RevealOnScroll className="relative mx-auto max-w-2xl">
            <span className="eyebrow mx-auto w-fit">Proporción y simetría</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              El cuerpo, en equilibrio
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Como el hombre de Vitruvio, PRAVILO trabaja tu cuerpo como un
              sistema de proporciones: eje, tracción y simetría trabajando en
              conjunto, no partes aisladas.
            </p>
          </RevealOnScroll>
        </section>

        {/* La práctica / método */}
        <section id="practica" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <span className="eyebrow mx-auto w-fit">La práctica</span>
              <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
                Individual, guiada y adaptada a vos
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted">
                El trabajo comienza con una evaluación que permite conocer tus
                características, necesidades y objetivos para establecer un
                proceso progresivo y personalizado. La intensidad, el nivel de
                tensión y la duración se adaptan a tus posibilidades, respetando
                tu ritmo y evolución — sin forzar ni llevar el cuerpo al dolor.
              </p>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="relative mt-10 aspect-3/2 overflow-hidden rounded-sm border border-border">
                <video
                  poster="/images/promo-naranja.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source
                    src="/videos/practica-suspension.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </RevealOnScroll>
            <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
              {METODO.map((step, i) => (
                <RevealOnScroll
                  key={step.title}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="h-full bg-background p-6">
                    <span className="font-condensed text-3xl font-extrabold text-accent-text">
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

        {/* Tipos de experiencia */}
        <section id="experiencias" className="mx-auto max-w-5xl px-6 py-24">
          <RevealOnScroll>
            <span className="eyebrow mx-auto w-fit">Elegí tu camino</span>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
              Dos formas de moverte mejor
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted">
              Se complementan, pero podés empezar por la que más te resuene.
            </p>
          </RevealOnScroll>
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {TIPOS_EXPERIENCIA.map((t, i) => (
              <RevealOnScroll
                key={t.title}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <SpotlightCard className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-surface">
                  {t.icon === "isotipo" ? (
                    <svg
                      viewBox="0 0 24 40"
                      className="h-10 w-auto text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2v36" />
                      <path d="M4 15c4 3 12 3 16 0" />
                      <path d="M4 25c4-3 12-3 16 0" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 40 24"
                      className="h-10 w-auto text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M4 12h32" />
                      <path d="M4 6v12M9 8v8" />
                      <path d="M36 6v12M31 8v8" />
                    </svg>
                  )}
                  <h3 className="mt-5 text-xl font-bold">{t.title}</h3>
                  <p className="mt-1 font-condensed text-xs font-bold tracking-wide text-accent-text uppercase">
                    {t.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {t.desc}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm text-muted">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#precios"
                    className="mt-6 inline-flex items-center gap-2 font-condensed text-sm font-bold text-accent-text transition-transform group-hover:translate-x-1"
                  >
                    Ver planes →
                  </a>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <span className="eyebrow mx-auto w-fit">Beneficios</span>
              <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
                Lo que cambia en tu cuerpo
              </h2>
            </RevealOnScroll>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFICIOS.map((b, i) => (
                <RevealOnScroll
                  key={b.title}
                  style={{ transitionDelay: `${(i % 3) * 100}ms` }}
                >
                  <SpotlightCard className="h-full rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent/40">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                      <BenefitIcon name={b.icon} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted">{b.desc}</p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section id="instructor" className="px-6 py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <RevealOnScroll className="flex flex-col items-center gap-8">
              {/* ponytail: sin foto real todavía — avatar con inicial en vez de simular una foto */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-accent bg-background font-condensed text-4xl font-extrabold text-accent-text shadow-[0_0_40px_-8px_var(--accent)]">
                JG
              </div>
              <div className="relative">
                <span className="eyebrow relative">Instructor</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                  Juan I. Garrafa
                </h2>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-text">
                    Primer instructor de PRAVILO en Argentina
                  </span>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-text">
                    Profesor de Educación Física
                  </span>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-text">
                    Antropometrista Nivel I
                  </span>
                </div>
                <blockquote className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted italic">
                  &ldquo;Mi interés por PRAVILO surgió a partir de una búsqueda
                  personal. Conviviendo con un dolor crónico, conocí este método
                  mientras buscaba nuevas herramientas para abordar mi propia
                  situación. Esa experiencia despertó mi interés por profundizar
                  en su práctica y formación profesional. A partir de allí nació
                  PRAVILO ARG, con el objetivo de acercar este método a
                  Argentina y crear un espacio para quienes buscan una nueva
                  forma de trabajar sobre su cuerpo, superar sus propias
                  limitaciones o alcanzar sus objetivos personales y
                  deportivos.&rdquo;
                </blockquote>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Galería */}
        <section id="galeria" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll>
              <span className="eyebrow mx-auto w-fit">Galería</span>
              <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
                En acción
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted">
                Tocá una foto para verla en grande.
              </p>
            </RevealOnScroll>
            <Gallery
              images={GALERIA_ACCION}
              gridClassName="sm:grid-cols-3"
              aspectClassName="aspect-4/5"
            />
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <span className="eyebrow mx-auto w-fit">Planes</span>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
              Elegí tu formato
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted">
              Elegí el formato que mejor se adapte a tu objetivo. Podés
              cambiarlo antes de confirmar.
            </p>
          </RevealOnScroll>
          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-center">
            {PLANES_EXPERIENCIA.map((p) => (
              <RevealOnScroll key={p.title}>
                <SpotlightCard
                  className={`flex h-full flex-col rounded-2xl border p-7 ${
                    p.highlight
                      ? "border-accent bg-accent/10 shadow-[0_0_50px_-12px_var(--accent)] lg:scale-105"
                      : "border-border bg-background"
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 font-condensed text-[0.65rem] font-bold tracking-wide whitespace-nowrap text-accent-foreground uppercase">
                      Más elegido
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="font-condensed text-3xl font-extrabold text-accent-text">
                      {p.price}
                    </span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 10.5l4 4 8-9"
                          />
                        </svg>
                        <span className="text-muted">{f}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>

          <p className="eyebrow mx-auto mt-14 w-fit">Entrenamiento funcional</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {PLANES_FUNCIONAL.map((p) => (
              <RevealOnScroll key={p.title}>
                <SpotlightCard className="flex h-full flex-col rounded-2xl border border-border bg-background p-7">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 font-condensed text-3xl font-extrabold text-accent-text">
                    {p.price}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 10.5l4 4 8-9"
                          />
                        </svg>
                        <span className="text-muted">{f}</span>
                      </li>
                    ))}
                  </ul>
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
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <RevealOnScroll>
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                Preguntas frecuentes
              </h2>
              <p className="mt-4 text-muted">
                ¿No encontrás lo que buscás? Escribinos y te respondemos
                directo.
              </p>
              <MagneticButton className="mt-6 inline-block">
                <a
                  href={whatsappLink("Hola! Tengo una pregunta sobre PRAVILO.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-border px-6 py-2.5 font-condensed text-sm font-semibold transition-colors hover:border-accent hover:text-accent-text"
                >
                  Escribinos por WhatsApp
                </a>
              </MagneticButton>
            </RevealOnScroll>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <RevealOnScroll
                  key={item.q}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="rounded-2xl border border-border bg-background px-6 transition-colors has-[.accordion-toggle:checked]:border-accent/40">
                    <input
                      type="checkbox"
                      id={`faq-${i}`}
                      className="accordion-toggle peer hidden"
                    />
                    <label
                      htmlFor={`faq-${i}`}
                      className="accordion-header flex cursor-pointer items-center justify-between gap-4 py-5 font-medium"
                    >
                      {item.q}
                      <span className="accordion-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 text-accent-text transition-transform duration-300">
                        +
                      </span>
                    </label>
                    <div className="accordion-content">
                      <div className="accordion-inner">
                        <p className="pb-5 text-muted">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="px-6 py-24">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
            <RevealOnScroll>
              <span className="eyebrow">Ubicación</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                {LOCATION_SHORT}
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted">
                Coordinamos el horario al reservar tu turno.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"
                      />
                      <circle cx="12" cy="9.5" r="2.5" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Dirección</p>
                    <p className="text-sm text-muted">{LOCATION}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 7v5l3.5 2" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Horarios</p>
                    <p className="text-sm text-muted">
                      A coordinar según turno
                    </p>
                  </div>
                </div>
              </div>
              <MagneticButton className="mt-8 inline-block">
                <a
                  href={whatsappLink(
                    "Hola! ¿Me pasás la ubicación exacta del centro?",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full border border-border px-8 py-3 font-condensed text-lg font-semibold transition-colors hover:border-accent hover:text-accent-text"
                >
                  Pedí la ubicación por WhatsApp
                </a>
              </MagneticButton>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={MAPS_EMBED_SRC}
                  title="Mapa de Plottier, Neuquén"
                  width="100%"
                  height="420"
                  loading="lazy"
                  className="block invert-[90%] hue-rotate-180 contrast-[.9] brightness-90"
                />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="bg-surface px-6 py-24">
          <RevealOnScroll className="mx-auto max-w-2xl rounded-3xl border border-border bg-background p-10 text-center md:p-14">
            <div className="mx-auto flex w-fit gap-1.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-accent-text"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z"
                  />
                </svg>
              ))}
            </div>
            <span className="eyebrow mx-auto mt-4 w-fit">Reseña en Google</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              &ldquo;Exelente&rdquo;
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Javier Garrafa calificó a PRAVILO ARG con 5 estrellas en Google.
              Somos el primer centro de este método en el país — reservá tu
              sesión y sé de los próximos en compartir tu experiencia.
            </p>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-accent-text underline underline-offset-4"
            >
              Ver reseña en Google Maps →
            </a>
          </RevealOnScroll>

          <RevealOnScroll className="mt-14 space-y-3">
            <Marquee
              variant="cards"
              items={TRUST_CARDS.slice(0, 3).map((card) => (
                <TrustCard key={card.title} {...card} />
              ))}
            />
            <Marquee
              variant="cards"
              reverse
              items={TRUST_CARDS.slice(3).map((card) => (
                <TrustCard key={card.title} {...card} />
              ))}
            />
          </RevealOnScroll>
        </section>

        {/* CTA final */}
        <section className="grain relative overflow-hidden px-6 py-28 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
          />
          <RevealOnScroll className="relative">
            <h2 className="font-condensed text-4xl font-extrabold tracking-tight md:text-6xl">
              Empezá tu proceso hoy
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Reservá tu primera sesión en el primer centro PRAVILO de
              Argentina.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>
                <BookingWizard className="btn-shiny rounded-full bg-accent px-8 py-3 font-condensed text-lg font-semibold text-accent-foreground" />
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full border border-border px-8 py-3 font-condensed text-lg font-semibold transition-colors hover:border-accent hover:text-accent-text"
                >
                  Escribinos por WhatsApp
                </a>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
        <Image
          src="/images/logo-transparent.png"
          alt="PRAVILO ARG"
          width={900}
          height={176}
          className="mx-auto h-10 w-auto"
        />
        <p className="mt-2">{LOCATION}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent-text"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
            </svg>
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent-text"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
            </svg>
          </a>
        </div>
        <p className="mt-6">© {new Date().getFullYear()} PRAVILO ARG</p>
      </footer>
    </>
  );
}
