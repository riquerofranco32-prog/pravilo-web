"use client";

import React, { useState } from "react";
import { BankConfig, Booking, PaymentMethod, PaymentStatus, buildReceiptWhatsAppMessage, parsePriceToNumber } from "@/lib/bookings";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  bankConfig: BankConfig;
  onSavePayment: (
    id: string,
    updates: {
      paymentStatus: PaymentStatus;
      amountPaid?: number;
      paymentMethod?: PaymentMethod;
    },
  ) => void;
}

export function PaymentReceiptModal({
  isOpen,
  onClose,
  booking,
  bankConfig,
  onSavePayment,
}: PaymentReceiptModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const total = booking.totalAmount || parsePriceToNumber(booking.planPrice);
  const initialPaid = booking.amountPaid || (booking.paymentStatus?.startsWith("pagado") ? total : 0);
  const [amountPaid, setAmountPaid] = useState<number>(initialPaid);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    booking.paymentStatus || (initialPaid >= total ? "pagado_transferencia" : initialPaid > 0 ? "seña" : "pendiente"),
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    booking.paymentMethod || "transferencia",
  );

  const pending = Math.max(0, total - amountPaid);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    let finalStatus = paymentStatus;
    if (amountPaid >= total && finalStatus === "pendiente") {
      finalStatus = paymentMethod === "efectivo" ? "pagado_efectivo" : "pagado_transferencia";
    } else if (amountPaid > 0 && amountPaid < total) {
      finalStatus = "seña";
    }

    onSavePayment(booking.id, {
      paymentStatus: finalStatus,
      amountPaid,
      paymentMethod,
    });
    onClose();
  };

  const receiptUrl = buildReceiptWhatsAppMessage(
    {
      ...booking,
      totalAmount: total,
      amountPaid,
      paymentStatus,
    },
    bankConfig,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121316] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Comprobante & Control de Pagos</h2>
              <p className="text-xs text-white/50">{booking.customerName} • {booking.planTitle}</p>
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

        {/* Breakdown Card */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Total del Plan:</span>
              <span className="font-mono font-bold text-white text-sm">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Monto Abonado / Seña:</span>
              <div className="flex items-center gap-2">
                <span className="text-white/40 font-mono">$</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1 rounded bg-black/40 border border-white/20 text-right font-mono text-emerald-400 font-semibold focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-white/[0.06]">
              <span className="text-white/60">Saldo Pendiente:</span>
              <span
                className={`font-mono font-bold text-sm ${
                  pending > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {pending > 0 ? `$${pending.toLocaleString("es-AR")}` : "¡Saldado 100%!"}
              </span>
            </div>
          </div>

          {/* Quick Payment Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setAmountPaid(total);
                setPaymentStatus("pagado_transferencia");
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
            >
              Marcar 100% Abonado
            </button>
            <button
              type="button"
              onClick={() => {
                const half = Math.round(total / 2);
                setAmountPaid(half);
                setPaymentStatus("seña");
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all"
            >
              Marcar 50% Seña
            </button>
            <button
              type="button"
              onClick={() => {
                setAmountPaid(0);
                setPaymentStatus("pendiente");
              }}
              className="py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 text-xs transition-all"
            >
              Reset 0
            </button>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1">Medio de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-[#18191c] border border-white/[0.1] text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivo">Efectivo en Estudio</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1">Estado</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#18191c] border border-white/[0.1] text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="seña">Seña Abonada</option>
                <option value="pagado_transferencia">Pagado Transferencia</option>
                <option value="pagado_efectivo">Pagado Efectivo</option>
                <option value="pagado_mp">Pagado Mercado Pago</option>
              </select>
            </div>
          </div>

          {/* Banking details box */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/50 font-mono">Alias de Cobro:</span>
              <button
                onClick={() => copyToClipboard(bankConfig.alias || "PRAVILO.ARG", "alias")}
                className="text-amber-300 font-mono font-bold hover:underline flex items-center gap-1"
              >
                {bankConfig.alias || "PRAVILO.ARG"}
                <span className="text-[10px] text-white/40">{copiedField === "alias" ? "✓ Copiado" : "📋"}</span>
              </button>
            </div>
            {bankConfig.cbu && (
              <div className="flex justify-between items-center">
                <span className="text-white/50 font-mono">CBU:</span>
                <button
                  onClick={() => copyToClipboard(bankConfig.cbu, "cbu")}
                  className="text-white/80 font-mono hover:underline flex items-center gap-1"
                >
                  {bankConfig.cbu}
                  <span className="text-[10px] text-white/40">{copiedField === "cbu" ? "✓ Copiado" : "📋"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions: Save & Send WhatsApp */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            {booking.customerPhone ? (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSave}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                Guardar & Enviar Recibo WhatsApp
              </a>
            ) : (
              <span className="text-xs text-white/40">Sin teléfono para WhatsApp</span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
