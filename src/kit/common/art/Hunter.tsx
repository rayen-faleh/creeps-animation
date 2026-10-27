import React from 'react';
import {noise1} from '../util';

/* The watcher's arsenal after Mick: a side-by-side shotgun that can turn from aiming at the lens to profile, and the
   woman holding it, front-on behind the barrels or in profile. Lit from above by the street lamp (warm rim). */

const RIM = '#ffb45a';

/**
 * Side-by-side shotgun. Origin at the breech. aim 0 = muzzles straight at the camera (two black holes),
 * 1 = profile, pointing right. glint 0..1 = a silver gleam deep in the barrels. len = barrel length in profile.
 */
export const Shotgun: React.FC<{x: number; y: number; s?: number; aim?: number; glint?: number; len?: number; lit?: number; flip?: boolean; stock?: boolean; open?: number}> = ({
  x,
  y,
  s = 1,
  aim = 0,
  glint = 0,
  len = 560,
  lit = 1,
  flip = false,
  stock = true,
  open = 0,
}) => {
  const th = (Math.min(1, Math.max(0, aim)) * Math.PI) / 2;
  const sn = Math.sin(th), cs = Math.cos(th);
  const mx = len * sn; // muzzle x in profile
  const grow = 1 + 0.45 * cs; // muzzles nearer the lens look bigger
  const r = 30 * grow;
  const off = 34 * cs * grow;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* stock (behind the breech, only seen as the gun turns) */}
      {stock && <path d={`M0,-18 L${-300 * sn},${20 + 30 * sn} L${-310 * sn},${80 + 20 * sn} L${-40 * sn},${30} Z`} fill="#2a1a0e" />}
      {stock && <path d={`M0,-18 L${-300 * sn},${20 + 30 * sn}`} stroke={RIM} strokeOpacity={0.35 * lit * sn} strokeWidth={3} />}
      {/* trigger guard */}
      <path d={`M${-50 * sn},28 q${-30 * sn},40 ${-70 * sn},6`} stroke="#14161a" strokeWidth={6} fill="none" opacity={sn} />
      {/* broken open: the breech face with its two chambers, seen as the barrels drop */}
      {open > 0.02 && (
        <g>
          <rect x={-8} y={-40} width={22} height={74} rx={4} fill="#3a3f48" />
          <circle cx={4} cy={-14} r={10} fill="#000" stroke="#c8d3e3" strokeOpacity={0.6 * lit} strokeWidth={2} />
          <circle cx={4} cy={14} r={10} fill="#000" stroke="#c8d3e3" strokeOpacity={0.6 * lit} strokeWidth={2} />
        </g>
      )}
      <g transform={`rotate(${open * 38},20,24)`}>
      {/* barrels */}
      <path d={`M0,-30 L${mx},${-r * 0.9} L${mx},${r * 0.9} L0,30 Z`} fill="#16181d" />
      <path d={`M0,-30 L${mx},${-r * 0.9}`} stroke="#c8d3e3" strokeOpacity={(0.35 + 0.4 * sn) * lit} strokeWidth={4} />
      <path d={`M0,-36 L${mx},${-r - 4}`} stroke="#2a2e36" strokeWidth={8} />
      <circle cx={mx} cy={-r - 8} r={5} fill="#e8eef6" opacity={0.8 * lit} />
      {/* the muzzles */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={mx} cy={0} rx={r * (0.25 + 0.75 * cs) + 2} ry={r} transform={`translate(${k * off},0)`} fill="#3a3f48" />
          <ellipse cx={mx} cy={0} rx={r * (0.25 + 0.75 * cs) + 2} ry={r} transform={`translate(${k * off},0)`} fill="none" stroke="#e8eef6" strokeOpacity={0.55 * lit} strokeWidth={3} />
          <ellipse cx={mx} cy={0} rx={(r - 9) * (0.25 + 0.75 * cs)} ry={r - 9} transform={`translate(${k * off},0)`} fill="#000" />
          {glint > 0 && cs > 0.3 && (
            <circle cx={mx + k * off} cy={4} r={(r - 16) * 0.5} fill="#dfe8f5" opacity={glint * 0.8 * cs} style={{filter: 'blur(3px)'}} />
          )}
        </g>
      ))}
      {cs > 0.3 && <path d={`M${-off * 0.4},${-r} L${off * 0.4},${-r}`} stroke="#16181d" strokeWidth={10} opacity={cs} />}
      </g>
    </g>
  );
};

/**
 * A woman aiming a shotgun straight at the lens: hair pinned up, a long coat, her cheek down on the stock,
 * both muzzles staring out of the frame. Feet off-frame; origin at the breech (between the muzzles).
 */
export const WomanAiming: React.FC<{x: number; y: number; s?: number; t: number; glint?: number; lit?: number; aim?: number}> = ({x, y, s = 1, t, glint = 0, lit = 1, aim = 0.22}) => {
  const breathe = Math.sin(t * 2.2) * 3;
  const sway = noise1(t * 0.8, 3) * 4;
  return (
    <g transform={`translate(${x + sway},${y + breathe}) scale(${s})`}>
      {/* neck and shoulders in proportion to the head (shoulders ~2.6 heads wide); the right shoulder takes the stock */}
      <path d="M-250,900 C-260,600 -250,320 -190,220 C-160,170 -120,140 -104,96 L-104,40 L-36,48 L-30,100 C-10,130 60,150 120,160 C190,176 222,240 228,340 C236,520 226,740 218,900 Z" fill="#06070a" />
      <path d="M-250,900 C-260,600 -250,320 -190,220 C-160,170 -120,140 -104,96" stroke={RIM} strokeOpacity={0.35 * lit} strokeWidth={4} fill="none" />
      <path d="M-30,100 C-10,130 60,150 120,160 C190,176 222,240 228,340" stroke={RIM} strokeOpacity={0.5 * lit} strokeWidth={4} fill="none" />
      {/* head bent down onto the stock, just left of the barrels; hair pinned up in a bun */}
      <g transform="translate(-74,-40) rotate(-12)">
        <ellipse cx={0} cy={0} rx={78} ry={96} fill="#07080b" />
        <circle cx={-8} cy={-104} r={40} fill="#07080b" />
        <path d="M-78,-10 C-76,-70 -34,-100 8,-98 C52,-96 78,-60 78,-10" stroke={RIM} strokeOpacity={0.55 * lit} strokeWidth={5} fill="none" />
        <path d="M-42,-130 C-26,-146 8,-148 26,-130" stroke={RIM} strokeOpacity={0.45 * lit} strokeWidth={3} fill="none" />
        {/* one eye catching the torch, sighting down the rib */}
        <ellipse cx={40} cy={8} rx={9} ry={4.5} fill="#d8c8b0" opacity={0.7 * lit} />
        <circle cx={42} cy={8} r={2.6} fill="#000" />
      </g>
      {/* hands: the left under the barrels, the right at the grip */}
      <path d="M-40,40 C-60,70 -40,100 0,96 C40,92 60,70 50,44 Z" fill="#1a1410" />
      <path d="M-40,40 C-60,70 -40,100 0,96" stroke={RIM} strokeOpacity={0.4 * lit} strokeWidth={3} fill="none" />
      <Shotgun x={-20} y={10} s={1.25} aim={aim} glint={glint} lit={lit} len={520} stock={false} />
    </g>
  );
};

/** The same woman in profile, facing right, the gun shouldered and pointing right. Origin at the breech. */
export const WomanProfileAim: React.FC<{x: number; y: number; s?: number; t: number; lit?: number; finger?: number; lowered?: number; open?: number}> = ({x, y, s = 1, t, lit = 1, lowered = 0, open = 0}) => {
  const breathe = Math.sin(t * 2.2) * 3;
  return (
    <g transform={`translate(${x},${y + breathe}) scale(${s})`}>
      {/* shoulders and coat */}
      <path d="M-420,900 C-430,560 -360,320 -220,240 C-160,206 -120,170 -110,120 L-40,120 C-30,170 10,210 60,230 C120,260 170,320 190,420 C210,560 200,760 190,900 Z" fill="#06070a" />
      <path d="M-40,120 C-30,170 10,210 60,230 C120,260 170,320 190,420" stroke={RIM} strokeOpacity={0.5 * lit} strokeWidth={4} fill="none" />
      {/* neck joining head to shoulders */}
      <path d="M-104,16 L-22,16 L-30,150 L-118,150 Z" fill="#07080b" />
      <path d="M-22,16 L-30,150" stroke={RIM} strokeOpacity={0.4 * lit} strokeWidth={3} />
      {/* head in profile, cheek to the stock, hair pinned up at the back */}
      <g transform={`translate(-60,-10) rotate(${lowered * 16},0,40)`}>
        <path d="M-40,40 C-44,-20 -50,-60 -46,-100 C-40,-160 -10,-186 30,-184 C66,-182 86,-156 90,-120 L96,-98 L92,-86 L104,-64 L92,-58 C96,-46 92,-38 88,-34 C90,-24 84,-12 74,-6 C60,0 40,10 34,40 Z" fill="#07080b" />
        <circle cx={-44} cy={-150} r={34} fill="#07080b" />
        <path d="M30,-184 C66,-182 86,-156 90,-120 L96,-98 L92,-86 L104,-64 L92,-58 C96,-46 92,-38 88,-34 C90,-24 84,-12 74,-6" stroke={RIM} strokeOpacity={0.7 * lit} strokeWidth={4} fill="none" />
        <circle cx={70} cy={-104} r={4} fill="#d8c8b0" opacity={0.8 * lit} />
      </g>
      <g transform={`translate(${lowered * 60},${lowered * 220}) rotate(${lowered * 52},40,60)`}>
        <Shotgun x={40} y={60} s={1} aim={1} lit={lit} open={open} />
        {/* her forward hand under the barrels */}
        <path d="M200,60 C190,96 230,110 260,96 C280,84 276,62 262,58 Z" fill="#1a1410" />
        <path d="M200,60 C190,96 230,110 260,96" stroke={RIM} strokeOpacity={0.4 * lit} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

/** Close on the trigger: the guard, the trigger, a finger curling onto it (squeeze 0..1). Origin at the trigger. */
export const TriggerClose: React.FC<{x: number; y: number; s?: number; squeeze?: number; lit?: number}> = ({x, y, s = 1, squeeze = 0, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* the action and stock */}
    <path d="M-700,-120 L300,-120 L300,-40 L60,-40 C20,-10 -40,10 -120,10 L-700,60 Z" fill="#16181d" />
    <path d="M-700,-120 L300,-120" stroke="#c8d3e3" strokeOpacity={0.4 * lit} strokeWidth={4} />
    <path d="M-700,60 L-120,10 C-40,10 20,-10 60,-40" stroke={RIM} strokeOpacity={0.25 * lit} strokeWidth={3} fill="none" />
    <path d="M-700,-40 L-260,-40 L-400,140 L-700,200 Z" fill="#2a1a0e" />
    {/* trigger guard and trigger */}
    <path d="M60,-40 C80,80 -100,120 -140,10" stroke="#24272e" strokeWidth={14} fill="none" />
    <path d={`M-20,-40 C${-10 - squeeze * 14},10 ${-30 - squeeze * 20},40 ${-50 - squeeze * 24},50`} stroke="#3a3f48" strokeWidth={12} fill="none" strokeLinecap="round" />
    {/* the finger, curling */}
    <path d={`M260,120 C160,110 80,${90 - squeeze * 10} ${10 - squeeze * 30},${60 + squeeze * 4} C${-14 - squeeze * 30},${54 + squeeze * 4} ${-20 - squeeze * 30},${30 + squeeze * 6} ${0 - squeeze * 28},${20 + squeeze * 6} C60,30 160,60 270,70 Z`} fill="#c8a890" />
    <path d={`M260,120 C160,110 80,${90 - squeeze * 10} ${10 - squeeze * 30},${60 + squeeze * 4}`} stroke="#4c3a31" strokeOpacity={0.7} strokeWidth={4} fill="none" />
    <path d={`M${0 - squeeze * 28},${20 + squeeze * 6} C60,30 160,60 270,70`} stroke={RIM} strokeOpacity={0.5 * lit} strokeWidth={3} fill="none" />
  </g>
);
