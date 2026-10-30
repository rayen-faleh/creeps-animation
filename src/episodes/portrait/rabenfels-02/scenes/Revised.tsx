import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/rabenfels/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/rabenfels/art/Hand';
import {Resident, ClayCup} from '../../../../kit/rabenfels/art/Townsfolk';
import {ClovesFigure} from '../../../../kit/rabenfels/art/ClovesCharacters';
import {Cloves, WatchLantern} from '../../../../kit/rabenfels/art/ClovesProps';
import {TownStreet} from '../../../../kit/rabenfels/sets/RabenfelsTown';
import {Wall} from '../../../../kit/rabenfels/art/Room';
import {mix, prog, noise1, rng, easeOut, easeInOut} from '../../../../kit/rabenfels/util';
import {theme} from '../../../../kit/rabenfels/theme';
import {GLOVE} from './Investigation';
import E from '../events.json';

/* Part II, revised shots: a readable opening in the square, the clove clue up close, the lantern and the fangs,
   the wool and the fight, Otto's locked shop, the torn cuff with cloves floating out of its pocket, and Otto's
   second customer. The older shots (Supplier, Recruit, Street, Washing, Confrontation) are reused unchanged. */

const DEAD: HandStyle = {...STYLES.adult, skin: '#b9b6ad', shade: '#6f6c66', rim: '#d8dde2', nail: '#5a5550', nailLen: 2, sleeve: '#3a2c22', cuff: '#4a3a2c'};
const SAFWAN: HandStyle = {...STYLES.adult, skin: '#b89b7e', shade: '#6c5143', cuff: '#83704e', sleeve: '#2a3741'};
const MARTA: HandStyle = {...STYLES.adult, skin: '#b99a80', shade: '#6f5142', cuff: '#29332d', sleeve: '#29332d'};
const PALE: HandStyle = {...STYLES.vamp, skin: '#c9ccd6', shade: '#7c8494', nail: '#2a2a30', nailLen: 12, sleeve: '#121318', cuff: '#1d1f26'};
const WARM = '#ffb45a';

const Label: React.FC<{top?: number; small?: boolean; opacity?: number; children: React.ReactNode}> = ({top = 200, small = false, opacity = 1, children}) => (
  <div style={{position: 'absolute', left: 90, top, width: 900, opacity, fontFamily: theme.fonts.caption, fontSize: small ? 32 : 46, letterSpacing: small ? 2 : 5, color: small ? '#bbad94' : '#e2dac9', textShadow: '0 4px 16px #000', lineHeight: 1.2}}>
    {children}
  </div>
);

/** Night cobbles, seen from above, with a lantern pool that can sweep in. */
const Cobbles: React.FC<{id: string; seed?: number; warm?: number; poolX?: number; poolY?: number}> = ({id, seed = 7, warm = 0, poolX = 760, poolY = 1000}) => {
  const r = rng(seed);
  const stones = [];
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 8; col++) {
      const x = -200 + col * 200 + (row % 2) * 100 + (r() - 0.5) * 50;
      const y = -100 + row * 140 + (r() - 0.5) * 40;
      const rx = 70 + r() * 30, ry = 52 + r() * 22, a = (r() - 0.5) * 50;
      stones.push(<ellipse key={`${row}-${col}`} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${a},${x},${y})`} fill={r() < 0.5 ? '#1e2733' : '#19212c'} stroke="#080c12" strokeWidth={9} />);
      stones.push(<path key={`h${row}-${col}`} d={`M${x - rx * 0.6},${y - ry * 0.5} q${rx * 0.5},${-ry * 0.35} ${rx * 1.1},${-ry * 0.05}`} stroke="#8a9aae" strokeOpacity={0.1} strokeWidth={5} fill="none" />);
    }
  }
  return (
    <g>
      <rect x={-600} y={-600} width={2400} height={3200} fill="#0b1018" />
      {stones}
      <defs>
        <radialGradient id={`${id}-moon`} cx="0.25" cy="0.15" r="0.9">
          <stop offset="0" stopColor="#9fb4cf" stopOpacity={0.16} />
          <stop offset="1" stopColor="#9fb4cf" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-pool`}>
          <stop offset="0" stopColor={WARM} stopOpacity={0.42} />
          <stop offset="0.55" stopColor={WARM} stopOpacity={0.12} />
          <stop offset="1" stopColor={WARM} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-600} y={-600} width={2400} height={3200} fill={`url(#${id}-moon)`} />
      {warm > 0 && <ellipse cx={poolX} cy={poolY} rx={780} ry={680} fill={`url(#${id}-pool)`} opacity={warm} />}
    </g>
  );
};

/** A square of linen laid over a face, seen from above (head centre at 540,500 in body space). The head lifts the
    middle; the cloth falls away in soft tapered folds to four drooping corners and a loose, wavy hem on the stones. */
const LINEN_C: [number, number] = [540, 500];
const linenR = (a: number) => {
  // a soft square: drooping corners (on the diagonals of the body axis) and a gently waving hem between them
  const corner = Math.pow(Math.max(0, Math.cos(2 * (a - Math.PI / 4)) ** 2), 2.2);
  return 215 + 75 * corner + 7 * Math.sin(a * 9 + 0.6);
};
const linenPt = (a: number, k = 1): [number, number] => [LINEN_C[0] + Math.cos(a) * linenR(a) * k * 1.04, LINEN_C[1] + Math.sin(a) * linenR(a) * k * 0.96];
const Linen: React.FC<{id: string; rim: string}> = ({id, rim}) => {
  const N = 140;
  const outline = Array.from({length: N}, (_, i) => linenPt((i / N) * Math.PI * 2)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + 'Z';
  // tapered folds: from the edge of the head out to each corner, and shorter ones into the hem between
  const fold = (a: number, len: number, w: number) => {
    const [x0, y0] = [LINEN_C[0] + Math.cos(a - w) * 120, LINEN_C[1] + Math.sin(a - w) * 140];
    const [x1, y1] = [LINEN_C[0] + Math.cos(a + w) * 120, LINEN_C[1] + Math.sin(a + w) * 140];
    const [xe, ye] = linenPt(a, len);
    const [xm, ym] = linenPt(a + 0.05, (len + 0.5) / 2);
    return `M${x0},${y0} Q${xm},${ym} ${xe},${ye} Q${xm - 8},${ym + 6} ${x1},${y1} Z`;
  };
  const corners = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const between = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].flatMap((a) => [a - 0.22, a + 0.25]);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-cloth`} cx="0.42" cy="0.4" r="0.62">
          <stop offset="0" stopColor="#dcd6ca" />
          <stop offset="0.7" stopColor="#c3bdb0" />
          <stop offset="1" stopColor="#a39d90" />
        </radialGradient>
        <radialGradient id={`${id}-head`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ece7dc" />
          <stop offset="0.5" stopColor="#d6d0c4" stopOpacity={0.6} />
          <stop offset="1" stopColor="#c3bdb0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={outline} fill="#000" opacity={0.38} transform="translate(12,16)" />
      <path d={outline} fill={`url(#${id}-cloth)`} />
      {/* shade the side away from the moon, then the folds */}
      <path d={outline} fill="#5a554c" opacity={0.18} transform={`translate(${LINEN_C[0]},${LINEN_C[1]}) scale(0.9) translate(${-LINEN_C[0] + 30},${-LINEN_C[1] + 36})`} />
      {corners.map((a, i) => <path key={i} d={fold(a, 0.96, 0.12)} fill="#867f73" opacity={0.45} />)}
      {between.map((a, i) => <path key={i} d={fold(a, 0.9, 0.06)} fill="#867f73" opacity={0.28} />)}
      {corners.map((a, i) => <path key={i} d={fold(a + 0.32, 0.85, 0.05)} fill="#f2ede3" opacity={0.25} />)}
      {/* the head under the cloth: a lit dome, shadowed on the far side */}
      <ellipse cx={LINEN_C[0] + 26} cy={LINEN_C[1] + 30} rx={110} ry={140} fill="#7a7468" opacity={0.16} />
      <ellipse cx={LINEN_C[0]} cy={LINEN_C[1]} rx={118} ry={148} fill={`url(#${id}-head)`} opacity={0.7} />
      {/* brow, nose and chin pressing up */}
      <ellipse cx={LINEN_C[0] - 4} cy={LINEN_C[1] - 62} rx={70} ry={22} fill="#f4efe6" opacity={0.45} />
      <ellipse cx={LINEN_C[0]} cy={LINEN_C[1] + 2} rx={15} ry={34} fill="#f3eee5" opacity={0.85} />
      <ellipse cx={LINEN_C[0] + 10} cy={LINEN_C[1] + 44} rx={20} ry={8} fill="#8c867a" opacity={0.5} />
      <ellipse cx={LINEN_C[0]} cy={LINEN_C[1] + 108} rx={40} ry={16} fill="#ebe6dc" opacity={0.5} />
      <path d={outline} fill="none" stroke={rim} strokeOpacity={0.25} strokeWidth={3} />
    </g>
  );
};

/** The dead man from above, lying on his back: linen over his face, a brown wool coat, the collar dark with blood.
    lift raises the near lapel; wet makes the blood shine in lantern light. */
const DeadMan: React.FC<{id: string; lift?: number; wet?: number; warm?: number}> = ({id, lift = 0, wet = 0, warm = 0}) => {
  const rim = warm > 0 ? '#ffd9a8' : '#c8d3e3';
  return (
    <g id={id} transform="rotate(-24,540,1000)">
      <ellipse cx={540} cy={1150} rx={420} ry={760} fill="#000" opacity={0.4} />
      {/* blood on the stones by his neck */}
      <path d="M640,640 C760,620 860,700 840,790 C820,860 720,850 690,800 C660,760 600,720 640,640 Z" fill="#3a060c" opacity={0.9} />
      {/* arms along his sides, coat sleeves */}
      <path d="M300,760 C250,950 240,1150 260,1350 L350,1350 C350,1150 360,950 390,780 Z" fill="#33261d" />
      <path d="M780,760 C830,950 840,1150 820,1350 L730,1350 C730,1150 720,950 690,780 Z" fill="#33261d" />
      {/* coat */}
      <path d="M330,700 C420,650 660,650 750,700 C790,900 800,1300 780,2000 L300,2000 C280,1300 290,900 330,700 Z" fill="#3a2c22" />
      <path d="M330,700 C290,900 280,1300 300,2000 M750,700 C790,900 800,1300 780,2000" stroke={rim} strokeOpacity={0.25} strokeWidth={6} fill="none" />
      <path d="M540,800 V2000" stroke="#251a13" strokeWidth={10} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={580} cy={980 + i * 150} r={14} fill="#1a120c" stroke="#6a5440" strokeWidth={4} />)}
      {/* shirt at the throat */}
      <path d="M470,680 L540,800 L610,680 Z" fill="#8a8478" />
      {/* lapels: the near one lifts toward us */}
      <path d="M610,680 L540,800 L650,960 L720,720 Z" fill="#4a382b" stroke="#1d140e" strokeWidth={6} />
      <path d={`M470,680 L540,800 L${430 - lift * 40},${960 - lift * 70} L${360 - lift * 60},${720 - lift * 60} Z`} fill="#56412f" stroke="#1d140e" strokeWidth={6} />
      {/* blood soaked into the far collar and shoulder, an irregular stain */}
      <path d="M600,690 C650,670 720,690 745,740 C770,800 735,850 700,880 C680,830 660,800 640,820 C620,780 590,740 600,690 Z" fill="#4a0a10" opacity={0.95} />
      <path d={`M${400 - lift * 50},${720 - lift * 55} C${430 - lift * 40},${705 - lift * 45} ${465 - lift * 25},${712 - lift * 25} ${470 - lift * 20},${740 - lift * 25} C${450 - lift * 30},${760 - lift * 40} ${420 - lift * 45},${770 - lift * 55} ${400 - lift * 50},${720 - lift * 55} Z`} fill="#4a0a10" opacity={0.95} />
      {wet > 0 && <g opacity={wet}>
        <path d="M640,705 C670,698 700,708 715,730" stroke="#ff5a48" strokeWidth={6} strokeLinecap="round" fill="none" />
        <circle cx={690} cy={790} r={7} fill="#ff5a48" />
        <path d={`M${415 - lift * 48},${722 - lift * 52} C${430 - lift * 42},${715 - lift * 46} ${448 - lift * 32},${718 - lift * 36} ${455 - lift * 26},${730 - lift * 30}`} stroke="#ff5a48" strokeWidth={5} strokeLinecap="round" fill="none" />
      </g>}
      <Linen id={`${id}-linen`} rim={rim} />
      {/* his right hand, pale on the cobbles */}
      <Hand id={`${id}-hand`} x={800} y={1430} rot={160} scale={0.85} style={DEAD} pose={POSES.claw} light={0.5} showSleeve={false} />
    </g>
  );
};

/** The same body, small, in the square plate: linen at the head, boots at the feet, one pale hand. */
const BodyInSquare: React.FC = () => (
  <g>
    <ellipse cx={540} cy={1192} rx={190} ry={22} fill="#05080c" opacity={0.7} />
    <path d="M360,1180 C380,1150 430,1140 480,1146 L640,1150 C680,1150 700,1162 702,1180 L700,1196 L362,1196 Z" fill="#3a2c22" />
    {/* the linen over his face: a small draped square, corners on the stones */}
    <path d="M316,1170 C314,1152 330,1138 350,1136 C370,1134 392,1142 398,1160 C404,1178 392,1196 372,1199 C352,1202 322,1192 316,1170 Z" fill="#c9c4b8" />
    <path d="M330,1146 C346,1158 360,1176 366,1198 M352,1137 C356,1150 368,1160 396,1166" stroke="#8c867a" strokeWidth={2.5} fill="none" opacity={0.6} />
    <ellipse cx={356} cy={1162} rx={10} ry={6} fill="#ebe6dc" opacity={0.8} />
    <path d="M700,1166 L736,1160 L742,1180 L702,1190 Z M700,1182 L740,1186 L738,1200 L700,1198 Z" fill="#0c0c10" />
    <path d="M520,1196 C530,1210 552,1212 560,1204" stroke="#b9b6ad" strokeWidth={9} strokeLinecap="round" fill="none" />
    <path d="M420,1190 C460,1200 500,1202 520,1196" stroke="#3a060c" strokeWidth={10} opacity={0.8} fill="none" />
  </g>
);

/* S01: the square at night, the body under its linen in the middle of the cobbles; the camera comes down to it */
export const SquareWide: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, 0, E.scent, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.02, 2.4, k)} x={mix(0, -20, k)} y={mix(-40, 225, k)} shake={3} seed={601}>
        <Stage>
          <TownStreet id="square-wide" t={t} />
          <BodyInSquare />
        </Stage>
      </Camera>
      <Label top={180} small>RABENFELS · 1732 · PART II</Label>
      <Label top={235} small opacity={1 - prog(t, 4.6, 5.1)}>@stvry.safwan chose: “smell the body to find a similar scent”</Label>
    </AbsoluteFill>
  );
};

/* S02: close on the collar. A gloved hand lifts it; under the blood, something familiar */
export const CollarClose: React.FC<{t: number}> = ({t}) => {
  const reach = prog(t, E.scent, E.scent + 0.7, easeOut);
  const lift = prog(t, E.scent + 0.6, E.familiar + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.06 + prog(t, E.scent, E.cloves) * 0.22} shake={3} seed={602}>
        <Stage>
          <g transform="translate(90,170)">
          <Cobbles id="collar" seed={11} />
          <DeadMan id="collar-man" lift={lift} />
          <g transform="rotate(-24,540,1000)">
            <Hand id="collar-glove" x={mix(160, 360, reach) - lift * 45} y={mix(1500, 1000, reach) - lift * 60} rot={8} scale={1.05} style={GLOVE} pose={lerpPose(POSES.reach, POSES.claw, reach * 0.8)} light={0.8} />
          </g>
          </g>
        </Stage>
      </Camera>
      <Label top={180} small>RABENFELS · 1732 · PART II</Label>
      <Label top={235} small opacity={1 - prog(t, 4.6, 5.1)}>@stvry.safwan chose: “smell the body to find a similar scent”</Label>
    </AbsoluteFill>
  );
};

/* S03: cloves. Buds caught in the wool of the bloody collar, big enough to read on a phone */
export const ClovesInsert: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.cloves;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.05} shake={2.5} seed={603}>
        <Stage>
          <rect x={-200} y={-200} width={1500} height={2400} fill="#2e2219" />
          {Array.from({length: 60}, (_, i) => (
            <path key={i} d={`M${-100 + (i % 10) * 140},${100 + Math.floor(i / 10) * 300} q60,40 120,0 q60,-40 120,0`} stroke="#3e2e22" strokeWidth={16} fill="none" />
          ))}
          <path d="M-200,820 C200,760 600,900 1300,820 L1300,1240 C800,1300 300,1180 -200,1260 Z" fill="#4a0a10" opacity={0.85} />
          <path d="M-200,820 C200,760 600,900 1300,820" stroke="#ff4a3a" strokeOpacity={0.25} strokeWidth={6} fill="none" />
          <g transform="translate(540,960)">
            <Cloves x={-160} y={-40} s={2.6} />
            <g transform="translate(250,120) rotate(40)"><Cloves x={0} y={0} s={1.6} /></g>
          </g>
          <ellipse cx={540} cy={900} rx={520} ry={360} fill="#ffd9a8" opacity={0.06} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05-06: Safwan's lantern lights the collar; the blood shines; your teeth slide out; you turn away */
export const LanternTeeth: React.FC<{t: number}> = ({t}) => {
  const sweep = prog(t, E.light, E.light + 1.2, easeOut);
  if (t < E.turnaway) {
    const fang = prog(t, E.cover - 0.1, E.cover + 0.4, easeOut);
    const pulse = t > E.cover ? Math.max(0, Math.sin((t - E.cover) * 7)) * Math.exp(-(t - E.cover) * 1.3) : 0;
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.15 + prog(t, E.light, E.turnaway) * 0.25 + fang * 0.08} shake={3 + fang * 3} seed={605}>
          <Stage>
            <g transform="translate(40,170)">
            <Cobbles id="lit" seed={11} warm={sweep} poolX={mix(1300, 640, sweep)} poolY={mix(500, 760, sweep)} />
            <DeadMan id="lit-man" lift={1} wet={sweep} warm={sweep} />
            <WatchLantern id="near-lantern" t={t} x={mix(1250, 930, sweep)} y={mix(300, 380, sweep)} s={1.1} />
            {/* your hand comes up to your mouth, close to the lens */}
            <Hand id="cover-mouth" x={mix(760, 560, fang)} y={mix(2700, 2050, fang)} rot={-8} scale={2.6} style={GLOVE} pose={POSES.flat} light={0.8} />
            </g>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#8a0c18" opacity={pulse * 0.35} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  const k = prog(t, E.turnaway, E.turnaway + 0.5, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25} x={mix(260, -260, k)} y={-60} rot={mix(2, -1, k)} shake={4} seed={606}>
        <Stage>
          <TownStreet id="turn-away" t={t} />
          <ClovesFigure id="safwan-looks" kind="safwan" t={t} x={760} y={1150} s={0.95} hand={[-150, -300]} otherHand={[110, -30]} turn={0.6} alarm={0.2} />
          <WatchLantern id="raised-lantern" t={t} x={760 + 150 * 0.95} y={1150 - 300 * 0.95 + 65} s={0.75} />
        </Stage>
      </Camera>
      {/* motion smear of the turn */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,8,12,0.85), rgba(5,8,12,0) 45%)', opacity: 1 - k}} />
    </AbsoluteFill>
  );
};

/** The dead hand on the cobbles, palm up, nails dark with black wool. */
const DeadHand: React.FC<{lit: number}> = ({lit}) => (
  <g>
    <path d="M-200,1350 C100,1250 300,1200 470,1180 L470,1320 C300,1340 100,1400 -200,1520 Z" fill="#3a2c22" />
    <Hand id="dead-hand" x={560} y={1250} rot={70} scale={1.35} style={DEAD} pose={POSES.claw} light={0.4 + lit * 0.5} />
    {/* wool under the nails */}
    {[[728, 1030], [770, 1080], [790, 1140], [785, 1205]].map(([x, y], i) => (
      <path key={i} d={`M${x},${y} q14,-8 22,4 q-10,8 -22,-4`} fill="#07080b" />
    ))}
  </g>
);

/* S07-08: black wool under his nails; Safwan draws a thread out against the lantern. He fought someone */
export const Evidence: React.FC<{t: number}> = ({t}) => {
  const pinch = prog(t, E.evidence + 0.3, E.evidence + 1.0, easeOut);
  const pull = prog(t, E.evidence + 1.0, E.evidence + 2.4, easeInOut);
  const back = prog(t, E.fought - 0.2, E.door, easeInOut);
  const tipX = mix(950, 790, pinch) - pull * 40, tipY = mix(700, 1120, pinch) - pull * 330;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.35, 1.05, back)} x={mix(120, 0, back)} y={mix(-60, 0, back)} shake={3} seed={607}>
        <Stage>
          <Cobbles id="ev" seed={23} warm={1} poolX={760} poolY={1000} />
          {/* drag marks and a torn-off button: the struggle */}
          <g opacity={0.25 + back * 0.75}>
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M${200 + i * 26},${1500 + i * 8} C${380 + i * 20},${1450 + i * 6} ${520 + i * 18},${1420} ${620 + i * 12},${1400 + i * 4}`} stroke="#c8d3e3" strokeOpacity={0.35} strokeWidth={5} fill="none" />)}
            <circle cx={300} cy={1650} r={18} fill="#1a120c" stroke="#8a7050" strokeWidth={5} />
          </g>
          <DeadHand lit={1} />
          {/* the thread, drawn out from under the nail */}
          {pinch > 0.6 && <path d={`M790,1150 C${790 + pull * 30},${1120 - pull * 120} ${tipX + 30},${tipY + 60} ${tipX},${tipY}`} stroke="#07080b" strokeWidth={5} fill="none" />}
          <Hand id="safwan-pinch" x={tipX + 70} y={tipY - 150} rot={200} scale={1.0} style={SAFWAN} pose={lerpPose(POSES.point, POSES.claw, pinch * 0.7)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: Otto's shop: shutters barred, chain and padlock on the door, the upper window dark. No light. No Otto */
export const ButcherShop: React.FC<{t: number}> = ({t}) => {
  const reach = prog(t, E.door + 0.1, E.door + 0.6, easeOut);
  const rattle = t > E.door + 0.6 && t < E.door + 1.5 ? Math.sin((t - E.door) * 38) * 10 * (1 - prog(t, E.door + 0.6, E.door + 1.5)) : 0;
  const up = prog(t, E.nolight - 0.15, E.nolight + 0.6, easeInOut);
  const swing = Math.sin(t * 1.3) * 6 + noise1(t * 0.7, 4) * 3;
  const shutter = prog(t, E.nootto, E.nootto + 0.8, easeOut) * 0.6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + up * 0.15} y={mix(140, -330, up)} shake={3} seed={609}>
        <Stage>
          <rect x={-300} y={-600} width={1700} height={3200} fill="#0b1018" />
          {/* half-timbered facade */}
          <rect x={60} y={-300} width={960} height={2100} fill="#2b3540" />
          <path d="M60,-300 V1800 M1020,-300 V1800 M60,560 H1020 M60,-20 H1020 M60,560 L540,180 L1020,560" stroke="#141a22" strokeWidth={30} fill="none" />
          <path d="M60,-300 V1800" stroke="#9fb4cf" strokeOpacity={0.15} strokeWidth={8} />
          {/* upper window, dark, one shutter drifting open */}
          <rect x={380} y={40} width={320} height={380} fill="#05080c" stroke="#141a22" strokeWidth={20} />
          <path d="M540,40 V420 M380,230 H700" stroke="#141a22" strokeWidth={14} />
          <g transform={`translate(700,40) skewY(${-shutter * 25}) scale(${1 - shutter * 0.6},1)`}>
            <rect x={0} y={0} width={150} height={380} fill="#3a2a1c" stroke="#1a120c" strokeWidth={8} />
          </g>
          <rect x={230} y={40} width={150} height={380} fill="#3a2a1c" stroke="#1a120c" strokeWidth={8} />
          {/* the hanging sign: a cleaver */}
          <path d="M1020,620 H860 M900,620 V660 M980,620 V660" stroke="#2a2a2e" strokeWidth={12} fill="none" />
          <g transform={`translate(940,660) rotate(${swing})`}>
            <rect x={-95} y={0} width={190} height={140} rx={10} fill="#3a2a1c" stroke="#1a120c" strokeWidth={8} />
            <path d="M-60,40 H40 L50,90 H-60 Z" fill="#9aa4b0" />
            <rect x={40} y={52} width={42} height={18} rx={6} fill="#5a3a20" />
          </g>
          {/* shop window, barred shutters */}
          <rect x={120} y={700} width={420} height={420} fill="#3a2a1c" stroke="#1a120c" strokeWidth={14} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${120 + i * 105},700 V1120`} stroke="#241810" strokeWidth={6} />)}
          <rect x={100} y={880} width={460} height={34} fill="#1a1d22" stroke="#6a7280" strokeOpacity={0.5} strokeWidth={3} />
          {/* the door, chained */}
          <path d="M640,1500 V820 Q790,700 940,820 V1500 Z" fill="#2a1e14" stroke="#141a22" strokeWidth={22} />
          {[690, 750, 810, 870].map((x) => <path key={x} d={`M${x},790 V1500`} stroke="#1a120c" strokeWidth={6} />)}
          <g transform={`translate(${rattle},0)`}>
            <path d="M650,1080 C720,1130 860,1130 930,1080" stroke="#6a7280" strokeWidth={14} strokeDasharray="22 10" fill="none" />
            <rect x={760} y={1110} width={60} height={70} rx={10} fill="#3a3c42" stroke="#9aa4b0" strokeOpacity={0.6} strokeWidth={4} />
            <path d="M770,1110 C770,1070 810,1070 810,1110" stroke="#9aa4b0" strokeWidth={9} fill="none" />
          </g>
          <rect x={-300} y={1500} width={1700} height={600} fill="#121821" />
          <Hand id="pull-lock" x={mix(980, 830, reach) + rattle} y={mix(1700, 1330, reach)} rot={-8} scale={1.0} style={GLOVE} pose={lerpPose(POSES.reach, POSES.fist, reach)} light={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: the torn cuff in the washing water; cloves float out of the coat's pocket */
export const CuffInsert: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.torn;
  const scrub = Math.sin(lt * 5) * (1 - prog(t, E.torn + 0.6, E.torn + 1.0));
  const float = prog(t, E.torn + 0.5, E.ask, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.04} shake={2.5} seed={611}>
        <Stage>
          <rect x={-200} y={-200} width={1500} height={2400} fill="#1a130e" />
          {/* the basin water, top down */}
          <ellipse cx={540} cy={1000} rx={760} ry={640} fill="#514438" />
          <ellipse cx={540} cy={1000} rx={700} ry={580} fill="#22303a" />
          {[0, 1, 2].map((i) => <ellipse key={i} cx={560} cy={1000} rx={200 + i * 130 + (lt % 1) * 60} ry={120 + i * 80 + (lt % 1) * 40} fill="none" stroke="#8da3ad" strokeOpacity={0.12 - i * 0.03} strokeWidth={5} />)}
          {/* the black coat sleeve and its torn cuff */}
          <g transform={`translate(${scrub * 14},0)`}>
            <path d="M-200,700 C150,760 380,820 560,900 L620,1120 C420,1080 150,1020 -200,980 Z" fill="#1d2026" stroke="#080b10" strokeWidth={6} />
            <path d="M560,900 L590,950 L570,975 L605,1010 L585,1040 L620,1070 L600,1095 L620,1120" stroke="#1d2026" strokeWidth={34} fill="none" />
            {/* the bite out of the wool: ragged, threads hanging */}
            <path d="M560,900 L600,935 L575,965 L612,1000 L590,1030 L625,1060 L604,1090 L620,1120" stroke="#c8d3e3" strokeOpacity={0.35} strokeWidth={3} fill="none" />
            {[[600, 935], [612, 1000], [625, 1060]].map(([x, y], i) => <path key={i} d={`M${x},${y} q40,${10 + i * 6} 70,${30 + i * 4}`} stroke="#07080b" strokeWidth={4} fill="none" />)}
            {/* the pocket */}
            <path d="M120,820 C200,840 280,850 340,860" stroke="#080b10" strokeWidth={10} fill="none" />
          </g>
          {/* cloves drifting out of the pocket onto the water */}
          {[0, 1, 2, 3, 4].map((i) => {
            const p = Math.min(1, Math.max(0, float * 1.4 - i * 0.12));
            if (p <= 0) return null;
            const x = 240 + i * 40 + p * (120 + i * 60), y = 860 + p * (140 + (i % 2) * 120) + Math.sin(t * 2 + i) * 6;
            return <g key={i} transform={`translate(${x},${y}) rotate(${i * 60 + t * 10})`}><Cloves x={0} y={0} s={0.55} /></g>;
          })}
          {/* Marta's hands on the cloth */}
          <Hand id="marta-l" x={260 + scrub * 18} y={1260} rot={30} scale={1.1} style={MARTA} pose={POSES.relaxed} light={0.9} />
          <Hand id="marta-r" x={700 + scrub * 18} y={1330} rot={-20} scale={1.1} style={MARTA} pose={POSES.relaxed} light={0.9} mirror />
          <ellipse cx={540} cy={800} rx={600} ry={500} fill={WARM} opacity={0.08} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: memory, warm: Otto's counter with two covered cups. One goes to your glove; the other to a pale hand */
export const TwoCups: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.customer;
  const slide = prog(t, E.customer + 0.4, E.customer + 1.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + lt * 0.03} y={40} shake={3} seed={613}>
        <Stage>
          <Wall id="two-cups-wall" x={-600} y={-600} w={2400} h={3000} warm={0.7} lit={0.9} />
          <Resident id="otto-two" t={t} x={540} y={1060} who="otto" s={1.0} hand={[-150, -60]} otherHand={[150, -60]} look={0} lean={0.1} />
          <path d="M-400,1090 H1600 V1185 H-400Z" fill="#543b29" stroke="#1d1712" strokeWidth={7} />
          <path d="M-400,1185 H1600 V2150 H-400Z" fill="#2b211a" />
          <ClayCup x={mix(420, 250, slide)} y={1000} s={0.95} lid={1} />
          <ClayCup x={mix(660, 830, slide)} y={1000} s={0.95} lid={1} />
          <Cloves x={mix(430, 260, slide)} y={950} s={0.4} />
          <Cloves x={mix(670, 840, slide)} y={950} s={0.4} />
          <Hand id="my-glove-cup" x={mix(20, 170, slide)} y={1250} rot={35} scale={0.95} style={GLOVE} pose={lerpPose(POSES.reach, POSES.relaxed, slide)} light={0.8} />
          <Hand id="other-customer" x={mix(1060, 910, slide)} y={1250} rot={-35} scale={0.95} style={PALE} pose={POSES.claw} light={1} mirror />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

