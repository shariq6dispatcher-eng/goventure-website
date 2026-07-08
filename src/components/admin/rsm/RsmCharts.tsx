"use client";

import { useState } from "react";

/**
 * Lightweight, dependency-free SVG charts for the RSM dashboard.
 * No charting library needed — keeps the bundle small and avoids adding
 * an npm package you'd have to install locally (you edit via GitHub web
 * editor, so no new dependencies is safer than pulling in recharts etc).
 */

// ---------------------------------------------------------------------------
// Line Chart — used for the 6-month revenue/expense trend
// ---------------------------------------------------------------------------
export interface LineChartSeries {
  label: string;
  color: string; // hex or tailwind-style hex, e.g. "#D4AF37"
  points: number[]; // same length as `categories`
}

interface RsmLineChartProps {
  categories: string[]; // x-axis labels, e.g. ["Feb", "Mar", ...]
  series: LineChartSeries[];
  height?: number;
  formatValue?: (n: number) => string;
}

export function RsmLineChart({
  categories,
  series,
  height = 220,
  formatValue = (n) => `$${n.toFixed(0)}`,
}: RsmLineChartProps) {
  const width = 600; // viewBox width; scales responsively via CSS
  const padding = { top: 16, right: 12, bottom: 28, left: 12 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = series.flatMap((s) => s.points);
  const maxVal = Math.max(1, ...allValues);
  const stepX = categories.length > 1 ? chartW / (categories.length - 1) : 0;

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const toXY = (points: number[]) =>
    points.map((v, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (v / maxVal) * chartH;
      return { x, y };
    });

  const toPath = (points: number[]) =>
    toXY(points)
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ height }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Horizontal gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + chartH * (1 - f)}
            y2={padding.top + chartH * (1 - f)}
            stroke="#27272a"
            strokeWidth={1}
          />
        ))}

        {/* Invisible hover columns */}
        {categories.map((_, i) => (
          <rect
            key={i}
            x={padding.left + i * stepX - stepX / 2}
            y={0}
            width={stepX || width}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {/* Series lines */}
        {series.map((s) => (
          <path
            key={s.label}
            d={toPath(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Series dots */}
        {series.map((s) =>
          toXY(s.points).map((p, i) => (
            <circle
              key={`${s.label}-${i}`}
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 4.5 : 3}
              fill={s.color}
              stroke="#09090b"
              strokeWidth={1.5}
            />
          ))
        )}

        {/* Hover vertical guide */}
        {hoverIdx !== null && (
          <line
            x1={padding.left + hoverIdx * stepX}
            x2={padding.left + hoverIdx * stepX}
            y1={padding.top}
            y2={padding.top + chartH}
            stroke="#52525b"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        )}

        {/* X-axis labels */}
        {categories.map((c, i) => (
          <text
            key={c}
            x={padding.left + i * stepX}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#71717a"
          >
            {c}
          </text>
        ))}
      </svg>

      {/* Legend + hover readout */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 px-1">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
            {hoverIdx !== null && (
              <span className="text-white font-mono font-semibold">
                {formatValue(s.points[hoverIdx])}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Donut Chart — used for orders-by-status breakdown
// ---------------------------------------------------------------------------
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface RsmDonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
}

export function RsmDonutChart({
  segments,
  size = 160,
  thickness = 22,
}: RsmDonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAccum = 0;

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={thickness}
        />
        {total > 0 &&
          segments.map((seg) => {
            const frac = seg.value / total;
            const dash = frac * circumference;
            const gap = circumference - dash;
            const el = (
              <circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offsetAccum}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="butt"
              />
            );
            offsetAccum += dash;
            return el;
          })}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#ffffff"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          fontSize="9"
          fill="#71717a"
        >
          TOTAL
        </text>
      </svg>

      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-zinc-400">{seg.label}</span>
            <span className="text-white font-mono font-semibold">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
