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
import GoogleReviews from "@/components/GoogleReviews";
import FAQAccordion from "@/components/FAQAccordion";
import BodyQuiz from "@/components/BodyQuiz";
import GiftCardModal from "@/components/GiftCardModal";
import LiveSocialProof from "@/components/LiveSocialProof";
import { GOOGLE_REVIEWS } from "@/lib/reviews";
import {
  GOOGLE_REVIEWS_URL,
  INSTAGRAM_URL,
  LOCATION,
  LOCATION_SHORT,
  MAPS_EMBED_SRC,
  SITE_URL,
  whatsappLink,
} from "@/lib/constants";
import { PLANES_EXPERIENCIA } from "@/lib/plans";

const NAV = [
  { href: "#que-es", label: "¿Qué es?" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#instructor", label: "Instructor" },
  { href: "#galeria", label: "Galería" },
  { href: "#precios", label: "Precios" },
  { href: "#testimonios", label: "Reseñas" },
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
  { src: "/images/foto-img-3392.jpg", alt: "Instructor frente al cartel PRAVILO ARG" },
  { src: "/images/foto-img-3399.jpg", alt: "El aparato PRAVILO — estructura de cuerdas y poleas" },
  { src: "/images/foto-img-3421.jpg", alt: "Instructor configurando el sistema de tracción" },
  { src: "/images/foto-img-3428.jpg", alt: "Sesión guiada en el estudio PRAVILO" },
  { src: "/images/foto-img-3433.jpg", alt: "Trabajo individual con el método PRAVILO" },
  { src: "/images/foto-img-3437.jpg", alt: "Instructor asistiendo en sesión de movilidad" },
  { src: "/images/foto-img-3441.jpg", alt: "Tracción y simetría en PRAVILO" },
  { src: "/images/foto-img-3443.jpg", alt: "Ejercicio en el estudio PRAVILO" },
  { src: "/images/foto-img-3444.jpg", alt: "Trabajo corporal profundo en PRAVILO" },
  { src: "/images/foto-img-3446.jpg", alt: "Suspensión con instructor PRAVILO" },
  { src: "/images/foto-img-3447.jpg", alt: "Sesión de tracción en PRAVILO" },
  { src: "/images/foto-img-3448.jpg", alt: "Movimiento y eje en PRAVILO" },
  { src: "/images/foto-img-3449.jpg", alt: "Práctica completa en PRAVILO" },
];

const BENEFICIOS = [
  {
    icon: "movilidad" as const,
    title: "Más movilidad y amplitud",
    desc: "Ganá rango de movimiento articular real en hombros, columna y caderas.",
  },
  {
    icon: "tension" as const,
    title: "Alivio de dolor y compresión",
    desc: "Descompresión intervertebral suave que libera contracturas y presión nerviosa.",
  },
  {
    icon: "postura" as const,
    title: "Alineación y reeducación",
    desc: "Trabajo consciente sobre la postura natural y simetría del cuerpo en tu día a día.",
  },
  {
    icon: "recuperacion" as const,
    title: "Recuperación activa profunda",
    desc: "Elongación fascial tridimensional sin impacto, ideal para complementar deportes.",
  },
  {
    icon: "rendimiento" as const,
    title: "Potencia y control corporal",
    desc: "Mayor transferencia de fuerza y libertad motriz para cualquier disciplina física.",
  },
  {
    icon: "bienestar" as const,
    title: "Ligereza y claridad mental",
    desc: "Reseteo del sistema nervioso y sensación de bienestar inmediato al terminar la sesión.",
  },
];

const CREDENCIALES = [
  "Primer Centro Oficial de PRAVILO en Argentina",
  "Instructor Certificado · Juan I. Garrafa",
  "Profesor de Educación Física",
  "Antropometrista Nivel I",
  "Sesiones 100% Individuales y Personalizadas",
  "Plottier, Neuquén",
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
    title: "Calificación 5.0 ★",
    subtitle: "Reseñas reales verificadas en Google Maps",
  },
  {
    title: "1° Centro Oficial de Argentina",
    subtitle: "Pioneros en el método eslavo PRAVILO",
  },
  {
    title: "Prof. Juan I. Garrafa",
    subtitle: "Instructor oficial y Profesor de Educación Física",
  },
  {
    title: "Evaluación inicial incluida",
    subtitle: "Diagnóstico biomecánico en tu 1° sesión",
  },
  {
    title: "Sesiones 100% 1 a 1",
    subtitle: "Atención individualizada, sin grupos ni distracciones",
  },
  {
    title: "Antropometrista Certificado",
    subtitle: "Lectura morfológica y estructural personalizada",
  },
];

function TrustCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="h-full w-72 rounded-2xl border border-border bg-surface-raised/80 p-4 shadow-sm backdrop-blur-md">
      <p className="font-condensed text-base font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted leading-relaxed">{subtitle}</p>
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
    sameAs: [INSTAGRAM_URL, GOOGLE_REVIEWS_URL],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: String(GOOGLE_REVIEWS.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: GOOGLE_REVIEWS.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: "2026-08-20",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
      },
      reviewBody: r.content,
    })),
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

      {/* Header Sticky con Glassmorphism */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl transition-all">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Image
              src="/images/logo-transparent.png"
              alt="PRAVILO ARG"
              width={900}
              height={176}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>

          <nav className="hidden gap-6 text-sm font-medium text-muted lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground hover:text-accent-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <MagneticButton>
              <BookingWizard className="btn-shiny rounded-full bg-accent px-5 py-2.5 text-xs font-condensed font-bold uppercase tracking-wider text-accent-foreground shadow-md" />
            </MagneticButton>
            <MobileNav items={NAV} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <ParallaxHero>
          <section className="grain relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
            {/* Ambient Background Aura */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-5xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(160,26,26,0.22),transparent_70%)]"
            />

            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr] relative">
              <RevealOnScroll>
                {/* Badges de Confianza y Estado */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="eyebrow">
                    1° Centro Oficial · Plottier, Neuquén
                  </span>
                  <a
                    href="#testimonios"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-highlight bg-surface-raised px-3.5 py-1 text-xs text-muted backdrop-blur transition-all hover:border-accent hover:text-foreground shadow-sm"
                  >
                    <span className="text-amber-400">★★★★★</span>
                    <span className="font-bold text-foreground">5.0</span>
                    <span className="text-xs text-muted">en Google</span>
                    <span className="text-accent-text font-bold">→</span>
                  </a>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Turnos disponibles esta semana</span>
                  </span>
                </div>

                {/* Titular Monumental */}
                <h1 className="mt-6 font-condensed text-[14vw] leading-[0.88] font-black tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="hero-line" style={{ animationDelay: "0ms" }}>
                    EXPLORÁ
                  </span>
                  <span
                    className="hero-line text-gradient-accent"
                    style={{ animationDelay: "110ms" }}
                  >
                    TU CUERPO
                  </span>
                  <span
                    className="hero-line"
                    style={{ animationDelay: "220ms" }}
                  >
                    A OTRO NIVEL.
                  </span>
                </h1>

                {/* Bajada */}
                <p className="mt-6 max-w-lg text-lg text-muted text-balance leading-relaxed">
                  Entrenamiento y terapia de movilidad profunda con el método eslavo{" "}
                  <strong className="text-foreground font-semibold">PRAVILO</strong>. Descompresión
                  axial de 4 puntos, liberación fascial y alineación postural guiada en Plottier.
                </p>

                {/* CTAs */}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <MagneticButton>
                    <BookingWizard className="btn-shiny rounded-full bg-accent px-8 py-4 font-condensed text-lg font-bold uppercase tracking-wider text-accent-foreground shadow-[0_4px_30px_-5px_rgba(160,26,26,0.6)]" />
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-full border border-border-highlight bg-surface/80 px-8 py-4 font-condensed text-lg font-bold text-foreground backdrop-blur-md transition-all hover:border-accent hover:text-accent-text hover:bg-surface-raised"
                    >
                      Consultar por WhatsApp
                    </a>
                  </MagneticButton>
                </div>

                {/* Trust Points */}
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-border/70 pt-6">
                  {["Evaluación inicial 1 a 1", "Sin impacto articular", "Apto para todas las edades"].map(
                    (t) => (
                      <span
                        key={t}
                        className="flex items-center gap-2 text-xs font-medium text-muted"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-accent-text font-bold text-[10px]">
                          ✓
                        </span>
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </RevealOnScroll>

              {/* Showcase de Video Hero */}
              <RevealOnScroll className="mx-auto w-full max-w-sm lg:max-w-none">
                <div className="relative aspect-3/4 overflow-hidden rounded-3xl border border-border-highlight bg-surface shadow-[0_0_80px_-20px_rgba(160,26,26,0.5)]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Badge flotante en el video */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-condensed text-xs font-bold uppercase tracking-wider text-white">
                      Sesión 1 a 1 en vivo · Plottier
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl border border-white/10 bg-black/70 p-3.5 backdrop-blur-md">
                    <p className="font-condensed text-sm font-bold text-white">
                      Tracción axial y descompresión 3D
                    </p>
                    <p className="text-xs text-white/70 mt-0.5">
                      Experimentá la ligereza en tu columna desde los primeros 15 minutos.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>
        </ParallaxHero>

        {/* Cinta de credenciales */}
        <div className="border-y border-border bg-gradient-to-r from-accent via-[#c42525] to-accent py-3.5 shadow-md">
          <Marquee
            items={CREDENCIALES}
            itemClassName="font-condensed text-sm font-black tracking-wider uppercase text-accent-foreground"
          />
        </div>

        {/* ¿QUÉ ES PRAVILO? */}
        <section id="que-es" className="relative mx-auto max-w-6xl px-6 py-28 overflow-hidden">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_400px] lg:items-start">
            <RevealOnScroll>
              <span className="eyebrow">¿Qué es el método?</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Movilidad, tracción axial y memoria del cuerpo
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                PRAVILO es un método ancestral eslavo de entrenamiento y recuperación que
                utiliza un sistema de suspensión y tracción progresiva en 4 puntos.
                Al interactuar con la gravedad y el propio peso, se libera la presión
                intervertebral y se expanden las cadenas miofasciales profundas que no
                alcanza el estiramiento convencional.
              </p>

              {/* Pull quote destacado */}
              <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 shadow-inner relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-accent to-accent-glow" />
                <p className="font-condensed text-2xl font-bold leading-snug text-foreground md:text-3xl pl-2">
                  &ldquo;Tu fascia guarda más que tensión: guarda tu historia postural.&rdquo;
                </p>
              </div>

              {/* Foto intercalada en mobile/desktop */}
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-border-highlight shadow-[0_0_50px_-20px_rgba(160,26,26,0.4)]">
                <Image
                  src="/images/foto-img-3399.jpg"
                  alt="El aparato PRAVILO — sistema de cuerdas y tensión"
                  width={900}
                  height={600}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-condensed font-bold uppercase tracking-wider bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    Estructura original PRAVILO
                  </span>
                </div>
              </div>

              <p className="mt-8 text-lg leading-relaxed text-muted">
                Detrás de cada sesión existe una metodología milimétricamente adaptada
                a las características, lesiones previas y objetivos de cada persona,
                siempre bajo la guía constante y personalizada de Juan Garrafa.
              </p>
            </RevealOnScroll>

            {/* Foto lateral fija en desktop */}
            <RevealOnScroll className="hidden lg:block" style={{ transitionDelay: "150ms" }}>
              <div className="sticky top-28 overflow-hidden rounded-3xl border border-border-highlight shadow-[0_0_60px_-20px_rgba(160,26,26,0.45)] group">
                <Image
                  src="/images/pravilo-sign-suspension.jpg"
                  alt="Sesión de tracción y suspensión en el aparato PRAVILO"
                  width={760}
                  height={1000}
                  sizes="400px"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="rounded-full bg-accent px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    100% Individual
                  </span>
                  <p className="mt-2 font-condensed text-xl font-bold text-white">
                    Descompresión guiada en estudio privado
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* METODOLOGÍA: ANATOMÍA DE LOS 60 MINUTOS */}
        <section id="metodologia" className="border-t border-border bg-surface px-6 py-28 relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-full max-w-4xl bg-[radial-gradient(circle,rgba(160,26,26,0.12),transparent_70%)]"
          />

          <div className="relative mx-auto max-w-6xl">
            <RevealOnScroll className="text-center mb-16">
              <span className="eyebrow mx-auto w-fit">Metodología Paso a Paso</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                ¿Qué pasa en tu cuerpo durante los 60 minutos?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted text-base md:text-lg">
                Un circuito biomecánico secuencial diseñado para desinflamar, descomprimir vértebras y reeducar tu estructura.
              </p>
            </RevealOnScroll>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <RevealOnScroll style={{ transitionDelay: "0ms" }}>
                <div className="h-full rounded-3xl border border-border bg-surface-raised/80 p-7 shadow-lg transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(160,26,26,0.3)]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 font-condensed text-base font-black text-accent-text">
                      01
                    </span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 font-condensed text-[11px] font-bold uppercase tracking-wider text-muted">
                      Min 00 - 15
                    </span>
                  </div>
                  <h3 className="mt-5 font-condensed text-xl font-bold text-foreground">
                    1. Evaluación & Entrada en Calor
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Lectura postural estática y dinámica, movilidad articular y preparación fascial guiada de forma 100% personalizada por Juan.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll style={{ transitionDelay: "100ms" }}>
                <div className="h-full rounded-3xl border border-border bg-surface-raised/80 p-7 shadow-lg transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(160,26,26,0.3)]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 font-condensed text-base font-black text-accent-text">
                      02
                    </span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 font-condensed text-[11px] font-bold uppercase tracking-wider text-muted">
                      Min 15 - 35
                    </span>
                  </div>
                  <h3 className="mt-5 font-condensed text-xl font-bold text-foreground">
                    2. Tracción & Descompresión
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Ingreso al dispositivo PRAVILO. Suspensión suave en 4 puntos y apertura axial milimétrica liberando compresión de discos.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll style={{ transitionDelay: "200ms" }}>
                <div className="h-full rounded-3xl border border-border bg-surface-raised/80 p-7 shadow-lg transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(160,26,26,0.3)]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 font-condensed text-base font-black text-accent-text">
                      03
                    </span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 font-condensed text-[11px] font-bold uppercase tracking-wider text-muted">
                      Min 35 - 50
                    </span>
                  </div>
                  <h3 className="mt-5 font-condensed text-xl font-bold text-foreground">
                    3. Expansión Fascial 3D
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Trabajo tridimensional en múltiples planos de movimiento. Ganancia de rango articular y elongación sin tensión forzada.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll style={{ transitionDelay: "300ms" }}>
                <div className="h-full rounded-3xl border border-border bg-surface-raised/80 p-7 shadow-lg transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(160,26,26,0.3)]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 font-condensed text-base font-black text-accent-text">
                      04
                    </span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 font-condensed text-[11px] font-bold uppercase tracking-wider text-muted">
                      Min 50 - 60
                    </span>
                  </div>
                  <h3 className="mt-5 font-condensed text-xl font-bold text-foreground">
                    4. Integración & Ligereza
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Descarga en piso, reseteo del sistema nervioso y asimilación postural para salir renovado, liviano y con mayor eje corporal.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section id="beneficios" className="px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll className="text-center">
              <span className="eyebrow mx-auto w-fit">Beneficios Comprobados</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Lo que cambia en tu cuerpo
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted text-base md:text-lg">
                Beneficios inmediatos desde la primera sesión y cambios estructurales duraderos.
              </p>
            </RevealOnScroll>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFICIOS.map((b, i) => (
                <RevealOnScroll
                  key={b.title}
                  style={{ transitionDelay: `${(i % 3) * 100}ms` }}
                >
                  <SpotlightCard className="group h-full rounded-3xl border border-border bg-surface-raised/60 p-7 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(160,26,26,0.35)]">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-inner group-hover:border-accent/60 transition-colors">
                      <BenefitIcon name={b.icon} />
                    </div>
                    <h3 className="mt-5 font-condensed text-xl font-bold text-foreground group-hover:text-accent-text transition-colors">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed">{b.desc}</p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* EL INSTRUCTOR */}
        <section id="instructor" className="border-t border-border bg-surface px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
              {/* Fotografía del Instructor con Marco de Estudio */}
              <RevealOnScroll className="w-full max-w-xs shrink-0 md:max-w-sm">
                <div className="relative overflow-hidden rounded-3xl border border-border-highlight shadow-[0_0_60px_-15px_rgba(160,26,26,0.4)] group">
                  <Image
                    src="/images/foto-img-3392.jpg"
                    alt="Juan I. Garrafa, instructor oficial de PRAVILO ARG"
                    width={760}
                    height={1010}
                    sizes="(min-width: 768px) 384px, 100vw"
                    className="h-auto w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="rounded-full bg-accent px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-accent-foreground">
                      Instructor Certificado
                    </span>
                    <p className="mt-2 font-condensed text-xl font-black text-white">
                      Juan I. Garrafa
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Biografía y Declaración */}
              <RevealOnScroll className="flex-1 text-center md:text-left" style={{ transitionDelay: "120ms" }}>
                <span className="eyebrow">Tu Guía en PRAVILO</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  Juan I. Garrafa
                </h2>

                {/* Badges de Certificación */}
                <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-condensed font-bold uppercase tracking-wider text-accent-text">
                    1° Instructor de PRAVILO en Argentina
                  </span>
                  <span className="rounded-full border border-border bg-surface-raised px-3.5 py-1 text-xs font-condensed font-semibold text-muted">
                    Profesor de Educación Física
                  </span>
                  <span className="rounded-full border border-border bg-surface-raised px-3.5 py-1 text-xs font-condensed font-semibold text-muted">
                    Antropometrista Nivel I
                  </span>
                </div>

                <blockquote className="relative mt-7 text-base leading-relaxed text-muted/90 italic border-l-2 border-accent pl-6 py-2 bg-accent/5 rounded-r-2xl">
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

                <div className="mt-8 flex justify-center md:justify-start">
                  <MagneticButton>
                    <a
                      href={whatsappLink("Hola Juan! Me gustaría hacerte una consulta sobre el método PRAVILO.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shiny inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-condensed text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-md hover:opacity-95"
                    >
                      <span>Hablar directamente con Juan</span>
                      <span>→</span>
                    </a>
                  </MagneticButton>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* GALERÍA EN ACCIÓN */}
        <section id="galeria" className="px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll className="text-center">
              <span className="eyebrow mx-auto w-fit">Galería de Práctica</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                El Estudio & En Acción
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted text-base">
                Conocé las instalaciones, el dispositivo de tracción y las posiciones de suspensión en el estudio de Plottier.
              </p>
            </RevealOnScroll>

            <Gallery images={GALERIA_ACCION} />
          </div>
        </section>

        {/* TEST INTERACTIVO */}
        <section className="border-t border-border px-6 py-28 bg-surface">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll className="text-center mb-12">
              <span className="eyebrow mx-auto w-fit">Evaluación Rápida</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                ¿Qué experiencia es ideal para tu cuerpo?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted text-base">
                Respondé 3 preguntas en 30 segundos y descubrí el plan que mejor se adapta a tus necesidades biomecánicas.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <BodyQuiz />
            </RevealOnScroll>
          </div>
        </section>

        {/* PRECIOS Y EXPERIENCIAS */}
        <section id="precios" className="mx-auto max-w-6xl px-6 py-28">
          <RevealOnScroll className="text-center">
            <span className="eyebrow mx-auto w-fit">Elegí tu experiencia</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Experiencias PRAVILO
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted text-base md:text-lg">
              Sesiones 1 a 1 guiadas en todo momento por Juan en el aparato Pravilo oficial.
              Duración completa: 60 minutos.
            </p>
          </RevealOnScroll>

          <div className="mt-14 grid gap-7 lg:grid-cols-3 lg:items-stretch">
            {PLANES_EXPERIENCIA.map((p) => (
              <RevealOnScroll key={p.title}>
                <SpotlightCard
                  className={`flex h-full flex-col justify-between rounded-3xl border p-8 transition-all duration-300 ${
                    p.highlight
                      ? "border-accent bg-gradient-to-b from-accent/15 via-surface-raised to-surface-raised shadow-[0_0_60px_-15px_rgba(160,26,26,0.6)] lg:-translate-y-3"
                      : "border-border bg-surface-raised/70 hover:border-border-highlight"
                  }`}
                >
                  <div>
                    {p.highlight && (
                      <span className="inline-block rounded-full bg-accent px-3.5 py-1 font-condensed text-xs font-black tracking-wider text-accent-foreground uppercase shadow-md mb-3">
                        Plan Más Recomendado
                      </span>
                    )}
                    <h3 className="font-condensed text-2xl font-bold text-foreground">{p.title}</h3>
                    <p className="mt-3 flex items-baseline gap-1">
                      <span className="font-condensed text-4xl font-black text-accent-text">
                        {p.price}
                      </span>
                    </p>
                    <ul className="mt-6 space-y-3 border-t border-border/80 pt-6 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <svg
                            viewBox="0 0 20 20"
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
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
                          <span className="text-muted leading-relaxed text-xs sm:text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-border/80">
                    <BookingWizard
                      buttonText="Reservar turno ahora →"
                      className={`btn-shiny w-full rounded-full py-3.5 font-condensed text-base font-bold uppercase tracking-wider transition-all ${
                        p.highlight
                          ? "bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
                          : "border border-border bg-background text-foreground hover:border-accent hover:text-accent-text"
                      }`}
                    />
                  </div>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>

          {/* Banner de Gift Card VIP */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-surface-raised to-surface-raised p-8 text-center sm:flex-row sm:text-left shadow-xl">
            <div>
              <span className="inline-block rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-condensed text-[11px] font-bold uppercase tracking-wider text-accent-text mb-2">
                Experiencia para regalar
              </span>
              <h3 className="font-condensed text-2xl font-black text-foreground">
                ¿Buscás hacer un regalo diferente y memorable?
              </h3>
              <p className="mt-1 text-sm text-muted">
                Encargá un voucher digital de PRAVILO para un cumpleaños o fecha especial con dedicatoria personalizada.
              </p>
            </div>
            <div className="shrink-0">
              <GiftCardModal />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Precios de referencia para el estudio de Plottier. Confirmación inmediata vía WhatsApp.
          </p>
        </section>

        {/* RESEÑAS DE GOOGLE */}
        <GoogleReviews />

        {/* MARQUEE DE CONFIANZA */}
        <div className="border-t border-border bg-surface py-10">
          <div className="mx-auto max-w-6xl px-6">
            <RevealOnScroll className="space-y-3">
              <Marquee
                variant="cards"
                items={TRUST_CARDS.map((card) => (
                  <TrustCard key={card.title} {...card} />
                ))}
              />
              <Marquee
                variant="cards"
                reverse
                items={TRUST_CARDS.map((card) => (
                  <TrustCard key={card.title} {...card} />
                ))}
              />
            </RevealOnScroll>
          </div>
        </div>

        {/* PREGUNTAS FRECUENTES (FAQ) */}
        <section id="faq" className="border-t border-border bg-surface px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll className="text-center mb-14">
              <span className="eyebrow mx-auto w-fit">Respuestas Claras</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Preguntas frecuentes
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-muted text-base">
                Todo lo que necesitás saber antes de asistir a tu primera sesión de PRAVILO.
              </p>
            </RevealOnScroll>

            <FAQAccordion />

            <div className="mt-12 text-center">
              <p className="text-sm text-muted">¿Tenés alguna consulta puntual sobre tu estado físico?</p>
              <div className="mt-3.5 flex justify-center">
                <MagneticButton>
                  <a
                    href={whatsappLink("Hola Juan! Tengo una consulta previa a reservar mi turno de PRAVILO.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border-highlight bg-surface-raised px-7 py-3 font-condensed text-sm font-bold text-foreground transition-all hover:border-accent hover:text-accent-text shadow-md"
                  >
                    <span>Escribile a Juan por WhatsApp</span>
                    <span>→</span>
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section id="ubicacion" className="px-6 py-28">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <RevealOnScroll>
              <span className="eyebrow">Ubicación</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                {LOCATION_SHORT}
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted">
                Estudio privado acondicionado y equipado con el método oficial PRAVILO en Plottier, a minutos de Neuquén Capital y Cipolletti.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
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
                    <p className="font-condensed text-sm font-bold uppercase tracking-wider text-muted">Dirección</p>
                    <p className="text-sm font-medium text-foreground">{LOCATION}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-accent-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 7v5l3.5 2" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="font-condensed text-sm font-bold uppercase tracking-wider text-muted">Horarios de Atención</p>
                    <p className="text-sm font-medium text-foreground">
                      Lunes a Sábados (con turno previo reservado)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shiny rounded-full bg-accent px-6 py-3 font-condensed text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-md transition-all hover:opacity-95"
                >
                  Abrir en Google Maps →
                </a>
                <a
                  href={whatsappLink("Hola! ¿Me pasás la ubicación exacta del centro para llegar?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border-highlight bg-surface px-6 py-3 font-condensed text-sm font-bold text-foreground transition-all hover:border-accent hover:text-accent-text"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="overflow-hidden rounded-3xl border border-border-highlight shadow-2xl">
                <iframe
                  src={MAPS_EMBED_SRC}
                  title="Mapa de Plottier, Neuquén"
                  width="100%"
                  height="440"
                  loading="lazy"
                  className="block invert-[90%] hue-rotate-180 contrast-[.9] brightness-90"
                />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* CTA FINAL CINEMATOGRÁFICO */}
        <section className="grain relative overflow-hidden px-6 py-36 text-center border-t border-border">
          {/* Foto de fondo con overlay */}
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/foto-img-3437.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
            <div className="absolute inset-0 bg-accent/15" />
          </div>

          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[150px]"
          />

          <RevealOnScroll className="relative max-w-3xl mx-auto">
            <span className="eyebrow mx-auto w-fit">Comenzá hoy</span>
            <h2 className="mt-4 font-condensed text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
              DESCOMPRIMÍ TU CUERPO.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted leading-relaxed">
              Reservá tu primera sesión en el primer centro oficial de PRAVILO de Argentina y sentí la diferencia desde el primer día.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>
                <BookingWizard className="btn-shiny rounded-full bg-accent px-9 py-4 font-condensed text-lg font-bold uppercase tracking-wider text-accent-foreground shadow-[0_4px_35px_-5px_rgba(160,26,26,0.7)]" />
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full border border-white/20 bg-white/5 px-9 py-4 font-condensed text-lg font-bold backdrop-blur-md transition-all hover:border-accent hover:text-accent-text hover:bg-white/10"
                >
                  Consultar por WhatsApp
                </a>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background px-6 py-14 text-center text-sm text-muted">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/images/logo-transparent.png"
              alt="PRAVILO ARG"
              width={900}
              height={176}
              className="mx-auto h-10 w-auto opacity-90"
            />
          </Link>
          <p className="mt-3 font-medium text-foreground/80">{LOCATION}</p>
          <p className="text-xs text-muted mt-1">Primer Centro Oficial del método PRAVILO en Argentina</p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              aria-label="Instagram de PRAVILO ARG"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised transition-all hover:border-accent hover:text-accent-text hover:scale-110 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
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
              aria-label="WhatsApp de PRAVILO ARG"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised transition-all hover:border-accent hover:text-accent-text hover:scale-110 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
              </svg>
            </a>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
            <p>&copy; {new Date().getFullYear()} PRAVILO ARG. Todos los derechos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 font-condensed text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accent-text"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5 fill-current opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm2 6V6a2 2 0 1 0-4 0v2h4Zm-2 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Acceso Administrador / Turnos</span>
              </Link>
              <a
                href="https://se7endev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 transition-colors hover:text-accent-text"
              >
                Hecho por{" "}
                <span className="font-semibold text-foreground/80 transition-colors group-hover:text-accent-text">
                  Se7en Studio
                </span>
                <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  &nearr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Notificaciones flotantes de prueba social */}
      <LiveSocialProof />
    </>
  );
}
