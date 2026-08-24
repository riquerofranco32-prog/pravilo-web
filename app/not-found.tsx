import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center bg-background text-foreground overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="relative z-10 max-w-md rounded-3xl border border-border-highlight bg-surface-raised/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <span className="font-condensed text-7xl font-black text-accent-text sm:text-8xl">
          404
        </span>
        <h1 className="mt-2 font-condensed text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
          Página no encontrada
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
          La sección que buscás no existe o ha sido movida. Regresá al inicio para reservar tu turno de PRAVILO.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="btn-shiny inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-condensed text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg transition-all hover:scale-105"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </main>
  );
}
