import React from 'react';
import {AbsoluteFill} from 'remotion';
import beats from '../beats.json';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Candle} from '../../../../kit/common/art/Props';
import {GranSilhouette} from '../../../../kit/common/art/Props';
import {Hand, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {Phone, PhoneMsg} from '../../../../kit/common/art/Modern';
import {LockScreen, Smoke} from '../../../../kit/common/art/Home';
import {Wall} from '../../../../kit/common/art/Room';
import {easeIn, easeInOut, easeOut, lerpColor, lin, mix, noise1, prog, rng, track, W, H} from '../../../../kit/common/util';

export const B = beats.B;

/* ------------------------------------------------------------------ shared pieces */

const GREY = {...STYLES.adult, skin: '#9a9ea4', shade: '#41454c', rim: '#d6e2f4', nail: '#b8b4ae', sleeve: '#e4ded2', cuff: '#d2cabb'};
const GRAN = STYLES.gran;

/** A smooth river stone. */
const Stone: React.FC<{x: number; y: number; s?: number; rot?: number; warm?: number}> = ({x, y, s = 1, rot = 0, warm = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={46} ry={32} fill="#5d5a56" />
    <ellipse cx={-6} cy={6} rx={40} ry={24} fill="#3e3c3a" opacity={0.6} />
    <path d="M-38,-8 C-28,-26 10,-32 34,-18" stroke={lerpColor('#c9d4e2', '#ffcf94', warm)} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.75} />
    <ellipse cx={-14} cy={-14} rx={10} ry={5} fill="#fff" opacity={0.25} />
  </g>
);

/** A taper candle that can be blown out (flame 1 -> 0 leaves a curl of smoke). */
const Taper: React.FC<{x: number; y: number; t: number; s?: number; flame?: number; outAt?: number; seed?: number; bend?: number; cold?: boolean}> = ({x, y, t, s = 1, flame = 1, outAt, seed = 1, bend = 0, cold}) => {
  const f = Math.max(0, Math.min(1, flame));
  const fl = noise1(t * 8, seed) * 0.12 + 1;
  const lean = noise1(t * 5, seed + 4) * 4 + bend * 26;
  const fh = 46 * fl * f;
  const smoke = outAt !== undefined && t >= outAt ? Math.max(0, 1 - (t - outAt) / 3.5) : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {f > 0 && <circle cx={lean * 0.5} cy={-250} r={170 * (0.85 + 0.15 * fl)} fill={`url(#taper-glow${cold ? 'c' : ''})`} opacity={f} />}
      <ellipse cx={0} cy={4} rx={54} ry={12} fill="#1c120a" />
      <path d="M-46,0 C-40,-18 40,-18 46,0 Z" fill={cold ? '#4a4038' : '#7a5228'} />
      <rect x={-8} y={-30} width={16} height={22} fill={cold ? '#3a322c' : '#6a4420'} />
      <rect x={-17} y={-210} width={34} height={182} rx={4} fill={cold ? '#b8b2a6' : '#ead2a2'} />
      <rect x={6} y={-210} width={11} height={182} fill="#000" opacity={0.22} />
      <path d="M-17,-206 q6,30 2,52 q8,-16 6,-50 Z" fill={cold ? '#d6d0c4' : '#f8e6c0'} />
      <line x1={0} y1={-210} x2={lean * 0.15} y2={-224} stroke="#140c06" strokeWidth={3} />
      {f > 0 && (
        <g opacity={f}>
          <path d={`M0,-218 C-11,-228 -8,${-236 - fh * 0.45} ${lean},${-222 - fh} C8,${-236 - fh * 0.45} 11,-228 0,-218 Z`} fill="#ffb347" />
          <path d={`M0,-220 C-5,-226 -4,${-232 - fh * 0.3} ${lean * 0.7},${-224 - fh * 0.62} C4,${-232 - fh * 0.3} 5,-226 0,-220 Z`} fill="#fff4cc" />
        </g>
      )}
      <Smoke x={0} y={-226} t={t} a={smoke * 0.7} w={14} seed={seed + 11} />
    </g>
  );
};

const TaperDefs: React.FC = () => (
  <defs>
    <radialGradient id="taper-glow">
      <stop offset="0" stopColor="#ffd28a" stopOpacity={0.5} />
      <stop offset="0.35" stopColor="#ff9a3c" stopOpacity={0.16} />
      <stop offset="1" stopColor="#ff7a20" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="taper-glowc">
      <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.42} />
      <stop offset="0.35" stopColor="#ffae5a" stopOpacity={0.12} />
      <stop offset="1" stopColor="#ff7a20" stopOpacity={0} />
    </radialGradient>
  </defs>
);

/** A white lily on a long stem. Origin at the flower's throat. */
const Lily: React.FC<{x: number; y: number; s?: number; rot?: number; wilt?: number; lit?: number}> = ({x, y, s = 1, rot = 0, wilt = 0, lit = 1}) => {
  const petal = lerpColor('#f2efe6', '#8a6a48', wilt);
  const shade = lerpColor('#c8c2b2', '#5a4430', wilt);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0,10 C10,140 6,300 20,470" stroke={lerpColor('#4f6a44', '#4a4232', wilt)} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M10,220 C50,200 80,220 96,250 C60,250 30,244 10,230 Z" fill={lerpColor('#57744a', '#4a4232', wilt)} />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={i} transform={`rotate(${a + wilt * 10 * (i % 2 ? 1 : -1)})`}>
          <path d={`M0,0 C-26,-40 -24,${-100 + wilt * 30} 0,${-128 + wilt * 40} C24,${-100 + wilt * 30} 26,-40 0,0 Z`} fill={i % 2 ? shade : petal} />
          <path d={`M0,-10 C-4,-50 -2,-90 0,${-120 + wilt * 40}`} stroke={shade} strokeWidth={2} fill="none" opacity={0.6} />
        </g>
      ))}
      <circle cx={0} cy={0} r={18} fill={lerpColor('#e6d9a0', '#6a5030', wilt)} />
      {[-30, 0, 30].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <line x1={0} y1={0} x2={0} y2={-60} stroke="#a89a60" strokeWidth={3} />
          <ellipse cx={0} cy={-64} rx={5} ry={9} fill={lerpColor('#9a4a1a', '#4a3020', wilt)} />
        </g>
      ))}
      <path d="M-20,-100 C-10,-118 10,-118 20,-100" stroke="#fff" strokeOpacity={0.35 * lit * (1 - wilt)} strokeWidth={3} fill="none" />
    </g>
  );
};

/** Quilted white coffin satin: diamond tufts with buttons, lit by a torch at (lx, ly). tears 0..1 shows scratches. */
const Satin: React.FC<{id: string; x: number; y: number; w: number; h: number; lx: number; ly: number; power: number; cell?: number; tears?: number}> = ({id, x, y, w, h, lx, ly, power, cell = 170, tears = 0}) => {
  const cols = Math.ceil(w / cell) + 2;
  const rows = Math.ceil(h / (cell * 0.8)) + 2;
  const ch = cell * 0.8;
  const cells: React.ReactNode[] = [];
  for (let j = -1; j < rows; j++) {
    for (let i = -1; i < cols; i++) {
      const cx = x + i * cell + (j % 2 ? cell / 2 : 0);
      const cy = y + j * ch;
      const d = Math.hypot(cx - lx, cy - ly);
      const lit = power * Math.max(0, 1 - d / 1300);
      const base = lerpColor('#0a0b0e', '#ece8e0', Math.min(1, lit * 1.15));
      cells.push(
        <g key={`${i},${j}`}>
          <path d={`M${cx},${cy - ch} L${cx + cell / 2},${cy} L${cx},${cy + ch} L${cx - cell / 2},${cy} Z`} fill={base} />
          <path d={`M${cx},${cy - ch} L${cx + cell / 2},${cy} L${cx},${cy + ch} L${cx - cell / 2},${cy} Z`} fill={`url(#${id}-puff)`} />
          <path d={`M${cx + cell / 2 - 26},${cy - 20} L${cx + cell / 2},${cy} L${cx + cell / 2 + 26},${cy - 20} M${cx + cell / 2 - 26},${cy + 20} L${cx + cell / 2},${cy} L${cx + cell / 2 + 26},${cy + 20}`} stroke="#000" strokeOpacity={0.35 * Math.min(1, lit * 2)} strokeWidth={3} fill="none" />
          <circle cx={cx + cell / 2} cy={cy} r={13} fill={lerpColor('#050506', '#a8a298', Math.min(1, lit))} />
          <circle cx={cx + cell / 2 - 2} cy={cy - 3} r={3} fill="#fff" opacity={0.5 * lit} />
        </g>,
      );
    }
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-puff`} cx="0.42" cy="0.38" r="0.62">
          <stop offset="0" stopColor="#fff" stopOpacity={0.18 * power} />
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {cells}
        {tears > 0 &&
          [0, 1, 2, 3].map((k) => (
            <path
              key={k}
              d={`M${x + w / 2 - 120 + k * 60},${y + h / 2 - 160 + k * 8} C${x + w / 2 - 110 + k * 60},${y + h / 2 - 40} ${x + w / 2 - 130 + k * 64},${y + h / 2 + 60} ${x + w / 2 - 118 + k * 66},${y + h / 2 + 150 * tears}`}
              stroke="#2a1a14"
              strokeWidth={9 - k}
              strokeLinecap="round"
              fill="none"
              opacity={0.75 * Math.min(1, power * 1.4)}
            />
          ))}
      </g>
    </g>
  );
};

/** The torch: a hot white disc from the phone lens with falloff; screen space. on 0..1. */
const TorchGlow: React.FC<{x: number; y: number; on: number; r?: number}> = ({x, y, on, r = 760}) => (
  <>
    <AbsoluteFill style={{background: `radial-gradient(circle ${r * 1.5}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.25 * on}) 50%, rgba(0,0,0,${0.86 * on + (1 - on)}) 100%)`}} />
    <AbsoluteFill style={{mixBlendMode: 'screen', background: `radial-gradient(circle ${r * 0.7}px at ${x}px ${y}px, rgba(235,242,255,${0.22 * on}) 0%, rgba(0,0,0,0) 100%)`}} />
  </>
);

/** Rain streaks over the frame (screen space). */
const Rain: React.FC<{t: number; amount?: number; slant?: number; seed?: number; color?: string}> = ({t, amount = 1, slant = 0.18, seed = 3, color = '#cfdcef'}) => {
  const r = rng(seed);
  const drops = Array.from({length: Math.round(110 * amount)}, () => ({x: r() * (W + 400) - 200, sp: 1700 + r() * 900, len: 60 + r() * 90, off: r() * 4000, a: 0.12 + r() * 0.22}));
  return (
    <Stage>
      {drops.map((d, i) => {
        const yy = ((d.off + t * d.sp) % (H + 400)) - 200;
        const xx = d.x + yy * slant;
        return <line key={i} x1={xx} y1={yy} x2={xx + d.len * slant} y2={yy + d.len} stroke={color} strokeWidth={2.5} strokeOpacity={d.a} strokeLinecap="round" />;
      })}
    </Stage>
  );
};

const Dark: React.FC<{color?: string}> = ({color = '#000'}) => <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={color} />;

/** Varnished coffin wood (a lid or a side panel). */
const Wood: React.FC<{id: string; x: number; y: number; w: number; h: number; tone?: string; lit?: number; warm?: number}> = ({id, x, y, w, h, tone = '#3a2416', lit = 1, warm = 1}) => {
  const r = rng(77);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-v`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor={lerpColor(tone, '#000', 0.5)} />
          <stop offset="0.45" stopColor={tone} />
          <stop offset="0.6" stopColor={lerpColor(tone, warm ? '#c08850' : '#9fb4cf', 0.22 * lit)} />
          <stop offset="1" stopColor={lerpColor(tone, '#000', 0.6)} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-v)`} />
      {Array.from({length: 14}, (_, i) => {
        const yy = y + (i + 0.5) * (h / 14) + (r() - 0.5) * 20;
        return <path key={i} d={`M${x},${yy} C${x + w * 0.3},${yy + (r() - 0.5) * 30} ${x + w * 0.7},${yy + (r() - 0.5) * 30} ${x + w},${yy + (r() - 0.5) * 20}`} stroke="#000" strokeOpacity={0.18} strokeWidth={2 + r() * 3} fill="none" />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ S01 hook: the stone goes into Grandad's mouth */
export const StoneHook: React.FC<{t: number}> = ({t}) => {
  const sy = track(t, [[0, 760], [0.35, 770], [2.5, 1060], [4.4, 1060]], easeInOut);
  const holding = t < 2.6;
  const handY = holding ? sy : track(t, [[2.6, 1060], [4.2, 600]], easeInOut);
  const pose = holding ? lerpPose(POSES.relaxed, POSES.point, 0.15) : lerpPose(POSES.relaxed, POSES.flat, prog(t, 2.6, 3.0));
  const sc = 1.25;
  const [wx, wy] = wristFor(545, handY, 180, sc, GRAN, pose);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.32, 1.42, lin(t, 0, 4.4))} y={mix(40, 70, lin(t, 0, 4.4))} shake={3} seed={21}>
        <Stage>
          <TaperDefs />
          <Wall id="hookwall" x={-200} y={-200} w={W + 400} h={H + 400} warm={1} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={0.45} />
          <Taper x={150} y={1160} t={t} s={1.5} seed={2} />
          <Taper x={960} y={1120} t={t} s={1.25} seed={5} />
          {/* inside the coffin: the lace pillow and Grandad's profile, face up, just over the rim */}
          <path d="M90,1180 C100,1110 180,1092 300,1100 C340,1120 350,1160 340,1180 Z" fill="#e8dcc6" />
          {Array.from({length: 6}, (_, i) => <circle key={i} cx={110 + i * 40} cy={1104 + Math.abs(i - 2.5) * 4} r={18} fill="#f2e8d4" stroke="#b89a70" strokeOpacity={0.4} strokeWidth={2} />)}
          <path d="M230,1180 C232,1150 250,1128 300,1122 C330,1118 352,1114 372,1104 L388,1092 C400,1076 420,1060 446,1046 C458,1040 466,1046 466,1058 C466,1076 474,1090 490,1096 C500,1098 508,1100 514,1106 C522,1100 532,1100 540,1106 C548,1112 552,1118 548,1124 C560,1120 576,1114 592,1116 C612,1120 628,1134 642,1150 L700,1166 L720,1180 Z" fill="#a49c94" />
          <path d="M300,1122 C330,1118 352,1114 372,1104 L388,1092 C400,1076 420,1060 446,1046 C458,1040 466,1046 466,1058 C466,1076 474,1090 490,1096 C500,1098 508,1100 514,1106 C522,1100 532,1100 540,1106 C548,1112 552,1118 548,1124 C560,1120 576,1114 592,1116 C612,1120 628,1134 642,1150" stroke="#ffc888" strokeOpacity={0.75} strokeWidth={4} fill="none" />
          <path d="M398,1098 C410,1092 424,1092 432,1098" stroke="#5a524c" strokeWidth={3} fill="none" />
          <path d="M240,1150 C260,1120 290,1112 310,1116" stroke="#d8d0c4" strokeWidth={6} fill="none" opacity={0.8} />
          {!holding && <Stone x={530} y={1108} s={0.42} rot={-10} />}
          {/* Gran's hand with the stone */}
          {holding && <Stone x={548} y={sy + 34} s={mix(1.0, 0.45, prog(t, 1.6, 2.5))} rot={-8} />}
          <Hand id="granhand" x={wx} y={wy} rot={180} scale={sc} style={GRAN} pose={pose} light={0.9} />
          {/* the coffin's near side, varnished, with a brass handle bar */}
          <Wood id="hookside" x={-200} y={1180} w={W + 400} h={900} tone="#3a2214" />
          <path d="M-200,1180 L1280,1180" stroke="#ffc888" strokeOpacity={0.55} strokeWidth={6} />
          <path d="M-200,1196 L1280,1196" stroke="#000" strokeOpacity={0.5} strokeWidth={6} />
          <rect x={220} y={1300} width={640} height={22} rx={11} fill="#8a6a3a" />
          <rect x={220} y={1300} width={640} height={8} rx={4} fill="#e8c890" opacity={0.6} />
          {[260, 820].map((bx) => <rect key={bx} x={bx - 14} y={1280} width={28} height={60} rx={8} fill="#6a4e2a" />)}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S02 the wake through a door crack */
export const DoorCrack: React.FC<{t: number}> = ({t}) => {
  const a = B.door;
  const open = track(t, [[a, 0], [a + 0.6, 0.2], [a + 2.4, 1]], easeInOut);
  const gl = mix(440, 300, open);
  const gr = mix(620, 780, open);
  const lean = Math.sin((t - a) * 1.2) * 0.5 + 0.5;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.08, lin(t, a, B.gran))} shake={3} seed={22}>
        <Stage>
          <TaperDefs />
          <Dark />
          <clipPath id="crack">
            <path d={`M${gl},-100 L${gr},-100 L${gr + 30},${H + 100} L${gl - 30},${H + 100} Z`} />
          </clipPath>
          <g clipPath="url(#crack)">
            <Wall id="wakewall" x={-200} y={-200} w={W + 400} h={H + 400} warm={1} />
            <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={0.12} />
            <Taper x={330} y={1060} t={t} s={1.1} seed={7} />
            <Taper x={780} y={1060} t={t} s={1.1} seed={8} />
            {/* the coffin on trestles, side on */}
            <path d="M120,1040 L960,1040 L940,1190 L140,1190 Z" fill="#4a2a16" />
            <path d="M140,1110 L940,1110" stroke="#c8a060" strokeOpacity={0.5} strokeWidth={6} />
            <path d="M120,1040 L960,1040" stroke="#ffc888" strokeOpacity={0.6} strokeWidth={5} />
            <path d="M200,1190 L170,1420 M880,1190 L910,1420 M190,1300 L890,1300" stroke="#120a06" strokeWidth={16} />
            {/* Gran bent over it: bun, hunched back, arm reaching in */}
            <g transform={`translate(560,${1040 - lean * 6}) rotate(${-4 - lean * 3})`}>
              <path d="M-150,0 C-160,-120 -120,-260 -40,-310 C10,-340 70,-330 100,-290 C120,-260 110,-200 80,-150 C60,-100 40,-50 30,0 Z" fill="#0a0503" />
              <circle cx={70} cy={-330} r={52} fill="#0a0503" />
              <circle cx={40} cy={-372} r={28} fill="#0a0503" />
              <path d="M70,-200 C110,-150 150,-90 170,-20" stroke="#0a0503" strokeWidth={38} strokeLinecap="round" fill="none" />
              <path d="M-40,-310 C10,-340 70,-330 100,-290 C120,-260" stroke="#ff9a40" strokeOpacity={0.55} strokeWidth={4} fill="none" />
              <path d="M118,-330 C120,-300 112,-282 100,-272" stroke="#ffb060" strokeOpacity={0.6} strokeWidth={4} fill="none" />
            </g>
          </g>
          {/* the door edges, dark, with a sliver of candlelight on them */}
          <path d={`M${gl},-100 L${gl - 30},${H + 100}`} stroke="#ffb060" strokeOpacity={0.35} strokeWidth={6} />
          <path d={`M${gr},-100 L${gr + 30},${H + 100}`} stroke="#ffb060" strokeOpacity={0.2} strokeWidth={4} />
          {/* my small fingers curled round the door's edge */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${gr + 6 + i * 0.6},${930 + i * 46}) rotate(-90)`}>
              <rect x={-17} y={-6} width={34} height={58} rx={17} fill="#d39b72" />
              <rect x={-17} y={-6} width={34} height={58} rx={17} fill="#000" opacity={0.35} />
              <ellipse cx={0} cy={4} rx={9} ry={8} fill="#f0cdb0" opacity={0.85} />
              <path d="M-15,0 q-2,20 0,40" stroke="#ffcf9a" strokeOpacity={0.6} strokeWidth={3} fill="none" />
            </g>
          ))}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S03 Gran: the dead wake up hungry */
export const GranHush: React.FC<{t: number}> = ({t}) => {
  const a = B.gran;
  const lean = prog(t, a, a + 1.8);
  const finger = prog(t, a + 0.25, a + 0.85, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lean * 0.07} shake={3} seed={23}>
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

/* ------------------------------------------------------------------ S04 linen macro: thread by thread */
const PULLS = [0.0, 0.42, 0.8, 1.15, 1.45];
export const Threads: React.FC<{t: number}> = ({t}) => {
  const a = B.threads;
  const cell = 52;
  const cols = 30;
  const rows = 46;
  const pulled = PULLS.map((p) => prog(t, B.byThread + p - 0.2, B.byThread + p + 0.55, easeIn));
  const pullCol = [9, 14, 11, 17, 7];
  const cells: React.ReactNode[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = -260 + i * cell;
      const y = -300 + j * cell;
      const over = (i + j) % 2 === 0;
      const gone = pullCol.some((c, k) => c === i && pulled[k] > 0 && j < rows * (1 - pulled[k] * 0.0) && pulled[k] > (rows - j) / rows * 0.9);
      if (over && !gone) cells.push(<rect key={`h${i},${j}`} x={x - 2} y={y + 9} width={cell + 4} height={cell - 18} rx={15} fill="url(#weft)" />);
      if (!over && !gone) cells.push(<rect key={`v${i},${j}`} x={x + 9} y={y - 2} width={cell - 18} height={cell + 4} rx={15} fill="url(#warp)" />);
    }
  }
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.12, 1.24, lin(t, a, B.candles))} x={mix(-20, 30, lin(t, a, B.candles))} shake={2} seed={24}>
        <Stage>
          <defs>
            <linearGradient id="weft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4e4c4" />
              <stop offset="0.5" stopColor="#d2b88c" />
              <stop offset="1" stopColor="#6a4e30" />
            </linearGradient>
            <linearGradient id="warp" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6a4e30" />
              <stop offset="0.5" stopColor="#d8bf94" />
              <stop offset="1" stopColor="#5a4028" />
            </linearGradient>
            <radialGradient id="weavelight" cx="0.3" cy="0.75" r="0.9">
              <stop offset="0" stopColor="#ffb050" stopOpacity="0.25" />
              <stop offset="0.6" stopColor="#000" stopOpacity="0.2" />
              <stop offset="1" stopColor="#000" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <Dark color="#1a0e06" />
          <g transform="rotate(-14 540 900)">
            {cells}
            {/* threads drawn up out of the weave, one by one */}
            {pullCol.map((c, k) => {
              const p = pulled[k];
              if (p <= 0) return null;
              const x0 = -260 + c * cell + cell / 2;
              const top = mix(1300, -500, p);
              const wob = Math.sin(t * 9 + k) * 18 * (1 - p);
              return (
                <g key={k}>
                  <path d={`M${x0},${1800} C${x0 + wob},${mix(1500, 600, p)} ${x0 - wob * 2},${mix(1100, 0, p)} ${x0 + 40 * p},${top}`} stroke="#f2e2c0" strokeWidth={13} fill="none" strokeLinecap="round" />
                  <path d={`M${x0},${1800} C${x0 + wob},${mix(1500, 600, p)} ${x0 - wob * 2},${mix(1100, 0, p)} ${x0 + 40 * p},${top}`} stroke="#fff6dc" strokeWidth={3} fill="none" opacity={0.7} />
                  <circle cx={x0 + 40 * p} cy={top} r={26} fill="#fff" opacity={0.6 * (1 - p)} style={{filter: 'blur(6px)'}} />
                </g>
              );
            })}
          </g>
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#weavelight)" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ mantel candle row (the family) */
const CANDLE_X = [170, 355, 540, 725, 910];
export const Mantel: React.FC<{t: number; t0: number; out: number[]; cold?: boolean; push?: number; bend?: number[]; seed?: number}> = ({t, t0, out, cold, push = 0.08, bend, seed = 1}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={1 + lin(t, t0, t0 + 4) * push} y={-30} shake={2.5} seed={25 + seed}>
      <Stage>
        <TaperDefs />
        <Wall id={`mantelwall${seed}`} x={-200} y={-200} w={W + 400} h={H + 400} warm={cold ? 0 : 1} />
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={cold ? 0.55 : 0.4} />
        {/* the mantelpiece */}
        <rect x={-100} y={1210} width={W + 200} height={46} fill={cold ? '#2a2420' : '#3a2214'} />
        <rect x={-100} y={1210} width={W + 200} height={6} fill={cold ? '#9fb4cf' : '#ffc888'} opacity={0.35} />
        <rect x={-60} y={1256} width={W + 120} height={700} fill={cold ? '#141210' : '#1e120a'} />
        <path d="M220,1956 L220,1420 C220,1330 860,1330 860,1420 L860,1956 Z" fill="#050403" />
        {CANDLE_X.map((x, i) => {
          const o = out[i];
          const fl = o === undefined ? 1 : 1 - prog(t, o, o + 0.18);
          return <Taper key={i} x={x} y={1210} t={t} s={1.05} flame={fl} outAt={o} seed={seed * 10 + i} cold={cold} bend={bend ? bend[i] : 0} />;
        })}
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ S06 Gran's chair under a dust sheet */
export const Chair: React.FC<{t: number}> = ({t}) => {
  const a = B.chair;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.07, lin(t, a, B.umbrellas))} shake={2} seed={26}>
        <Stage>
          <Wall id="chairwall" x={-200} y={-200} w={W + 400} h={H + 400} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0d12" opacity={0.25} />
          {/* grey window light on the wall, rain running through it */}
          <path d="M600,260 L1000,320 L1000,1000 L600,1040 Z" fill="#9fb0c6" opacity={0.18} />
          <g opacity={0.5}>
            {Array.from({length: 18}, (_, i) => {
              const r = rng(300 + i);
              const x = 620 + r() * 360;
              const y = ((r() * 900 + (t - a) * (60 + r() * 80)) % 760) + 280;
              return <path key={i} d={`M${x},${y} q4,30 0,${50 + r() * 40}`} stroke="#0a0d12" strokeWidth={5} fill="none" opacity={0.6} />;
            })}
          </g>
          <path d="M790,290 L790,1020 M600,650 L1000,640" stroke="#0a0d12" strokeWidth={14} opacity={0.6} />
          {/* floor */}
          <rect x={-200} y={1420} width={W + 400} height={700} fill="#14161a" />
          {/* the sheeted armchair */}
          <defs>
            <linearGradient id="sheet" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#6e6c68" />
              <stop offset="0.55" stopColor="#c8c4ba" />
              <stop offset="1" stopColor="#7a7872" />
            </linearGradient>
          </defs>
          <path d="M250,1500 C240,1300 230,1130 250,1050 C230,1000 240,960 290,960 C300,800 330,640 420,600 C500,570 620,570 700,600 C780,640 800,800 800,960 C850,960 860,1000 840,1050 C860,1130 850,1300 840,1490 C700,1505 400,1505 250,1490 Z" fill="url(#sheet)" />
          {[[330, 980, 300, 1500], [470, 640, 430, 1500], [620, 630, 650, 1500], [770, 980, 800, 1500], [290, 1050, 380, 1180]].map(([x1, y1, x2, y2], i) => (
            <path key={i} d={`M${x1},${y1} C${x1 + 10},${(y1 + y2) / 2} ${x2 - 10},${(y1 + y2) / 2} ${x2},${y2}`} stroke="#4a4844" strokeWidth={6} fill="none" opacity={0.5} />
          ))}
          <path d="M420,600 C500,570 620,570 700,600 C780,640 800,800 800,960" stroke="#e4e2dc" strokeWidth={5} fill="none" opacity={0.6} />
          <ellipse cx={545} cy={1515} rx={330} ry={26} fill="#000" opacity={0.55} />
          {[300, 790].map((x) => <path key={x} d={`M${x - 14},1490 L${x - 10},1540 L${x + 12},1540 L${x + 16},1490 Z`} fill="#3a2414" />)}
          {[300, 790].map((x) => <circle key={`b${x}`} cx={x + 1} cy={1542} r={10} fill="#8a6a3a" />)}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S07 the funeral from above: umbrellas round the grave */
const UMB = [
  [300, 520, 160], [640, 430, 175], [900, 620, 150], [210, 960, 170], [960, 1040, 165], [330, 1380, 160], [720, 1420, 175],
];
const Umbrella: React.FC<{x: number; y: number; r: number; rot: number; t: number; seed: number}> = ({x, y, r, rot, t, seed}) => {
  const pts = Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const rr = rng(seed);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <ellipse cx={18} cy={24} rx={r * 1.05} ry={r * 1.05} fill="#000" opacity={0.45} />
      {pts.map(([px, py], i) => {
        const [qx, qy] = pts[(i + 1) % 8];
        const shade = 0.06 + ((i + 2) % 8) / 8 * 0.18;
        return <path key={i} d={`M0,0 L${px},${py} Q${(px + qx) * 0.47},${(py + qy) * 0.47} ${qx},${qy} Z`} fill={lerpColor('#07080a', '#5a6270', shade)} />;
      })}
      {pts.map(([px, py], i) => <line key={`r${i}`} x1={0} y1={0} x2={px} y2={py} stroke="#9fb4cf" strokeOpacity={0.25} strokeWidth={2} />)}
      <circle cx={0} cy={0} r={8} fill="#2a2c30" />
      {/* drops landing: little rings */}
      {Array.from({length: 6}, (_, i) => {
        const ph = (t * 1.6 + rr() * 3) % 1;
        const a = rr() * Math.PI * 2;
        const d = rr() * r * 0.85;
        return <circle key={`d${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={4 + ph * 14} stroke="#cfdcef" strokeOpacity={0.5 * (1 - ph)} strokeWidth={2} fill="none" />;
      })}
    </g>
  );
};
export const Umbrellas: React.FC<{t: number}> = ({t}) => {
  const a = B.umbrellas;
  const lt = t - a;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.12, lin(t, a, B.lid))} rot={mix(-2, 5, lin(t, a, B.lid))} shake={2} seed={27}>
        <Stage>
          <Dark color="#1a2018" />
          {Array.from({length: 160}, (_, i) => {
            const r = rng(500 + i);
            return <ellipse key={i} cx={r() * W} cy={r() * H} rx={20 + r() * 60} ry={10 + r() * 30} fill={r() > 0.5 ? '#232a20' : '#141812'} opacity={0.7} />;
          })}
          {/* the grave and the coffin down in it */}
          <rect x={360} y={700} width={360} height={560} fill="#0c0806" />
          <rect x={360} y={700} width={360} height={560} fill="none" stroke="#3a2a1a" strokeWidth={22} />
          <path d="M410,760 L670,760 L700,880 L680,1220 L400,1220 L380,880 Z" fill="#2a1a10" />
          <path d="M530,860 L550,860 L550,920 L590,920 L590,940 L550,940 L550,1060 L530,1060 L530,940 L490,940 L490,920 L530,920 Z" fill="#a08050" opacity={0.7} />
          <ellipse cx={890} cy={860} rx={120} ry={70} fill="#2a1e14" />
          {UMB.map(([x, y, r], i) => (
            <Umbrella key={i} x={x} y={y} r={r} rot={lt * (i % 2 ? 6 : -5) + i * 17} t={t} seed={40 + i} />
          ))}
        </Stage>
      </Camera>
      <Rain t={t} amount={0.9} slant={0.06} seed={7} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S08-09 the coffin lid in the rain; a lily; soil */
const Beads: React.FC<{t: number; t0: number; n?: number; seed?: number}> = ({t, t0, n = 70, seed = 9}) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const x = 140 + r() * 800;
        const y = 120 + r() * 1700;
        const at = t0 + r() * 3.5;
        const ap = prog(t, at, at + 0.15);
        const sz = 5 + r() * 9;
        return ap > 0 ? (
          <g key={i} opacity={ap}>
            <ellipse cx={x} cy={y} rx={sz} ry={sz * 0.8} fill="#0a0806" opacity={0.4} />
            <ellipse cx={x - sz * 0.25} cy={y - sz * 0.25} rx={sz * 0.4} ry={sz * 0.3} fill="#e8eef8" opacity={0.7} />
          </g>
        ) : null;
      })}
    </g>
  );
};
const Lid: React.FC<{t: number}> = ({t}) => (
  <g>
    <Wood id="lid" x={-200} y={-200} w={W + 400} h={H + 400} tone="#3a2416" warm={0} />
    <rect x={380} y={560} width={320} height={130} rx={10} fill="#8a7448" />
    <rect x={380} y={560} width={320} height={130} rx={10} fill="none" stroke="#d8c08a" strokeOpacity={0.5} strokeWidth={4} />
    {[600, 630, 655].map((y, i) => <rect key={y} x={430 + i * 12} y={y} width={220 - i * 24} height={8} rx={4} fill="#3a2e1a" opacity={0.6} />)}
  </g>
);
export const LidRain: React.FC<{t: number}> = ({t}) => {
  const a = B.lid;
  const drop = B.mum + 0.2;
  const fall = prog(t, drop, drop + 0.7, easeIn);
  const land = t >= drop + 0.7;
  const bounce = land ? Math.sin((t - drop - 0.7) * 14) * 14 * Math.exp(-(t - drop - 0.7) * 5) : 0;
  const gloveY = track(t, [[B.mum - 0.5, -500], [B.mum - 0.05, -40], [drop + 0.5, -40], [drop + 1.4, -560]], easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.05, 1.12, lin(t, a, B.nostone))} shake={2} seed={28}>
        <Stage>
          <Lid t={t} />
          <Beads t={t} t0={a - 2} n={90} />
          {/* the gloved hand that lets the lily go */}
          <g transform={`translate(560,${gloveY})`}>
            <path d="M-70,-600 L-60,40 C-60,110 70,110 70,40 L80,-600 Z" fill="#0b0b0d" />
            <path d="M-60,40 C-70,90 -30,140 0,150 C30,140 70,90 70,40" fill="#16161a" />
            <path d="M-60,-600 L-50,40" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={4} />
          </g>
          {t >= drop - 0.4 && (
            <Lily x={mix(560, 520, fall)} y={(land ? 1060 : mix(60, 1060, fall)) - bounce} s={1.25} rot={mix(170, 112, fall) + bounce * 0.4} />
          )}
        </Stage>
      </Camera>
      <Rain t={t} amount={0.7} slant={0.05} seed={11} />
    </AbsoluteFill>
  );
};
const CLODS = (() => {
  const r = rng(91);
  return Array.from({length: 46}, (_, i) => ({x: 120 + r() * 840, y: 160 + r() * 1300, rx: 40 + r() * 90, ry: 26 + r() * 60, wave: i % 3, rot: r() * 180}));
})();
export const Soil: React.FC<{t: number}> = ({t}) => {
  const a = B.nostone;
  const waves = [a + 0.05, a + 0.75, a + 1.4];
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(0.82, 0.98, lin(t, a, B.phone))} shake={2.5} seed={29}>
        <Stage>
          <Lid t={t} />
          <Beads t={t} t0={a - 10} n={90} />
          <Lily x={520} y={1060} s={1.25} rot={112} />
          {CLODS.map((c, i) => {
            const at = waves[c.wave] + (i % 7) * 0.03;
            const p = prog(t, at, at + 0.22, easeIn);
            if (p <= 0) return null;
            return (
              <g key={i} transform={`translate(${c.x},${c.y}) rotate(${c.rot}) scale(${mix(1.6, 1, p)})`} opacity={Math.min(1, p * 2)}>
                <ellipse cx={0} cy={0} rx={c.rx} ry={c.ry} fill="#2a1a10" />
                <ellipse cx={-c.rx * 0.2} cy={-c.ry * 0.3} rx={c.rx * 0.5} ry={c.ry * 0.35} fill="#4a3220" opacity={0.7} />
                {[0, 1, 2].map((k) => <circle key={k} cx={c.rx * (0.6 - k * 0.5)} cy={c.ry * (0.5 - k * 0.3)} r={6 + k * 2} fill="#1a100a" />)}
              </g>
            );
          })}
          {/* the grave walls closing the frame: we're looking down into it */}
          <path d={`M-400,-400 L${W + 400},-400 L${W + 400},${H + 400} L-400,${H + 400} Z M60,40 L1020,40 L1020,1840 L60,1840 Z`} fill="#140c08" fillRule="evenodd" />
          <path d="M60,40 L1020,40 L1020,1840 L60,1840 Z" fill="none" stroke="#3a2818" strokeWidth={30} />
        </Stage>
      </Camera>
      <Rain t={t} amount={0.6} slant={0.04} seed={13} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ phone scenes: Mum's texts */
const MUM: PhoneMsg[] = [
  {lines: ['Rob passed last night.', 'In his sleep.'], at: B.uncle + 0.15},
  {lines: ['Same as you.'], at: B.uncle + 1.05},
  {lines: ["June's gone too.", "I can't lose anyone", 'else.'], at: B.aunt + 0.1},
];
const LAST: PhoneMsg = {lines: ['Goodnight love.', "I'll come and see you", 'tomorrow x'], at: B.texted + 0.25};
const phoneSkin = {skin: GREY.skin, shade: GREY.shade, nail: GREY.nail, sleeve: '#d8d0c0'};

export const Texts: React.FC<{t: number}> = ({t}) => {
  const a = B.phone;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.0, 1.06, lin(t, a, B.auntEnd))} shake={3} seed={30}>
        <Stage>
          <Phone id="mum" t={t} x={278} y={150} s={1.25} from="Mum" clock="22:41" msgs={MUM} buzz={MUM.map((m) => m.at - 0.05)} {...phoneSkin} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** POV down the body: the phone glowing in grey hands on a white linen front. Black above. */
const ChestPhone: React.FC<{t: number; msgs: PhoneMsg[]; screen?: React.ReactNode; dim?: number; seed?: number; clock?: string; zoom?: number}> = ({t, msgs, screen, dim = 1, seed = 31, clock = '02:59', zoom = 1}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera t={t} zoom={zoom} shake={2} seed={seed}>
      <Stage>
        {/* linen over the chest, only where the screen lights it */}
        <defs>
          <radialGradient id={`chestlight${seed}`} cx="0.5" cy="0.55" r="0.55">
            <stop offset="0" stopColor="#c6d2e6" stopOpacity={0.55 * dim} />
            <stop offset="0.7" stopColor="#c6d2e6" stopOpacity={0.08 * dim} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d="M-200,820 C100,700 980,700 1280,820 L1280,2200 L-200,2200 Z" fill={lerpColor('#000', '#9aa2ae', 0.55 * dim)} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${-100 + i * 240},780 C${-60 + i * 240},1100 ${-120 + i * 250},1500 ${-80 + i * 250},2000`} stroke="#000" strokeOpacity={0.35} strokeWidth={10} fill="none" />
        ))}
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#chestlight${seed})`} />
        <Phone id={`chest${seed}`} t={t} x={330} y={520} s={0.98} rot={-4} from="Mum" clock={clock} msgs={msgs} screen={screen} {...phoneSkin} />
        {dim < 1 && <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={1 - dim} />}
      </Stage>
    </Camera>
  </AbsoluteFill>
);

export const Tired: React.FC<{t: number}> = ({t}) => <ChestPhone t={t} msgs={MUM} seed={32} zoom={mix(1.0, 1.05, lin(t, B.tired, B.three))} clock="22:43" />;

export const Three: React.FC<{t: number}> = ({t}) => {
  const dim = 1 - prog(t, B.jaw + 0.2, B.chew - 0.05);
  return (
    <ChestPhone
      t={t}
      msgs={[]}
      seed={33}
      dim={dim}
      zoom={mix(1.12, 1.2, lin(t, B.three, B.chew))}
      screen={<LockScreen t={t} time="3:00" date="Tuesday 14 November" scan={999} fail={1000} />}
    />
  );
};

/* ------------------------------------------------------------------ S14 dark: something chewing, close */
export const Chewing: React.FC<{t: number}> = ({t}) => {
  const a = B.chew;
  const cyc = (t - a) / 0.62;
  const jaw = Math.max(0, Math.sin(cyc * Math.PI * 2));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.1, 1.2, lin(t, a, B.grave))} shake={1.5} seed={34}>
        <Stage>
          <defs>
            <radialGradient id="chewlight" cx="0.5" cy="0.2" r="0.7">
              <stop offset="0" stopColor="#6a7488" stopOpacity={0.5} />
              <stop offset="1" stopColor="#000" stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* a fold of white cloth right under the eye, moving with each chew */}
          <path d={`M-200,${300 - jaw * 26} C200,${360 - jaw * 40} 600,${250 - jaw * 30} 1280,${330 - jaw * 20} L1280,2100 L-200,2100 Z`} fill="#2a2e36" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${-100 + k * 330},${340 - jaw * 30} C${-60 + k * 330},800 ${-140 + k * 340},1300 ${-90 + k * 330},2000`} stroke="#0a0b0e" strokeWidth={22} fill="none" opacity={0.7} />
          ))}
          {/* loose threads at its edge, twitching up toward the mouth */}
          {Array.from({length: 9}, (_, i) => {
            const x = 160 + i * 95;
            const up = jaw * (40 + (i % 3) * 30);
            return <path key={i} d={`M${x},${320 - jaw * 30} C${x + 10},${250 - up} ${x - 20},${170 - up} ${x + 6},${80 - up * 1.4}`} stroke="#9aa4b6" strokeWidth={3} fill="none" opacity={0.6} />;
          })}
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#chewlight)" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S15 the new grave at night, rain */
export const GraveNight: React.FC<{t: number}> = ({t}) => {
  const a = B.grave;
  const p = lin(t, a, B.thread);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.35, easeIn(p))} y={mix(0, 160, p)} shake={3} seed={35}>
        <Stage>
          <defs>
            <linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a1220" />
              <stop offset="1" stopColor="#1a2436" />
            </linearGradient>
          </defs>
          <rect x={-200} y={-200} width={W + 400} height={1200} fill="url(#nightsky)" />
          <circle cx={780} cy={300} r={70} fill="#d9e2ec" opacity={0.5} style={{filter: 'blur(8px)'}} />
          <path d="M-200,820 C100,760 300,800 540,780 C800,760 1000,800 1280,770 L1280,2200 L-200,2200 Z" fill="#0e140e" />
          {/* yews and old stones far off */}
          {[[60, 760, 120], [960, 740, 150], [180, 800, 80]].map(([x, y, r], i) => <path key={i} d={`M${x - r * 0.6},${y} C${x - r},${y - r * 1.2} ${x - r * 0.2},${y - r * 3} ${x},${y - r * 3.2} C${x + r * 0.2},${y - r * 3} ${x + r},${y - r * 1.2} ${x + r * 0.6},${y} Z`} fill="#05080a" />)}
          {[[330, 790], [700, 775], [860, 800]].map(([x, y], i) => <path key={i} d={`M${x - 26},${y} L${x - 26},${y - 60} C${x - 26},${y - 90} ${x + 26},${y - 90} ${x + 26},${y - 60} L${x + 26},${y} Z`} fill="#1e2630" />)}
          {/* the new grave: a mound of wet soil, a wooden marker, Mum's lily wilting */}
          <path d="M150,1300 C200,1120 380,1060 540,1060 C700,1060 880,1120 930,1300 Z" fill="#2a1c12" />
          <path d="M200,1200 C320,1110 440,1090 540,1090 C640,1090 760,1110 880,1200" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={5} fill="none" />
          {Array.from({length: 30}, (_, i) => {
            const r = rng(700 + i);
            return <ellipse key={i} cx={220 + r() * 640} cy={1120 + r() * 170} rx={14 + r() * 22} ry={8 + r() * 12} fill="#1a100a" />;
          })}
          <rect x={526} y={820} width={28} height={300} fill="#3a2a1a" />
          <rect x={470} y={880} width={140} height={26} fill="#3a2a1a" />
          <path d="M554,820 L554,1120" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={3} />
          <Lily x={640} y={1140} s={0.8} rot={-70} wilt={0.65} lit={0.4} />
          <rect x={-200} y={1300} width={W + 400} height={900} fill="#0b100b" />
        </Stage>
      </Camera>
      <Rain t={t} amount={1} slant={0.12} seed={17} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S16 thread between my teeth */
export const ThreadPull: React.FC<{t: number}> = ({t}) => {
  const a = B.thread;
  const p = prog(t, a + 0.15, B.torch - 0.1, easeInOut);
  const tipY = mix(1500, 520, p);
  const tipX = 600 + Math.sin(t * 3) * 10;
  const sc = 1.75;
  const pose = lerpPose(POSES.point, POSES.relaxed, 0.35);
  const [wx, wy] = wristFor(tipX, tipY, -10, sc, GREY, pose);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={1.02} shake={2} seed={36}>
        <Stage>
          <defs>
            <radialGradient id="pullglow" cx="0.5" cy="1.0" r="0.9">
              <stop offset="0" stopColor="#b8c8e6" stopOpacity={0.5} />
              <stop offset="1" stopColor="#000" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#pullglow)" />
          <path d={`M${tipX - 18},${tipY + 20} C${tipX - 40},${mix(1700, 1200, p)} ${tipX + 30},${mix(1900, 1600, p)} 560,${H + 200}`} stroke="#f2f0ea" strokeWidth={4} fill="none" />
          <path d={`M${tipX - 18},${tipY + 20} C${tipX - 40},${mix(1700, 1200, p)} ${tipX + 30},${mix(1900, 1600, p)} 560,${H + 200}`} stroke="#fff" strokeWidth={1.5} fill="none" opacity={0.8} />
          <Hand id="pullhand" x={wx} y={wy} rot={-10} scale={sc} style={GREY} pose={pose} light={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S17 the torch */
const QuickPanel: React.FC<{t: number; on: number}> = ({t, on}) => {
  const f = 'Helvetica, Arial, sans-serif';
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#101218" />
      <text x={46} y={60} fontFamily={f} fontSize={22} fontWeight={600} fill="#e6e8ee">3:01</text>
      {[[110, 220], [310, 220], [110, 400]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={62} fill="#2b2d33" />
          <circle cx={x} cy={y} r={14} fill="#6a6e78" />
        </g>
      ))}
      <circle cx={310} cy={400} r={62} fill={lerpColor('#2b2d33', '#f2f4f8', on)} />
      {/* torch glyph */}
      <g transform="translate(310,400)" fill={lerpColor('#e6e8ee', '#15171c', on)}>
        <path d="M-14,-34 L14,-34 L14,-14 L8,-4 L8,30 L-8,30 L-8,-4 L-14,-14 Z" />
        <rect x={-3} y={4} width={6} height={10} fill={lerpColor('#15171c', '#e6e8ee', on)} />
      </g>
      <rect x={60} y={540} width={300} height={70} rx={35} fill="#2b2d33" />
      <rect x={60} y={540} width={140} height={70} rx={35} fill="#6a6e78" />
    </g>
  );
};
export const TorchOn: React.FC<{t: number}> = ({t}) => {
  const on = prog(t, B.torchOn - 0.05, B.torchOn + 0.05);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.0, 1.06, lin(t, B.torch, B.satin))} shake={2.5} seed={37}>
        <Stage>
          <Phone id="torchphone" t={t} x={200} y={250} s={1.6} from="Mum" clock="3:01" msgs={[]} screen={<QuickPanel t={t} on={on} />} {...phoneSkin} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{background: '#eef3ff', opacity: on * (1 - prog(t, B.torchOn + 0.05, B.satin, easeOut)) * 0.95}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S18-19, S22: inside the coffin */
const Coffin: React.FC<{t: number; power: number; tears: number}> = ({t, power, tears}) => (
  <g>
    <Dark />
    {/* the lid's satin overhead, the pleated sides converging away at the edges */}
    <Satin id="lidsatin" x={-60} y={-80} w={W + 120} h={1920} lx={540} ly={760} power={power} tears={tears} />
    <path d="M-60,-80 L170,180 L170,1740 L-60,2000 Z" fill={lerpColor('#000', '#6a6660', power * 0.8)} />
    <path d="M1140,-80 L910,180 L910,1740 L1140,2000 Z" fill={lerpColor('#000', '#6a6660', power * 0.8)} />
    {Array.from({length: 12}, (_, i) => (
      <g key={i}>
        <path d={`M${-60 + i * 4},${-80 + i * 160} L170,${180 + i * 130}`} stroke="#000" strokeOpacity={0.4} strokeWidth={6} />
        <path d={`M${1140 - i * 4},${-80 + i * 160} L910,${180 + i * 130}`} stroke="#000" strokeOpacity={0.4} strokeWidth={6} />
      </g>
    ))}
    <path d="M-60,-80 L1140,-80 L910,180 L170,180 Z" fill={lerpColor('#000', '#57534e', power * 0.8)} />
    <path d="M-60,2000 L1140,2000 L910,1740 L170,1740 Z" fill={lerpColor('#000', '#57534e', power * 0.8)} />
    <path d="M-60,-80 L170,180 M1140,-80 L910,180 M-60,2000 L170,1740 M1140,2000 L910,1740" stroke="#000" strokeOpacity={0.6} strokeWidth={10} />
    <path d="M170,180 L910,180 L910,1740 L170,1740 Z" stroke="#000" strokeOpacity={0.5} strokeWidth={8} fill="none" />
  </g>
);
export const Satins: React.FC<{t: number}> = ({t}) => {
  const a = B.satin;
  const back = prog(t, B.six - 0.1, B.six + 1.3, easeInOut);
  const shake = 1 + noise1(t * 7, 3) * 0.06;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(mix(1.9, 1.75, lin(t, a, B.six)), 0.98, back)} y={mix(-80, 0, back)} shake={5} seed={38}>
        <Stage overflow>
          <Coffin t={t} power={shake} tears={0} />
        </Stage>
      </Camera>
      <TorchGlow x={540 + noise1(t * 6, 5) * 40} y={800} on={1} r={mix(560, 820, back)} />
    </AbsoluteFill>
  );
};
export const Funeral: React.FC<{t: number}> = ({t}) => {
  const a = B.twist;
  const shake = 1 + noise1(t * 7, 4) * 0.06;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={mix(1.0, 1.22, lin(t, a, B.texted))} shake={4} seed={39}>
        <Stage overflow>
          <Coffin t={t} power={shake} tears={0} />
        </Stage>
      </Camera>
      <TorchGlow x={540 + noise1(t * 6, 6) * 40} y={800} on={1} r={760} />
    </AbsoluteFill>
  );
};
export const LastText: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera t={t} zoom={mix(1.0, 1.08, lin(t, B.texted, B.last))} shake={2.5} seed={40}>
      <Stage>
        <defs>
          <radialGradient id="lastlight" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor="#d8e0f0" stopOpacity={0.45} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d="M-200,700 C100,600 980,600 1280,700 L1280,2200 L-200,2200 Z" fill="#7a7a74" />
        {Array.from({length: 14}, (_, i) => {
          const r = rng(900 + i);
          const x = -60 + i * 90;
          return <path key={i} d={`M${x},640 C${x + 30},900 ${x - 30},1300 ${x + 10},${1700 + r() * 300}`} stroke="#3a3a36" strokeWidth={4 + r() * 6} fill="none" />;
        })}
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#lastlight)" />
        <Phone id="lastphone" t={t} x={278} y={180} s={1.25} from="Mum" clock="3:02" msgs={[MUM[2], LAST]} buzz={[LAST.at - 0.05]} {...phoneSkin} />
      </Stage>
    </Camera>
  </AbsoluteFill>
);
export const TorchDies: React.FC<{t: number}> = ({t}) => {
  const a = B.whisper;
  const f = t < a + 0.12 ? 1 : t < a + 0.2 ? 0.2 : t < a + 0.3 ? 0.8 : t < a + 0.38 ? 0 : t < a + 0.45 ? 0.5 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera t={t} zoom={1.24} shake={4} seed={41}>
        <Stage overflow>
          <Coffin t={t} power={f} tears={0} />
        </Stage>
      </Camera>
      <TorchGlow x={540} y={800} on={1} r={760} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - f}} />
    </AbsoluteFill>
  );
};
