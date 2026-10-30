import {Config} from '@remotion/cli/config';

// Remotion downloads its own headless Chrome on first render.
// If that download is blocked, point REMOTION_BROWSER at a local Chrome / chrome-headless-shell binary.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
  Config.setChromeMode('headless-shell');
}
Config.setConcurrency(2);
