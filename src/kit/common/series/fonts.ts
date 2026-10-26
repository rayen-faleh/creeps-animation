import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {theme} from '../theme';

/** Loads the style's three faces before the first frame renders. Call once in each composition. */
export const useStyleFonts = () => {
  const [handle] = useState(() => delayRender('style-fonts'));
  useEffect(() => {
    const faces = [
      new FontFace(theme.fonts.caption, `url(${staticFile('fonts/cormorant-garamond-latin-600-normal.woff2')})`, {weight: '600', style: 'normal'}),
      new FontFace(theme.fonts.caption, `url(${staticFile('fonts/cormorant-garamond-latin-600-italic.woff2')})`, {weight: '600', style: 'italic'}),
      new FontFace(theme.fonts.title, `url(${staticFile('fonts/unifrakturcook-latin-700-normal.woff2')})`, {weight: '700'}),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => document.fonts.add(f));
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};
