const PATHS: Record<string, string> = {
  movilidad: "M4 12a8 8 0 1 1 8 8M4 12l4-3M4 12l3 4",
  tension: "M3 12h4l2-7 4 14 2-7h6",
  postura: "M12 3v2M12 8v13M8 21h8M6 12c2-2 10-2 12 0",
  recuperacion: "M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4",
  rendimiento: "M4 20 10 8l4 6 6-10",
  bienestar:
    "M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
};

export default function BenefitIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
