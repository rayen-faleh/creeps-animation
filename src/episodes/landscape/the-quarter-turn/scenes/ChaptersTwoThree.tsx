import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../../kit/common/fx';
import {Hand, POSES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {WatcherProfile} from '../../../../kit/common/art/Watcher';
import {CottageExterior, GardenView} from '../../../../kit/common/art/Cottage';
import {Staircase, UnderSink, PipeJoint, Van} from '../../../../kit/common/art/Interior';
import {KitchenSinkL, K, DoorWallL, L_DOOR} from '../../../../kit/landscape';
import {easeIn, easeInOut, easeOut, lin, mix, noise1, prog, track} from '../../../../kit/common/util';
import {at, LEAD} from '../beats';
import {BedView, CROSS, DRIP, HandOnTap, KIERAN, ME, PhoneShot, TapMacro, nextDrop} from './shared';

export const C2 = {
  start: at('C2_01') - LEAD,
  smell: at('C2_02'),
  bed: at('C2_03'),
  fills: at('C2_04'),
  counting: at('C2_05'),
  pillow: at('C2_06'),
  notice: at('C2_07'),
  dark: at('C2_09'),
  bright: at('C2_10'),
  pressure: at('C2_11'),
  frost: at('C2_11b'),
  haworth: at('C2_12'),
  sorry: at('C2_14'),
  roses: at('C2_17'),
  locked: at('C2_18'),
  ninth: at('C2_20'),
  washer: at('C2_21'),
  plumber: at('C2_22'),
  end: at('C3_01') - LEAD,
};

export const C3 = {
  start: C2.end,
  laugh: at('C3_02'),
  under: at('C3_03'),
  sideways: at('C3_05'),
  follow: at('C3_07'),
  circle: at('C3_10'),
  moat: at('C3_11'),
  old: at('C3_12'),
  asked: at('C3_14'),
  cap: at('C3_17'),
  quiet: at('C3_18'),
  still: at('C3_19'),
  end: at('C4_01') - LEAD,
};
/** The last drop ever falls just after "And the house went quiet." */
export const LAST_DROP = nextDrop(C3.quiet + 0.4);

const KEYHOLE: [number, number] = [L_DOOR.cx - L_DOOR.w / 2 + L_DOOR.w * 0.8, L_DOOR.yb - L_DOOR.h * 0.46 + 46];

/* moving in: my key in the front door; it gives onto a dark hall */
const FrontDoor: React.FC<{t: number}> = ({t}) => {
  const t0 = C2.start;
  const insert = prog(t, t0 + 1.0, t0 + 1.6, easeOut);
  const twist = prog(t, t0 + 1.9, t0 + 2.3, easeInOut);
  const open = prog(t, t0 + 2.8, C2.smell, easeInOut) * 0.5;
  const [wx, wy] = wristFor(KEYHOLE[0] - 40 * (1 - insert), KEYHOLE[1] + 10, -70 + twist * 30, 1.1, ME, POSES.point);
  return (
    <Camera t={t} zoom={1.15 + (t - t0) * 0.03} x={60} shake={4} seed={410}>
      <Stage>
        <DoorWallL id="fd" t={t} mode="night" open={open} beyond={<rect x={0} y={0} width={1920} height={1080} fill="#010102" />}>
          {open < 0.2 && <Hand id="fd-h" x={wx} y={wy + (1 - Math.min(1, insert * 3)) * 400} rot={-70 + twist * 30} scale={1.1} style={ME} pose={POSES.point} light={0.7} />}
        </DoorWallL>
      </Stage>
    </Camera>
  );
};

/* the hall: her smell still in it */
const Hall: React.FC<{t: number}> = ({t}) => (
  <Camera t={t} zoom={1.05 + (t - C2.smell) * 0.02} y={-30} shake={3} seed={411}>
    <Stage>
      <Staircase id="hl" t={t} light="night" />
    </Stage>
  </Camera>
);

/* a pillow over my head: the dark, my hands pressing it down */
const Pillow: React.FC<{t: number}> = ({t}) => (
  <Camera t={t} zoom={1.0} shake={4} seed={412}>
    <Stage>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#05070b" />
      <path d="M-200,-200 C400,120 1500,120 2120,-200 L2120,420 C1500,560 400,560 -200,420 Z" fill="#2a3040" opacity={0.6} />
      <path d="M-200,420 C400,560 1500,560 2120,420" stroke="#9fb4cf" strokeOpacity={0.2} strokeWidth={4} fill="none" />
      <Hand id="pl-l" x={560} y={500 + noise1(t * 3, 2) * 4} rot={160} scale={1.3} style={ME} pose={lerpPose(POSES.relaxed, POSES.fist, 0.5)} light={0.5} />
      <Hand id="pl-r" x={1360} y={500} rot={-160} scale={1.3} style={ME} pose={lerpPose(POSES.relaxed, POSES.fist, 0.5)} mirror light={0.5} />
    </Stage>
  </Camera>
);

/* the drip on dark nights (fast) and bright nights (slow), the window above */
const NightsDrip: React.FC<{t: number; bright?: boolean}> = ({t, bright}) => {
  const t0 = bright ? C2.bright : C2.dark;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + (t - t0) * 0.02} x={0} y={-60} shake={2} seed={bright ? 414 : 413}>
        <Stage>
          <KitchenSinkL id={bright ? 'nb' : 'nd'} t={t} mode="night" turn={90} drip={{period: bright ? 3.4 : 0.85, t0: t0 + 0.4}} />
        </Stage>
      </Camera>
      <Torch x={960} y={520} r={bright ? 900 : 520} ambient={bright ? 0.35 : 0.12} tint="190,210,240" />
    </AbsoluteFill>
  );
};

/* old pipes: under the sink by torchlight */
const PipesLook: React.FC<{t: number; t0: number; pan?: boolean; capped?: number; flow?: number; hands?: 'cap'}> = ({t, t0, pan, capped = 0, flow = 1, hands}) => {
  const k = pan ? prog(t, t0 + 0.4, t0 + 6.5, easeInOut) : 0;
  const bx = pan ? mix(780, 260, k) : track(t, [[t0, 1100], [t0 + 2.5, 780]]);
  const spin = hands === 'cap' ? Math.sin((t - t0) * 6) * 25 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={pan ? 1.35 : hands === 'cap' ? 1.9 : 1.2} x={pan ? mix(-120, -500, k) : hands === 'cap' ? -480 : 0} y={pan || hands === 'cap' ? 80 : 0} shake={3} seed={415}>
        <Stage>
          <UnderSink id={`us${Math.round(t0)}`} t={t} capped={capped} flow={flow} />
          {hands === 'cap' && (
            <g>
              <g transform={`translate(470,640) rotate(${spin})`}>
                <rect x={-12} y={-150} width={24} height={150} rx={8} fill="#7a7e88" />
                <path d="M-30,-160 a30,30 0 1,1 60,0 l-10,10 h-40 Z" fill="#8a8e98" />
              </g>
              <Hand id="us-k" x={560} y={820} rot={-30 + spin * 0.3} scale={1.1} style={KIERAN} pose={lerpPose(POSES.relaxed, POSES.fist, 0.7)} light={0.8} />
            </g>
          )}
        </Stage>
      </Camera>
      <Torch x={pan ? 960 : bx} y={hands === 'cap' ? 600 : 620} r={480} ambient={0.08} tint="255,240,210" />
    </AbsoluteFill>
  );
};

/* the back garden: frost everywhere except the rose bed */
const Frost: React.FC<{t: number}> = ({t}) => (
  <Camera t={t} zoom={1.1 + (t - C2.frost) * 0.02} y={60} shake={2} seed={416}>
    <Stage>
      <GardenView id="fr" t={t} light="night" frost={1} frostRing />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#000" opacity={0.15} />
    </Stage>
  </Camera>
);

/* Mr Haworth over the wall, in profile; he talks, then looks past me at the roses */
const Haworth: React.FC<{t: number; second?: boolean}> = ({t, second}) => {
  const quote = second ? [at('C2_15') + 0.6, at('C2_15') + 5.2] : [at('C2_13') + 3.4, at('C2_13') + 6.0];
  const speaking = t >= quote[0] && t < quote[1];
  const jaw = speaking ? Math.max(0, Math.sin(t * 14) * 0.6 + noise1(t * 11, 4) * 0.4) : 0;
  const turn = second ? prog(t, at('C2_16') + 0.6, at('C2_16') + 1.6) : 0;
  const lt = t - (second ? C2.sorry : C2.haworth);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(9px)'}}>
        <Camera t={t} zoom={1.3} shake={2} seed={417}>
          <Stage>
            <GardenView id={second ? 'hw2' : 'hw1'} t={t} light="dusk" />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.015} shake={3} seed={418}>
        <Stage>
          <rect x={-300} y={760} width={2520} height={600} fill="#120a06" />
          <path d="M-300,760 L2220,760" stroke="#c56a2e" strokeOpacity={0.35} strokeWidth={3} />
          <WatcherProfile id={second ? 'mh2' : 'mh'} x={1180} y={360} s={0.95} t={t} jaw={jaw} turn={turn * 0.8} rim="#e09050" bothArms />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* the back bedroom, still locked: I rattle the ring; nothing */
const LockedAgain: React.FC<{t: number}> = ({t}) => {
  const t0 = C2.locked;
  const reach = prog(t, t0 + 0.6, t0 + 1.4, easeOut);
  const rattle = t > t0 + 1.6 && t < t0 + 3.6 ? Math.max(0, Math.sin((t - t0) * 30)) : 0;
  const ring: [number, number] = [L_DOOR.cx - L_DOOR.w / 2 + L_DOOR.w * 0.8, L_DOOR.yb - L_DOOR.h * 0.46 + 40];
  const [bx, by] = wristFor(ring[0], ring[1], -20, 1.1, ME, POSES.reach);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + (t - t0) * 0.02} y={-20} shake={4} seed={419}>
        <Stage>
          <DoorWallL id="la" t={t} mode="night" knock={rattle} />
          <Hand id="la-h" x={mix(bx + 160, bx, reach)} y={mix(by + 520, by, reach) + rattle * 4} rot={-20} scale={1.1} style={ME} pose={lerpPose(POSES.reach, POSES.fist, rattle > 0 ? 0.6 : 0.2)} light={0.7} />
        </Stage>
      </Camera>
      <Torch x={1080} y={560} r={500} ambient={0.12} />
    </AbsoluteFill>
  );
};

/* plumber's van at the gate, early morning */
const VanArrives: React.FC<{t: number}> = ({t}) => (
  <Camera t={t} zoom={1.08 + (t - C3.start) * 0.015} shake={3} seed={420}>
    <Stage>
      <CottageExterior id="va" t={t} light="dusk" lamp={0.5} smoke={0.4} />
      <Van x={1360} y={900} s={0.62} />
    </Stage>
  </Camera>
);

/* the trench: dug round the bed, the copper showing */
const Trench: React.FC<{t: number; t0: number; reveal: number; zoom?: number; y?: number; spade?: boolean}> = ({t, t0, reveal, zoom = 1.1, y = 40, spade}) => {
  const dig = spade ? Math.abs(Math.sin((t - t0) * 2.2)) : 0;
  return (
    <Camera t={t} zoom={zoom + (t - t0) * 0.015} y={y} shake={3} seed={421}>
      <Stage>
        <GardenView id={`tr${Math.round(t0)}`} t={t} light="dusk" trench={reveal} />
        {spade && (
          <g transform={`translate(1420,${980 - dig * 60}) rotate(${-18 + dig * 10})`}>
            <rect x={-10} y={-420} width={20} height={380} fill="#2a1a0e" />
            <path d="M-60,-40 L60,-40 L50,90 Q0,130 -50,90 Z" fill="#3a3c42" />
            <path d="M-60,-40 L60,-40" stroke="#c56a2e" strokeOpacity={0.4} strokeWidth={3} />
          </g>
        )}
      </Stage>
    </Camera>
  );
};

/* the old joint, soil brushed off: 1974 */
const Joint: React.FC<{t: number}> = ({t}) => {
  const wipe = prog(t, C3.old + 0.6, at('C3_13') - 0.2, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + (t - C3.old) * 0.02} shake={3} seed={422}>
        <Stage>
          <rect x={-400} y={-400} width={2720} height={1900} fill="#140c06" />
          <PipeJoint x={960} y={520} s={1.1} dirt={1 - wipe} />
          <Hand id="jt-h" x={mix(500, 1400, wipe)} y={760 - Math.sin(wipe * Math.PI) * 40} rot={-80} scale={1.2} style={ME} pose={POSES.flat} light={0.7} />
        </Stage>
      </Camera>
      <Torch x={960} y={520} r={600} ambient={0.25} tint="255,230,200" />
    </AbsoluteFill>
  );
};

/* the kitchen by day: wide, still; with the drip, or after the quiet */
const KitchenDay: React.FC<{t: number; t0: number; drip?: boolean; hover?: boolean}> = ({t, t0, drip, hover}) => {
  const up = hover ? prog(t, t0 + 1.0, t0 + 3.0, easeOut) - prog(t, t0 + 4.5, t0 + 6.0, easeIn) * 0.6 : 0;
  return (
    <Camera t={t} zoom={1.05 + (t - t0) * 0.012} y={-20} shake={2} seed={423}>
      <Stage>
        <KitchenSinkL id={`kd${Math.round(t0)}`} t={t} mode="day" turn={drip ? 90 : 90} drip={drip ? DRIP : undefined}>
          {hover && <Hand id="kd-h" x={mix(1300, 1020, up)} y={mix(1300, 720, up)} rot={-30} scale={1.1} style={ME} pose={lerpPose(POSES.relaxed, POSES.reach, up)} light={0.8} />}
        </KitchenSinkL>
      </Stage>
    </Camera>
  );
};

export const chaptersTwoThreeAt = (t: number): React.ReactNode => {
  // ---- Chapter II
  if (t < C2.smell) return <FrontDoor t={t} />;
  if (t < C2.bed) return <Hall t={t} />;
  if (t < C2.fills) return <BedView t={t} t0={C2.bed} seed={430} />;
  if (t < C2.counting) return <TapMacro t={t} t0={C2.fills} id="tm-fills" mode="night" drip={DRIP} turn={90} />;
  if (t < C2.pillow) return <BedView t={t} t0={C2.counting} clock={[2, 40]} seed={431} />;
  if (t < C2.notice) return <Pillow t={t} />;
  if (t < C2.dark) return <TapMacro t={t} t0={C2.notice} id="tm-notice" mode="night" drip={DRIP} turn={90} tight={prog(t, C2.notice, C2.dark)} />;
  if (t < C2.bright) return <NightsDrip t={t} />;
  if (t < C2.pressure) return <NightsDrip t={t} bright />;
  if (t < C2.frost) return <PipesLook t={t} t0={C2.pressure} />;
  if (t < C2.haworth) return <Frost t={t} />;
  if (t < C2.sorry) return <Haworth t={t} />;
  if (t < C2.roses) return <Haworth t={t} second />;
  if (t < C2.locked) return <Trench t={t} t0={C2.roses} reveal={0} zoom={1.25} y={120} />;
  if (t < C2.ninth) return <LockedAgain t={t} />;
  if (t < C2.washer) return <BedView t={t} t0={C2.ninth} clock={[4, 10]} open={0.55 + 0.4 * Math.sin((t - C2.ninth) * 1.3) ** 2} seed={432} />;
  if (t < C2.plumber)
    return (
      <TapMacro t={t} t0={C2.washer} id="tm-washer" mode="day" drip={DRIP} turn={90}>
        <HandOnTap id="tw-h" style={ME} reach={Math.min(0.85, prog(t, C2.washer + 0.8, C2.washer + 3.6, easeOut))} turn={90} t={t} />
      </TapMacro>
    );
  if (t < C2.end) return <PhoneShot t={t} t0={C2.plumber} id="ph-k" from="Kieran · Plumbing" clock="08:12" msgs={[{lines: ['Can do tomorrow 9am.', 'Kieran'], at: C2.plumber + 1.4}]} buzz={[C2.plumber + 1.4]} />;
  // ---- Chapter III
  if (t < C3.laugh) return <VanArrives t={t} />;
  if (t < C3.under) {
    const wig = Math.sin(prog(t, C3.laugh + 0.8, C3.laugh + 2.4) * Math.PI * 2) * 30;
    return (
      <TapMacro t={t} t0={C3.laugh} id="tm-kieran" mode="day" drip={DRIP} turn={90 + wig}>
        <HandOnTap id="tk-h" style={KIERAN} reach={prog(t, C3.laugh + 0.2, C3.laugh + 0.8, easeOut)} turn={90 + wig} t={t} />
      </TapMacro>
    );
  }
  if (t < C3.sideways) return <PipesLook t={t} t0={C3.under} />;
  if (t < C3.follow) return <PipesLook t={t} t0={C3.sideways} pan />;
  if (t < C3.circle) return <Trench t={t} t0={C3.follow} reveal={prog(t, C3.follow + 0.5, C3.circle - 0.2, easeInOut)} spade zoom={1.2} />;
  if (t < C3.moat) return <Trench t={t} t0={C3.circle} reveal={1} zoom={1.0} y={0} />;
  if (t < C3.old) return <Trench t={t} t0={C3.moat} reveal={1} zoom={2.4} y={230} />;
  if (t < C3.asked) return <Joint t={t} />;
  if (t < C3.cap) return <KitchenDay t={t} t0={C3.asked} drip hover />;
  if (t < C3.quiet) return <PipesLook t={t} t0={C3.cap} capped={prog(t, C3.cap + 0.6, C3.cap + 3.2)} flow={1 - prog(t, C3.cap + 2.5, C3.cap + 3.4)} hands="cap" />;
  if (t < C3.still) return <TapMacro t={t} t0={C3.quiet} id="tm-quiet" mode="day" drip={{...DRIP, on: t < LAST_DROP + 0.4 ? 1 : 0}} turn={90} tight={prog(t, C3.quiet, C3.still, easeInOut)} />;
  return <KitchenDay t={t} t0={C3.still} />;
};

/** Chapters II-III are the present: cold throughout. */
export const chaptersTwoThreeGrade = (_t: number): 'cold' => 'cold';
export const _unused = [lin, CROSS, K, Staircase];
