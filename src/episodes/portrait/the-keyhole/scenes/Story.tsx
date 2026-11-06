import React from 'react';
import {AbsoluteFill} from 'remotion';
import beats from '../beats.json';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Candle, Clock, Duvet, GranSilhouette} from '../../../../kit/common/art/Props';
import {Hand, HandStyle, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {Wall} from '../../../../kit/common/art/Room';
import {Tree} from '../../../../kit/common/art/Window';
import {easeIn, easeInOut, easeOut, lerpColor, lin, mix, noise1, prog, rng, track, W, H} from '../../../../kit/common/util';

export const B = beats.B;

/* ------------------------------------------------------------------ looks */
const ME: HandStyle = {...STYLES.adult, sleeve: '#1a1d24', cuff: '#262a32'};
const HER: HandStyle = {...STYLES.adult, skin: '#d9bba6', shade: '#7a5646', rim: '#d6e2f4', nail: '#e6b4ac', nailLen: 7, thin: 0.84, fingerLen: 1.06, ring: '#e8c060', sleeve: '#2a2230', cuff: '#3a2e40', sleeveLen: 380};
const HAIR = '#1a120e';

/** Breathing of whatever is behind the door: -1 in .. 1 out. */
const breath = (t: number) => Math.sin(t * Math.PI * 2 * 0.62) * 0.5 + Math.sin(t * Math.PI * 2 * 0.31 + 1) * 0.5;

/* ------------------------------------------------------------------ the door and its keyhole */
const DoorWood: React.FC<{id: string; warm?: number; lit?: number}> = ({id, warm = 0, lit = 1}) => {
  const base = lerpColor('#151210', '#3a2212', warm);
  const hi = lerpColor('#3a4252', '#9a5a26', warm);
  const r = rng(11);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={lerpColor(base, '#000', 0.4)} />
          <stop offset="0.5" stopColor={lerpColor(base, hi, 0.35 * lit)} />
          <stop offset="1" stopColor={lerpColor(base, '#000', 0.5)} />
        </linearGradient>
      </defs>
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={`url(#${id}-wood)`} />
      {Array.from({length: 26}, (_, i) => {
        const x = -500 + i * 80 + (r() - 0.5) * 30;
        return <path key={i} d={`M${x},-600 C${x + (r() - 0.5) * 40},400 ${x + (r() - 0.5) * 40},1400 ${x + (r() - 0.5) * 30},${H + 600}`} stroke="#000" strokeOpacity={0.22} strokeWidth={2 + r() * 4} fill="none" />;
      })}
      {/* panel mouldings */}
      <rect x={-260} y={-420} width={560} height={1080} rx={8} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={18} />
      <rect x={-260} y={-420} width={560} height={1080} rx={8} fill="none" stroke={hi} strokeOpacity={0.18 * lit} strokeWidth={4} transform="translate(-6,-6)" />
      <rect x={-260} y={1160} width={560} height={1080} rx={8} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={18} />
    </g>
  );
};

/**
 * An old brass escutcheon with its keyhole at (x, y). wool: 0 = none, 1 = stuffed tight. bulge: breathing out/in.
 * pull: 0..1 the wool drawn out toward the right. cold: 0..1 cold light pouring out of an open keyhole.
 */
const Keyhole: React.FC<{x: number; y: number; s?: number; t: number; wool?: number; bulge?: number; pull?: number; warm?: number; cold?: number; hair?: number; id: string}> = ({
  x, y, s = 1, t, wool = 1, bulge = 0, pull = 0, warm = 0, cold = 0, hair = 0, id,
}) => {
  const brass = lerpColor('#6a5a3a', '#a07a3a', warm);
  const brassHi = lerpColor('#c8d2e2', '#ffd59a', warm);
  const r = rng(5);
  const fibres = Array.from({length: 46}, () => ({a: r() * Math.PI * 2, d: r(), len: 10 + r() * 26, w: 2 + r() * 3, c: r()}));
  const out = Math.max(0, wool) * (1 + bulge * 0.18);
  const px = pull * 260;
  const py = pull * -40;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-cold`}>
          <stop offset="0" stopColor="#dbe8ff" stopOpacity={0.95} />
          <stop offset="0.4" stopColor="#8fa8d6" stopOpacity={0.35} />
          <stop offset="1" stopColor="#8fa8d6" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* escutcheon plate */}
      <path d="M-70,-190 C-40,-230 40,-230 70,-190 C96,-150 92,-60 84,0 C92,60 96,150 70,190 C40,230 -40,230 -70,190 C-96,150 -92,60 -84,0 C-92,-60 -96,-150 -70,-190 Z" fill={brass} />
      <path d="M-70,-190 C-40,-230 40,-230 70,-190 C96,-150 92,-60 84,0" stroke={brassHi} strokeOpacity={0.55} strokeWidth={5} fill="none" />
      <path d="M-70,190 C-40,230 40,230 70,190" stroke="#000" strokeOpacity={0.5} strokeWidth={6} fill="none" />
      {[-150, 150].map((sy) => (
        <g key={sy}>
          <circle cx={0} cy={sy} r={13} fill={lerpColor(brass, '#000', 0.35)} />
          <path d={`M-8,${sy} L8,${sy}`} stroke="#000" strokeOpacity={0.6} strokeWidth={3} />
          <circle cx={-4} cy={sy - 4} r={4} fill={brassHi} opacity={0.4} />
        </g>
      ))}
      {/* engraved scrolls */}
      <path d="M-40,-120 C-60,-100 -60,-70 -40,-60 M40,-120 C60,-100 60,-70 40,-60 M-40,120 C-60,100 -60,70 -40,60 M40,120 C60,100 60,70 40,60" stroke="#000" strokeOpacity={0.35} strokeWidth={3} fill="none" />
      {/* the hole */}
      <path d="M0,-66 C22,-66 36,-50 36,-30 C36,-14 28,-4 18,2 L30,70 L-30,70 L-18,2 C-28,-4 -36,-14 -36,-30 C-36,-50 -22,-66 0,-66 Z" fill="#020203" />
      {cold > 0 && (
        <g opacity={cold}>
          <path d="M0,-66 C22,-66 36,-50 36,-30 C36,-14 28,-4 18,2 L30,70 L-30,70 L-18,2 C-28,-4 -36,-14 -36,-30 C-36,-50 -22,-66 0,-66 Z" fill="#b8ccf2" />
          <circle cx={0} cy={-10} r={320} fill={`url(#${id}-cold)`} />
          {/* the draught: wisps blowing out */}
          {Array.from({length: 7}, (_, i) => {
            const ph = (t * 0.7 + i / 7) % 1;
            const wob = noise1(t * 2 + i, i) * 40;
            return <path key={i} d={`M0,-10 C${60 + wob},${-30 - i * 6} ${160 + wob},${-60 + i * 12} ${200 + ph * 300},${-20 + (i - 3) * 30}`} stroke="#dbe8ff" strokeOpacity={0.22 * (1 - ph)} strokeWidth={10 - i} fill="none" style={{filter: 'blur(4px)'}} />;
          })}
        </g>
      )}
      {/* the wool tuft, breathing */}
      {out > 0.01 && (
        <g transform={`translate(${px},${py}) scale(${0.6 + out * 0.4})`}>
          <ellipse cx={0} cy={-16} rx={50} ry={44} fill={lerpColor('#4a4844', '#6a5a46', warm)} style={{filter: 'blur(3px)'}} />
          {fibres.map((f, i) => {
            const fx = Math.cos(f.a) * f.d * 38;
            const fy = -16 + Math.sin(f.a) * f.d * 34;
            const rr = 9 + f.len * 0.35;
            return <circle key={i} cx={fx + bulge * Math.cos(f.a) * 4} cy={fy + bulge * Math.sin(f.a) * 4} r={rr} fill={lerpColor(lerpColor('#6e6c66', '#9a8a6e', warm), '#b4b2ac', f.c * 0.6)} opacity={0.85} />;
          })}
          {fibres.slice(0, 28).map((f, i) => {
            const fx = Math.cos(f.a) * 40;
            const fy = -16 + Math.sin(f.a) * 36;
            return <path key={`w${i}`} d={`M${fx},${fy} q${Math.cos(f.a + 1) * 10},${Math.sin(f.a + 1) * 10} ${Math.cos(f.a) * (8 + f.len * 0.4)},${Math.sin(f.a) * (8 + f.len * 0.4)}`} stroke={lerpColor('#8a8882', '#c8b490', warm)} strokeWidth={1.5} fill="none" opacity={0.7} />;
          })}
          <ellipse cx={-14} cy={-34} rx={22} ry={14} fill="#fff" opacity={0.12} style={{filter: 'blur(4px)'}} />
          {/* a long dark hair threaded through it, trailing back into the hole */}
          {hair > 0 && (
            <path d={`M10,-20 C${40 - px * 0.2},${30} ${-px * 0.5 - 20},${-10 - py} ${-px},${-py + 10}`} stroke={HAIR} strokeWidth={5} fill="none" opacity={hair} />
          )}
        </g>
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ S01 the hook: the wool breathes */
export const Hook: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={mix(1.0, 1.1, lin(t, 0, B.door))} shake={2} seed={51}>
      <Stage>
        <g transform="translate(540,820) scale(2.6) translate(-540,-820)">
          <DoorWood id="hookdoor" />
          <Keyhole id="hk" x={540} y={820} t={t} wool={1} bulge={breath(t)} />
        </g>
        {/* moonlight raking across the door */}
        <defs>
          <linearGradient id="rake" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0.85} />
            <stop offset="0.42" stopColor="#9fb4cf" stopOpacity={0.12} />
            <stop offset="0.58" stopColor="#9fb4cf" stopOpacity={0.12} />
            <stop offset="1" stopColor="#000" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#rake)" />
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ S02 pull back: the bedroom door at night */
export const DoorWide: React.FC<{t: number}> = ({t}) => {
  const a = B.door;
  const z = track(t, [[a, 2.6], [a + 1.6, 1.0], [B.gran, 0.96]], easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={z} y={mix(-100, 0, prog(t, a, a + 1.6))} shake={2} seed={52}>
        <Stage overflow>
          <Wall id="bedwall" x={-800} y={-800} w={W + 1600} h={H + 1600} />
          <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="#000" opacity={0.45} />
          {/* door in its frame */}
          <rect x={250} y={200} width={580} height={1300} fill="#0a0806" />
          <g>
            <clipPath id="doorclip"><rect x={270} y={220} width={540} height={1270} /></clipPath>
            <g clipPath="url(#doorclip)">
              <g transform="translate(270,220) scale(0.5)"><DoorWood id="widedoor" lit={0.6} /></g>
            </g>
          </g>
          <rect x={250} y={200} width={580} height={1300} fill="none" stroke="#1a1612" strokeWidth={22} />
          {/* moonlight seeping under it */}
          <rect x={270} y={1478} width={540} height={10} fill="#b8ccf2" opacity={0.7} style={{filter: 'blur(3px)'}} />
          <path d="M270,1490 L810,1490 L1000,1700 L80,1700 Z" fill="#9fb4cf" opacity={0.08} />
          <circle cx={740} cy={860} r={22} fill="#7a6a4a" />
          <Keyhole id="wk" x={740} y={900} s={0.24} t={t} wool={1} bulge={breath(t)} />
          <rect x={-800} y={1500} width={W + 1600} height={800} fill="#0a0c10" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S03 Gran */
export const Gran: React.FC<{t: number}> = ({t}) => {
  const a = B.gran;
  const lean = prog(t, a, a + 2.2);
  const finger = prog(t, a + 0.3, a + 0.9, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lean * 0.06} shake={3} seed={53}>
        <Stage>
          <Wall id="granwall" x={-200} y={-200} w={W + 400} h={H + 400} warm={1} />
          <radialGradient id="granglow" cx="0.15" cy="0.85" r="0.9">
            <stop offset="0" stopColor="#ffa040" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#7a3a12" stopOpacity="0.2" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          <rect x={0} y={0} width={W} height={H} fill="url(#granglow)" />
          <GranSilhouette x={640} y={800} s={mix(1.45, 1.7, lean)} t={t} finger={finger} lean={lean} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(10px)'}}>
        <Stage>
          <Candle x={170} y={2010} t={t} s={1.6} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ paralysis POV: the ceiling */
const Ceiling: React.FC<{t: number; grip?: number}> = ({t, grip = 1}) => (
  <g>
    <defs>
      <clipPath id="ceilwin">
        <path d="M260,700 L260,440 A230,230 0 0 1 395,240 A230,230 0 0 1 530,440 L530,700 Z M560,700 L560,440 A230,230 0 0 1 695,240 A230,230 0 0 1 830,440 L830,700 Z" />
      </clipPath>
      <linearGradient id="ceilg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0d121c" />
        <stop offset="1" stopColor="#020305" />
      </linearGradient>
    </defs>
    <rect x={-600} y={-400} width={2400} height={2800} fill="url(#ceilg)" />
    <path d="M-600,300 L1800,180 L1800,240 L-600,370 Z" fill="#05060a" />
    <path d="M-600,300 L1800,180" stroke="#6f86a6" strokeOpacity={0.18} strokeWidth={3} />
    <g style={{filter: 'blur(5px)'}}>
      <g transform="translate(40,420) skewX(-20) rotate(-10) scale(1.0,1.15)">
        <path d="M260,700 L260,440 A230,230 0 0 1 395,240 A230,230 0 0 1 530,440 L530,700 Z" fill="#8094b4" opacity={0.42} />
        <path d="M560,700 L560,440 A230,230 0 0 1 695,240 A230,230 0 0 1 830,440 L830,700 Z" fill="#8094b4" opacity={0.42} />
        {Array.from({length: 16}, (_, i) => (
          <g key={i} stroke="#05070b" strokeWidth={6} opacity={0.75} clipPath="url(#ceilwin)">
            <line x1={100 + i * 56} y1={220} x2={100 + i * 56 + 480} y2={700} />
            <line x1={100 + i * 56} y1={700} x2={100 + i * 56 + 480} y2={220} />
          </g>
        ))}
        <g opacity={0.85}>
          <Tree x={880} y={760} scale={1.1} rot={-40} t={t * 1.3} which={0} sway={2.2} color="#020305" />
        </g>
      </g>
    </g>
    <Duvet y={1500} t={t} grip={grip} />
  </g>
);
/** Heavy-lidded, pressed-down view: edges dark and soft; press 0..1 pushes the frame down with each breath. */
const Paralysis: React.FC<{t: number; t0: number; press?: number; shadow?: number; children?: React.ReactNode; zoom?: number}> = ({t, t0, press = 0.5, shadow = 0, children, zoom = 1.06}) => {
  const p = Math.max(0, Math.sin((t - t0) * Math.PI * 2 * 0.55)) * press;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={zoom + p * 0.035} y={-p * 26} shake={1.2} seed={54}>
        <Stage overflow>
          <Ceiling t={t} grip={1} />
          {children}
        </Stage>
      </Camera>
      {shadow > 0 && <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 40% at 50% 112%, rgba(0,0,0,${0.95 * shadow}) 0%, rgba(0,0,0,${0.6 * shadow}) 55%, rgba(0,0,0,0) 100%)`}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 52% at 50% 44%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%)'}} />
      <AbsoluteFill style={{backdropFilter: 'blur(0px)', boxShadow: 'inset 0 0 220px 80px rgba(0,0,0,0.8)'}} />
    </AbsoluteFill>
  );
};
export const Weight: React.FC<{t: number}> = ({t}) => <Paralysis t={t} t0={B.weight} press={0.6} shadow={prog(t, B.weight + 1.4, B.block - 0.3)} />;
export const CeilingAgain: React.FC<{t: number}> = ({t}) => <Paralysis t={t} t0={B.cantMove} press={0.35} zoom={1.12} />;

/* ------------------------------------------------------------------ a hand pushing wool into the keyhole */
const Stuff: React.FC<{t: number; a: number; b: number; style: HandStyle; warm: number; mirror?: boolean; shake?: number; seed: number}> = ({t, a, b, style, warm, mirror, shake = 0, seed}) => {
  const push = prog(t, a, b, easeInOut);
  const tremble = noise1(t * 22, seed) * 6 * shake;
  const tipX = mix(mirror ? 300 : 780, 540, prog(t, a - 0.4, a + 0.2, easeOut)) + tremble;
  const tipY = 790 + tremble * 0.6;
  const rot = mirror ? 100 : -100;
  const sc = 1.25;
  const pose = POSES.point;
  const [wx, wy] = wristFor(tipX + (mirror ? -1 : 1) * (1 - push) * 30, tipY, rot, sc, style, pose, mirror);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.06, lin(t, a - 0.6, b + 0.8))} shake={2} seed={seed}>
        <Stage>
          <g transform="translate(540,820) scale(2.2) translate(-540,-820)">
            <DoorWood id={`stuffdoor${seed}`} warm={warm} />
            <Keyhole id={`sk${seed}`} x={540} y={820} t={t} wool={mix(1.35, 0.85, push)} bulge={0} warm={warm} />
          </g>
          <Hand id={`stuffhand${seed}`} x={wx} y={wy} rot={rot} scale={sc} style={style} pose={pose} mirror={mirror} light={0.9} />
          {warm > 0 ? (
            <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#stuffwarm)" />
          ) : (
            <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#stuffcold)" />
          )}
          <defs>
            <radialGradient id="stuffwarm" cx="0.2" cy="0.8" r="1">
              <stop offset="0" stopColor="#ffa040" stopOpacity="0.18" />
              <stop offset="0.6" stopColor="#000" stopOpacity="0.25" />
              <stop offset="1" stopColor="#000" stopOpacity="0.85" />
            </radialGradient>
            <radialGradient id="stuffcold" cx="0.5" cy="0.4" r="0.8">
              <stop offset="0" stopColor="#9fb4cf" stopOpacity="0.08" />
              <stop offset="0.6" stopColor="#000" stopOpacity="0.35" />
              <stop offset="1" stopColor="#000" stopOpacity="0.9" />
            </radialGradient>
          </defs>
        </Stage>
      </Camera>
      {warm > 0 && (
        <AbsoluteFill style={{filter: 'blur(9px)'}}>
          <Stage><Candle x={120} y={1900} t={t} s={1.5} /></Stage>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const GranStuffs: React.FC<{t: number}> = ({t}) => <Stuff t={t} a={B.block + 0.5} b={B.cantLeave + 0.2} style={STYLES.gran} warm={1} seed={55} />;
export const IStuff: React.FC<{t: number}> = ({t}) => <Stuff t={t} a={B.stuffed + 0.6} b={B.stopped - 0.4} style={ME} warm={0} mirror shake={1} seed={56} />;

/* ------------------------------------------------------------------ S06 three a.m. six years ago */
export const ClockShot: React.FC<{t: number; t0: number}> = ({t, t0}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera t={t} zoom={mix(1.0, 1.08, lin(t, t0, t0 + 3))} shake={2} seed={57}>
      <Stage>
        <Wall id="clockwall" x={-200} y={-200} w={W + 400} h={H + 400} />
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={0.55} />
        <rect x={-200} y={1080} width={W + 400} height={60} fill="#1a1614" />
        <Clock x={560} y={860} s={1.6} t={t} hour={3} minute={0} lit={0.6} />
        <Duvet y={1440} t={t} grip={1 + noise1(t * 9, 2) * 0.15} />
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ S08 it stopped; I met my wife */
export const Morning: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={mix(1.04, 1.0, lin(t, B.stopped, B.sameWeek))} shake={2} seed={58}>
      <Stage>
        <g transform="translate(540,820) scale(2.2) translate(-540,-820)">
          <DoorWood id="morndoor" warm={0.6} lit={1.2} />
          <Keyhole id="mk" x={540} y={820} t={t} wool={0.85} warm={0.6} />
        </g>
        <defs>
          <linearGradient id="dawn" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="#ffd8a0" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#ffb070" stopOpacity="0.08" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#dawn)" />
      </Stage>
    </Camera>
  </AbsoluteFill>
);
const HairStrands: React.FC<{x: number; y: number; len: number; t: number; n?: number; spread?: number; fall?: number; seed?: number; width?: number; sheen?: number; wave?: number}> = ({x, y, len, t, n = 18, spread = 120, fall = 1, seed = 3, width = 3, sheen = 0.6, wave = 70}) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const x0 = x + (r() - 0.5) * spread;
        const ph = r() * 6;
        const l = len * (0.7 + r() * 0.3) * fall;
        const sw = noise1(t * 0.8 + ph, seed + i) * 40;
        const wv = wave * (0.7 + r() * 0.6);
        const d = `M${x0},${y} C${x0 + wv + sw * 0.3},${y + l * 0.3} ${x0 - wv + sw},${y + l * 0.62} ${x0 + wv * 0.6 + sw * 1.4},${y + l * 0.8} S${x0 - wv * 0.4 + sw * 1.6},${y + l * 0.95} ${x0 + sw * 1.8},${y + l}`;
        const w = width * (0.6 + r() * 0.8);
        return (
          <g key={i}>
            <path d={d} stroke={HAIR} strokeWidth={w} fill="none" strokeLinecap="round" opacity={0.95} />
            {sheen > 0 && <path d={d} stroke="#a8b8d4" strokeWidth={Math.max(1, w * 0.3)} fill="none" strokeLinecap="round" opacity={sheen * (0.25 + r() * 0.35)} transform="translate(-1,0)" />}
          </g>
        );
      })}
    </g>
  );
};
export const Wife: React.FC<{t: number}> = ({t}) => {
  const a = B.sameWeek;
  const fall = prog(t, B.wife - 0.4, B.wife + 0.9, easeOut);
  const glint = Math.max(0, 1 - Math.abs(t - (B.wife + 0.4)) / 0.35);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.08, lin(t, a, B.asked))} shake={2} seed={59}>
        <Stage>
          <Wall id="wifewall" x={-200} y={-200} w={W + 400} h={H + 400} warm={1} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={0.35} />
          {/* white sheet, morning light */}
          <path d="M-200,700 C200,640 880,660 1280,700 L1280,2200 L-200,2200 Z" fill="#c8b8a0" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-100 + i * 330},720 C${-60 + i * 330},1000 ${-120 + i * 340},1300 ${-80 + i * 330},1900`} stroke="#8a7864" strokeOpacity={0.4} strokeWidth={10} fill="none" />)}
          <Hand id="myhand" x={380} y={1420} rot={20} scale={1.35} style={{...ME, skin: '#c8a48c'}} pose={POSES.relaxed} light={0.8} />
          <Hand id="herhand" x={720} y={1250} rot={-62} scale={1.25} style={{...HER, sleeve: '#d9bba6', cuff: '#d9bba6'}} pose={lerpPose(POSES.relaxed, POSES.flat, 0.5)} light={0.9} />
          <circle cx={560} cy={1050} r={34} fill="#fff6d0" opacity={glint * 0.85} style={{filter: 'blur(6px)'}} />
          {/* her long dark hair falling across the back of my hand */}
          <HairStrands x={640} y={300} len={mix(80, 900, fall)} t={t} n={40} spread={300} seed={8} width={5} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#wifelight)" />
          <defs>
            <radialGradient id="wifelight" cx="0.5" cy="0.45" r="0.8">
              <stop offset="0" stopColor="#ffd8a0" stopOpacity="0.15" />
              <stop offset="1" stopColor="#000" stopOpacity="0.75" />
            </radialGradient>
          </defs>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S09 tonight she asked */
export const Points: React.FC<{t: number}> = ({t}) => {
  const a = B.asked;
  const reach = prog(t, a + 0.2, a + 1.2, easeOut);
  const sc = 1.3;
  const pose = lerpPose(POSES.relaxed, POSES.point, reach);
  const [wx, wy] = wristFor(mix(900, 640, reach), mix(1100, 880, reach), -55, sc, HER, pose);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.05, lin(t, a, B.pulled))} shake={2} seed={60}>
        <Stage>
          <g style={{filter: 'blur(5px)'}}>
            <g transform="translate(540,820) scale(1.4) translate(-540,-820)">
              <DoorWood id="ptdoor" lit={0.8} />
              <Keyhole id="pk" x={540} y={820} t={t} wool={0.85} />
            </g>
          </g>
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={0.25} />
          <Hand id="pointhand" x={wx} y={wy} rot={-55} scale={sc} style={HER} pose={pose} light={1} />
          <HairStrands x={1000} y={-40} len={900} t={t} n={14} spread={120} seed={12} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S10 I pulled it out (and a hair came with it) */
export const PullOut: React.FC<{t: number}> = ({t}) => {
  const a = B.pulled;
  const pull = prog(t, a + 0.35, B.quiet - 0.1, easeInOut);
  const sc = 1.2;
  const pose = lerpPose(POSES.point, POSES.relaxed, 0.25);
  const [wx, wy] = wristFor(560 + pull * 2.2 * 260 * 0.95, 770 - pull * 2.2 * 40, -120, sc, ME, pose);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.04, 1.0, lin(t, a, B.quiet))} shake={2} seed={61}>
        <Stage>
          <g transform="translate(540,820) scale(2.2) translate(-540,-820)">
            <DoorWood id="pulldoor" />
            <Keyhole id="pl" x={540} y={820} t={t} wool={1} pull={pull} hair={prog(t, a + 0.6, a + 1.0)} />
          </g>
          <Hand id="pullhand" x={wx} y={wy} rot={-120} scale={sc} style={ME} pose={pose} light={0.9} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#pullcold)" />
          <defs>
            <radialGradient id="pullcold" cx="0.5" cy="0.4" r="0.8">
              <stop offset="0" stopColor="#9fb4cf" stopOpacity="0.08" />
              <stop offset="0.6" stopColor="#000" stopOpacity="0.3" />
              <stop offset="1" stopColor="#000" stopOpacity="0.9" />
            </radialGradient>
          </defs>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S11 the hair drifts down through the moonlight */
export const HairDrift: React.FC<{t: number}> = ({t}) => {
  const a = B.quiet;
  const p = lin(t, a, B.three);
  const r = rng(21);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={1.05} shake={1.5} seed={62}>
        <Stage>
          <path d="M380,-200 L700,-200 L900,2100 L180,2100 Z" fill="#9fb4cf" opacity={0.22} style={{filter: 'blur(20px)'}} />
          {Array.from({length: 40}, (_, i) => {
            const x = 300 + r() * 500;
            const y = ((r() * 2000 + t * (20 + r() * 30)) % 2000);
            return <circle key={i} cx={x + Math.sin(t + i) * 10} cy={y} r={2 + r() * 2} fill="#cfdcef" opacity={0.25} />;
          })}
          <g transform={`translate(${mix(560, 500, p)},${mix(300, 1100, p)}) rotate(${mix(-20, 25, p)})`}>
            <path d={`M-260,0 C-160,${-60 + Math.sin(t * 2) * 30} -60,${50} 40,${Math.sin(t * 2 + 1) * 30} C140,${-40} 220,${30 + Math.sin(t * 1.7) * 20} 300,${-10}`} stroke="#0a0706" strokeWidth={7} fill="none" />
            <path d={`M-260,0 C-160,${-60 + Math.sin(t * 2) * 30} -60,${50} 40,${Math.sin(t * 2 + 1) * 30} C140,${-40} 220,${30 + Math.sin(t * 1.7) * 20} 300,${-10}`} stroke="#c8d6ee" strokeWidth={2} fill="none" opacity={0.75} transform="translate(0,-2)" />
          </g>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S13 something climbing onto my chest (POV down the bed) */
export const Climb: React.FC<{t: number}> = ({t}) => {
  const a = B.climb;
  const k1 = prog(t, a + 0.3, a + 0.9, easeOut);
  const k2 = prog(t, a + 1.1, a + 1.7, easeOut);
  const crawl = prog(t, a + 1.7, B.reach, easeInOut);
  const dip = k1 * 0.5 + k2 * 0.5;
  const knee = (x: number, y: number, k: number, id: string) => (
    <g key={id} opacity={k}>
      <ellipse cx={x} cy={y + 10} rx={130} ry={56} fill="#000" opacity={0.6} style={{filter: 'blur(14px)'}} />
      <path d={`M${x - 150},${y - 20} C${x - 90},${y - 70} ${x + 90},${y - 70} ${x + 150},${y - 20}`} stroke="#9fb4cf" strokeOpacity={0.35 * k} strokeWidth={6} fill="none" style={{filter: 'blur(2px)'}} />
      <path d={`M${x - 220},${y + 40} C${x - 120},${y + 10} ${x - 60},${y + 70} ${x},${y + 60}`} stroke="#000" strokeOpacity={0.3 * k} strokeWidth={10} fill="none" style={{filter: 'blur(4px)'}} />
      <path d={`M${x + 220},${y + 40} C${x + 120},${y + 10} ${x + 60},${y + 70} ${x},${y + 60}`} stroke="#000" strokeOpacity={0.3 * k} strokeWidth={10} fill="none" style={{filter: 'blur(4px)'}} />
    </g>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={1.08 + dip * 0.05} y={-dip * 30} shake={1.5} seed={63}>
        <Stage>
          <defs>
            <linearGradient id="duvetpov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0d14" />
              <stop offset="0.5" stopColor="#2a3244" />
              <stop offset="1" stopColor="#3a4458" />
            </linearGradient>
          </defs>
          {/* the duvet over my body, receding toward my feet; the room dark beyond */}
          <path d="M-200,520 C200,440 880,440 1280,520 L1280,2200 L-200,2200 Z" fill="url(#duvetpov)" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-200,${700 + i * 260} Q540,${660 + i * 260 - dip * 30} 1280,${710 + i * 260}`} stroke="#000" strokeOpacity={0.3} strokeWidth={5} fill="none" />)}
          <path d="M-200,520 C200,440 880,440 1280,520" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={4} fill="none" />
          {knee(mix(330, 400, crawl), mix(1060, 1260, crawl), k1, 'k1')}
          {knee(mix(720, 650, crawl), mix(760, 1000, crawl), k2, 'k2')}
        </Stage>
      </Camera>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 52% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S14 I tried to reach for my wife */
export const Reach: React.FC<{t: number}> = ({t}) => {
  const a = B.reach;
  const strain = 0.25 + Math.max(0, Math.sin((t - a) * 6)) * 0.12;
  const pose = lerpPose(POSES.relaxed, POSES.reach, strain);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={1.05} x={mix(-60, 60, prog(t, a, B.empty))} rot={-4} shake={1.5} seed={64}>
        <Stage>
          <path d="M-200,600 L1280,560 L1280,2200 L-200,2200 Z" fill="#1c2230" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M-200,${760 + i * 240} Q540,${720 + i * 240} 1280,${740 + i * 240}`} stroke="#000" strokeOpacity={0.35} strokeWidth={5} fill="none" />)}
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#reachlight)" />
          <defs>
            <radialGradient id="reachlight" cx="0.4" cy="0.55" r="0.6">
              <stop offset="0" stopColor="#9fb4cf" stopOpacity="0.16" />
              <stop offset="1" stopColor="#000" stopOpacity="0.7" />
            </radialGradient>
          </defs>
          <Hand id="reachhand" x={260 + noise1(t * 14, 4) * 4} y={1120} rot={78} scale={1.35} style={ME} pose={pose} light={0.8} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 52% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S15 her side: empty, a hair on the pillow */
export const EmptySide: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera t={t} zoom={mix(1.0, 1.08, lin(t, B.empty, B.warm))} shake={2} seed={65}>
      <Stage>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0d14" />
        {/* her pillow with the dent of her head */}
        <rect x={-200} y={-200} width={W + 400} height={480} fill="#14100c" />
        {Array.from({length: 7}, (_, i) => <rect key={i} x={-80 + i * 180} y={-200} width={26} height={470} fill="#0a0806" />)}
        <path d="M-200,280 L1280,280" stroke="#9fb4cf" strokeOpacity={0.25} strokeWidth={4} />
        <path d="M140,420 C120,380 150,350 200,352 C420,330 660,330 880,352 C930,350 960,380 940,420 C960,560 950,700 940,760 C960,800 930,830 880,826 C660,846 420,846 200,826 C150,830 120,800 140,760 C130,700 120,560 140,420 Z" fill="#8a94a6" />
        <path d="M200,352 C420,330 660,330 880,352" stroke="#dbe4f2" strokeOpacity={0.4} strokeWidth={4} fill="none" />
        <ellipse cx={560} cy={590} rx={240} ry={120} fill="#3a4250" opacity={0.65} style={{filter: 'blur(18px)'}} />
        {/* one long dark hair across it */}
        <path d="M260,520 C380,470 470,650 600,590 C720,540 780,660 900,620" stroke={HAIR} strokeWidth={5} fill="none" />
        <path d="M260,520 C380,470 470,650 600,590 C720,540 780,660 900,620" stroke="#c8d6ee" strokeWidth={1.5} fill="none" opacity={0.5} transform="translate(0,-2)" />
        {/* the duvet thrown back */}
        <path d="M-200,960 C200,880 600,1060 1280,920 L1280,2200 L-200,2200 Z" fill="#2a3244" />
        <path d="M-200,960 C200,880 600,1060 1280,920" stroke="#9fb4cf" strokeOpacity={0.35} strokeWidth={5} fill="none" />
        <path d="M100,860 C300,950 500,1100 700,1060" stroke="#000" strokeOpacity={0.4} strokeWidth={14} fill="none" />
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#emptylight)" />
        <defs>
          <radialGradient id="emptylight" cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#9fb4cf" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.75" />
          </radialGradient>
        </defs>
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ S15b-16 the keyhole, open, cold light pouring in */
export const OpenKeyhole: React.FC<{t: number}> = ({t}) => {
  const a = B.warm;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.0, 1.45, easeIn(lin(t, a, B.married)))} shake={2.5} seed={66}>
        <Stage>
          <g transform="translate(540,820) scale(2.4) translate(-540,-820)">
            <DoorWood id="opendoor" lit={0.7} />
            <Keyhole id="ok" x={540} y={820} t={t} wool={0} cold={prog(t, a, a + 0.4)} />
          </g>
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#opendark)" />
          <defs>
            <radialGradient id="opendark" cx="0.5" cy="0.43" r="0.7">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.85" />
            </radialGradient>
          </defs>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S17 the ring, taken off, on the bedside table */
export const Ring: React.FC<{t: number}> = ({t}) => {
  const a = B.married;
  const glint = Math.max(0, 1 - Math.abs(t - (a + 0.55)) / 0.4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.0, 1.12, lin(t, a, B.hair))} shake={1.5} seed={67}>
        <Stage>
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#050608" />
          <path d="M-200,900 L1280,820 L1280,2200 L-200,2200 Z" fill="#1a1410" />
          <path d="M-200,900 L1280,820" stroke="#9fb4cf" strokeOpacity={0.35} strokeWidth={5} />
          {Array.from({length: 8}, (_, i) => <path key={i} d={`M-200,${960 + i * 70} L1280,${880 + i * 70}`} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />)}
          <ellipse cx={560} cy={1010} rx={190} ry={60} fill="#9fb4cf" opacity={0.12} style={{filter: 'blur(16px)'}} />
          <g transform="translate(560,990)">
            <ellipse cx={0} cy={28} rx={86} ry={22} fill="#000" opacity={0.6} />
            <ellipse cx={0} cy={0} rx={80} ry={30} fill="none" stroke="#8a6a2a" strokeWidth={22} />
            <ellipse cx={0} cy={-4} rx={80} ry={30} fill="none" stroke="#e8c060" strokeWidth={14} />
            <path d="M-70,-14 C-40,-34 40,-34 70,-14" stroke="#fff4c8" strokeWidth={4} fill="none" opacity={0.8} />
            <circle cx={-46} cy={-24} r={30} fill="#fff" opacity={glint * 0.9} style={{filter: 'blur(5px)'}} />
          </g>
          {/* a long dark hair beside it */}
          <path d="M700,1060 C780,1030 840,1090 960,1050 C1040,1020 1100,1070 1180,1040" stroke={HAIR} strokeWidth={3} fill="none" />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#ringlight)" />
          <defs>
            <radialGradient id="ringlight" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.85" />
            </radialGradient>
          </defs>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S18 long hair falls across my face */
export const HairFalls: React.FC<{t: number}> = ({t}) => {
  const a = B.hair;
  const fall = prog(t, a + 0.1, B.whisper - 0.3);
  return (
    <Paralysis t={t} t0={a} press={0.7} zoom={1.16}>
      <rect x={-600} y={-400} width={2400} height={2800} fill="#000" opacity={fall * 0.3} />
      <HairStrands x={540} y={-300} len={mix(120, 2600, fall)} t={t} n={110} spread={1400} seed={31} width={7} sheen={1} />
    </Paralysis>
  );
};
