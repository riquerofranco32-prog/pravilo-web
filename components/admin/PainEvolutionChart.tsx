"use client";

import React from "react";
import { ClinicalEvolutionLog } from "@/lib/bookings";

interface PainEvolutionChartProps {
  evolutionLogs?: ClinicalEvolutionLog[];
  initialPain?: number;
  currentPain?: number;
}

export function PainEvolutionChart({
  evolutionLogs = [],
  initialPain = 5,
  currentPain = 3,
}: PainEvolutionChartProps) {
  // If no logs, build a 2-point synthetic line
  const points =
    evolutionLogs.length >= 2
      ? [...evolutionLogs].reverse() // chronological order
      : [
          {
            sessionNumber: 1,
            date: "Inicio",
            painBefore: initialPain,
            painAfter: Math.max(0, initialPain - 2),
          },
          {
            sessionNumber: 2,
            date: "Actual",
            painBefore: Math.max(0, initialPain - 1),
            painAfter: currentPain,
          },
        ];

  const count = points.length;
  const width = 450;
  const height = 160;
  const paddingX = 35;
  const paddingY = 25;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  // Scale: pain from 0 to 10
  const getX = (index: number) => {
    if (count <= 1) return paddingX + innerW / 2;
    return paddingX + (index / (count - 1)) * innerW;
  };

  const getY = (pain: number) => {
    const clamped = Math.max(0, Math.min(10, pain));
    return paddingY + innerH - (clamped / 10) * innerH;
  };

  // Build SVG Paths
  const beforePoints = points.map((p, i) => `${getX(i)},${getY(p.painBefore)}`).join(" ");
  const afterPoints = points.map((p, i) => `${getX(i)},${getY(p.painAfter)}`).join(" ");

  const firstBefore = points[0]?.painBefore ?? initialPain;
  const lastAfter = points[points.length - 1]?.painAfter ?? currentPain;
  const totalReduction = firstBefore > 0 ? Math.round(((firstBefore - lastAfter) / firstBefore) * 100) : 0;

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            Curva de Evolución del Dolor (EVA 0-10)
          </span>
        </div>
        {totalReduction > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            -{totalReduction}% de Dolor
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 overflow-visible select-none"
        >
          {/* Horizontal grid lines for 0, 5, 10 */}
          {[0, 5, 10].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={width - paddingX + 10}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 16}
                  y={y + 3}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          {/* Pre-session pain line (Rose) */}
          <polyline
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            points={beforePoints}
          />

          {/* Post-session pain line (Emerald) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points={afterPoints}
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const yBefore = getY(p.painBefore);
            const yAfter = getY(p.painAfter);

            return (
              <g key={idx}>
                {/* Pre-session point */}
                <circle cx={x} cy={yBefore} r="4" fill="#f43f5e" />
                {/* Post-session point */}
                <circle cx={x} cy={yAfter} r="5" fill="#10b981" stroke="#090a0c" strokeWidth="1.5" />

                {/* Session label on bottom */}
                <text
                  x={x}
                  y={height - 4}
                  fill="rgba(255,255,255,0.6)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  #{p.sessionNumber || idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
            <span className="text-rose-300">Dolor Pre-sesión</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full" />
            <span className="text-emerald-300 font-semibold">Dolor Post-sesión (Alivio)</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-white/40">Escala EVA (0=Sin dolor, 10=Máximo)</span>
      </div>
    </div>
  );
}
