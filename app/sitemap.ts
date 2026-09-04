import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Bump esta fecha a mano cuando cambie contenido real de la landing.
// `new Date()` en cada build le mentía a los buscadores diciendo que la
// página cambiaba todo el tiempo, aunque solo se tocara código.
const LAST_CONTENT_UPDATE = new Date("2026-09-04");

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: LAST_CONTENT_UPDATE, priority: 1 }];
}
