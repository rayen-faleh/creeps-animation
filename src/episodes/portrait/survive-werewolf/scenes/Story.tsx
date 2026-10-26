import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Eyelids, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, armPoint, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {MoorStreet} from '../../../../kit/common/art/Street';
import {Candle} from '../../../../kit/common/art/Props';
import {Floor, Wall} from '../../../../kit/common/art/Room';
import {KitchenTable} from '../../../../kit/common/art/Interior';
import {MudMarks} from '../../../../kit/common/art/Charms';
import {Phone} from '../../../../kit/common/art/Modern';
import {Bandage, Confetti, FitnessWatch, RouteMap, RunnerIcon, WatchText} from '../../../../kit/common/art/Home';
import {Dog} from '../../../../kit/common/art/Animals';
import {WindowWall} from '../../../../kit/portrait/sets/WindowWall';
import {Doorstep} from '../../../../kit/portrait/sets/Doorstep';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** You, sleeve rolled up: bare forearm for the bandage and the watch. */
const ME: HandStyle = {...STYLES.adult, sleeve: '#1d2430', cuff: '#26303e', forearm: 240};
const WOLF: HandStyle = {...STYLES.wolf, sleeve: '#1d2430', cuff: '#26303e', forearm: 240};
/** how far gone you are, 0 = human, 1 = wolf */
export const you = (k: number, mud = 0): HandStyle => ({...lerpStyle(ME, WOLF, k), mud});
const PHONE_SKIN = {skin: '#a28c7e', shade: '#3e2f28', nail: '#0c0b0a', sleeve: '#1d2430'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/** The wrist kit: bandage over the bite near the hand, the fitness watch further up the forearm. */
const Wrist: React.FC<{id: string; t: number; x: number; y: number; rot: number; scale: number; screen?: React.ReactNode; on?: number; buzz?: number[]; bandage?: boolean}> = ({
  id,
  t,
  x,
  y,
  rot,
  scale,
  screen,
  on = 1,
  buzz,
  bandage = true,
}) => {
  const [bx, by] = armPoint(x, y, rot, scale, 92);
  const [wx, wy] = armPoint(x, y, rot, scale, 210);
  return (
    <g>
      {bandage && <Bandage x={bx} y={by} rot={rot} s={scale * 0.82} stain={0.7} />}
      <FitnessWatch id={id} x={wx} y={wy} rot={rot - 90} s={scale * 0.62} t={t} on={on} buzz={buzz} screen={screen} />
    </g>
  );
};

/* watch screens */
const ClockScreen: React.FC<{time: string}> = ({time}) => (
  <g>
    <WatchText y0={4} lines={[{text: time, size: 40, bold: true}]} />
    <WatchText y0={36} lines={[{text: '♥ 128', size: 18, color: '#ff6b6b'}]} />
  </g>
);
const StartScreen: React.FC = () => (
  <g>
    <RunnerIcon x={0} y={-24} s={1.4} />
    <WatchText y0={18} lines={[{text: 'Workout', size: 20, bold: true}, {text: 'started', size: 20, bold: true}]} />
  </g>
);
const NightScreen: React.FC = () => (
  <g>
    <RunnerIcon x={0} y={-30} s={1.2} />
    <WatchText y0={6} lines={[{text: 'Night Run', size: 22, bold: true}, {text: '02:14 – 06:26', size: 15, color: '#b8bcc6'}]} />
  </g>
);
const StatsScreen: React.FC<{p: number; pb: number}> = ({p, pb}) => (
  <g>
    <WatchText y0={-20} lines={[{text: `${(31.4 * p).toFixed(1)} mi`, size: 32, bold: true, color: '#b6f25a'}, {text: '4:12:08', size: 18}]} />
    <g opacity={pb} transform={`translate(0,${44}) scale(${0.8 + 0.2 * pb})`}>
      <rect x={-50} y={-16} width={100} height={26} rx={13} fill="#b6f25a" />
      <text x={0} y={3} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={16} fontWeight={700} fill="#0d1018">
        NEW PB!
      </text>
    </g>
    <Confetti p={pb > 0 ? Math.min(1, pb) : 0} />
  </g>
);
const MoonScreen: React.FC<{p: number}> = ({p}) => (
  <g opacity={p} transform={`translate(0,${(1 - p) * 20})`}>
    <circle cx={0} cy={-34} r={18} fill="#e8eef6" />
    <circle cx={-5} cy={-38} r={4} fill="#c8d0dc" />
    <circle cx={6} cy={-28} r={3} fill="#c8d0dc" />
    <WatchText y0={4} lines={[{text: 'Full moon', size: 18, bold: true}, {text: 'tonight', size: 18, bold: true}]} />
    <WatchText y0={50} lines={[{text: 'Ready for another run?', size: 11, color: '#b6f25a'}]} />
  </g>
);

/* S01-02 hook: your hand on the kitchen table: bandaged bite, a fitness watch; at "one week" it curls into a claw */
export const TableHook: React.FC<{t: number}> = ({t}) => {
  const curl = prog(t, B.week + 0.2, B.day1 - 0.2, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + t * 0.04} y={220} shake={5} seed={801}>
        <Stage>
          <Wall id="th" x={-400} y={-600} w={1880} h={2000} lit={0.35} />
          <rect x={-400} y={-600} width={1880} height={2600} fill="#000" opacity={0.45} />
          <KitchenTable y={900}>
            <Candle x={860} y={1000} t={t} s={0.6} glow={0.8} />
            <Hand id="th-h" x={520 + tremble(t, 1, curl * 4)} y={1080} rot={-8} scale={1.35} style={you(0.25 + curl * 0.45)} pose={lerpPose(POSES.flat, POSES.claw, curl)} light={0.8} />
            <Wrist id="th-w" t={t} x={520} y={1080} rot={-8} scale={1.35} screen={<ClockScreen time="23:58" />} on={0.4 + curl * 0.6} />
          </KitchenTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03 Day one: the dog backed into the corner, hackles up; your hand reaches; it bolts */
export const DogCorner: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day1;
  const reach = prog(t, B.dog, B.bolt - 0.1, easeInOut);
  const bolt = prog(t, B.bolt, B.bolt + 0.55, easeIn);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={200} shake={5} seed={802}>
        <Stage>
          <Wall id="dc" x={-400} y={-600} w={1880} h={2000} lit={0.45} />
          <Floor id="dc-f" x={-400} y={1380} w={1880} h={900} lit={0.6} />
          <rect x={-400} y={1340} width={1880} height={50} fill="#050608" />
          <ellipse cx={380} cy={1120} rx={560} ry={420} fill="#6f86a6" opacity={0.14} />
          <Dog x={bolt > 0 ? mix(380, -900, bolt) : 380} y={1400} s={1.25} t={t} fear={Math.min(1, 0.6 + lt * 0.3)} flip={bolt > 0} run={bolt > 0 ? 1 : 0} light={0.9} />
          <Hand id="dc-h" x={mix(1060, 860, reach)} y={mix(1700, 1250, reach)} rot={mix(-40, -62, reach)} scale={1.3} style={you(0.3)} pose={lerpPose(POSES.relaxed, POSES.reach, reach)} light={0.8} />
          <Wrist id="dc-w" t={t} x={mix(1060, 860, reach)} y={mix(1700, 1250, reach)} rot={mix(-40, -62, reach)} scale={1.3} screen={<ClockScreen time="18:40" />} on={0.6} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04 Day two: cloud slides off the full moon */
export const MoonRise: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day2;
  const clear = prog(t, B.day2, B.moon + 0.4, easeInOut);
  return (
    <Camera t={t} zoom={1.1 + lt * 0.04} y={-140} shake={4} seed={803}>
      <Stage>
        <WindowWall id="mr" t={t} mode="night" cloudCover={mix(0.95, 0.15, clear)} wind={1.6} beam={0.4 + clear * 0.8} />
      </Stage>
    </Camera>
  );
};

/** iron box lock on an oak door, key in it, turning by `turn` 0..1 (90 degrees) */
const LockClose: React.FC<{turn: number}> = ({turn}) => (
  <g>
    <rect x={-400} y={-600} width={1880} height={2700} fill="#140c06" />
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-400 + i * 240} y={-600} width={232} height={2700} fill={i % 2 ? '#1c120a' : '#1a1009'} />
    ))}
    <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.35} />
    {/* the lock box */}
    <rect x={300} y={700} width={480} height={360} rx={18} fill="#1a1b1f" stroke="#000" strokeWidth={8} />
    <path d="M300,718 L780,718" stroke="#9fb4cf" strokeOpacity={0.35} strokeWidth={3} />
    {[340, 740].map((cx) => [740, 1020].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={14} fill="#2a2c32" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={2} />))}
    <path d="M540,830 m-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0 M528,846 L520,910 L560,910 L552,846" fill="#000" />
    {/* the key: bow sticking out, turning */}
    <g transform={`translate(540,860) rotate(${turn * 90})`}>
      <rect x={-8} y={-60} width={16} height={60} fill="#3a3a3e" />
      <ellipse cx={0} cy={-110} rx={46} ry={56} fill="#3a3a3e" stroke="#9fb4cf" strokeOpacity={0.4} strokeWidth={3} />
      <ellipse cx={0} cy={-110} rx={20} ry={26} fill="#140c06" />
    </g>
  </g>
);

/* S05: the key turns in the bedroom door */
export const Lock: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.lock;
  const turn = prog(t, B.lock + 0.2, B.key - 0.15, easeInOut);
  const [kx, ky] = [540 + Math.sin((turn * Math.PI) / 2) * 110, 750 + (1 - Math.cos((turn * Math.PI) / 2)) * 110];
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.05} y={-60} shake={4} seed={804}>
        <Stage>
          <LockClose turn={turn} />
          <Hand id="lk-h" x={kx + 40} y={ky + 220} rot={-10 + turn * 70} scale={1.35} style={you(0.4)} pose={POSES.fist} light={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: the key flicked out of the open casement into the night; the watch lights "Workout started". Easy. */
export const KeyOut: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.key;
  const flick = prog(t, B.key + 0.1, B.key + 0.4, easeOut);
  const fly = prog(t, B.key + 0.3, B.key + 1.3, (x) => x);
  const settle = prog(t, B.easy - 0.5, B.easy + 0.2, easeInOut);
  const hx = mix(mix(300, 420, flick), 560, settle);
  const hy = mix(mix(1300, 1100, flick), 1240, settle);
  const rot = mix(mix(40, 70, flick), 84, settle);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + lt * 0.03} y={-40} shake={5} seed={805}>
        <Stage>
          <WindowWall id="ko" t={t} mode="night" open={0.85} cloudCover={0.15} wind={1.6} beam={1.1}>
            {/* the key arcing out into the dark, shrinking */}
            {fly > 0 && fly < 1 && (
              <g transform={`translate(${mix(460, 620, fly)},${mix(1040, 520, fly) + fly * fly * 320}) rotate(${fly * 900}) scale(${mix(1, 0.15, fly)})`}>
                <ellipse cx={0} cy={-40} rx={22} ry={26} fill="none" stroke="#c8d3e3" strokeWidth={8} />
                <rect x={-5} y={-16} width={10} height={70} fill="#c8d3e3" />
              </g>
            )}
            <Hand id="ko-h" x={hx} y={hy} rot={rot} scale={1.3} style={you(0.5)} pose={flick < 1 ? lerpPose(POSES.fist, POSES.flat, flick) : lerpPose(POSES.flat, POSES.relaxed, settle)} light={0.9} />
            <Wrist id="ko-w" t={t} x={hx} y={hy} rot={rot} scale={1.3} screen={t > B.easy - 0.6 ? <StartScreen /> : <ClockScreen time="23:59" />} on={0.5 + settle * 0.5} buzz={[B.easy - 0.55]} />
          </WindowWall>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* claw scratches gouged into the stone beside your front door */
const Scratches: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${x + i * 26},${y} C${x + i * 26 + 18},${y + 120} ${x + i * 26 + 8},${y + 240} ${x + i * 26 + 30},${y + 330}`} stroke="#000" strokeWidth={10} fill="none" strokeLinecap="round" />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${x + i * 26 + 5},${y + 6} C${x + i * 26 + 23},${y + 126} ${x + i * 26 + 13},${y + 246} ${x + i * 26 + 35},${y + 330}`} stroke="#c8d3e3" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

/* S07 Day three: eyes open on stone at grey dawn: your own doorstep, door hanging open, claw marks, mud */
export const Wake: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day3;
  const open = track(t, [
    [B.wake - 0.1, 0],
    [B.wake + 0.35, 0.55],
    [B.wake + 0.6, 0.45],
    [B.wake + 1.0, 0.8],
    [B.wake + 1.15, 0.15],
    [B.wake + 1.5, 0.95],
  ]);
  const sit = prog(t, B.mud - 0.3, B.mud + 0.7, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.4, 1.1, sit) + lt * 0.01} rot={mix(-74, -4, sit)} x={mix(-60, 0, sit)} y={mix(380, 120, sit)} shake={4} seed={806}>
        <Stage>
          <Doorstep id="wk" t={t} open={0.4} number="2">
            <Scratches x={860} y={700} />
            <MudMarks x={520} y={1560} s={1.2} lit={0.6} />
            <Hand id="wk-h" x={mix(620, 560, sit)} y={mix(1560, 1500, sit)} rot={mix(-80, -20, sit)} scale={1.3} style={you(0.6, 1)} pose={lerpPose(POSES.claw, POSES.relaxed, sit)} light={0.6} />
            <Wrist id="wk-w" t={t} x={mix(620, 560, sit)} y={mix(1560, 1500, sit)} rot={mix(-80, -20, sit)} scale={1.3} on={0.3} screen={<ClockScreen time="06:31" />} />
          </Doorstep>
        </Stage>
      </Camera>
      {/* grey dawn wash */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(150,165,185,0.22), rgba(60,70,90,0.08))', mixBlendMode: 'screen'}} />
      <Eyelids open={t < B.wake - 0.1 ? 0 : open} />
    </AbsoluteFill>
  );
};

/* S08-09: you lift your wrist: Night Run. Thirty-one miles. Personal best. */
export const WatchReveal: React.FC<{t: number; stats?: boolean}> = ({t, stats}) => {
  const t0 = stats ? B.miles : B.watch;
  const lt = t - t0;
  const lift = stats ? 1 : prog(t, B.watch, B.watch + 0.6, easeOut);
  const x = mix(-100, 120, lift), y = mix(1500, 1020, lift);
  const count = prog(t, B.miles, B.miles + 1.0, easeOut);
  const pb = prog(t, B.best, B.best + 0.35, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(stats ? 1.5 : 1.15) + lt * 0.04 + (pb > 0 ? 0.04 * Math.exp(-(t - B.best) * 7) : 0)} x={stats ? -40 : 0} y={stats ? 80 : 40} shake={4} seed={807}>
        <Stage>
          <g style={{filter: 'blur(6px)'}}>
            <Doorstep id="wr" t={t} open={0.4} />
          </g>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#8a96aa" opacity={0.08} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.3} />
          <Hand id="wr-h" x={x + 560} y={y} rot={92} scale={2.0} style={you(0.55, 1)} pose={POSES.relaxed} light={0.8} />
          <Wrist id="wr-w" t={t} x={x + 560} y={y} rot={92} scale={2.0} bandage={false} screen={stats ? <StatsScreen p={count} pb={pb} /> : <NightScreen />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: the route on the phone: over the moor, a forty-minute stop at a sheep farm */
export const Route: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.farm;
  const raise = prog(t, B.farm, B.farm + 0.35, easeOut);
  const draw = prog(t, B.farm + 0.2, B.farm + 1.7, easeInOut);
  const stop = prog(t, B.farm + 1.5, B.farm + 1.9, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-80} shake={4} seed={808}>
        <Stage>
          <g style={{filter: 'blur(6px)'}}>
            <Doorstep id="rt" t={t} open={0.4} />
          </g>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.5} />
          <Phone
            id="rt-ph"
            t={t}
            x={300}
            y={mix(1300, 300, raise)}
            s={1.15}
            from=""
            clock=""
            msgs={[]}
            {...PHONE_SKIN}
            screen={<RouteMap draw={draw} t={t} title="Night Run" stats="31.4 mi · 4:12:08" farm="Miller's Farm" stop="Stopped 40:12" stopShow={stop} />}
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: dusk, the moon coming up over the street; the watch buzzes: full moon tonight. The hand starts to curl. */
export const Buzz: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.buzz;
  const lift = prog(t, B.buzz, B.buzz + 0.5, easeOut);
  const note = prog(t, B.buzz + 0.15, B.buzz + 0.5, easeOut);
  const turn = prog(t, B.tonight + 0.2, B.cut, easeIn);
  const x = mix(-60, 120, lift), y = mix(1500, 1180, lift);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.05} y={0} shake={4 + turn * 4} seed={809}>
        <Stage>
          <MoorStreet id="bz" t={t} light="dusk" moon={[760, mix(760, 600, prog(t, B.buzz, B.cut))]} moonR={64} windowsLit={0.5} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.2} />
          <Hand id="bz-h" x={x + 560 + tremble(t, 3, turn * 6)} y={y} rot={92} scale={1.9} style={you(0.4 + turn * 0.6)} pose={lerpPose(POSES.relaxed, POSES.claw, turn)} light={0.9} />
          <Wrist id="bz-w" t={t} x={x + 560} y={y} rot={92} scale={1.9} bandage={false} buzz={[B.buzz + 0.1, B.buzz + 0.7]} screen={<MoonScreen p={note} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
