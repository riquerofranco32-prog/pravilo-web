export type PaymentStatus =
  | "pendiente"
  | "seña"
  | "pagado_efectivo"
  | "pagado_transferencia"
  | "pagado_mp";

export type PaymentMethod = "efectivo" | "transferencia" | "mercadopago" | "otro";

export interface ClinicalEvolutionLog {
  date: string;
  sessionNumber?: number;
  painBefore: number; // 0 a 10 (EVA)
  painAfter: number;  // 0 a 10 (EVA)
  tensionLevel?: "Leve" | "Moderada" | "Alta" | "Muy Alta";
  notes: string;
  instructor?: string;
}

export interface StudentClinicalProfile {
  conditionReason?: string; // Motivo de consulta (ej. Lumbalgia L5, Hernia, Contractura, Movilidad)
  painLevelInitial?: number; // 1 a 10
  painLevelCurrent?: number; // 1 a 10
  tags?: string[];
  medicalNotes?: string;
  emergencyContact?: { name: string; phone: string; relation?: string };
  sessionLogs?: { date: string; note: string; tensionLevel?: string }[];
  evolutionLogs?: ClinicalEvolutionLog[];
}

export interface Booking {
  id: string;
  createdAt: string; // ISO string
  planTitle: string;
  planPrice: string;
  totalAmount?: number; // Valor numérico total
  amountPaid?: number;  // Monto abonado o seña
  paymentMethod?: PaymentMethod;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone?: string;
  customerNotes?: string;
  internalNotes?: string;
  paymentStatus?: PaymentStatus;
  sessionsCompleted?: number;
  totalSessions?: number;
  tags?: string[];
  status: "pendiente" | "confirmado" | "realizado" | "cancelado";
  clinicalProfile?: StudentClinicalProfile;
}

export interface GiftCard {
  id: string;
  code: string;
  recipientName: string;
  recipientPhone?: string;
  senderName: string;
  senderPhone?: string;
  planTitle: string;
  price: string;
  customMessage?: string;
  createdAt: string;
  status: "activo" | "canjeado" | "expirado";
  redeemedAt?: string;
  redeemedBy?: string;
}

export interface BankConfig {
  alias: string;
  cbu: string;
  titular: string;
  banco: string;
}

export const DEFAULT_BANK_CONFIG: BankConfig = {
  alias: "PRAVILO.ARG",
  cbu: "0000003100010000000000",
  titular: "Juan Ignacio Garrafa",
  banco: "Mercado Pago / Banco",
};

export const LOCAL_STORAGE_BOOKINGS_KEY = "pravilo_bookings_data_v1";
export const LOCAL_STORAGE_BANK_KEY = "pravilo_bank_config_v1";
export const LOCAL_STORAGE_CLINICAL_KEY = "pravilo_student_clinical_v1";
export const LOCAL_STORAGE_GIFTCARDS_KEY = "pravilo_giftcards_v1";
export const LOCAL_STORAGE_PRICES_KEY = "pravilo_plan_prices_v1";

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
  type:
    | "confirmar"
    | "recordatorio"
    | "reagendar"
    | "seguimiento_post"
    | "pago"
    | "ubicacion"
    | "renovacion",
  booking: Booking,
  bankConfig?: BankConfig,
): string {
  const cleanPhone = (booking.customerPhone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";

  const bank = bankConfig || DEFAULT_BANK_CONFIG;
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
  } else if (type === "seguimiento_post") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 ¿Cómo amaneció tu cuerpo hoy después de la sesión de PRAVILO?\n\n`;
    text += `Recordá tomar bastante agua hoy para acompañar la hidratación fascial y no dudes en avisarme si tenés alguna duda o consulta. ¡Te esperamos pronto en el estudio! 🙌`;
  } else if (type === "pago") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 Te paso los datos bancarios para abonar tu sesión/pack de *PRAVILO ARG*:\n\n`;
    text += `💰 *Monto:* ${booking.planPrice}\n`;
    text += `💳 *Alias:* ${bank.alias || "PRAVILO.ARG"}\n`;
    if (bank.cbu) text += `🔢 *CBU:* ${bank.cbu}\n`;
    if (bank.titular) text += `👤 *Titular:* ${bank.titular}\n`;
    if (bank.banco) text += `🏦 *Banco:* ${bank.banco}\n\n`;
    text += `Una vez realizada la transferencia, envianos el comprobante por acá para registrarlo. ¡Muchas gracias! 🙌`;
  } else if (type === "ubicacion") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 Te comparto la ubicación y referencias para llegar al estudio de *PRAVILO ARG* en Plottier:\n\n`;
    text += `📍 *Dirección:* Plottier, Neuquén\n`;
    text += `🗺️ *Google Maps:* https://maps.app.goo.gl/uL3Uqg6G1vYmQoVn6\n\n`;
    text += `Cualquier duda al llegar, avisanos por este medio. ¡Buen viaje! 🚗`;
  } else if (type === "renovacion") {
    text = `¡Hola ${booking.customerName.trim()}! 👋 ¡Felicitaciones por el avance logrado en tus sesiones de PRAVILO! 🌟\n\n`;
    text += `Estás completando tu pack actual. Si querés renovar para el próximo mes y asegurar tu cupo y horarios habituales, avisame y te reservo tu lugar con la tarifa del pack. ¡Seguimos trabajando en tu movilidad! 🙌`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildReceiptWhatsAppMessage(
  booking: Booking,
  bankConfig?: BankConfig,
): string {
  const cleanPhone = (booking.customerPhone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";

  const bank = bankConfig || DEFAULT_BANK_CONFIG;
  const total = booking.totalAmount || parsePriceToNumber(booking.planPrice);
  const paid = booking.amountPaid || (booking.paymentStatus?.startsWith("pagado") ? total : 0);
  const pending = Math.max(0, total - paid);

  let text = `🧾 *COMPROBANTE / DETALLE DE PAGO - PRAVILO ARG*\n\n`;
  text += `👤 *Alumno:* ${booking.customerName.trim()}\n`;
  text += `📋 *Plan/Servicio:* ${booking.planTitle}\n`;
  text += `📅 *Turno:* ${booking.date} - ${booking.time} hs\n`;
  text += `──────────────────\n`;
  text += `💰 *Total del Plan:* $${total.toLocaleString("es-AR")}\n`;
  text += `✅ *Abonado / Seña:* $${paid.toLocaleString("es-AR")}\n`;
  text += `⏳ *Saldo Pendiente:* $${pending.toLocaleString("es-AR")}\n`;
  text += `──────────────────\n\n`;

  if (pending > 0) {
    text += `💳 *Datos para transferir el saldo:*\n`;
    text += `• *Alias:* ${bank.alias || "PRAVILO.ARG"}\n`;
    if (bank.cbu) text += `• *CBU:* ${bank.cbu}\n`;
    if (bank.titular) text += `• *Titular:* ${bank.titular}\n`;
    if (bank.banco) text += `• *Banco:* ${bank.banco}\n\n`;
    text += `_El saldo también puede abonarse en efectivo o transferencia el día de la sesión._\n\n`;
  } else {
    text += `✨ *¡Plan abonado al 100%!* Muchas gracias por tu compromiso. 🙌\n\n`;
  }

  text += `📍 Estudio PRAVILO: Plottier, Neuquén.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildReactivationWhatsAppMessage(
  customerName: string,
  customerPhone: string,
  lastDate?: string,
): string {
  const cleanPhone = (customerPhone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";

  let text = `¡Hola ${customerName.trim()}! 👋 Te escribo desde *PRAVILO ARG* en Plottier.\n\n`;
  if (lastDate) {
    text += `Vi que tu última sesión fue el ${lastDate}. ¿Cómo te venís sintiendo de la espalda y movilidad en estos días?\n\n`;
  } else {
    text += `¿Cómo te venís sintiendo con tu postura y movilidad?\n\n`;
  }
  text += `Te escribo para ver si te gustaría agendar una nueva sesión esta semana para continuar liberando tensión fascial y descomprimir la columna. ¡Avisame y coordinamos! 🙌`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildGoogleCalendarUrl(booking: Booking): string {
  if (!booking.date || !booking.time) return "";
  try {
    const [year, month, day] = booking.date.split("-").map(Number);
    const [hour, min] = booking.time.split(":").map(Number);

    const startDate = new Date(year, month - 1, day, hour, min, 0);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d+/g, "");

    const title = `Sesión PRAVILO: ${booking.customerName} (${booking.planTitle})`;
    const details = `Alumno: ${booking.customerName}\nTeléfono: ${booking.customerPhone || "No especificado"}\nPlan: ${booking.planTitle} (${booking.planPrice})\nNotas: ${booking.customerNotes || "Ninguna"}`;
    const location = "PRAVILO ARG, Plottier, Neuquén";

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title,
    )}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}&details=${encodeURIComponent(
      details,
    )}&location=${encodeURIComponent(location)}`;
  } catch {
    return "";
  }
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
    "Estado Turno",
    "Estado Pago",
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
    b.paymentStatus || "pendiente",
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

export function buildGoogleReviewWhatsAppMessage(
  customerName: string,
  customerPhone: string,
): string {
  const cleanPhone = (customerPhone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";

  let text = `¡Hola ${customerName.trim()}! 👋 Te escribo de *PRAVILO ARG*.\n\n`;
  text += `Queríamos agradecerte por confiar en nosotros para tu entrenamiento y descompresión corporal. 🧘‍♂️✨\n\n`;
  text += `¿Nos ayudarías dejando una breve reseña en Google sobre tu experiencia? Nos ayuda muchísimo a que más personas descubran los beneficios del método Pravilo en Neuquén:\n\n`;
  text += `⭐ *Dejar Reseña en Google:* https://maps.app.goo.gl/uL3Uqg6G1vYmQoVn6\n\n`;
  text += `¡Muchas gracias por tu apoyo y nos vemos en la próxima sesión! 🙌`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildGiftCardShareWhatsAppMessage(
  giftCard: GiftCard,
  phone?: string,
): string {
  const cleanPhone = (phone || giftCard.recipientPhone || giftCard.senderPhone || "").replace(/\D/g, "");

  let text = `🎁 *¡VOUCHER / GIFT CARD DIGITAL PRAVILO ARG!* 🌟\n\n`;
  text += `👤 *Para:* ${giftCard.recipientName}\n`;
  text += `🤝 *De parte de:* ${giftCard.senderName}\n`;
  text += `📋 *Experiencia:* ${giftCard.planTitle} (${giftCard.price})\n`;
  text += `🎟️ *Código de Canje:* \`${giftCard.code}\`\n`;
  if (giftCard.customMessage) {
    text += `💌 *Mensaje:* "${giftCard.customMessage}"\n`;
  }
  text += `\n──────────────────\n`;
  text += `📍 *Ubicación:* Plottier, Neuquén\n`;
  text += `📲 Para coordinar día y horario, respondé a este mensaje mencionando tu código de canje.\n`;
  text += `¡Que disfrutes tu sesión de descompresión y bienestar! 🙌`;

  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : "";
}

export function downloadFullJSONBackup(data: {
  bookings: Booking[];
  config: unknown;
  planPrices: unknown;
  bankConfig: BankConfig;
  clinicalProfiles: Record<string, StudentClinicalProfile>;
  giftCards?: GiftCard[];
}): void {
  const jsonStr = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: "2.1",
      ...data,
    },
    null,
    2,
  );

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup_pravilo_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
