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

- **Galería**: reemplazar los tiles de placeholder en `app/page.tsx` (sección `#galeria`) por fotos reales del centro.
- **Testimonios**: cuando haya clientes reales, agregar una sección con citas verdaderas (no se incluyeron testimonios inventados).
- **Ubicación exacta**: hoy se pide por WhatsApp; se puede agregar dirección/mapa embebido cuando esté definida.

## Deploy

Conectado a Vercel vía GitHub — cada push a `main` dispara un deploy de producción.
