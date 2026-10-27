import { cn } from "@/lib/cn";

export function LineChart({
  points,
  labels,
  height = 160,
}: {
  points: number[];
  labels: string[];
  height?: number;
}) {
  const max = Math.max(...points, 1);
  const width = 560;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((point, index) => {
    const x = index * step;
    const y = height - (point / max) * (height - 16) - 8;
    return [x, y] as const;
  });
  const d = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img" aria-label="Trend chart">
      <path d={d} fill="none" stroke="#2A5C56" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(([x, y], index) => (
        <g key={labels[index]}>
          <circle cx={x} cy={y} r="4" fill="#F4F1EB" stroke="#2A5C56" strokeWidth="2" />
          <text x={x} y={height + 18} textAnchor="middle" fontSize="12" fill="#5C675F">
            {labels[index]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function BarList({
  items,
}: {
  items: { label: string; value: number; hint?: string }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-ink">{item.label}</span>
            <span className="text-muted">{item.hint ?? item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-paper-deep">
            <div className={cn("h-full rounded-full bg-sage")} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
