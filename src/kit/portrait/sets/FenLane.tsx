import React from 'react';
import {noise1, rng} from '../../common/util';

/** A thatched cottage silhouette: low walls, a deep hipped thatch, one dim window, smoke from the roof. */
const Thatch: React.FC<{x: number; y: number; s: number; t: number; lit: number; seed: number}> = ({x, y, s, t, lit, seed}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-120} width={300} height={120} fill="#07090d" />
    <path d="M-190,-110 C-170,-200 -110,-260 -40,-270 L40,-270 C110,-260 170,-200 190,-110 Z" fill="#0b0e14" />
    <path d="M-190,-110 C-170,-200 -110,-260 -40,-270 L40,-270" stroke="#8fa3c0" strokeOpacity={0.25} strokeWidth={4} fill="none" />
    <rect x={-60} y={-84} width={40} height={36} fill="#ffb45a" opacity={0.55 * lit} />
    <g style={{filter: 'blur(10px)'}} opacity={0.35}>
      {[0, 1, 2].map((k) => {
        const life = ((t * 0.25 + k * 0.33 + seed * 0.1) % 1);
        return <circle key={k} cx={20 + noise1(t * 0.5 + k, seed) * 30 * life} cy={-280 - life * 260} r={30 + life * 50} fill="#4a5466" opacity={1 - life} />;
      })}
    </g>
  </g>
);

/**
 * The fen lane at dusk in winter: a flat horizon, mist bands, a church tower, thatched cottages either side of a
 * rutted lane, and the churchyard wall in front with `graves` small fresh mounds and wooden crosses.
 */
export const FenLane: React.FC<{id: string; t: number; graves?: number; bell?: number}> = ({id, t, graves = 3, bell = 0}) => {
  const r = rng(5);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070c" />
          <stop offset="0.55" stopColor="#141c2c" />
          <stop offset="1" stopColor="#3a4458" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-600} width={1880} height={1800} fill={`url(#${id}-sky)`} />
      {/* a low winter moon behind haze */}
      <circle cx={820} cy={520} r={44} fill="#c8d0dc" opacity={0.6} />
      <circle cx={820} cy={520} r={120} fill="#8fa3c0" opacity={0.08} />
      {/* the church tower, far off */}
      <g transform="translate(250,900)">
        <rect x={-60} y={-360} width={120} height={360} fill="#06080c" />
        {[-60, -30, 0, 30].map((bx) => (
          <rect key={bx} x={bx} y={-390} width={22} height={34} fill="#06080c" />
        ))}
        <path d="M-14,-300 L-14,-250 L14,-250 L14,-300 Q0,-318 -14,-300 Z" fill="#1a2232" opacity={0.6 + bell * 0.4} />
        <path d="M60,-360 L60,0" stroke="#8fa3c0" strokeOpacity={0.2} strokeWidth={3} />
      </g>
      {/* flat land and mist */}
      <rect x={-400} y={900} width={1880} height={1200} fill="#05070a" />
      {[880, 960, 1060].map((my, i) => (
        <g key={i} style={{filter: 'blur(22px)'}} opacity={0.35 - i * 0.07}>
          <rect x={-400 + noise1(t * 0.2, i) * 80} y={my} width={1900} height={50} fill="#8fa3c0" />
        </g>
      ))}
      {/* cottages along the lane */}
      <Thatch x={-60} y={1060} s={1.1} t={t} lit={0.8} seed={1} />
      <Thatch x={300} y={980} s={0.6} t={t} lit={0} seed={2} />
      <Thatch x={760} y={990} s={0.65} t={t} lit={0.5} seed={3} />
      <Thatch x={1120} y={1080} s={1.2} t={t} lit={0} seed={4} />
      {/* the rutted lane */}
      <path d="M440,960 L640,960 L1000,2000 L80,2000 Z" fill="#0b0d12" />
      <path d="M500,970 L300,2000 M580,970 L780,2000" stroke="#1a2232" strokeWidth={10} />
      {/* churchyard wall and the small new graves */}
      <rect x={-400} y={1300} width={1880} height={40} fill="#0d1016" />
      <path d="M-400,1300 L1480,1300" stroke="#8fa3c0" strokeOpacity={0.25} strokeWidth={3} />
      <rect x={-400} y={1340} width={1880} height={800} fill="#06080b" />
      {Array.from({length: graves}, (_, i) => {
        const gx = 200 + i * 300 + (r() - 0.5) * 40;
        const lean = (r() - 0.5) * 10;
        return (
          <g key={i}>
            <ellipse cx={gx} cy={1560} rx={110} ry={30} fill="#2a2420" />
            <path d={`M${gx - 110},1560 C${gx - 60},1530 ${gx + 60},1530 ${gx + 110},1560`} stroke="#8fa3c0" strokeOpacity={0.2} strokeWidth={3} fill="none" />
            <g transform={`rotate(${lean},${gx},1560)`}>
              <rect x={gx - 7} y={1420} width={14} height={140} fill="#2a2018" />
              <rect x={gx - 40} y={1450} width={80} height={12} fill="#2a2018" />
              <path d={`M${gx + 7},1420 L${gx + 7},1560 M${gx - 40},1450 L${gx + 40},1450`} stroke="#8fa3c0" strokeOpacity={0.65} strokeWidth={3} />
            </g>
          </g>
        );
      })}
    </g>
  );
};
