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
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </>
  ),
  bienestar: (
    <>
      <path d="M12 3v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4l2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1m11.4-11.4l2.1-2.1" opacity="0.5" />
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
    </>
  ),
};

export default function BenefitIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-accent-text transition-transform duration-300 group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] || (
        <circle cx="12" cy="12" r="8" />
      )}
    </svg>
  );
}

