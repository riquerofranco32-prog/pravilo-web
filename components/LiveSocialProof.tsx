"use client";

import { useEffect, useState } from "react";

const PROOF_ITEMS = [
  {
    icon: "📍",
    text: "Alguien de Neuquén Capital acaba de reservar turno",
    time: "Hace 4 min",
  },
  {
    icon: "⭐",
    text: "Nueva reseña 5.0 en Google: 'Sentí alivio inmediato en mi columna'",
    time: "Hace 12 min",
  },
  {
    icon: "🧘",
    text: "Turno confirmado para sesión 1 a 1 de movilidad en Plottier",
    time: "Hace 18 min",
  },
  {
    icon: "⚡",
    text: "Cupos de la semana casi completos con Juan",
    time: "En tiempo real",
  },
];

export default function LiveSocialProof() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 3500);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROOF_ITEMS.length);
        setVisible(true);
      }, 700);
    }, 9500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = PROOF_ITEMS[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block animate-fadeIn">
      <div className="flex max-w-sm items-center gap-3.5 rounded-2xl border border-border-highlight bg-surface-raised/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-accent/40">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-lg shadow-inner">
          {current.icon}
        </span>
        <div className="text-left">
          <p className="text-xs font-semibold leading-tight text-foreground">
            {current.text}
          </p>
          <span className="flex items-center gap-1.5 mt-0.5 text-[10px] font-condensed font-bold uppercase tracking-wider text-accent-text">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {current.time}
          </span>
        </div>
      </div>
    </div>
  );
}

