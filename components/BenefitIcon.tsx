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
      className={`${className} text-accent-text transition-transform duration-300 group-hover:scale-110`}
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
