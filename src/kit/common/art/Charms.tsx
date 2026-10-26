import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* Folk charms against wolves, plus the marks a wolf leaves. All deterministic, light-aware. */

/** A bundle of wolfsbane (monkshood) hung upside down from a nail: hooded violet flowers on fanned stems. */
export const Wolfsbane: React.FC<{x: number; y: number; s?: number; t: number; warm?: number; lit?: number}> = ({x, y, s = 1, t, warm = 1, lit = 1}) => {
  const rim = warm > 0.5 ? '#ffb45a' : '#9fb4cf';
  const petal = lerpColor('#2a2246', '#4a2a5a', warm);
  const petalLit = lerpColor('#6f6aa8', '#a0609a', warm);
  const stem = lerpColor('#0e140e', '#1e1a0c', warm);
  const sway = noise1(t * 0.8, 3) * 2.5;
  const stems = [-26, -14, -4, 6, 16, 28];
  const r = rng(91);
  return (
    <g transform={`translate(${x},${y}) rotate(${sway}) scale(${s})`}>
      {/* nail and twine */}
      <circle cx={0} cy={-8} r={6} fill="#1a1a1c" />
      <path d="M0,-8 L-6,24 M0,-8 L6,24" stroke="#5a4630" strokeWidth={3} />
      <rect x={-14} y={22} width={28} height={14} rx={4} fill="#4a3a26" />
      <path d="M-14,26 L14,26 M-14,31 L14,31" stroke="#2a2014" strokeWidth={2} />
      {stems.map((a, i) => {
        const len = 190 + r() * 70;
        const ex = Math.sin((a * Math.PI) / 180) * len;
        const ey = 34 + Math.cos((a * Math.PI) / 180) * len;
        const flowers = 4 + Math.floor(r() * 3);
        return (
          <g key={i}>
            <path d={`M0,34 Q${ex * 0.4},${34 + len * 0.5} ${ex},${ey}`} stroke={stem} strokeWidth={4} fill="none" />
            {/* palmate leaves near the tie */}
            <path d={`M${ex * 0.15},${50 + i * 3} l${-10 + i * 4},18 l6,-4 l2,18 l6,-16 l8,10 l-2,-20 Z`} fill={stem} />
            {Array.from({length: flowers}, (_, k) => {
              const f = 0.42 + (k / flowers) * 0.58;
              const fx = ex * f * (0.9 + f * 0.1), fy = 34 + (ey - 34) * f;
              const sc = 0.7 + k * 0.08;
              return (
                <g key={k} transform={`translate(${fx},${fy}) rotate(${180 + a * 0.6}) scale(${sc})`}>
                  {/* the hood (helmet) and two lower petals */}
                  <path d="M-11,6 C-14,-10 -6,-24 4,-22 C14,-20 16,-6 12,6 Z" fill={petal} />
                  <path d="M-11,6 C-14,-10 -6,-24 4,-22" stroke={petalLit} strokeOpacity={0.6 * lit} strokeWidth={2} fill="none" />
                  <path d="M-10,6 l-6,10 l8,-4 Z M10,6 l6,10 l-8,-4 Z" fill={petal} />
                  <circle cx={0} cy={4} r={2} fill={rim} opacity={0.35 * lit} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/** A row of silver nail heads driven into a sill top. rust 0..1 dulls them over the years; glint 0..1 per-nail sparkle. */
export const SilverNails: React.FC<{xs: number[]; y: number; r?: number; rust?: number; warm?: number; glint?: number; t: number}> = ({
  xs,
  y,
  r = 9,
  rust = 0,
  warm = 0,
  glint = 1,
  t,
}) => {
  const head = lerpColor(lerpColor('#c9d2de', '#e8d6b8', warm), '#5a3a22', rust);
  const shade = lerpColor('#5d6674', '#3a2412', rust);
  return (
    <g>
      {xs.map((x, i) => {
        const sp = Math.max(0, Math.sin(t * 2.2 + i * 1.7)) ** 8 * glint * (1 - rust);
        return (
          <g key={i}>
            <ellipse cx={x} cy={y + 3} rx={r * 1.15} ry={r * 0.5} fill="#000" opacity={0.6} />
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill={shade} />
            <ellipse cx={x - r * 0.15} cy={y - r * 0.1} rx={r * 0.8} ry={r * 0.4} fill={head} />
            <ellipse cx={x - r * 0.35} cy={y - r * 0.2} rx={r * 0.25} ry={r * 0.12} fill="#ffffff" opacity={0.5 * (1 - rust)} />
            {rust > 0.3 && <path d={`M${x + r * 0.6},${y + 2} q4,10 2,22`} stroke="#4a2410" strokeOpacity={rust * 0.7} strokeWidth={3} fill="none" />}
            {sp > 0.02 && (
              <g opacity={sp}>
                <path d={`M${x - r * 2},${y - r * 0.2} L${x + r * 2},${y - r * 0.2} M${x - r * 0.35},${y - r * 2} L${x - r * 0.35},${y + r * 1.6}`} stroke="#fff" strokeWidth={2} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

/**
 * Mud on a sill: a smeared palm print whose four fingers drag away from (x, y) toward the window
 * (dir in degrees, -90 = straight up the screen), ending in pale claw gouges in the wood:
 * whatever left it was climbing OUT.
 */
export const MudMarks: React.FC<{x: number; y: number; s?: number; flat?: number; dir?: number; lit?: number; wet?: number; reveal?: number}> = ({
  x,
  y,
  s = 1,
  flat = 0.38, // vertical foreshortening: the marks lie on a horizontal sill seen at an angle
  dir = -90,
  lit = 1,
  wet = 1,
  reveal = 1,
}) => {
  const r = rng(616);
  const mud = '#22170d';
  const mudLit = '#7a6648';
  const crumbs = Array.from({length: 12}, () => [(r() - 0.5) * 240, 40 + r() * 120, 3 + r() * 6]);
  // a clawed handprint, fingers toward the window; smears trail back toward the room
  const fingers = [
    {x: -50, y: -40, a: -16, l: 58},
    {x: -18, y: -58, a: -5, l: 66},
    {x: 16, y: -56, a: 5, l: 64},
    {x: 46, y: -36, a: 15, l: 52},
  ];
  return (
    <g transform={`translate(${x},${y}) scale(${s},${s * flat}) rotate(${dir + 90})`} opacity={reveal}>
      {/* drag smears behind the palm */}
      {[-40, -10, 20, 46].map((sx, i) => (
        <path key={i} d={`M${sx - 12},20 C${sx - 16},80 ${sx - 10 + i * 3},140 ${sx - 4 + i * 4},${170 - i * 18} C${sx + 4},140 ${sx + 10},80 ${sx + 12},20 Z`} fill={mud} opacity={0.55} />
      ))}
      {/* palm */}
      <path d="M-62,10 C-70,-24 -46,-40 0,-40 C44,-40 70,-22 62,12 C56,44 30,60 0,60 C-30,60 -56,42 -62,10 Z" fill={mud} />
      {/* thumb */}
      <path d="M-62,14 C-96,0 -112,-20 -110,-40 C-96,-36 -80,-22 -60,-6 Z" fill={mud} />
      {fingers.map((f, i) => (
        <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.a})`}>
          <rect x={-12} y={-f.l} width={24} height={f.l + 10} rx={12} fill={mud} />
          {/* claw: a long dark hooked gouge past the fingertip */}
          <path d={`M-6,${-f.l + 4} L-1,${-f.l - 50} L1,${-f.l - 50} L6,${-f.l + 4} Z`} fill="#050403" />
          <path d={`M-4,${-f.l + 2} L-1,${-f.l - 46}`} stroke="#b9c3d2" strokeOpacity={0.35 * lit} strokeWidth={2} fill="none" />
        </g>
      ))}
      <path d="M-56,0 C-30,-20 30,-20 56,0" stroke={mudLit} strokeOpacity={0.3 * lit * wet} strokeWidth={3} fill="none" />
      {crumbs.map(([cx, cy, cr], i) => (
        <circle key={i} cx={cx} cy={cy} r={cr} fill={mud} opacity={0.8} />
      ))}
    </g>
  );
};

/** Holes where nails have just been pulled from a sill: dark pits with pale, fresh splinters round them. */
export const NailHoles: React.FC<{xs: number[]; y: number; r?: number; fresh?: number; lit?: number}> = ({xs, y, r = 7, fresh = 1, lit = 1}) => (
  <g>
    {xs.map((x, i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill="#020203" />
        {fresh > 0 &&
          [-50, 20, 160, 230].map((a, k) => {
            const rad = (a * Math.PI) / 180;
            const L = r * (1.6 + ((i + k) % 3) * 0.5);
            return (
              <path
                key={k}
                d={`M${x + Math.cos(rad) * r * 0.9},${y + Math.sin(rad) * r * 0.5} l${Math.cos(rad) * L},${Math.sin(rad) * L * 0.55}`}
                stroke="#d8c4a0"
                strokeOpacity={0.75 * fresh * lit}
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}
      </g>
    ))}
  </g>
);

/** An enamel house-number plate on a stone wall. */
export const HousePlate: React.FC<{x: number; y: number; s?: number; n: string; lit?: number}> = ({x, y, s = 1, n, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-46} y={-34} width={92} height={68} rx={12} fill="#1a2436" stroke="#c8d0dc" strokeOpacity={0.6 * lit} strokeWidth={4} />
    <text x={0} y={16} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={46} fill="#e8eef6" opacity={0.9 * lit}>
      {n}
    </text>
  </g>
);
