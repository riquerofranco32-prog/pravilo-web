"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import { CALENDLY_URL, whatsappLink } from "@/lib/constants";
import { PLANES, type Plan } from "@/lib/plans";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement | null;
      }) => void;
    };
  }
}

type Payment = "efectivo" | "mercadopago";

export default function BookingWizard({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [scheduled, setScheduled] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [mpLoading, setMpLoading] = useState(false);
  const [mpError, setMpError] = useState("");

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") setScheduled(true);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (step !== 2) return;
    const id = setInterval(() => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: document.getElementById("calendly-inline-container"),
        });
        clearInterval(id);
      }
    }, 150);
    return () => clearInterval(id);
  }, [step]);

  if (!CALENDLY_URL) {
    return (
      <a
        href={whatsappLink("Hola! Quiero reservar una sesión en PRAVILO ARG.")}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Reservar por WhatsApp
      </a>
    );
  }

  const reset = () => {
    setStep(1);
    setPlan(null);
    setScheduled(false);
    setPayment(null);
    setMpError("");
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const confirmWhatsApp = () => {
    const message = `Hola! Quiero confirmar mi turno en PRAVILO ARG.\n\nPlan: ${plan?.title} (${plan?.price})\nMedio de pago: Efectivo\n\nYa agendé el horario por Calendly, ¿confirmamos?`;
    window.open(whatsappLink(message), "_blank");
    close();
  };

  const payWithMercadoPago = async () => {
    if (!plan) return;
    setMpLoading(true);
    setMpError("");
    try {
      const res = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: plan.title, price: plan.priceNumber }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) throw new Error(data.error);
      window.location.href = data.init_point;
    } catch {
      setMpError(
        "Mercado Pago todavía se está configurando. Por ahora podés abonar en efectivo o coordinar el pago por WhatsApp.",
      );
    } finally {
      setMpLoading(false);
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Reservar turno
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={close}
          >
            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-wide text-accent">
                  Paso {step} de 3
                </p>
                <button
                  onClick={close}
                  aria-label="Cerrar"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {step === 1 && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Elegí tu plan</h3>
                  <div className="mt-4 space-y-3">
                    {PLANES.map((p) => (
                      <button
                        key={p.title}
                        type="button"
                        onClick={() => setPlan(p)}
                        className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                          plan?.title === p.title
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{p.title}</span>
                          <span className="font-bold text-accent">
                            {p.price}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={!plan}
                    onClick={() => setStep(2)}
                    className="btn-shiny mt-6 w-full rounded-full bg-accent py-3 font-medium text-accent-foreground disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Elegí día y horario</h3>
                  <p className="mt-1 text-sm text-muted">
                    Turno para: {plan?.title}
                  </p>
                  <link
                    rel="stylesheet"
                    href="https://assets.calendly.com/assets/external/widget.css"
                  />
                  <Script
                    src="https://assets.calendly.com/assets/external/widget.js"
                    strategy="lazyOnload"
                  />
                  <div
                    id="calendly-inline-container"
                    className="mt-4 overflow-hidden rounded-xl"
                    style={{ minWidth: 280, height: 520 }}
                  />
                  {scheduled && (
                    <p className="mt-3 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                      ✓ Turno agendado. Continuá al siguiente paso.
                    </p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full border border-border py-3 font-medium"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      disabled={!scheduled}
                      onClick={() => setStep(3)}
                      className="btn-shiny flex-1 rounded-full bg-accent py-3 font-medium text-accent-foreground disabled:opacity-40"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Resumen y pago</h3>
                  <div className="mt-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{plan?.title}</span>
                      <span className="font-bold text-accent">
                        {plan?.price}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Turno agendado por Calendly ✓
                    </p>
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    ¿Cómo preferís pagar?
                  </p>
                  <div className="mt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayment("efectivo");
                        setMpError("");
                      }}
                      className={`block w-full rounded-xl border p-3 text-left transition-colors ${
                        payment === "efectivo"
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      Efectivo en el centro
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("mercadopago")}
                      className={`block w-full rounded-xl border p-3 text-left transition-colors ${
                        payment === "mercadopago"
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      Mercado Pago
                    </button>
                  </div>

                  {mpError && (
                    <p className="mt-3 text-sm text-accent">{mpError}</p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full border border-border py-3 font-medium"
                    >
                      Atrás
                    </button>
                    {payment === "mercadopago" ? (
                      <button
                        type="button"
                        disabled={mpLoading}
                        onClick={payWithMercadoPago}
                        className="btn-shiny flex-1 rounded-full bg-accent py-3 font-medium text-accent-foreground disabled:opacity-60"
                      >
                        {mpLoading ? "Redirigiendo…" : "Pagar con Mercado Pago"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!payment}
                        onClick={confirmWhatsApp}
                        className="btn-shiny flex-1 rounded-full bg-accent py-3 font-medium text-accent-foreground disabled:opacity-40"
                      >
                        Confirmar por WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
