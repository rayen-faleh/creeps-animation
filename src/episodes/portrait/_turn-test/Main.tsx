import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ClovesFigure} from '../../../kit/rabenfels/art/ClovesCharacters';

/** Review sheet: Safwan's head at eleven turn values, to check the nose through a turn. */
export const META = {id: 'TurnTest', durationSec: 1, format: {W: 2200, H: 500}};
export const Episode: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{background: '#3a3530'}}>
      <svg width={2200} height={500} viewBox="0 0 2200 500">
        {Array.from({length: 11}, (_, i) => (
          <g key={i} transform={`translate(${100 + i * 200},0)`}>
            <ClovesFigure id={`tt${i}`} t={t + 3} kind="safwan" x={0} y={560} s={0.85} turn={i / 10} hand={[-150, -40]} otherHand={[110, -40]} mirror />
            <text x={0} y={480} textAnchor="middle" fontSize={24} fill="#ddd">{(i / 10).toFixed(1)}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
