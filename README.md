# PRAVILO ARG

Landing page del primer centro Pravilo de Argentina (Neuquén). Next.js 16 (App Router) + Tailwind CSS v4.

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

- `NEXT_PUBLIC_GA_ID` — ID de Google Analytics (ej: `G-XXXXXXXXXX`).
- `MP_ACCESS_TOKEN` — Access Token de **Producción** de Mercado Pago (server-only, sin prefijo `NEXT_PUBLIC_`). Actualmente solo lo consume `app/api/mercadopago/create-preference`, una ruta que ningún componente del sitio llama todavía — queda como base para conectar el pago online más adelante.
- `ADMIN_PIN` — PIN de acceso al panel `/admin` (server-only). Sin esto se usa un PIN por default solo apto para desarrollo local; en producción es obligatorio configurarlo.

En producción (Vercel), configurá las mismas variables en **Project Settings → Environment Variables** y hacé un redeploy.

## Wizard de reserva

El botón "Reservar turno" (`components/BookingWizard.tsx`) abre un modal de 4 pasos, todo resuelto con estado local (sin Calendly ni checkout embebido):

1. **Elegí tu plan** — lista de `lib/plans.ts`.
2. **Elegí la fecha** — calendario propio contra `lib/availability.ts` (respeta feriados/días bloqueados cargados en `/admin`).
3. **Elegí el horario** — horarios disponibles para esa fecha según la config de turnos.
4. **Datos del cliente y envío** — arma el resumen y lo abre como link de WhatsApp (`buildWhatsAppBookingUrl`) al número configurado; ahí termina el flujo, no hay pago online en el wizard.

## Contenido a completar

- **Foto del instructor**: la Galería y el hero ya usan fotos reales del espacio (`public/images/`), pero todavía no hay una foto de Juan — el avatar sigue con sus iniciales.
- **Testimonios**: cuando haya clientes reales, agregar una sección con citas verdaderas (no se incluyeron testimonios inventados).
- **Mercado Pago**: la ruta `app/api/mercadopago/create-preference` existe pero no está conectada a ningún botón del sitio; falta decidir en qué paso del wizard ofrecer pago online y conectarla, además de cargar el `MP_ACCESS_TOKEN` de producción (ver arriba).

## Deploy

Vercel (cuenta `xfranco199x-5648s-projects`), deploy manual vía `vercel --prod` — la conexión automática GitHub↔Vercel no está activa en esa cuenta.
