const PATHS: Record<string, React.ReactNode> = {
  movilidad: (
    <>
      <path d="M4 12a8 8 0 1 1 8 8" />
      <path d="M4 12l4-3.5" />
      <path d="M4 12l3.5 4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6" />
    </>
  ),
  tension: (
    <>
      <path d="M3 12h3.5l2-6 3.5 12 2.5-6H21" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  postura: (
    <>
      <path d="M12 2v20" strokeDasharray="1 2" opacity="0.5" />
      <path d="M12 4v16" />
      <circle cx="12" cy="4" r="2" />
      <path d="M7 11h10" />
      <path d="M8 20h8" />
    </>
  ),
  recuperacion: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 4v6h-6" />
      <path d="M12 8v4l3 2" opacity="0.8" />
    </>
  ),
  rendimiento: (
    <>
      {/* Figura atlética en extensión y potencia articular */}
      <circle cx="15" cy="5" r="2" />
      <path d="m9 20 3-6 4 2 3-5" />
      <path d="m5 12 4-2 3 3 4-2" />
    </>
  ),
  deporte: (
    <>
      {/* Figura atlética en extensión y potencia articular */}
      <circle cx="15" cy="5" r="2" />
      <path d="m9 20 3-6 4 2 3-5" />
      <path d="m5 12 4-2 3 3 4-2" />
    </>
  ),
  terapia: (
    <>
      {/* Eje de descompresión y alivio articular suave */}
      <path d="M12 3v18" />
      <path d="M8 7c2.5-1.5 5.5-1.5 8 0" />
      <path d="M7 12c3-2 7-2 10 0" />
      <path d="M8 17c2.5-1.5 5.5-1.5 8 0" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </>
  ),
  columna: (
    <>
      {/* Vértebras lumbares y descompresión de discos */}
      <path d="M12 2v20" />
      <rect x="8" y="4" width="8" height="2.5" rx="1" />
      <rect x="7.5" y="8.5" width="9" height="2.5" rx="1" />
      <rect x="7" y="13" width="10" height="2.5" rx="1" />
      <rect x="7" y="17.5" width="10" height="2.5" rx="1" />
    </>
  ),
  cervical: (
    <>
      {/* Eje cervical, cuello y apertura escapular */}
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5v4.5" />
      <path d="M5 16c2.5-3 5-3.5 7-3.5s4.5.5 7 3.5" />
      <path d="M8 20.5h8" />
    </>
  ),
  integral: (
    <>
      {/* Suspensión Pravilo real: Marco de 4 puntos y cuerpo central */}
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="2 2" opacity="0.4" />
      <line x1="3" y1="3" x2="9" y2="9" />
      <line x1="21" y1="3" x2="15" y2="9" />
      <line x1="3" y1="21" x2="9" y2="15" />
      <line x1="21" y1="21" x2="15" y2="15" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.3" />
    </>
  ),
  bienestar: (
    <>
      <path
        d="M12 3v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4l2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1m11.4-11.4l2.1-2.1"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" />
      <path d="M5 6h14v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6Z" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  gift: (
    <>
      <path d="M4 9h16v4H4z" />
      <path d="M5 13h14v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7Z" />
      <path d="M12 9V21" />
      <path d="M12 9C10 5 6.5 5 6 7s2 2.5 6 2Z" />
      <path d="M12 9c2-4 5.5-4 6-2s-2 2.5-6 2Z" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5 21 20H3L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </>
  ),
  star: (
    <>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill="currentColor"
      />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  dragHorizontal: (
    <>
      <path d="m7 15-4-3 4-3M17 9l4 3-4 3M3 12h18" />
    </>
  ),
  scale: (
    <>
      {/* Comparación de ejes posturales: eje curvo vs eje recto alineado */}
      <path d="M6 4c-3 5-3 11 0 16" strokeDasharray="2 2" opacity="0.6" />
      <path d="M18 3v18" />
      <circle cx="18" cy="4" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
      <path d="m9 12 5-1" />
    </>
  ),
  microscope: (
    <>
      {/* Eje de análisis biomecánico y ángulo articular */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l4 4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </>
  ),
  chevronDown: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  severityLeve: (
    <>
      <circle cx="12" cy="12" r="8" className="text-emerald-500/40" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" className="text-emerald-400" fill="currentColor" />
    </>
  ),
  severityFrecuente: (
    <>
      <circle cx="12" cy="12" r="8" className="text-amber-500/40" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" className="text-amber-400" fill="currentColor" />
    </>
  ),
  severityCronico: (
    <>
      <circle cx="12" cy="12" r="8" className="text-rose-500/40" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" className="text-rose-500" fill="currentColor" />
    </>
  ),
};

export default function BenefitIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] || <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
