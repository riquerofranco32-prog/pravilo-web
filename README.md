# PRAVILO ARG

Landing page del primer centro Pravilo de Argentina (Neuquén). Next.js 16 (App Router) + Tailwind CSS v4.

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

- `NEXT_PUBLIC_CALENDLY_URL` — link de Calendly (ej: `https://calendly.com/praviloarg/sesion`). Sin esto, los botones de "Reservar" abren WhatsApp directamente.
- `NEXT_PUBLIC_GA_ID` — ID de Google Analytics (ej: `G-XXXXXXXXXX`).

En producción (Vercel), configurá las mismas variables en **Project Settings → Environment Variables** y hacé un redeploy.

## Contenido a completar

- **Foto del instructor**: la Galería y el hero ya usan fotos reales del espacio (`public/images/`), pero todavía no hay una foto de Juan — el avatar sigue con sus iniciales.
- **Testimonios**: cuando haya clientes reales, agregar una sección con citas verdaderas (no se incluyeron testimonios inventados).
- **Ubicación exacta**: hoy se pide por WhatsApp además del mapa embebido; falta la dirección puntual del local.

## Deploy

Vercel (cuenta `xfranco199x-5648s-projects`), deploy manual vía `vercel --prod` — la conexión automática GitHub↔Vercel no está activa en esa cuenta.
