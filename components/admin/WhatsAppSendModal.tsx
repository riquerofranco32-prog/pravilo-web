"use client";

import React, { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/bookings";

export interface WhatsAppDraft {
  phone: string | undefined;
  text: string;
  title?: string;
}

interface WhatsAppSendModalProps {
  draft: WhatsAppDraft | null;
  onClose: () => void;
}

// ponytail: one shared editable-message modal for every "quick WhatsApp"
// button in the admin, instead of each spot linking straight to wa.me with
// a locked-in text. Add here once, every caller gets it.
export function WhatsAppSendModal({ draft, onClose }: WhatsAppSendModalProps) {
  const [text, setText] = useState(draft?.text || "");
  const currentPhone = draft?.phone;

  React.useEffect(() => {
    if (draft) setText(draft.text);
  }, [draft]);

  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 shadow-2xl text-foreground">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-base font-black font-condensed uppercase tracking-tight text-foreground">
            {draft.title || "Editar mensaje de WhatsApp"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-muted font-sans">
          Revisá o modificá el texto antes de mandarlo. Se abre WhatsApp recién
          al tocar &quot;Enviar&quot;.
        </p>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-3 w-full p-3.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground focus:border-accent focus:outline-none font-sans leading-relaxed"
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-surface-raised border border-border text-muted hover:text-foreground text-xs font-condensed font-bold uppercase tracking-wider transition-all"
          >
            Cancelar
          </button>
          <a
            href={currentPhone ? buildWhatsAppUrl(currentPhone, text) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-shiny py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-condensed font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <svg
              className="w-3.5 h-3.5 fill-white shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            Enviar
          </a>
        </div>
      </div>
    </div>
  );
}
