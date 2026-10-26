import React from 'react';
import {easeOut, noise1, prog} from '../util';

/* Present-day props that still belong in a gothic frame: a phone glowing in the dark, a funeral card. */

export type PhoneMsg = {lines: string[]; at: number}; // at = global second the bubble lands

/**
 * A phone held in two hands, screen glowing: a messages thread from `from`. Bubbles land at their `at`
 * time with a small rise; a typing indicator shows before each. Fingers wrap the edges (style colours).
 * buzz: time of the incoming buzz (shake). The screen also lights the fingers that hold it.
 */
export const Phone: React.FC<{
  id: string;
  t: number;
  x: number;
  y: number;
  s?: number;
  rot?: number;
  from: string;
  clock: string;
  msgs: PhoneMsg[];
  buzz?: number[];
  skin?: string;
  shade?: string;
  nail?: string;
  nailLen?: number;
  sleeve?: string;
}> = ({id, t, x, y, s = 1, rot = 0, from, clock, msgs, buzz = [], skin = '#b89a86', shade = '#4c3a31', nail = '#d8c0b0', nailLen = 2, sleeve = '#15171c'}) => {
  const W = 420, H = 860, R = 56;
  const shake = buzz.reduce((m, b) => (t >= b && t < b + 0.45 ? Math.sin((t - b) * 90) * 5 * (1 - (t - b) / 0.45) : m), 0);
  const glow = 0.9 + noise1(t * 3, 2) * 0.05;
  let yCursor = 170;
  const bubbles = msgs.map((m, i) => {
    const p = prog(t, m.at, m.at + 0.25, easeOut);
    const typing = t >= m.at - 0.9 && t < m.at;
    const lh = 38;
    const bh = m.lines.length * lh + 30;
    const bw = Math.min(364, Math.max(...m.lines.map((l) => l.length)) * 15.2 + 44);
    const by = yCursor;
    if (t >= m.at - 0.9) yCursor += (t >= m.at ? bh : 56) + 18;
    if (t < m.at - 0.9) return null;
    if (typing)
      return (
        <g key={i} transform={`translate(28,${by})`}>
          <rect width={96} height={52} rx={26} fill="#2b2d33" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={28 + k * 20} cy={26} r={6} fill="#9a9ca3" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 9 - k))} />
          ))}
        </g>
      );
    return (
      <g key={i} transform={`translate(28,${by + (1 - p) * 16})`} opacity={p}>
        <rect width={bw} height={bh} rx={24} fill="#2b2d33" />
        {m.lines.map((l, k) => (
          <text key={k} x={20} y={44 + k * lh} fontFamily="Helvetica, Arial, sans-serif" fontSize={29} fill="#eceef2">
            {l}
          </text>
        ))}
      </g>
    );
  });
  // a fingertip peeking round the phone's edge (side -1 left, 1 right)
  const tip = (fx: number, fy: number, side: number, k: string) => (
    <g key={k} transform={`translate(${fx},${fy})`}>
      <path d={`M0,-26 C${side * 30},-26 ${side * 34},26 0,26 Z`} fill={skin} />
      <path d={`M0,-26 C${side * 30},-26 ${side * 34},26 0,26`} stroke={shade} strokeOpacity={0.6} strokeWidth={3} fill="none" />
      <path d={`M${side * 4},-18 C${side * 18},-16 ${side * 20},-4 ${side * 18},4`} stroke="#cfe0ff" strokeOpacity={0.25} strokeWidth={3} fill="none" />
    </g>
  );
  // a thumb resting on the glass from a bottom corner, nail toward the screen centre
  const thumb = (bx: number, by: number, a: number, k: string) => (
    <g key={k} transform={`translate(${bx},${by}) rotate(${a})`}>
      <path d="M-30,60 C-34,0 -30,-80 -22,-118 C-16,-140 16,-140 22,-118 C30,-80 34,0 30,60 Z" fill={skin} />
      <path d="M-30,60 C-34,0 -30,-80 -22,-118 C-16,-140 16,-140 22,-118 C30,-80 34,0 30,60 Z" fill="none" stroke={shade} strokeWidth={4} strokeOpacity={0.7} />
      <path d="M12,-110 C20,-70 22,-20 20,40" stroke={shade} strokeOpacity={0.45} strokeWidth={10} fill="none" />
      <path d="M-14,-112 C-10,-136 10,-136 14,-112 C10,-96 -10,-96 -14,-112 Z" fill={nail} />
      <path d="M-18,-60 q18,8 36,0" stroke={shade} strokeOpacity={0.6} strokeWidth={2} fill="none" />
      <path d="M-22,-110 C-26,-60 -28,0 -26,50" stroke="#cfe0ff" strokeOpacity={0.22} strokeWidth={4} fill="none" />
    </g>
  );
  return (
    <g transform={`translate(${x + shake},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#bcd0ff" stopOpacity={0.35 * glow} />
          <stop offset="1" stopColor="#bcd0ff" stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-scr`}>
          <rect x={14} y={14} width={W - 28} height={H - 28} rx={R - 12} />
        </clipPath>
      </defs>
      <ellipse cx={W / 2} cy={H / 2} rx={W * 1.3} ry={H * 0.85} fill={`url(#${id}-glow)`} />
      {/* sleeves and palms behind the phone */}
      <path d={`M-150,${H + 400} C-120,${H + 120} -60,${H - 20} 20,${H - 120} L120,${H - 60} L60,${H + 400} Z`} fill={sleeve} />
      <path d={`M${W + 150},${H + 400} C${W + 120},${H + 120} ${W + 60},${H - 20} ${W - 20},${H - 120} L${W - 120},${H - 60} L${W - 60},${H + 400} Z`} fill={sleeve} />
      <ellipse cx={30} cy={H - 160} rx={80} ry={150} fill={skin} />
      <ellipse cx={W - 30} cy={H - 160} rx={80} ry={150} fill={skin} />
      <ellipse cx={30} cy={H - 160} rx={80} ry={150} fill={shade} opacity={0.45} />
      <ellipse cx={W - 30} cy={H - 160} rx={80} ry={150} fill={shade} opacity={0.45} />
      {/* body + screen */}
      <rect x={0} y={0} width={W} height={H} rx={R} fill="#0b0c0f" />
      <rect x={0} y={0} width={W} height={H} rx={R} fill="none" stroke="#3a3d45" strokeWidth={3} />
      <g clipPath={`url(#${id}-scr)`}>
        <rect x={14} y={14} width={W - 28} height={H - 28} fill="#111216" opacity={glow} />
        <text x={46} y={58} fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fontWeight={600} fill="#e6e8ee">
          {clock}
        </text>
        <rect x={14} y={70} width={W - 28} height={84} fill="#17181d" />
        <circle cx={W / 2} cy={104} r={22} fill="#4a4e5a" />
        <text x={W / 2} y={112} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fill="#e6e8ee">
          {from[0]}
        </text>
        <text x={W / 2} y={146} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={18} fill="#a6a9b2">
          {from}
        </text>
        {bubbles}
      </g>
      <rect x={W / 2 - 60} y={26} width={120} height={30} rx={15} fill="#000" />
      {/* thumbs over the bottom corners, fingers wrapping the far edges */}
      {tip(0, 430, -1, 'l1')}
      {tip(0, 500, -1, 'l2')}
      {tip(W, 440, 1, 'r1')}
      {tip(W, 510, 1, 'r2')}
      {thumb(30, H - 10, 28, 'lt')}
      {thumb(W - 30, H - 10, -28, 'rt')}
    </g>
  );
};

/** Folded order-of-service card: "In loving memory", an oval photo silhouette, a name and dates. */
export const FuneralCard: React.FC<{x: number; y: number; s?: number; rot?: number; name: string; dates: string; lit?: number; photo?: React.ReactNode}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  name,
  dates,
  lit = 1,
  photo,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-420} width={600} height={840} fill="#000" opacity={0.55} transform="translate(14,18)" />
    <rect x={-300} y={-420} width={600} height={840} fill="#c9c3b4" />
    <rect x={-300} y={-420} width={600} height={840} fill="#2a3448" opacity={0.55 * (1 - lit * 0.5)} />
    <rect x={-270} y={-390} width={540} height={780} fill="none" stroke="#151515" strokeWidth={4} />
    <rect x={-258} y={-378} width={516} height={756} fill="none" stroke="#151515" strokeWidth={1.5} />
    <text x={0} y={-300} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontWeight={600} fontSize={46} fill="#1a1a1a">
      In loving memory of
    </text>
    <ellipse cx={0} cy={-90} rx={130} ry={160} fill="#1d1f24" />
    <ellipse cx={0} cy={-90} rx={130} ry={160} fill="none" stroke="#151515" strokeWidth={6} />
    <g>
      <clipPath id="fc-photo">
        <ellipse cx={0} cy={-90} rx={124} ry={154} />
      </clipPath>
      <g clipPath="url(#fc-photo)">{photo}</g>
    </g>
    <text x={0} y={150} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={60} fill="#151515">
      {name}
    </text>
    <text x={0} y={214} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={40} letterSpacing={6} fill="#2a2a2a">
      {dates}
    </text>
    <path d="M-80,270 L80,270" stroke="#151515" strokeWidth={2} />
    <text x={0} y={330} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontWeight={600} fontSize={34} fill="#2a2a2a">
      He kept watch.
    </text>
  </g>
);
