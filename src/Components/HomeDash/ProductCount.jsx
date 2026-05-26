import React from "react";

/**
 * Product Sale donut chart with two categories.
 *
 * Props:
 *  - data: [{ label, value, color }]  (values are percentages, should sum to 100)
 */

const DEFAULT_DATA = [
  { label: "Curtains", value: 62, color: "#3b82f6" },
  { label: "Blinds", value: 38, color: "#f59e0b" },
];

export default function ProductCount({ data = DEFAULT_DATA }) {
  const size = 220;
  const stroke = 34;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let acc = 0; // running offset (in percent)

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Product Sale Chart
      </h2>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {data.map((d) => {
              const dash = (d.value / 100) * c;
              const gap = c - dash;
              const offset = -(acc / 100) * c;
              acc += d.value;
              return (
                <circle
                  key={d.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <ul className="mt-6 w-full space-y-3">
          {data.map((d) => (
            <li key={d.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: d.color }}
                />
                {d.label}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {d.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
