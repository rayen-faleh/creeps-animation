import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera, Stage, Torch} from '../kit/common/fx';
import {LANDSCAPE} from '../kit/common/format';
import {StoryFrame} from '../kit/common/series/StoryFrame';
import {TitleCard} from '../kit/common/series/TitleCard';
import {Timing} from '../kit/common/series/Captions';
import {MoorStreet} from '../kit/common/art/Street';
import {Hand, POSES, STYLES} from '../kit/common/art/Hand';
import {WindowWallL, DoorWallL, L_WIN, L_SILL_Y} from '../kit/landscape';
import {FPS} from '../kit/common/util';

/** 16:9 kit preview: one panel per second. Frame 0: window night; 1: window candle; 2: door; 3: torch + hands; 4: title. */
export const META = {id: 'CatalogLandscape', durationSec: 5, format: LANDSCAPE};

const timing: Timing = {
  unit: 'seconds',
  total: 5,
  lines: [
    {id: 'a', text: 'Gran opened that tap every night.', start: 0, end: 2.9, whisper: false, phrases: [{text: 'Gran opened that tap every night.', start: 0, end: 2.9}]},
    {id: 'b', text: 'A quarter turn.', start: 3.0, end: 4.0, whisper: true, phrases: [{text: 'A quarter turn.', start: 3.0, end: 4.0}]},
  ],
};

const Panel: React.FC<{t: number}> = ({t}) => {
  const i = Math.floor(t);
  if (i === 0 || i === 1)
    return (
      <Camera t={t} shake={0}>
        <Stage>
          <WindowWallL
            id={`cw${i}`}
            t={t}
            mode={i === 0 ? 'night' : 'candle'}
            warm={i}
            outside={<MoorStreet id={`cws${i}`} t={t} light="night" x={L_WIN.cx - 0.6 * 560} y={L_SILL_Y - 0.6 * 1030 + 40} s={0.6} windowsLit={0.1} />}
          />
        </Stage>
      </Camera>
    );
  if (i === 2)
    return (
      <Camera t={t} shake={0}>
        <Stage>
          <DoorWallL id="cd" t={t} mode="candle" under={0.4} />
        </Stage>
      </Camera>
    );
  if (i === 3)
    return (
      <AbsoluteFill>
        <Camera t={t} shake={0}>
          <Stage>
            <WindowWallL id="ct" t={t} mode="night" />
            <Hand id="ch1" x={700} y={1000} rot={8} scale={1.5} style={STYLES.adult} pose={POSES.reach} light={0.8} />
            <Hand id="ch2" x={1240} y={1010} rot={-10} scale={1.5} style={STYLES.wolf} pose={POSES.claw} mirror light={0.8} />
          </Stage>
        </Camera>
        <Torch x={980} y={700} r={520} ambient={0.12} />
      </AbsoluteFill>
    );
  return <TitleCard t={t} t0={3.0} title="The Quarter Turn" subtitle="A GOTHIC POV STORY" />;
};

export const Episode: React.FC = () => {
  useCurrentFrame();
  return (
    <StoryFrame
      format={LANDSCAPE}
      sceneAt={(t) => <Panel t={t} />}
      gradeAt={(t) => (t >= 4 ? 'none' : t >= 1 && t < 2 ? 'warm' : 'cold')}
      timing={timing}
      chapters={[{t: -1, label: 'CHAPTER I', title: 'The Dripping Tap'}]}
    />
  );
};
export const _fps = FPS;
