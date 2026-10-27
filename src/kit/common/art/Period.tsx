import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* Seventeenth-century village props: the bearded stoneware jug (a witch bottle), bent pins, iron nails, a lock of hair,
   a bone comb, a rushlight, a hooded cradle, a pig behind a wattle hurdle, an open hearth fire. Firelight vocabulary:
   warm rims #ffb45a, everything else falls to black. */

const FIRE = '#ffb45a';

/** A flickering fire value 0.75..1 for anything lit by the hearth. */
export const fireFlicker = (t: number, seed = 1) => 0.82 + noise1(t * 7, seed) * 0.12 + noise1(t * 19, seed + 5) * 0.06;

/**
 * Salt-glazed stoneware jug with a bearded face on the neck (a "bellarmine"), the classic witch bottle.
 * Origin at the centre of the belly; ~460 tall at s = 1. heat 0..1 glows the base red from the embers;
 * hiss 0..1 sends steam from the cork; lit = firelight on the right edge.
 */
export const Bellarmine: React.FC<{x: number; y: number; s?: number; rot?: number; t: number; lit?: number; heat?: number; hiss?: number; cork?: boolean; id: string}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  t,
  lit = 1,
  heat = 0,
  hiss = 0,
  cork = true,
  id,
}) => {
  const r = rng(77);
  const fl = fireFlicker(t, 3);
  const body = 'M-46,-250 L-46,-200 C-60,-180 -150,-140 -160,-40 C-170,60 -140,150 -80,190 L-90,214 L90,214 L80,190 C140,150 170,60 160,-40 C150,-140 60,-180 46,-200 L46,-250 Z';
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-glaze`} cx="0.62" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#8a5a2a" />
          <stop offset="0.5" stopColor="#5a3818" />
          <stop offset="1" stopColor="#1e1208" />
        </radialGradient>
        <linearGradient id={`${id}-heat`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff5a1a" stopOpacity={0.85 * heat} />
          <stop offset="0.35" stopColor="#c43a10" stopOpacity={0.35 * heat} />
          <stop offset="0.6" stopColor="#c43a10" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
        </clipPath>
      </defs>
      {/* handle */}
      <path d="M46,-226 C120,-226 150,-170 130,-110" stroke="#3a2412" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M50,-236 C126,-236 162,-174 142,-110" stroke={FIRE} strokeOpacity={0.35 * lit * fl} strokeWidth={4} fill="none" />
      <path d={body} fill={`url(#${id}-glaze)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* tiger-skin mottling of the salt glaze */}
        {Array.from({length: 70}, (_, i) => (
          <ellipse key={i} cx={-160 + r() * 320} cy={-240 + r() * 450} rx={3 + r() * 9} ry={2 + r() * 5} fill="#1a0e06" opacity={0.25 + r() * 0.3} />
        ))}
        {/* the round medallion on the belly */}
        <circle cx={0} cy={70} r={46} fill="none" stroke="#2a1a0c" strokeWidth={6} />
        <circle cx={0} cy={70} r={30} fill="none" stroke="#2a1a0c" strokeWidth={3} />
        <path d="M-14,56 L14,56 L0,92 Z" fill="#2a1a0c" />
        {/* the bearded face on the neck: heavy brows, staring eyes, broad nose, moustache, beard flowing onto the belly */}
        <g fill="#2a1608" stroke="#120a04" strokeWidth={2}>
          <path d="M-40,-236 C-26,-246 -8,-244 -2,-234 C-14,-232 -28,-230 -40,-226 Z" />
          <path d="M40,-236 C26,-246 8,-244 2,-234 C14,-232 28,-230 40,-226 Z" />
          <circle cx={-20} cy={-222} r={7} fill="#0e0804" />
          <circle cx={20} cy={-222} r={7} fill="#0e0804" />
          <path d="M-6,-232 L-12,-200 C-6,-194 6,-194 12,-200 L6,-232 Z" />
          <path d="M-12,-196 C-30,-196 -48,-186 -56,-170 C-40,-178 -20,-182 0,-184 C20,-182 40,-178 56,-170 C48,-186 30,-196 12,-196 Z" />
          <path d="M-40,-178 C-60,-140 -56,-90 -34,-54 C-26,-80 -20,-110 -14,-140 C-8,-100 -4,-70 0,-40 C4,-70 8,-100 14,-140 C20,-110 26,-80 34,-54 C56,-90 60,-140 40,-178 C20,-170 -20,-170 -40,-178 Z" />
        </g>
        {[-30, -16, 0, 16, 30].map((bx) => (
          <path key={bx} d={`M${bx},-168 C${bx * 1.2},-130 ${bx * 1.1},-100 ${bx * 0.9},-66`} stroke="#120a04" strokeWidth={2} fill="none" />
        ))}
        <circle cx={-20} cy={-224} r={2} fill={FIRE} opacity={0.7 * lit * fl} />
        <circle cx={20} cy={-224} r={2} fill={FIRE} opacity={0.7 * lit * fl} />
        {/* ember heat climbing the base */}
        <rect x={-170} y={-260} width={340} height={480} fill={`url(#${id}-heat)`} />
      </g>
      {/* firelit rim on the right edge and the glaze shine */}
      <path d="M46,-200 C60,-180 150,-140 160,-40 C170,60 140,150 80,190" stroke={FIRE} strokeOpacity={0.55 * lit * fl} strokeWidth={5} fill="none" />
      <ellipse cx={70} cy={-60} rx={18} ry={46} fill="#ffd9a8" opacity={0.12 * lit} transform="rotate(20,70,-60)" />
      {/* lip and cork */}
      <rect x={-54} y={-268} width={108} height={22} rx={8} fill="#4a2e14" />
      {cork ? (
        <g>
          <path d="M-34,-268 L-30,-300 L30,-300 L34,-268 Z" fill="#6a4a2a" />
          <path d="M30,-300 L34,-268" stroke={FIRE} strokeOpacity={0.4 * lit} strokeWidth={3} />
        </g>
      ) : (
        <ellipse cx={0} cy={-266} rx={36} ry={9} fill="#080402" />
      )}
      {/* steam hissing from the cork */}
      {hiss > 0.01 && (
        <g opacity={hiss} style={{filter: 'blur(5px)'}}>
          {Array.from({length: 6}, (_, i) => {
            const life = ((t * 1.4 + i * 0.37) % 1.2) / 1.2;
            const dx = noise1(t * 2 + i, 40 + i) * 50 * life;
            return <path key={i} d={`M${-10 + i * 4},-302 C${dx * 0.3},-340 ${-dx},${-380 - life * 60} ${dx},${-420 - life * 140}`} stroke="#e8e0d4" strokeOpacity={0.4 * (1 - life)} strokeWidth={10 + life * 20} fill="none" strokeLinecap="round" />;
          })}
        </g>
      )}
    </g>
  );
};

/** A dress pin bent in two (brass, a round head). */
export const BentPin: React.FC<{x: number; y: number; s?: number; rot?: number; bend?: number; lit?: number}> = ({x, y, s = 1, rot = 0, bend = 50, lit = 1}) => {
  const a = (bend * Math.PI) / 180;
  const ex = 60 * Math.cos(a), ey = -60 * Math.sin(a);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M-60,0 L0,0 L${ex},${ey}`} stroke="#b89a52" strokeWidth={4} fill="none" strokeLinejoin="round" />
      <path d={`M-60,-1 L0,-1 L${ex},${ey - 1}`} stroke="#ffe6a8" strokeOpacity={0.5 * lit} strokeWidth={1.5} fill="none" />
      <circle cx={-62} cy={0} r={6} fill="#c8a860" />
    </g>
  );
};

/** A hand-forged iron nail with a square head. */
export const IronNail: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number}> = ({x, y, s = 1, rot = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-70,-6 L60,-3 L80,0 L60,3 L-70,6 Z" fill="#2a2420" />
    <rect x={-84} y={-14} width={16} height={28} fill="#3a322c" />
    <path d="M-70,-5 L60,-2" stroke={FIRE} strokeOpacity={0.35 * lit} strokeWidth={2} />
  </g>
);

/** A lock of hair tied with thread (baby-fine and light, or long and grey). */
export const HairLock: React.FC<{x: number; y: number; s?: number; rot?: number; color?: string; long?: boolean; t?: number; lit?: number}> = ({x, y, s = 1, rot = 0, color = '#d8b070', long = false, t = 0, lit = 1}) => {
  const L = long ? 420 : 110;
  const sway = Math.sin(t * 2) * (long ? 18 : 4);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {Array.from({length: long ? 3 : 9}, (_, i) => {
        const o = (i - (long ? 1 : 4)) * (long ? 2 : 4);
        return (
          <path key={i} d={`M${o},0 C${o + 20 + sway * 0.3},${L * 0.3} ${o - 26 + sway},${L * 0.6} ${o + 10 + sway},${L}`} stroke={color} strokeOpacity={0.85} strokeWidth={long ? 2 : 2.5} fill="none" />
        );
      })}
      {!long && <path d="M-14,10 L14,10" stroke="#8a1a12" strokeWidth={4} />}
      <path d={`M2,0 C22,${L * 0.3} -24,${L * 0.6} 12,${L}`} stroke="#fff" strokeOpacity={0.3 * lit} strokeWidth={1} fill="none" />
    </g>
  );
};

/** A bone comb, teeth down. */
export const BoneComb: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number}> = ({x, y, s = 1, rot = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-110,-30 C-60,-44 60,-44 110,-30 L110,0 L-110,0 Z" fill="#d8ccb0" />
    {Array.from({length: 22}, (_, i) => (
      <rect key={i} x={-108 + i * 10} y={0} width={6} height={56} fill="#c8bc9e" />
    ))}
    <path d="M-110,-30 C-60,-44 60,-44 110,-30" stroke={FIRE} strokeOpacity={0.6 * lit} strokeWidth={3} fill="none" />
    <path d="M-90,-14 L90,-14" stroke="#8a7a5a" strokeWidth={2} />
  </g>
);

/** Rushlight: a peeled rush dipped in fat, clamped in an iron stand, burning at an angle. */
export const Rushlight: React.FC<{x: number; y: number; s?: number; t: number; glow?: number}> = ({x, y, s = 1, t, glow = 1}) => {
  const fl = fireFlicker(t, 9);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={-60} cy={-170} rx={240 * glow} ry={240 * glow} fill={FIRE} opacity={0.12 * fl} />
      <path d="M-40,0 L40,0 L20,-20 L-20,-20 Z" fill="#1a1410" />
      <rect x={-4} y={-150} width={8} height={130} fill="#1a1410" />
      <path d="M0,-150 L-30,-170 M0,-150 L-26,-158" stroke="#1a1410" strokeWidth={6} />
      <path d="M-24,-164 L-110,-200" stroke="#8a7a50" strokeWidth={5} />
      <g transform={`translate(-112,-202) scale(${0.9 + fl * 0.2})`}>
        <path d="M0,0 C-10,-14 -6,-34 4,-46 C10,-32 14,-14 6,0 Z" fill="#ffd27a" />
        <path d="M1,-2 C-3,-10 -1,-20 3,-26 C6,-18 6,-8 4,-2 Z" fill="#fff4d0" />
      </g>
      <path d="M-4,-150 L-4,-20" stroke={FIRE} strokeOpacity={0.4 * fl} strokeWidth={2} />
    </g>
  );
};

/** A hooded wooden cradle on rockers, three-quarter view; a swaddled bundle inside. rock: degrees. */
export const Cradle: React.FC<{x: number; y: number; s?: number; rock?: number; lit?: number; t: number}> = ({x, y, s = 1, rock = 0, lit = 1, t}) => {
  const fl = fireFlicker(t, 4);
  const breathe = Math.sin(t * 2.4) * 2;
  return (
    <g transform={`translate(${x},${y}) rotate(${rock}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={260} ry={22} fill="#000" opacity={0.5} />
      {/* rockers */}
      <path d="M-260,-10 C-160,30 160,30 260,-10" stroke="#2a1a0e" strokeWidth={22} fill="none" strokeLinecap="round" />
      {/* box */}
      <path d="M-220,-30 L220,-30 L240,-220 L-240,-220 Z" fill="#3a2414" />
      <path d="M-240,-220 L240,-220" stroke={FIRE} strokeOpacity={0.5 * lit * fl} strokeWidth={4} />
      {[-120, 0, 120].map((px) => (
        <path key={px} d={`M${px},-34 L${px * 1.06},-216`} stroke="#22140a" strokeWidth={4} />
      ))}
      {/* the swaddled bundle */}
      <path d={`M-120,-216 C-120,${-262 + breathe} 40,${-272 + breathe} 120,-236 L120,-216 Z`} fill="#b8ac94" />
      <circle cx={-118} cy={-238 + breathe} r={30} fill="#d8b49a" />
      <path d="M-150,-240 C-150,-280 -90,-286 -84,-246" fill="#a89c84" />
      <path d={`M-120,-216 C-120,${-262 + breathe} 40,${-272 + breathe} 120,-236`} stroke={FIRE} strokeOpacity={0.35 * lit} strokeWidth={3} fill="none" />
      {/* hood */}
      <path d="M-240,-220 C-260,-360 -180,-420 -60,-420 L-40,-220 Z" fill="#2e1c10" />
      <path d="M-60,-420 L-40,-220" stroke={FIRE} strokeOpacity={0.45 * lit * fl} strokeWidth={4} />
    </g>
  );
};

/** A pig in profile behind a woven wattle hurdle (only its back, head and ears show). */
export const PigHurdle: React.FC<{x: number; y: number; s?: number; t: number; lit?: number}> = ({x, y, s = 1, t, lit = 1}) => {
  const nod = Math.sin(t * 1.3) * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`translate(0,${nod * 0.5})`}>
        <path d={`M-260,-80 C-250,-200 -60,-230 120,-200 C180,-190 220,-170 250,-140 L300,-136 C312,-120 310,-96 296,-90 L250,-88 C200,-70 0,-60 -260,-80 Z`} fill="#0d0907" />
        <path d={`M182,-188 L170,-250 L214,-196 Z`} fill="#0d0907" />
        <path d="M-260,-80 C-250,-200 -60,-230 120,-200 C180,-190 220,-170 250,-140 L300,-136" stroke={FIRE} strokeOpacity={0.4 * lit} strokeWidth={3} fill="none" />
        <circle cx={232} cy={-150} r={4} fill={FIRE} opacity={0.8 * lit} />
        <ellipse cx={304} cy={-112} rx={6} ry={14} fill="#2a1a14" />
      </g>
      {/* the hurdle: stakes with withies woven between */}
      {Array.from({length: 9}, (_, i) => (
        <rect key={i} x={-320 + i * 80} y={-150} width={12} height={180} fill="#1a120a" />
      ))}
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M-330,${-130 + i * 26} ${Array.from({length: 9}, (_, k) => `Q${-280 + k * 80},${-130 + i * 26 + ((k + i) % 2 ? 10 : -10)} ${-240 + k * 80},${-130 + i * 26}`).join(' ')}`} stroke="#2a1c10" strokeWidth={14} fill="none" />
      ))}
      <path d="M-330,-136 L400,-136" stroke={FIRE} strokeOpacity={0.25 * lit} strokeWidth={3} />
    </g>
  );
};

/** Open hearth fire: logs, flames and a bed of embers. Origin at the centre of the ember bed. */
export const HearthFire: React.FC<{x: number; y: number; s?: number; t: number; size?: number}> = ({x, y, s = 1, t, size = 1}) => {
  const r = rng(13);
  const embers = Array.from({length: 26}, () => [(r() - 0.5) * 360, (r() - 0.5) * 40, 6 + r() * 12, r() * 6]);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={240} ry={44} fill="#2a0e04" />
      {embers.map(([ex, ey, er, ph], i) => (
        <circle key={i} cx={ex} cy={ey} r={er} fill={lerpColor('#ff4a10', '#ffc060', 0.5 + 0.5 * Math.sin(t * 3 + ph))} opacity={0.75} />
      ))}
      <path d="M-200,-10 L180,-40" stroke="#120804" strokeWidth={36} strokeLinecap="round" />
      <path d="M-160,-40 L210,0" stroke="#160a04" strokeWidth={32} strokeLinecap="round" />
      {Array.from({length: 7}, (_, i) => {
        const fx = -150 + i * 50;
        const h = (110 + noise1(t * 4 + i, 50 + i) * 50 + (i % 3) * 30) * size;
        const lean = noise1(t * 3 + i * 2, 70 + i) * 30;
        return (
          <g key={i} style={{mixBlendMode: 'screen'}}>
            <path d={`M${fx - 28},-20 C${fx - 30},${-h * 0.5} ${fx + lean},${-h * 0.8} ${fx + lean * 1.4},${-h} C${fx + 20},${-h * 0.6} ${fx + 34},${-h * 0.3} ${fx + 28},-20 Z`} fill="#ff7a20" opacity={0.75} />
            <path d={`M${fx - 14},-20 C${fx - 14},${-h * 0.4} ${fx + lean * 0.5},${-h * 0.6} ${fx + lean * 0.8},${-h * 0.75} C${fx + 10},${-h * 0.4} ${fx + 16},${-h * 0.2} ${fx + 14},-20 Z`} fill="#ffd27a" opacity={0.85} />
          </g>
        );
      })}
    </g>
  );
};
