import React from 'react';
import {lerpColor, noise1, rng} from '../util';

/* Paper things: an open diary with handwritten entries, a shelf of dated notebooks, a key on a luggage tag. */

export type Entry = {text: string; shaky?: boolean; struck?: boolean; faint?: boolean; ink?: string};

/** Hand-lettered line: italic serif with per-letter wobble; `shaky` = written with the wrong hand. */
const Script: React.FC<{x: number; y: number; text: string; size: number; shaky?: boolean; ink: string; seed: number; opacity?: number; reveal?: number}> = ({
  x,
  y,
  text,
  size,
  shaky,
  ink,
  seed,
  opacity = 1,
  reveal = 1,
}) => {
  const r = rng(seed);
  const n = Math.max(0, Math.floor(text.length * reveal));
  const chars = text.slice(0, n).split('');
  const rot = chars.map(() => ((r() - 0.5) * (shaky ? 26 : 5)).toFixed(1)).join(' ');
  const dy = chars.map((_, i) => (i === 0 ? 0 : (r() - 0.5) * (shaky ? 7 : 1.2)).toFixed(1)).join(' ');
  return (
    <text
      x={x}
      y={y}
      rotate={rot}
      dy={dy}
      fontFamily="CountCaption, serif"
      fontStyle="italic"
      fontWeight={600}
      fontSize={size * (shaky ? 1.12 : 1)}
      fill={ink}
      opacity={opacity}
      letterSpacing={shaky ? 2.5 : 0.5}
      transform={shaky ? `rotate(${-3 + (seed % 5)} ${x} ${y})` : undefined}
    >
      {chars.join('')}
    </text>
  );
};

/**
 * An open diary seen from above, two pages, ruled lines and margin. Entries run down the right page
 * (or across both with `spread`). lit: 0..1 how much light falls on it (torch / candle);
 * highlight: index of the entry that gets a soft halo; reveal: 0..1 of the highlighted entry written out.
 * Page turn: turn 0..1 lifts the right page over to the left.
 */
export const NotebookOpen: React.FC<{
  id: string;
  x: number;
  y: number;
  s?: number;
  rot?: number;
  t: number;
  left?: Entry[];
  right: Entry[];
  heading?: [string, string];
  lit?: number;
  warm?: number;
  turn?: number;
  highlight?: number;
  reveal?: number;
  size?: number;
}> = ({id, x, y, s = 1, rot = 0, t, left = [], right, heading, lit = 1, warm = 0, turn = 0, highlight = -1, reveal = 1, size = 40}) => {
  const W = 560, H = 760;
  const paper = lerpColor('#b9b4a6', '#d8c6a0', warm);
  const paperShade = lerpColor('#6a6a66', '#7a5a3a', warm);
  const ink = '#1a1a22';
  const page = (sx: number, entries: Entry[], head: string | undefined, seed: number) => (
    <g>
      <path d={`M${sx},0 L${sx + W},0 L${sx + W},${H} L${sx},${H} Z`} fill={paper} />
      {Array.from({length: 15}, (_, i) => (
        <path key={i} d={`M${sx + 40},${110 + i * 44} L${sx + W - 30},${110 + i * 44}`} stroke="#4a5a78" strokeOpacity={0.35} strokeWidth={1.5} />
      ))}
      <path d={`M${sx + 92},30 L${sx + 92},${H - 20}`} stroke="#8a2a2a" strokeOpacity={0.45} strokeWidth={2} />
      {head && <Script x={sx + 110} y={86} text={head} size={size * 0.9} ink={ink} seed={seed + 99} />}
      {entries.map((e, i) => (
        <g key={i}>
          {i === highlight && <rect x={sx + 100} y={110 + i * 88 - 4} width={W - 130} height={size + 26} fill="#fff4d8" opacity={0.18 * lit} rx={8} />}
          <Script
            x={sx + 110}
            y={146 + i * 88}
            text={e.text}
            size={size}
            shaky={e.shaky}
            ink={e.ink ?? ink}
            seed={seed + i * 7}
            opacity={e.faint ? 0.28 : 1}
            reveal={i === highlight ? reveal : 1}
          />
          {e.struck && <path d={`M${sx + 104},${134 + i * 88} q120,-6 ${W - 150},4`} stroke={ink} strokeWidth={4} opacity={0.8} />}
        </g>
      ))}
    </g>
  );
  const flutter = noise1(t * 3, 4) * 2;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-gut`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* cover board under the pages */}
      <rect x={-W - 22} y={-18} width={W * 2 + 44} height={H + 36} rx={10} fill="#1d1410" />
      {page(-W, left, heading?.[0], 11)}
      {page(0, right, heading?.[1], 23)}
      <rect x={-60} y={0} width={120} height={H} fill={`url(#${id}-gut)`} />
      {/* lifting page */}
      {turn > 0.01 && turn < 0.99 && (
        <g transform={`scale(${Math.cos(turn * Math.PI)},1)`}>
          <path d={`M0,0 L${W},${flutter} L${W},${H} L0,${H} Z`} fill={turn < 0.5 ? paper : paperShade} />
        </g>
      )}
      <rect x={-W - 22} y={-18} width={W * 2 + 44} height={H + 36} rx={10} fill="#000" opacity={0.75 * (1 - lit)} />
    </g>
  );
};

/** A shelf of notebooks, spines out, each labelled with a year. pull 0..1 draws `pulled` out toward camera. */
export const NotebookShelf: React.FC<{x: number; y: number; s?: number; years: string[]; pulled?: number; pull?: number; lit?: number; warm?: number}> = ({
  x,
  y,
  s = 1,
  years,
  pulled = -1,
  pull = 0,
  lit = 1,
  warm = 0,
}) => {
  const r = rng(707);
  const spines = years.map((yr, i) => ({yr, w: 40 + r() * 12, h: 300 + r() * 50, c: lerpColor(['#2a1a14', '#1a2026', '#241a10', '#1c1c1c'][i % 4], '#000', r() * 0.3)}));
  let cx = 0;
  const shelf = '#120c08';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-30} y={0} width={spines.reduce((a, b) => a + b.w + 4, 0) + 60} height={30} fill={shelf} />
      <rect x={-30} y={0} width={spines.reduce((a, b) => a + b.w + 4, 0) + 60} height={4} fill={lerpColor('#8fa3c0', '#ffb45a', warm)} opacity={0.3 * lit} />
      {spines.map((sp, i) => {
        const x0 = cx;
        cx += sp.w + 4;
        const out = i === pulled ? pull : 0;
        return (
          <g key={i} transform={`translate(${x0 - out * 6},${-sp.h + out * 70}) scale(${1 + out * 0.12})`}>
            <rect width={sp.w} height={sp.h} rx={3} fill={sp.c} />
            <rect width={sp.w} height={sp.h} rx={3} fill="none" stroke="#000" strokeWidth={2} />
            <rect x={3} y={0} width={4} height={sp.h} fill={lerpColor('#c5d2e4', '#ffd09a', warm)} opacity={0.18 * lit} />
            <rect x={6} y={sp.h * 0.12} width={sp.w - 12} height={12} fill="#8a7a5a" opacity={0.5} />
            <rect x={6} y={sp.h * 0.82} width={sp.w - 12} height={12} fill="#8a7a5a" opacity={0.5} />
            <text
              x={sp.w / 2 + 8}
              y={sp.h * 0.5}
              transform={`rotate(-90 ${sp.w / 2 + 8} ${sp.h * 0.5})`}
              textAnchor="middle"
              fontFamily="CountCaption, serif"
              fontWeight={600}
              fontSize={26}
              fill="#d8ccb0"
              opacity={0.85 * lit}
            >
              {sp.yr}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** An iron key on a loop of string with a buff luggage tag. swing in degrees. */
export const KeyTag: React.FC<{x: number; y: number; s?: number; swing?: number; label: string; lit?: number}> = ({x, y, s = 1, swing = 0, label, lit = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${swing}) scale(${s})`}>
    <path d="M0,0 L0,120" stroke="#6a5a40" strokeWidth={3} />
    {/* key */}
    <g transform="translate(0,120)">
      <circle cx={0} cy={22} r={22} fill="none" stroke="#2a2a2c" strokeWidth={10} />
      <circle cx={0} cy={22} r={22} fill="none" stroke="#8fa3c0" strokeOpacity={0.35 * lit} strokeWidth={2} />
      <rect x={-5} y={42} width={10} height={110} fill="#2a2a2c" />
      <path d="M5,120 h18 v10 h-8 v10 h8 v12 h-18 Z" fill="#2a2a2c" />
      <path d="M-5,44 L-5,150" stroke="#8fa3c0" strokeOpacity={0.35 * lit} strokeWidth={2} />
    </g>
    {/* luggage tag */}
    <g transform="translate(14,40) rotate(-12)">
      <path d="M0,0 L120,0 L150,30 L120,60 L0,60 Z" fill="#c9b48a" />
      <path d="M0,0 L120,0 L150,30 L120,60 L0,60 Z" fill="#1a2436" opacity={0.45 * (1 - lit * 0.6)} />
      <circle cx={128} cy={30} r={7} fill="#1a1410" />
      <text x={12} y={40} fontFamily="CountCaption, serif" fontStyle="italic" fontWeight={600} fontSize={24} fill="#1a1a22">
        {label}
      </text>
    </g>
  </g>
);

/** A single handwritten letter page (Gran's), lines revealed in order by `reveal` (0..1 of all lines). */
export const LetterPage: React.FC<{x: number; y: number; s?: number; rot?: number; lines: string[]; lit?: number; warm?: number; reveal?: number; size?: number; highlight?: number}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  lines,
  lit = 1,
  warm = 0,
  reveal = 1,
  size = 38,
  highlight = -1,
}) => {
  const paper = lerpColor('#c9c3b4', '#e2d4b4', warm);
  const shown = reveal * lines.length;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-420} y={-560} width={840} height={1120} fill="#000" opacity={0.5} transform="translate(16,20)" />
      <rect x={-420} y={-560} width={840} height={1120} fill={paper} />
      <path d="M-420,-200 L420,-200 M-420,200 L420,200" stroke="#8a8270" strokeOpacity={0.35} strokeWidth={3} />
      {lines.map((l, i) => {
        const k = Math.max(0, Math.min(1, shown - i));
        if (k <= 0) return null;
        return (
          <g key={i}>
            {i === highlight && <rect x={-380} y={-500 + i * 72} width={760} height={size + 22} fill="#fff4d8" opacity={0.22 * lit} rx={8} />}
            <Script x={-360} y={-462 + i * 72} text={l} size={size} ink="#22202a" seed={50 + i * 11} reveal={k} />
          </g>
        );
      })}
      <rect x={-420} y={-560} width={840} height={1120} fill="#000" opacity={0.7 * (1 - lit)} />
    </g>
  );
};
