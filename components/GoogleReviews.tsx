"use client";

import RevealOnScroll from "@/components/RevealOnScroll";
import SpotlightCard from "@/components/SpotlightCard";
import MagneticButton from "@/components/MagneticButton";
import { GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL } from "@/lib/constants";
import { GOOGLE_REVIEWS } from "@/lib/reviews";

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
      />
    </svg>
  );
}

function StarRating({ rating = 5, size = "h-4 w-4" }: { rating?: number; size?: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${size} fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section id="testimonios" className="relative bg-surface px-6 py-28 overflow-hidden">
      {/* Glow ambiental de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Cabecera */}
        <RevealOnScroll className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border-highlight bg-surface-raised px-4 py-1.5 shadow-md">
            <GoogleIcon className="h-4 w-4" />
            <span className="text-xs font-condensed font-bold tracking-wider uppercase text-foreground">
              Reseñas en Google Maps
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            La experiencia de quienes ya entrenan con nosotros
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Somos el primer centro del método PRAVILO en Argentina. Conocé lo que
            opinan quienes ya sintieron la descompresión y el trabajo postural.
          </p>

          {/* Badge de Score Principal */}
          <div className="mx-auto mt-9 flex max-w-md flex-col items-center justify-between gap-5 rounded-3xl border border-border-highlight bg-surface-raised/80 p-6 shadow-2xl backdrop-blur-xl sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-border bg-background shadow-inner">
                <GoogleIcon className="h-7 w-7" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2.5">
                  <span className="font-condensed text-3xl font-black text-foreground">
                    5.0
                  </span>
                  <StarRating rating={5} size="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-muted mt-0.5">
                  Calificación perfecta 5 estrellas
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-condensed font-bold text-foreground transition-all hover:border-accent hover:text-accent-text"
              >
                <span>Ver en Google</span>
                <span aria-hidden className="text-xs">↗</span>
              </a>
              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shiny inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-condensed font-bold text-accent-foreground shadow-sm hover:opacity-95"
              >
                <span>Calificanos</span>
                <span aria-hidden className="text-xs">★</span>
              </a>
            </div>
          </div>
        </RevealOnScroll>

        {/* Grid de Reseñas */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {GOOGLE_REVIEWS.map((review, idx) => (
            <RevealOnScroll
              key={review.id}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <SpotlightCard className="relative flex h-full flex-col justify-between rounded-3xl border border-border bg-surface-raised/70 p-7 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_16px_40px_-15px_rgba(160,26,26,0.35)]">
                <div>
                  {/* Top Bar: Autor + Badge de Google */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-condensed font-bold text-white shadow-md ${review.avatarBg}`}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-foreground text-base">
                            {review.author}
                          </h3>
                          <span
                            title="Usuario verificado de Google"
                            className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500/20 text-[10px] text-blue-400 font-bold"
                          >
                            ✓
                          </span>
                        </div>
                        {review.role && (
                          <p className="text-xs text-muted">{review.role}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted">
                      <GoogleIcon className="h-3.5 w-3.5" />
                      <span>Google</span>
                    </div>
                  </div>

                  {/* Rating + Fecha */}
                  <div className="mt-4 flex items-center gap-2.5">
                    <StarRating rating={review.rating} size="h-4 w-4" />
                    <span className="text-xs text-muted/70">{review.date}</span>
                  </div>

                  {/* Highlight */}
                  {review.highlight && (
                    <p className="mt-3.5 font-condensed text-lg font-bold text-accent-text leading-snug">
                      &ldquo;{review.highlight}&rdquo;
                    </p>
                  )}

                  {/* Texto */}
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">
                    {review.content}
                  </p>
                </div>

                {/* Footer de tarjeta */}
                <div className="mt-7 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 fill-current"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Experiencia verificada en Plottier
                  </span>
                  <a
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-condensed text-xs font-bold text-muted hover:text-accent-text hover:underline transition-colors"
                  >
                    Ver en Maps →
                  </a>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* Barra de métricas y confianza */}
        <RevealOnScroll className="mt-14">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border-highlight bg-surface-raised p-6 shadow-xl sm:grid-cols-4 sm:p-8">
            <div className="text-center">
              <p className="font-condensed text-3xl font-black text-accent-text sm:text-4xl">
                5.0 ★
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Calificación en Google Maps
              </p>
            </div>
            <div className="text-center">
              <p className="font-condensed text-3xl font-black text-accent-text sm:text-4xl">
                1°
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Centro en Argentina
              </p>
            </div>
            <div className="text-center">
              <p className="font-condensed text-3xl font-black text-accent-text sm:text-4xl">
                100%
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Sesiones individuales
              </p>
            </div>
            <div className="text-center">
              <p className="font-condensed text-3xl font-black text-accent-text sm:text-4xl">
                60 min
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Movilidad + Tracción Axial
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* CTA para dejar opinión */}
        <RevealOnScroll className="mt-10 text-center">
          <p className="text-sm text-muted">
            ¿Ya tuviste tu sesión en PRAVILO ARG?
          </p>
          <div className="mt-3.5 flex justify-center">
            <MagneticButton>
              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-highlight bg-surface-raised px-7 py-3 font-condensed text-sm font-bold text-foreground transition-all hover:border-accent hover:text-accent-text hover:scale-105 shadow-md"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Dejá tu reseña en Google Maps</span>
                <span aria-hidden>→</span>
              </a>
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

