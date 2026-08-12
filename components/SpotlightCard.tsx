"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";

export default function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight ${className}`}
      style={{ "--spot-opacity": 0 } as CSSProperties}
      onMouseEnter={(e) =>
        e.currentTarget.style.setProperty("--spot-opacity", "1")
      }
      onMouseLeave={(e) =>
        e.currentTarget.style.setProperty("--spot-opacity", "0")
      }
    >
      {children}
    </div>
  );
}
