import React from 'react';
import {staticFile} from 'remotion';
import rig from '../../../../assets/characters/her/parts/rig.json';

/* "Her": the vampire woman from My Type as a cut-out puppet built from image-generated art (scripts/rig_her.py).
   Every layer is a PNG in master coordinates (1024x1536); joints rotate about pivots read from rig.json. The far arm
   (screen right) is rigged at shoulder and elbow and can swap its hand for one of the eight sheet hands; the head tilts
   about the neck; eyes, brows and mouth are swappable features. */

const P = 'characters/her/parts/';
export type HerEyes = 'open' | 'half' | 'closed' | 'wide' | 'red';
export type HerBrows = 'none' | 'neutral' | 'raised' | 'angry';
export type HerMouth = 'closed' | 'smile' | 'ah' | 'oh' | 'fangs' | 'sad';
export type HerHand = 'master' | 'L_open' | 'L_grip' | 'L_point' | 'L_reach' | 'R_open' | 'R_grip' | 'R_point' | 'R_reach';

type Feat = {w: number; h: number};
const F = rig.features as Record<string, Feat>;
const HANDS = rig.hands as Record<string, {w: number; h: number; wrist: number[]; angle: number}>;
const [CW, CH] = rig.canvas;

const Layer: React.FC<{name: string}> = ({name}) => <image href={staticFile(`${P}${name}.png`)} x={0} y={0} width={CW} height={CH} />;

/** A cropped feature image centred on (cx, cy), scaled by k. */
const Feature: React.FC<{name: string; cx: number; cy: number; k: number; opacity?: number}> = ({name, cx, cy, k, opacity = 1}) => {
  const f = F[name];
  if (!f) return null;
  return <image href={staticFile(`${P}${name}.png`)} x={cx - (f.w * k) / 2} y={cy - (f.h * k) / 2} width={f.w * k} height={f.h * k} opacity={opacity} />;
};

export const Her: React.FC<{
  x: number; // where her feet centre lands
  y: number;
  s?: number; // 1 = master pixels
  t: number;
  headTilt?: number; // degrees, + = clockwise
  shoulder?: number; // far arm, degrees, - = out to the right/up
  elbow?: number;
  wrist?: number;
  hand?: HerHand;
  handScale?: number;
  eyes?: HerEyes;
  brows?: HerBrows;
  mouth?: HerMouth;
  look?: number; // eye shift in px, - = left
  breathe?: number;
}> = ({x, y, s = 1, t, headTilt = 0, shoulder = 0, elbow = 0, wrist = 0, hand = 'master', handScale = 0.44, eyes = 'open', brows = 'none', mouth = 'closed', look = 0, breathe = 1}) => {
  const [hx, hy] = rig.headPivot;
  const [sx, sy] = rig.shoulder;
  const [ex, ey] = rig.elbow;
  const [wx, wy] = rig.wrist;
  const E = rig.eyes, Bw = rig.brows, M = rig.mouth;
  const kFar = E.farW / F.eyes_open_far.w;
  const kNear = E.nearW / F.eyes_open_near.w;
  const kMouth = M.w / F.mouth_closed.w;
  const kBrowFar = Bw.farW / F.brows_neutral_far.w;
  const kBrowNear = Bw.nearW / F.brows_neutral_near.w;
  const br = Math.sin(t * 1.6) * 0.006 * breathe;
  const feetX = 520, feetY = 1470; // master-space point that sits on (x, y)
  const sheet = hand !== 'master' ? HANDS[hand] : null;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) translate(${-feetX},${-feetY})`}>
      {/* far arm, behind the body */}
      <g transform={`rotate(${shoulder},${sx},${sy})`}>
        <Layer name="arm_upper" />
        <g transform={`rotate(${elbow},${ex},${ey})`}>
          <Layer name="arm_fore" />
          {sheet ? (
            <g transform={`translate(${wx},${wy}) rotate(${90 - sheet.angle + wrist}) scale(${handScale}) translate(${-sheet.wrist[0]},${-sheet.wrist[1]})`}>
              <image href={staticFile(`${P}hand_${hand}.png`)} x={0} y={0} width={sheet.w} height={sheet.h} />
            </g>
          ) : (
            <g transform={`rotate(${wrist},${wx},${wy})`}>
              <Layer name="arm_hand" />
            </g>
          )}
        </g>
      </g>
      {/* body breathes from the feet */}
      <g transform={`translate(0,${feetY}) scale(1,${1 + br}) translate(0,${-feetY})`}>
        <Layer name="body" />
        <g transform={`translate(0,${-br * 900}) rotate(${headTilt},${hx},${hy})`}>
          <Layer name="head" />
          <Feature name={`eyes_${eyes}_far`} cx={E.far[0] + look} cy={E.far[1]} k={kFar} />
          <Feature name={`eyes_${eyes}_near`} cx={E.near[0] + look} cy={E.near[1]} k={kNear} />
          {brows !== 'none' && <Feature name={`brows_${brows}_far`} cx={Bw.far[0]} cy={Bw.far[1]} k={kBrowFar} />}
          {brows !== 'none' && <Feature name={`brows_${brows}_near`} cx={Bw.near[0]} cy={Bw.near[1]} k={kBrowNear} />}
          <Feature name={`mouth_${mouth}`} cx={M.at[0]} cy={M.at[1] + (mouth === 'oh' || mouth === 'fangs' ? 3 : 0)} k={kMouth} />
        </g>
        <g transform={`translate(0,${-br * 900})`}>
          <Layer name="collar" />
        </g>
      </g>
    </g>
  );
};
