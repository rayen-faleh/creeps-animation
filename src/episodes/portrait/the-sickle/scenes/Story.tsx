import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {Candle, Duvet, ElderProfile} from '../../../../kit/common/art/Props';
import {Wall} from '../../../../kit/common/art/Room';
import {Staircase} from '../../../../kit/common/art/Interior';
import {BareFoot, Coffin, OldKey, Padlock, Sickle, Sleeper, SoilPrints, TeaTowel} from '../../../../kit/common/art/Burial';
import {WindowWall} from '../../../../kit/portrait/sets/WindowWall';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

const GRAN: HandStyle = {...STYLES.gran, sleeve: '#e8e0d0', cuff: '#d8d0c0'};
const GRAN_DEAD: HandStyle = {...lerpStyle(STYLES.gran, STYLES.vamp, 0.55), sleeve: '#2e2a24', cuff: '#3a342c', nailLen: 10};
const ME_CHILD: HandStyle = {...STYLES.child, sleeve: '#2b3448', cuff: '#3a4560'};
const ME: HandStyle = {...STYLES.adult, sleeve: '#2a2e36', cuff: '#343a44'};
const GLOVE: HandStyle = {...STYLES.adult, skin: '#121216', shade: '#000', rim: '#8a8a94', nail: '#121216', sleeve: '#0a0a0c', cuff: '#16161a'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/** Gran's candlelit bedroom: warm wall, a bedside table with a candle, the sleeper with the sickle at her throat. */
const GranBed: React.FC<{t: number; id: string; sx?: number; sy?: number; handK?: number; children?: React.ReactNode}> = ({t, id, sx = 420, sy = 1000, handK = 0, children}) => (
  <g>
    <Wall id={`${id}-wall`} x={-600} y={-600} w={3200} h={2400} warm={1} lit={0.6} />
    <rect x={-600} y={-600} width={3200} height={2700} fill="#000" opacity={0.35} />
    <ellipse cx={200} cy={760} rx={700} ry={620} fill="#ffb45a" opacity={0.12} />
    {/* bedside table and candle by her head */}
    <rect x={40} y={940} width={180} height={300} fill="#1a0e06" />
    <rect x={20} y={920} width={220} height={24} fill="#2a1a0c" />
    <Candle x={130} y={920} t={t} s={0.8} />
    <Sleeper x={sx} y={sy} s={1} t={t} foot={<Padlock x={60} y={-58} s={0.55} rot={-10} lit={0.9} />}>
      <OldKey x={1330} y={-130} s={0.8} rot={95} />
      {/* the sickle laid across her throat, handle on the pillow */}
      <Sickle x={60} y={-36} s={0.62} rot={4} glint={Math.max(0, Math.sin(t * 1.3)) ** 12} />
      {handK > 0 && <Hand id={`${id}-gh`} x={mix(420, 250, handK)} y={mix(-260, -110, handK)} rot={-120} scale={0.75} style={GRAN} pose={lerpPose(POSES.relaxed, POSES.flat, handK)} light={1} />}
    </Sleeper>
    {children}
  </g>
);

/* S01 hook: candlelight on an old woman asleep, a sickle across her throat. Slow push */
export const Hook: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={track(t, [[0, 1.4], [B.sickle, 1.72]], (x) => x)} x={track(t, [[0, 140], [B.sickle, 90]])} y={track(t, [[0, 10], [B.sickle, 0]])} shake={3} seed={1601}>
      <Stage overflow>
        <GranBed id="hk" t={t} />
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* S02-03: close on the throat, her hand settles the blade; then one continuous pan down the bed to the padlock on her toe */
export const AlongTheBed: React.FC<{t: number}> = ({t}) => {
  const pan = prog(t, B.padlock - 0.2, B.toe + 0.6, easeInOut);
  const zoom = mix(1.8, 1.9, pan) + (t - B.sickle) * 0.01;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={zoom} x={mix(70, 1180, pan)} y={mix(-60, -30, pan)} shake={3} seed={1602}>
        <Stage overflow>
          <GranBed id="ab" t={t} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: Gran in profile, a finger to her lips: "so I stay where I'm put" */
export const GranSays: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.why;
  const finger = prog(t, B.put - 0.3, B.put + 0.3, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lt * 0.025} shake={3} seed={1603}>
        <Stage>
          <Wall id="gs" x={-400} y={-600} w={1880} h={2700} warm={1} lit={0.5} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.4} />
          <Candle x={180} y={1250} t={t} s={0.8} />
          <ElderProfile x={640} y={780} s={1.45} t={t} finger={finger} lean={0.2} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05: the promise: my small hand in hers; the sickle's shadow huge on the wall behind */
export const Promise: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.promise;
  const k = prog(t, B.promise + 0.1, B.promise + 1.0, easeInOut);
  const fl = 0.9 + noise1(t * 7, 4) * 0.1;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.03} shake={3} seed={1604}>
        <Stage>
          <Wall id="pm" x={-400} y={-600} w={1880} h={2700} warm={1} lit={0.55} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.3} />
          <ellipse cx={540} cy={1500} rx={500} ry={300} fill="#ffb45a" opacity={0.15 * fl} />
          {/* the sickle's shadow thrown up the wall by the candle */}
          <g opacity={0.55} transform={`translate(${noise1(t * 4, 2) * 6},0)`}>
            <Sickle x={120} y={1060} s={2.0} rot={-34} lit={0} />
          </g>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.15} />
          <Hand id="pm-g" x={mix(760, 640, k)} y={mix(700, 880, k)} rot={200} scale={1.3} style={GRAN} pose={lerpPose(POSES.relaxed, POSES.fist, k * 0.6)} light={1} />
          <Hand id="pm-c" x={mix(380, 470, k)} y={mix(1500, 1160, k)} rot={20} scale={1.05} style={ME_CHILD} pose={lerpPose(POSES.relaxed, POSES.fist, k * 0.5)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: thirty now; we buried her last week: the coffin lid closes in a cold chapel */
export const Burial: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.thirty;
  const lid = prog(t, B.buried - 0.4, B.undertaker - 0.1, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={40} shake={3} seed={1605}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#07090d" />
          <ellipse cx={540} cy={900} rx={600} ry={700} fill="#6f86a6" opacity={0.1} />
          <Candle x={170} y={760} t={t} s={0.7} glow={0.6} />
          <Candle x={910} y={760} t={t + 0.5} s={0.7} glow={0.6} />
          <Coffin x={540} y={1000} s={0.95} lid={lid} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** a bundle: the sickle and padlock rolled in a tea towel */
const Bundle: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <TeaTowel x={0} y={0} s={0.6} />
    <path d="M110,-40 C150,-80 190,-60 200,-20" stroke="#3a3c42" strokeWidth={10} fill="none" />
    <path d="M110,-40 C150,-80 190,-60 200,-20" stroke="#c8d3e3" strokeOpacity={0.5} strokeWidth={2} fill="none" />
  </g>
);

/* S07: the undertaker's gloved hand gives the bundle back to me */
export const HandBack: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.undertaker;
  const give = prog(t, B.undertaker + 0.2, B.undertaker + 1.4, easeInOut);
  const shrug = prog(t, B.real, B.real + 0.8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} shake={3} seed={1606}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0c10" />
          <ellipse cx={540} cy={900} rx={600} ry={500} fill="#6f86a6" opacity={0.08} />
          <Hand id="hb-me" x={400} y={mix(1900, 1390, give) + shrug * 40} rot={6} scale={1.3} style={ME} pose={lerpPose(POSES.relaxed, POSES.fist, give * 0.45)} light={0.8} />
          <Bundle x={400} y={mix(560, 1080, give) + shrug * 40} s={1.2} rot={mix(-8, 3, give)} />
          <Hand id="hb-gl" x={mix(420, 384, give) + shrug * 160} y={mix(320, 840, give) - shrug * 900} rot={180} scale={1.25} style={GLOVE} pose={lerpPose(POSES.fist, POSES.relaxed, shrug)} light={0.6} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** the open kitchen drawer from above: cutlery tray edge, the towel, the sickle, and the padlock (or its dent) */
const DrawerTop: React.FC<{t: number; padlock: boolean; bg?: boolean}> = ({t, padlock, bg = true}) => (
  <g>
    {bg && <rect x={-400} y={-600} width={1880} height={2700} fill="#1a120c" />}
    <rect x={120} y={300} width={840} height={1300} rx={10} fill="#3a2a1a" />
    <rect x={150} y={330} width={780} height={1240} fill="#14100c" />
    <rect x={160} y={340} width={160} height={1220} fill="#2a1e14" />
    {[420, 700, 980, 1260].map((ry) => <rect key={ry} x={170} y={ry} width={140} height={14} fill="#c8c8cc" opacity={0.5} />)}
    <TeaTowel x={620} y={950} s={1.05} rot={90} />
    <Sickle x={540} y={1300} s={1.3} rot={-80} glint={Math.max(0, Math.sin(t * 1.7)) ** 14} />
    {padlock ? <Padlock x={720} y={760} s={1.6} rot={18} /> : <g opacity={0.75}>
        <path d="M680,690 C680,610 780,610 780,690" stroke="#000" strokeWidth={22} fill="none" opacity={0.55} />
        <path d="M650,690 L810,690 L814,840 C780,862 680,862 646,840 Z" fill="#000" opacity={0.55} />
        <path d="M650,690 L810,690 L814,840 C780,862 680,862 646,840 Z" stroke="#c8d3e3" strokeOpacity={0.35} strokeWidth={4} fill="none" />
      </g>}
  </g>
);

/* S08: the drawer slides shut on them */
export const DrawerShut: React.FC<{t: number}> = ({t}) => {
  const close = prog(t, B.drawer + 0.5, B.drawer + 1.5, easeInOut);
  const dy = -close * 1380;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05} shake={3} seed={1607}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#1a1e26" />
          <g transform={`translate(0,${dy})`}>
            <DrawerTop t={t} padlock bg={false} />
            {/* the drawer front and its handle */}
            <rect x={90} y={1600} width={900} height={170} rx={8} fill="#2a2018" stroke="#3a2c1e" strokeWidth={6} />
            <rect x={470} y={1670} width={140} height={20} rx={10} fill="#8a8e96" />
          </g>
          <Hand id="ds-h" x={560} y={1770 + dy + 330} rot={0} scale={1.2} style={ME} pose={POSES.flat} light={0.7} />
          {/* the worktop the drawer slides under */}
          <rect x={-400} y={-600} width={1880} height={820} fill="#2a2e34" />
          <path d="M-400,220 L1480,220" stroke="#c8d3e3" strokeOpacity={0.35} strokeWidth={4} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: last night: the kitchen by moonlight, one drawer standing open */
export const KitchenNight: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.lastnight;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.08} y={mix(0, 180, prog(t, B.open, B.gone))} shake={4} seed={1608}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          {/* window with the moon over the sink */}
          <rect x={300} y={240} width={480} height={520} fill="#0c1424" />
          <circle cx={650} cy={380} r={50} fill="#d9e2ec" />
          <path d="M540,240 L540,760 M300,500 L780,500" stroke="#05070b" strokeWidth={16} />
          <path d="M300,760 L1000,1700 L80,1700 Z" fill="#9fb4cf" opacity={0.05} />
          {/* worktop and cupboards */}
          <rect x={-400} y={820} width={1880} height={40} fill="#2a2e34" />
          <path d="M-400,820 L1480,820" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={3} />
          <rect x={-400} y={860} width={1880} height={900} fill="#11141a" />
          {[-200, 160, 520, 880].map((cx, i) => (
            <g key={cx}>
              <rect x={cx} y={880} width={330} height={160} rx={6} fill="#181c24" stroke="#232834" strokeWidth={4} />
              <rect x={cx} y={1060} width={330} height={560} rx={6} fill="#181c24" stroke="#232834" strokeWidth={4} />
              {i === 2 ? null : <rect x={cx + 135} y={950} width={60} height={12} rx={6} fill="#5a6270" />}
            </g>
          ))}
          {/* the open drawer, pulled out towards us */}
          <path d="M500,900 L870,900 L940,1060 L430,1060 Z" fill="#2a2018" />
          <rect x={430} y={1060} width={510} height={150} rx={6} fill="#1e2430" stroke="#2a3040" strokeWidth={4} />
          <rect x={655} y={1125} width={60} height={12} rx={6} fill="#6a7280" />
          <path d="M500,900 L870,900" stroke="#9fb4cf" strokeOpacity={0.4} strokeWidth={3} />
          <rect x={-400} y={1760} width={1880} height={400} fill="#0b0d12" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: the padlock was gone: the towel, the sickle, and an empty dent */
export const Gone: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.gone;
  const jolt = 0.05 * Math.exp(-lt * 6);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.05 + jolt} x={120} y={-160} shake={4} seed={1609}>
        <Stage>
          <DrawerTop t={t} padlock={false} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a1424" opacity={0.35} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** kitchen floor tiles in perspective, toward the hall door */
const Tiles: React.FC = () => (
  <g>
    <rect x={-600} y={-600} width={2280} height={3000} fill="#0a0c10" />
    {Array.from({length: 14}, (_, row) => {
      const y0 = 300 + row * row * 9 + row * 40;
      const y1 = 300 + (row + 1) * (row + 1) * 9 + (row + 1) * 40;
      return Array.from({length: 16}, (_, c) => {
        const k0 = (y0 - 120) / 560, k1 = (y1 - 120) / 560;
        const xa = 540 + (c - 8) * 120 * k0, xb = 540 + (c - 7) * 120 * k0;
        const xc = 540 + (c - 7) * 120 * k1, xd = 540 + (c - 8) * 120 * k1;
        return <path key={`${row}-${c}`} d={`M${xa},${y0} L${xb},${y0} L${xc},${y1} L${xd},${y1} Z`} fill={(row + c) % 2 ? '#1a1e26' : '#12151c'} />;
      });
    })}
    {/* the dark hall doorway at the far end */}
    <rect x={420} y={60} width={240} height={250} fill="#020305" />
    <path d="M420,310 L420,60 L660,60 L660,310" stroke="#2a3040" strokeWidth={10} fill="none" />
  </g>
);

/* S11: soil on the floor, wet; bare footprints leading away to the hall. The camera follows them */
export const Prints: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.soil;
  const follow = prog(t, B.soil, B.stairs, easeInOut);
  const wet = 0.6 + 0.4 * Math.sin(t * 3) * prog(t, B.wet - 0.2, B.wet + 0.4);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 1.9, follow)} y={mix(400, -420, follow)} shake={4} seed={1610}>
        <Stage overflow>
          <Tiles />
          <path d="M300,2200 C380,1400 520,800 540,320" stroke="#2a1a0e" strokeWidth={30} strokeLinecap="round" fill="none" opacity={0.15} />
          <SoilPrints x0={400} y0={2050} x1={460} y1={1300} n={4} s={2.4} reveal={1} wet={wet} />
          <SoilPrints x0={470} y0={1150} x1={520} y1={650} n={4} s={1.5} reveal={1} wet={wet} />
          <SoilPrints x0={525} y0={560} x1={540} y1={340} n={3} s={0.8} reveal={1} wet={wet} />
          {/* clods of soil by the drawer */}
          {[[260, 2140], [330, 2080], [220, 2060]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={30 - i * 6} ry={14} fill="#2a1a0e" />)}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12: up the stairs: prints on every tread; the camera climbs to my door at the top */
export const Stairs: React.FC<{t: number}> = ({t}) => {
  const climb = prog(t, B.stairs, B.never - 0.1, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 3.4, climb)} y={mix(0, -460, climb)} shake={4 + climb * 2} seed={1611}>
        <Stage overflow>
          <g transform="translate(-420,420)">
            <Staircase id="st" t={t} light="night" prints={mix(0.2, 1, prog(t, B.stairs, B.room))} />
          </g>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: my bedroom: the window, the moon, my duvet. Hold on the line */
export const MyRoom: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.never;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.02 + lt * 0.022} shake={4} seed={1612}>
        <Stage>
          <g transform="translate(540,760) scale(0.62) translate(-540,-760)">
            <WindowWall id="mr" t={t} mode="night" cloudCover={0.4} beam={0.8} />
          </g>
          <defs>
            <radialGradient id="mr-fade" cx="0.5" cy="0.4" r="0.75">
              <stop offset="0.45" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.85" />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={1080} height={1920} fill="url(#mr-fade)" />
          <Duvet y={1640} t={t} grip={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: my bare foot at the end of the bed; a grey hand closes the padlock round my big toe and withdraws */
export const Toe: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.cold;
  const reach = prog(t, B.cold + 0.2, B.snap - 0.1, easeInOut);
  const snap = prog(t, B.snap - 0.08, B.snap, easeIn);
  const back = prog(t, B.snap + 0.3, B.cut, easeIn);
  const jolt = t > B.snap ? 0.05 * Math.exp(-(t - B.snap) * 8) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.35 + lt * 0.06 + jolt} y={60} shake={4 + (t > B.snap ? 3 : 0)} seed={1613}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={600} cy={900} rx={520} ry={420} fill="#6f86a6" opacity={0.12} />
          {/* the end of the mattress and the duvet edge */}
          <rect x={-400} y={1060} width={1880} height={120} fill="#c8c0b0" opacity={0.25} />
          <path d="M-400,1000 C0,960 300,1000 380,1040 L380,1180 L-400,1180 Z" fill="#2a3446" />
          <BareFoot x={440} y={1120} s={1.05} t={t} flinch={t > B.snap ? 1 : 0} />
          {/* her hand: grey, nails long, coming up from under the bed and going back */}
          {(() => {
            // the lock rides in her fingers; once it's shut on the toe her hand lets go and sinks back under the bed
            const lx = mix(760, 560, reach), ly = mix(1260, 820, reach);
            return (
              <>
                <Hand id="to-g" x={lx + 82 + back * 160} y={ly + 119 + back * 700} rot={-30} scale={1.0} style={GRAN_DEAD} pose={lerpPose(POSES.relaxed, POSES.claw, 0.3 + snap * 0.4)} light={0.9} />
                <Padlock x={lx} y={ly} s={0.8} rot={mix(30, -8, reach)} shackle={1 - snap} lit={0.9} warm={0} />
              </>
            );
          })()}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
