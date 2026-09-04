import { ScheduleConfig } from "./availability";
import { GalleryImageItem } from "./gallery";

export interface PublicConfigResponse {
  ok: boolean;
  config?: ScheduleConfig;
  planPrices?: Record<string, string | undefined>;
  galleryImages?: GalleryImageItem[];
}

let cachedPromise: Promise<PublicConfigResponse | null> | null = null;

// PricingSection, Gallery y BookingWizard se renderizan juntos en la landing
// y cada uno pedía /api/admin/config por su cuenta al montar: 3 round-trips
// idénticos (y 3 lecturas a Firestore en el servidor) para la misma data
// pública. Un solo fetch por carga de página, compartido entre los tres.
export function fetchPublicConfig(): Promise<PublicConfigResponse | null> {
  if (!cachedPromise) {
    cachedPromise = fetch("/api/admin/config")
      .then((res) => res.json())
      .catch(() => null);
  }
  return cachedPromise;
}
