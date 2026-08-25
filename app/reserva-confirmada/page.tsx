import Link from "next/link";
import { whatsappLink, LOCATION, WHATSAPP_NUMBER } from "@/lib/constants";
import { DEFAULT_BANK_CONFIG } from "@/lib/bookings";

export default async function ReservaConfirmada({
  searchParams,
}: {
  searchParams: Promise<{
    plan?: string;
    price?: string;
    date?: string;
    time?: string;
    name?: string;
    phone?: string;
  }>;
}) {
  const params = await searchParams;
  const plan = params.plan || "1 Sesión Individual";
  const price = params.price || "$35.000";
  const date = params.date || "";
  const time = params.time || "";
  const name = params.name || "";

  // Build calendar link if date and time provided
  let googleCalUrl = "";
  if (date && time) {
    try {
      const [year, month, day] = date.split("-").map(Number);
      const [hour, min] = time.split(":").map(Number);
      const start = new Date(year, month - 1, day, hour, min, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const formatCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

      const title = `Sesión PRAVILO ARG: ${plan}`;
      const details = `Turno confirmado en PRAVILO ARG (${LOCATION}). Plan: ${plan} (${price}).`;
      googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title,
      )}&dates=${formatCalDate(start)}/${formatCalDate(end)}&details=${encodeURIComponent(
        details,
      )}&location=${encodeURIComponent("PRAVILO ARG, Plottier, Neuquén")}`;
    } catch {
      // ignore
    }
  }

  let message = `¡Hola Juan! 👋`;
  if (name) message += ` Soy *${name.trim()}*.`;
  message += ` Reservé mi turno en PRAVILO ARG:\n\n`;
  message += `📋 *Plan:* ${plan} (${price})\n`;
  if (date) message += `📅 *Fecha:* ${date}\n`;
  if (time) message += `⏰ *Horario:* ${time} hs\n`;
  message += `\n¿Me confirmás la recepción del turno? ¡Muchas gracias!`;

  const mapLink = "https://maps.app.goo.gl/uL3Uqg6G1vYmQoVn6";

  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center overflow-hidden bg-[#090a0c] text-white">
      {/* Ambient Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[140px]"
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/[0.08] bg-[#121316]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-left space-y-6">
        {/* Top Icon & Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] animate-pulse">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Reserva Solicitada con Éxito
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {name ? `¡Excelente, ${name.split(" ")[0]}!` : "¡Tu sesión está por comenzar!"}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto">
            Recibimos tu solicitud. A continuación encontrás todos los detalles de tu turno y los datos del estudio en Plottier.
          </p>
        </div>

        {/* Turn Summary Box */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 text-xs space-y-2.5 shadow-sm font-mono">
          <div className="flex justify-between items-center text-sm border-b border-white/[0.06] pb-2 font-sans font-semibold text-amber-400">
            <span>{plan}</span>
            <span className="font-mono">{price}</span>
          </div>
          {date && (
            <div className="flex justify-between items-center text-white/80">
              <span className="text-white/40">Fecha:</span>
              <span className="font-bold text-white">{date}</span>
            </div>
          )}
          {time && (
            <div className="flex justify-between items-center text-white/80">
              <span className="text-white/40">Horario:</span>
              <span className="font-bold text-amber-300">{time} hs</span>
            </div>
          )}
          <div className="flex justify-between items-center text-white/80">
            <span className="text-white/40">Estudio:</span>
            <span className="font-sans font-medium text-white">{LOCATION}</span>
          </div>
        </div>

        {/* Calendar button if dates exist */}
        {googleCalUrl && (
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-white/90 hover:text-white transition-all text-center"
          >
            <span>📅 Agregar este turno a Google Calendar</span>
          </a>
        )}

        {/* Bank details for deposit / seña */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 sm:p-5 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
              <span>💳</span> Datos para Transferir Seña o Pago Total:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-white/80">
            <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
              <span className="text-white/40 block text-[10px]">Alias:</span>
              <span className="font-bold text-amber-300">{DEFAULT_BANK_CONFIG.alias}</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
              <span className="text-white/40 block text-[10px]">Titular:</span>
              <span className="text-white truncate block">{DEFAULT_BANK_CONFIG.titular}</span>
            </div>
          </div>
          <p className="text-[10px] text-white/50">
            * Podés enviar el comprobante de transferencia por WhatsApp al confirmar tu turno.
          </p>
        </div>

        {/* Location & Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>📍</span> Cómo llegar:
            </p>
            <p className="text-white/60 text-[11px]">Estudio Pravilo en Plottier, Neuquén.</p>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-mono"
            >
              Abrir en Google Maps ↗
            </a>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>💡</span> Recomendaciones:
            </p>
            <ul className="text-white/60 text-[11px] space-y-1">
              <li>• Ropa deportiva cómoda.</li>
              <li>• Botella de agua.</li>
              <li>• Llegar 5 min antes.</li>
            </ul>
          </div>
        </div>

        {/* WhatsApp Call to Action */}
        <div className="space-y-3 pt-2">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>Confirmar Turno por WhatsApp →</span>
          </a>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block text-xs font-semibold text-white/40 hover:text-amber-400 transition-colors font-mono"
            >
              ← Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
