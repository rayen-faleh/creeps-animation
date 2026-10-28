import React from 'react';
import {lerpColor, noise1} from '../util';
import {Candle} from './Props';

/* The vampire council and the night that led to it: a long candlelit table seen from the near end, hooded figures with
   eyes that catch the light, voting stones, a black envelope with a wax seal, a wine glass that breaks, an old telly
   and a pair of boots that stop at the doormat. */

/** One-point perspective for the council table: depth d from 1 (near edge) to 4 (far end). */
export const TABLE = {cx: 540, horizon: 600, yNear: 1750, halfNear: 560};
export const tablePt = (u: number, d: number): [number, number] => {
  const k = 1 / d;
  return [TABLE.cx + u * TABLE.halfNear * k, TABLE.horizon + (TABLE.yNear - TABLE.horizon) * k];
};

/** A pair of eyes in the dark: two almond shapes with a glint. blink 0 open .. 1 shut. */
export const Eyes: React.FC<{x: number; y: number; s?: number; blink?: number; glow?: string; gap?: number; look?: number; pupil?: number}> = ({x, y, s = 1, blink = 0, glow = '#e8e2d4', gap = 46, look = 0, pupil = 4}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${(sd * gap) / 2},0) scale(1,${Math.max(0.05, 1 - blink)})`}>
        <ellipse cx={0} cy={0} rx={16} ry={20} fill={glow} opacity={0.12} />
        <path d="M-14,0 C-8,-7 8,-7 14,0 C8,6 -8,6 -14,0 Z" fill={glow} opacity={0.85} />
        <circle cx={look * 5} cy={0} r={pupil} fill="#000" />
      </g>
    ))}
  </g>
);

/** A hooded councillor in a high-backed chair, seen across the table. side -1 left, 1 right. */
const Councillor: React.FC<{d: number; side: number; t: number; seed: number; eyes?: number; hands?: boolean}> = ({d, side, t, seed, eyes = 1, hands = true}) => {
  const k = 1 / d;
  const [ex] = tablePt(side * 1.32, d);
  const [, ey] = tablePt(0, d);
  const blink = Math.max(0, 1 - Math.abs(((t + seed * 1.7) % 5.3) - 0.1) / 0.09);
  const lean = noise1(t * 0.4, seed) * 6;
  return (
    <g transform={`translate(${ex + lean * k},${ey}) scale(${k})`}>
      {/* chair back */}
      <path d="M-170,40 L-170,-980 C-170,-1100 170,-1100 170,-980 L170,40 Z" fill="#0a0809" />
      <path d="M-170,-980 C-170,-1100 170,-1100 170,-980" stroke="#ffb45a" strokeOpacity={0.12} strokeWidth={6} fill="none" />
      {/* hooded body */}
      <path d="M-210,60 C-200,-260 -150,-420 -90,-520 C-60,-700 60,-700 90,-520 C150,-420 200,-260 210,60 Z" fill="#050506" />
      <path d="M-90,-520 C-60,-700 60,-700 90,-520" stroke="#ffb45a" strokeOpacity={0.18} strokeWidth={5} fill="none" />
      <ellipse cx={0} cy={-520} rx={62} ry={80} fill="#000" />
      {eyes > 0 && (
        <g opacity={eyes}>
          <Eyes x={side * -8} y={-530} s={1.9} blink={blink} look={-side * 0.6} gap={48} glow="#f4ead8" />
        </g>
      )}
      {/* grey hands folded on the table edge */}
      {hands && (
        <g transform={`translate(${side * -150},20)`}>
          <ellipse cx={0} cy={0} rx={70} ry={26} fill="#8a9098" />
          <path d="M-60,-6 C-30,-24 30,-24 60,-6" stroke="#c8d0d8" strokeOpacity={0.5} strokeWidth={5} fill="none" />
        </g>
      )}
    </g>
  );
};

/**
 * The council table from the near end: stone room, a long black cloth, candles down the middle, three hooded figures
 * down each side, and her chair at the far end. Draw `near` (your hands, the phone) as children; `far` sits at the far end.
 */
export const CouncilTable: React.FC<{t: number; eyes?: number; candles?: number; far?: React.ReactNode; children?: React.ReactNode; cloth?: boolean; depths?: number[]; atFar?: React.ReactNode}> = ({
  t,
  eyes = 1,
  candles = 1,
  far,
  children,
  cloth = true,
  depths = [3.6, 2.6, 1.9],
  atFar,
}) => {
  const [nlx, ny] = tablePt(-1, 1);
  const [nrx] = tablePt(1, 1);
  const [flx, fy] = tablePt(-1, 4.2);
  const [frx] = tablePt(1, 4.2);
  const flick = 0.9 + noise1(t * 6, 3) * 0.1;
  return (
    <g>
      <rect x={-600} y={-800} width={2280} height={3200} fill="#07060a" />
      {/* the stone end wall and a tall arched window, barely there */}
      <path d="M420,560 L420,220 C420,120 660,120 660,220 L660,560 Z" fill="#0d1220" />
      <path d="M540,130 L540,560 M420,360 L660,360" stroke="#07060a" strokeWidth={12} />
      <ellipse cx={540} cy={760} rx={900 * candles} ry={700 * candles} fill="#ffb45a" opacity={0.08 * flick * candles} />
      {/* her chair at the far end */}
      <g transform={`translate(540,${fy}) scale(${1 / 4.2})`}>
        <path d="M-220,40 L-220,-1300 C-220,-1480 220,-1480 220,-1300 L220,40 Z" fill="#0a0809" />
        <path d="M-220,-1300 C-220,-1480 220,-1480 220,-1300" stroke="#ffb45a" strokeOpacity={0.15} strokeWidth={8} fill="none" />
      </g>
      {far}
      {/* councillors, far to near so nearer ones overlap */}
      {[3.1, 2.25, 1.55].map((d, i) => (
        <g key={d}>
          <Councillor d={d} side={-1} t={t} seed={i * 2 + 1} eyes={eyes} />
          <Councillor d={d} side={1} t={t} seed={i * 2 + 2} eyes={eyes} />
        </g>
      ))}
      {/* the table */}
      <path d={`M${nlx},${ny} L${flx},${fy} L${frx},${fy} L${nrx},${ny} Z`} fill={cloth ? '#120709' : '#1a120c'} />
      <path d={`M${nlx},${ny} L${flx},${fy} M${nrx},${ny} L${frx},${fy}`} stroke="#ffb45a" strokeOpacity={0.18 * candles} strokeWidth={4} />
      <ellipse cx={540} cy={1150} rx={300} ry={330} fill="#ffb45a" opacity={0.07 * flick * candles} />
      <rect x={nlx} y={ny} width={nrx - nlx} height={300} fill="#0a0406" />
      {atFar}
      {/* candles down the middle, far to near */}
      {candles > 0 &&
        depths.map((d, i) => {
          const [cx, cy] = tablePt(0, d);
          return <Candle key={d} x={cx} y={cy} t={t + i * 0.7} s={1.1 / d} glow={candles} />;
        })}
      {children}
    </g>
  );
};

/** A smooth voting stone, top view. */
export const VoteStone: React.FC<{x: number; y: number; s?: number; white: boolean; lit?: number}> = ({x, y, s = 1, white, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={6} cy={14} rx={58} ry={22} fill="#000" opacity={0.5} />
    <ellipse cx={0} cy={0} rx={56} ry={36} fill={white ? '#d8d2c4' : '#141418'} />
    <ellipse cx={-14} cy={-12} rx={26} ry={10} fill="#fff" opacity={(white ? 0.5 : 0.18) * lit} />
  </g>
);

/** A black envelope sealed with red wax; `open` lifts the flap. */
export const BlackEnvelope: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number}> = ({x, y, s = 1, rot = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-250} y={-150} width={500} height={300} rx={8} fill="#0c0c10" />
    <path d="M-250,-150 L0,40 L250,-150" stroke="#2a2a32" strokeWidth={6} fill="none" />
    <rect x={-250} y={-150} width={500} height={300} rx={8} fill="none" stroke="#9fb4cf" strokeOpacity={0.25 * lit} strokeWidth={3} />
    {/* wax seal */}
    <circle cx={0} cy={40} r={46} fill="#7a0e14" />
    <circle cx={0} cy={40} r={34} fill="none" stroke="#4a060a" strokeWidth={5} />
    <path d="M-14,26 L0,58 L14,26" stroke="#4a060a" strokeWidth={6} fill="none" strokeLinejoin="round" />
    <circle cx={-14} cy={26} r={6} fill="#c4161c" opacity={0.5 * lit} />
  </g>
);

/** A heavy black card with copperplate lettering. */
export const CallingCard: React.FC<{x: number; y: number; s?: number; rot?: number; lines: string[]; reveal?: number}> = ({x, y, s = 1, rot = 0, lines, reveal = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-330} y={-200} width={660} height={400} rx={6} fill="#0e0d10" />
    <rect x={-306} y={-176} width={612} height={352} fill="none" stroke="#8a6a3a" strokeOpacity={0.7} strokeWidth={3} />
    {lines.map((l, i) => (
      <text
        key={i}
        x={0}
        y={-40 + i * 90 - ((lines.length - 1) * 90) / 2 + 40}
        textAnchor="middle"
        fontFamily="CountCaption, serif"
        fontStyle="italic"
        fontSize={i === lines.length - 1 ? 68 : 60}
        fill="#d8c08a"
        opacity={Math.min(1, Math.max(0, reveal * lines.length - i))}
      >
        {l}
      </text>
    ))}
  </g>
);

/** A wine glass, side view. fill 0..1 of the bowl; broken 0..1 bursts the bowl into shards. Origin at the base. */
export const WineGlass: React.FC<{x: number; y: number; s?: number; rot?: number; fill?: number; broken?: number; lit?: number; warm?: number; lipstick?: boolean}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  fill = 0.5,
  broken = 0,
  lit = 1,
  warm = 1,
  lipstick = false,
}) => {
  const rim = lerpColor('#c8d3e3', '#ffd9a8', warm);
  const bowl = 'M-70,-300 C-80,-200 -60,-150 0,-140 C60,-150 80,-200 70,-300 Z';
  const shards = [
    [-1, -1.3, 20],
    [1.2, -1, -30],
    [-1.4, 0.2, 50],
    [1.4, 0.4, -60],
    [0.2, -1.6, 10],
    [-0.4, 1, 80],
  ];
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={70} ry={12} fill="#c8d3e3" opacity={0.25} />
      <rect x={-5} y={-140} width={10} height={140} fill="#c8d3e3" opacity={0.35} />
      {broken < 0.05 ? (
        <g>
          <clipPath id={`wg-${Math.round(x)}-${Math.round(y)}`}>
            <path d={bowl} />
          </clipPath>
          <rect x={-90} y={-140 - 160 * fill} width={180} height={160 * fill} fill="#5a0a14" clipPath={`url(#wg-${Math.round(x)}-${Math.round(y)})`} />
          <path d={bowl} fill="#c8d3e3" opacity={0.12} />
          <path d={bowl} fill="none" stroke={rim} strokeOpacity={0.55 * lit} strokeWidth={4} />
          <path d="M-52,-280 C-58,-220 -46,-180 -30,-168" stroke="#fff" strokeOpacity={0.4 * lit} strokeWidth={6} fill="none" />
          {lipstick && <path d="M30,-300 C40,-296 52,-296 62,-300" stroke="#8a0c18" strokeWidth={7} strokeLinecap="round" />}
        </g>
      ) : (
        <g>
          {shards.map(([dx, dy, r], i) => (
            <path
              key={i}
              d="M0,-30 L22,10 L-18,20 Z"
              transform={`translate(${dx * 120 * broken},${-220 + dy * 120 * broken + broken * broken * 80}) rotate(${r * broken * 4})`}
              fill="#c8d3e3"
              opacity={0.55 * (1 - broken * 0.4)}
            />
          ))}
          {/* the wine thrown out of the bowl */}
          {Array.from({length: 7}, (_, i) => (
            <circle key={i} cx={Math.cos(i * 0.9) * 140 * broken} cy={-220 + Math.sin(i * 0.9) * 90 * broken + broken * broken * 160} r={14 - i} fill="#5a0a14" opacity={1 - broken * 0.5} />
          ))}
          <path d="M-30,-140 L-40,-190 L-10,-170 L10,-200 L30,-150 Z" fill="#c8d3e3" opacity={0.3} />
        </g>
      )}
    </g>
  );
};

/** An old CRT telly; children draw on the screen in screen-local coords (0..600 x 0..460). */
export const OldTelly: React.FC<{x: number; y: number; s?: number; t: number; children?: React.ReactNode; id: string}> = ({x, y, s = 1, t, children, id}) => {
  const scan = (t * 120) % 460;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-60} y={-60} width={720} height={600} rx={40} fill="#2a2420" />
      <rect x={-60} y={-60} width={720} height={600} rx={40} fill="none" stroke="#ffb45a" strokeOpacity={0.15} strokeWidth={4} />
      <defs>
        <clipPath id={`${id}-scr`}>
          <rect x={0} y={0} width={600} height={460} rx={50} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-scr)`}>
        <rect x={0} y={0} width={600} height={460} fill="#10141c" />
        {children}
        {Array.from({length: 46}, (_, i) => (
          <rect key={i} x={0} y={i * 10} width={600} height={3} fill="#000" opacity={0.18} />
        ))}
        <rect x={0} y={scan} width={600} height={30} fill="#fff" opacity={0.04} />
        <ellipse cx={300} cy={230} rx={420} ry={340} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={120} />
      </g>
      <rect x={-20} y={540} width={640} height={60} fill="#1a1612" />
    </g>
  );
};

/** Her boots, front view, toes towards us. step lifts and sets down the near boot. */
export const Boots: React.FC<{x: number; y: number; s?: number; step?: number; lit?: number}> = ({x, y, s = 1, step = 0, lit = 1}) => {
  const boot = (dx: number, lift: number) => (
    <g transform={`translate(${dx},${-lift})`}>
      <path d="M-60,-420 L60,-420 L66,-80 C110,-60 120,-10 100,0 L-100,0 C-120,-10 -110,-60 -66,-80 Z" fill="#0a0a0d" />
      <path d="M60,-420 L66,-80 C110,-60 120,-10 100,0" stroke="#9fb4cf" strokeOpacity={0.35 * lit} strokeWidth={4} fill="none" />
      <rect x={-104} y={-6} width={208} height={18} rx={6} fill="#050506" />
      {/* lace-up hooks */}
      {Array.from({length: 6}, (_, i) => (
        <circle key={i} cx={0} cy={-380 + i * 52} r={5} fill="#8a8e96" opacity={0.6 * lit} />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={300} ry={30} fill="#000" opacity={0.5} />
      {boot(-120, 0)}
      {boot(120, step * 60)}
    </g>
  );
};
