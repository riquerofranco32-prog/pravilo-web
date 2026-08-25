"use client";

import React, { useState } from "react";
import { ScheduleConfig, getAvailableSlots } from "@/lib/availability";
import { Booking, PaymentMethod, PaymentStatus } from "@/lib/bookings";

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ScheduleConfig;
  planPrices: Record<string, string | undefined>;
  onCreated: (newBooking: Partial<Booking>) => void;
}

const COMMON_TAGS = [
  "Primera Vez",
  "Hernia Lumbar",
  "Cervicalgia",
  "Escoliosis",
  "Deportista",
  "VIP",
  "Fascial",
  "Recomendado",
];

export function ManualBookingModal({
  isOpen,
  onClose,
  config,
  planPrices,
  onCreated,
}: ManualBookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [planTitle, setPlanTitle] = useState("1 Sesión Individual");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("16:00");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pendiente");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customerNotes, setCustomerNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Compute price based on plan
  const getPriceForPlan = (plan: string) => {
    if (plan.includes("12")) return planPrices.pack12 || "$300.000";
    if (plan.includes("8")) return planPrices.pack8 || "$240.000";
    return planPrices.individual || "$35.000";
  };

  const currentPriceStr = getPriceForPlan(planTitle);
  const currentPriceNum = parseInt(currentPriceStr.replace(/\D/g, ""), 10) || 35000;
  const paidNum = amountPaid ? parseInt(amountPaid.replace(/\D/g, ""), 10) || 0 : 0;
  const pendingBalance = Math.max(0, currentPriceNum - paidNum);

  // Compute slots for selected date
  const selectedDateObj = new Date(`${date}T12:00:00`);
  const availableSlots = getAvailableSlots(selectedDateObj, config);
  const slotOptions =
    availableSlots.length > 0
      ? availableSlots
      : ["09:00", "10:30", "15:00", "16:30", "18:00", "19:30", "20:30"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !date || !time) return;

    setIsSubmitting(true);
    const totalSessions = planTitle.includes("8")
      ? 8
      : planTitle.includes("12")
        ? 12
        : 1;

    const payload: Partial<Booking> = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      planTitle,
      planPrice: currentPriceStr,
      totalAmount: currentPriceNum,
      amountPaid: paidNum > 0 ? paidNum : undefined,
      paymentMethod,
      paymentStatus:
        paymentStatus === "pendiente" && paidNum > 0
          ? paidNum >= currentPriceNum
            ? paymentMethod === "efectivo"
              ? "pagado_efectivo"
              : paymentMethod === "transferencia"
                ? "pagado_transferencia"
                : "pagado_mp"
            : "seña"
          : paymentStatus,
      date,
      time,
      customerNotes: customerNotes.trim(),
      internalNotes: internalNotes.trim(),
      tags: selectedTags,
      totalSessions,
      sessionsCompleted: 0,
      status: "confirmado",
    };

    await onCreated(payload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl shadow-accent/10 text-foreground animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent-text">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black font-condensed uppercase tracking-tight text-foreground">
                Agendar Nuevo Turno Manual
              </h2>
              <p className="text-xs text-muted font-sans">Cargá reservas directas de WhatsApp o presenciales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Row 1: Nombre & Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                Nombre del Alumno *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Lucas Fernández"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground placeholder-muted/40 focus:border-accent focus:outline-none transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                WhatsApp / Teléfono
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. +54 9 299 456-7890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground placeholder-muted/40 focus:border-accent focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Row 2: Plan & Tarifa */}
          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
              Plan o Servicio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "1 Sesión Individual", label: "Individual", price: planPrices.individual || "$35.000" },
                { id: "Pack 8 Sesiones", label: "Pack 8", price: planPrices.pack8 || "$240.000" },
                { id: "Pack 12 Sesiones", label: "Pack 12", price: planPrices.pack12 || "$300.000" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlanTitle(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    planTitle === p.id
                      ? "bg-surface-raised border-accent text-accent-text shadow-md shadow-accent/15"
                      : "bg-surface-raised/40 border-border text-muted hover:text-foreground hover:border-border-highlight"
                  }`}
                >
                  <p className="text-xs font-condensed font-bold uppercase">{p.label}</p>
                  <p className="text-xs font-mono text-accent-text font-bold">{p.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Fecha & Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                Fecha del Turno *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
                Horario *
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:border-accent focus:outline-none transition-all font-mono"
              >
                {slotOptions.map((s) => (
                  <option key={s} value={s}>
                    {s} hs
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Control Financiero (Seña, Método, Saldos) */}
          <div className="p-4 rounded-xl bg-surface-raised border border-border space-y-3">
            <h4 className="text-xs font-condensed font-bold uppercase tracking-wider text-accent-text flex items-center justify-between">
              <span>Control Financiero & Seña</span>
              <span className="text-muted text-[11px] font-mono">Total: {currentPriceStr}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Monto Abonado / Seña ($)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Ej. 10000"
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground font-mono placeholder-muted/40 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs font-condensed uppercase text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo en Estudio</option>
                  <option value="mercadopago">Mercado Pago</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-condensed uppercase tracking-wider text-muted mb-1">Estado de Pago</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs font-condensed uppercase text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="pendiente">Pendiente Total</option>
                  <option value="seña">Seña Abonada</option>
                  <option value="pagado_transferencia">Pagado 100% (Transf.)</option>
                  <option value="pagado_efectivo">Pagado 100% (Efectivo)</option>
                  <option value="pagado_mp">Pagado 100% (MP)</option>
                </select>
              </div>
            </div>

            {paidNum > 0 && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border font-mono">
                <span className="text-emerald-400">Abonado: ${paidNum.toLocaleString("es-AR")}</span>
                <span className={pendingBalance > 0 ? "text-accent-text font-bold" : "text-emerald-400 font-bold"}>
                  {pendingBalance > 0 ? `Saldo restante: $${pendingBalance.toLocaleString("es-AR")}` : "¡Totalmente Saldado!"}
                </span>
              </div>
            )}
          </div>

          {/* Tags Biomecánicos / Rápidos */}
          <div>
            <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1.5 font-bold">
              Etiquetas Clínicas / Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider border transition-all ${
                      isSelected
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-surface-raised text-muted border-border hover:text-foreground"
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1 font-bold">
                Comentarios del Alumno
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Motivo de consulta, dolores referidos..."
                className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-muted mb-1 font-bold">
                Nota Interna Instructor
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Ajustes de arnés, precauciones..."
                className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-foreground placeholder-muted/40 focus:border-accent focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-condensed font-bold uppercase text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shiny px-6 py-3 rounded-xl bg-accent text-accent-foreground font-condensed font-bold uppercase tracking-wider text-xs sm:text-sm shadow-lg shadow-accent/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Confirmar y Agendar Turno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
