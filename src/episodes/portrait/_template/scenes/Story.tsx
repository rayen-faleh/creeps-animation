import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {DoorWall} from '../../../../kit/portrait/sets/DoorWall';
import {WindowWall, WIN, SILL_Y} from '../../../../kit/portrait/sets/WindowWall';
import {Hand, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {Candle, ElderProfile} from '../../../../kit/common/art/Props';
import {Wall} from '../../../../kit/common/art/Room';
import {easeIn, easeOut, mix, noise1, prog} from '../../../../kit/common/util';

/** Knock times (seconds). The same list drives the door jolt here and the knock sounds in cues.py. */
export const DOOR_KNOCKS = [2.4, 2.8, 3.2, 10.2, 10.55, 10.9];
export const BEHIND_KNOCK = 11.5;

const knockJolt = (t: number) => DOOR_KNOCKS.reduce((m, k) => Math.max(m, t >= k && t < k + 0.18 ? 1 - (t - k) / 0.18 : 0), 0);

/* S01 + S02 + S04: facing the bedroom door at midnight */
export const DoorScene: React.FC<{t: number; t0: number; close?: boolean; reach?: boolean}> = ({t, t0, close, reach}) => {
  const lt = t - t0;
  const zoom = close ? 1.55 + lt * 0.03 : 1.0 + lt * 0.02;
  const camY = close ? 120 : 0;
  // the adult hand rises toward the ring pull, then freezes and pulls back on the knock from behind
  const up = reach ? prog(t, 9.6, 10.9, easeOut) : 0;
  const recoil = reach ? prog(t, BEHIND_KNOCK, BEHIND_KNOCK + 0.2, easeOut) : 0;
  const pose = lerpPose(lerpPose(POSES.relaxed, POSES.reach, up), POSES.fist, recoil);
  const tremble = reach && t > BEHIND_KNOCK ? 3 : 0;
  return (
    <Camera t={t} zoom={zoom} y={camY} x={close ? 150 : 0} shake={close ? 4 : 6} seed={51}>
      <Stage>
        <DoorWall id="door" t={t} mode="night" knock={knockJolt(t)} under={0.25 + 0.15 * Math.sin(t * 3)} underColor="#9fb4cf">
          {reach && (
            <Hand
              id="reach"
              x={mix(840, 800, up) + noise1(t * 20, 2) * tremble}
              y={mix(2200, 1240, up) + recoil * 200 + noise1(t * 22, 3) * tremble}
              rot={-8}
              scale={1.3}
              style={STYLES.adult}
              pose={pose}
              light={0.8}
            />
          )}
        </DoorWall>
      </Stage>
    </Camera>
  );
};

/* S03: memory — Mother by candlelight, finger to her lips */
export const MemoryScene: React.FC<{t: number}> = ({t}) => {
  const a = 6.42;
  const lean = prog(t, a, a + 1.8);
  const finger = prog(t, a + 1.1, a + 1.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lean * 0.05} shake={3} seed={53}>
        <Stage>
          <Wall id="memwall" x={-200} y={-200} w={1480} h={2400} warm={1} />
          <radialGradient id="memglow" cx="0.15" cy="0.85" r="0.9">
            <stop offset="0" stopColor="#ffa040" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#7a3a12" stopOpacity="0.2" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          <rect x={0} y={0} width={1080} height={1920} fill="url(#memglow)" />
          <ElderProfile x={640} y={800} s={mix(1.45, 1.65, lean)} t={t} finger={finger} lean={lean} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(10px)'}}>
        <Stage>
          <Candle x={170} y={2010} t={t} s={1.6} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S05: whip-turn to the window behind him — a grey hand on the outside of the glass */
export const BehindScene: React.FC<{t: number}> = ({t}) => {
  const a = 11.75;
  const whip = prog(t, a, a + 0.32, easeOut); // 0 = still turning, 1 = settled
  const blur = (1 - whip) * 26;
  const slide = prog(t, a + 0.6, 14.2, (x) => x);
  const curl = prog(t, 12.8, 13.6, easeIn);
  const push = prog(t, a, 14.25, (x) => x);
  return (
    <AbsoluteFill style={{filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
      <Camera t={t} zoom={1.02 + push * 0.22} x={(1 - whip) * 700} rot={(1 - whip) * -6} y={-80 * push} shake={7} seed={57}>
        <Stage>
          <WindowWall
            id="behind"
            t={t}
            mode="night"
            cloudCover={0.6}
            outside={
              <Hand
                id="glass"
                x={WIN.cx - 120}
                y={mix(SILL_Y - 230, SILL_Y - 120, slide)}
                rot={6}
                scale={1.5}
                style={STYLES.creature}
                pose={lerpPose(POSES.flat, POSES.claw, curl)}
                light={0.7}
                showSleeve={false}
              />
            }
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
