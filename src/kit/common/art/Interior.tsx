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
            <g clipPath={`url(#${id}-ph)`}>
              <g transform="translate(0,165)">{children}</g>
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

/**
 * Inside the cupboard under the sink, seen by torchlight: the trap, and the cold copper pipe that should drop
 * to the mains but turns sideways and runs into the back wall. capped 0..1 draws the plumber's cap at the wall;
 * flow 0..1 a faint shimmer of water moving through the copper.
 */
export const UnderSink: React.FC<{id: string; t: number; capped?: number; flow?: number; lit?: number}> = ({id, t, capped = 0, flow = 1, lit = 1}) => {
  const copper = '#8a4e2a';
  const copperLit = '#e09a5e';
  const pipe = (d: string, w = 34) => (
    <g>
      <path d={d} stroke="#2a160a" strokeWidth={w + 6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={copper} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={copperLit} strokeOpacity={0.45 * lit} strokeWidth={6} fill="none" transform="translate(-8,-8)" strokeLinecap="round" />
    </g>
  );
  const shimmer = flow > 0 ? ((t * 0.6) % 1) : 0;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-flow`} x1="0" y1="0" x2="1" y2="0">
          <stop offset={Math.max(0, shimmer - 0.1)} stopColor="#fff" stopOpacity="0" />
          <stop offset={shimmer} stopColor="#cfe6ff" stopOpacity={0.35 * flow} />
          <stop offset={Math.min(1, shimmer + 0.1)} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#07080a" />
      {/* cupboard back wall, damp-stained */}
      <rect x={200} y={60} width={1520} height={900} fill="#15130f" />
      <ellipse cx={1300} cy={760} rx={300} ry={160} fill="#2a2418" opacity={0.5} />
      {/* the sink's underside and waste trap */}
      <rect x={300} y={60} width={1320} height={110} fill="#2a2e36" />
      {pipe('M960,170 L960,330 Q960,420 1050,420 Q1140,420 1140,330 L1140,300', 46)}
      {pipe('M1140,300 L1140,260 L1620,260', 40)}
      {/* the cold feed: down from the tap, then sideways along the wall and through it */}
      {pipe('M760,170 L760,560 Q760,640 680,640 L230,640')}
      <path d="M760,170 L760,560 Q760,640 680,640 L230,640" stroke={`url(#${id}-flow)`} strokeWidth={20} fill="none" />
      {/* where it goes through the wall: a rough hole with old mortar */}
      <ellipse cx={210} cy={640} rx={40} ry={56} fill="#030303" />
      <ellipse cx={210} cy={640} rx={48} ry={64} fill="none" stroke="#3a3428" strokeWidth={10} />
      {/* a stub that should go down to the mains, sealed off long ago */}
      {pipe('M760,560 L860,560 L860,700', 26)}
      <rect x={842} y={700} width={36} height={22} rx={4} fill="#3a2a1a" />
      {capped > 0 && (
        <g opacity={capped}>
          <rect x={400} y={612} width={70} height={56} rx={8} fill="#b8bcc4" />
          <rect x={410} y={604} width={50} height={72} rx={6} fill="#9a9ea8" />
          <path d="M405,616 L465,616" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

/** Close on an old copper joint, solder run and verdigris, a maker's stamp: "1974". */
export const PipeJoint: React.FC<{x: number; y: number; s?: number; lit?: number; dirt?: number}> = ({x, y, s = 1, lit = 1, dirt = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-700} y={-70} width={1400} height={140} rx={70} fill="#7a4424" />
    <rect x={-700} y={-60} width={1400} height={24} rx={12} fill="#e09a5e" opacity={0.4 * lit} />
    <rect x={-150} y={-100} width={300} height={200} rx={40} fill="#8a5230" />
    <rect x={-150} y={-90} width={300} height={30} rx={14} fill="#f0b07a" opacity={0.4 * lit} />
    <path d="M-150,-60 q-12,60 0,120 M150,-60 q12,60 0,120" stroke="#c8c0a8" strokeWidth={10} fill="none" opacity={0.8} />
    {[-520, -380, 300, 470].map((vx, i) => (
      <ellipse key={i} cx={vx} cy={20 - (i % 2) * 30} rx={70} ry={26} fill="#4a8a6a" opacity={0.45} />
    ))}
    <text x={0} y={30} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={64} fill="#3a1e0e" opacity={0.85} letterSpacing={6}>
      1974
    </text>
    {dirt > 0 && <path d="M-700,70 C-400,40 -200,90 100,60 C400,40 600,90 700,60 L700,200 L-700,200 Z" fill="#1a120a" opacity={dirt} />}
  </g>
);

/**
 * Soil and red petals dragged across a floor, from (x0,y0) to (x1,y1) (floor-plane coordinates in px),
 * reveal 0..1 along the path; boot heels every so often.
 */
export const SoilTrail: React.FC<{x0: number; y0: number; x1: number; y1: number; reveal?: number; lit?: number; seed?: number}> = ({x0, y0, x1, y1, reveal = 1, lit = 1, seed = 5}) => {
  const r = rng(seed);
  const n = 60;
  const items = Array.from({length: n}, (_, i) => {
    const f = i / (n - 1);
    return {f, x: x0 + (x1 - x0) * f + (r() - 0.5) * 70, y: y0 + (y1 - y0) * f + (r() - 0.5) * 30, r: 4 + r() * 12, petal: r() < 0.22, rot: r() * 180};
  });
  return (
    <g>
      {items
        .filter((it) => it.f <= reveal)
        .map((it, i) =>
          it.petal ? (
            <g key={i} transform={`translate(${it.x},${it.y}) rotate(${it.rot})`}>
              <path d="M0,0 C-10,-6 -12,-18 -2,-20 C8,-18 10,-6 0,0 Z" fill="#6a0f14" />
              <path d="M-2,-4 C-4,-10 -2,-16 2,-17" stroke="#b0202a" strokeOpacity={0.6 * lit} strokeWidth={1.5} fill="none" />
            </g>
          ) : (
            <ellipse key={i} cx={it.x} cy={it.y} rx={it.r} ry={it.r * 0.6} fill="#1c140c" />
          ),
        )}
      {Array.from({length: 6}, (_, k) => {
        const f = (k + 0.5) / 6;
        if (f > reveal) return null;
        const bx = x0 + (x1 - x0) * f + (k % 2 ? 40 : -40), by = y0 + (y1 - y0) * f;
        return (
          <g key={`b${k}`} opacity={0.85}>
            <ellipse cx={bx} cy={by} rx={34} ry={16} fill="#1c140c" />
            <rect x={bx - 22} y={by + 22} width={44} height={20} rx={6} fill="#1c140c" />
          </g>
        );
      })}
    </g>
  );
};

/** A 1960s wedding photograph, sepia: bride with veil (left), groom in a dark suit (right), faces in soft light. */
export const WeddingPhoto: React.FC<{lit?: number}> = ({lit = 1}) => (
  <g>
    <rect x={-110} y={-140} width={220} height={280} fill="#6e5a42" />
    <rect x={-110} y={-140} width={220} height={140} fill="#7e6a50" />
    {/* bride: veil, dark hair, white dress */}
    <path d="M-100,140 C-96,40 -80,0 -40,-10 L-10,-10 C10,10 16,60 14,140 Z" fill="#e2d6be" />
    <path d="M-70,-60 C-64,-100 4,-104 8,-58 C14,-10 40,60 30,140 L-110,140 C-110,60 -86,-10 -70,-60 Z" fill="#efe6d4" opacity={0.45} />
    <path d="M-64,-50 C-66,-86 -6,-92 -4,-52 C-4,-30 -10,-20 -14,-16 L-56,-16 C-62,-24 -64,-36 -64,-50 Z" fill="#2a1a10" />
    <ellipse cx={-34} cy={-44} rx={20} ry={25} fill="#d8bc98" stroke="#3a2618" strokeWidth={2} />
    <path d="M-44,-48 l6,0 M-30,-48 l6,0" stroke="#2a1a10" strokeWidth={2.5} />
    <path d="M-42,-32 q8,7 16,0" stroke="#6a3a2a" strokeWidth={2.5} fill="none" />
    {/* groom: dark suit, hair parted, my nose and my chin */}
    <path d="M14,140 C16,50 30,0 60,-6 L80,-6 C104,6 110,60 110,140 Z" fill="#1e1a16" />
    <path d="M60,-6 L70,40 L80,-6 Z" fill="#e2d6be" />
    <ellipse cx={70} cy={-42} rx={20} ry={26} fill="#c8a882" stroke="#3a2618" strokeWidth={2} />
    <path d="M48,-54 C50,-80 92,-82 94,-54 C88,-64 70,-68 48,-54 Z" fill="#1a120c" />
    <path d="M60,-46 l6,0 M74,-46 l6,0" stroke="#1a120c" strokeWidth={2.5} />
    <path d="M70,-42 L76,-30 L68,-28" stroke="#5a3a26" strokeWidth={2.5} fill="none" />
    <path d="M62,-22 q8,4 16,0" stroke="#5a3a26" strokeWidth={2} fill="none" />
    <rect x={-110} y={-140} width={220} height={280} fill="#fff4dc" opacity={0.05 * lit} />
  </g>
);

/** A small van side-on with a cartoon spanner on its door. */
export const Van: React.FC<{x: number; y: number; s?: number; light?: 'dusk' | 'night'}> = ({x, y, s = 1, light = 'dusk'}) => {
  const body = light === 'dusk' ? '#2a2830' : '#101218';
  const rim = light === 'dusk' ? '#c56a2e' : '#7d90ad';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-260,0 L-260,-170 L80,-170 L170,-90 L260,-80 L260,0 Z" fill={body} />
      <path d="M-260,-170 L80,-170 L170,-90 L260,-80" stroke={rim} strokeOpacity={0.4} strokeWidth={4} fill="none" />
      <path d="M96,-160 L160,-96 L96,-96 Z" fill="#0a0c10" />
      <circle cx={-160} cy={0} r={44} fill="#050505" />
      <circle cx={160} cy={0} r={44} fill="#050505" />
      <circle cx={-160} cy={0} r={18} fill="#2a2a2a" />
      <circle cx={160} cy={0} r={18} fill="#2a2a2a" />
      {/* the cartoon spanner */}
      <g transform="translate(-90,-90) rotate(-30)">
        <rect x={-70} y={-10} width={120} height={20} rx={8} fill="#d8c060" />
        <path d="M50,-26 a26,26 0 1,1 0,52 l-14,-16 l0,-20 Z" fill="#d8c060" />
        <circle cx={-30} cy={-4} r={4} fill="#1a1a1a" />
        <circle cx={-12} cy={-4} r={4} fill="#1a1a1a" />
        <path d="M-34,6 q12,8 24,0" stroke="#1a1a1a" strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

/** Mick's kitchen table seen from a chair: scrubbed planks receding, the far edge, a lamp's warm pool. */
export const KitchenTable: React.FC<{y?: number; warm?: number; lit?: number; children?: React.ReactNode}> = ({y = 980, warm = 0, lit = 1, children}) => {
  const wood = lerpColor('#1a1612', '#3a2412', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  return (
    <g>
      <path d={`M-300,${y} L1380,${y} L1600,2100 L-520,2100 Z`} fill={wood} />
      {Array.from({length: 7}, (_, i) => (
        <path key={i} d={`M${-300 + i * 280},${y} L${-520 + i * 353},2100`} stroke="#000" strokeOpacity={0.45} strokeWidth={4} />
      ))}
      <path d={`M-300,${y} L1380,${y}`} stroke={rim} strokeOpacity={0.4 * lit} strokeWidth={4} />
      {children}
    </g>
  );
};
