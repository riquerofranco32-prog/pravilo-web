export interface Booking {
  id: string;
  createdAt: string; // ISO string
  planTitle: string;
  planPrice: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone?: string;
  customerNotes?: string;
  status: "pendiente" | "confirmado" | "realizado" | "cancelado";
}

export const LOCAL_STORAGE_BOOKINGS_KEY = "pravilo_bookings_data_v1";

export function getLocalBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveLocalBookings(bookings: Booking[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }
}
