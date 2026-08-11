"use client";

import Script from "next/script";
import { CALENDLY_URL, whatsappLink } from "@/lib/constants";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

export default function ReserveButton({
  className = "",
}: {
  className?: string;
}) {
  if (!CALENDLY_URL) {
    return (
      <a
        href={whatsappLink("Hola! Quiero reservar una sesión en PRAVILO ARG.")}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Reservar por WhatsApp
      </a>
    );
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <button
        type="button"
        className={className}
        onClick={() => window.Calendly?.initPopupWidget({ url: CALENDLY_URL })}
      >
        Reservar turno
      </button>
    </>
  );
}
