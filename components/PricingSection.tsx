"use client";

import React, { useEffect, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";
import BookingWizard from "./BookingWizard";
import GiftCardModal from "./GiftCardModal";
import { PLANES_EXPERIENCIA, Plan } from "@/lib/plans";
import { LOCAL_STORAGE_PRICES_KEY } from "@/lib/bookings";
import { fetchPublicConfig } from "@/lib/publicConfig";

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>(PLANES_EXPERIENCIA);

  useEffect(() => {
    const applyPrices = (parsed: Record<string, string | undefined>) => {
      if (parsed.individual) {
        const updated = PLANES_EXPERIENCIA.map((p) => {
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
    };

    // 1. LocalStorage cache
    try {
      const stored =
        localStorage.getItem("pravilo_plan_prices") ||
        localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
      if (stored) {
        applyPrices(JSON.parse(stored));
      }
    } catch {}

    // 2. Fetch from server API
    fetchPublicConfig().then((data) => {
      if (data?.ok && data.planPrices) {
        applyPrices(data.planPrices);
        localStorage.setItem("pravilo_plan_prices", JSON.stringify(data.planPrices));
      }
    });
  }, []);

  const plan = plans[0] || PLANES_EXPERIENCIA[0];

  return (
    <section id="precios" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <RevealOnScroll className="text-center">
        <span className="eyebrow mx-auto w-fit">Tarifa & Experiencia</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
          Sesión PRAVILO
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted text-base md:text-lg">
          Sesión uno a uno personalizada, guiada en todo momento por Juan en el aparato
          Pravilo oficial de tracción tridimensional.
        </p>
      </RevealOnScroll>

      {/* Centered Single Plan Card */}
      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-xl">
          <RevealOnScroll>
            <SpotlightCard
              className="relative flex flex-col justify-between rounded-3xl border border-accent/60 bg-gradient-to-b from-accent/15 via-surface-raised to-surface-raised p-8 sm:p-10 shadow-[0_0_60px_-15px_rgba(160,26,26,0.5)] transition-all duration-300"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-block rounded-full bg-accent px-4 py-1 font-condensed text-xs font-black tracking-wider text-accent-foreground uppercase shadow-md">
                    Sesión 1 a 1 Guiada
                  </span>
                  <span className="inline-block rounded-full border border-border bg-background/80 px-3 py-1 font-condensed text-xs font-semibold text-muted">
                    Duración: 60 minutos
                  </span>
                </div>

                {/* Plan Title & Price */}
                <h3 className="font-condensed text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {plan.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted">
                  {plan.desc}
                </p>

                <div className="mt-5 flex items-baseline gap-3 pb-6 border-b border-border/80">
                  <span className="font-condensed text-5xl sm:text-6xl font-black text-accent-text tracking-tight">
                    {plan.price}
                  </span>
                  <span className="font-condensed text-xs sm:text-sm font-bold text-muted uppercase tracking-wider">
                    / sesión completa
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-6">
                  <h4 className="font-condensed text-xs font-bold uppercase tracking-wider text-muted/80 mb-3">
                    ¿Qué incluye tu sesión?
                  </h4>
                  <ul className="space-y-3.5 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-text border border-accent/40">
                          <svg
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 10.5l4 4 8-9"
                            />
                          </svg>
                        </div>
                        <span className="text-foreground/90 font-medium text-xs sm:text-sm leading-relaxed">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <BookingWizard
                  buttonText={`Reservar Turno · ${plan.price}`}
                  className="btn-shiny w-full rounded-full bg-accent py-4 font-condensed text-base sm:text-lg font-black uppercase tracking-wider text-accent-foreground shadow-xl shadow-accent/30 hover:opacity-95 transition-all"
                />
              </div>
            </SpotlightCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
