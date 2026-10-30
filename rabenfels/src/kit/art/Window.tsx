import React from 'react';
import {lerpColor, mix, rng} from '../util';
import {theme} from '../theme';

/* ---------------- Tree silhouette (procedural, seeded, sways) ---------------- */
type BranchSpec = {len: number; ang: number; w: number; kids: BranchSpec[]};
const makeTree = (seed: number, depth: number, len: number, w: number): BranchSpec => {
  const r = rng(seed);
  const build = (d: number, l: number, wd: number, a: number): BranchSpec => {
    const kids: BranchSpec[] = [];
    if (d > 0) {
      const n = d > 3 ? 2 + (r() > 0.6 ? 1 : 0) : 2;
      for (let i = 0; i < n; i++) {
        const spread = (i / (n - 1 || 1) - 0.5) * (0.9 + r() * 0.5) + (r() - 0.5) * 0.35;
        kids.push(build(d - 1, l * (0.66 + r() * 0.16), wd * 0.66, spread));
      }
    }
    return {len: l, ang: a, w: wd, kids};
  };
  return build(depth, len, w, 0);
};
const TREES = [makeTree(11, 7, 260, 34), makeTree(29, 6, 220, 26)];

const Branch: React.FC<{b: BranchSpec; t: number; depth: number; sway: number; color: string}> = ({
  b,
  t,
  depth,
  sway,
  color,
}) => {
  const wob = Math.sin(t * 0.9 + depth * 1.3) * sway * depth * 0.6 + Math.sin(t * 2.3 + depth) * sway * 0.25 * depth;
  const deg = (b.ang * 180) / Math.PI + wob;
  // slightly crooked branch: quadratic with offset control point
  const bend = Math.sin(depth * 7.1 + b.len) * b.len * 0.12;
  return (
    <g transform={`rotate(${deg})`}>
      <path
        d={`M0,0 Q${bend},${-b.len / 2} 0,${-b.len}`}
        stroke={color}
        strokeWidth={b.w}
        strokeLinecap="round"
        fill="none"
      />
      <g transform={`translate(0,${-b.len})`}>
        {b.kids.map((k, i) => (
          <Branch key={i} b={k} t={t} depth={depth + 1} sway={sway} color={color} />
        ))}
      </g>
    </g>
  );
};

export const Tree: React.FC<{x: number; y: number; scale: number; rot: number; t: number; which?: number; sway?: number; color?: string}> = ({
  x,
  y,
  scale,
  rot,
  t,
  which = 0,
  sway = 1,
  color = '#000000',
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}>
    <Branch b={TREES[which]} t={t} depth={0} sway={sway} color={color} />
  </g>
);

/* ---------------- Sky ---------------- */
export const Sky: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  dawn?: number;
  moonX: number;
  moonY: number;
  moonR?: number;
  cloudCover?: number; // 0..1 how much clouds hide the moon
  wind?: number;
}> = ({id, x, y, w, h, t, dawn = 0, moonX, moonY, moonR = 70, cloudCover = 0.2, wind = 1}) => {
  const top = lerpColor('#03050a', '#1d2140', dawn);
  const mid = lerpColor('#0b1424', '#6b3f52', dawn);
  const bot = lerpColor('#13213a', '#e08a4c', dawn);
  const r = rng(77);
  const stars = Array.from({length: 40}, () => [x + r() * w, y + r() * h * 0.7, r() * 1.6 + 0.4, r()]);
  const clouds = Array.from({length: 6}, (_, i) => ({
    y: moonY - 160 + i * 70 + r() * 40,
    w: 380 + r() * 360,
    h: 50 + r() * 50,
    speed: (14 + r() * 18) * wind,
    off: r() * 1400,
  }));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <radialGradient id={`${id}-moonglow`}>
          <stop offset="0" stopColor={theme.moonGlow} stopOpacity={0.55 * (1 - dawn)} />
          <stop offset="0.35" stopColor={theme.moonGlow} stopOpacity={0.18 * (1 - dawn)} />
          <stop offset="1" stopColor={theme.moonGlow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="1">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity={0.9 * dawn} />
          <stop offset="0.5" stopColor="#ff9a55" stopOpacity={0.35 * dawn} />
          <stop offset="1" stopColor="#ff9a55" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-cblur`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sky)`} />
      {stars.map(([sx, sy, sr, ph], i) => (
        <circle
          key={i}
          cx={sx}
          cy={sy}
          r={sr}
          fill="#cfd8e6"
          opacity={(0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + ph * 20))) * (1 - dawn)}
        />
      ))}
      <circle cx={moonX} cy={moonY} r={moonR * 6} fill={`url(#${id}-moonglow)`} />
      <g opacity={1 - dawn * 0.9}>
        <circle cx={moonX} cy={moonY} r={moonR} fill={theme.moon} />
        {/* maria */}
        <circle cx={moonX - moonR * 0.3} cy={moonY - moonR * 0.2} r={moonR * 0.28} fill="#b9c3cf" opacity={0.6} />
        <circle cx={moonX + moonR * 0.25} cy={moonY + moonR * 0.25} r={moonR * 0.2} fill="#b9c3cf" opacity={0.5} />
        <circle cx={moonX + moonR * 0.35} cy={moonY - moonR * 0.35} r={moonR * 0.12} fill="#b9c3cf" opacity={0.5} />
      </g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sun)`} />
      <g filter={`url(#${id}-cblur)`}>
        {clouds.map((c, i) => {
          const cx = x - 400 + ((c.off + t * c.speed) % (w + 900));
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={c.y}
              rx={c.w / 2}
              ry={c.h / 2}
              fill={lerpColor('#070b14', '#3a2a3a', dawn)}
              opacity={0.55 + cloudCover * 0.45}
            />
          );
        })}
      </g>
    </g>
  );
};

/* ---------------- Gothic window ---------------- */
const archPath = (x0: number, w: number, ys: number, yb: number, rFac: number) => {
  const r = w * rFac;
  const ah = Math.sqrt(r * r - (r - w / 2) * (r - w / 2));
  return {
    d: `M${x0},${yb} L${x0},${ys} A${r},${r} 0 0 1 ${x0 + w / 2},${ys - ah} A${r},${r} 0 0 1 ${x0 + w},${ys} L${x0 + w},${yb} Z`,
    ah,
  };
};

const Lattice: React.FC<{x: number; y: number; w: number; h: number; step?: number; color?: string; width?: number}> = ({
  x,
  y,
  w,
  h,
  step = 52,
  color = '#05070b',
  width = 3,
}) => {
  const lines: string[] = [];
  for (let k = -h; k < w + h; k += step) {
    lines.push(`M${x + k},${y} l${h},${h}`);
    lines.push(`M${x + k},${y + h} l${h},${-h}`);
  }
  return <path d={lines.join(' ')} stroke={color} strokeWidth={width} fill="none" />;
};

export type WindowProps = {
  id: string;
  cx: number;
  yb: number; // bottom of glass (top of sill)
  w: number;
  h: number; // apex height above yb
  t: number;
  light: 'night' | 'candle' | 'dawn';
  dawn?: number;
  open?: number; // 0..1 casement opening
  moon?: [number, number];
  cloudCover?: number;
  wind?: number;
  treeSway?: number;
  outside?: React.ReactNode;
};

export const GothicWindow: React.FC<WindowProps> = ({
  id,
  cx,
  yb,
  w,
  h,
  t,
  light,
  dawn = 0,
  open = 0,
  moon,
  cloudCover = 0.2,
  wind = 1,
  treeSway = 1,
  outside,
}) => {
  const x0 = cx - w / 2;
  const outer = archPath(x0, w, yb - h + w * 0.7, yb, 0.82);
  const ys = yb - h + outer.ah;
  const opening = archPath(x0, w, ys, yb, 0.82);
  const f = w * 0.09; // frame thickness
  const frame = archPath(x0 - f, w + 2 * f, ys, yb + f * 0.4, 0.8);
  const m = w * 0.06; // mullion
  const lw = (w - 3 * m) / 2;
  const lys = ys + w * 0.16;
  const lanL = archPath(x0 + m, lw, lys, yb - m * 0.6, 0.9);
  const lanR = archPath(x0 + 2 * m + lw, lw, lys, yb - m * 0.6, 0.9);
  const ocR = w * 0.155;
  const ocY = lys - lanL.ah - ocR * 0.55;
  const qr = ocR * 0.5;
  const quat = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ].map(([a, b]) => [cx + a * qr * 0.92, ocY + b * qr * 0.92]);

  const stone = light === 'candle' ? '#1c0f07' : lerpColor('#0b0d12', '#2a1c18', dawn);
  const stoneLit = light === 'candle' ? '#8a4b1e' : lerpColor('#5d6b80', '#d58a55', dawn);
  const glassTint = light === 'candle' ? 'rgba(255,170,90,0.10)' : `rgba(150,170,200,${0.06 + dawn * 0.05})`;
  const [mx, my] = moon ?? [cx + w * 0.24, yb - h * 0.5];

  // casement leaves swing inward (towards camera) around outer hinges
  const leaf = (side: -1 | 1, p: {d: string}, lx: number) => {
    const hingeX = side < 0 ? lx : lx + lw;
    const ang = open * 1.25; // radians
    const sx = Math.cos(ang);
    const skew = side * open * 9;
    return (
      <g transform={`translate(${hingeX},0) skewY(${skew}) scale(${sx},1) translate(${-hingeX},0)`}>
        <clipPath id={`${id}-leafclip${side}`}>
          <path d={p.d} />
        </clipPath>
        <path d={p.d} fill={glassTint} />
        {/* faint reflection sheen; brighter as the leaf turns toward us */}
        <path d={p.d} fill="#c8d6ea" opacity={0.03 + open * 0.12} />
        <g clipPath={`url(#${id}-leafclip${side})`}>
          <Lattice x={lx} y={yb - h} w={lw} h={h} />
        </g>
        <path d={p.d} fill="none" stroke="#06080c" strokeWidth={10} />
        <path d={p.d} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.35} />
      </g>
    );
  };

  return (
    <g>
      <defs>
        <clipPath id={`${id}-open`}>
          <path d={opening.d} />
        </clipPath>
        <mask id={`${id}-holes`} maskUnits="userSpaceOnUse" x={x0 - 500} y={yb - h - 500} width={w + 1000} height={h + 1000}>
          <rect x={x0 - 500} y={yb - h - 500} width={w + 1000} height={h + 1000} fill="#fff" />
          <path d={lanL.d} fill="#000" />
          <path d={lanR.d} fill="#000" />
          {quat.map(([qx, qy], i) => (
            <circle key={i} cx={qx} cy={qy} r={qr * 0.62} fill="#000" />
          ))}
          <circle cx={cx} cy={ocY} r={qr * 0.55} fill="#000" />
        </mask>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={stoneLit} stopOpacity={0.35} />
          <stop offset="0.5" stopColor={stone} />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
      </defs>
      {/* hood moulding (dripstone) with label stops and finial */}
      {(() => {
        const hood = archPath(x0 - f * 1.7, w + 3.4 * f, ys, ys + f * 0.2, 0.79);
        return (
          <g>
            <path d={hood.d} fill="none" stroke={stone} strokeWidth={f * 0.55} />
            <path d={hood.d} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.35} transform="translate(-2,-2)" />
            <rect x={x0 - f * 2.1} y={ys + f * 0.1} width={f * 0.8} height={f * 0.9} fill={stone} />
            <rect x={x0 + w + f * 1.3} y={ys + f * 0.1} width={f * 0.8} height={f * 0.9} fill={stone} />
            <path
              d={`M${cx},${ys - hood.ah - f * 1.4} q${f * 0.35},${f * 0.6} 0,${f * 1.2} q${-f * 0.35},${-f * 0.6} 0,${-f * 1.2}`}
              fill={stone}
              stroke={stoneLit}
              strokeOpacity={0.3}
            />
          </g>
        );
      })()}
      {/* outer moulding */}
      <path d={frame.d} fill={stone} />
      <path d={frame.d} fill={`url(#${id}-stone)`} opacity={0.6} />
      {/* the night beyond */}
      <g clipPath={`url(#${id}-open)`}>
        <Sky
          id={id}
          x={x0}
          y={yb - h}
          w={w}
          h={h}
          t={t}
          dawn={dawn}
          moonX={mx}
          moonY={my}
          moonR={w * 0.085}
          cloudCover={cloudCover}
          wind={wind}
        />
        <Tree x={x0 + w * 1.05} y={yb + 120} scale={1.5} rot={-28} t={t} which={0} sway={treeSway} />
        <Tree x={x0 - w * 0.1} y={yb + 260} scale={1.2} rot={22} t={t + 3} which={1} sway={treeSway} />
        {outside}
      </g>
      {/* tracery plate with glass holes */}
      <path d={opening.d} fill={stone} mask={`url(#${id}-holes)`} />
      <path d={opening.d} fill={`url(#${id}-stone)`} opacity={0.5} mask={`url(#${id}-holes)`} />
      {/* carved recesses in the spandrels */}
      {[-1, 1].map((sd) => (
        <g key={sd} opacity={0.75}>
          <path
            d={`M${cx + sd * w * 0.36},${ys - w * 0.05} q${-sd * w * 0.08},${-w * 0.14} ${-sd * w * 0.04},${-w * 0.3} q${sd * w * 0.06},${w * 0.12} ${sd * w * 0.04},${w * 0.3} Z`}
            fill="#020203"
          />
          <path
            d={`M${cx + sd * w * 0.36},${ys - w * 0.05} q${-sd * w * 0.08},${-w * 0.14} ${-sd * w * 0.04},${-w * 0.3}`}
            fill="none"
            stroke={stoneLit}
            strokeWidth={1.5}
            opacity={0.35}
          />
        </g>
      ))}
      {/* oculus glass + leading */}
      {quat.map(([qx, qy], i) => (
        <circle key={i} cx={qx} cy={qy} r={qr * 0.62} fill={glassTint} stroke="#05070b" strokeWidth={4} />
      ))}
      <circle cx={cx} cy={ocY} r={ocR} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.4} />
      {/* casement leaves */}
      {leaf(-1, lanL, x0 + m)}
      {leaf(1, lanR, x0 + 2 * m + lw)}
      {/* moonlit bevel on the opening */}
      <path d={opening.d} fill="none" stroke={stoneLit} strokeWidth={3} opacity={0.5} />
      <path d={frame.d} fill="none" stroke="#000" strokeWidth={6} opacity={0.8} />
    </g>
  );
};
