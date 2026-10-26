import React from 'react';
import {rng, lerpColor} from '../util';
import {theme} from '../theme';

/* ---------------- Wall with faint damask ---------------- */
export const Wall: React.FC<{id: string; x: number; y: number; w: number; h: number; warm?: number; lit?: number}> = ({
  id,
  x,
  y,
  w,
  h,
  warm = 0,
  lit = 1,
}) => {
  const base = lerpColor(theme.wall, theme.warmWall, warm);
  const pat = lerpColor('#151b26', '#3d200d', warm);
  return (
    <g>
      <defs>
        <pattern id={`${id}-dam`} width="120" height="170" patternUnits="userSpaceOnUse">
          <path
            d="M60,10 C80,40 100,50 96,80 C92,104 72,100 66,118 C62,132 70,150 60,160 C50,150 58,132 54,118 C48,100 28,104 24,80 C20,50 40,40 60,10 Z
               M60,52 C66,64 74,70 72,84 C70,92 64,92 60,100 C56,92 50,92 48,84 C46,70 54,64 60,52 Z"
            fill={pat}
            fillRule="evenodd"
            opacity={0.55 * lit}
          />
          <circle cx="0" cy="85" r="5" fill={pat} opacity={0.5 * lit} />
          <circle cx="120" cy="85" r="5" fill={pat} opacity={0.5 * lit} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={base} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-dam)`} />
    </g>
  );
};

/* ---------------- Window sill (inside) ---------------- */
export const Sill: React.FC<{x: number; y: number; w: number; depth: number; front: number; warm?: number; lit?: number}> = ({
  x,
  y,
  w,
  depth,
  front,
  warm = 0,
  lit = 1,
}) => {
  const top = lerpColor('#2b2f38', '#8a5228', warm);
  const face = lerpColor('#0d0f13', '#3a1c0b', warm);
  return (
    <g>
      {/* top face in perspective: back edge narrower */}
      <path d={`M${x + 20},${y} L${x + w - 20},${y} L${x + w},${y + depth} L${x},${y + depth} Z`} fill={top} opacity={0.6 + 0.4 * lit} />
      <path d={`M${x},${y + depth} L${x + w},${y + depth}`} stroke="#c8d3e3" strokeOpacity={0.25 * lit} strokeWidth={3} />
      <rect x={x - 8} y={y + depth} width={w + 16} height={front} fill={face} />
      <rect x={x - 8} y={y + depth + front} width={w + 16} height={10} fill="#000" opacity={0.6} />
      {/* wood grain */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <path key={i} d={`M${x + 30},${y + depth * f} C${x + w * 0.4},${y + depth * f - 3} ${x + w * 0.6},${y + depth * f + 3} ${x + w - 30},${y + depth * f}`} stroke="#000" strokeOpacity={0.25} strokeWidth={1.5} fill="none" />
      ))}
    </g>
  );
};

/* ---------------- Heavy curtains ---------------- */
export const Curtain: React.FC<{id: string; x: number; y: number; w: number; h: number; side: -1 | 1; t: number; billow?: number; warm?: number}> = ({
  id,
  x,
  y,
  w,
  h,
  side,
  t,
  billow = 0,
  warm = 0,
}) => {
  const folds = 6;
  const c1 = lerpColor('#120609', '#3a0e0a', warm);
  const c2 = lerpColor('#2a0d14', '#6a1c10', warm);
  // inner edge sways; billow pushes bottom inward toward window center
  const inner = side < 0 ? x + w : x;
  const outer = side < 0 ? x : x + w;
  const pts: string[] = [];
  const N = 12;
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const sway = Math.sin(t * 2.4 + v * 5) * (6 + billow * 60) * v + billow * 140 * v * v;
    pts.push(`${inner - side * sway},${y + v * h}`);
  }
  const d = `M${outer},${y} L${pts.join(' L')} L${outer},${y + h} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2={1 / folds} y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.45" stopColor={c2} />
          <stop offset="0.7" stopColor={c1} />
          <stop offset="1" stopColor="#050203" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-fold)`} />
      <path d={`M${inner},${y} L${pts.join(' L')}`} stroke="#9fb4cf" strokeOpacity={0.12 + billow * 0.15} strokeWidth={3} fill="none" />
    </g>
  );
};

/* ---------------- Moonlight shaft & dust ---------------- */
export const MoonBeam: React.FC<{id: string; poly: string; t: number; opacity?: number; color?: string; dust?: number; bounds: [number, number, number, number]}> = ({
  id,
  poly,
  t,
  opacity = 0.18,
  color = theme.coldLight,
  dust = 40,
  bounds,
}) => {
  const r = rng(5);
  const [bx, by, bw, bh] = bounds;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <defs>
        <filter id={`${id}-bb`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <clipPath id={`${id}-bc`}>
          <polygon points={poly} />
        </clipPath>
      </defs>
      <polygon points={poly} fill={color} opacity={opacity} filter={`url(#${id}-bb)`} />
      <g clipPath={`url(#${id}-bc)`}>
        {Array.from({length: dust}, (_, i) => {
          const sx = r() * bw;
          const sy = r() * bh;
          const sp = 6 + r() * 14;
          const px = bx + ((sx + Math.sin(t * 0.4 + i) * 30 + t * sp * 0.5) % bw);
          const py = by + ((sy + t * sp) % bh);
          return <circle key={i} cx={px} cy={py} r={0.8 + r() * 2.2} fill="#e8eef7" opacity={0.25 + 0.4 * Math.abs(Math.sin(t + i))} />;
        })}
      </g>
    </g>
  );
};

/* ---------------- Floorboards (seen from above at a slant) ---------------- */
export const Floor: React.FC<{id: string; x: number; y: number; w: number; h: number; lit?: number}> = ({id, x, y, w, h, lit = 1}) => {
  const r = rng(91);
  const boards = 9;
  const bw = w / boards;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#0b0a09" />
      {Array.from({length: boards}, (_, i) => {
        const shade = 0.75 + r() * 0.5;
        const c = lerpColor('#0e0c0a', '#2a241e', (shade - 0.75) * lit);
        const seams = [r() * h * 0.5, h * 0.5 + r() * h * 0.5];
        return (
          <g key={i}>
            <rect x={x + i * bw} y={y} width={bw - 4} height={h} fill={c} />
            <line x1={x + i * bw - 2} y1={y} x2={x + i * bw - 2} y2={y + h} stroke="#000" strokeWidth={5} />
            {seams.map((sy, j) => (
              <line key={j} x1={x + i * bw} y1={y + sy} x2={x + (i + 1) * bw - 4} y2={y + sy} stroke="#000" strokeWidth={3} opacity={0.8} />
            ))}
            {Array.from({length: 3}, (_, j) => (
              <path
                key={j}
                d={`M${x + i * bw + 12 + j * bw * 0.28},${y} C${x + i * bw + 20 + j * bw * 0.28},${y + h * 0.3} ${x + i * bw + 4 + j * bw * 0.28},${y + h * 0.6} ${x + i * bw + 14 + j * bw * 0.28},${y + h}`}
                stroke="#000"
                strokeOpacity={0.22}
                strokeWidth={1.4}
                fill="none"
              />
            ))}
          </g>
        );
      })}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-ff)`} />
      <defs>
        <linearGradient id={`${id}-ff`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  );
};

/* ---------------- Rice ---------------- */
export const Grain: React.FC<{x: number; y: number; rot: number; s?: number; lit?: number; warm?: number; glint?: number}> = ({
  x,
  y,
  rot,
  s = 1,
  lit = 1,
  warm = 0,
  glint = 0,
}) => {
  const body = lerpColor(lerpColor('#6f7684', theme.rice, lit), '#f3c98a', warm);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={1.2} cy={1.8} rx={7.6} ry={3.2} fill="#000" opacity={0.6} />
      <path d="M-7.5,0 C-6,-3.4 5,-3.4 7.5,-0.4 C6,3 -5,3 -7.5,0 Z" fill={body} />
      <path d="M-5.5,-0.6 C-2,-1.8 3,-1.8 5.5,-0.6" stroke="#fff" strokeOpacity={0.35 + glint * 0.65} strokeWidth={1.1} fill="none" />
      <path d="M-5,1.4 C-1,2.2 3,2.2 5.5,1" stroke="#000" strokeOpacity={0.25} strokeWidth={0.8} fill="none" />
      {glint > 0 && <circle cx={-2} cy={-1} r={6 + glint * 10} fill="#fff6e0" opacity={glint * 0.35} />}
    </g>
  );
};

export type GrainSpec = {x: number; y: number; rot: number};
/** A tidy mound of ten grains centred at (cx, cy). */
export const pileOf10 = (cx: number, cy: number, seed: number, spread = 1): GrainSpec[] => {
  const r = rng(seed);
  const out: GrainSpec[] = [];
  const ring = [
    [0, 0],
    [-9, -4],
    [9, -3],
    [-6, 6],
    [7, 7],
    [0, -10],
    [-14, 3],
    [15, 4],
    [-3, 13],
    [4, -2],
  ];
  ring.forEach(([dx, dy]) => out.push({x: cx + dx * spread + (r() - 0.5) * 3, y: cy + dy * spread * 0.8 + (r() - 0.5) * 3, rot: r() * 180}));
  return out;
};

/** Loose scatter of grains in a rectangle. */
export const scatter = (n: number, x: number, y: number, w: number, h: number, seed: number): GrainSpec[] => {
  const r = rng(seed);
  return Array.from({length: n}, () => ({x: x + r() * w, y: y + r() * h, rot: r() * 180}));
};
