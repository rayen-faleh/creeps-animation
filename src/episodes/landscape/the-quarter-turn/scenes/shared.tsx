import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Eyelids, Stage, Torch} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {Clock, Duvet} from '../../../../kit/common/art/Props';
import {DripSpec} from '../../../../kit/common/art/Kitchen';
import {Phone, PhoneMsg} from '../../../../kit/common/art/Modern';
import {KitchenSinkL, K, SPOUT, WindowWallL, L_SILL_Y} from '../../../../kit/landscape';
import {mix, noise1} from '../../../../kit/common/util';
import {DRIP_T0} from '../beats';

export const ME: HandStyle = STYLES.adult;
export const KIERAN: HandStyle = {...STYLES.adult, skin: '#c8a48a', sleeve: '#1e2a44', cuff: '#d86a1e'};
export const DRIP: DripSpec = {period: 2.0, t0: DRIP_T0};
export const CROSS = {x: K.tapX, y: K.tapY - 252 * K.tapS};

/** The time a drop next lands at or after t (drip motif clock). */
export const nextDrop = (t: number, period = 2.0) => DRIP_T0 + Math.ceil((t - DRIP_T0) / period) * period;

/**
 * Close on the tap: crosshead, spout and the drop's fall all in frame. mode/drip/turn pass through to the set;
 * children draw over the sink (hands); inGlass draws in the window above. tight 0..1 pushes in on the spout.
 */
export const TapMacro: React.FC<{
  t: number;
  t0: number;
  id: string;
  mode: 'night' | 'lamp' | 'day';
  drip?: DripSpec;
  turn?: number;
  tight?: number;
  torch?: boolean;
  children?: React.ReactNode;
  inGlass?: React.ReactNode;
  seed?: number;
  lookUp?: number; // 0..1 tilt up to include the window glass above the tap
}> = ({t, t0, id, mode, drip, turn = 0, tight = 0, torch = mode === 'night', children, inGlass, seed = 401, lookUp = 0}) => {
  const lt = t - t0;
  return (
    <AbsoluteFill>
      <Camera
        t={t}
        zoom={mix(2.5, 3.4, tight) - lookUp * 1.1 + lt * 0.012}
        x={SPOUT.x - 960 - 70 - lookUp * 40}
        y={SPOUT.y - 540 + 30 - lookUp * 260}
        shake={2.5}
        seed={seed}
      >
        <Stage>
          <KitchenSinkL id={id} t={t} mode={mode} drip={drip} turn={turn} inGlass={inGlass}>
            {children}
          </KitchenSinkL>
        </Stage>
      </Camera>
      {torch && <Torch x={1000} y={560 + lookUp * 120} r={660} ambient={0.18} tint="190,210,240" />}
    </AbsoluteFill>
  );
};

/** A hand gripping the crosshead (mirror = coming from the right). */
export const HandOnTap: React.FC<{id: string; style: HandStyle; reach: number; turn: number; tremble?: number; t: number}> = ({id, style, reach, turn, tremble = 0, t}) => {
  const pose = lerpPose(POSES.reach, lerpPose(POSES.relaxed, POSES.fist, 0.55), Math.min(1, Math.max(0, (reach - 0.8) / 0.2)));
  const [wx, wy] = wristFor(CROSS.x + 40, CROSS.y + 6, -58 + turn * 0.25, 1.1, style, pose, true);
  const tr = tremble * noise1(t * 22, 3) * 3;
  return <Hand id={id} x={mix(wx + 380, wx, reach) + tr} y={mix(wy + 420, wy, reach) + tr} rot={-58 + turn * 0.25} scale={1.1} style={style} pose={pose} mirror light={0.9} />;
};

/** Lying in bed: the window, the duvet, a clock on the bedside; eyelids for waking/blinking. */
export const BedView: React.FC<{t: number; t0: number; open?: number; clock?: [number, number]; cover?: number; seed?: number}> = ({t, t0, open = 1, clock, cover = 0.5, seed = 402}) => {
  const lt = t - t0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.12 + lt * 0.01} rot={-7} y={-40} shake={3} seed={seed}>
        <Stage>
          <WindowWallL id={`bv${seed}`} t={t} mode="night" cloudCover={cover} beam={0.6} />
          <g transform="scale(1.55,1)">
            <Duvet y={L_SILL_Y + 120} t={t} grip={0.8} />
          </g>
          {clock && <Clock x={1620} y={L_SILL_Y + 70} s={0.55} t={t} hour={clock[0]} minute={clock[1]} lit={0.6} />}
        </Stage>
      </Camera>
      {open < 0.999 && <Eyelids open={open} />}
    </AbsoluteFill>
  );
};

/** A phone in both hands, landscape framing. */
export const PhoneShot: React.FC<{t: number; t0: number; id: string; from: string; clock: string; msgs: PhoneMsg[]; buzz?: number[]}> = ({t, t0, id, from, clock, msgs, buzz}) => {
  const lt = t - t0;
  return (
    <Camera t={t} zoom={1.0 + lt * 0.03} shake={3} seed={403}>
      <Stage>
        <rect x={-400} y={-400} width={2720} height={1900} fill="#030407" />
        <Phone id={id} t={t} x={790} y={80} s={0.95} from={from} clock={clock} msgs={msgs} buzz={buzz} />
      </Stage>
    </Camera>
  );
};

export const sleeveNow = (style: HandStyle, sleeve: string): HandStyle => ({...style, sleeve});
