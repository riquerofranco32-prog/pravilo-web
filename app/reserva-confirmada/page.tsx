import Link from "next/link";
import Image from "next/image";
import { whatsappLink, LOCATION } from "@/lib/constants";

export default async function ReservaConfirmada({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; price?: string }>;
}) {
  const { plan = "1 Sesión Individual", price = "35.000" } = await searchParams;
  const message = `¡Hola Juan! 👋 Ya reservé mi turno para *${plan}* (${price}) en PRAVILO ARG. ¿Coordinamos la confirmación?`;

  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[130px]"
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border-highlight bg-surface-raised/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Animated Check Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className="eyebrow mx-auto mt-6 w-fit">Turno Solicitado</span>

        <h1 className="mt-3 font-condensed text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          ¡Tu proceso de descompresión está por comenzar!
        </h1>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-xs text-left space-y-1.5 shadow-sm">
          <div className="flex justify-between">
            <span className="text-muted">Plan seleccionado:</span>
            <span className="font-bold text-foreground">{plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Estudio:</span>
            <span className="font-bold text-accent-text">{LOCATION}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-left text-xs space-y-2">
          <p className="font-condensed font-bold uppercase tracking-wider text-accent-text">
            💡 Recomendaciones para tu sesión:
          </p>
          <ul className="space-y-1 text-muted">
            <li>• Venir con ropa deportiva cómoda (calza, jogging o remera liviana).</li>
            <li>• Traer una botella de agua para hidratarte.</li>
            <li>• Llegar 5 minutos antes del horario pactado.</li>
          </ul>
        </div>

        <div className="mt-8 space-y-3">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shiny inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 font-condensed text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 hover:scale-105"
          >
            <span>Confirmar turno por WhatsApp →</span>
          </a>

          <Link
            href="/"
            className="inline-block text-xs font-semibold text-muted hover:text-foreground transition-colors pt-2"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </main>
  );
}

