import type { ReactNode } from 'react';

type Props = {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
};

export default function Ring({ pct, size = 56, stroke = 5, color = 'var(--accent)', children }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <svg width={size} height={size} className="ring" aria-label={`${Math.round(p * 100)}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - p)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      {children != null && (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="ring-label">
          {children}
        </text>
      )}
    </svg>
  );
}
