import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera} from '../../../../kit/common/fx';
import {Cloth, CupHand, Mirror} from '../../../../kit/common/art/Props';
import {Floor, Grain, Wall, pileOf10} from '../../../../kit/common/art/Room';
import {Hand, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {WindowWall} from '../../../../kit/portrait/sets/WindowWall';
import {easeIn, easeOut, lin, mix, noise1, prog, rng, track, W, H} from '../../../../kit/common/util';
import {theme} from '../../../../kit/common/theme';

const Svg: React.FC<{children: React.ReactNode; h?: number}> = ({children, h = H}) => (
  <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

const MX = 220;
const MY = 470;
const MW = 640;
const MH = 1180;

/** A bunch of black cloth hanging below a gripping point. */
const ClothBunch: React.FC<{x: number; y: number; t: number; sway?: number}> = ({x, y, t, sway = 1}) => {
  const s = Math.sin(t * 2.2) * 14 * sway;
  return (
    <g>
      <path
        d={`M${x - 30},${y} C${x - 90 + s},${y + 200} ${x - 150 + s},${y + 420} ${x - 120 + s * 1.5},${y + 620} L${x + 140 + s * 1.5},${y + 640} C${x + 130 + s},${y + 420} ${x + 70 + s},${y + 200} ${x + 30},${y} Z`}
        fill="#07080a"
        stroke="#8fa3c0"
        strokeOpacity={0.35}
        strokeWidth={4}
      />
      {[-60, 0, 60].map((o, i) => (
        <path key={i} d={`M${x + o * 0.2},${y + 20} C${x + o * 0.6 + s},${y + 250} ${x + o + s},${y + 450} ${x + o * 1.2 + s * 1.4},${y + 620}`} stroke="#1f232c" strokeWidth={10} fill="none" opacity={0.8} />
      ))}
    </g>
  );
};

/** What the mirror shows: the room behind, the rice — and the cloth, held by nothing. */
const Reflection: React.FC<{t: number; clothDrop: number; hold: [number, number] | null}> = ({t, clothDrop, hold}) => (
  <g>
    <rect x={-50} y={-50} width={MW + 100} height={MH + 100} fill="#06080d" />
    <g transform={`translate(${MW},0) scale(-1,1)`}>
      <g transform="translate(320,480) scale(0.52) translate(-540,-1180)">
        <WindowWall id="rf" t={t} mode="night" grainsVisible={0} beam={1} />
      </g>
      <Floor id="rff" x={-100} y={860} w={MW + 200} h={500} lit={0.7} />
      {[0, 1, 2, 3, 4, 5].map((i) =>
        pileOf10(90 + (i % 3) * 140, 1000 + Math.floor(i / 3) * 90, 300 + i, 0.8).map((g, j) => <Grain key={`${i}-${j}`} x={g.x} y={g.y} rot={g.rot} s={0.8} lit={0.6} />),
      )}
    </g>
    {hold && (
      <g transform={`translate(${(hold[0] - MX) * 0.72 + MW * 0.12},${(hold[1] - MY) * 0.72 + clothDrop}) scale(0.72)`}>
        <ClothBunch x={0} y={0} t={t} sway={0.6} />
      </g>
    )}
    <rect x={-50} y={-50} width={MW + 100} height={MH + 100} fill="#2a3a55" opacity={0.18} style={{mixBlendMode: 'screen'}} />
  </g>
);

/* S13: pull the cloth; the mirror shows no one */
export const MirrorReveal: React.FC<{t: number}> = ({t}) => {
  const a = 42.81;
  // hand rises, grips, pulls down
  const rise = prog(t, a + 0.05, a + 0.7, easeOut);
  const grip = prog(t, a + 0.65, a + 0.9);
  const pull = prog(t, a + 1.0, a + 1.85, easeIn);
  const away = prog(t, a + 1.85, a + 2.5, easeOut);
  const gx = mix(560, 790, away);
  const gy = mix(2300, 1420, rise) + pull * 500;
  const pose = lerpPose(POSES.reach, POSES.fist, grip);
  const handDown = prog(t, a + 1.8, a + 2.3, easeOut);
  const hy = gy + handDown * 120;
  const holding = t > a + 1.9;
  const push = prog(t, 45.35, 49.99, (x) => x);
  const jolt = t > 48.27 ? Math.exp(-(t - 48.27) * 6) * 0.04 : 0;
  return (
    <Camera t={t} zoom={1 + push * 0.32 + jolt} y={push * -60} shake={5} seed={37}>
      <Svg>
        <Wall id="mrw" x={-200} y={-200} w={1480} h={2400} />
        <Mirror x={MX} y={MY} w={MW} h={MH} id="mr">
          <Reflection t={t} clothDrop={0} hold={holding ? [gx, hy - 220] : null} />
        </Mirror>
        <Cloth x={MX} y={MY} w={MW} h={MH} t={t} pull={pull} grabX={gx} id="mrc" />
        {holding && <ClothBunch x={gx} y={hy - 260} t={t} />}
        <Hand id="mrh" x={gx + 20} y={hy + 230} rot={-4} scale={1.35} style={STYLES.vamp} pose={pose} light={0.8} />
      </Svg>
    </Camera>
  );
};

/* S14: claw marks on the INSIDE of the window frame; Gran's memory double-exposed */
const SCRATCHES = (() => {
  const r = rng(61);
  return Array.from({length: 16}, () => {
    const near = r() < 0.7;
    return {
      x: near ? 300 + r() * 320 : 160 + r() * 520,
      y: near ? 850 + r() * 700 : 300 + r() * 1500,
      len: 150 + r() * 220,
      ang: -38 + r() * 76,
      n: 4,
    };
  });
})();
export const ScratchScene: React.FC<{t: number}> = ({t}) => {
  const a = 49.99;
  const pan = track(t, [
    [a, -150],
    [55.05, 250],
  ]);
  const ghost = prog(t, 52.6, 53.4) * (1 - prog(t, 54.7, 55.05));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.12} y={pan} shake={4} seed={41}>
        <Svg h={2400}>
          <defs>
            <linearGradient id="jamb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0b0907" />
              <stop offset="0.4" stopColor="#2a2219" />
              <stop offset="0.75" stopColor="#1a150f" />
              <stop offset="1" stopColor="#060504" />
            </linearGradient>
          </defs>
          {/* night through the glass on the right */}
          <rect x={760} y={-200} width={500} height={2600} fill="#0b1424" />
          {Array.from({length: 30}, (_, i) => (
            <g key={i} stroke="#030407" strokeWidth={5}>
              <line x1={760} y1={-200 + i * 90} x2={1260} y2={-200 + i * 90 + 500} />
              <line x1={760} y1={300 + i * 90} x2={1260} y2={-200 + i * 90} />
            </g>
          ))}
          {/* wooden casement frame */}
          <rect x={80} y={-200} width={700} height={2600} fill="url(#jamb)" />
          {Array.from({length: 7}, (_, i) => (
            <path key={i} d={`M${120 + i * 95},-200 C${110 + i * 95},400 ${135 + i * 95},1200 ${118 + i * 95},2400`} stroke="#000" strokeOpacity={0.35} strokeWidth={2} fill="none" />
          ))}
          <rect x={740} y={-200} width={40} height={2600} fill="#060504" />
          {/* iron casement latch: pivot plate and a long lever with a knob */}
          <g transform="translate(560,1180)">
            <rect x={-36} y={-70} width={72} height={140} rx={30} fill="#121212" stroke="#6f86a6" strokeOpacity={0.25} strokeWidth={3} />
            <circle cx={0} cy={0} r={16} fill="#2a2a2a" />
            <path d="M0,-8 C-60,10 -120,40 -170,80 L-158,96 C-110,58 -52,30 6,10 Z" fill="#1b1b1b" stroke="#8fa3c0" strokeOpacity={0.35} strokeWidth={2} />
            <circle cx={-170} cy={92} r={20} fill="#1d1d1d" stroke="#8fa3c0" strokeOpacity={0.35} strokeWidth={2} />
            <circle cx={0} cy={-48} r={6} fill="#333" />
            <circle cx={0} cy={48} r={6} fill="#333" />
            <rect x={150} y={-30} width={40} height={60} fill="#101010" />
          </g>
          {/* claw marks: four curved gouges per swipe, splintered pale wood inside */}
          {SCRATCHES.map((s, i) => (
            <g key={i} transform={`translate(${s.x},${s.y}) rotate(${s.ang})`}>
              {Array.from({length: s.n}, (_, j) => {
                const ox = j * 20 - 30;
                const l = s.len * (j === 0 || j === 3 ? 0.78 : 1);
                const bow = 26 + j * 4;
                return (
                  <g key={j}>
                    <path d={`M${ox},${j % 2 ? 8 : 0} Q${ox + bow},${l / 2} ${ox + 6},${l}`} stroke="#000" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9} />
                    <path d={`M${ox + 2},${j % 2 ? 14 : 6} Q${ox + bow + 1},${l / 2} ${ox + 7},${l - 10}`} stroke="#c9ad85" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.6} />
                    <path d={`M${ox + bow * 0.6},${l * 0.3} l10,-14 M${ox + bow * 0.7},${l * 0.6} l12,-10`} stroke="#c9ad85" strokeWidth={1.6} opacity={0.4} />
                  </g>
                );
              })}
            </g>
          ))}
          {/* moonlight raking across */}
          <rect x={80} y={-200} width={700} height={2600} fill="#9fb4cf" opacity={0.07} style={{mixBlendMode: 'screen'}} />
        </Svg>
      </Camera>
      {ghost > 0 && (
        <AbsoluteFill style={{opacity: ghost * 0.42, mixBlendMode: 'screen', filter: 'sepia(1) blur(2px)'}}>
          <Svg>
            <g transform="translate(540,1250) scale(1.7) translate(-540,-1180)">
              <CupHand x={mix(420, 640, prog(t, 52.6, 55))} y={1000} tilt={-36} s={0.5} warm={1} />
            </g>
          </Svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* S17: the window swings open; a grey hand reaches for the dark */
export const OpenWindow: React.FC<{t: number}> = ({t}) => {
  const a = 58.33;
  const open = track(t, [
    [a + 0.15, 0],
    [a + 0.45, 0.08],
    [a + 0.75, 0.06],
    [a + 1.6, 0.92],
    [a + 2.0, 0.85],
  ]);
  const billow = prog(t, a + 0.4, a + 1.4);
  const push = prog(t, a, 61.0, (x) => x);
  const reach = prog(t, a + 1.2, 60.95, easeOut);
  const pose = lerpPose(POSES.relaxed, POSES.reach, reach);
  return (
    <Camera t={t} zoom={1.0 + push * 0.38} y={-120 * push} shake={7} seed={43}>
      <Svg>
        <WindowWall id="ow" t={t} mode="night" open={open} billow={billow} wind={3} cloudCover={0.9} grainsVisible={0} />
        <Hand id="owh" x={mix(700, 600, reach)} y={mix(2500, 1660, reach)} rot={mix(-10, -4, reach)} scale={1.5} style={STYLES.vamp} pose={pose} light={0.9} />
      </Svg>
    </Camera>
  );
};
