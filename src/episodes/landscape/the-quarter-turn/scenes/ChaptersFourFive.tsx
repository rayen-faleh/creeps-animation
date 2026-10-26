import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {ElderProfile, Candle} from '../../../../kit/common/art/Props';
import {Floor, Wall} from '../../../../kit/common/art/Room';
import {Watcher} from '../../../../kit/common/art/Watcher';
import {KeyTag, LetterPage} from '../../../../kit/common/art/Notebook';
import {CottageExterior, GardenView} from '../../../../kit/common/art/Cottage';
import {MantelPhoto, SoilTrail, Staircase, WeddingPhoto} from '../../../../kit/common/art/Interior';
import {TitleCard} from '../../../../kit/common/series/TitleCard';
import {BackBedroomL, BB, DoorWallL, L_DOOR, KitchenSinkL} from '../../../../kit/landscape';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../../kit/common/util';
import {at, end, LEAD} from '../beats';
import {BedView, DRIP, HandOnTap, ME, TapMacro} from './shared';
import {GRAN} from './ChapterOne';

export const C4 = {
  start: at('C4_01') - LEAD,
  woke: at('C4_02'),
  nodrip: at('C4_04'),
  sound: at('C4_05'),
  torch: at('C4_06'),
  backdoor: at('C4_07'),
  soil: at('C4_08'),
  smell: at('C4_08b'),
  trail: at('C4_10'),
  climb: at('C4_12'),
  top: at('C4_13'),
  push: at('C4_17'),
  inside: at('C4_18'),
  photo: at('C4_20'),
  dent: at('C4_21'),
  letter: at('C4_22'),
  end: at('C5_01') - LEAD,
};

export const C5 = {
  start: C4.end,
  winter: at('C5_03'),
  buried: at('C5_04'),
  water: at('C5_05'),
  every: at('C5_06'),
  years: at('C5_07'),
  tired: at('C5_08'),
  room: at('C5_09'),
  look: at('C5_10'),
  face: at('C5_11'),
  ran: at('C5_13'),
  kitchen: at('C5_14'),
  turn: at('C5_15'),
  nothing: at('C5_16'),
  another: at('C5_17'),
  door: at('C5_19'),
  steps: at('C5_20'),
  stood: at('C5_21'),
  stopped: at('C5_22'),
  cut: at('C5_24') - 0.12,
};

const LETTER = [
  'My dear,',
  "If you're reading this, you fixed the tap.",
  "Don't be cross with yourself.",
  "I'm sorry I lied about your grandad.",
  "He didn't walk out.",
  'In the winter of seventy-four...',
  'Running water, love.',
  'Every night, a quarter turn.',
  "If the water's stopped, he'll come home.",
  "He'll think it's still 1974.",
  "Don't let him see your face.",
  'You look just like me.',
  '   Gran',
];

/** Grandad's head and shoulders, reflected faintly in the dark window glass. */
const Reflection: React.FC<{x: number; y: number; s: number; a: number; t: number}> = ({x, y, s, a, t}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={a}>
    <path d="M-150,260 C-150,140 -110,90 -60,70 L-40,40 C-70,20 -80,-30 -74,-70 C-66,-130 -20,-150 10,-148 C60,-146 84,-100 80,-50 C78,-10 60,24 40,40 L60,70 C110,90 150,140 150,260 Z" fill="#cfd8e6" opacity={0.34} />
    <circle cx={-16} cy={-40} r={5} fill="#f4f8ff" opacity={0.75 + 0.25 * Math.sin(t * 3)} />
    <circle cx={30} cy={-40} r={5} fill="#f4f8ff" opacity={0.75 + 0.25 * Math.sin(t * 3 + 1)} />
  </g>
);

/* the kitchen floor by phone torch: soil and red petals */
const SoilFloor: React.FC<{t: number; close?: boolean}> = ({t, close}) => {
  const t0 = close ? C4.smell : C4.soil;
  const k = prog(t, t0, close ? C4.trail : C4.smell, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={close ? 2.2 : 1.1} x={close ? mix(-200, 100, k) : 0} y={close ? 160 : mix(-60, 80, k)} shake={4} seed={501}>
        <Stage>
          <Floor id={close ? 'sf2' : 'sf'} x={-400} y={-200} w={2720} h={1700} lit={0.5} />
          <SoilTrail x0={-100} y0={420} x1={2000} y1={760} reveal={1} />
        </Stage>
      </Camera>
      <Torch x={close ? 960 : mix(600, 1300, k)} y={close ? 600 : 640} r={480} ambient={0.06} />
    </AbsoluteFill>
  );
};

/* the stairs: the trail goes up; I follow it, one stair at a time */
const StairsUp: React.FC<{t: number; t0: number; climb?: boolean; door?: number; legs?: number}> = ({t, t0, climb, door = 0, legs = 0}) => {
  const k = climb ? prog(t, t0, C4.top, easeInOut) : 0;
  const step = climb ? Math.abs(Math.sin((t - t0) * Math.PI * 1.1)) * 8 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 2.2, k)} y={mix(60, -300, k) + step} shake={4} seed={502}>
        <Stage>
          <Staircase id={`su${Math.round(t0)}`} t={t} light="night" prints={climb ? 1 : 0.5}>
            {/* the door at the top opening onto black */}
            {door > 0 && <path d={`M${1060 - door * 180},180 L${1060 - door * 180},0 Q${1060 - door * 90},-60 1060,0 L1060,180 Z`} fill="#000" />}
            {/* boots coming down */}
            {legs > 0 && (
              <g transform={`translate(${mix(960, 930, legs)},${mix(150, 420, legs)}) scale(${mix(0.45, 0.9, legs)})`}>
                <path d="M-60,-260 L-70,0 L-20,0 L-14,-260 Z M14,-260 L20,0 L74,0 L62,-260 Z" fill="#030303" />
                <path d="M-84,0 L-14,0 L-18,-22 L-76,-22 Z M14,0 L90,0 L80,-22 L18,-22 Z" fill="#000" />
                <path d="M-14,-260 L-20,-120 M62,-260 L70,-120" stroke="#8fa3c0" strokeOpacity={0.25} strokeWidth={3} />
              </g>
            )}
          </Staircase>
        </Stage>
      </Camera>
      <Torch x={960} y={climb ? 640 : legs > 0 || door > 0 ? 420 : 760} r={legs > 0 || door > 0 ? 620 : 460} ambient={legs > 0 || door > 0 ? 0.16 : 0.07} />
    </AbsoluteFill>
  );
};

/* the back bedroom door: open a crack, cold air; my hand pushes it */
const OpenDoor: React.FC<{t: number; push?: boolean; closed?: boolean}> = ({t, push, closed}) => {
  const t0 = push ? C4.push : closed ? C4.sound : C4.top;
  const open = closed ? 0 : push ? mix(0.08, 0.55, prog(t, t0 + 0.3, t0 + 2.6, easeInOut)) : 0.08;
  const reach = push ? prog(t, t0, t0 + 0.4, easeOut) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={push ? 1.4 : 1.1 + (t - t0) * 0.02} y={-20} shake={4} seed={503}>
        <Stage>
          <DoorWallL id={push ? 'od2' : 'od'} t={t} mode="night" open={open} beyond={<rect x={0} y={0} width={1920} height={1080} fill="#02040a" />} />
          {push && <Hand id="od-h" x={mix(1400, L_DOOR.cx + 120, reach)} y={mix(1300, 620, reach)} rot={-40} scale={1.2} style={ME} pose={POSES.flat} light={0.7} />}
        </Stage>
      </Camera>
      <Torch x={1000} y={560} r={520} ambient={0.08} />
    </AbsoluteFill>
  );
};

/* inside: 1974 by torchlight */
const Room1974: React.FC<{t: number; t0: number; focus: 'pan' | 'dent' | 'empty'}> = ({t, t0, focus}) => {
  const k = prog(t, t0, t0 + 12, easeInOut);
  const bx = focus === 'pan' ? track(t, [[t0, 1500], [t0 + 4, 1450], [t0 + 7, BB.calendar.x], [t0 + 11, 700]]) : focus === 'dent' ? 900 : 600;
  const by = focus === 'pan' ? track(t, [[t0, 760], [t0 + 4, 720], [t0 + 7, BB.calendar.y], [t0 + 11, 720]]) : 720;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={focus === 'dent' ? 1.9 : 1.1 + k * 0.1} x={focus === 'dent' ? -60 : 0} y={focus === 'dent' ? 180 : 0} shake={3} seed={504}>
        <Stage>
          <BackBedroomL id={`r74${focus}`} t={t} letter={focus !== 'empty'} />
        </Stage>
      </Camera>
      <Torch x={focus === 'dent' ? 1000 : bx} y={focus === 'dent' ? 560 : by} r={focus === 'empty' ? 900 : 460} ambient={focus === 'empty' ? 0.16 : 0.08} />
    </AbsoluteFill>
  );
};

/* the wedding photo: push to the groom (or, later, the bride) */
const Wedding: React.FC<{t: number; t0: number; bride?: boolean}> = ({t, t0, bride}) => {
  const k = prog(t, t0 + 0.5, t0 + 8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.3, 2.5, k)} x={mix(0, bride ? -60 : 110, k)} y={mix(0, -160, k)} shake={3} seed={505}>
        <Stage>
          <rect x={-400} y={-400} width={2720} height={1900} fill="#08090c" />
          <MantelPhoto id={`wp${bride ? 'b' : 'g'}`} x={960} y={860} s={1.6} down={0} warm={0.2} lit={0.8}>
            <WeddingPhoto lit={0.8} />
          </MantelPhoto>
        </Stage>
      </Camera>
      <Torch x={960} y={480} r={520} ambient={0.06} />
    </AbsoluteFill>
  );
};

/* the envelope on the pillow: one word */
const Envelope: React.FC<{t: number}> = ({t}) => {
  const lt = t - C4.letter;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.05} shake={3} seed={506}>
        <Stage>
          <rect x={-400} y={-400} width={2720} height={1900} fill="#3a3448" />
          <ellipse cx={960} cy={520} rx={760} ry={300} fill="#9aa0ae" opacity={0.7} />
          <g transform="translate(960,560) rotate(-5)">
            <rect x={-380} y={-200} width={760} height={400} fill="#cfc7b2" />
            <path d="M-380,-200 L0,40 L380,-200" stroke="#8a8270" strokeWidth={4} fill="none" />
            {/* the name: in Gran's hand, unreadable in the torch's hot spot */}
            <path d="M-170,110 c20,-40 40,-40 50,0 c10,30 30,30 40,-10 c10,-40 30,-30 34,6 c6,30 26,24 36,-6 c14,-36 40,-30 44,10 c4,24 30,20 40,-4" stroke="#22202a" strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        </Stage>
      </Camera>
      <Torch x={1020} y={600} r={430} ambient={0.08} />
    </AbsoluteFill>
  );
};

/* the letter in my hands; lines appear as Gran reads them */
const Letter: React.FC<{t: number; t0: number; t1: number; from: number; to: number; highlight?: number}> = ({t, t0, t1, from, to, highlight = -1}) => {
  const lt = t - t0;
  const reveal = mix(from, to, prog(t, t0 + 0.3, t1 - 0.3, (x) => x)) / LETTER.length;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.015} y={-20} rot={-2} shake={3} seed={507}>
        <Stage>
          <rect x={-400} y={-400} width={2720} height={1900} fill="#05060a" />
          <Hand id="lt-l" x={560} y={1060} rot={30} scale={1.2} style={ME} pose={POSES.relaxed} light={0.7} />
          <Hand id="lt-r" x={1360} y={1060} rot={-30} scale={1.2} style={ME} pose={POSES.relaxed} mirror light={0.7} />
          <LetterPage x={960} y={600} s={0.82} rot={-2} lines={LETTER} reveal={reveal} lit={0.9} highlight={highlight} size={40} />
        </Stage>
      </Camera>
      <Torch x={960} y={500} r={640} ambient={0.1} />
    </AbsoluteFill>
  );
};

/* flashbacks (warm, as Gran tells it) */
const WinterHome: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, C5.winter, C5.buried, (x) => x);
  return (
    <Camera t={t} zoom={1.1 + k * 0.1} shake={3} seed={508}>
      <Stage>
        <CottageExterior id="wh" t={t} light="night" lamp={1} smoke={0.6} />
        <Watcher id="wh-g" t={t} x={mix(960, 960, k)} y={mix(1060, 900, k)} s={mix(0.34, 0.24, k)} bothArms noTorch rim="#9fb4cf" rimA={0.5} />
        {/* something on the moor behind him */}
        <circle cx={1240 - k * 60} cy={690} r={3} fill="#c4161c" opacity={0.6 + 0.3 * Math.sin(t * 5)} />
        <circle cx={1252 - k * 60} cy={690} r={3} fill="#c4161c" opacity={0.6 + 0.3 * Math.sin(t * 5 + 1)} />
      </Stage>
    </Camera>
  );
};

const Burial: React.FC<{t: number; water?: boolean}> = ({t, water}) => {
  const t0 = water ? C5.water : C5.buried;
  const pat = water ? 0 : Math.max(0, Math.sin((t - t0) * 4));
  return (
    <Camera t={t} zoom={water ? 2.0 : 1.35} y={water ? 200 : 120} shake={3} seed={509}>
      <Stage>
        <GardenView id={water ? 'bw' : 'bu'} t={t} light="night" trench={water ? prog(t, t0, t0 + 4, easeInOut) : 0}>
          {!water && <ellipse cx={960} cy={700} rx={180} ry={40} fill="#1a120a" />}
        </GardenView>
        {!water && (
          <g>
            <g transform="translate(1300,760) rotate(14)">
              <rect x={-8} y={-300} width={16} height={280} fill="#2a1a0e" />
              <path d="M-44,-20 L44,-20 L36,70 Q0,100 -36,70 Z" fill="#3a3c42" />
            </g>
            <Hand id="bu-h" x={900} y={700 - pat * 16} rot={175} scale={0.7} style={{...GRAN, skin: '#d8b496'}} pose={POSES.flat} light={0.7} showSleeve={false} />
          </g>
        )}
      </Stage>
    </Camera>
  );
};

/* fifty-two years of quarter turns: her hand ages, the sleeve changes */
const Years: React.FC<{t: number; t0: number; t1: number; montage?: boolean}> = ({t, t0, t1, montage}) => {
  const n = montage ? Math.floor((t - t0) / 0.75) : 0;
  const ph = montage ? ((t - t0) % 0.75) / 0.75 : prog(t, t0 + 0.4, t1 - 0.6, easeInOut);
  const sleeves = ['#4a2028', '#2a3448', '#3a3a2a', '#4a2028', '#30242a'];
  const age = montage ? Math.min(1, (t - t0) / (t1 - t0)) : 0.3;
  const style: HandStyle = {...lerpStyle({...GRAN, skin: '#d8b496', shade: '#7a5a46', wrinkles: false}, GRAN, age), ring: '#c8a24a', sleeve: sleeves[n % sleeves.length], cuff: '#1a1014', sleeveLen: 520};
  const turn = montage ? ph * 90 : ph * 90;
  return (
    <TapMacro t={t} t0={t0} id={montage ? 'yr-m' : 'yr'} mode="lamp" turn={turn} torch={false}>
      <HandOnTap id={montage ? 'yr-mh' : 'yr-h'} style={style} reach={1} turn={turn} t={t} />
    </TapMacro>
  );
};

const GranTired: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={1.05 + (t - C5.tired) * 0.02} shake={2} seed={510}>
      <Stage>
        <Wall id="gt-wall" x={-400} y={-400} w={2720} h={1900} warm={1} />
        <rect x={-400} y={-400} width={2720} height={1900} fill="#000" opacity={0.55} />
        <ElderProfile x={1080} y={470} s={1.0} t={t} finger={0} lean={0.9} />
      </Stage>
    </Camera>
    <AbsoluteFill style={{filter: 'blur(8px)'}}>
      <Stage>
        <Candle x={420} y={1200} t={t} s={1.1} glow={0.5} />
      </Stage>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* the climax at the dry tap; in the dark window, a reflection comes closer */
const DryTap: React.FC<{t: number; phase: 'turn' | 'nothing' | 'stood' | 'behind'}> = ({t, phase}) => {
  const t0 = phase === 'turn' ? C5.turn : phase === 'nothing' ? C5.nothing : phase === 'stood' ? C5.stood : C5.stopped;
  const first = prog(t, end('C5_15') - 0.8, end('C5_15') - 0.1, easeInOut) * 90;
  const second = prog(t, C5.another, C5.another + 0.6, easeInOut) * 90;
  const turn = phase === 'turn' ? first : phase === 'nothing' ? 90 + second : 180;
  const reach = phase === 'turn' ? prog(t, t0, t0 + 1.2, easeOut) : 1;
  const tremble = phase === 'stood' || phase === 'behind' ? 1.6 : 0.5;
  const near = phase === 'behind' ? prog(t, t0, C5.cut, (x) => x) : phase === 'stood' ? prog(t, t0 + 2.5, t0 + 5.6) * 0.25 : 0;
  const lookUp = phase === 'stood' ? prog(t, t0 + 0.5, t0 + 2.5, easeInOut) : phase === 'behind' ? 1 : 0;
  return (
    <TapMacro
      t={t}
      t0={t0}
      id={`dt-${phase}`}
      mode="night"
      turn={turn}
      lookUp={lookUp}
      inGlass={near > 0 ? <Reflection x={960} y={330 - near * 40} s={0.4 + near * 0.7} a={0.5 + near * 0.5} t={t} /> : undefined}
    >
      <HandOnTap id={`dth-${phase}`} style={ME} reach={reach} turn={turn} tremble={tremble} t={t} />
    </TapMacro>
  );
};

export const chaptersFourFiveAt = (t: number): React.ReactNode => {
  // ---- Chapter IV
  if (t < C4.woke) return <BedView t={t} t0={C4.start} open={0.04} seed={520} />;
  if (t < C4.nodrip) {
    const open = track(t, [[C4.woke, 0], [C4.woke + 0.4, 0.5], [C4.woke + 0.7, 0.35], [C4.woke + 1.1, 0.85], [C4.woke + 1.3, 0.2], [C4.woke + 1.6, 1]]);
    return <BedView t={t} t0={C4.woke} open={open} clock={[3, 0]} seed={521} />;
  }
  if (t < C4.sound) return <TapMacro t={t} t0={C4.nodrip} id="tm-dry" mode="night" turn={90} tight={0.6} />;
  if (t < C4.torch) return <OpenDoor t={t} closed />;
  if (t < C4.backdoor) return <StairsUp t={t} t0={C4.torch} />;
  if (t < C4.soil)
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.2} shake={4} seed={522}>
          <Stage>
            <DoorWallL id="bk" t={t} mode="night" />
            <KeyTag x={L_DOOR.cx + 330} y={420} s={1.2} label="Back door" lit={0.6} swing={Math.sin(t * 1.4) * 2} />
          </Stage>
        </Camera>
        <Torch x={1100} y={540} r={520} ambient={0.08} />
      </AbsoluteFill>
    );
  if (t < C4.smell) return <SoilFloor t={t} />;
  if (t < C4.trail) return <SoilFloor t={t} close />;
  if (t < C4.climb) return <StairsUp t={t} t0={C4.trail} />;
  if (t < C4.top) return <StairsUp t={t} t0={C4.climb} climb />;
  if (t < C4.push) return <OpenDoor t={t} />;
  if (t < C4.inside) return <OpenDoor t={t} push />;
  if (t < C4.photo) return <Room1974 t={t} t0={C4.inside} focus="pan" />;
  if (t < C4.dent) return <Wedding t={t} t0={C4.photo} />;
  if (t < C4.letter) return <Room1974 t={t} t0={C4.dent} focus="dent" />;
  if (t < C4.end) return <Envelope t={t} />;
  // ---- Chapter V: the letter
  if (t < C5.winter) return <Letter t={t} t0={C5.start} t1={C5.winter} from={0} to={5} />;
  if (t < C5.buried) return <WinterHome t={t} />;
  if (t < C5.water) return <Burial t={t} />;
  if (t < C5.every) return <Burial t={t} water />;
  if (t < C5.years) return <Years t={t} t0={C5.every} t1={C5.years} />;
  if (t < C5.tired) return <Years t={t} t0={C5.years} t1={C5.tired} montage />;
  if (t < C5.room) return <GranTired t={t} />;
  if (t < C5.look) return <Room1974 t={t} t0={C5.room} focus="empty" />;
  if (t < C5.face) return <StairsUp t={t} t0={C5.look} />;
  if (t < C5.ran) return <Letter t={t} t0={C5.face} t1={C5.ran} from={10} to={13} highlight={11} />;
  // ---- the run to the tap
  if (t < C5.kitchen) {
    const blur = 14 + Math.sin((t - C5.ran) * 6) * 6;
    return (
      <AbsoluteFill style={{filter: `blur(${blur}px)`}}>
        <Camera t={t} zoom={1.3} y={track(t, [[C5.ran, -260], [C5.kitchen, 200]])} rot={Math.sin(t * 5) * 3} shake={9} seed={523}>
          <Stage>
            <Staircase id="run" t={t} light="night" prints={1} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  if (t < C5.turn)
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.15} x={track(t, [[C5.kitchen, 500], [C5.kitchen + 1.2, 0]])} shake={7} seed={524}>
          <Stage>
            <KitchenSinkL id="ktn" t={t} mode="night" turn={90} />
          </Stage>
        </Camera>
        <Torch x={track(t, [[C5.kitchen, 1500], [C5.kitchen + 1.4, 1000]])} y={560} r={520} ambient={0.08} />
      </AbsoluteFill>
    );
  if (t < C5.nothing) return <DryTap t={t} phase="turn" />;
  if (t < C5.door) return <DryTap t={t} phase="nothing" />;
  if (t < C5.steps) return <StairsUp t={t} t0={C5.door} door={prog(t, C5.door + 1.6, C5.door + 3.0, easeOut)} />;
  if (t < C5.stood) return <StairsUp t={t} t0={C5.steps} door={1} legs={prog(t, C5.steps, C5.stood, (x) => x)} />;
  if (t < C5.stopped) return <DryTap t={t} phase="stood" />;
  if (t < C5.cut) return <DryTap t={t} phase="behind" />;
  return <TitleCard t={t} t0={C5.cut + 1.4} title="The Quarter Turn" subtitle="" />;
};

export const chaptersFourFiveGrade = (t: number): 'warm' | 'cold' | 'none' =>
  t >= C5.cut ? 'none' : t >= C5.winter && t < C5.room ? 'warm' : 'cold';
export const _unused45 = [DRIP, STYLES, lerpPose, noise1, easeIn, KitchenSinkL];
