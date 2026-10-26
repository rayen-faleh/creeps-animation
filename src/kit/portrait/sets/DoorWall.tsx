import React from 'react';
import {GothicDoor} from '../../common/art/Door';
import {Floor, MoonBeam, Wall} from '../../common/art/Room';
import {Candle} from '../../common/art/Props';

export const DOOR = {cx: 540, yb: 1500, w: 560, h: 1160};

/**
 * Standard door set, standing in a corridor or bedroom facing a door: damask wall, gothic door,
 * floorboards, optional candle sconce on the left and a cold moonbeam from an unseen window on the right.
 */
export const DoorWall: React.FC<{
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
  children?: React.ReactNode; // drawn in front of the door (hands, props on the floor)
}> = ({id, t, mode, open = 0, knock = 0, under = 0, underColor, sconce = mode === 'candle', beam = mode === 'night' ? 1 : 0, beyond, children}) => (
  <g>
    <Wall id={`${id}-wall`} x={-400} y={-600} w={1880} h={2200} warm={mode === 'candle' ? 1 : 0} lit={0.7} />
    <Floor id={`${id}-floor`} x={-400} y={DOOR.yb} w={1880} h={900} lit={0.7} />
    <rect x={-400} y={DOOR.yb - 70} width={1880} height={70} fill="#050608" />
    <GothicDoor
      id={`${id}-door`}
      cx={DOOR.cx}
      yb={DOOR.yb}
      w={DOOR.w}
      h={DOOR.h}
      t={t}
      light={mode}
      open={open}
      knock={knock}
      under={under}
      underColor={underColor}
      beyond={beyond}
    />
    {sconce && (
      <g>
        <rect x={60} y={980} width={120} height={22} fill="#1a120a" />
        <path d="M120,1002 L120,1060 Q120,1080 100,1090" stroke="#1a120a" strokeWidth={10} fill="none" />
        <Candle x={120} y={980} t={t} s={0.7} />
      </g>
    )}
    {beam > 0 && (
      <MoonBeam
        id={`${id}-beam`}
        poly="1180,200 1300,420 640,2000 240,2000"
        t={t}
        opacity={0.06 * beam}
        bounds={[200, 200, 1100, 1800]}
        dust={40}
      />
    )}
    {children}
  </g>
);
