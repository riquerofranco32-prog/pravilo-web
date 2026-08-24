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
  internalNotes?: string; // Notas del instructor sobre el alumno
  sessionsCompleted?: number;
  totalSessions?: number;
  status: "pendiente" | "confirmado" | "realizado" | "cancelado";
}

export const LOCAL_STORAGE_BOOKINGS_KEY = "pravilo_bookings_data_v1";

export function formatDateTimeExact(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month} a las ${hours}:${minutes} hs`;
  } catch {
    return "";
  }
}

export function formatRelativeTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Recién";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return "";
  } catch {
    return "";
  }
}

export function parsePriceToNumber(priceStr: string): number {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function buildQuickWhatsAppMessage(
  type: "confirmar" | "recordatorio" | "reagendar",
  booking: Booking,
): string {
  const cleanPhone = (booking.customerPhone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";

  let text = "";
  if (type === "confirmar") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 Te escribo de *PRAVILO ARG* para confirmarte tu turno:\n\n`;
    text += `📋 *Plan:* ${booking.planTitle}\n`;
    text += `📅 *Día:* ${booking.date}\n`;
    text += `⏰ *Horario:* ${booking.time} hs\n`;
    text += `📍 *Ubicación:* Plottier, Neuquén\n\n`;
    text += `¡Tu sesión quedó confirmada! Te recomendamos venir con ropa cómoda deportiva. ¡Te esperamos! 🙌`;
  } else if (type === "recordatorio") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 Te recordamos tu sesión de *PRAVILO ARG* programada para mañana a las *${booking.time} hs*.\n\n`;
    text += `Recordá asistir con ropa deportiva cómoda e hidratarte bien. ¡Nos vemos en el estudio! 🧘‍♂️`;
  } else if (type === "reagendar") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 Te escribo de *PRAVILO ARG* con respecto a tu turno del ${booking.date} a las ${booking.time} hs.\n\n`;
    text += `¿Tendrías disponibilidad para coordinar un nuevo día u horario? ¡Avisame y lo acomodamos!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function exportBookingsToCSV(bookings: Booking[]): void {
  if (!bookings || bookings.length === 0) return;

  const headers = [
    "Fecha Solicitud",
    "Nombre Alumno",
    "Telefono",
    "Plan",
    "Precio",
    "Fecha Turno",
    "Horario",
    "Estado",
    "Comentarios Cliente",
    "Notas Instructor",
  ];

  const rows = bookings.map((b) => [
    formatDateTimeExact(b.createdAt),
    `"${(b.customerName || "").replace(/"/g, '""')}"`,
    `"${b.customerPhone || ""}"`,
    `"${(b.planTitle || "").replace(/"/g, '""')}"`,
    `"${b.planPrice || ""}"`,
    b.date,
    b.time,
    b.status,
    `"${(b.customerNotes || "").replace(/"/g, '""')}"`,
    `"${(b.internalNotes || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `pravilo_reservas_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
