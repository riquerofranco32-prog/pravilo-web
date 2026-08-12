"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

const PULL = 0.35;

export default function MagneticButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * PULL;
    const y = (e.clientY - rect.top - rect.height / 2) * PULL;
    if (ref.current) {
      ref.current.style.transition = "transform 0.1s ease-out";
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transition =
        "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      ref.current.style.transform = "translate(0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
