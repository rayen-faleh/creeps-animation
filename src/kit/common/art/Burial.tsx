import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* Anti-vampire burial props after the 17th-century Pień grave (Poland): a sickle laid across the throat and a padlock on
   the big toe. Plus the sleeper they were laid on, a coffin, a kitchen drawer, a bare foot and soil footprints. */

/** A sickle: a crescent iron blade on a short wooden handle. Origin at the join; blade curves up and right. */
export const Sickle: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number; warm?: number; glint?: number}> = ({x, y, s = 1, rot = 0, lit = 1, warm = 1, glint = 0}) => {
  const rim = lerpColor('#c8d3e3', '#ffd9a8', warm);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {/* handle */}
      <path d="M-200,14 L0,4 L0,-14 L-200,-10 C-214,-8 -214,12 -200,14 Z" fill="#5a3a1e" />
      <path d="M-200,-10 L0,-14" stroke={rim} strokeOpacity={0.3 * lit} strokeWidth={2} />
      <rect x={-6} y={-18} width={20} height={36} rx={4} fill="#2a2a2e" />
      {/* the crescent blade */}
      <path d="M10,-6 C120,-40 250,-10 300,90 C320,140 300,200 260,230 C280,170 270,110 230,60 C180,10 100,6 10,10 Z" fill="#3a3c42" />
      <path d="M10,-6 C120,-40 250,-10 300,90 C320,140 300,200 260,230" stroke={rim} strokeOpacity={0.75 * lit} strokeWidth={4} fill="none" />
      <path d="M30,4 C110,0 190,20 236,70" stroke="#14161a" strokeWidth={3} fill="none" opacity={0.6} />
      {glint > 0 && <circle cx={240} cy={40} r={22} fill="#fff" opacity={glint} style={{filter: 'blur(5px)'}} />}
    </g>
  );
};

/** A small iron padlock. shackle 0 = closed, 1 = sprung open. Origin at the body's centre. */
export const Padlock: React.FC<{x: number; y: number; s?: number; rot?: number; shackle?: number; lit?: number; warm?: number}> = ({x, y, s = 1, rot = 0, shackle = 0, lit = 1, warm = 1}) => {
  const rim = lerpColor('#c8d3e3', '#ffd9a8', warm);
  const lift = shackle * 26;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <g transform={`translate(0,${-lift}) rotate(${shackle * -25},22,-30)`}>
        <path d="M-22,-24 L-22,-52 C-22,-86 22,-86 22,-52 L22,-24" stroke="#2a2a2e" strokeWidth={12} fill="none" />
        <path d="M-22,-52 C-22,-86 22,-86 22,-52" stroke={rim} strokeOpacity={0.5 * lit} strokeWidth={2} fill="none" />
      </g>
      <path d="M-40,-30 L40,-30 L44,40 C30,52 -30,52 -44,40 Z" fill="#3a3a40" />
      <path d="M-40,-30 L40,-30 L44,40" stroke={rim} strokeOpacity={0.45 * lit} strokeWidth={3} fill="none" />
      <circle cx={0} cy={4} r={8} fill="#0a0a0c" />
      <path d="M-3,8 L-5,24 L5,24 L3,8 Z" fill="#0a0a0c" />
    </g>
  );
};

/** An old iron key. Origin at the bow. */
export const OldKey: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number}> = ({x, y, s = 1, rot = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={0} r={22} fill="none" stroke="#3a3a40" strokeWidth={9} />
    <rect x={20} y={-5} width={110} height={10} fill="#3a3a40" />
    <path d="M110,5 v16 h8 v-8 h8 v8 h8 v-16 Z" fill="#3a3a40" />
    <path d="M20,-5 L130,-5" stroke="#ffd9a8" strokeOpacity={0.35 * lit} strokeWidth={2} />
  </g>
);

/**
 * An old woman asleep on her back in bed, seen from the side: pillow on the left, her profile turned up, grey hair and a
 * frilled night cap, a heavy quilt down to her feet; her bare left foot sticks out at the end. breathe: chest rise 0..1.
 * Head centre at the origin; the foot is at about x = 1180. lit: candlelight (warm rims). grey 0..1 = drained of colour.
 */
export const Sleeper: React.FC<{x: number; y: number; s?: number; t: number; lit?: number; grey?: number; children?: React.ReactNode; foot?: React.ReactNode}> = ({x, y, s = 1, t, lit = 1, grey = 0, children, foot}) => {
  const skin = lerpColor('#d8b4a0', '#9a9ea6', grey);
  const shade = lerpColor('#8a5a4a', '#4a4e56', grey);
  const rise = (Math.sin(t * 1.4) * 0.5 + 0.5) * 10 * (1 - grey);
  const rim = '#ffb45a';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* the bed: mattress and the iron footboard */}
      <rect x={-260} y={60} width={1560} height={90} rx={10} fill="#d8ccb4" />
      <rect x={-260} y={150} width={1560} height={40} fill="#2a1a10" />
      <path d="M1300,-200 L1300,240 M1360,-200 L1360,240 M1300,-120 L1360,-120 M1300,20 L1360,20" stroke="#1a1410" strokeWidth={14} />
      <circle cx={1300} cy={-210} r={16} fill="#2a2420" />
      <circle cx={1360} cy={-210} r={16} fill="#2a2420" />
      {/* pillow */}
      <ellipse cx={-80} cy={50} rx={200} ry={60} fill="#ece4d4" />
      <path d="M-280,50 C-260,0 100,0 120,50" stroke={rim} strokeOpacity={0.3 * lit} strokeWidth={3} fill="none" />
      {/* night cap and grey hair spread on the pillow */}
      <path d="M-120,30 C-170,10 -200,-40 -160,-70 C-130,-90 -80,-80 -60,-60 Z" fill="#c8c0b4" />
      {Array.from({length: 8}, (_, i) => (
        <path key={i} d={`M${-150 + i * 6},${-60 + i * 8} q-40,${10 + i * 4} -80,${30 + i * 2}`} stroke="#b8b0a8" strokeWidth={3} fill="none" />
      ))}
      {/* her face, turned up: forehead, brow, nose, lips, chin, then the throat */}
      <path d={`M-90,20 C-100,-30 -70,-70 -30,-80 C0,-86 20,-84 34,-80 L44,-94 L58,-84 C66,-80 72,-78 78,-74 C84,-84 96,-84 100,-76 C106,-68 110,-62 116,-56 C130,-50 140,-40 150,-30 L190,-20 L190,40 L-60,50 Z`} fill={skin} />
      <path d={`M-30,-80 C0,-86 20,-84 34,-80 L44,-94 L58,-84 C66,-80 72,-78 78,-74 C84,-84 96,-84 100,-76 C106,-68 110,-62 116,-56 C130,-50 140,-40 150,-30`} stroke={rim} strokeOpacity={0.7 * lit} strokeWidth={3} fill="none" />
      <path d="M20,-60 C30,-54 40,-54 48,-60" stroke={shade} strokeWidth={3} fill="none" />
      <path d="M-20,-50 C-10,-40 20,-36 40,-40" stroke={shade} strokeOpacity={0.5} strokeWidth={2} fill="none" />
      {/* the quilt over her body, rising with her breath, folded down below the throat */}
      <path d={`M170,-26 C260,${-70 - rise} 420,${-90 - rise} 600,-70 C800,-60 1000,-40 1180,-30 L1220,60 L170,60 Z`} fill="#5a1e24" />
      <path d={`M170,-26 C260,${-70 - rise} 420,${-90 - rise} 600,-70 C800,-60 1000,-40 1180,-30`} stroke={rim} strokeOpacity={0.45 * lit} strokeWidth={4} fill="none" />
      <path d={`M180,-28 C260,${-60 - rise} 340,${-70 - rise} 400,-66 L400,-40 L180,-10 Z`} fill="#ece4d4" />
      {[300, 500, 700, 900, 1100].map((qx) => (
        <path key={qx} d={`M${qx},-60 L${qx + 20},60`} stroke="#3a1014" strokeWidth={3} opacity={0.6} />
      ))}
      {/* her bare foot out of the end of the quilt: heel down, toes up */}
      <g transform="translate(1180,-10)">
        <path d="M0,60 L0,10 C10,-20 30,-40 40,-70 C46,-90 64,-92 70,-74 C74,-60 70,-40 62,-20 C70,10 66,40 50,60 Z" fill={skin} />
        <path d="M40,-70 C46,-90 64,-92 70,-74 C74,-60 70,-40 62,-20" stroke={rim} strokeOpacity={0.7 * lit} strokeWidth={3} fill="none" />
        <ellipse cx={58} cy={-80} rx={12} ry={8} fill={lerpColor('#e8c8b8', '#b8bcc4', grey)} />
        {foot}
      </g>
      {children}
    </g>
  );
};

/** A coffin seen from above and slightly in front, a lid sliding up over it (lid 0 open .. 1 closed). */
export const Coffin: React.FC<{x: number; y: number; s?: number; lid?: number; lit?: number}> = ({x, y, s = 1, lid = 0, lit = 1}) => {
  const shape = 'M-140,-520 L140,-520 L220,-300 L170,520 L-170,520 L-220,-300 Z';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={shape} fill="#2a1a10" />
      <path d="M-120,-500 L120,-500 L196,-300 L150,500 L-150,500 L-196,-300 Z" fill="#d8ccb8" />
      <path d="M-120,-500 L120,-500 L196,-300 L150,500 L-150,500 L-196,-300 Z" fill="#000" opacity={0.25} />
      <clipPath id="coffin-lid">
        <path d={shape} />
      </clipPath>
      <g clipPath="url(#coffin-lid)">
        <rect x={-260} y={520 - lid * 1060} width={520} height={1060} fill="#3a2414" />
        <path d={`M-260,${520 - lid * 1060} L260,${520 - lid * 1060}`} stroke="#c8a870" strokeOpacity={0.5 * lit} strokeWidth={4} />
        <path d={`M-12,${-200 + (1 - lid) * 1060} L12,${-200 + (1 - lid) * 1060} L12,${-100 + (1 - lid) * 1060} L60,${-100 + (1 - lid) * 1060} L60,${-76 + (1 - lid) * 1060} L12,${-76 + (1 - lid) * 1060} L12,${80 + (1 - lid) * 1060} L-12,${80 + (1 - lid) * 1060} L-12,${-76 + (1 - lid) * 1060} L-60,${-76 + (1 - lid) * 1060} L-60,${-100 + (1 - lid) * 1060} L-12,${-100 + (1 - lid) * 1060} Z`} fill="#c8a870" opacity={0.8} />
      </g>
      <path d={shape} fill="none" stroke="#c8a870" strokeOpacity={0.4 * lit} strokeWidth={4} />
    </g>
  );
};

/** A checked tea towel folded flat. Origin at the centre. */
export const TeaTowel: React.FC<{x: number; y: number; s?: number; rot?: number; lit?: number}> = ({x, y, s = 1, rot = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-140} width={520} height={280} rx={10} fill="#e8e0d0" />
    {Array.from({length: 7}, (_, i) => <rect key={`v${i}`} x={-240 + i * 80} y={-140} width={24} height={280} fill="#8a1a1e" opacity={0.5} />)}
    {Array.from({length: 4}, (_, i) => <rect key={`h${i}`} x={-260} y={-120 + i * 80} width={520} height={24} fill="#8a1a1e" opacity={0.5} />)}
    <rect x={-260} y={-140} width={520} height={280} rx={10} fill="none" stroke="#fff" strokeOpacity={0.2 * lit} strokeWidth={3} />
  </g>
);

/** Small bare footprints of wet soil, walking along a path from (x0,y0) to (x1,y1); reveal 0..1 shows them in order. */
export const SoilPrints: React.FC<{x0: number; y0: number; x1: number; y1: number; n?: number; s?: number; reveal?: number; wet?: number}> = ({x0, y0, x1, y1, n = 10, s = 1, reveal = 1, wet = 1}) => {
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const deg = (ang * 180) / Math.PI + 90;
  const r = rng(29);
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        if (i / n > reveal) return null;
        const f = i / (n - 1);
        const side = i % 2 ? 1 : -1;
        const px = x0 + (x1 - x0) * f + Math.cos(ang + Math.PI / 2) * side * 26 * s;
        const py = y0 + (y1 - y0) * f + Math.sin(ang + Math.PI / 2) * side * 26 * s;
        const sc = s * (1 - f * 0.45);
        return (
          <g key={i} transform={`translate(${px},${py}) rotate(${deg + (r() - 0.5) * 10}) scale(${sc})`}>
            <ellipse cx={0} cy={18} rx={22} ry={34} fill="#2a1a0e" />
            <ellipse cx={0} cy={-34} rx={18} ry={16} fill="#2a1a0e" />
            {[-16, -6, 4, 12, 18].map((tx, k) => <circle key={k} cx={tx} cy={-58 + Math.abs(k - 0) * 2} r={5 - k * 0.5} fill="#2a1a0e" />)}
            <ellipse cx={-6} cy={10} rx={8} ry={14} fill="#9fb4cf" opacity={0.25 * wet} />
          </g>
        );
      })}
    </g>
  );
};

/** A small bare foot at the end of a bed (yours), toes up, for the final close-up. Origin at the heel. */
export const BareFoot: React.FC<{x: number; y: number; s?: number; t: number; flinch?: number}> = ({x, y, s = 1, t, flinch = 0}) => {
  const tw = noise1(t * 6, 3) * 3 * flinch;
  return (
    <g transform={`translate(${x + tw},${y}) scale(${s})`}>
      <path d="M-160,40 C-150,-20 -90,-40 -40,-60 C0,-120 40,-200 70,-260 C84,-290 120,-292 132,-262 C140,-240 136,-200 120,-160 C140,-120 150,-60 120,0 C80,40 -80,60 -160,40 Z" fill="#d8b49a" />
      <path d="M70,-260 C84,-290 120,-292 132,-262 C140,-240 136,-200 120,-160" stroke="#9fb4cf" strokeOpacity={0.6} strokeWidth={4} fill="none" />
      {[0, 1, 2, 3, 4].map((k) => (
        <ellipse key={k} cx={110 - k * 26} cy={-276 + k * 22} rx={22 - k * 2.5} ry={18 - k * 2} fill="#d8b49a" stroke="#8a5a4a" strokeOpacity={0.4} strokeWidth={2} />
      ))}
      <ellipse cx={112} cy={-284} rx={11} ry={7} fill="#ecd4c4" />
    </g>
  );
};
