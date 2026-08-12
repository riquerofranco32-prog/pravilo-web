import { whatsappLink } from "@/lib/constants";

export default async function ReservaConfirmada({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; price?: string }>;
}) {
  const { plan = "", price = "" } = await searchParams;
  const message = `Hola! Ya pagué mi turno en PRAVILO ARG por Mercado Pago.\n\nPlan: ${plan} ($${price})\n\nYa agendé el horario por Calendly, ¿confirmamos?`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <span className="eyebrow">Pago recibido</span>
      <h1 className="mt-4 font-condensed text-4xl font-extrabold tracking-tight text-accent md:text-5xl">
        ¡Listo, {plan || "tu plan"}!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">
        Ahora mandanos el resumen por WhatsApp para confirmar el turno que
        agendaste por Calendly.
      </p>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-shiny mt-10 rounded-full bg-accent px-8 py-3 font-condensed text-lg font-semibold text-accent-foreground"
      >
        Enviar resumen por WhatsApp
      </a>
    </main>
  );
}
