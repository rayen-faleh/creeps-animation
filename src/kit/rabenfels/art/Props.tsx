import React from 'react';
import {noise1, rng} from '../util';
import {theme} from '../theme';

/* ---------------- Candle ---------------- */
export const Candle: React.FC<{x: number; y: number; t: number; s?: number; glow?: number}> = ({x, y, t, s = 1, glow = 1}) => {
  const fl = noise1(t * 7, 2);
  const fl2 = noise1(t * 11, 5);
  const fh = 58 + fl * 8;
  const lean = fl2 * 5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id="candle-glow">
          <stop offset="0" stopColor="#ffd28a" stopOpacity={0.55 * glow} />
          <stop offset="0.3" stopColor="#ff9a3c" stopOpacity={0.2 * glow} />
          <stop offset="1" stopColor="#ff7a20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle-wax" x1="0" x2="1">
          <stop offset="0" stopColor="#f6d9a8" />
          <stop offset="0.5" stopColor="#d9b07a" />
          <stop offset="1" stopColor="#6e4a26" />
        </linearGradient>
      </defs>
      <circle cx={0} cy={-150} r={520 + fl * 30} fill="url(#candle-glow)" />
      {/* holder */}
      <ellipse cx={0} cy={6} rx={78} ry={18} fill="#2a160a" />
      <ellipse cx={0} cy={0} rx={70} ry={14} fill="#6a4020" />
      <path d="M-26,-4 L-26,-150 Q0,-160 26,-150 L26,-4 Z" fill="url(#candle-wax)" />
      <path d="M-26,-150 Q-24,-120 -30,-100 Q-22,-110 -20,-148 Z" fill="#f4dcae" />
      <ellipse cx={0} cy={-150} rx={26} ry={6} fill="#f8e2b6" />
      <line x1={0} y1={-152} x2={0} y2={-166} stroke="#1a0e06" strokeWidth={3} />
      {/* flame */}
      <path d={`M0,-160 C-14,-172 -10,${-180 - fh * 0.4} ${lean},${-160 - fh} C10,${-180 - fh * 0.4} 14,-172 0,-160 Z`} fill="#ffb347" opacity={0.95} />
      <path d={`M0,-162 C-7,-170 -5,${-176 - fh * 0.3} ${lean * 0.7},${-166 - fh * 0.6} C5,${-176 - fh * 0.3} 7,-170 0,-162 Z`} fill="#fff3c8" />
      <ellipse cx={0} cy={-164} rx={4} ry={6} fill="#3a6aff" opacity={0.5} />
    </g>
  );
};

/* ---------------- Clock (brass twin-bell alarm) ---------------- */
export const Clock: React.FC<{x: number; y: number; s?: number; t: number; lit?: number}> = ({x, y, s = 1, t, lit = 1}) => {
  const secAng = Math.floor(t) * 6; // ticking second hand
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M${sd * 70},-150 A60,60 0 0 1 ${sd * 70 + 20 * sd},-150`} fill="none" />
          <circle cx={sd * 92} cy={-158} r={42} fill="#3a2c18" />
          <circle cx={sd * 92 - 10} cy={-170} r={16} fill="#c8a96a" opacity={0.25 * lit} />
          <rect x={sd * 70 - 6} y={-128} width={12} height={22} fill="#2a1f10" transform={`rotate(${sd * -30} ${sd * 70} -118)`} />
        </g>
      ))}
      <path d="M-30,-182 Q0,-212 30,-182" stroke="#2a1f10" strokeWidth={10} fill="none" />
      <rect x={-80} y={110} width={20} height={34} rx={6} fill="#1f170c" transform="rotate(20 -70 120)" />
      <rect x={60} y={110} width={20} height={34} rx={6} fill="#1f170c" transform="rotate(-20 70 120)" />
      <circle cx={0} cy={0} r={135} fill="#2c2214" />
      <circle cx={0} cy={0} r={135} fill="none" stroke="#b08f55" strokeOpacity={0.35 * lit} strokeWidth={4} />
      <circle cx={0} cy={0} r={112} fill="#b9b2a0" />
      <circle cx={0} cy={0} r={112} fill="#0b0d12" opacity={0.55} />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * 92} y1={-Math.cos(a) * 92} x2={Math.sin(a) * 104} y2={-Math.cos(a) * 104} stroke="#101010" strokeWidth={i % 3 === 0 ? 7 : 3} />;
      })}
      {['XII', 'III', 'VI', 'IX'].map((n, i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <text key={n} x={Math.sin(a) * 72} y={-Math.cos(a) * 72 + 10} fontSize={26} textAnchor="middle" fill="#111" fontFamily={theme.fonts.caption} fontWeight={600}>
            {n}
          </text>
        );
      })}
      {/* hands at 3:00 */}
      <line x1={0} y1={0} x2={0} y2={-86} stroke="#080808" strokeWidth={7} strokeLinecap="round" />
      <line x1={0} y1={0} x2={58} y2={0} stroke="#080808" strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={14} x2={0} y2={-96} stroke={theme.blood} strokeWidth={2.5} transform={`rotate(${secAng})`} />
      <circle cx={0} cy={0} r={8} fill="#111" />
      {/* glass glint */}
      <path d="M-80,-60 A100,100 0 0 1 -20,-100" stroke="#dfe8f5" strokeOpacity={0.3 * lit} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ---------------- Portrait with mourning ribbon ---------------- */
export const Portrait: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs>
      <radialGradient id="ptr-bg">
        <stop offset="0" stopColor="#8a7458" />
        <stop offset="1" stopColor="#2a2016" />
      </radialGradient>
      <clipPath id="ptr-clip">
        <ellipse cx={0} cy={0} rx={70} ry={92} />
      </clipPath>
    </defs>
    {/* easel back */}
    <path d="M-20,90 L-60,170 M20,90 L60,170" stroke="#1a140e" strokeWidth={8} />
    <ellipse cx={0} cy={0} rx={98} ry={122} fill="#3b2a12" />
    <ellipse cx={0} cy={0} rx={98} ry={122} fill="none" stroke="#c9a35a" strokeOpacity={0.5 * lit} strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={84} ry={106} fill="none" stroke="#1a1006" strokeWidth={12} />
    <g clipPath="url(#ptr-clip)">
      <ellipse cx={0} cy={0} rx={70} ry={92} fill="url(#ptr-bg)" />
      {/* sitter: old woman, hair in a bun, high collar */}
      <circle cx={0} cy={-58} r={18} fill="#2e2418" />
      <ellipse cx={0} cy={-22} rx={30} ry={38} fill="#3a2d1e" />
      <path d="M-30,-30 Q0,-70 30,-30 Q24,-56 0,-60 Q-24,-56 -30,-30 Z" fill="#cfc4b0" opacity={0.6} />
      <path d="M-70,100 Q-60,30 -26,18 Q0,30 26,18 Q60,30 70,100 Z" fill="#1c150d" />
      <path d="M-12,16 L0,40 L12,16" fill="#d8ccb8" opacity={0.5} />
      <ellipse cx={-10} cy={-24} rx={4} ry={2} fill="#120c06" />
      <ellipse cx={10} cy={-24} rx={4} ry={2} fill="#120c06" />
    </g>
    <ellipse cx={-20} cy={-40} rx={30} ry={60} fill="#fff" opacity={0.06 * lit} transform="rotate(-20)" />
    {/* black ribbon across the corner */}
    <path d="M40,-122 L100,-62 L84,-46 L24,-106 Z" fill="#050505" />
    <path d="M62,-84 l-30,40 l10,6 z M62,-84 l40,30 l-8,8 z" fill="#0a0a0a" />
    <path d="M40,-122 L100,-62" stroke="#666" strokeOpacity={0.3 * lit} strokeWidth={2} />
  </g>
);

/* ---------------- Ornate mirror with optional reflection content ---------------- */
export const Mirror: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lit?: number;
  ageSpots?: boolean; // opt out when patina would obscure reflected story evidence
  id: string;
  children?: React.ReactNode; // reflection, drawn in mirror-local coords (0..w, 0..h)
}> = ({x, y, w, h, lit = 1, ageSpots = true, id, children}) => {
  const glass = `M${x},${y + w * 0.35} A${w / 2},${w * 0.35} 0 0 1 ${x + w},${y + w * 0.35} L${x + w},${y + h} L${x},${y + h} Z`;
  const f = 46;
  const outer = `M${x - f},${y + w * 0.35} A${w / 2 + f},${w * 0.35 + f} 0 0 1 ${x + w + f},${y + w * 0.35} L${x + w + f},${y + h + f} L${x - f},${y + h + f} Z`;
  const gold = '#6b5326';
  const goldLit = '#d9b66a';
  return (
    <g>
      <defs>
        <clipPath id={`${id}-glass`}>
          <path d={glass} />
        </clipPath>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={goldLit} stopOpacity={0.6 * lit} />
          <stop offset="0.4" stopColor={gold} />
          <stop offset="1" stopColor="#120c04" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfe8f5" stopOpacity={0.12 * lit} />
          <stop offset="0.35" stopColor="#dfe8f5" stopOpacity="0" />
          <stop offset="0.6" stopColor="#dfe8f5" stopOpacity={0.05 * lit} />
          <stop offset="1" stopColor="#dfe8f5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* crest */}
      <path
        d={`M${x + w / 2},${y - f - 110} C${x + w / 2 + 60},${y - f - 90} ${x + w / 2 + 120},${y - f - 40} ${x + w / 2 + 170},${y - f + 10}
           C${x + w / 2 + 120},${y - f + 0} ${x + w / 2 + 70},${y - f - 30} ${x + w / 2 + 30},${y - f - 20}
           L${x + w / 2},${y - f + 20} L${x + w / 2 - 30},${y - f - 20}
           C${x + w / 2 - 70},${y - f - 30} ${x + w / 2 - 120},${y - f + 0} ${x + w / 2 - 170},${y - f + 10}
           C${x + w / 2 - 120},${y - f - 40} ${x + w / 2 - 60},${y - f - 90} ${x + w / 2},${y - f - 110} Z`}
        fill={`url(#${id}-gold)`}
      />
      <circle cx={x + w / 2} cy={y - f - 50} r={22} fill="#120c04" stroke={goldLit} strokeOpacity={0.4 * lit} strokeWidth={3} />
      <path d={outer} fill={`url(#${id}-gold)`} />
      <path d={outer} fill="none" stroke="#000" strokeWidth={4} />
      {/* beading */}
      <path d={outer} fill="none" stroke={goldLit} strokeOpacity={0.35 * lit} strokeWidth={6} strokeDasharray="4 12" transform={`translate(${w * 0.0},0)`} />
      <path d={glass} fill="#06080c" stroke="#120c04" strokeWidth={14} />
      <g clipPath={`url(#${id}-glass)`}>
        <g transform={`translate(${x},${y})`}>{children}</g>
        <path d={glass} fill={`url(#${id}-sheen)`} />
        {/* age spots / desilvering */}
        {(() => {
          const r = rng(4);
          return Array.from({length: ageSpots ? 18 : 0}, (_, i) => (
            <circle key={i} cx={x + r() * w} cy={y + h * 0.75 + r() * h * 0.25} r={3 + r() * 14} fill="#000" opacity={0.12 + r() * 0.15} style={{filter: 'blur(3px)'}} />
          ));
        })()}
      </g>
      <path d={glass} fill="none" stroke={goldLit} strokeOpacity={0.3 * lit} strokeWidth={2} />
    </g>
  );
};

/* ---------------- Mourning cloth draped over the mirror ---------------- */
export const Cloth: React.FC<{x: number; y: number; w: number; h: number; t: number; pull?: number; grabX?: number; id: string; lit?: number}> = ({
  x,
  y,
  w,
  h,
  t,
  pull = 0,
  grabX,
  id,
  lit = 1,
}) => {
  if (pull >= 1) return null;
  const gx = grabX ?? x + w / 2;
  const drop = pull * pull * (h + 900); // accelerates down as it slides off
  const pinch = Math.min(1, pull * 3); // gathers toward the grabbing hand
  const N = 14;
  const top: string[] = [];
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const px = x - 40 + v * (w + 80);
    const sag = Math.sin(v * Math.PI) * -30;
    const gathered = px + (gx - px) * pinch * 0.5;
    top.push(`${gathered},${y - 60 + sag + drop - Math.abs(px - gx) * pinch * 0.25}`);
  }
  const bottom: string[] = [];
  for (let i = N; i >= 0; i--) {
    const v = i / N;
    const px = x - 70 + v * (w + 140);
    const wave = Math.sin(v * 9 + t * 1.5) * 16 + Math.sin(v * 23) * 8;
    const gathered = px + (gx - px) * pinch * 0.35;
    bottom.push(`${gathered},${y + h * 0.82 + wave + drop * 1.05}`);
  }
  const d = `M${top.join(' L')} L${bottom.join(' L')} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-cf`} x1="0" y1="0" x2="0.085" y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor="#030304" />
          <stop offset="0.4" stopColor="#15161b" />
          <stop offset="0.55" stopColor="#25272e" stopOpacity={lit} />
          <stop offset="0.8" stopColor="#08080a" />
          <stop offset="1" stopColor="#030304" />
        </linearGradient>
        <linearGradient id={`${id}-cv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-cf)`} />
      <path d={d} fill={`url(#${id}-cv)`} />
      <path d={`M${top.join(' L')}`} stroke="#8fa3c0" strokeOpacity={0.18 * lit} strokeWidth={3} fill="none" />
    </g>
  );
};

/* ---------------- Gran: candle-lit profile silhouette, finger to lips ---------------- */
const GRAN_PROFILE = `M120,330 C112,250 118,190 150,120 C180,60 190,-20 176,-90 C160,-160 110,-215 30,-222
  C-40,-228 -95,-195 -112,-130 C-120,-100 -124,-75 -126,-58 C-128,-46 -120,-40 -122,-28
  C-126,-12 -150,14 -176,40 C-184,50 -172,60 -150,60 C-142,62 -138,70 -144,78
  C-150,84 -152,90 -142,96 C-136,100 -148,106 -146,114 C-142,122 -128,124 -128,134
  C-132,150 -134,166 -122,180 C-104,196 -78,196 -62,214 C-54,240 -56,280 -58,330 Z`;

/** Elderly woman in profile, hair in a bun, half-moon glasses, rim-lit by a candle at her left; raises a finger to her lips. */
export const ElderProfile: React.FC<{x: number; y: number; s: number; t: number; finger: number; lean: number}> = ({x, y, s, t, finger, lean}) => {
  const breathe = Math.sin(t * 1.6) * 3;
  const fl = 0.85 + noise1(t * 8, 3) * 0.15;
  return (
    <g transform={`translate(${x},${y + breathe}) rotate(${lean * -7}) scale(${s})`}>
      <defs>
        <linearGradient id="gran-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffc070" stopOpacity={0.95 * fl} />
          <stop offset="0.18" stopColor="#ff8a2a" stopOpacity={0.45 * fl} />
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <clipPath id="gran-clip">
          <path d={GRAN_PROFILE} />
          <circle cx={128} cy={-196} r={64} />
        </clipPath>
      </defs>
      {/* shawl & shoulders */}
      <path d="M-260,760 C-250,520 -170,380 -70,330 L150,320 C300,360 420,520 460,760 Z" fill="#090403" />
      <path d="M-260,760 C-250,520 -170,380 -70,330" stroke="#ff9a40" strokeOpacity={0.5 * fl} strokeWidth={5} fill="none" />
      {/* knitted texture on shawl */}
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M${-200 + i * 30},${760} C${-180 + i * 34},${560} ${-120 + i * 40},${420} ${-40 + i * 40},${350}`} stroke="#2a1208" strokeWidth={3} fill="none" opacity={0.7} />
      ))}
      {/* bun with hairpins */}
      <circle cx={128} cy={-196} r={64} fill="#0b0503" />
      <path d="M100,-250 l40,30 M150,-250 l-20,40" stroke="#c89a64" strokeOpacity={0.5} strokeWidth={3} />
      <path d={GRAN_PROFILE} fill="#0b0503" />
      {/* candle rim on the face edge (inner stroke) */}
      <g clipPath="url(#gran-clip)">
        <path d={GRAN_PROFILE} fill="none" stroke="url(#gran-rim)" strokeWidth={18} />
        <circle cx={128} cy={-196} r={64} fill="none" stroke="url(#gran-rim)" strokeWidth={12} />
      </g>
      {/* hair strands */}
      <path d="M-100,-150 C-60,-215 40,-232 120,-200 M-110,-120 C-80,-190 0,-222 80,-214" stroke="#ffcf9a" strokeOpacity={0.35 * fl} strokeWidth={2} fill="none" />
      {/* half-moon spectacles glint & a wet eye */}
      <path d="M-128,-34 Q-108,-18 -86,-30" stroke="#ffd9a8" strokeOpacity={0.75 * fl} strokeWidth={3} fill="none" />
      <circle cx={-104} cy={-44} r={3.5} fill="#ffe2b8" opacity={0.9} />
      <line x1={-86} y1={-32} x2={40} y2={-60} stroke="#3a1a0c" strokeWidth={2} />
      {/* finger raised to the lips */}
      <g transform={`translate(0,${(1 - finger) * 460})`}>
        <path d="M-196,300 C-200,200 -196,110 -186,80 C-180,64 -162,62 -158,80 C-152,120 -150,220 -146,300 Z" fill="#0d0604" />
        <path d="M-196,300 C-200,200 -196,110 -186,80 C-182,70 -174,66 -168,68" stroke="#ffb45a" strokeOpacity={0.85 * fl} strokeWidth={5} fill="none" />
        <path d="M-236,290 C-250,350 -240,430 -200,470 L-90,470 C-80,420 -90,330 -130,290 Z" fill="#0d0604" />
        <path d="M-236,290 C-250,350 -240,430 -200,470" stroke="#ffb45a" strokeOpacity={0.55 * fl} strokeWidth={5} fill="none" />
        <path d="M-226,330 q20,-6 36,4 M-232,372 q22,-6 40,4" stroke="#ffb45a" strokeOpacity={0.3} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

/** Alias kept for The Count episodes. */
export const GranSilhouette = ElderProfile;

/* ---------------- Duvet edge with a child's small fingers gripping it ---------------- */
export const Duvet: React.FC<{y: number; t: number; warm?: number; grip?: number}> = ({y, t, warm = 0, grip = 1}) => {
  const top = (x: number) => y + Math.sin(x * 0.012 + 1) * 18 + Math.sin(x * 0.031) * 8;
  const pts = Array.from({length: 28}, (_, i) => -40 + i * 45).map((x) => `${x},${top(x)}`);
  const fingers = (cx: number, side: number) =>
    [0, 1, 2, 3].map((i) => {
      const fx = cx + side * i * 34;
      const fy = top(fx) - 20 * grip + Math.sin(t * 3 + i) * 1.5 * grip;
      return (
        <g key={i} transform={`translate(${fx},${fy}) rotate(${side * (i - 1.5) * 4})`}>
          <rect x={-15} y={-6} width={30} height={64} rx={15} fill={warm > 0.5 ? '#d9a27a' : '#7d8090'} />
          <rect x={-15} y={-6} width={30} height={64} rx={15} fill="#000" opacity={0.35} />
          <ellipse cx={0} cy={4} rx={9} ry={8} fill={warm > 0.5 ? '#f0cdb0' : '#a5a9b8'} opacity={0.9} />
          <path d="M-10,22 q10,4 20,0" stroke="#000" strokeOpacity={0.35} strokeWidth={2} fill="none" />
          <path d="M-13,0 q-2,20 0,40" stroke={warm > 0.5 ? '#ffd2a0' : '#c5d2e4'} strokeOpacity={0.5} strokeWidth={3} fill="none" />
        </g>
      );
    });
  return (
    <g>
      <defs>
        <linearGradient id="duvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warm > 0.5 ? '#6a4630' : '#3a4256'} />
          <stop offset="0.15" stopColor={warm > 0.5 ? '#3a2416' : '#1a1f2c'} />
          <stop offset="1" stopColor="#040508" />
        </linearGradient>
      </defs>
      <path d={`M-40,2100 L${pts.join(' L')} L1300,2100 Z`} fill="url(#duvet)" />
      {/* quilting */}
      {[0.12, 0.3, 0.5].map((f, i) => (
        <path key={i} d={`M-40,${y + 140 + i * 130} Q540,${y + 110 + i * 130} 1300,${y + 150 + i * 130}`} stroke="#000" strokeOpacity={0.35} strokeWidth={4} fill="none" />
      ))}
      <path d={`M${pts.join(' L')}`} stroke={warm > 0.5 ? '#ffcf9a' : '#9fb4cf'} strokeOpacity={0.35} strokeWidth={4} fill="none" />
      {fingers(330, -1)}
      {fingers(750, 1)}
    </g>
  );
};

/* ---------------- Gran's hand tipping a tin cup ---------------- */
export const CupHand: React.FC<{x: number; y: number; tilt: number; s?: number; warm?: number}> = ({x, y, tilt, s = 1, warm = 1}) => {
  const skin = warm > 0.5 ? theme.granSkin : '#8d8a86';
  const shade = warm > 0.5 ? theme.granSkinShade : '#3a3836';
  const rim = warm > 0.5 ? '#ffd3a0' : '#c5d2e4';
  const a = (tilt * Math.PI) / 180;
  const rot = (px: number, py: number) => [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)];
  const [wx, wy] = rot(95, 10);
  // forearm: from the wrist out to the upper right, off frame
  const ex = wx + 520;
  const ey = wy - 560;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M${wx - 30},${wy - 70} C${wx + 120},${wy - 200} ${ex - 200},${ey + 120} ${ex - 60},${ey - 60} L${ex + 120},${ey + 80} C${ex - 60},${ey + 260} ${wx + 160},${wy + 40} ${wx + 40},${wy + 80} Z`} fill={skin} />
      <path d={`M${wx + 40},${wy - 100} C${wx + 160},${wy - 230} ${ex - 160},${ey + 60} ${ex - 40},${ey - 100} L${ex + 220},${ey + 120} C${ex},${ey + 300} ${wx + 230},${wy + 30} ${wx + 110},${wy + 70} Z`} fill="#3a1f19" />
      <path d={`M${wx + 40},${wy - 100} C${wx + 160},${wy - 230} ${ex - 160},${ey + 60} ${ex - 40},${ey - 100}`} stroke={rim} strokeOpacity={0.35} strokeWidth={5} fill="none" />
      <path d={`M${wx + 40},${wy - 100} L${wx + 110},${wy + 70}`} stroke="#4e2a20" strokeWidth={26} strokeLinecap="round" />
      <g transform={`rotate(${tilt})`}>
        <defs>
          <linearGradient id="cup-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.6" />
            <stop offset="0.35" stopColor={rim} stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M-150,-70 L50,-70 L40,90 L-140,90 Z" fill="#6d6a66" />
        <path d="M-150,-70 L50,-70 L40,90 L-140,90 Z" fill="url(#cup-sheen)" />
        <ellipse cx={-50} cy={-70} rx={100} ry={18} fill="#1d1b19" />
        <ellipse cx={-50} cy={-70} rx={100} ry={18} fill="none" stroke={rim} strokeOpacity={0.6} strokeWidth={4} />
        <ellipse cx={-50} cy={-66} rx={80} ry={10} fill={theme.rice} opacity={0.8} />
        {/* back of the hand */}
        <path d="M40,-60 C90,-70 120,-30 120,20 C120,60 90,80 50,76 Z" fill={skin} stroke={shade} strokeWidth={4} />
        <path d="M60,-40 C80,-20 84,20 70,50 M80,-46 C100,-20 102,20 92,50" stroke={shade} strokeOpacity={0.5} strokeWidth={2.5} fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path
              d={`M60,${-40 + i * 34} C20,${-48 + i * 34} -40,${-46 + i * 34} -70,${-30 + i * 34} C-80,${-20 + i * 34} -70,${-6 + i * 34} -56,${-10 + i * 34} C-30,${-20 + i * 34} 20,${-16 + i * 34} 60,${-8 + i * 34} Z`}
              fill={skin}
              stroke={shade}
              strokeWidth={4}
            />
            <path d={`M30,${-38 + i * 34} C0,${-42 + i * 34} -40,${-40 + i * 34} -64,${-28 + i * 34}`} stroke={rim} strokeOpacity={0.5} strokeWidth={3} fill="none" />
            <path d={`M-20,${-38 + i * 34} q2,10 0,18 M14,${-38 + i * 34} q2,10 0,18`} stroke={shade} strokeWidth={2} fill="none" />
            <ellipse cx={-64} cy={-20 + i * 34} rx={9} ry={7} fill="#e8cdb8" />
          </g>
        ))}
        <path d="M70,-60 C40,-100 0,-104 -20,-92 C-30,-84 -20,-74 -8,-78 C20,-84 40,-80 60,-50 Z" fill={skin} stroke={shade} strokeWidth={4} />
        <circle cx={90} cy={0} r={5} fill="#6e4636" opacity={0.6} />
        <circle cx={100} cy={30} r={4} fill="#6e4636" opacity={0.5} />
      </g>
    </g>
  );
};
