export const SITE_URL = "https://pravilo-web.vercel.app";

export const WHATSAPP_NUMBER = "5492994567662";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola! Quiero saber más sobre PRAVILO ARG y reservar una sesión.";
export const whatsappLink = (message: string = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const INSTAGRAM_URL = "https://www.instagram.com/praviloarg/";

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/PRAVILO+ARGENTINA+Plottier/data=!4m2!3m1!1s0x960bcb7e8c328b6f:0x5f4f8d8bde3cb669?hl=es-AR";

export const LOCATION_SHORT = "Plottier, Neuquén";
export const LOCATION = "Código 600 N°853, Plottier, Neuquén";
export const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=PRAVILO+ARGENTINA,+Codigo+600+n853,+Plottier,+Neuqu%C3%A9n&output=embed";

// ponytail: sin link de Calendly todavía. Cuando lo tengan, setear
// NEXT_PUBLIC_CALENDLY_URL en .env.local (ej: https://calendly.com/praviloarg/sesion)
// y el botón "Reservar turno" pasa a abrir el widget de Calendly automáticamente.
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
