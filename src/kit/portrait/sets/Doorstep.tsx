import React from 'react';
import {GothicDoor} from '../../common/art/Door';
import {HousePlate} from '../../common/art/Charms';
import {rng} from '../../common/util';

export const STEP = {cx: 540, yb: 1500, w: 560, h: 1160};

/** A warm hallway seen through an open front door: lamplight, a runner, the foot of the stairs, a coat hook. */
export const WarmHall: React.FC<{id: string; glow?: number}> = ({id, glow = 1}) => (
  <g>
    <defs>
      <radialGradient id={`${id}-hall`} cx="0.5" cy="0.4" r="0.75">
        <stop offset="0" stopColor="#ffb45a" stopOpacity={0.55 * glow} />
        <stop offset="1" stopColor="#2a1508" stopOpacity={0.9} />
      </radialGradient>
    </defs>
    <rect x={200} y={300} width={680} height={1220} fill="#120904" />
    <rect x={200} y={300} width={680} height={1220} fill={`url(#${id}-hall)`} />
    {/* hall floor and runner in perspective */}
    <path d="M200,1500 L420,1150 L660,1150 L880,1500 Z" fill="#2a1508" />
    <path d="M330,1500 L470,1150 L610,1150 L750,1500 Z" fill="#5a1c1c" opacity={0.85} />
    <path d="M200,1150 L880,1150" stroke="#ffcf9a" strokeOpacity={0.15 * glow} strokeWidth={3} />
    {/* the foot of the stairs on the right, a coat hook on the left */}
    {Array.from({length: 6}, (_, i) => (
      <rect key={i} x={640 + i * 18} y={1150 - i * 70} width={240} height={14} fill="#1a0c05" />
    ))}
    <path d="M640,1150 L760,730" stroke="#1a0c05" strokeWidth={12} />
    <rect x={300} y={760} width={14} height={60} fill="#1a0c05" />
    <path d="M300,780 C250,800 240,940 270,1010 L350,1010 C370,940 360,800 314,780 Z" fill="#100804" />
  </g>
);

/**
 * Standing on your own front step at night, facing the door: stone facade, the house number,
 * a stone step, the oak door (open swings it in), and `beyond` drawn in the doorway (default: WarmHall).
 * children are drawn in front (your hands, the threshold, things on the step).
 */
export const Doorstep: React.FC<{
  id: string;
  t: number;
  open?: number;
  knock?: number;
  number?: string;
  beyond?: React.ReactNode;
  children?: React.ReactNode;
}> = ({id, t, open = 0, knock = 0, number = '2', beyond, children}) => {
  const r = rng(77);
  return (
    <g>
      <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0c10" />
      {/* coursed stone */}
      {Array.from({length: 12}, (_, row) =>
        Array.from({length: 7}, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={-420 + col * 300 + (row % 2) * 150 + (r() - 0.5) * 20}
            y={-560 + row * 180}
            width={290}
            height={170}
            fill={r() < 0.5 ? '#0d1016' : '#0b0d12'}
            stroke="#000"
            strokeWidth={6}
          />
        )),
      )}
      {/* moonlight down the facade from the upper right */}
      <path d="M1100,-600 L1480,-600 L1480,2100 L700,2100 Z" fill="#6f86a6" opacity={0.05} />
      <GothicDoor
        id={`${id}-door`}
        cx={STEP.cx}
        yb={STEP.yb}
        w={STEP.w}
        h={STEP.h}
        t={t}
        light="night"
        open={open}
        knock={knock}
        under={open > 0.02 ? 0 : 0.5}
        underColor="#ffb45a"
        beyond={beyond ?? <WarmHall id={`${id}-hall`} />}
      />
      {/* warm spill out of the doorway onto the step */}
      <path d={`M${STEP.cx - 260},${STEP.yb} L${STEP.cx + 260},${STEP.yb} L${STEP.cx + 520},${STEP.yb + 420} L${STEP.cx - 520},${STEP.yb + 420} Z`} fill="#ffb45a" opacity={0.1 * Math.min(1, open * 2)} />
      {/* stone step */}
      <path d={`M-400,${STEP.yb} L1480,${STEP.yb} L1480,${STEP.yb + 60} L-400,${STEP.yb + 60} Z`} fill="#1c2028" />
      <path d={`M-400,${STEP.yb} L1480,${STEP.yb}`} stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={3} />
      <rect x={-400} y={STEP.yb + 60} width={1880} height={700} fill="#07090c" />
      <HousePlate x={STEP.cx + 420} y={STEP.yb - 760} s={1.2} n={number} />
      {children}
    </g>
  );
};
