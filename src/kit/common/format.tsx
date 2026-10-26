import React, {createContext, useContext} from 'react';

/**
 * Frame formats. Shared art draws in plain SVG units and works in both; anything that depends on the frame
 * (Stage, Eyelids, film grain, captions, chapter titles) reads the current format from context.
 * StoryFrame provides it; the default is portrait so older stories behave exactly as before.
 */
export type Format = {
  name: 'portrait' | 'landscape';
  W: number;
  H: number;
  caption: {top: number; width: number; size: number; whisperSize: number};
  textures: string; // folder under assets/textures/
};

export const PORTRAIT: Format = {
  name: 'portrait',
  W: 1080,
  H: 1920,
  caption: {top: 1330, width: 900, size: 78, whisperSize: 70},
  textures: 'textures/portrait',
};

export const LANDSCAPE: Format = {
  name: 'landscape',
  W: 1920,
  H: 1080,
  caption: {top: 872, width: 1500, size: 56, whisperSize: 50},
  textures: 'textures/landscape',
};

const FormatContext = createContext<Format>(PORTRAIT);
export const FormatProvider: React.FC<{format: Format; children: React.ReactNode}> = ({format, children}) => (
  <FormatContext.Provider value={format}>{children}</FormatContext.Provider>
);
export const useFormat = () => useContext(FormatContext);
