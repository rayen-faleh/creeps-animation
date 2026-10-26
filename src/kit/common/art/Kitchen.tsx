import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* The kitchen: a pillar tap with a turnable crosshead and a timed drip, a deep Belfast sink, tiles. */

export type DripSpec = {
  period: number; // seconds between drops (2.0 = "one drop every two seconds")
  t0?: number; // a drop lands at t0 + k*period
  on?: number; // 0..1, 0 = dry
  fall?: number; // px from spout to the water below
};

/** Where a drop is at time t: forming at the spout (0..1 swell), falling (y offset), or a splash ring (0..1). */
export const dripState = (t: number, d: DripSpec) => {
  const on = d.on ?? 1;
  if (on <= 0.001) return {swell: 0, fallY: -1, splash: -1};
  const ph = (((t - (d.t0 ?? 0)) % d.period) + d.period) % d.period;
  const fallT = Math.min(0.32, d.period * 0.3); // seconds in the air
  const formEnd = d.period - fallT;
  if (ph < formEnd) return {swell: (ph / formEnd) ** 1.6 * on, fallY: -1, splash: ph < 0.35 ? ph / 0.35 : -1};
  const ft = (ph - formEnd) / fallT; // 0..1 falling
  return {swell: 0, fallY: ft * ft * (d.fall ?? 200), splash: -1};
};

/**
 * Pillar tap seen from the front, base at (x, y), about 300 units tall at s=1.
 * turn: crosshead angle in degrees (90 = a quarter turn). light: 'night' (cold rim) | 'warm' (lamp rim).
 */
export const Tap: React.FC<{id: string; x: number; y: number; s?: number; t: number; turn?: number; drip?: DripSpec; light?: 'night' | 'warm'; lit?: number}> = ({
  id,
  x,
  y,
  s = 1,
  t,
  turn = 0,
  drip,
  light = 'night',
  lit = 1,
}) => {
  const rim = light === 'warm' ? '#ffcf8a' : '#c5d4ea';
  const metal = light === 'warm' ? '#6a5a44' : '#4a5260';
  const dark = '#14161b';
  const spout: [number, number] = [118, -150]; // outlet, local units
  const st = drip ? dripState(t, drip) : null;
  // crosshead: four arms around a vertical axis; the projected width follows cos of each arm's angle
  const arms = [0, 90, 180, 270].map((a) => {
    const r = ((a + turn) * Math.PI) / 180;
    return {dx: Math.sin(r) * 62, depth: Math.cos(r)};
  });
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark} />
          <stop offset="0.28" stopColor={metal} />
          <stop offset="0.4" stopColor={rim} stopOpacity={0.9 * lit} />
          <stop offset="0.52" stopColor={metal} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      {/* base flange and body */}
      <ellipse cx={0} cy={0} rx={52} ry={14} fill={dark} />
      <path d="M-30,0 L-26,-210 L26,-210 L30,0 Z" fill={`url(#${id}-chrome)`} />
      <rect x={-34} y={-150} width={68} height={22} rx={8} fill={`url(#${id}-chrome)`} />
      {/* spout curving forward and down */}
      <path d={`M22,-150 C70,-158 104,-176 ${spout[0] + 10},-182 C${spout[0] + 22},-178 ${spout[0] + 14},-160 ${spout[0] + 8},${spout[1] + 6} L${spout[0] - 10},${spout[1] + 6} C${spout[0] - 8},-160 92,-158 22,-128 Z`} fill={`url(#${id}-chrome)`} />
      <ellipse cx={spout[0] - 1} cy={spout[1] + 6} rx={9} ry={3} fill="#050506" />
      {/* bonnet and crosshead */}
      <rect x={-22} y={-236} width={44} height={28} rx={6} fill={`url(#${id}-chrome)`} />
      {arms
        .slice()
        .sort((a, b) => a.depth - b.depth)
        .map((a, i) => (
          <g key={i} opacity={0.75 + 0.25 * (a.depth * 0.5 + 0.5)}>
            <path d={`M0,-248 L${a.dx},-252`} stroke={`url(#${id}-chrome)`} strokeWidth={14 + a.depth * 3} strokeLinecap="round" />
            <circle cx={a.dx} cy={-252} r={11 + a.depth * 2} fill={metal} stroke={rim} strokeOpacity={0.35 * lit} strokeWidth={2} />
          </g>
        ))}
      <circle cx={0} cy={-250} r={20} fill="#d8d4ca" />
      <text x={0} y={-243} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={20} fill="#2a4a8a">
        C
      </text>
      {/* drip */}
      {st && st.swell > 0.02 && (
        <g transform={`translate(${spout[0] - 1},${spout[1] + 8})`}>
          <path
            d={`M-${3 + st.swell * 5},0 C-${3 + st.swell * 7},${st.swell * 14} ${3 + st.swell * 7},${st.swell * 14} ${3 + st.swell * 5},0 Z`}
            transform={`scale(1,${1 + st.swell * 0.6})`}
            fill="#c8dcf0"
            opacity={0.85}
          />
          <circle cx={-2} cy={st.swell * 8} r={1.6 + st.swell} fill="#ffffff" opacity={0.8 * lit} />
        </g>
      )}
      {st && st.fallY >= 0 && (
        <g transform={`translate(${spout[0] - 1},${spout[1] + 14 + st.fallY})`}>
          <path d="M0,-12 C5,-2 7,6 0,10 C-7,6 -5,-2 0,-12 Z" fill="#c8dcf0" opacity={0.9} />
          <circle cx={-2} cy={2} r={2} fill="#fff" opacity={0.8 * lit} />
        </g>
      )}
      {st && st.splash >= 0 && drip && (
        <g transform={`translate(${spout[0] - 1},${spout[1] + 14 + (drip.fall ?? 200)})`} opacity={1 - st.splash}>
          <ellipse rx={6 + st.splash * 40} ry={2 + st.splash * 9} fill="none" stroke="#c8dcf0" strokeWidth={2} />
          <ellipse rx={2 + st.splash * 18} ry={1 + st.splash * 4} fill="none" stroke="#c8dcf0" strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/** Deep Belfast sink seen from the front and slightly above: apron, basin, drain, a stain under the tap. */
export const BelfastSink: React.FC<{x: number; y: number; w?: number; warm?: number; lit?: number; water?: number}> = ({x, y, w = 760, warm = 0, lit = 1, water = 0}) => {
  const china = lerpColor('#9aa4b4', '#e0cfae', warm);
  const chinaDark = lerpColor('#2a3140', '#5a4630', warm);
  const h = 300;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* basin opening, in perspective */}
      <path d={`M${-w / 2},0 L${w / 2},0 L${w / 2 - 40},90 L${-w / 2 + 40},90 Z`} fill={china} opacity={0.35 + 0.4 * lit} />
      <path d={`M${-w / 2 + 40},90 L${w / 2 - 40},90 L${w / 2 - 70},20 L${-w / 2 + 70},20 Z`} fill={chinaDark} />
      <ellipse cx={0} cy={66} rx={34} ry={9} fill="#0a0a0c" />
      <ellipse cx={0} cy={66} rx={34} ry={9} fill="none" stroke={china} strokeOpacity={0.5} strokeWidth={2} />
      <path d={`M-90,56 Q0,40 90,56 Q0,74 -90,56 Z`} fill="#6a5a3a" opacity={0.25} />
      {water > 0 && <ellipse cx={0} cy={62} rx={150 * water} ry={22 * water} fill="#9fb4cf" opacity={0.18} />}
      {/* front apron */}
      <path d={`M${-w / 2},90 L${w / 2},90 L${w / 2},${h} L${-w / 2},${h} Z`} fill={china} />
      <path d={`M${-w / 2},90 L${w / 2},90 L${w / 2},${h} L${-w / 2},${h} Z`} fill="#000" opacity={0.25 + 0.4 * (1 - lit)} />
      <path d={`M${-w / 2},92 L${w / 2},92`} stroke="#ffffff" strokeOpacity={0.35 * lit} strokeWidth={4} />
      {/* crazing */}
      {Array.from({length: 7}, (_, i) => (
        <path key={i} d={`M${-w / 2 + 60 + i * 95},${120 + (i % 3) * 30} l${20 + (i % 2) * 14},${40} l${-10},${30}`} stroke={chinaDark} strokeOpacity={0.35} strokeWidth={1.5} fill="none" />
      ))}
    </g>
  );
};

/** White metro tiles with dark grout and age, over a rectangle. */
export const Tiles: React.FC<{id: string; x: number; y: number; w: number; h: number; warm?: number; lit?: number}> = ({id, x, y, w, h, warm = 0, lit = 1}) => {
  const tile = lerpColor('#3a4252', '#6e5a40', warm);
  const r = rng(55);
  return (
    <g>
      <defs>
        <pattern id={`${id}-t`} width={120} height={60} patternUnits="userSpaceOnUse">
          <rect width={120} height={60} fill="#0c0d10" />
          <rect x={2} y={2} width={116} height={26} rx={4} fill={tile} />
          <rect x={-58} y={32} width={116} height={26} rx={4} fill={tile} />
          <rect x={62} y={32} width={116} height={26} rx={4} fill={tile} />
          <rect x={6} y={4} width={60} height={4} rx={2} fill="#fff" opacity={0.08 * lit} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-t)`} />
      {Array.from({length: 18}, (_, i) => (
        <rect key={i} x={x + r() * w} y={y + r() * h} width={30 + r() * 80} height={10 + r() * 30} fill="#000" opacity={0.08 + r() * 0.08} />
      ))}
    </g>
  );
};

/** Slow rain on glass: streaks running down inside a clip box (screen-space friendly, deterministic). */
export const RainOnGlass: React.FC<{id: string; x: number; y: number; w: number; h: number; t: number; amount?: number}> = ({id, x, y, w, h, t, amount = 1}) => {
  const r = rng(909);
  const drops = Array.from({length: Math.round(60 * amount)}, () => ({x: r() * w, speed: 30 + r() * 120, len: 20 + r() * 70, off: r() * 3000, wob: r() * 10}));
  return (
    <g>
      <clipPath id={`${id}-c`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id}-c)`} stroke="#cfdcef" strokeLinecap="round" fill="none">
        {drops.map((d, i) => {
          const yy = y + ((d.off + t * d.speed) % (h + 200)) - 100;
          const xx = x + d.x + noise1(t * 0.7 + i, i) * d.wob;
          return <path key={i} d={`M${xx},${yy} q2,${d.len * 0.5} 0,${d.len}`} strokeWidth={2.2} strokeOpacity={0.22} />;
        })}
      </g>
    </g>
  );
};
