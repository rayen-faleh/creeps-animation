import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/rabenfels/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/rabenfels/art/Hand';
import {Resident} from '../../../../kit/rabenfels/art/Townsfolk';
import {ClovesBackFigure} from '../../../../kit/rabenfels/art/ClovesBackFigure';
import {WatchLantern} from '../../../../kit/rabenfels/art/ClovesProps';
import {Candle} from '../../../../kit/rabenfels/art/Props';
import {Wall} from '../../../../kit/rabenfels/art/Room';
import {TavernLanding} from '../../../../kit/rabenfels/sets/TavernLanding';
import {mix, prog, noise1, easeOut, easeIn, easeInOut} from '../../../../kit/rabenfels/util';
import {theme} from '../../../../kit/rabenfels/theme';
import {GLOVE, Supplier} from '../../rabenfels-02/scenes/Investigation';
import E2 from '../../rabenfels-02/events.json';
import {Landing} from '../../rabenfels-03/scenes/Story';
import E from '../events.json';

/* Rabenfels Part IV. Winner @lidssparrowlove: Elias jumps back from the mirror, glares at Safwan and points the watch
   upstairs. New resident: Lida Sperling, the Broken Bell's serving girl, who keeps the room keys. The stranger's rented
   room is a private residence and he never invited Elias, so Elias cannot cross its threshold. */

const LIDA_HAND: HandStyle = {...STYLES.adult, skin: '#c9a88c', shade: '#7a5444', cuff: '#5a2228', sleeve: '#5a2228'};
const OTTO_HAND: HandStyle = {...STYLES.adult, skin: '#b8aca0', shade: '#5a5048', cuff: '#353739', sleeve: '#353739'};
const WARM = '#ffb45a';

const Label: React.FC<{top?: number; small?: boolean; opacity?: number; children: React.ReactNode}> = ({top = 200, small = false, opacity = 1, children}) => (
  <div style={{position: 'absolute', left: 90, top, width: 900, opacity, fontFamily: theme.fonts.caption, fontSize: small ? 32 : 46, letterSpacing: small ? 2 : 5, color: small ? '#bbad94' : '#e2dac9', textShadow: '0 4px 16px #000', lineHeight: 1.25}}>
    {children}
  </div>
);

/* S01 hook: your gloved hand jerks back out of the mirror's edge; the glass shows only Safwan */
export const Hook: React.FC<{t: number}> = ({t}) => {
  const jerk = prog(t, 0.15, 0.55, easeOut);
  const [hx, hy] = wristFor(mix(330, 1200, jerk), mix(1060, 1250, jerk), -60, 1.08, GLOVE, POSES.claw, true);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.42 - jerk * 0.05} x={-230} y={-140} shake={3 + Math.exp(-t * 4) * 6} seed={4001}>
        <Stage overflow>
          <Landing t={t} reach={1} sTurn={0.6} alarm={0.5} foreground={<Hand id="r4-jerk" x={hx} y={hy} rot={-60} scale={1.08} style={GLOVE} pose={POSES.claw} mirror />} />
        </Stage>
      </Camera>
      <Label top={170} small>RABENFELS · 1732 · PART IV</Label>
      <Label top={225} small opacity={1 - prog(t, E.stepback + 2.2, E.closes)}>@lidssparrowlove chose: “You jump back from the mirror, glare at Safwan, and tell them the perpetrator is upstairs.”</Label>
    </AbsoluteFill>
  );
};

/* S02: you look at Safwan. Hard. He closes his mouth; his eyes drop */
export const Glare: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.stepback;
  const shut = prog(t, E.closes, E.closes + 0.5, easeOut);
  const chill = prog(t, E.look, E.look + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + lt * 0.04} x={-110} y={-90} shake={2} seed={4002}>
        <Stage overflow>
          <Landing t={t} reach={1} sTurn={0.85} alarm={mix(0.4, 0.9, shut)} safMouth={mix(0.8, 0, shut)} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${180 + chill * 140}px rgba(20,40,70,${0.25 + chill * 0.3})`}} />
    </AbsoluteFill>
  );
};

/* S03: you tell Grete the man she wants is upstairs; her lantern swings to the stairs */
export const Grete: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.grete;
  const swing = prog(t, E.upstairs, E.upstairs + 0.8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.03} x={mix(0, 80, swing)} y={-40} shake={2.5} seed={4003}>
        <Stage overflow>
          <Wall id="r4-gr-wall" x={-600} y={-600} w={2400} h={3000} warm={0.35} lit={0.75} />
          <ellipse cx={mix(420, 820, swing)} cy={mix(700, 420, swing)} rx={500} ry={500} fill={WARM} opacity={0.12} />
          <Resident id="r4-grete" t={t} x={560} y={1060} s={1.1} who="grete" hand={[mix(-150, -60, swing), mix(-120, -330, swing)]} otherHand={[80, 60]} look={mix(-0.6, 0.6, swing)} blade />
          <WatchLantern id="r4-grete-lamp" t={t} x={560 + mix(-150, -60, swing) * 1.1} y={1060 + mix(-120, -330, swing) * 1.1 + 50} s={0.75} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** An iron key ring. */
const KeyRing: React.FC<{x: number; y: number; s?: number; swing?: number}> = ({x, y, s = 1, swing = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${swing * 25}) scale(${s})`}>
    <circle cx={0} cy={0} r={26} fill="none" stroke="#5a5c62" strokeWidth={7} />
    {[-30, 0, 30].map((a, i) => (
      <g key={i} transform={`rotate(${a}) translate(0,26)`}>
        <rect x={-4} y={0} width={8} height={70} fill="#5a5c62" />
        <path d="M4,52 H18 V62 H4 Z M4,40 H14 V48 H4 Z" fill="#5a5c62" />
      </g>
    ))}
  </g>
);

/* S04: Lida, the serving girl, runs for Marta's keys. Name card */
export const Lida: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.lida;
  const run = prog(t, E.lida, E.climb, easeInOut);
  const bobY = Math.abs(Math.sin(lt * 9)) * -16;
  const x = mix(940, 300, run);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25} x={mix(160, -120, run)} y={-20} shake={3} seed={4004}>
        <Stage overflow>
          <Wall id="r4-li-wall" x={-800} y={-600} w={2800} h={3000} warm={0.4} lit={0.8} />
          <rect x={-800} y={1300} width={2800} height={900} fill="#2a2018" />
          <Candle x={760} y={1180} t={t} s={0.7} />
          <rect x={700} y={1180} width={120} height={20} fill="#2a2018" />
          <ellipse cx={760} cy={1000} rx={400} ry={360} fill={WARM} opacity={0.1} />
          <Resident id="r4-lida" t={t} x={x} y={1030 + bobY} s={0.95} who="lida" hand={[-200, -200 + Math.sin(lt * 9) * 30]} otherHand={[110, -40 - Math.sin(lt * 9) * 30]} lean={0.5} look={-0.2} />
          <KeyRing x={x - 200 * 0.95} y={1030 + bobY - 200 * 0.95 + 40} s={1.0} swing={Math.sin(lt * 9)} />
        </Stage>
      </Camera>
      <Label top={180}>LIDA SPERLING</Label>
      <Label top={240} small>THE BROKEN BELL · Resident created for @lidssparrowlove</Label>
    </AbsoluteFill>
  );
};

/* S05: three lanterns climb the stairs; Safwan climbs with them and doesn't look back */
export const Climb: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.climb;
  const up = (d: number) => prog(t, E.climb + d, E.bolt - 0.2 + d * 0.3, easeInOut);
  const stairPt = (u: number): [number, number] => [mix(620, 1150, u), mix(1180, 760, u)];
  const saf = prog(t, E.safwan - 0.3, E.bolt, easeInOut);
  const [sx, sy] = stairPt(saf * 0.75);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.02} x={60} y={-60} shake={2.5} seed={4005}>
        <Stage overflow>
          <TavernLanding id="r4-climb" t={t}>
            {[0, 0.5, 1.0].map((d, i) => {
              const [lx, ly] = stairPt(Math.min(1, up(d) * 1.05) * (0.95 - i * 0.12));
              return (
                <g key={i}>
                  <ellipse cx={lx} cy={ly - 60} rx={180} ry={150} fill={WARM} opacity={0.14} />
                  <WatchLantern id={`r4-cl-${i}`} t={t + i} x={lx} y={ly - 140} s={0.5} />
                </g>
              );
            })}
            <g transform={`translate(${sx},${sy - 10}) scale(0.62)`}>
              <ClovesBackFigure t={t} hand={[-150, -40]} otherHand={[110, -40]} turn={0.2} />
            </g>
          </TavernLanding>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: the bolt, the key, the door swings in on darkness */
export const DoorOpen: React.FC<{t: number}> = ({t}) => {
  const turn = prog(t, E.key, E.key + 0.4, easeInOut);
  const open = prog(t, E.swings + 0.1, E.gone - 0.1, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.6, 1.15, open)} x={mix(-120, 0, open)} y={mix(60, -40, open)} shake={2.5} seed={4006}>
        <Stage overflow>
          <Wall id="r4-do-wall" x={-600} y={-600} w={2400} h={3000} warm={0.2} lit={0.6} />
          <ellipse cx={300} cy={1000} rx={500} ry={500} fill={WARM} opacity={0.12} />
          <path d="M300,1400 V560 Q540,380 780,560 V1400 Z" fill="#03040a" />
          {/* moonlight from the room's open window, once the door opens */}
          <path d="M520,560 L780,560 L700,1400 L380,1400 Z" fill="#9fb4cf" opacity={0.12 * open} />
          <g transform={`translate(300,0) scale(${mix(1, 0.12, open)},1) translate(-300,0)`}>
            <path d="M300,1400 V560 Q540,380 780,560 V1400 Z" fill="#3a2a1c" stroke="#1a120c" strokeWidth={10} />
            {[380, 460, 540, 620, 700].map((x) => <path key={x} d={`M${x},520 V1400`} stroke="#241810" strokeWidth={6} />)}
            <rect x={330} y={900} width={60} height={22} rx={6} fill="#6a7280" />
            <rect x={340} y={980} width={40} height={60} rx={6} fill="#2a2c32" stroke="#6a7280" strokeWidth={3} />
          </g>
          <path d="M300,1400 V560 Q540,380 780,560 V1400" fill="none" stroke="#2a1e16" strokeWidth={30} />
          {open < 0.5 && <Hand id="r4-key-hand" x={260} y={1220} rot={mix(10, 60, turn)} scale={0.9} style={LIDA_HAND} pose={POSES.fist} light={0.9} />}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The stranger's room by lantern and moonlight: an open window with lifting curtains, an empty bed, the floorboards. */
const Room: React.FC<{t: number; lit?: number; children?: React.ReactNode}> = ({t, lit = 1, children}) => {
  const lift = 0.5 + 0.5 * Math.sin(t * 1.7);
  return (
    <g>
      <Wall id="r4-room-wall" x={-600} y={-600} w={2400} h={3000} warm={0.15} lit={0.5} />
      <rect x={-600} y={1250} width={2400} height={900} fill="#2a2018" />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M-600,${1270 + i * 90} H1800`} stroke="#1a140e" strokeWidth={6} />)}
      {/* the window, open on the night */}
      <rect x={640} y={300} width={360} height={520} fill="#0c1424" stroke="#2a2018" strokeWidth={24} />
      <circle cx={880} cy={420} r={44} fill="#d9e2ec" />
      <path d={`M640,300 C${700 + lift * 60},${500} ${620 + lift * 80},${700} ${660 + lift * 50},860 L620,860 L620,300 Z`} fill="#c8c0b0" opacity={0.7} />
      <path d="M640,820 L1000,1400 L240,1400 Z" fill="#9fb4cf" opacity={0.07} />
      {/* the empty bed */}
      <rect x={-200} y={980} width={640} height={240} fill="#3a2a1c" />
      <rect x={-180} y={940} width={600} height={70} rx={20} fill="#c8c0b0" opacity={0.6} />
      <ellipse cx={300 + noise1(t * 3, 4) * 10} cy={900} rx={600 * lit} ry={500 * lit} fill={WARM} opacity={0.1 * lit} />
      {children}
    </g>
  );
};

/* S07-08: the stranger is gone, the window open; lantern light finds a hand on the floor */
export const Gone: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.gone;
  const find = prog(t, E.floor, E.otto, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 1.6, find) + lt * 0.01} x={mix(80, 60, find)} y={mix(-60, 340, find)} shake={2.5} seed={4007}>
        <Stage overflow>
          <Room t={t}>
            <Hand id="r4-floor-hand" x={560} y={1500} rot={-80} scale={1.0} style={OTTO_HAND} pose={POSES.relaxed} light={0.4 + find * 0.6} />
            <ellipse cx={600} cy={1440} rx={300 * find} ry={160 * find} fill={WARM} opacity={0.18 * find} />
          </Room>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** Otto lying on the floorboards: the butcher on his back, pale, two marks at his throat. */
const OttoLying: React.FC<{t: number; x: number; y: number; s: number; look?: number}> = ({t, x, y, s, look = 0}) => (
  <g transform={`translate(${x},${y}) rotate(90) scale(${s})`}>
    <Resident id="r4-otto" t={t} x={0} y={0} who="otto" hand={[-200, 40]} otherHand={[160, 60]} look={look} />
    <circle cx={10} cy={-372} r={6} fill="#5a0a10" />
    <circle cx={28} cy={-368} r={6} fill="#5a0a10" />
  </g>
);

/* S09: Otto. Alive. Barely */
export const Otto: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.otto;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.45 + lt * 0.05} x={60} y={420} shake={2} seed={4008}>
        <Stage overflow>
          <Room t={t}>
            <OttoLying t={t} x={180} y={1420} s={0.9} />
            <WatchLantern id="r4-ot-lamp" t={t} x={860} y={1180} s={0.7} />
          </Room>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: Grete at the bedside waves you in: clerk, bring your pen */
export const WavesIn: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.waves;
  const beckon = Math.max(0, Math.sin((t - E.waves) * 5)) * prog(t, E.waves, E.waves + 0.3);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} x={40} y={-20} shake={2.5} seed={4009}>
        <Stage overflow>
          <Room t={t}>
            <OttoLying t={t} x={60} y={1480} s={0.7} />
            <Resident id="r4-grete-in" t={t} x={720} y={1060} s={1.0} who="grete" hand={[-200, mix(-160, -230, beckon)]} otherHand={[110, -20]} look={-0.4} />
            <Resident id="r4-lida-kneel" t={t} x={360} y={1180} s={0.72} who="lida" hand={[-150, 60]} otherHand={[110, 40]} lean={0.8} look={0.2} />
          </Room>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11-12: you can't: it's his room and he never invited you. Your foot stops at the doorway as if on glass */
export const Threshold: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.cant;
  const step = prog(t, E.foot - 0.2, E.foot + 0.4, easeOut);
  const press = t > E.foot + 0.4 ? Math.sin((t - E.foot - 0.4) * 9) * 4 * Math.exp(-(t - E.foot - 0.4) * 1.5) : 0;
  const shimmer = prog(t, E.foot + 0.3, E.foot + 0.7) * (1 - prog(t, E.foot + 1.6, E.eyes));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.02} y={60} shake={2.5} seed={4010}>
        <Stage overflow>
          {/* the room beyond the doorway, small and lit */}
          <Wall id="r4-th-wall" x={-600} y={-600} w={2400} h={3000} warm={0.2} lit={0.55} />
          <g>
            <defs><clipPath id="r4-doorway"><path d="M240,1500 V480 Q540,260 840,480 V1500 Z" /></clipPath></defs>
            <g clipPath="url(#r4-doorway)">
              <g transform="translate(150,260) scale(0.72)">
                <Room t={t}>
                  <OttoLying t={t} x={160} y={1480} s={0.7} />
                  <Resident id="r4-grete-th" t={t} x={720} y={1060} s={1.0} who="grete" hand={[-200, -200]} otherHand={[110, -20]} look={-0.4} />
                  <Resident id="r4-lida-th" t={t} x={360} y={1180} s={0.72} who="lida" hand={[-150, 60]} otherHand={[110, 40]} lean={0.8} look={0.2} />
                </Room>
              </g>
            </g>
          </g>
          <path d="M240,1500 V480 Q540,260 840,480 V1500" fill="none" stroke="#2a1e16" strokeWidth={40} />
          {/* the threshold plank, and the line you cannot cross */}
          <rect x={200} y={1500} width={680} height={40} fill="#4a3424" />
          <path d={`M240,${1500 - shimmer * 200} L840,${1500 - shimmer * 200}`} stroke="#c8d3e3" strokeOpacity={0.25 * shimmer} strokeWidth={3} />
          <rect x={-600} y={1540} width={2400} height={700} fill="#1e1610" />
          {/* your boot, stopped flat against nothing */}
          <g transform={`translate(${540 + press},${mix(1900, 1600, step)})`}>
            <path d="M-90,0 L-70,-170 L60,-170 L80,-20 C140,-10 170,30 160,60 L-100,60 Z" fill="#0c0c10" stroke="#adbbcc" strokeOpacity={0.3} strokeWidth={4} />
          </g>
          <ellipse cx={540} cy={1530} rx={200 * shimmer} ry={30 * shimmer} fill="#c8d3e3" opacity={0.12 * shimmer} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: Otto opens his eyes; he sees you in the doorway */
export const OttoEyes: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.eyes;
  const toYou = prog(t, E.sees, E.sees + 0.8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={2.1 + lt * 0.05} x={70} y={460} shake={2} seed={4011}>
        <Stage overflow>
          <Room t={t}>
            <OttoLying t={t} x={180} y={1420} s={0.9} look={mix(0, -0.8, toYou)} />
          </Room>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: the only man in Rabenfels who knows what you buy from him: Part II's warm memory of his counter */
export const Memory: React.FC<{t: number}> = ({t}) => <Supplier t={E2.memory + 0.6 + (t - E.only) * 0.8} />;

/* S15: he pulls Lida close and whispers something */
export const Whisper: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.pulls;
  const pull = prog(t, E.pulls + 0.2, E.pulls + 1.0, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + lt * 0.04} x={100} y={260} shake={2} seed={4012}>
        <Stage overflow>
          <Room t={t} lit={0.8}>
            <OttoLying t={t} x={120} y={1420} s={0.85} look={-0.3} />
            <Resident id="r4-lida-wh" t={t} x={mix(800, 720, pull)} y={1130} s={0.85} who="lida" hand={[-190, 120]} otherHand={[110, 60]} lean={mix(0.6, 1.0, pull)} look={0.6} />
            <Hand id="r4-otto-grip" x={mix(600, 640, pull)} y={1330} rot={30} scale={0.55} style={OTTO_HAND} pose={POSES.fist} light={0.7} />
          </Room>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S16: Lida looks up. At you. Seen from the doorway you can't cross: she turns from Otto to face the camera, lit by
   Grete's lantern on one side and the window's moonlight behind; the push lands on her eyes; the heartbeat pulses red */
export const LidaLooks: React.FC<{t: number}> = ({t}) => {
  const lt = t - E.looksup;
  const turn = prog(t, E.atyou - 0.35, E.atyou + 0.3, easeInOut);
  const push = prog(t, E.looksup, E.cut, easeInOut);
  const fade = prog(t, E.top + 1.2, E.cut, easeIn);
  const beat = t > E.atyou + 0.3 ? Math.max(0, Math.sin((t - E.atyou - 0.3) * Math.PI * 2 / 0.95)) ** 8 : 0;
  const flick = 0.9 + noise1(t * 7, 2) * 0.1;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.6, 2.5, push)} x={mix(-20, -40, push)} y={mix(-20, -75, push)} rot={mix(-1.5, 0, push)} shake={1.8} seed={4013}>
        <Stage overflow>
          <Room t={t} lit={0.6}>
            {/* moonlight from the window behind her: a cool rim */}
            <path d="M700,300 L1000,300 L740,1500 L380,1500 Z" fill="#9fb4cf" opacity={0.1} />
            <Resident id="r4-lida-up" t={t} x={500} y={1250} s={0.85} who="lida" hand={[-170, 90]} otherHand={[110, 60]} lean={mix(0.9, 0.2, turn)} look={mix(0.5, 0, turn)} turn={turn} />
            {/* Grete's lantern off to the left, warming that side of her face */}
            <ellipse cx={260} cy={860} rx={380} ry={420} fill={WARM} opacity={0.16 * flick} />
            <WatchLantern id="r4-lu-lamp" t={t} x={120} y={980} s={0.7} />
          </Room>
          {/* the doorway you're stuck in: dark frame edges in the foreground */}
          <rect x={-600} y={-800} width={900} height={3200} fill="#08060a" opacity={0.92} />
          <rect x={770} y={-800} width={1000} height={3200} fill="#08060a" opacity={0.92} />
          <path d="M300,-800 V2400 M770,-800 V2400" stroke="#3a2a1c" strokeWidth={18} />
          <path d="M308,-800 V2400" stroke="#ffb45a" strokeOpacity={0.18} strokeWidth={4} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${220 + beat * 140}px rgba(120,10,16,${0.15 + beat * 0.35})`}} />
      <AbsoluteFill style={{background: '#000', opacity: fade * 0.6}} />
    </AbsoluteFill>
  );
};
