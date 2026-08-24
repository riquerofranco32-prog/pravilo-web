"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { PLANES } from "@/lib/plans";

export default function GiftCardModal() {
  const [open, setOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(PLANES[0].title);
  const [customMessage, setCustomMessage] = useState("");

  const handleSendGift = () => {
    if (!recipientName.trim() || !senderName.trim()) return;

    let text = `¡Hola Juan! 👋 Quiero encargar una *Gift Card / Tarjeta de Regalo PRAVILO*:\n\n`;
    text += `🎁 *Para:* ${recipientName.trim()}\n`;
    text += `✍️ *De parte de:* ${senderName.trim()}\n`;
    text += `📋 *Experiencia:* ${selectedPlan}\n`;
    if (customMessage.trim()) {
      text += `💌 *Dedicatoria:* "${customMessage.trim()}"\n`;
    }
    text += `\n¿Cómo coordinamos el pago y la entrega del voucher digital? ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-condensed text-sm font-semibold text-accent-text transition-all hover:bg-accent/20 hover:scale-105"
      >
        <span>🎁</span>
        <span>Regalá una Experiencia PRAVILO</span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-foreground"
              >
                &times;
              </button>

              <div className="text-center">
                <span className="text-4xl">🎁</span>
                <h3 className="mt-2 font-condensed text-2xl font-black text-foreground">
                  Gift Card Digital PRAVILO
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Regalá una experiencia única de movilidad, bienestar y descompresión.
                </p>
              </div>

              <div className="mt-6 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    ¿Para quién es el regalo? *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej: Laura Martínez"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Tu nombre (quien regala) *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej: Martín Gómez"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Experiencia a regalar
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  >
                    {PLANES.map((p) => (
                      <option key={p.title} value={p.title}>
                        {p.title} ({p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Dedicatoria personalizada (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="¡Feliz cumpleaños! Que disfrutes esta sesión..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-4 py-2 font-condensed text-xs font-semibold text-muted hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!recipientName.trim() || !senderName.trim()}
                  onClick={handleSendGift}
                  className="rounded-full bg-accent px-6 py-2.5 font-condensed text-sm font-bold text-accent-foreground transition-all hover:opacity-90 disabled:opacity-40"
                >
                  Encargar Voucher por WhatsApp →
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
