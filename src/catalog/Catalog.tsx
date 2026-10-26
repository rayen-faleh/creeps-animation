import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera, Eyelids, FilmGrain, Flicker, Stage, Torch, Vignette} from '../kit';
import {WindowWall} from '../kit/sets/WindowWall';
import {DoorWall} from '../kit/sets/DoorWall';
import {Hand, POSES, STYLES} from '../kit/art/Hand';
import {Candle, Clock, Cloth, CupHand, Duvet, ElderProfile, Mirror, Portrait} from '../kit/art/Props';
import {Floor, Grain, Wall, pileOf10, scatter} from '../kit/art/Room';
import {TitleCard} from '../kit/series/TitleCard';
import {Captions, Timing} from '../kit/series/Captions';
import {useStyleFonts} from '../kit/series/fonts';
import {theme} from '../kit/theme';

/** One frame per panel. Render with: node scripts/stills.mjs Catalog 0 0.0334 0.0667 ... or scripts/catalog.sh */
const T = 2.0;

const Label: React.FC<{name: string; note: string}> = ({name, note}) => (
  <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 60}}>
    <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 64, color: '#ece4d2', textShadow: '0 0 16px #000, 0 2px 4px #000'}}>{name}</div>
    <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontStyle: 'italic', fontSize: 40, color: '#a89c8a', textShadow: '0 0 12px #000', marginTop: 6, width: 960, textAlign: 'center'}}>
      {note}
    </div>
  </AbsoluteFill>
);

const Finish: React.FC<{warm?: boolean}> = ({warm}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: warm ? 'rgba(255,140,60,0.05)' : 'rgba(40,70,120,0.08)', mixBlendMode: 'soft-light'}} />
      <Flicker t={T} amount={0.05} />
      <Vignette strength={warm ? 0.75 : 0.85} />
      <FilmGrain frame={frame} opacity={0.15} />
    </>
  );
};

const SAMPLE: Timing = {
  unit: 'seconds',
  total: 4,
  lines: [
    {id: 'a', text: 'And the voice... was mine.', start: 0, end: 3.5, whisper: false, phrases: [{text: 'And the voice... was mine.', start: 0, end: 3.5}]},
  ],
};
const WHISPER: Timing = {
  unit: 'seconds',
  total: 4,
  lines: [{id: 'b', text: 'Four hundred and six.', start: 0, end: 3.5, whisper: true, phrases: [{text: 'Four hundred and six.', start: 0, end: 3.5}]}],
};

const PANELS: Array<{name: string; note: string; warm?: boolean; body: React.ReactNode}> = [
  {name: 'WindowWall · night', note: 'GothicWindow, curtains, sill, moonbeam + dust', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c0" t={T} mode="night" grainsVisible={1} grainLit={0.4} /></g></Stage>},
  {name: 'WindowWall · candle', note: "mode='candle' warm=1 — memories", warm: true, body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c1" t={T} mode="candle" warm={1} grainsVisible={0.6} grainWarm={1} grainLit={1} /></g></Stage>},
  {name: 'WindowWall · dawn', note: 'dawn 0..1 — relief beats only', warm: true, body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c2" t={T} mode="dawn" dawn={0.85} grainsVisible={1} grainWarm={1} grainLit={1} /></g></Stage>},
  {name: 'WindowWall · open', note: 'open, billow, wind, outside={…}', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c3" t={T} mode="night" open={0.8} billow={0.8} wind={3} cloudCover={0.8} /></g></Stage>},
  {name: 'DoorWall · night', note: 'GothicDoor: knock, under-light, keyhole glow', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><DoorWall id="c4" t={T} mode="night" under={0.6} underColor="#ffb45a" /></g></Stage>},
  {
    name: 'DoorWall · candle, ajar',
    note: "open=0.62, sconce, beyond={…} (eyes in the gap)",
    warm: true,
    body: (
      <Stage>
        <g transform="translate(540,1000) scale(0.82) translate(-540,-1000)">
          <DoorWall
            id="c5"
            t={T}
            mode="candle"
            open={0.62}
            beyond={
              <g>
                <ellipse cx={712} cy={980} rx={11} ry={5} fill="#e8f0ff" opacity={0.9} />
                <ellipse cx={762} cy={980} rx={11} ry={5} fill="#e8f0ff" opacity={0.9} />
              </g>
            }
          />
        </g>
      </Stage>
    ),
  },
  {
    name: 'Hand · styles',
    note: 'creature · adult · elder · child',
    body: (
      <Stage>
        <Wall id="c6" x={0} y={0} w={1080} h={1920} />
        <Hand id="h1" x={290} y={900} scale={1.3} style={STYLES.creature} pose={POSES.relaxed} />
        <Hand id="h2" x={790} y={900} scale={1.3} style={STYLES.adult} pose={POSES.relaxed} />
        <Hand id="h3" x={290} y={1650} scale={1.3} style={STYLES.elder} pose={POSES.relaxed} />
        <Hand id="h4" x={790} y={1650} scale={1.3} style={STYLES.child} pose={POSES.relaxed} />
      </Stage>
    ),
  },
  {
    name: 'Hand · poses',
    note: 'flat · relaxed · point · claw · fist · reach',
    body: (
      <Stage>
        <Wall id="c7" x={0} y={0} w={1080} h={1920} />
        {(['flat', 'relaxed', 'point', 'claw', 'fist', 'reach'] as const).map((p, i) => (
          <Hand key={p} id={`p${i}`} x={200 + (i % 3) * 340} y={i < 3 ? 900 : 1600} scale={1.05} style={STYLES.creature} pose={POSES[p]} showSleeve={false} />
        ))}
      </Stage>
    ),
  },
  {
    name: 'Props',
    note: 'Candle · Clock (3:00) · Portrait (mourning ribbon)',
    warm: true,
    body: (
      <Stage>
        <Wall id="c8" x={0} y={0} w={1080} h={1920} warm={0.6} />
        <Portrait x={300} y={760} s={1.6} />
        <Clock x={760} y={820} s={1.2} t={T} />
        <rect x={0} y={1500} width={1080} height={420} fill="#120c08" />
        <Candle x={540} y={1560} t={T} s={1.4} />
      </Stage>
    ),
  },
  {
    name: 'Mirror + Cloth',
    note: 'children = reflection; Cloth pull 0..1',
    body: (
      <Stage>
        <Wall id="c9" x={0} y={0} w={1080} h={1920} />
        <Mirror x={240} y={520} w={600} h={1100} id="cm">
          <rect x={0} y={0} width={600} height={1100} fill="#0b1220" />
        </Mirror>
        <Cloth x={240} y={520} w={600} h={1100} t={T} pull={0.35} grabX={540} id="cc" />
      </Stage>
    ),
  },
  {
    name: 'ElderProfile + CupHand',
    note: 'candle-rimmed profile; hand tipping a tin cup',
    warm: true,
    body: (
      <Stage>
        <Wall id="c10" x={0} y={0} w={1080} h={1920} warm={1} />
        <ElderProfile x={640} y={640} s={1.15} t={T} finger={1} lean={0.3} />
        <CupHand x={380} y={1560} tilt={-36} s={0.75} warm={1} />
      </Stage>
    ),
  },
  {
    name: 'Grains + Duvet',
    note: 'pileOf10 · scatter · glint; child grip on duvet',
    body: (
      <Stage>
        <Floor id="c11" x={0} y={0} w={1080} h={1920} lit={0.9} />
        {[0, 1, 2].map((k) => pileOf10(300 + k * 240, 520, 40 + k, 0.9).map((g, i) => <Grain key={`${k}-${i}`} x={g.x} y={g.y} rot={g.rot} s={2.4} lit={0.9} glint={k === 1 && i === 0 ? 1 : 0} />))}
        {scatter(40, 160, 700, 760, 360, 3).map((g, i) => <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={2.2} lit={0.7} />)}
        <Duvet y={1400} t={T} grip={1} />
      </Stage>
    ),
  },
  {
    name: 'Torch',
    note: 'screen-space light disc after the Camera',
    body: (
      <>
        <Camera t={T} shake={0}>
          <Stage>
            <WindowWall id="c12" t={T} mode="night" />
          </Stage>
        </Camera>
        <Torch x={420} y={980} r={380} ambient={0.12} />
      </>
    ),
  },
  {
    name: 'Eyelids',
    note: 'open 0..1 — waking, blinking',
    body: (
      <>
        <Stage>
          <rect x={0} y={0} width={1080} height={1920} fill="#05070b" />
          <Clock x={540} y={1000} s={1.6} t={T} />
        </Stage>
        <Eyelids open={0.4} />
      </>
    ),
  },
  {
    name: 'Captions',
    note: 'normal + red reveal word · whisper (italic)',
    body: (
      <>
        <Stage>
          <WindowWall id="c14" t={T} mode="night" beam={0.4} />
        </Stage>
        <Captions t={1.5} timing={SAMPLE} redWords={['mine.']} top={1180} />
        <Captions t={1.5} timing={WHISPER} top={1420} />
      </>
    ),
  },
  {name: 'TitleCard', note: 'title + subtitle on black', body: <TitleCard t={4} t0={0} title="Story Title" subtitle="PART I" />},
];

export const META = {id: 'Catalog', durationSec: PANELS.length / 30};

export const Episode: React.FC = () => {
  useStyleFonts();
  const frame = useCurrentFrame();
  const p = PANELS[Math.min(PANELS.length - 1, frame)];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {p.body}
      {p.name !== 'TitleCard' && <Finish warm={p.warm} />}
      <Label name={p.name} note={p.note} />
    </AbsoluteFill>
  );
};

export const PANEL_COUNT = PANELS.length;
