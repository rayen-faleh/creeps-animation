import React from 'react';
import {lerpColor, noise1, prog, rng} from '../util';

/* Everyday-home props for the "Would you survive?" format: a basin under the mirror, a blackout blind,
   the invisible threshold a vampire can't cross, smoke off skin in sunlight, a phone lock screen,
   and a letting agent's key tag. Same light vocabulary as the rest of the kit. */

/** Pedestal basin seen from standing height: bowl rim, cold tap, plug, pedestal into the dark. */
export const PedestalBasin: React.FC<{x: number; y: number; s?: number; lit?: number; warm?: number}> = ({x, y, s = 1, lit = 1, warm = 0}) => {
  const rim = lerpColor('#9fb4cf', '#ffb45a', warm);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* pedestal */}
      <path d="M-70,90 C-60,300 -80,520 -110,700 L110,700 C80,520 60,300 70,90 Z" fill="#14171c" />
      <path d="M70,90 C60,300 80,520 110,700" stroke={rim} strokeOpacity={0.18 * lit} strokeWidth={4} fill="none" />
      {/* bowl */}
      <path d="M-330,0 C-330,80 -230,150 0,150 C230,150 330,80 330,0 Z" fill="#1d2027" />
      <ellipse cx={0} cy={0} rx={330} ry={62} fill="#2a2e36" />
      <ellipse cx={0} cy={6} rx={280} ry={44} fill="#0b0d11" />
      <ellipse cx={0} cy={22} rx={18} ry={6} fill="#000" stroke={rim} strokeOpacity={0.4 * lit} strokeWidth={2} />
      <path d="M-330,0 C-330,-34 -180,-62 0,-62 C180,-62 330,-34 330,0" stroke={rim} strokeOpacity={0.45 * lit} strokeWidth={4} fill="none" />
      {/* tap */}
      <rect x={-12} y={-130} width={24} height={80} rx={8} fill="#3a3f48" />
      <path d="M0,-128 C0,-160 70,-160 74,-120 L74,-100" stroke="#3a3f48" strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d="M-10,-120 L-10,-60 M4,-150 C30,-162 64,-150 70,-124" stroke={rim} strokeOpacity={0.5 * lit} strokeWidth={3} fill="none" />
      <circle cx={-60} cy={-80} r={20} fill="#3a3f48" />
      <circle cx={60} cy={-80} r={20} fill="#3a3f48" />
    </g>
  );
};

/**
 * Blackout roller blind on a wall-mounted rail: `drop` 0 rolled up .. 1 down to the sill.
 * Light still leaks around the edges (`leak`, the colour of whatever is outside).
 */
export const RollerBlind: React.FC<{id: string; x: number; y: number; w: number; h: number; drop: number; t: number; leak?: number; leakColor?: string; lit?: number}> = ({
  id,
  x,
  y,
  w,
  h,
  drop,
  t,
  leak = 0.5,
  leakColor = '#ffb45a',
  lit = 1,
}) => {
  const d = Math.max(0, Math.min(1, drop));
  const bh = 24 + d * h;
  const sway = Math.sin(t * 7) * 6 * d * (1 - d) * 4;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" x2="1">
          <stop offset="0" stopColor="#14171d" />
          <stop offset="0.5" stopColor="#252a33" />
          <stop offset="1" stopColor="#12151a" />
        </linearGradient>
      </defs>
      {/* light leaking round the edges */}
      {d > 0.05 && (
        <g opacity={leak * d}>
          <rect x={x - 14} y={y + 20} width={12} height={bh} fill={leakColor} style={{filter: 'blur(8px)'}} />
          <rect x={x + w + 2} y={y + 20} width={12} height={bh} fill={leakColor} style={{filter: 'blur(8px)'}} />
          <rect x={x} y={y + 22 + bh} width={w} height={10} fill={leakColor} opacity={d > 0.97 ? 0.8 : 0} style={{filter: 'blur(8px)'}} />
        </g>
      )}
      <path d={`M${x},${y + 20} L${x + w},${y + 20} L${x + w + sway * 0.3},${y + 20 + bh} L${x + sway * 0.3},${y + 20 + bh} Z`} fill={`url(#${id}-cloth)`} />
      {/* faint creases and the bottom bar with its pull cord */}
      {[0.25, 0.5, 0.75].map((k) => (
        <path key={k} d={`M${x + w * k},${y + 30} L${x + w * k + sway * 0.3},${y + 10 + bh}`} stroke="#000" strokeOpacity={0.4} strokeWidth={3} />
      ))}
      <rect x={x - 6 + sway * 0.3} y={y + 12 + bh} width={w + 12} height={18} rx={4} fill="#22262e" />
      <path d={`M${x - 6 + sway * 0.3},${y + 12 + bh} L${x + w + 6 + sway * 0.3},${y + 12 + bh}`} stroke="#9fb4cf" strokeOpacity={0.35 * lit} strokeWidth={2} />
      <path d={`M${x + w / 2 + sway * 0.3},${y + 30 + bh} l0,60`} stroke="#2a2e36" strokeWidth={3} />
      <circle cx={x + w / 2 + sway * 0.3} cy={y + 96 + bh} r={9} fill="#2a2e36" />
      {/* roller housing on the rail */}
      <rect x={x - 30} y={y} width={w + 60} height={40} rx={18} fill="#1a1d23" />
      <path d={`M${x - 20},${y + 6} L${x + w + 20},${y + 6}`} stroke="#9fb4cf" strokeOpacity={0.3 * lit} strokeWidth={2} />
    </g>
  );
};

/** Thin smoke rising off skin in sunlight (a vampire burning). `a` 0..1 strength, deterministic. */
export const Smoke: React.FC<{x: number; y: number; t: number; a: number; w?: number; seed?: number}> = ({x, y, t, a, w = 160, seed = 3}) => {
  if (a <= 0.01) return null;
  const r = rng(seed);
  return (
    <g opacity={a} style={{filter: 'blur(5px)'}}>
      {Array.from({length: 9}, (_, i) => {
        const x0 = x + (r() - 0.5) * w;
        const ph = r() * 10;
        const life = ((t * 0.9 + ph) % 1.6) / 1.6;
        const yy = y - life * 340;
        const dx = noise1(t * 1.4 + ph, seed + i) * 60 * life;
        return (
          <path
            key={i}
            d={`M${x0},${y} C${x0 + dx * 0.4},${y - 100} ${x0 - dx},${yy + 80} ${x0 + dx},${yy}`}
            stroke="#e4dccf"
            strokeOpacity={0.6 * (1 - life)}
            strokeWidth={16 + life * 26}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </g>
  );
};

/**
 * The invisible threshold: a pane of nothing filling a doorway. Faint cold sheen while `a` is up;
 * `touches` are points where hands press, each sending rings outward from its contact time.
 */
export const Threshold: React.FC<{x: number; y: number; w: number; h: number; t: number; a: number; touches?: {x: number; y: number; at: number}[]}> = ({
  x,
  y,
  w,
  h,
  t,
  a,
  touches = [],
}) => (
  <g opacity={a}>
    <rect x={x} y={y} width={w} height={h} fill="#9fb4cf" opacity={0.035} />
    {[0.2, 0.55, 0.8].map((k, i) => (
      <path key={i} d={`M${x + w * k - 80},${y} L${x + w * k + 40},${y + h}`} stroke="#dfe8f5" strokeOpacity={0.05 + 0.03 * Math.sin(t * 2 + i)} strokeWidth={30} />
    ))}
    {touches.map((p, i) => {
      if (t < p.at) return null;
      return [0, 0.35, 0.7].map((d, k) => {
        const age = (t - p.at - d) % 1.4;
        if (t - p.at - d < 0) return null;
        const r = 30 + age * 260;
        return <ellipse key={`${i}-${k}`} cx={p.x} cy={p.y} rx={r} ry={r * 1.15} fill="none" stroke="#cfe0ff" strokeOpacity={0.35 * (1 - age / 1.4)} strokeWidth={4} />;
      });
    })}
  </g>
);

/**
 * Phone lock screen content for `Phone`'s `screen` slot (screen-local coords, 420 x 860 body).
 * scan: time Face ID starts; fail: time it gives up (red text, shake handled by Phone's buzz).
 */
export const LockScreen: React.FC<{t: number; time: string; date: string; scan: number; fail: number}> = ({t, time, date, scan, fail}) => {
  const scanning = t >= scan && t < fail;
  const failed = t >= fail;
  const pulse = 0.6 + 0.4 * Math.sin(t * 10);
  const c = failed ? '#ff5a5a' : '#e6e8ee';
  const f = 'Helvetica, Arial, sans-serif';
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#0d1018" />
      <rect x={14} y={14} width={392} height={832} fill="#2a3550" opacity={0.25} />
      {/* padlock */}
      <g transform="translate(210,110)" opacity={0.9}>
        <rect x={-16} y={-4} width={32} height={26} rx={5} fill="#e6e8ee" />
        <path d="M-10,-4 L-10,-14 C-10,-28 10,-28 10,-14 L10,-4" stroke="#e6e8ee" strokeWidth={5} fill="none" />
      </g>
      <text x={210} y={250} textAnchor="middle" fontFamily={f} fontSize={104} fontWeight={300} fill="#eef0f4">
        {time}
      </text>
      <text x={210} y={296} textAnchor="middle" fontFamily={f} fontSize={26} fill="#c4c8d2">
        {date}
      </text>
      {/* Face ID glyph: four corners and a simple face */}
      <g transform="translate(210,520)" opacity={scanning ? pulse : t >= scan ? 1 : 0.5} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round">
        <path d="M-60,-30 L-60,-60 L-30,-60 M30,-60 L60,-60 L60,-30 M60,30 L60,60 L30,60 M-30,60 L-60,60 L-60,30" />
        {failed ? (
          <path d="M-18,-18 L18,18 M18,-18 L-18,18" strokeWidth={7} />
        ) : (
          <g>
            <path d="M-20,-18 L-20,-8 M20,-18 L20,-8 M0,-14 L0,8 L-8,8 M-22,22 C-10,32 10,32 22,22" />
          </g>
        )}
      </g>
      <text x={210} y={640} textAnchor="middle" fontFamily={f} fontSize={30} fontWeight={600} fill={c} opacity={failed ? prog(t, fail, fail + 0.15) : scanning ? 0.8 : 0}>
        {failed ? 'Face Not Recognised' : 'Scanning…'}
      </text>
      {failed && (
        <text x={210} y={686} textAnchor="middle" fontFamily={f} fontSize={24} fill="#c4c8d2" opacity={prog(t, fail + 0.3, fail + 0.6)}>
          Try Again
        </text>
      )}
      <rect x={150} y={810} width={120} height={8} rx={4} fill="#e6e8ee" opacity={0.7} />
    </g>
  );
};

/** A letting agent's key tag: brass ring, key, white plastic tag with the flat number and the agent's name. */
export const LettingTag: React.FC<{x: number; y: number; s?: number; rot?: number; flat: string; agent: string; lit?: number; warm?: number}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  flat,
  agent,
  lit = 1,
  warm = 0,
}) => {
  const rim = lerpColor('#9fb4cf', '#ffb45a', warm);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {/* ring */}
      <circle cx={0} cy={0} r={34} fill="none" stroke="#6a5a30" strokeWidth={9} />
      <circle cx={0} cy={0} r={34} fill="none" stroke={rim} strokeOpacity={0.4 * lit} strokeWidth={2} />
      {/* key */}
      <g transform="translate(-26,22) rotate(28)">
        <circle cx={0} cy={0} r={22} fill="#3a3a3e" />
        <circle cx={0} cy={0} r={8} fill="#000" />
        <rect x={-6} y={18} width={12} height={120} fill="#3a3a3e" />
        <path d="M6,90 h16 v10 h-8 v10 h8 v12 h-16 Z" fill="#3a3a3e" />
        <path d="M-6,20 L-6,136" stroke={rim} strokeOpacity={0.35 * lit} strokeWidth={2} />
      </g>
      {/* tag */}
      <g transform="translate(18,24) rotate(-10)">
        <path d="M0,0 L230,0 C246,0 252,8 252,22 L252,98 C252,112 246,120 230,120 L0,120 Z" fill={lerpColor('#d8dbe0', '#f0d9b8', warm)} />
        <path d="M0,0 L230,0 C246,0 252,8 252,22 L252,98 C252,112 246,120 230,120 L0,120 Z" fill="#1a2436" opacity={0.4 * (1 - lit * 0.6)} />
        <circle cx={22} cy={60} r={10} fill="#0a0a0c" />
        <rect x={46} y={14} width={190} height={8} fill="#8a0f12" />
        <text x={50} y={70} fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={40} fill="#16181e">
          {flat}
        </text>
        <text x={50} y={104} fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fill="#3a3e48">
          {agent}
        </text>
      </g>
    </g>
  );
};

