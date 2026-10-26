import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Flicker, Grain as FilmGrain, Vignette} from '../fx';
import {FPS} from '../util';
import {useStyleFonts} from './fonts';
import {Captions, Timing} from './Captions';

/** 'warm' = memories / candle, 'cold' = the present / moonlight, 'none' = black screens and the title card. */
export type Grade = 'warm' | 'cold' | 'none';

/**
 * Wraps any story in the style's fixed finishing layers:
 * scene -> grade -> flicker -> vignette -> film grain -> black dip -> captions -> audio.
 * Every scene function receives global time t in seconds.
 */
export const StoryFrame: React.FC<{
  sceneAt: (t: number) => React.ReactNode;
  gradeAt: (t: number) => Grade;
  dipAt?: (t: number) => number; // 0..1 black overlay (time jumps, wake-ups)
  timing: Timing;
  redWords?: string[];
  audio?: string; // path under assets/, e.g. 'audio/my-story/mix.wav'
}> = ({sceneAt, gradeAt, dipAt, timing, redWords, audio}) => {
  useStyleFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = gradeAt(t);
  const dip = Math.min(1, Math.max(0, dipAt ? dipAt(t) : 0));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {sceneAt(t)}
      {g !== 'none' && (
        <>
          <AbsoluteFill style={{background: g === 'warm' ? 'rgba(255,140,60,0.05)' : 'rgba(40,70,120,0.08)', mixBlendMode: 'soft-light'}} />
          <Flicker t={t} amount={g === 'warm' ? 0.07 : 0.05} />
          <Vignette strength={g === 'warm' ? 0.75 : 0.85} />
        </>
      )}
      <FilmGrain frame={frame} opacity={g === 'warm' ? 0.2 : 0.15} />
      <AbsoluteFill style={{background: '#000', opacity: dip}} />
      <Captions t={t} timing={timing} redWords={redWords} />
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};

/** A short dip to black centred on time c (seconds), half-width w. */
export const dipAround = (t: number, c: number, w = 0.18) => Math.max(1 - Math.abs(t - c) / w, 0);
/** A hard black hold from a to b (seconds). */
export const holdBlack = (t: number, a: number, b: number) => (t >= a && t < b ? 1 : 0);
