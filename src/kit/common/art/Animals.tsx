import React from 'react';
import {lerpColor, noise1} from '../util';

/**
 * A dog in profile (lurcher build), facing right, feet on y = 0 at the origin. Profiles read best at phone size.
 * fear 0..1: head drops, hackles rise, tail tucks, lips peel back. light: rim light from the right.
 */
export const Dog: React.FC<{x: number; y: number; s?: number; t: number; fear?: number; flip?: boolean; light?: number; warm?: number; run?: number; wolf?: boolean}> = ({
  x,
  y,
  s = 1,
  t,
  fear = 0,
  flip = false,
  light = 1,
  warm = 0,
  run = 0,
  wolf = false,
}) => {
  const rim = lerpColor('#9fb4cf', '#ffb45a', warm);
  const head = fear * 26; // head lowers
  const hk = fear * 16; // hackle height
  const breathe = Math.sin(t * (4 + fear * 6)) * 2;
  const tremble = noise1(t * 12, 4) * 2 * fear;
  // legs: a simple gallop cycle when running
  const g = run > 0 ? Math.sin(t * 18) : 0;
  const legF = run * g * 40, legH = -run * g * 40;
  const h = (yy: number) => yy + head; // head points drop with fear
  const body = `M250,${h(-252)} C230,${h(-262)} 205,${h(-270)} 190,${h(-276)} C182,${h(-290)} 174,${h(-300)} 168,${h(-304)}
    L${150 - fear * 30},${h(-372 + fear * 40)} L128,${h(-306)} C118,${h(-296)} 100,-276 70,-256
    C10,-246 -100,-250 -190,-236 C-214,-226 -224,-196 -222,-160
    L${-205 + legH * 0.4},-80 L${-208 + legH},0 L${-176 + legH},0 L${-178 + legH * 0.6},-70 L-156,-140
    C-120,-150 -80,-158 -40,-156 C0,-150 30,-140 52,-128
    L${56 + legF},0 L${88 + legF},0 L90,-120
    C100,-150 112,-180 130,${h(-205)} C150,${h(-225)} 175,${h(-238)} 200,${h(-238)} L246,${h(-240)} C254,${h(-242)} 256,${h(-248)} 250,${h(-252)} Z`;
  const back = `M70,-256 C10,-246 -100,-250 -190,-236`;
  // raised fur along the spine: a ragged ridge (not evenly spaced spikes, which read as a comb)
  const ridgeH = [4, 9, 6, 12, 7, 14, 9, 13, 8, 11, 6, 9, 5, 3];
  const ridge = 'M70,-256 ' + ridgeH.map((v, i) => {
    const px = 62 - i * 17, base = -252 + (i / 13) * 14;
    return `L${px - 6},${base - v * (0.3 + hk / 16) + breathe * 0.3} L${px - 12},${base + 2}`;
  }).join(' ') + ' L-190,-236 L-190,-226 L70,-246 Z';
  // tail: up and out when calm, tucked under when afraid
  const tail = fear > 0.5 || run > 0
    ? 'M-196,-232 C-238,-200 -232,-150 -192,-118'
    : 'M-196,-236 C-240,-250 -270,-290 -280,-330';
  return (
    <g transform={`translate(${x + tremble},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={260} ry={18} fill="#000" opacity={0.5} />
      {/* far legs, a shade lighter so the silhouette keeps four legs */}
      <path d={`M-190,-140 L${-180 - legH},0 L${-152 - legH},0 L-150,-140 Z M70,-120 L${76 - legF},0 L${104 - legF},0 L104,-120 Z`} fill="#141820" />
      <path d={tail} stroke="#07080c" strokeWidth={20} strokeLinecap="round" fill="none" />
      <path d={body} fill="#07080c" />
      {wolf && (
        <g>
          {/* a wolf: heavy ruff round the neck and shoulders, a thick brush of a tail */}
          <path d={`M150,${h(-292)} C110,${h(-250)} 96,-200 70,-150 C40,-170 20,-210 30,-262 C60,-286 110,${h(-306)} 150,${h(-292)} Z`} fill="#07080c" />
          {Array.from({length: 9}, (_, i) => (
            <path key={i} d={`M${136 - i * 12},${h(-286 + i * 14)} l${-26 - (i % 3) * 6},${10 + (i % 2) * 8}`} stroke="#07080c" strokeWidth={9} strokeLinecap="round" />
          ))}
          <path d={`M150,${h(-292)} C110,${h(-250)} 96,-200 70,-150`} stroke={rim} strokeOpacity={0.35 * light} strokeWidth={3} fill="none" />
          <path d={tail} stroke="#07080c" strokeWidth={46} strokeLinecap="round" fill="none" />
        </g>
      )}
      <path d={ridge} fill="#07080c" />
      {/* rim light: back, head and ear, chest, front leg */}
      <path d={fear > 0.2 ? ridge : back} stroke={rim} strokeOpacity={0.45 * light} strokeWidth={3} fill="none" strokeLinejoin="round" />
      <path d={`M128,${h(-306)} L${150 - fear * 30},${h(-372 + fear * 40)} L168,${h(-304)} C174,${h(-300)} 182,${h(-290)} 190,${h(-276)} C205,${h(-270)} 230,${h(-262)} 250,${h(-252)}`} stroke={rim} strokeOpacity={0.6 * light} strokeWidth={4} fill="none" />
      <path d={`M90,-120 C100,-150 112,-180 130,${h(-205)}`} stroke={rim} strokeOpacity={0.35 * light} strokeWidth={3} fill="none" />
      <path d={`M90,-120 L${88 + legF},0`} stroke={rim} strokeOpacity={0.3 * light} strokeWidth={3} fill="none" />
      <path d={`M${150 - fear * 30 - 4},${h(-356 + fear * 40)} L${140},${h(-312)}`} stroke="#2a2420" strokeWidth={6} />
      {/* eye catching the light, bared teeth when afraid */}
      <circle cx={196} cy={h(-266)} r={6} fill={rim} opacity={0.9 * light} />
      <circle cx={198} cy={h(-266)} r={2.5} fill="#000" />
      {fear > 0.3 && (
        <path d={`M206,${h(-240)} l7,-9 l6,9 l7,-9 l6,9 l7,-8 l6,8`} stroke="#e8e2d4" strokeOpacity={Math.min(1, (fear - 0.3) * 2)} strokeWidth={3} fill="none" />
      )}
    </g>
  );
};
