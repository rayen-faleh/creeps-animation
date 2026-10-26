import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../kit/fx';
import {DoorWall, DOOR} from '../../../kit/sets/DoorWall';
import {Wolfsbane} from '../../../kit/art/Charms';
import {NotebookOpen, NotebookShelf, Entry} from '../../../kit/art/Notebook';
import {Phone, PhoneMsg} from '../../../kit/art/Modern';
import {Hand, POSES, STYLES, lerpPose, wristFor} from '../../../kit/art/Hand';
import {Wall} from '../../../kit/art/Room';
import {easeIn, easeInOut, easeOut, lin, mix, noise1, prog, track} from '../../../kit/util';
import {B, LOG_LEFT, LOG_PAGE} from './Outside';

const YEARS = Array.from({length: 20}, (_, i) => String(2006 + i));
const KEYHOLE: [number, number] = [DOOR.cx - DOOR.w / 2 + DOOR.w * 0.8, DOOR.yb - DOOR.h * 0.46 + 46];

/* S06: Mick's back door at night, bundles of wolfsbane nailed to it; the key goes in, the door gives */
export const BackDoor: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.door;
  const insert = prog(t, B.door + 0.2, B.door + 0.7, easeOut);
  const twist = prog(t, B.door + 0.8, B.door + 1.1, easeInOut);
  const open = prog(t, B.door + 1.3, B.shelf, easeInOut) * 0.28;
  const pose = POSES.point;
  const [wx, wy] = wristFor(KEYHOLE[0] - 40 * (1 - insert), KEYHOLE[1] + 10, -70 + twist * 30, 1.3, STYLES.adult, pose);
  return (
    <Camera t={t} zoom={1.15 + lt * 0.04} x={60} y={60} shake={5} seed={211}>
      <Stage>
        <DoorWall id="bd" t={t} mode="night" open={open} beyond={<rect x={0} y={0} width={1080} height={1920} fill="#010102" />}>
          <Hand id="bd-h" x={wx} y={wy + (1 - Math.min(1, insert * 3)) * 400} rot={-70 + twist * 30} scale={1.3} style={STYLES.adult} pose={pose} light={0.7} />
        </DoorWall>
        <Wolfsbane x={DOOR.cx - 120} y={DOOR.yb - DOOR.h + 330} s={0.9} t={t} warm={0} lit={0.8} />
        <Wolfsbane x={DOOR.cx + 110} y={DOOR.yb - DOOR.h + 360} s={0.8} t={t + 2} warm={0} lit={0.8} />
        <Wolfsbane x={DOOR.cx - 10} y={DOOR.yb - DOOR.h + 230} s={0.85} t={t + 4} warm={0} lit={0.8} />
      </Stage>
    </Camera>
  );
};

/* S07 + S10a: torch along a shelf of twenty notebooks, one per year; later, 2006 is pulled out */
export const ShelfScene: React.FC<{t: number; pick?: boolean}> = ({t, pick}) => {
  const t0 = pick ? B.y2006 : B.shelf;
  const lt = t - t0;
  // the torch walks the spines right to left (later years first), or sits on 2006
  const bx = pick ? 170 : track(t, [
    [t0, 980],
    [t0 + 1.2, 560],
    [t0 + 2.6, 260],
  ]);
  const pull = pick ? prog(t, t0 + 0.4, t0 + 1.1, easeOut) : 0;
  const [tx, ty] = [150, 1120];
  const pose = lerpPose(POSES.reach, POSES.fist, prog(t, t0 + 0.25, t0 + 0.4));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={pick ? 1.6 + lt * 0.03 : 1.1 + lt * 0.03} x={pick ? -330 : mix(80, -160, lin(t, t0, t0 + 2.6))} y={pick ? 160 : 40} shake={5} seed={212}>
        <Stage>
          <Wall id="sh-wall" x={-600} y={-600} w={2400} h={2600} lit={0.5} />
          <NotebookShelf x={-60} y={1220} s={1.3} years={YEARS} pulled={pick ? 0 : -1} pull={pull} lit={0.9} />
          <NotebookShelf x={-60} y={720} s={1.3} years={['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']} lit={0.4} />
          {pick && <Hand id="sh-h" x={tx + 40} y={mix(1700, ty + 120, prog(t, t0, t0 + 0.3, easeOut)) + pull * 120} rot={-8} scale={1.3} style={STYLES.adult} pose={pose} light={0.7} />}
        </Stage>
      </Camera>
      <Torch x={pick ? 470 : bx} y={pick ? 900 : 940} r={pick ? 420 : 360} ambient={0.1} />
    </AbsoluteFill>
  );
};

/* S09: the log page. "My initial. At the window. Held." One line writes itself out in the light */
export const LogPage: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.page;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.65 + lt * 0.04} x={250} y={-40} rot={-3} shake={4} seed={213}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06070a" />
          <NotebookOpen id="lp" x={540} y={560} s={0.95} rot={-3} t={t} left={LOG_LEFT} right={LOG_PAGE} heading={['2023', '2024']} lit={1} highlight={3} size={34} />
        </Stage>
      </Camera>
      <Torch x={700} y={880} r={480} ambient={0.06} />
    </AbsoluteFill>
  );
};

/* the summer they were ten: neat right-handed entries, then the shaky one-handed page */
export const PAGES_2006_LEFT: Entry[] = [
  {text: '11 Jun. Both boys in by dark.'},
  {text: '10 Jul. Both boys in by dark.'},
  {text: '8 Aug. Both boys in by dark.'},
];
export const PAGES_2006_RIGHT: Entry[] = [
  {text: '9 Aug.', shaky: true},
  {text: 'D. took my arm.', shaky: true},
  {text: 'S. on the moor till dawn.', shaky: true},
  {text: 'Remembers nothing.', shaky: true},
];

/* S10b + S11: the 2006 notebook open; the shaky page; the zoom jolts on "Danny's." */
export const Notebook2006: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.open2006;
  const turn = prog(t, B.open2006 + 0.1, B.oneHand - 0.1, easeInOut);
  const onRight = prog(t, B.oneHand, B.reveal, easeInOut); // camera moves from the neat page to the shaky one
  const close = prog(t, B.reveal, B.danny, easeInOut); // and in on "D. took my arm."
  const jolt = t > B.danny ? 0.05 * Math.exp(-(t - B.danny) * 7) : 0;
  const tremble = t > B.reveal ? noise1(t * 20, 3) * 2 : 0;
  return (
    <AbsoluteFill>
      <Camera
        t={t}
        zoom={mix(1.1, 1.6, onRight) + close * 0.7 + jolt}
        x={mix(-180, 260, onRight) + close * 40 + tremble}
        y={mix(-40, -160, close)}
        rot={-2}
        shake={4}
        seed={214}
      >
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06070a" />
          <NotebookOpen
            id="nb6"
            x={540}
            y={560}
            s={0.95}
            rot={-2}
            t={t}
            left={PAGES_2006_LEFT}
            right={turn > 0.5 ? PAGES_2006_RIGHT : []}
            heading={['2006', '']}
            lit={1}
            turn={turn}
            highlight={t > B.reveal ? 1 : -1}
            size={38}
          />
        </Stage>
      </Camera>
      <Torch x={mix(420, 700, onRight)} y={mix(880, 760, close)} r={mix(500, 420, close)} ambient={0.06} />
    </AbsoluteFill>
  );
};

/** Danny's thread from Part I, plus whatever lands tonight. */
const THREAD: PhoneMsg[] = [
  {lines: ['Mum finally told me', 'how Mick lost his arm'], at: 0},
  {lines: ['The summer we were ten'], at: 0},
  {lines: ['The night you went', 'missing'], at: 0},
];

/* S12: "Danny told me it was me." His hand, the phone, Danny's texts from that night */
export const ToldScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.told;
  return (
    <Camera t={t} zoom={1.15 + lt * 0.05} y={-120} shake={5} seed={215}>
      <Stage>
        <rect x={-400} y={-600} width={1880} height={2600} fill="#030407" />
        <Phone id="ph-told" t={t} x={330} y={300} from="Danny" clock="03:07" msgs={THREAD} />
      </Stage>
    </Camera>
  );
};

export const PAGE_2026: Entry[] = [
  {text: '20 Oct. Doctor says weeks.'},
  {text: 'If I go,'},
  {text: 'keep D. away'},
  {text: 'from the boy.'},
];

/* S13 + S14: the last notebook, the last page; push in through "keeping Danny out." */
export const LastPage: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.last;
  const turn = prog(t, B.last + 0.2, B.keep - 0.15, easeInOut);
  const push = prog(t, B.keep, B.text, (x) => x);
  const jolt = t > B.out ? 0.05 * Math.exp(-(t - B.out) * 7) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.4 + push * 0.6 + jolt} x={260} y={mix(-20, -100, push)} rot={-3} shake={4} seed={216}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06070a" />
          <NotebookOpen
            id="nb26"
            x={540}
            y={560}
            s={0.95}
            rot={-3}
            t={t}
            left={[{text: '17 Oct. S. at window. Held.'}]}
            right={turn > 0.5 ? PAGE_2026 : []}
            heading={['2026', '']}
            lit={1}
            turn={turn}
            highlight={t > B.keep ? 2 : -1}
            size={40}
          />
        </Stage>
      </Camera>
      <Torch x={720} y={mix(860, 820, push)} r={460} ambient={0.06} />
    </AbsoluteFill>
  );
};

/* S15: a new message from Danny; whip-turn to the back door: the handle turns, it opens a crack. */
export const Cliffhanger: React.FC<{t: number}> = ({t}) => {
  if (t < B.turn) {
    const lt = t - (B.text - 0.4);
    return (
      <Camera t={t} zoom={1.2 + lt * 0.06} y={-60} shake={6} seed={217}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#030407" />
          <Phone
            id="ph-new"
            t={t}
            x={330}
            y={280}
            from="Danny"
            clock="03:41"
            buzz={[B.text]}
            msgs={[...THREAD, {lines: ["Saw a light at Mick's"], at: B.text}, {lines: ['Coming round'], at: B.text + 0.55}]}
          />
        </Stage>
      </Camera>
    );
  }
  const whip = prog(t, B.turn, B.turn + 0.3, easeOut);
  const blur = (1 - whip) * 24;
  const rattle = t > B.turn + 0.35 && t < B.turn + 0.85 ? 1 : 0;
  const open = prog(t, B.turn + 0.9, B.cut, easeIn) * 0.16;
  const push = prog(t, B.turn, B.cut, (x) => x);
  return (
    <AbsoluteFill style={{filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
      <Camera t={t} zoom={1.1 + push * 0.3} x={(1 - whip) * -700 + 80} y={40} rot={(1 - whip) * 6} shake={7} seed={218}>
        <Stage>
          <DoorWall
            id="ch"
            t={t}
            mode="night"
            open={open}
            knock={rattle}
            under={0.35}
            underColor="#9fb4cf"
            beyond={<rect x={0} y={0} width={1080} height={1920} fill="#9fb4cf" opacity={0.25} />}
          />
          <Wolfsbane x={DOOR.cx - 120} y={DOOR.yb - DOOR.h + 330} s={0.9} t={t} warm={0} lit={0.8} />
          <Wolfsbane x={DOOR.cx + 110} y={DOOR.yb - DOOR.h + 360} s={0.8} t={t + 2} warm={0} lit={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
