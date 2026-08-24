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
  { href: "#practica", label: "La práctica" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#instructor", label: "Instructor" },
  { href: "#galeria", label: "Galería" },
  { href: "#precios", label: "Precios" },
  { href: "#testimonios", label: "Reseñas" },
  { href: "#faq", label: "FAQ" },
  { href: "#ubicacion", label: "Ubicación" },
];

const GALERIA_ACCION = [
  // originales de alta calidad
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
  // fotos nuevas — curadas
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
    title: "Excelente",
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
          <section className="grain px-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <RevealOnScroll>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">
                    1° Centro PRAVILO de Argentina · Plottier, Neuquén
                  </span>
                  <a
                    href="#testimonios"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
                  >
                    <span className="text-amber-400">★★★★★</span>
                    <span className="font-semibold text-foreground">5.0</span>
                    <span>en Google</span>
                    <span className="text-accent-text">→</span>
                  </a>
                </div>
                <h1 className="mt-5 font-condensed text-[15vw] leading-[0.85] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
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
                <p className="mt-5 max-w-lg text-lg text-muted text-balance">
                  Entrenamiento | Terapia de movilidad con el método Pravilo,
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
        <section id="que-es" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
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
              {/* Foto intercalada — visible en todos los tamaños */}
              <div className="relative mt-8 overflow-hidden rounded-2xl border border-border shadow-[0_0_40px_-15px_var(--accent)]">
                <Image
                  src="/images/foto-img-3399.jpg"
                  alt="El aparato PRAVILO — sistema de cuerdas y tensión"
                  width={900}
                  height={600}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <p className="mt-8 text-lg leading-relaxed text-muted">
                PRAVILO no es simplemente una máquina ni se limita al
                estiramiento. Detrás de cada sesión existe una metodología
                específica, en la que el trabajo se adapta a las características,
                capacidades y objetivos de cada persona, siempre bajo la guía de
                un profesional capacitado.
              </p>
            </RevealOnScroll>
            {/* Foto lateral */}
            <RevealOnScroll className="hidden lg:block" style={{ transitionDelay: "150ms" }}>
              <div className="sticky top-28 overflow-hidden rounded-3xl border border-border shadow-[0_0_60px_-20px_var(--accent)]">
                <Image
                  src="/images/pravilo-sign-suspension.jpg"
                  alt="Sesión de tracción y suspensión en el aparato PRAVILO"
                  width={760}
                  height={1000}
                  sizes="380px"
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* La práctica */}
        <section id="practica" className="bg-surface px-6 py-20 md:py-24">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <span className="eyebrow mx-auto w-fit">La práctica</span>
              <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
                Individual y adaptada a vos
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted">
                El trabajo comienza con una evaluación que permite conocer tus
                características, necesidades y objetivos para establecer un
                proceso progresivo y personalizado. La intensidad, el nivel de
                tensión y la duración se adaptan a tus posibilidades, respetando
                tu ritmo y evolución — sin forzar ni llevar el cuerpo al dolor.
              </p>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="relative mt-8 aspect-16/9 overflow-hidden rounded-2xl border border-border shadow-[0_0_50px_-20px_var(--accent)]">
                <Image
                  src="/images/foto-img-3448.jpg"
                  alt="Sesión de práctica en el aparato PRAVILO"
                  fill
                  sizes="(min-width: 1024px) 1000px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </RevealOnScroll>
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
                  <SpotlightCard className="h-full rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_var(--accent)]">
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
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
              {/* Foto rectangular — más editorial */}
              <RevealOnScroll className="w-full max-w-xs shrink-0 md:max-w-sm">
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-[0_0_60px_-15px_var(--accent)]">
                  <Image
                    src="/images/foto-img-3392.jpg"
                    alt="Juan I. Garrafa, instructor PRAVILO ARG"
                    width={760}
                    height={1010}
                    sizes="(min-width: 768px) 384px, 100vw"
                    className="h-auto w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </RevealOnScroll>
              {/* Texto */}
              <RevealOnScroll className="flex-1 text-center md:text-left" style={{ transitionDelay: "120ms" }}>
                <span className="eyebrow">Instructor</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                  Juan I. Garrafa
                </h2>
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
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
                <blockquote className="relative mt-6 text-lg leading-relaxed text-muted italic border-l-2 border-accent pl-6 py-1">
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
              </RevealOnScroll>
            </div>
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
            </RevealOnScroll>
            <Gallery
              images={GALERIA_ACCION}
              isMasonry
            />
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="mx-auto max-w-6xl px-6 py-24">
          <RevealOnScroll>
            <span className="eyebrow mx-auto w-fit">Elegí tu experiencia</span>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
              Experiencia PRAVILO
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
              Sesiones uno a uno guiadas por el Instructor en la máquina Pravilo.
              Duración de la sesión: 60 minutos.
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
                  <div className="mt-6 pt-4 border-t border-border/70">
                    <BookingWizard
                      buttonText="Reservar turno →"
                      className={`w-full rounded-full py-2.5 font-condensed text-sm font-semibold transition-all ${
                        p.highlight
                          ? "bg-accent text-accent-foreground shadow-md hover:bg-accent/90"
                          : "border border-border bg-surface text-foreground hover:border-accent hover:text-accent-text"
                      }`}
                    />
                  </div>
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

        {/* Reseñas de Google */}
        <GoogleReviews />

        {/* Marquee de Confianza */}
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

        {/* CTA final */}
        <section className="grain relative overflow-hidden px-6 py-32 text-center">
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
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
            <div className="absolute inset-0 bg-accent/10" />
          </div>
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[140px]"
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
                  className="block rounded-full border border-white/20 bg-white/5 px-8 py-3 font-condensed text-lg font-semibold backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-text"
                >
                  Escribinos por WhatsApp
                </a>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-12 text-center text-sm text-muted">
        <Image
          src="/images/logo-transparent.png"
          alt="PRAVILO ARG"
          width={900}
          height={176}
          className="mx-auto h-10 w-auto opacity-80"
        />
        <p className="mt-3">{LOCATION}</p>
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
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} PRAVILO ARG. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-condensed text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accent-text"
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
              <span className="font-semibold text-foreground/70 transition-colors group-hover:text-accent-text">
                Se7en Studio
              </span>
              <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                &nearr;
              </span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
