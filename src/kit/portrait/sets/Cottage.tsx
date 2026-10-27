import React from 'react';
import {fireFlicker, HearthFire, Rushlight} from '../../common/art/Period';
import {lerpColor, noise1, rng} from '../../common/util';

const FIRE = '#ffb45a';

/** Wattle-and-daub wall between dark timber posts; cracked plaster shows the woven withies. warm = firelit. */
export const DaubWall: React.FC<{id: string; x: number; y: number; w: number; h: number; t: number; warm?: number; lit?: number}> = ({id, x, y, w, h, t, warm = 1, lit = 1}) => {
  const r = rng(91);
  const fl = fireFlicker(t, 2);
  const plaster = lerpColor('#1c1a1a', '#3a2a18', warm);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor={FIRE} stopOpacity={0.22 * warm * fl * lit} />
          <stop offset="1" stopColor={FIRE} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={plaster} />
      {/* uneven daub */}
      {Array.from({length: 40}, (_, i) => (
        <ellipse key={i} cx={x + r() * w} cy={y + r() * h} rx={30 + r() * 90} ry={20 + r() * 50} fill="#000" opacity={0.06 + r() * 0.08} />
      ))}
      {/* cracks with the wattle showing through */}
      {Array.from({length: 5}, (_, i) => {
        const cx = x + 120 + r() * (w - 240), cy = y + 400 + r() * (h - 800);
        return (
          <g key={i}>
            <path d={`M${cx - 60},${cy} Q${cx},${cy - 30} ${cx + 70},${cy + 10} Q${cx + 10},${cy + 40} ${cx - 60},${cy} Z`} fill="#120a04" />
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${cx - 50},${cy - 4 + k * 8} Q${cx},${cy - 20 + k * 10} ${cx + 60},${cy + 4 + k * 6}`} stroke="#3a2412" strokeWidth={4} fill="none" />
            ))}
          </g>
        );
      })}
      {/* timber frame */}
      {[x + 40, x + w * 0.5 - 30, x + w - 100].map((px, i) => (
        <rect key={i} x={px} y={y} width={60} height={h} fill="#120a05" />
      ))}
      <rect x={x} y={y + h * 0.42} width={w} height={44} fill="#120a05" />
      <path d={`M${x + w * 0.5 + 30},${y} L${x + w * 0.5 + 30},${y + h}`} stroke={FIRE} strokeOpacity={0.2 * warm * lit} strokeWidth={3} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-glow)`} />
    </g>
  );
};

/** Smoke-blackened rafters with smoke hanging under the thatch (no chimney). */
export const SmokyRafters: React.FC<{y: number; t: number; smoke?: number}> = ({y, t, smoke = 1}) => (
  <g>
    <rect x={-400} y={y - 900} width={1880} height={900} fill="#070504" />
    {Array.from({length: 6}, (_, i) => (
      <path key={i} d={`M${-400 + i * 360},${y - 900} L${-200 + i * 300},${y}`} stroke="#140c06" strokeWidth={34} />
    ))}
    <rect x={-400} y={y - 30} width={1880} height={50} fill="#140c06" />
    <g style={{filter: 'blur(30px)'}} opacity={Math.min(1, 0.55 * smoke)}>
      {Array.from({length: 7}, (_, i) => (
        <ellipse key={i} cx={-300 + ((i * 330 + t * 30) % 1900)} cy={y - 140 - (i % 3) * 140 + noise1(t * 0.3, i) * 60} rx={380} ry={100} fill="#8a6a4a" />
      ))}
    </g>
  </g>
);

export const HEARTH = {cx: 540, y: 1400};

/**
 * Inside the cottage, facing the hearth wall: daub wall, rafters and smoke, an open fire on a stone hearth with a
 * plaster smoke hood, a shelf (right) and the rushlight (left). children drawn in front (the jug in the embers, hands).
 */
export const CottageHearth: React.FC<{id: string; t: number; fire?: number; shelf?: React.ReactNode; children?: React.ReactNode}> = ({id, t, fire = 1, shelf, children}) => {
  const fl = fireFlicker(t, 6);
  return (
    <g>
      <DaubWall id={`${id}-wall`} x={-400} y={-200} w={1880} h={1800} t={t} />
      <SmokyRafters y={-160} t={t} />
      {/* smoke hood over the hearth */}
      <path d={`M${HEARTH.cx - 380},${HEARTH.y - 560} L${HEARTH.cx + 380},${HEARTH.y - 560} L${HEARTH.cx + 260},-160 L${HEARTH.cx - 260},-160 Z`} fill="#1a120a" />
      <path d={`M${HEARTH.cx - 400},${HEARTH.y - 580} L${HEARTH.cx + 400},${HEARTH.y - 580} L${HEARTH.cx + 400},${HEARTH.y - 540} L${HEARTH.cx - 400},${HEARTH.y - 540} Z`} fill="#0e0804" />
      <path d={`M${HEARTH.cx - 400},${HEARTH.y - 540} L${HEARTH.cx + 400},${HEARTH.y - 540}`} stroke={FIRE} strokeOpacity={0.5 * fl * fire} strokeWidth={4} />
      {/* soot-black back of the hearth */}
      <path d={`M${HEARTH.cx - 360},${HEARTH.y} L${HEARTH.cx - 360},${HEARTH.y - 540} L${HEARTH.cx + 360},${HEARTH.y - 540} L${HEARTH.cx + 360},${HEARTH.y} Z`} fill="#0a0604" />
      <ellipse cx={HEARTH.cx} cy={HEARTH.y - 120} rx={420} ry={360} fill={FIRE} opacity={0.18 * fl * fire} />
      {/* shelf on the right with crocks */}
      <rect x={960} y={760} width={420} height={22} fill="#1a1008" />
      <path d="M960,760 L1380,760" stroke={FIRE} strokeOpacity={0.4 * fl} strokeWidth={3} />
      <path d="M1000,760 C990,700 1010,660 1040,650 C1070,660 1090,700 1080,760 Z" fill="#2a1a10" />
      <path d="M1250,760 L1240,690 L1320,690 L1310,760 Z" fill="#241610" />
      {shelf}
      {/* stone hearth floor and the fire */}
      <path d={`M${HEARTH.cx - 440},${HEARTH.y} L${HEARTH.cx + 440},${HEARTH.y} L${HEARTH.cx + 520},${HEARTH.y + 120} L${HEARTH.cx - 520},${HEARTH.y + 120} Z`} fill="#2a2420" />
      <path d={`M${HEARTH.cx - 440},${HEARTH.y} L${HEARTH.cx + 440},${HEARTH.y}`} stroke={FIRE} strokeOpacity={0.5 * fl} strokeWidth={3} />
      <rect x={-400} y={HEARTH.y + 120} width={1880} height={800} fill="#100a06" />
      {/* rushes on the floor */}
      {Array.from({length: 40}, (_, i) => {
        const rr = rng(200 + i);
        const fx = -380 + rr() * 1840, fy = HEARTH.y + 140 + rr() * 500;
        return <path key={i} d={`M${fx},${fy} l${60 + rr() * 60},${(rr() - 0.5) * 20}`} stroke="#3a2c14" strokeWidth={3} opacity={0.6} />;
      })}
      {fire > 0 && <HearthFire x={HEARTH.cx} y={HEARTH.y - 10} t={t} size={fire} />}
      <Rushlight x={60} y={1080} s={1.1} t={t} />
      {children}
    </g>
  );
};

export const PLANK = {x: 330, y: 480, w: 420, h: 1020};

/**
 * Facing the cottage door from inside: daub wall, a plank door with a wooden drop-latch (latch 0 down .. 1 lifted),
 * open 0..1 swings it inward on the left hinge; `beyond` is drawn in the gap (night fog by default).
 */
export const PlankDoor: React.FC<{id: string; t: number; open?: number; latch?: number; knock?: number; beyond?: React.ReactNode; children?: React.ReactNode}> = ({
  id,
  t,
  open = 0,
  latch = 0,
  knock = 0,
  beyond,
  children,
}) => {
  const fl = fireFlicker(t, 8);
  const {x, y, w, h} = PLANK;
  const jolt = knock * Math.sin(t * 90) * 4;
  const leafW = w * Math.cos(open * 1.25);
  return (
    <g>
      <DaubWall id={`${id}-wall`} x={-400} y={-200} w={1880} h={2000} t={t} warm={0.7} />
      <SmokyRafters y={-160} t={t} smoke={0.6} />
      {/* the doorway: night outside */}
      <rect x={x} y={y} width={w} height={h} fill="#05070b" />
      {beyond ?? (
        <g>
          <rect x={x} y={y} width={w} height={h} fill="#1a2232" opacity={0.6} />
          <g style={{filter: 'blur(14px)'}} opacity={0.5}>
            <ellipse cx={x + w / 2 + noise1(t * 0.3, 2) * 60} cy={y + h * 0.75} rx={260} ry={60} fill="#8fa3c0" />
          </g>
        </g>
      )}
      {/* frame */}
      <rect x={x - 40} y={y - 40} width={w + 80} height={40} fill="#120a05" />
      <rect x={x - 40} y={y} width={40} height={h} fill="#120a05" />
      <rect x={x + w} y={y} width={40} height={h} fill="#120a05" />
      {/* the leaf: vertical planks, two ledges, the latch on the right */}
      <g transform={`translate(${jolt},0)`}>
        <g transform={`translate(${x},0) scale(${leafW / w},1) translate(${-x},0)`}>
          {Array.from({length: 5}, (_, i) => (
            <rect key={i} x={x + i * (w / 5)} y={y} width={w / 5 - 4} height={h} fill={i % 2 ? '#2a1a0e' : '#26170c'} />
          ))}
          <rect x={x} y={y + 160} width={w} height={44} fill="#1a1008" />
          <rect x={x} y={y + h - 220} width={w} height={44} fill="#1a1008" />
          <path d={`M${x},${y + 160} L${x + w},${y + 160}`} stroke={FIRE} strokeOpacity={0.35 * fl} strokeWidth={3} />
          {/* wooden drop-latch: a bar pivoting on the leaf, dropping into a keeper on the frame */}
          <g transform={`rotate(${-latch * 24},${x + w - 160},${y + 520})`}>
            <rect x={x + w - 170} y={y + 508} width={200} height={26} rx={6} fill="#3a2614" />
            <path d={`M${x + w - 170},${y + 508} L${x + w + 30},${y + 508}`} stroke={FIRE} strokeOpacity={0.5 * fl} strokeWidth={3} />
          </g>
          <circle cx={x + w - 160} cy={y + 521} r={9} fill="#120a05" />
        </g>
      </g>
      <rect x={x + w} y={y + 498} width={40} height={50} fill="#1a1008" />
      {/* threshold */}
      <rect x={x - 60} y={y + h} width={w + 120} height={30} fill="#2a2420" />
      <rect x={-400} y={y + h + 30} width={1880} height={600} fill="#100a06" />
      {children}
    </g>
  );
};
