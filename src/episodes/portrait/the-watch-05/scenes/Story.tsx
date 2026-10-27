import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, armPoint, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {MoorStreet, LampPostClose} from '../../../../kit/common/art/Street';
import {Watcher, WatcherProfile} from '../../../../kit/common/art/Watcher';
import {NotebookOpen, Entry} from '../../../../kit/common/art/Notebook';
import {Dog} from '../../../../kit/common/art/Animals';
import {Bandage} from '../../../../kit/common/art/Home';
import {Shotgun, TriggerClose, WomanAiming, WomanProfileAim} from '../../../../kit/common/art/Hunter';
import {WindowWall, SILL_Y} from '../../../../kit/portrait/sets/WindowWall';
import {OutsideSill, MumBehindGlass} from '../../the-watch-03/scenes/Story';
import {easeIn, easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

const ME: HandStyle = {...STYLES.adult, sleeve: '#15171c', cuff: '#22252c'};
const ME_WOLF: HandStyle = {...STYLES.wolf, sleeve: '#15171c', cuff: '#22252c'};
const ME_AT_EIGHT: HandStyle = {...STYLES.child, sleeve: '#2b3448', cuff: '#3a4560'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/** A torch blazing into the lens. */
const Glare: React.FC<{x: number; y: number; r?: number; a?: number; t: number}> = ({x, y, r = 220, a = 1, t}) => {
  const fl = 0.94 + noise1(t * 6, 2) * 0.06;
  return (
    <g opacity={a} style={{mixBlendMode: 'screen'}}>
      <circle cx={x} cy={y} r={r * 2.4 * fl} fill="#fff6e0" opacity={0.08} />
      <circle cx={x} cy={y} r={r * fl} fill="#fff6e0" opacity={0.35} style={{filter: 'blur(30px)'}} />
      <circle cx={x} cy={y} r={r * 0.35} fill="#ffffff" style={{filter: 'blur(8px)'}} />
    </g>
  );
};

/** the road under the lamp: the post, the torch lashed to it, light caught in the mist */
const LampNight: React.FC<{id: string; t: number; children?: React.ReactNode}> = ({id, t, children}) => (
  <g>
    <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
    <rect x={-400} y={1300} width={1880} height={800} fill="#0b0d12" />
    <path d="M-400,1300 L1480,1300" stroke="#9fb4cf" strokeOpacity={0.2} strokeWidth={3} />
    <g style={{filter: 'blur(40px)'}}>
      <ellipse cx={660} cy={640} rx={440} ry={560} fill="#6f7a8a" opacity={0.28} />
      <ellipse cx={420} cy={520} rx={300} ry={380} fill="#ffb45a" opacity={0.12} />
    </g>
    <LampPostClose id={id} x={330} y={1320} s={1.0} t={t} torch={1} glare={0.9} />
    {children}
  </g>
);

/* S01 hook: her finger squeezes; the hammer falls; nothing */
export const Trigger: React.FC<{t: number}> = ({t}) => {
  const squeeze = prog(t, 0.0, 1.0, easeIn);
  const snap = t > 1.0 ? 0.035 * Math.exp(-(t - 1.0) * 8) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.45 + t * 0.03 + snap} shake={4} seed={1201}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={540} cy={900} rx={600} ry={400} fill="#ffb45a" opacity={0.06} />
          <TriggerClose x={560} y={880} s={1.3} squeeze={squeeze} lit={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S02: both barrels; silver */
export const Barrels: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.barrels;
  const glint = prog(t, B.silver, B.silver + 0.3, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.06} shake={4} seed={1202}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <Glare x={-60} y={300} r={200} t={t} a={0.8} />
          <Shotgun x={380} y={880} s={2.6} aim={0.2} glint={glint} lit={1} len={520} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: nothing happened: the tableau holds. Her in profile, the wolf in the beam, flinching */
export const Frozen: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.nothing;
  const flinch = Math.exp(-lt * 4) * Math.sin(lt * 30) * 6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.015} shake={2} seed={1203}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <rect x={-400} y={1300} width={1880} height={800} fill="#0b0d12" />
          <ellipse cx={780} cy={1310} rx={420} ry={70} fill="#fff6e0" opacity={0.12} />
          <ellipse cx={780} cy={1080} rx={360} ry={320} fill="#fff6e0" opacity={0.06} />
          <Dog x={860 + flinch} y={1310} s={0.9} t={t} fear={0.9} wolf flip light={1} warm={0.6} />
          <g style={{filter: 'blur(40px)'}}><ellipse cx={300} cy={820} rx={360} ry={520} fill="#6f7a8a" opacity={0.26} /></g>
          <WomanProfileAim x={330} y={900} s={0.85} t={t} lit={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: "I'm a werewolf. So's her son, Danny.": my clawed hands in the torchlight, Danny in the beam beyond */
export const Hands: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.me;
  const up = prog(t, B.me, B.me + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03} shake={5} seed={1204}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <rect x={-400} y={1150} width={1880} height={900} fill="#0b0d12" />
          <ellipse cx={540} cy={1160} rx={420} ry={60} fill="#fff6e0" opacity={0.1} />
          <g opacity={prog(t, B.me + 0.6, B.me + 1.4)}>
            <Dog x={560} y={1160} s={0.6} t={t} fear={0.8} wolf flip light={1} warm={0.6} />
          </g>
          <Hand id="hd-l" x={240 + tremble(t, 1, 4)} y={mix(2000, 1440, up)} rot={16} scale={1.45} style={ME_WOLF} pose={POSES.claw} mirror light={1} />
          <Hand id="hd-r" x={850 + tremble(t, 2, 4)} y={mix(2000, 1460, up)} rot={-16} scale={1.45} style={ME_WOLF} pose={POSES.claw} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05: since Mick died: Mick under the lamp (memory), then her in his place */
export const Watch: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.mick;
  const her = t >= B.kept;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(her ? 1.2 : 1.15) + lt * 0.04} y={her ? -60 : 20} shake={3} seed={1205}>
        <Stage>
          {her ? (
            <LampNight id="wt" t={t}>
              <WomanAiming x={640} y={780} s={1.0} t={t} lit={0.9} />
              <Glare x={330} y={560} r={180} t={t} a={0.9} />
            </LampNight>
          ) : (
            <MoorStreet id="wm" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0.35} atLamp={<Watcher id="wm-w" t={t} x={-70} s={0.37} torch={1} beamTo={[-700, -160]} rimA={0.9} />} />
          )}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: Danny bolts out of the beam onto the moor; she lowers the gun and doesn't follow */
export const Bolt: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.ran;
  const run = prog(t, B.ran + 0.1, B.didnt, easeIn);
  const lower = prog(t, B.didnt, B.didnt + 1.0, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.02} shake={4} seed={1206}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <rect x={-400} y={1300} width={1880} height={800} fill="#0b0d12" />
          <ellipse cx={780} cy={1310} rx={420} ry={70} fill="#fff6e0" opacity={0.12 * (1 - run * 0.5)} />
          <Dog x={mix(860, 1700, run)} y={1310} s={mix(1.0, 0.7, run)} t={t} run={run > 0.02 ? 1 : 0} wolf light={1 - run * 0.6} warm={0.6} />
          <g style={{filter: 'blur(40px)'}}><ellipse cx={300} cy={820} rx={360} ry={520} fill="#6f7a8a" opacity={0.26} /></g>
          <WomanProfileAim x={330} y={900} s={0.85} t={t} lit={1} lowered={lower} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07: she breaks the gun open */
export const BreakOpen: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.broke;
  const open = prog(t, B.broke + 0.2, B.broke + 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.04} x={40} y={-40} shake={3} seed={1207}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={400} cy={760} rx={700} ry={500} fill="#ffb45a" opacity={0.06} />
          <g style={{filter: 'blur(40px)'}}><ellipse cx={360} cy={820} rx={360} ry={520} fill="#6f7a8a" opacity={0.26} /></g>
          <WomanProfileAim x={400} y={760} s={1.0} t={t} lit={1} lowered={0.35} open={open} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08: close on the breech: two empty chambers */
export const Empty: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.empty;
  const jolt = 0.04 * Math.exp(-lt * 6);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.05 + jolt} shake={3} seed={1208}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={540} cy={800} rx={520} ry={460} fill="#fff6e0" opacity={0.07} />
          {/* the breech face, end-on: steel, two chambers, nothing in them */}
          <rect x={250} y={520} width={580} height={560} rx={70} fill="#2a2e36" />
          <rect x={250} y={520} width={580} height={560} rx={70} fill="none" stroke="#c8d3e3" strokeOpacity={0.4} strokeWidth={5} />
          {[400, 680].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy={800} r={112} fill="#14161a" />
              <circle cx={cx} cy={800} r={112} fill="none" stroke="#e8eef6" strokeOpacity={0.55} strokeWidth={6} />
              <circle cx={cx} cy={800} r={86} fill="#000" />
            </g>
          ))}
          <path d="M540,560 L540,1040" stroke="#14161a" strokeWidth={14} />
          {/* her fingers on the action */}
          <Hand id="em-h" x={540} y={1300} rot={0} scale={1.1} style={{...STYLES.gran, wrinkles: false, skin: '#c8a890', sleeve: '#0a0b0e', cuff: '#14161a'}} pose={POSES.relaxed} light={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: she'd never loaded it: her profile, gun hanging open, head bowed */
export const Bowed: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.never;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.03} x={60} y={-40} shake={3} seed={1209}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={300} cy={500} rx={700} ry={500} fill="#ffb45a" opacity={0.06} />
          <g style={{filter: 'blur(40px)'}}><ellipse cx={400} cy={820} rx={360} ry={520} fill="#6f7a8a" opacity={0.26} /></g>
          <WomanProfileAim x={440} y={800} s={1.15} t={t} lit={1} lowered={1} open={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* the page, written one-handed in August 2006 */
const PAGE: Entry[] = [
  {text: '14 Aug 2006', shaky: true},
  {text: 'D. bit the boy.', shaky: true},
  {text: 'Got him off.', shaky: true},
  {text: 'Cost me the arm.', shaky: true},
];

/* S10-11: the page from Mick's notebook, in my clawed hands under the torch; lines appear as they're read */
export const Page: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.page;
  const n = t < B.august ? 0 : t < B.bit ? 1 : t < B.got ? 2 : t < B.cost ? 3 : 4;
  const t0 = [B.page, B.august, B.bit, B.got, B.cost][n];
  const reveal = n === 0 ? 1 : prog(t, t0, t0 + 0.9);
  const close = prog(t, B.page, B.august, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 1.75, close) + lt * 0.02} x={mix(0, 250, close)} y={mix(60, -60, close)} rot={-3} shake={4} seed={1210}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#06070a" />
          <ellipse cx={680} cy={700} rx={520} ry={560} fill="#fff6e0" opacity={0.08} />
          <NotebookOpen id="pg" x={540} y={560} s={0.95} rot={-3} t={t} right={PAGE.slice(0, Math.max(1, n))} heading={['', '2006']} lit={1} highlight={Math.max(0, n - 1)} reveal={reveal} size={40} />
          <Hand id="pg-l" x={170} y={1290} rot={20} scale={1.25} style={ME_WOLF} pose={POSES.relaxed} mirror light={0.8} />
          <Hand id="pg-r" x={910} y={1290} rot={-20} scale={1.25} style={ME_WOLF} pose={POSES.relaxed} light={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12 memory, 2006: my hand at eight, a bandage round the wrist, on the windowsill in candlelight */
export const Eight: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.boy;
  const x = 540, y = SILL_Y - 40, rot = -6, sc = 1.35;
  const [bx, by] = armPoint(x, y, rot, sc, 60);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.04} y={160} shake={3} seed={1212}>
        <Stage>
          <WindowWall id="eg" t={t} mode="candle" warm={1} cloudCover={0.5} beam={0}>
            <Hand id="eg-h" x={x} y={y} rot={rot} scale={sc} style={ME_AT_EIGHT} pose={POSES.flat} light={1} />
            <Bandage x={bx} y={by} rot={rot} s={sc * 0.85} stain={0.8} />
          </WindowWall>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: Mick in profile under the lamp, the empty sleeve pinned at his shoulder (memory) */
export const MickProfile: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.arm;
  const jolt = t > B.pulling ? 0.03 * Math.exp(-(t - B.pulling) * 5) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(9px)'}}>
        <Camera t={t} zoom={1.4} shake={2} seed={1213}>
          <Stage>
            <MoorStreet id="mp" t={t} light="dusk" y={-60} x={-80} moon={[300, 520]} moonR={60} lamp={0.5} windowsLit={0.4} />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={1 + lt * 0.03 + jolt} y={-lt * 8} shake={3} seed={1214}>
        <Stage>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.25} />
          <WatcherProfile id="mp-mick" x={600} y={760} s={1.55} t={t} rim="#ffa850" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: dawn at my window: my hands turning back */
export const Dawn: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.dawn;
  const back = prog(t, B.dawn + 0.2, B.home - 0.3, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.03} y={120} shake={3} seed={1215}>
        <Stage>
          <WindowWall id="dw" t={t} mode="dawn" dawn={0.4 + lt * 0.12} cloudCover={0.3} beam={1}>
            <Hand id="dw-l" x={380} y={SILL_Y + 100} rot={14} scale={1.3} style={lerpStyle(ME_WOLF, ME, back)} pose={lerpPose(POSES.claw, POSES.relaxed, back)} mirror light={1} />
            <Hand id="dw-r" x={700} y={SILL_Y + 110} rot={-14} scale={1.3} style={lerpStyle(ME_WOLF, ME, back)} pose={lerpPose(POSES.claw, POSES.relaxed, back)} light={1} />
          </WindowWall>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S15: Danny never came home: his mum at the window of number six, waiting */
export const NeverHome: React.FC<{t: number}> = ({t}) => (
  <OutsideSill t={t} t0={B.home} n="6" paint="#5a1c1c" zoom={1.25} y={160} backlight="#ffb45a" inside={<MumBehindGlass a={1} />} />
);

/** two eyes catching the light far off: a pair of glints that blink */
const Eyes: React.FC<{x: number; y: number; s?: number; a: number; t: number; seed: number}> = ({x, y, s = 1, a, t, seed}) => {
  const blink = Math.sin(t * 0.9 + seed) > 0.97 ? 0.1 : 1;
  return (
    <g opacity={a * blink}>
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={x + k * 14 * s} cy={y} rx={9 * s} ry={5 * s} fill="#ffe08a" style={{filter: 'blur(1px)'}} />
          <ellipse cx={x + k * 14 * s} cy={y} rx={22 * s} ry={14 * s} fill="#ffe08a" opacity={0.25} style={{filter: 'blur(6px)'}} />
        </g>
      ))}
    </g>
  );
};

/* S16: from my window at dawn: the edge of the moor; two eyes; and beside them, a smaller pair. Push in; hard cut */
export const MoorEdge: React.FC<{t: number}> = ({t}) => {
  const push = prog(t, B.window, B.cut, (x) => x);
  const big = prog(t, B.eyes - 0.1, B.eyes + 0.4, easeOut);
  const small = prog(t, B.smaller - 0.1, B.smaller + 0.4, easeOut);
  const outside = (
    <g>
      <rect x={-400} y={200} width={1880} height={700} fill="#1a2232" />
      <path d="M-400,780 C0,760 300,800 1480,770 L1480,1200 L-400,1200 Z" fill="#0a0d12" />
      <path d="M-400,780 C0,760 300,800 1480,770" stroke="#d58a55" strokeOpacity={0.35} strokeWidth={3} fill="none" />
      <Eyes x={600} y={820} s={1.5} a={big} t={t} seed={1} />
      <Eyes x={690} y={838} s={0.9} a={small} t={t} seed={4} />
    </g>
  );
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + push * 1.6} x={mix(0, 100, push)} y={mix(-60, -130, push)} shake={4} seed={1216}>
        <Stage>
          <WindowWall id="me" t={t} mode="dawn" dawn={0.35} cloudCover={0.4} beam={0.6} outside={outside} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

