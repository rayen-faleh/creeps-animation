import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../kit/fx';
import {MoorStreet, LampPostClose} from '../../../kit/art/Street';
import {Watcher} from '../../../kit/art/Watcher';
import {KeyTag, NotebookOpen, Entry} from '../../../kit/art/Notebook';
import {Hand, POSES, STYLES, lerpPose} from '../../../kit/art/Hand';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../kit/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** A page of Mick's full-moon log: the same line, month after month. */
export const LOG_PAGE: Entry[] = [
  {text: '12 Jan. S. at window. Held.'},
  {text: '10 Feb. S. at window. Held.'},
  {text: '11 Mar. S. at window. Held.'},
  {text: '9 Apr. S. at window. Held.'},
  {text: '8 May. S. at window. Held.'},
  {text: '7 Jun. S. at window. Held.'},
  {text: '6 Jul. S. at window. Held.'},
];
export const LOG_LEFT: Entry[] = [
  {text: '13 Aug. S. at window. Held.'},
  {text: '11 Sep. S. at window. Held.'},
  {text: '11 Oct. S. at window. Held.'},
  {text: '9 Nov. S. at window. Held.'},
  {text: '8 Dec. S. at window. Held.'},
];

/* S01: hook. Torchlight on a diary, pages turning: the same line, over and over */
export const HookPages: React.FC<{t: number}> = ({t}) => {
  const turn = (t % 1.4) / 1.4; // a page every 1.4 s
  const flip = t < B.street - 0.6 ? prog(turn, 0.55, 1, easeInOut) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + t * 0.03} y={-40} rot={-4} shake={4} seed={201}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#07080b" />
          <NotebookOpen id="hp" x={560} y={520} s={0.92} rot={-6} t={t} left={LOG_LEFT} right={LOG_PAGE} heading={['2019', '2020']} lit={0.95} turn={flip} size={34} />
        </Stage>
      </Camera>
      <Torch x={640} y={820} r={520} ambient={0.08} />
    </AbsoluteFill>
  );
};

/* S02: walking down the road at night toward the lamp; the torch on the post is aimed straight at us */
export const StreetApproach: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, B.street, B.post, (x) => x);
  const step = Math.abs(Math.sin((t - B.street) * Math.PI * 1.9)) * 10; // walking bob
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.6, 2.6, k)} y={mix(30, 70, k) + step} shake={6} seed={202}>
        <Stage>
          <MoorStreet id="sa" t={t} light="night" y={0} moon={[780, 520]} moonR={52} windowsLit={0.06} lamp={0.85} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
        <Stage>
          <defs>
            <radialGradient id="sa-g">
              <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="0.12" stopColor="#fff3d0" stopOpacity={0.8} />
              <stop offset="0.4" stopColor="#ffd890" stopOpacity={0.18} />
              <stop offset="1" stopColor="#ffd890" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={548} cy={mix(880, 850, k) - step} r={mix(70, 150, k) + noise1(t * 20, 1) * 6} fill="url(#sa-g)" />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S03 + S05: close on the post: the torch lashed with twine; then the key hanging under it, and his hand takes it */
export const PostClose: React.FC<{t: number; key?: boolean}> = ({t, key: withKey}) => {
  const t0 = withKey ? B.key : B.post;
  const lt = t - t0;
  const reach = withKey ? prog(t, t0 + 0.5, t0 + 1.0, easeOut) : 0;
  const grab = withKey ? prog(t, t0 + 1.0, t0 + 1.2, easeOut) : 0;
  const pullAway = withKey ? prog(t, t0 + 1.5, t0 + 2.2, easeIn) : 0;
  const swing = Math.sin(t * 2.1) * 6 * (1 - grab);
  const keyY = withKey ? 120 : 260;
  const hx = mix(900, 640, reach) + pullAway * 120;
  const hy = mix(2100, 1290, reach) + pullAway * 500;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(14px)'}}>
        <Camera t={t} zoom={2.2} shake={2} seed={203}>
          <Stage>
            <MoorStreet id="pc-bg" t={t} light="night" x={-300} y={-200} s={1.3} moon={[300, 600]} moonR={50} windowsLit={0.1} />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={withKey ? 1.25 + lt * 0.03 : 1.0 + lt * 0.05} y={withKey ? 220 : -40} shake={4} seed={204}>
        <Stage>
          <LampPostClose id="pc" x={560} y={900} s={1.25} t={t} glare={withKey ? 0.3 : 0.75}>
            {!(grab > 0.5 && pullAway > 0) && <KeyTag x={0} y={keyY} s={1.4} swing={swing} label="Back door" lit={0.7} />}
          </LampPostClose>
          {withKey && (
            <g>
              {grab > 0.5 && pullAway > 0 && <KeyTag x={hx - 80} y={hy - 340} s={1.4} swing={-20} label="Back door" lit={0.7} />}
              <Hand id="pc-h" x={hx} y={hy} rot={-24} scale={1.4} style={STYLES.adult} pose={lerpPose(POSES.reach, POSES.fist, grab)} light={0.8} />
            </g>
          )}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: reverse: the beam reaches back up the road and lights one upstairs window: his */
export const WindowBeam: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.window;
  const k = prog(t, B.window, B.key, easeInOut);
  const [wx, wy] = [306, 905]; // an upper window on the left terrace (canonical street units)
  return (
    <Camera t={t} zoom={mix(1.5, 2.3, k)} x={mix(-120, -230, k)} y={mix(-60, -90, k)} shake={4} seed={205}>
      <Stage>
        <defs>
          <radialGradient id="wb-pool">
            <stop offset="0" stopColor="#fff2d0" stopOpacity={0.7} />
            <stop offset="0.4" stopColor="#ffd890" stopOpacity={0.22} />
            <stop offset="1" stopColor="#ffd890" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="wb-cone" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0" stopColor="#fff4d8" stopOpacity={0.16} />
            <stop offset="1" stopColor="#fff4d8" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <MoorStreet id="wb" t={t} light="night" moon={[820, 470]} moonR={50} windowsLit={0.04} lamp={0} />
        <polygon points={`${540 - 260},2000 ${540 + 260},2000 ${wx + 26},${wy + 18} ${wx - 26},${wy - 18}`} fill="url(#wb-cone)" style={{mixBlendMode: 'screen'}} />
        <circle cx={wx} cy={wy} r={70 + noise1(t * 4, 2) * 3} fill="url(#wb-pool)" style={{mixBlendMode: 'screen'}} />
        <path d={`M${wx - 14},${wy + 16} L${wx - 14},${wy - 6} Q${wx},${wy - 26} ${wx + 14},${wy - 6} L${wx + 14},${wy + 16} Z`} fill="#fff1c8" opacity={0.75 + lt * 0.02} />
      </Stage>
    </Camera>
  );
};

/* S08: memory. Mick at the lamp, torch lashed to the post above him, writing the night's line one-handed */
export const MemoryLamp: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.memory;
  const write = Math.sin(t * 9) * 4;
  const notebook = (
    <g transform={`translate(-30,-10) rotate(-14)`}>
      <rect x={-46} y={-30} width={92} height={62} fill="#d8c6a0" />
      <path d="M0,-30 L0,32" stroke="#6a5a40" strokeWidth={3} />
      <path d={`M10,-12 l${30 + write},0 M10,0 l26,0 M10,12 l${20 + write},0`} stroke="#2a2a30" strokeWidth={2} />
    </g>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(6px)'}}>
        <Camera t={t} zoom={1.0} shake={2} seed={206}>
          <Stage>
            <MoorStreet id="ml-bg" t={t} light="night" x={-1420} y={-2380} s={3.4} moon={[700, 520]} moonR={50} windowsLit={0.25} lamp={0} />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={1.02 + lt * 0.03} shake={3} seed={207}>
        <Stage>
          {/* the post with the lashed torch, beam toward the houses */}
          <rect x={740} y={-200} width={44} height={1700} fill="#050506" />
          <rect x={748} y={-200} width={6} height={1700} fill="#ffb45a" opacity={0.25} />
          <rect x={724} y={430} width={76} height={150} rx={10} fill="#0c0d10" />
          {[450, 490, 530].map((ly) => (
            <path key={ly} d={`M718,${ly} q44,-10 88,0`} stroke="#8a7350" strokeWidth={7} fill="none" />
          ))}
          <polygon points="736,470 -200,140 -200,900 736,560" fill="#fff0c8" opacity={0.08} />
          <circle cx={730} cy={515} r={26} fill="#fff6e0" opacity={0.95} />
          <Watcher id="ml-mick" t={t} x={470} y={1420} s={1.05} torch={0} rim="#ffcf80" rimA={0.95} holding={notebook} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
