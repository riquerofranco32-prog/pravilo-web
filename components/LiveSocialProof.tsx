"use client";

import { useEffect, useState } from "react";

const PROOF_ITEMS = [
  {
    icon: "📍",
    text: "Alguien de Neuquén Capital acaba de reservar para esta semana",
    time: "Hace 4 min",
  },
  {
    icon: "⭐",
    text: "Nueva reseña 5.0 en Google Maps: 'Sentí como mi columna se descomprimía'",
    time: "Hace 12 min",
  },
  {
    icon: "🧘",
    text: "Turno confirmado para sesión 1 a 1 de movilidad en Plottier",
    time: "Hace 18 min",
  },
  {
    icon: "🔥",
    text: "Cupos limitados por instructor: Juan atiende de forma personalizada",
    time: "En vivo",
  },
];

export default function LiveSocialProof() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Delay first show by 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROOF_ITEMS.length);
        setVisible(true);
      }, 800);
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = PROOF_ITEMS[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block animate-fadeIn">
      <div className="flex max-w-sm items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 p-3.5 shadow-2xl backdrop-blur-md transition-all hover:scale-105">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-base">
          {current.icon}
        </span>
        <div className="text-left">
          <p className="text-xs font-semibold leading-tight text-foreground">
            {current.text}
          </p>
          <span className="text-[10px] font-medium text-accent-text">
            {current.time}
          </span>
        </div>
      </div>
    </div>
  );
}
