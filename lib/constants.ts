export const SITE_URL = "https://pravilo-web.vercel.app";

export const WHATSAPP_NUMBER = "5492994567662";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola! Quiero saber más sobre PRAVILO ARG y reservar una sesión.";
export const whatsappLink = (message: string = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const INSTAGRAM_URL = "https://www.instagram.com/praviloarg/";

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/PRAVILO+ARGENTINA/@-38.944887,-68.2206435,17z/data=!4m16!1m9!3m8!1s0x960bcb7e8c328b6f:0x5f4f8d8bde3cb669!2sPRAVILO+ARGENTINA!8m2!3d-38.944887!4d-68.2206435!9m1!1b1!16s%2Fg%2F11zhfxc50s!3m5!1s0x960bcb7e8c328b6f:0x5f4f8d8bde3cb669!8m2!3d-38.944887!4d-68.2206435!16s%2Fg%2F11zhfxc50s?hl=es-AR";

export const GOOGLE_WRITE_REVIEW_URL =
  "https://www.google.com/maps/place/PRAVILO+ARGENTINA/@-38.944887,-68.2206435,17z/data=!4m8!3m7!1s0x960bcb7e8c328b6f:0x5f4f8d8bde3cb669!8m2!3d-38.944887!4d-68.2206435!9m1!1b1!16s%2Fg%2F11zhfxc50s?hl=es-AR";

export const LOCATION_SHORT = "Plottier, Neuquén";
export const LOCATION = "Código 600 N°853, Plottier, Neuquén";
export const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=-38.944887,-68.2206435&hl=es&z=17&output=embed";

// ponytail: sin link de Calendly todavía. Cuando lo tengan, setear
// NEXT_PUBLIC_CALENDLY_URL en .env.local (ej: https://calendly.com/praviloarg/sesion)
// y el botón "Reservar turno" pasa a abrir el widget de Calendly automáticamente.
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
