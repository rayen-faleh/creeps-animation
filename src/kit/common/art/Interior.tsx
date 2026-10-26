import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* Inside the house: the staircase, a mantel with a photo frame, a hospital bed sheet. Plain SVG, any format. */

/**
 * A narrow staircase seen from the bottom step: treads climbing into the dark, a banister on the right,
 * a landing and a door at the top. light 'candle' | 'night'; glowY: 0..1 a candle glow climbing the wall.
 * prints: footprints of soil on the treads (0..1 how many from the bottom).
 */
export const Staircase: React.FC<{id: string; x?: number; y?: number; s?: number; t: number; light: 'candle' | 'night'; glow?: number; glowY?: number; prints?: number; children?: React.ReactNode}> = ({
  id,
  x = 0,
  y = 0,
  s = 1,
  t,
  light,
  glow = 0,
  glowY = 0,
  prints = 0,
  children,
}) => {
  const warm = light === 'candle' ? 1 : 0;
  const wall = lerpColor('#0c1017', '#2a1508', warm);
  const tread = lerpColor('#141210', '#3a2412', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  const steps = 13;
  const stepAt = (i: number) => {
    const f = i / steps;
    const k = 1 - f * 0.62; // narrower as it climbs
    return {y: 1080 - f * 900, w: 820 * k, h: 72 * k};
  };
  const fl = 0.85 + noise1(t * 7, 2) * 0.15;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffb45a" stopOpacity={0.5} />
          <stop offset="1" stopColor="#ffb45a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-600} y={-400} width={3120} height={1900} fill={wall} />
      {/* side walls converging */}
      <path d="M-600,-400 L620,120 L620,1500 L-600,1500 Z" fill="#000" opacity={0.35} />
      <path d="M2520,-400 L1300,120 L1300,1500 L2520,1500 Z" fill="#000" opacity={0.45} />
      {/* landing and the door at the top */}
      <rect x={760} y={-30} width={400} height={210} fill="#050403" />
      <path d="M860,180 L860,0 Q960,-80 1060,0 L1060,180 Z" fill={lerpColor('#17110c', '#2a170b', warm)} />
      <path d="M860,180 L860,0 Q960,-80 1060,0 L1060,180" stroke={rim} strokeOpacity={0.3} strokeWidth={3} fill="none" />
      <circle cx={1030} cy={100} r={6} fill="#0c0c0e" stroke={rim} strokeOpacity={0.4} />
      {children}
      {/* treads, top first so the nearer ones overlap */}
      {Array.from({length: steps}, (_, k) => steps - 1 - k).map((i) => {
        const st = stepAt(i);
        const cx = 960;
        return (
          <g key={i}>
            <rect x={cx - st.w / 2} y={st.y - st.h} width={st.w} height={st.h} fill={tread} />
            <rect x={cx - st.w / 2} y={st.y - st.h} width={st.w} height={5} fill={rim} opacity={0.18 + warm * 0.1} />
            <rect x={cx - st.w / 2} y={st.y - st.h * 0.35} width={st.w} height={st.h * 0.35} fill="#000" opacity={0.45} />
            {prints > i / steps && (
              <g opacity={0.85}>
                <ellipse cx={cx + (i % 2 ? 60 : -60) * (st.w / 820)} cy={st.y - st.h * 0.62} rx={22 * st.w / 820} ry={st.h * 0.2} fill="#1c140c" />
                <ellipse cx={cx + (i % 2 ? 60 : -60) * (st.w / 820)} cy={st.y - st.h * 0.4} rx={14 * st.w / 820} ry={st.h * 0.1} fill="#1c140c" />
                <circle cx={cx + (i % 2 ? 72 : -48) * (st.w / 820)} cy={st.y - st.h * 0.5} r={4 * st.w / 820} fill="#6a0f14" />
              </g>
            )}
          </g>
        );
      })}
      {/* banister */}
      <path d="M1460,1100 L1120,60" stroke="#0a0604" strokeWidth={22} />
      <path d="M1460,1100 L1120,60" stroke={rim} strokeOpacity={0.3} strokeWidth={3} />
      {Array.from({length: 12}, (_, i) => {
        const f = i / 12;
        const bx = 1440 - f * 330, by = 1080 - f * 1000;
        return <rect key={i} x={bx - 5} y={by} width={10} height={110 * (1 - f * 0.6)} fill="#0a0604" />;
      })}
      {glow > 0 && <circle cx={760} cy={1000 - glowY * 1000} r={420} fill={`url(#${id}-glow)`} opacity={glow * fl} />}
    </g>
  );
};

/**
 * A mantelpiece shelf with a standing photo frame. down 0..1 lays the frame face-down (the photo hidden);
 * children: the photo's contents, drawn in a 220x280 box centred on the frame.
 */
export const MantelPhoto: React.FC<{id: string; x: number; y: number; s?: number; down?: number; warm?: number; lit?: number; children?: React.ReactNode}> = ({
  id,
  x,
  y,
  s = 1,
  down = 0,
  warm = 1,
  lit = 1,
  children,
}) => {
  const wood = lerpColor('#141210', '#3a2412', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  const sy = Math.cos(down * Math.PI * 0.5); // foreshortened as it tips back
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-520} y={0} width={1040} height={40} fill={wood} />
      <rect x={-520} y={0} width={1040} height={5} fill={rim} opacity={0.35 * lit} />
      <rect x={-500} y={40} width={1000} height={400} fill="#000" opacity={0.4} />
      <g transform={`translate(0,0) scale(1,${Math.max(0.04, sy)}) translate(0,-330)`}>
        <rect x={-150} y={0} width={300} height={330} rx={6} fill="#2a1a0e" />
        <rect x={-150} y={0} width={300} height={330} rx={6} fill="none" stroke="#c8a96a" strokeOpacity={0.45 * lit} strokeWidth={4} />
        {down < 0.5 ? (
          <g>
            <clipPath id={`${id}-ph`}>
              <rect x={-110} y={25} width={220} height={280} />
            </clipPath>
            <rect x={-110} y={25} width={220} height={280} fill="#8a7a62" />
            <g clipPath={`url(#${id}-ph)`} transform="translate(0,165)">
              {children}
            </g>
            <rect x={-110} y={25} width={220} height={280} fill="#fff" opacity={0.06} />
          </g>
        ) : (
          <rect x={-130} y={20} width={260} height={290} fill="#1a1008" />
        )}
      </g>
    </g>
  );
};

/** Hospital bed seen from the bedside: folded white sheet, a steel rail, cold fluorescent light. */
export const HospitalBed: React.FC<{id: string; t: number; lit?: number; children?: React.ReactNode}> = ({id, t, lit = 1, children}) => {
  const r = rng(12);
  const hum = 0.96 + noise1(t * 30, 4) * 0.02;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sheet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d2dc" />
          <stop offset="1" stopColor="#5a6472" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#0e1218" />
      <rect x={-400} y={-400} width={2720} height={500} fill="#3a4654" opacity={0.25 * hum} />
      <path d="M-400,380 C200,340 700,400 1100,360 C1500,330 1800,390 2320,350 L2320,1500 L-400,1500 Z" fill={`url(#${id}-sheet)`} opacity={0.75 * lit} />
      {Array.from({length: 9}, (_, i) => (
        <path key={i} d={`M${-200 + i * 260 + r() * 80},${420 + r() * 60} q${60 + r() * 60},${200 + r() * 120} ${-20 + r() * 40},${500}`} stroke="#3a4250" strokeOpacity={0.45} strokeWidth={6} fill="none" />
      ))}
      <rect x={-400} y={1000} width={2720} height={26} rx={13} fill="#7d8796" opacity={0.7 * lit} />
      <rect x={-400} y={1000} width={2720} height={6} fill="#e8eef6" opacity={0.4 * lit} />
      {children}
    </g>
  );
};
