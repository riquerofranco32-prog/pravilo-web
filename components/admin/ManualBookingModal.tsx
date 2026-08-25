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
      <div className="relative w-full max-w-xl bg-[#121316] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Agendar Nuevo Turno Manual</h2>
              <p className="text-xs text-white/50">Cargá reservas directas de WhatsApp o presenciales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
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
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                Nombre del Alumno *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Lucas Fernández"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-white/30 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                WhatsApp / Teléfono
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. +54 9 299 456-7890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-white/30 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Plan & Tarifa */}
          <div>
            <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
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
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10"
                      : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:border-white/[0.2]"
                  }`}
                >
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-[11px] font-mono text-amber-400/90">{p.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Fecha & Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                Fecha del Turno *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
                Horario *
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18191c] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
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
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Control Financiero & Seña</span>
              <span className="text-white/50 text-[11px]">Total: {currentPriceStr}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-white/60 mb-1">Monto Abonado / Seña ($)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Ej. 10000"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono placeholder-white/30 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-lg bg-[#18191c] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo en Estudio</option>
                  <option value="mercadopago">Mercado Pago</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">Estado de Pago</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-[#18191c] border border-white/[0.1] text-sm text-white focus:border-amber-500 focus:outline-none"
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
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.04] font-mono">
                <span className="text-emerald-400">Abonado: ${paidNum.toLocaleString("es-AR")}</span>
                <span className={pendingBalance > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {pendingBalance > 0 ? `Saldo restante: $${pendingBalance.toLocaleString("es-AR")}` : "¡Totalmente Saldado!"}
                </span>
              </div>
            )}
          </div>

          {/* Tags Biomecánicos / Rápidos */}
          <div>
            <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1.5">
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-white/[0.03] text-white/50 border-white/[0.06] hover:text-white"
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
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                Comentarios del Alumno
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Motivo de consulta, dolores referidos..."
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                Nota Interna Instructor
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Ajustes de arnés, precauciones..."
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Confirmar y Agendar Turno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
