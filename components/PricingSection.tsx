"use client";

import React, { useEffect, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";
import BookingWizard from "./BookingWizard";
import GiftCardModal from "./GiftCardModal";
import { PLANES_EXPERIENCIA, Plan } from "@/lib/plans";
import { LOCAL_STORAGE_PRICES_KEY } from "@/lib/bookings";

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>(PLANES_EXPERIENCIA);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("pravilo_plan_prices") ||
        localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.individual || parsed.pack8 || parsed.pack12) {
          const updated = PLANES_EXPERIENCIA.map((p) => {
            if (p.title.includes("12") && parsed.pack12) {
              const num = parseInt(parsed.pack12.replace(/\D/g, ""), 10) || p.priceNumber;
              return {
                ...p,
                price: parsed.pack12,
                priceNumber: num,
                desc: parsed.pack12Desc || p.desc,
              };
            }
            if (p.title.includes("8") && parsed.pack8) {
              const num = parseInt(parsed.pack8.replace(/\D/g, ""), 10) || p.priceNumber;
              return {
                ...p,
                price: parsed.pack8,
                priceNumber: num,
                desc: parsed.pack8Desc || p.desc,
              };
            }
            if (p.title.includes("Individual") && parsed.individual) {
              const num = parseInt(parsed.individual.replace(/\D/g, ""), 10) || p.priceNumber;
              return {
                ...p,
                price: parsed.individual,
                priceNumber: num,
                desc: parsed.individualDesc || p.desc,
              };
            }
            return p;
          });
          setPlans(updated);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  return (
    <section id="precios" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <RevealOnScroll className="text-center">
        <span className="eyebrow mx-auto w-fit">Elegí tu experiencia</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
          Experiencias PRAVILO
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted text-base md:text-lg">
          Sesiones 1 a 1 guiadas en todo momento por Juan en el aparato
          Pravilo oficial. Duración completa: 60 minutos.
        </p>
      </RevealOnScroll>

      <div className="mt-14 grid gap-7 lg:grid-cols-3 lg:items-stretch">
        {plans.map((p) => {
          const indPlan = plans.find((x) => x.title.includes("Individual")) || plans[0];
          const indPrice = indPlan.priceNumber;

          let perSessionText = `$${Math.round(p.priceNumber / 1).toLocaleString("es-AR")} / sesión`;
          let savingsText: string | null = null;

          if (p.title.includes("8")) {
            const perSess = Math.round(p.priceNumber / 8);
            perSessionText = `$${perSess.toLocaleString("es-AR")} / sesión`;
            const totalIfInd = indPrice * 8;
            const diff = totalIfInd - p.priceNumber;
            if (diff > 0) savingsText = `Ahorrás $${diff.toLocaleString("es-AR")}`;
          } else if (p.title.includes("12")) {
            const perSess = Math.round(p.priceNumber / 12);
            perSessionText = `$${perSess.toLocaleString("es-AR")} / sesión`;
            const totalIfInd = indPrice * 12;
            const diff = totalIfInd - p.priceNumber;
            if (diff > 0) savingsText = `Ahorrás $${diff.toLocaleString("es-AR")}`;
          }

          return (
            <RevealOnScroll key={p.title}>
              <SpotlightCard
                className={`flex h-full flex-col justify-between rounded-3xl border p-8 transition-all duration-300 ${
                  p.highlight
                    ? "border-accent bg-gradient-to-b from-accent/15 via-surface-raised to-surface-raised shadow-[0_0_60px_-15px_rgba(160,26,26,0.6)] lg:-translate-y-3"
                    : "border-border bg-surface-raised/70 hover:border-border-highlight"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {p.highlight ? (
                      <span className="inline-block rounded-full bg-accent px-3.5 py-1 font-condensed text-xs font-black tracking-wider text-accent-foreground uppercase shadow-md">
                        Plan Más Elegido
                      </span>
                    ) : (
                      <span className="inline-block rounded-full border border-border bg-background px-3 py-0.5 font-condensed text-xs font-semibold text-muted">
                        {p.title.includes("12") ? "Mayor Descuento" : "Sesión Única"}
                      </span>
                    )}

                    {savingsText && (
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-condensed text-[11px] font-bold text-emerald-400">
                        {savingsText}
                      </span>
                    )}
                  </div>

                  <h3 className="font-condensed text-2xl font-bold text-foreground">
                    {p.title}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-condensed text-4xl font-black text-accent-text">
                      {p.price}
                    </span>
                    <span className="font-condensed text-xs font-bold text-muted uppercase tracking-wider">
                      ({perSessionText})
                    </span>
                  </div>

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
                        <span className="text-muted leading-relaxed text-xs sm:text-sm">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60">
                  <BookingWizard
                    buttonText={p.highlight ? "Comenzar con Pack 8" : "Reservar este plan"}
                    className={
                      p.highlight
                        ? "btn-shiny w-full rounded-full bg-accent py-4 font-condensed text-base font-black uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/25 hover:opacity-95"
                        : "w-full rounded-full border border-border bg-surface py-3.5 font-condensed text-sm font-bold uppercase tracking-wider text-foreground hover:border-accent hover:bg-surface-raised transition-all"
                    }
                  />
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          );
        })}
      </div>

      {/* Gift Card Banner */}
      <div className="mt-14 flex justify-center">
        <GiftCardModal />
      </div>
    </section>
  );
}
