import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Stage} from '../../../kit/common/fx';
import {Her, HerEyes, HerHand, HerMouth, HerBrows} from '../../../kit/common/puppet/Her';
import {FPS, easeInOut, mix, prog, track} from '../../../kit/common/util';
import lipsync from './lipsync.json';

/** A 10 s test of the image-generated cut-out puppet: idle breathing, blinks, a lip-synced line (bf_emma),
    a head tilt, the far arm beckoning with a swapped sheet hand, eyes going wide then red, fangs. */
export const META = {id: 'HerRigTest', durationSec: 10};

const LINE_AT = 1.25; // narration.wav (with its 0.35 s lead-in) placed here in the test mix

const blinkAt = (t: number, times: number[]) => times.some((b) => t >= b && t < b + 0.14);

const Scene: React.FC<{t: number}> = ({t}) => {
  // lip sync
  const li = Math.floor((t - LINE_AT) * lipsync.fps);
  const talking = li >= 0 && li < lipsync.states.length;
  let mouth: HerMouth = talking ? (lipsync.states[li] as HerMouth) : 'closed';
  // arm: out and up, then three beckons, then down
  const up = prog(t, 3.5, 4.3, easeInOut) * (1 - prog(t, 8.4, 9.3, easeInOut));
  const beck = t > 4.3 && t < 6.3 ? Math.max(0, Math.sin((t - 4.3) * Math.PI * 1.5)) : 0;
  const shoulder = -38 * up;
  const elbow = -112 * up + beck * 34;
  const hand: HerHand = up > 0.5 ? (beck > 0.5 ? 'R_grip' : 'R_open') : 'master';
  // face
  let eyes: HerEyes = blinkAt(t, [0.9, 3.7, 5.9, 9.2]) ? 'closed' : 'open';
  if (t > 6.5) eyes = blinkAt(t, [9.2]) ? 'closed' : 'wide';
  if (t > 7.1) eyes = blinkAt(t, [9.2]) ? 'closed' : 'red';
  if (t > 7.3) mouth = 'fangs';
  if (t > 8.9) mouth = 'smile';
  let brows: HerBrows = talking ? 'raised' : 'neutral';
  if (t > 6.5) brows = 'angry';
  const headTilt = track(t, [[0, 0], [1.4, -4], [3.4, 3], [6.4, 0], [7.2, 6], [10, 4]]);
  const look = track(t, [[0, 0], [1.4, -4], [3.4, 0], [6.4, 0], [7.0, 3]]);
  // camera: a slow push, then into the face for the turn
  const push = prog(t, 6.3, 8.2, easeInOut);
  const zoom = mix(1.0 + t * 0.01, 2.6, push);
  const cy = mix(-20, -470, push);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={zoom} x={mix(0, -40, push)} y={cy} shake={3} seed={1801}>
        <Stage>
          <rect x={-600} y={-800} width={2280} height={3200} fill="#07080c" />
          <ellipse cx={540} cy={800} rx={700} ry={900} fill="#6f86a6" opacity={0.14} />
          <rect x={-600} y={1600} width={2280} height={600} fill="#0c0e14" />
          <ellipse cx={540} cy={1620} rx={380} ry={40} fill="#000" opacity={0.6} />
          <Her x={540} y={1640} s={0.92} t={t} headTilt={headTilt} shoulder={shoulder} elbow={elbow} hand={hand} eyes={eyes} brows={brows} mouth={mouth} look={look} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

export const Episode: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Scene t={t} />
      <Audio src={staticFile('audio/her-rig-test/mix.wav')} />
    </AbsoluteFill>
  );
};
