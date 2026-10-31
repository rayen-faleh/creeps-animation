import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/rabenfels/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/rabenfels/art/Hand';
import {Resident} from '../../../../kit/rabenfels/art/Townsfolk';
import {ClovesFigure} from '../../../../kit/rabenfels/art/ClovesCharacters';
import {ClovesBackFigure} from '../../../../kit/rabenfels/art/ClovesBackFigure';
import {WatchLantern} from '../../../../kit/rabenfels/art/ClovesProps';
import {Candle} from '../../../../kit/rabenfels/art/Props';
import {Wall} from '../../../../kit/rabenfels/art/Room';
import {TavernLanding} from '../../../../kit/rabenfels/sets/TavernLanding';
import {TownStreet} from '../../../../kit/rabenfels/sets/RabenfelsTown';
import {mix, prog, track, noise1, easeOut, easeIn, easeInOut} from '../../../../kit/rabenfels/util';
import {theme} from '../../../../kit/rabenfels/theme';
import {GLOVE} from '../../rabenfels-02/scenes/Investigation';
import E from '../events.json';

/* Rabenfels Part III. The tavern landing and its mirror carry on from Part II. The new over-the-shoulder mirror shots
   follow the project's reflection rules: the camera is behind Safwan, so the room shows his back (rear art) and the
   glass shows his front (front art), both driven by the same hand targets; the reflected image is the real one scaled
   towards the vanishing point by k = d / (d + 2m) (camera-to-Safwan d, Safwan-to-mirror m). Elias and the stranger
   are never reflected. */

type V = [number, number];
const SAFWAN_SKIN: HandStyle = {...STYLES.adult, skin: '#b89b7e', shade: '#6c5143', cuff: '#83704e', sleeve: '#2a3741'};

const Label: React.FC<{top?: number; small?: boolean; opacity?: number; children: React.ReactNode}> = ({top = 200, small = false, opacity = 1, children}) => (
  <div style={{position: 'absolute', left: 90, top, width: 900, opacity, fontFamily: theme.fonts.caption, fontSize: small ? 32 : 46, letterSpacing: small ? 2 : 5, color: small ? '#bbad94' : '#e2dac9', textShadow: '0 4px 16px #000', lineHeight: 1.25}}>
    {children}
  </div>
);

/** The landing as Part II left it: the stranger two steps down, Safwan by the mirror. */
const STRANGER = {x: 760, y: 950, s: 0.78};
const strangerFeet: [V, V] = [[(717 - 760) / 0.78, (1183 - 950) / 0.78], [(800 - 760) / 0.78, (1129 - 950) / 0.78]];
const SAF = {x: 365, y: 1190, s: 0.85};

const Landing: React.FC<{t: number; reach?: number; strangerUp?: number; strangerTurn?: number; mouth?: number; whistle?: number; sTurn?: number; alarm?: number; safMouth?: number; foreground?: React.ReactNode; noStranger?: boolean}> = ({
  t, reach = 1, strangerUp = 0, strangerTurn = 0.21, mouth = 0, whistle = 0, sTurn = 0.6, alarm = 0.3, safMouth = 0, foreground, noStranger = false,
}) => {
  const sHand: V = [-165 + whistle * 80, -95 - whistle * 150];
  const sOther: V = [90, -60];
  const wHand: V = [mix(-150, -340, reach), mix(-125, -150, reach)];
  // backing up the stairs: the same treads, climbed in reverse
  const up = strangerUp, sx = STRANGER.x + up * 150, sy = STRANGER.y - up * 110;
  return (
    <TavernLanding id="r3-landing" t={t} reflectionPose={{hand: sHand, otherHand: sOther, turn: 0.1 + sTurn * 0.9}} foreground={foreground}>
      {!noStranger && <ClovesFigure id="r3-witness" t={t} kind="witness" x={sx} y={sy} s={STRANGER.s} feet={strangerFeet} hand={wHand} otherHand={[112, -95]} turn={strangerTurn} lean={reach * 0.85 * (1 - up)} claw={reach * (1 - up)} mouth={mouth} />}
      <ClovesFigure id="r3-safwan" t={t} kind="safwan" x={SAF.x} y={SAF.y} s={SAF.s} hand={sHand} otherHand={sOther} mirror turn={0.1 + sTurn * 0.9} alarm={alarm} mouth={safMouth} />
      <WatchLantern id="r3-lantern" t={t} x={SAF.x - sOther[0] * SAF.s} y={SAF.y + sOther[1] * SAF.s + 60} s={0.62} />
      {whistle > 0 && (
        <g transform={`translate(${SAF.x - sHand[0] * SAF.s},${SAF.y + sHand[1] * SAF.s}) rotate(-15)`}>
          <path d="M-14,-15 H21 V6 L8,17 H-14Z" fill="#a29270" stroke="#4a4437" strokeWidth={3} />
          <path d="M2,-12 V10" stroke="#403c34" strokeWidth={3} />
        </g>
      )}
    </TavernLanding>
  );
};

/* S01 hook: the gold mirror, the stairs empty in the glass, Safwan's back reflected. It worked. That was the problem */
export const Hook: React.FC<{t: number}> = ({t}) => {
  const push = prog(t, E.problem, E.answer, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.45 + t * 0.01 + push * 0.15} x={-305} y={-160} shake={3} seed={3001}>
        <Stage overflow>
          <Landing t={t} />
        </Stage>
      </Camera>
      <Label top={170} small>RABENFELS · 1732 · PART III</Label>
      <Label top={225} small opacity={1 - prog(t, E.answer - 0.5, E.answer)}>@stvry.safwan chose again: “Don't answer him. Ask Safwan to look at the mirror.” · Safwan's story continues</Label>
    </AbsoluteFill>
  );
};

/* S02: you don't answer the stranger. Your gloved hand points at the glass: Safwan, look at the mirror */
export const Point: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.answer;
  const rise = prog(t, E.answer + 0.2, E.look, easeOut);
  const pose = lerpPose(POSES.relaxed, POSES.point, rise);
  const [hx, hy] = wristFor(mix(560, 300, rise), mix(1500, 1060, rise), mix(-6, -60, rise), 1.08, GLOVE, pose, true);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.16 + lt * 0.02} shake={2.5} seed={3002}>
        <Stage overflow>
          <Landing t={t} foreground={<Hand id="r3-point" x={hx} y={hy} rot={mix(-6, -60, rise)} scale={1.08} style={GLOVE} pose={pose} mirror />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: but first you step back, out of the glass: your hand leaves the mirror's side of the frame */
export const StepBack: React.FC<{t: number}> = ({t}) => {
  const back = prog(t, E.stepback + 0.5, E.outglass + 0.6, easeInOut);
  const pose = POSES.point;
  const [hx, hy] = wristFor(mix(330, 1150, back), mix(1080, 1300, back), -60, 1.08, GLOVE, pose, true);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.38} x={-200} y={-130} shake={3} seed={3003}>
        <Stage overflow>
          <Landing t={t} foreground={<Hand id="r3-back" x={hx} y={hy} rot={-60} scale={1.08} style={GLOVE} pose={pose} mirror />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------- the over-the-shoulder mirror ---------- */

const VP: V = [540, 760];                 // the vanishing point of this shot
const K = 1.2 / (1.2 + 2 * 0.5);          // reflection scale: Safwan 1.2 m from camera, 0.5 m from the glass
const toGlass = (p: V): V => [VP[0] + (p[0] - VP[0]) * K, VP[1] + (p[1] - VP[1]) * K];
const GLASS = {x: 190, y: 220, w: 700, h: 1260};
const glassPath = `M${GLASS.x},${GLASS.y + GLASS.h} V${GLASS.y + 260} Q${GLASS.x},${GLASS.y} ${GLASS.x + GLASS.w / 2},${GLASS.y} Q${GLASS.x + GLASS.w},${GLASS.y} ${GLASS.x + GLASS.w},${GLASS.y + 260} V${GLASS.y + GLASS.h} Z`;
const REAL = {x: 330, y: 1960, s: 1.35};  // Safwan's back, foreground left

/** What the glass shows of the room behind the camera: the stair flight up to the landing, its rail and candle. No one on it. */
const ReflectedRoom: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill="#1c2026" />
    <Wall id="r3-glass-wall" x={GLASS.x - 50} y={GLASS.y} w={GLASS.w + 100} h={GLASS.h} warm={0.3} lit={0.6} />
    <rect x={GLASS.x} y={GLASS.y + 980} width={GLASS.w} height={300} fill="#2a221c" />
    {/* the flight of stairs climbing to the right, to a landing and a door */}
    {Array.from({length: 9}, (_, i) => {
      const x = 330 + i * 52, y = 1180 - i * 46;
      return (
        <g key={i}>
          <path d={`M${x},${y} H${x + 150} L${x + 180},${y - 20} H${x + 30} Z`} fill={i % 2 ? '#5b4633' : '#69523c'} stroke="#1a1410" strokeWidth={3} />
          <rect x={x} y={y} width={150} height={26} fill="#3a2c22" stroke="#1a1410" strokeWidth={2} />
        </g>
      );
    })}
    <path d="M330,1080 L800,666" stroke="#2a1e16" strokeWidth={14} strokeLinecap="round" />
    <path d="M330,1074 L800,660" stroke="#a07f59" strokeOpacity={0.55} strokeWidth={4} />
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M${334 + i * 52},${1078 - i * 46} V${1180 - i * 46}`} stroke="#2a1e16" strokeWidth={8} />)}
    <rect x={770} y={480} width={110} height={190} fill="#120f0d" stroke="#3a3028" strokeWidth={8} />
    <Candle x={720} y={660} s={0.45} t={t} />
    {/* candlelight in the glass */}
    <ellipse cx={700} cy={640} rx={260} ry={220} fill="#ffb45a" opacity={0.12} />
  </g>
);

const MirrorFrame: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="r3-gold"><stop stopColor="#b99950" /><stop offset=".45" stopColor="#705524" /><stop offset="1" stopColor="#302514" /></linearGradient>
    </defs>
    <path d={glassPath} fill="none" stroke="url(#r3-gold)" strokeWidth={46} />
    <path d={glassPath} fill="none" stroke="#b79d5c" strokeOpacity={0.5} strokeWidth={6} strokeDasharray="4 12" />
    <path d={`M${GLASS.x + GLASS.w / 2 - 70},${GLASS.y - 20} L${GLASS.x + GLASS.w / 2},${GLASS.y - 110} L${GLASS.x + GLASS.w / 2 + 70},${GLASS.y - 20} Z`} fill="url(#r3-gold)" stroke="#17120b" strokeWidth={4} />
  </g>
);

/**
 * Behind Safwan, facing the mirror. hand / otherHand drive both his rear art (the room) and his front art (the glass).
 * gripReal draws Elias's sleeve held in Safwan's hand in the room; the glass shows the same grip closed on nothing.
 */
const OverShoulder: React.FC<{t: number; hand: V; otherHand: V; grip?: number; children?: React.ReactNode}> = ({t, hand, otherHand, grip = 0, children}) => {
  const [rx, ry] = toGlass([REAL.x, REAL.y]);
  const rs = REAL.s * K;
  return (
    <g>
      <Wall id="r3-os-wall" x={-600} y={-600} w={2400} h={3000} warm={0.25} lit={0.7} />
      <rect x={-600} y={1480} width={2400} height={800} fill="#211b18" />
      <g>
        <defs><clipPath id="r3-glass-clip"><path d={glassPath} /></clipPath></defs>
        <g clipPath="url(#r3-glass-clip)">
          <ReflectedRoom t={t} />
          {/* his front, in the glass: same pose, scaled to the reflected distance; his hand closes on nothing */}
          <ClovesFigure id="r3-front" t={t} kind="safwan" x={rx} y={ry} s={rs} hand={hand} otherHand={otherHand} turn={1} alarm={0.4 + grip * 0.4} />
          <WatchLantern id="r3-front-lantern" t={t} x={rx + otherHand[0] * rs} y={ry + otherHand[1] * rs + 70 * rs} s={0.73 * rs} />
          <path d={glassPath} fill="#b9cfdf" opacity={0.04} />
        </g>
        <MirrorFrame />
      </g>
      {/* the room: his back, foreground left; and (when gripping) your sleeve in his hand */}
      {grip > 0 && (
        <g>
          <path d={`M1500,1350 L${REAL.x + hand[0] * REAL.s + 40},${REAL.y + hand[1] * REAL.s - 20} L${REAL.x + hand[0] * REAL.s + 40},${REAL.y + hand[1] * REAL.s + 110} L1500,1500 Z`} fill="#16181e" />
          <path d={`M1500,1350 L${REAL.x + hand[0] * REAL.s + 40},${REAL.y + hand[1] * REAL.s - 20}`} stroke="#adbbcc" strokeOpacity={0.3} strokeWidth={5} />
        </g>
      )}
      <g transform={`translate(${REAL.x},${REAL.y}) scale(${REAL.s})`}>
        <ClovesBackFigure t={t} hand={hand} otherHand={otherHand} turn={0.6} />
      </g>
      {children}
    </g>
  );
};

/* S04: Safwan looks. Stairs. Railing. Candle. His own face. The camera crosses the glass with each word */
export const Looks: React.FC<{t: number}> = ({t}) => {
  const fx = track(t, [[E.looks, 540], [E.stairs, 470], [E.railing, 620], [E.candle, 720], [E.face, 470], [E.nostranger, 470]]);
  const fy = track(t, [[E.looks, 900], [E.stairs, 1050], [E.railing, 880], [E.candle, 700], [E.face, 980], [E.nostranger, 980]]);
  const z = track(t, [[E.looks, 1.05], [E.stairs, 1.5], [E.face, 1.6], [E.nostranger, 1.7]]);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={z} x={fx - 540} y={fy - 960} shake={2.5} seed={3004}>
        <Stage overflow>
          <OverShoulder t={t} hand={[-150, -40]} otherHand={[110, -40]} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05: no stranger. The empty step in the glass, then the real stairs: he's standing on it */
export const NoStranger: React.FC<{t: number}> = ({t}) => {
  if (t < E.nostranger + 0.75) {
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={2.1} x={560 - 540} y={930 - 960} shake={2} seed={3005}>
          <Stage overflow>
            <OverShoulder t={t} hand={[-150, -40]} otherHand={[110, -40]} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.5} x={170} y={-90} shake={2.5} seed={3006}>
        <Stage overflow>
          <Landing t={t} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: his hand finds his whistle */
export const Whistle: React.FC<{t: number}> = ({t}) => {
  const w = prog(t, E.whistle + 0.2, E.smiles - 0.2, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + (t - E.whistle) * 0.03} x={-105} y={-80} shake={3} seed={3007}>
        <Stage overflow>
          <Landing t={t} whistle={w} sTurn={0.3} alarm={0.6} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07: the stranger smiles: clever, now he knows what I am. Then, to you: let's see how long until he knows what you are */
export const Taunt: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.smiles;
  const speaking = (t > E.clever && t < E.taunt - 0.25) || (t > E.taunt && t < E.screams - 0.4);
  const mouth = speaking ? 0.15 + 0.15 * Math.abs(Math.sin(t * 14)) : 0.08;
  const toUs = prog(t, E.taunt - 0.2, E.taunt + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.55 + lt * 0.03 + toUs * 0.2} x={150 + toUs * 20} y={-100 - toUs * 30} shake={2.5} seed={3008}>
        <Stage overflow>
          <Landing t={t} whistle={1} sTurn={0.3} alarm={0.7} reach={mix(1, 0.4, prog(t, E.smiles, E.clever))} strangerTurn={mix(0.21, 0.02, toUs)} mouth={mouth} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08: the whistle screams; he backs up the stairs */
export const BacksUp: React.FC<{t: number}> = ({t}) => {
  const scream = Math.max(0, 1 - (t - E.screams) / 1.4);
  const up = prog(t, E.backs, E.falls, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.18} x={40} y={-40} shake={3 + scream * 7} seed={3009}>
        <Stage overflow>
          <Landing t={t} whistle={1} sTurn={0.3} alarm={0.8} reach={0.2} strangerUp={up} strangerTurn={0.1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** Otto's shop key: iron, on a cleaver-shaped tag. */
const OttoKey: React.FC<{x: number; y: number; s?: number; rot?: number; glint?: number}> = ({x, y, s = 1, rot = 0, glint = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={0} r={34} fill="none" stroke="#3a3c42" strokeWidth={14} />
    <rect x={30} y={-8} width={150} height={16} rx={6} fill="#3a3c42" />
    <path d="M150,8 V40 H164 V24 H176 V8 Z" fill="#3a3c42" />
    <path d="M30,-6 H178" stroke="#c8d3e3" strokeOpacity={0.4 + glint * 0.5} strokeWidth={3} />
    {/* the cleaver-shaped tag on a loop of string */}
    <path d="M-20,28 C-40,60 -50,80 -40,100" stroke="#8a7050" strokeWidth={4} fill="none" />
    <g transform="translate(-60,96) rotate(-12)">
      <path d="M0,0 H90 L96,50 H0 Z" fill="#9aa4b0" stroke="#3a3c42" strokeWidth={4} />
      <rect x={90} y={12} width={50} height={20} rx={6} fill="#5a3a20" />
      <text x={44} y={34} textAnchor="middle" fontFamily="CountCaption, serif" fontSize={22} fill="#2a2a30">OTTO</text>
    </g>
    {glint > 0 && <circle cx={120} cy={-4} r={10 + glint * 10} fill="#fff" opacity={glint * 0.6} />}
  </g>
);

/* S09: something falls from his coat: it bounces down the treads. Otto's shop key */
export const Key: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, E.falls + 0.15, E.key, easeIn);
  const hop = Math.abs(Math.sin(k * Math.PI * 3)) * (1 - k) * 120;
  const glint = Math.max(0, 1 - Math.abs(t - (E.key + 0.3)) / 0.2);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + prog(t, E.key, E.slam) * 0.25} y={mix(-120, 60, k)} shake={3} seed={3010}>
        <Stage>
          <rect x={-200} y={-200} width={1500} height={2400} fill="#120f0d" />
          {/* the treads, close, falling away down the frame */}
          {Array.from({length: 7}, (_, i) => {
            const y = 200 + i * 240;
            return (
              <g key={i}>
                <rect x={-100} y={y} width={1300} height={170} fill={i % 2 ? '#5b4633' : '#69523c'} stroke="#1a1410" strokeWidth={6} />
                <rect x={-100} y={y + 170} width={1300} height={70} fill="#2a2018" />
                <path d={`M-100,${y + 6} H1200`} stroke="#b08f65" strokeOpacity={0.4} strokeWidth={4} />
              </g>
            );
          })}
          <ellipse cx={600} cy={700} rx={600} ry={500} fill="#ffb45a" opacity={0.08} />
          <OttoKey x={mix(820, 420, k)} y={mix(240, 1180, k) - hop} s={1.3} rot={mix(-30, 18, k) + Math.sin(k * 18) * 20} glint={glint} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: his door slams at the top of the stairs: a room you were never invited into */
export const Door: React.FC<{t: number}> = ({t}) => {
  const slam = prog(t, E.slam + 0.05, E.slam + 0.3, easeIn);
  const jolt = t > E.slam + 0.3 ? 0.04 * Math.exp(-(t - E.slam - 0.3) * 8) : 0;
  const bolt = prog(t, E.slam + 0.9, E.slam + 1.2, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + jolt + prog(t, E.invited, E.grab) * 0.15} y={-60} shake={3 + jolt * 80} seed={3011}>
        <Stage>
          <Wall id="r3-door-wall" x={-600} y={-600} w={2400} h={3000} warm={0.2} lit={0.6} />
          <rect x={-200} y={1300} width={1500} height={900} fill="#2a2018" />
          <path d="M-200,1300 H1300" stroke="#b08f65" strokeOpacity={0.35} strokeWidth={5} />
          {/* the doorway and the door swinging shut */}
          <path d="M300,1300 V560 Q540,380 780,560 V1300 Z" fill="#050403" stroke="#2a1e16" strokeWidth={30} />
          <g transform={`translate(780,0) scale(${mix(-0.15, 1, slam)},1) translate(-780,0)`}>
            <path d="M300,1300 V560 Q540,380 780,560 V1300 Z" fill="#3a2a1c" stroke="#1a120c" strokeWidth={10} />
            {[380, 460, 540, 620, 700].map((x) => <path key={x} d={`M${x},520 V1300`} stroke="#241810" strokeWidth={6} />)}
          </g>
          {/* a line of his candle under the door, then the bolt */}
          <rect x={310} y={1290} width={460} height={8} fill="#ffb45a" opacity={slam * 0.6} />
          <rect x={mix(330, 300, bolt)} y={900} width={60} height={22} rx={6} fill="#6a7280" opacity={slam} />
          <Candle x={170} y={1290} t={t} s={0.6} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: Safwan grabs your arm: you knew. How did you know? */
export const Grab: React.FC<{t: number}> = ({t}) => {
  const g = prog(t, E.grab + 0.1, E.grab + 0.5, easeOut);
  const pull = prog(t, E.how, E.pulled, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + (t - E.grab) * 0.03} x={-40 * pull} shake={3 + g * 2} seed={3012}>
        <Stage>
          <Wall id="r3-grab-wall" x={-600} y={-600} w={2400} h={3000} warm={0.25} lit={0.65} />
          <ellipse cx={540} cy={900} rx={600} ry={500} fill="#ffb45a" opacity={0.08} />
          {/* your sleeve and gloved hand, crossing the frame */}
          <path d={`M1300,${1100 - pull * 40} L${360 - pull * 60},${960 - pull * 30} L${360 - pull * 60},${1110 - pull * 30} L1300,${1290 - pull * 40} Z`} fill="#16181e" />
          <path d={`M1300,${1100 - pull * 40} L${360 - pull * 60},${960 - pull * 30}`} stroke="#adbbcc" strokeOpacity={0.3} strokeWidth={5} />
          <Hand id="r3-my-hand" x={330 - pull * 60} y={1040 - pull * 30} rot={-100} scale={1.1} style={GLOVE} pose={POSES.relaxed} light={0.8} />
          {/* his hand clamps round it */}
          <Hand id="r3-saf-grip" x={mix(560, 700, g) - pull * 60} y={mix(1500, 1170, g) - pull * 30} rot={-10} scale={1.25} style={SAFWAN_SKIN} pose={lerpPose(POSES.reach, POSES.fist, g)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12: he's pulled you back in front of the mirror; in the glass his hand is gripping nothing */
export const EmptyGrip: React.FC<{t: number}> = ({t}) => {
  // the grip rises as he pulls you round; the camera settles on a frame holding both his real grip and the empty one
  const lift = prog(t, E.pulled, E.glass, easeInOut);
  const hand: V = [mix(260, 300, lift), mix(-150, -330, lift)];
  const push = prog(t, E.nothing - 0.4, E.burst, easeInOut);
  const [gx, gy] = toGlass([REAL.x + hand[0] * REAL.s, REAL.y + hand[1] * REAL.s]);
  const fx = (gx + REAL.x + hand[0] * REAL.s) / 2, fy = (gy + REAL.y + hand[1] * REAL.s) / 2;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.05, 1.45, push)} x={mix(0, fx - 540, push)} y={mix(0, fy - 960, push)} shake={2.5} seed={3013}>
        <Stage overflow>
          <OverShoulder t={t} hand={hand} otherHand={[110, -40]} grip={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: the tavern door bursts open: Captain Grete, three lanterns, lantern light flooding the room */
export const Burst: React.FC<{t: number}> = ({t}) => {
  const open = prog(t, E.burst + 0.05, E.burst + 0.4, easeIn);
  const jolt = t > E.burst + 0.4 ? 0.05 * Math.exp(-(t - E.burst - 0.4) * 7) : 0;
  const closer = prog(t, E.grete - 0.1, E.grete + 0.5, easeInOut);
  const lamps = prog(t, E.lanterns, E.lanterns + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + jolt + closer * 0.35} y={closer * 40} shake={3 + jolt * 80} seed={3014}>
        <Stage overflow>
          <Wall id="r3-burst-wall" x={-600} y={-600} w={2400} h={3000} warm={0.25} lit={0.55} />
          <rect x={-600} y={1450} width={2400} height={800} fill="#211b18" />
          {/* the street outside the door, lanterns bobbing */}
          <g>
            <defs><clipPath id="r3-doorway"><rect x={290} y={380} width={500} height={1070} /></clipPath></defs>
            <g clipPath="url(#r3-doorway)">
              <g transform="translate(-20,-300) scale(1.05)"><TownStreet id="r3-street" t={t} /></g>
              <rect x={290} y={380} width={500} height={1070} fill="#05080c" opacity={0.25} />
              {/* the watch in the doorway */}
              <g opacity={0.95}>
                <ClovesFigure id="r3-watch-a" t={t} kind="safwan" x={420} y={1180} s={0.62} hand={[-120, -180]} otherHand={[100, -40]} turn={0.4} />
                <ClovesFigure id="r3-watch-b" t={t} kind="safwan" x={680} y={1170} s={0.6} hand={[-130, -60]} otherHand={[110, -190]} turn={0.5} mirror />
                <Resident id="r3-grete-door" t={t} x={545} y={1130} s={0.78} who="grete" hand={[-160, -140]} otherHand={[110, -10]} look={0} />
              </g>
              {/* their lanterns, raised */}
              {[[420 + 120 * 0.62, 1180 - 180 * 0.62], [545 - 160 * 0.78, 1130 - 140 * 0.78], [680 - 110 * 0.6, 1170 - 190 * 0.6]].map(([x, y], i) => (
                <g key={i}>
                  <ellipse cx={x} cy={y + 60} rx={160} ry={140} fill="#ffb45a" opacity={(0.15 + lamps * 0.15) * (0.9 + noise1(t * 7, i) * 0.1)} />
                  <WatchLantern id={`r3-burst-lamp-${i}`} t={t + i} x={x} y={y} s={0.55} />
                </g>
              ))}
            </g>
          </g>
          {/* the door itself, flung inward */}
          <g transform={`translate(290,0) scale(${mix(1, 0.08, open)},1) translate(-290,0)`}>
            <rect x={290} y={380} width={500} height={1070} fill="#3a2a1c" stroke="#1a120c" strokeWidth={12} />
            {[370, 450, 530, 610, 690].map((x) => <path key={x} d={`M${x},380 V1450`} stroke="#241810" strokeWidth={6} />)}
          </g>
          <rect x={270} y={360} width={540} height={1100} fill="none" stroke="#2a1e16" strokeWidth={40} />
          {/* lantern light pouring across the floor towards us */}
          <path d={`M290,1450 L790,1450 L${mix(790, 1500, open)},2200 L${mix(290, -400, open)},2200 Z`} fill="#ffb45a" opacity={0.16 * open} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: Grete asks Safwan, where is he? */
export const Asks: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={1.3 + (t - E.asks) * 0.03} y={-40} shake={2.5} seed={3015}>
      <Stage overflow>
        <Wall id="r3-asks-wall" x={-600} y={-600} w={2400} h={3000} warm={0.35} lit={0.75} />
        <ellipse cx={420} cy={700} rx={500} ry={500} fill="#ffb45a" opacity={0.12} />
        <Resident id="r3-grete" t={t} x={620} y={1060} s={1.1} who="grete" hand={[-150, -120]} otherHand={[80, 60]} look={-0.6} blade />
        <WatchLantern id="r3-grete-lamp" t={t} x={620 - 150 * 1.1} y={1060 - 120 * 1.1} s={0.75} />
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* S15: Safwan opens his mouth, and looks at the mirror. Cut on the look (no on-screen head turn): from behind him
   the glass shows him alone, his hand still closed on nothing; Grete's lantern light sweeps across it. Hard cut */
export const Mouth: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.mouth;
  const open = prog(t, E.mouth + 0.3, E.mouth + 0.8, easeOut);
  const cutOn = E.looksmirror + 0.3;
  const fade = prog(t, E.top + 1.2, E.cut, easeIn);
  if (t < cutOn) {
    // his eyes start toward the glass: the head leans a fraction, no more
    const lean = prog(t, E.looksmirror, cutOn, easeIn);
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={2.0 + lt * 0.04} x={-160 - lean * 12} y={-150} shake={2.5} seed={3016}>
          <Stage overflow>
            <Wall id="r3-mouth-wall" x={-600} y={-600} w={2400} h={3000} warm={0.25} lit={0.6} />
            <ClovesFigure id="r3-saf-close" t={t} kind="safwan" x={380} y={1200} s={0.9} hand={[-150, -40]} otherHand={[110, -40]} mirror turn={0.7 - lean * 0.08} alarm={0.7} mouth={open * 0.7} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  const ct = t - cutOn;
  const hand: V = [300, -330];
  const [gx, gy] = toGlass([REAL.x + hand[0] * REAL.s, REAL.y + hand[1] * REAL.s]);
  const push = prog(t, cutOn, E.cut, easeInOut);
  const sweep = prog(t, cutOn + 0.2, cutOn + 2.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.25, 1.75, push)} x={mix(0, gx - 540, push * 0.6)} y={mix(-60, gy - 960, push * 0.6)} shake={2 + Math.exp(-ct * 3) * 4} seed={3017}>
        <Stage overflow>
          <OverShoulder t={t} hand={hand} otherHand={[110, -40]} grip={1}>
            {/* Grete's lantern light crossing the glass */}
            <g clipPath="url(#r3-glass-clip)">
              <rect x={mix(-200, 1000, sweep)} y={-200} width={240} height={2400} fill="#ffd9a8" opacity={0.16} transform="skewX(-14)" />
            </g>
          </OverShoulder>
        </Stage>
      </Camera>
      <AbsoluteFill style={{background: '#000', opacity: fade * 0.6}} />
    </AbsoluteFill>
  );
};
