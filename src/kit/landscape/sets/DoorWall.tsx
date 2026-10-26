import React from 'react';
import {GothicDoor} from '../../common/art/Door';
import {Floor, MoonBeam, Wall} from '../../common/art/Room';
import {Candle} from '../../common/art/Props';

/** 16:9 door set: damask wall, gothic door, floorboards, optional sconce, cold beam from an unseen window. */
export const L_DOOR = {cx: 960, yb: 930, w: 420, h: 860};

export const DoorWallL: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'candle';
  open?: number;
  knock?: number;
  under?: number;
  underColor?: string;
  sconce?: boolean;
  beam?: number;
  beyond?: React.ReactNode;
  children?: React.ReactNode;
}> = ({id, t, mode, open = 0, knock = 0, under = 0, underColor, sconce = mode === 'candle', beam = mode === 'night' ? 1 : 0, beyond, children}) => (
  <g>
    <Wall id={`${id}-wall`} x={-500} y={-500} w={2920} h={1500} warm={mode === 'candle' ? 1 : 0} lit={0.7} />
    <Floor id={`${id}-floor`} x={-500} y={L_DOOR.yb} w={2920} h={700} lit={0.7} />
    <rect x={-500} y={L_DOOR.yb - 60} width={2920} height={60} fill="#050608" />
    <GothicDoor id={`${id}-door`} cx={L_DOOR.cx} yb={L_DOOR.yb} w={L_DOOR.w} h={L_DOOR.h} t={t} light={mode} open={open} knock={knock} under={under} underColor={underColor} beyond={beyond} />
    {sconce && (
      <g>
        <rect x={560} y={560} width={110} height={20} fill="#1a120a" />
        <path d="M615,580 L615,632 Q615,650 596,660" stroke="#1a120a" strokeWidth={9} fill="none" />
        <Candle x={615} y={560} t={t} s={0.62} />
      </g>
    )}
    {beam > 0 && <MoonBeam id={`${id}-beam`} poly="1900,40 2050,240 1300,1100 900,1100" t={t} opacity={0.06 * beam} bounds={[900, 40, 1150, 1060]} dust={40} />}
    {children}
  </g>
);
