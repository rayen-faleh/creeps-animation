import React from 'react';
import {noise1} from '../util';

/**
 * The one-armed watcher. Standing silhouette, feet at (0,0), about 1000 units tall: flat cap, long coat,
 * empty left sleeve pinned up at the shoulder, a torch in his right hand.
 * beamTo: local point the torch beam reaches (omit for no beam). glare 0..1: torch aimed into the lens.
 * point 0..1 raises the torch arm to point (send the kids home). rim: lamp light from above.
 */
export const Watcher: React.FC<{
  id: string;
  t: number;
  x?: number;
  y?: number;
  s?: number;
  torch?: number; // 0..1 torch on
  beamTo?: [number, number];
  beamW?: number;
  glare?: number;
  point?: number;
  rim?: string;
  rimA?: number;
  sway?: number;
  holding?: React.ReactNode; // drawn in the hand instead of the torch (e.g. a notebook)
}> = ({id, t, x = 0, y = 0, s = 1, torch = 1, beamTo, beamW = 160, glare = 0, point = 0, rim = '#ffb45a', rimA = 0.6, sway = 1, holding}) => {
  const breathe = Math.sin(t * 1.4) * 4;
  const flap = noise1(t * 2.2, 6) * 6 * sway;
  // torch hand: held at the waist, or raised to point when point -> 1
  const hx = -150 - point * 160;
  const hy = -520 - point * 330;
  const tx = hx - 18, ty = hy - 10;
  const beam = beamTo && torch > 0.01;
  let beamPoly = '';
  if (beam) {
    const [bx, by] = beamTo!;
    const dx = bx - tx, dy = by - ty;
    const n = Math.hypot(dx, dy) || 1;
    const px = (-dy / n) * beamW, py = (dx / n) * beamW;
    beamPoly = `${tx - px * 0.05},${ty - py * 0.05} ${bx - px},${by - py} ${bx + px},${by + py} ${tx + px * 0.05},${ty + py * 0.05}`;
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-beam`} gradientUnits="userSpaceOnUse" x1={tx} y1={ty} x2={beamTo ? beamTo[0] : tx} y2={beamTo ? beamTo[1] : ty}>
          <stop offset="0" stopColor="#fff4d8" stopOpacity={0.55 * torch} />
          <stop offset="1" stopColor="#ffe2a8" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-glare`}>
          <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
          <stop offset="0.12" stopColor="#fff3d0" stopOpacity={0.9} />
          <stop offset="0.4" stopColor="#ffd890" stopOpacity={0.25} />
          <stop offset="1" stopColor="#ffd890" stopOpacity={0} />
        </radialGradient>
      </defs>
      {beam && <polygon points={beamPoly} fill={`url(#${id}-beam)`} style={{mixBlendMode: 'screen'}} />}
      <g transform={`translate(0,${breathe * 0.3})`}>
        {/* legs and boots */}
        <path d="M-70,-330 L-80,-10 L-20,-10 L-10,-330 Z M10,-330 L20,-10 L80,-10 L70,-330 Z" fill="#040303" />
        <path d="M-100,0 L-10,0 L-14,-26 L-88,-26 Z M10,0 L104,0 L90,-26 L16,-26 Z" fill="#020202" />
        {/* long coat, hem moving in the wind */}
        <path
          d={`M-150,-780 C-170,-640 -190,-480 ${-200 + flap},-300 L${200 + flap},-300 C190,-480 170,-640 150,-780 C80,-812 -80,-812 -150,-780 Z`}
          fill="#060505"
        />
        <path d="M0,-790 L-10,-300" stroke="#000" strokeWidth={4} opacity={0.7} />
        {/* empty left sleeve, folded and pinned at the shoulder (viewer's right) */}
        <path d="M150,-780 C178,-768 192,-740 190,-700 C188,-664 172,-646 150,-648 C138,-690 140,-740 150,-780 Z" fill="#080706" />
        <path d="M152,-700 C170,-694 184,-684 190,-670" stroke="#000" strokeWidth={4} fill="none" />
        <circle cx={172} cy={-712} r={5} fill="#d9d4c8" opacity={0.7} />
        {/* right arm holding the torch */}
        <path d={`M-150,-780 C-185,-720 -200,-640 ${hx - 10},${hy + 30} L${hx + 34},${hy + 18} C-150,-640 -128,-710 -112,-760 Z`} fill="#070606" />
        <ellipse cx={hx} cy={hy} rx={26} ry={22} fill="#0b0908" />
        {holding ? <g transform={`translate(${hx},${hy})`}>{holding}</g> : <g transform={`translate(${tx},${ty}) rotate(${beamTo ? (Math.atan2(beamTo[1] - ty, beamTo[0] - tx) * 180) / Math.PI : 180})`}>
          <rect x={0} y={-12} width={64} height={24} rx={6} fill="#0d0d0e" />
          <rect x={56} y={-16} width={18} height={32} rx={4} fill="#151517" />
        </g>}
        {/* head and flat cap */}
        <ellipse cx={0} cy={-865} rx={58} ry={70} fill="#050404" />
        <path d="M-104,-905 C-90,-960 -40,-982 10,-980 C70,-978 96,-950 92,-918 C60,-904 -40,-900 -104,-905 Z" fill="#030303" />
        <path d="M-130,-900 C-90,-916 60,-916 98,-908 L94,-898 C40,-904 -80,-902 -128,-890 Z" fill="#020202" />
        <path d="M-48,-790 L0,-760 L48,-790" stroke="#0e0c0b" strokeWidth={6} fill="none" />
        {/* lamp rim light from above */}
        <g stroke={rim} strokeOpacity={rimA} fill="none" strokeLinecap="round">
          <path d="M-96,-920 C-80,-962 -30,-978 14,-976 C62,-972 86,-950 88,-924" strokeWidth={8} />
          <path d="M-148,-778 C-90,-806 90,-806 148,-778" strokeWidth={7} />
          <path d="M150,-778 C178,-768 192,-740 190,-700 C188,-664 172,-646 150,-648" strokeWidth={7} />
          <path d={`M150,-640 C170,-480 ${190 + flap},-380 ${200 + flap},-300`} strokeWidth={5} strokeOpacity={rimA * 0.8} />
          <path d={`M-150,-778 C-182,-722 -196,-644 ${hx - 8},${hy + 26}`} strokeWidth={5} strokeOpacity={rimA * 0.7} />
        </g>
      </g>
      {glare > 0.01 && (
        <g style={{mixBlendMode: 'screen'}}>
          <circle cx={tx - 70} cy={ty} r={260 * glare + 40} fill={`url(#${id}-glare)`} opacity={glare} />
          <path d={`M${tx - 70 - 420 * glare},${ty} L${tx - 70 + 420 * glare},${ty}`} stroke="#fff1cc" strokeOpacity={0.5 * glare} strokeWidth={4} />
        </g>
      )}
    </g>
  );
};

/**
 * The watcher close, in profile facing left: flat cap, broken nose, stubble, coat collar up and the
 * empty near sleeve pinned at the shoulder (safety-pin glint). Rim-lit from the front (left) by
 * dusk or lamp light. jaw 0..1 opens the mouth (speech); turn 0..1 dips the head away.
 */
export const WatcherProfile: React.FC<{id: string; x: number; y: number; s: number; t: number; jaw?: number; turn?: number; rim?: string}> = ({
  id,
  x,
  y,
  s,
  t,
  jaw = 0,
  turn = 0,
  rim = '#ffb45a',
}) => {
  const breathe = Math.sin(t * 1.5) * 3;
  const fl = 0.88 + noise1(t * 6, 5) * 0.12;
  const j = jaw * 10;
  const head = `M95,160 C112,90 116,10 104,-62 C96,-74 80,-80 70,-82
    L-70,-74 C-80,-60 -88,-40 -90,-22 C-92,-14 -96,-8 -98,0
    C-112,14 -128,30 -136,40 C-126,48 -110,50 -100,52
    C-104,60 -106,64 -103,68 L-98,${72 + j * 0.4} C-104,${78 + j} -106,${86 + j} -102,${96 + j}
    C-100,${112 + j} -90,${126 + j} -76,${132 + j} C-50,${142 + j * 0.6} -28,140 -20,150 L-18,190 L95,190 Z`;
  const cap = `M108,-60 C118,-92 104,-122 70,-130 C20,-140 -40,-122 -84,-96 C-118,-80 -150,-66 -170,-52
    C-150,-48 -110,-54 -78,-60 C-30,-68 40,-70 108,-60 Z`;
  return (
    <g transform={`translate(${x},${y + breathe}) rotate(${turn * 6}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rim} stopOpacity={0.95 * fl} />
          <stop offset="0.2" stopColor={rim} stopOpacity={0.4 * fl} />
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={head} />
          <path d={cap} />
        </clipPath>
      </defs>
      {/* coat: collar up, shoulders, the empty near sleeve pinned */}
      <path d="M-200,820 C-210,560 -160,330 -60,250 L-40,180 L110,180 L150,250 C300,300 400,520 430,820 Z" fill="#070404" />
      <path d="M-60,250 L-40,180 L20,220 L-10,330 Z" fill="#0d0706" />
      <path d="M-200,820 C-210,560 -160,330 -60,250" stroke={rim} strokeOpacity={0.5 * fl} strokeWidth={5} fill="none" />
      <path d="M-60,250 L-40,180 L20,220" stroke={rim} strokeOpacity={0.35 * fl} strokeWidth={3} fill="none" />
      {/* the empty near sleeve: a short limp tube, its cuff folded up and pinned */}
      <path d="M48,296 C90,272 170,282 196,324 C206,400 206,470 196,528 C170,552 112,556 84,532 C74,470 66,380 48,296 Z" fill="#160c09" />
      <path d="M84,478 C120,496 166,494 198,474" stroke="#000" strokeWidth={6} fill="none" />
      <path d="M90,500 C122,512 160,512 194,498" stroke={rim} strokeOpacity={0.25 * fl} strokeWidth={2} fill="none" />
      <path d="M120,330 C128,400 130,450 126,480" stroke="#000" strokeOpacity={0.6} strokeWidth={5} fill="none" />
      <path d="M48,296 C90,272 170,282 196,324 C206,400 206,470 196,528" stroke={rim} strokeOpacity={0.5 * fl} strokeWidth={4} fill="none" />
      <g transform="translate(150,470) rotate(-80)">
        <rect x={-18} y={-2.5} width={36} height={5} rx={2.5} fill="#d8d0c0" opacity={0.85} />
        <circle cx={-18} cy={0} r={4} fill="none" stroke="#d8d0c0" strokeWidth={2} opacity={0.8} />
      </g>
      {/* the coat side falls straight where the arm should be */}
      <path d="M196,530 C204,620 210,720 214,820" stroke="#000" strokeWidth={6} fill="none" opacity={0.8} />
      {/* head */}
      <path d={head} fill="#080404" />
      <path d={cap} fill="#050303" />
      <g clipPath={`url(#${id}-clip)`}>
        <path d={head} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={16} />
        <path d={cap} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={12} />
      </g>
      {/* ear, stubble, a wet eye glint under the brim */}
      <path d="M30,-10 C44,-22 62,-12 60,10 C58,30 44,40 34,30" fill="none" stroke={rim} strokeOpacity={0.22 * fl} strokeWidth={3} />
      {Array.from({length: 26}, (_, i) => {
        const a = (i * 37) % 26;
        const sx = -96 + (a / 26) * 70 + (i % 3) * 4;
        const sy = 96 + j + ((i * 13) % 34);
        return <circle key={i} cx={sx} cy={sy} r={1.6} fill={rim} opacity={0.22 * fl} />;
      })}
      <circle cx={-72} cy={-28} r={3.2} fill="#ffe2b8" opacity={0.85 * fl} />
      <path d="M-82,-38 q10,-4 20,0" stroke="#1a0c06" strokeWidth={3} fill="none" />
    </g>
  );
};
